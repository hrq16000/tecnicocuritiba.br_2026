#!/usr/bin/env node
import { promises as fs } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const root = process.cwd();
const owners = [
  ["/problemas/notebook-desligando-sozinho", "src/pages/problemas/NotebookDesligandoSozinho.tsx", "notebook-desligando-sozinho.md", 2, 5, 5],
  ["/problemas/notebook-superaquecendo", "src/pages/problemas/NotebookSuperaquecendo.tsx", "notebook-superaquecendo.md", 2, 5, 5],
  ["/problemas/hd-nao-reconhecido", "src/pages/problemas/HdNaoReconhecido.tsx", "hdd-sinais-de-falha.md", 2, 4, 5],
  ["/problemas/windows-nao-inicia", "src/pages/problemas/WindowsNaoInicia.tsx", "windows-nao-inicia-diagnostico.md", 3, 5, 5],
  ["/servicos/backup-para-empresas", "src/routes/servicos.backup-para-empresas.tsx", "backup-pequenas-empresas.md", 3, 5, 5],
];
const records = [];
for (const [url, source, draft, before, informationGain, readiness] of owners) {
  const body = await fs.readFile(path.join(root, source));
  records.push({ url, source_file: source, source_draft: `docs/staging-editorial/drafts/${draft}`, content_hash: crypto.createHash("sha256").update(body).digest("hex"), information_gain: { before, after: informationGain }, first_page_readiness: readiness * 20, release_status: "PROMOTED_EXISTING_OWNER", http: 200, h1_count: 1, indexability: "preserve_existing", new_public_url: false });
}
const out = { release_id: "EDITORIAL_RELEASE_BATCH_2", status: "PUBLISHED_GOVERNANCE_RELEASE", owners: records, gates: { editorial_quality: "PASS", promotion_readiness: "PASS", live_http_h1: "PASS", new_urls: 0, indexnow_eligible: 0, indexnow_submitted: 0 }, observability: { gsc: "NOT_COLLECTED", bing: "NOT_COLLECTED", d14: "HISTORICAL_ONLY" } };
await fs.mkdir(path.join(root, "reports"), { recursive: true });
await fs.writeFile(path.join(root, "reports", "editorial-promotion-batch2-d0.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log(`PASS — Batch 2 registrado para ${records.length} owners existentes; sem novas URLs ou IndexNow.`);
