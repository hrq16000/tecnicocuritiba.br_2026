import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ORIGINAL = /^hero-arrumar-pc-(.+)\.jpg$/;
const RESPONSIVE = /^hero-arrumar-pc-(.+)-(\d{3,4})\.webp$/;
const DERIVATIVE_JPG = /-\d{3,4}\.jpg$/;
export const DEFAULT_WIDTHS = [768, 1280, 1536];
export const DEFAULT_MAX_BYTES = 220 * 1024;

/**
 * Read-only gate for committed responsive assets. Never generates or edits files.
 * Throws if an original or any expected WebP is missing, empty, malformed,
 * too large, badly resized, or if a WebP has no original.
 */
export async function checkPhotoVariants({
  directory,
  widths = DEFAULT_WIDTHS,
  maxBytes = DEFAULT_MAX_BYTES,
} = {}) {
  if (typeof directory !== "string" || !directory) throw new Error("directory obrigatório");
  if (!Array.isArray(widths) || widths.length === 0 || widths.some((w) => !Number.isInteger(w) || w <= 0)) {
    throw new Error("widths inválidos");
  }
  if (!Number.isInteger(maxBytes) || maxBytes <= 0) throw new Error("maxBytes inválido");

  const entries = await readdir(directory);
  const originals = entries
    .filter((name) => ORIGINAL.test(name) && !DERIVATIVE_JPG.test(name))
    .sort();
  if (originals.length === 0) throw new Error("nenhum original hero-arrumar-pc-*.jpg encontrado");

  const slugs = new Set(originals.map((name) => ORIGINAL.exec(name)[1]));
  const failures = [];
  let validated = 0;

  for (const name of originals) {
    const originalPath = path.join(directory, name);
    let original;
    try {
      const info = await stat(originalPath);
      if (info.size === 0) throw new Error("arquivo vazio");
      original = await sharp(originalPath).metadata();
      if (original.width <= 0 || original.height <= 0) throw new Error("dimensões inválidas");
      await sharp(originalPath).stats(); // decode entire original, not just header
    } catch (error) {
      failures.push(name + ": original inválido (" + error.message + ")");
      continue;
    }
    const slug = ORIGINAL.exec(name)[1];
    for (const width of widths) {
      const variant = "hero-arrumar-pc-" + slug + "-" + width + ".webp";
      const variantPath = path.join(directory, variant);
      try {
        const info = await stat(variantPath);
        if (info.size === 0) throw new Error("arquivo vazio");
        if (info.size > maxBytes) {
          throw new Error(info.size + " bytes excede teto " + maxBytes + " bytes");
        }
        const image = sharp(variantPath);
        const meta = await image.metadata();
        if (meta.format !== "webp" || !meta.width || !meta.height) {
          throw new Error("WebP ou dimensões inválidas");
        }
        const expected = Math.min(original.width, width);
        if (meta.width > width || meta.width < Math.floor(expected * 0.75)) {
          throw new Error("largura inesperada " + meta.width + " para alvo " + width);
        }
        if (Math.abs(meta.width / meta.height - original.width / original.height) > 0.04) {
          throw new Error("proporção divergente do original");
        }
        await image.stats(); // catches truncated/corrupted payloads
        validated++;
      } catch (error) {
        failures.push(variant + ": " + (error.code === "ENOENT" ? "ausente" : error.message));
      }
    }
  }

  // An orphaned variant indicates an original silently removed from the repo.
  for (const name of entries) {
    const match = RESPONSIVE.exec(name);
    if (match && widths.includes(Number(match[2])) && !slugs.has(match[1])) {
      failures.push(name + ": variante órfã, original ausente");
    }
  }

  if (failures.length) {
    throw new Error("Gate WebP reprovado:\n  - " + failures.join("\n  - "));
  }

  return { originals: originals.length, variants: validated, widths, maxBytes };
}
