import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, unlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { checkPhotoVariants } from "./photo-variants.mjs";

const widths = [32, 48, 64];
async function fixture(t) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "photo-variants-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const src = sharp({ create: { width: 128, height: 96, channels: 3, background: "#aabbcc" } });
  await writeFile(path.join(dir, "hero-arrumar-pc-curitiba.jpg"), await src.clone().jpeg().toBuffer());
  for (const width of widths) {
    await writeFile(
      path.join(dir, "hero-arrumar-pc-curitiba-" + width + ".webp"),
      await src.clone().resize({ width }).webp().toBuffer(),
    );
  }
  return dir;
}

test("aprova originais e WebP válidos sem alterar arquivos", async (t) => {
  const directory = await fixture(t);
  const result = await checkPhotoVariants({ directory, widths });
  assert.deepEqual([result.originals, result.variants], [1, 3]);
});
test("bloqueia variante ausente", async (t) => {
  const directory = await fixture(t);
  await unlink(path.join(directory, "hero-arrumar-pc-curitiba-48.webp"));
  await assert.rejects(checkPhotoVariants({ directory, widths }), /ausente/);
});
test("bloqueia WebP malformado", async (t) => {
  const directory = await fixture(t);
  await writeFile(path.join(directory, "hero-arrumar-pc-curitiba-48.webp"), "corrupted");
  await assert.rejects(checkPhotoVariants({ directory, widths }), /WebP|format|input|corrupted|unsupported/i);
});
test("bloqueia arquivo acima do limite", async (t) => {
  const directory = await fixture(t);
  await assert.rejects(checkPhotoVariants({ directory, widths, maxBytes: 10 }), /excede teto/);
});
test("bloqueia origem removida com variantes órfãs", async (t) => {
  const directory = await fixture(t);
  await unlink(path.join(directory, "hero-arrumar-pc-curitiba.jpg"));
  await assert.rejects(checkPhotoVariants({ directory, widths }), /nenhum original/);
});
test("bloqueia ausência de fonte mesmo sem variantes", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "photo-variants-empty-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await assert.rejects(checkPhotoVariants({ directory, widths }), /nenhum original/);
});
