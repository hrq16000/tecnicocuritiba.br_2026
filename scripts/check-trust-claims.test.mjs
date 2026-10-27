import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scripts = path.dirname(fileURLToPath(import.meta.url));

function scan(source, allowlist) {
  const fixture = mkdtempSync(path.join(tmpdir(), "trust-claims-"));
  try {
    mkdirSync(path.join(fixture, "scripts/lib"), { recursive: true });
    mkdirSync(path.join(fixture, "src/pages"), { recursive: true });
    copyFileSync(path.join(scripts, "check-trust-claims.mjs"), path.join(fixture, "scripts/check-trust-claims.mjs"));
    copyFileSync(path.join(scripts, "lib/trust-claims-context.mjs"), path.join(fixture, "scripts/lib/trust-claims-context.mjs"));
    writeFileSync(path.join(fixture, "src/pages/Example.tsx"), source);
    if (allowlist) writeFileSync(path.join(fixture, "scripts/trust-claims-allowlist.json"), JSON.stringify(allowlist));
    const result = spawnSync(process.execPath, [path.join(fixture, "scripts/check-trust-claims.mjs"), "--json"], {
      cwd: fixture, encoding: "utf8",
    });
    assert.ifError(result.error);
    return { status: result.status, ...JSON.parse(result.stdout) };
  } finally {
    const resolved = path.resolve(fixture);
    const temp = path.resolve(tmpdir()) + path.sep;
    assert.ok(resolved.startsWith(temp), "fixture deve ficar dentro do diretório temporário");
    rmSync(resolved, { recursive: true, force: true });
  }
}

test("aceita negativas explícitas, FAQ sem promessa e nomenclatura técnica", () => {
  const result = scan([
    'O que não prometemos: recuperação garantida de disco com dano mecânico.',
    'não vendemos garantia total onde ela não existe.',
    'titulo: "Como a rotina é definida sem inventar SLA",',
    '"Não publicamos SLA fixo porque ele mudaria conforme o parque."',
    '{ value: "resina", label: "Resina (SLA/DLP/LCD)" },',
    '{ question: "Vocês atendem no Hauer no mesmo dia?", answer: "Depende da agenda." },',
    '  "question": "Vocês atendem no Hauer no mesmo dia?",',
    '"Não há um prazo exato, mas a diferença entre encaminhar no mesmo dia e esperar uma semana."',
  ].join("\n"));
  assert.equal(result.status, 0);
  assert.equal(result.total, 0);
});

test("continua recusando promessas comerciais e métricas inventadas", () => {
  const result = scan([
    'Garantimos recuperação garantida.',
    'Oferecemos garantia total.',
    'Atendimento com SLA fixo.',
    'Atendimento no mesmo dia.',
    'nota média 4,9 estrelas',
    'R$ 100/mês',
    'WhatsApp 5541999999999',
  ].join("\n"));
  assert.equal(result.status, 1);
  for (const rule of ["recuperacao-garantida", "garantia-total", "sla", "mesmo-dia", "rating-hardcoded", "plano-mensal", "whatsapp-divergente"]) {
    assert.ok(result.findings.some((finding) => finding.rule === rule), rule);
  }
});

test("negativa ou pergunta não esconde uma promessa posterior na mesma linha", () => {
  for (const source of [
    'O que não prometemos: recuperação garantida. Mas oferecemos recuperação garantida.',
    'não vendemos garantia total. Oferta nova: garantia total.',
    'Não publicamos SLA fixo. Para você oferecemos SLA.',
    '{ question: "Atendem no mesmo dia?", answer: "Sim, no mesmo dia." }',
  ]) {
    const result = scan(source);
    assert.equal(result.status, 1, source);
    assert.equal(result.total, 1, source);
  }
});

test("uma negativa sobre assunto diferente não libera promessa", () => {
  const result = scan('Não cobramos a triagem e oferecemos recuperação garantida no mesmo dia.');
  assert.equal(result.status, 1);
  assert.equal(result.total, 2);
});

test("exceção existente usa caminho portátil e continua limitada à regra", () => {
  const result = scan('Atendimento com SLA. Oferecemos garantia total.', {
    exceptions: [{ file: "src/pages/Example.tsx", rule: "sla", why: "Fixture de escopo." }],
  });
  assert.equal(result.status, 1);
  assert.deepEqual(result.findings.map((f) => f.rule), ["garantia-total"]);
});
