#!/usr/bin/env node
import { promises as fs } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const root = process.cwd();
const override = JSON.parse(await fs.readFile(path.join(root, "reports", "editorial-governance-override.json"), "utf8"));
if (override.authorized !== true || override.maxOwners !== 5) throw new Error("Governance override inválido ou fora do escopo de 5 owners.");

const owners = [
  ["/problemas/computador-lento", "src/pages/problemas/ComputadorLento.tsx", "computador-lento.md"],
  ["/problemas/wifi-caindo-toda-hora", "src/pages/problemas/WifiCaindoTodaHora.tsx", "wifi-caindo.md"],
  ["/servicos/upgrade-ssd-ram", "src/routes/servicos.upgrade-ssd-ram.tsx", "upgrade-ssd-ram.md"],
  ["/servicos/manutencao-de-computador", "src/routes/servicos.manutencao-de-computador.tsx", "manutencao-preventiva-o-que-faz-sentido.md"],
  ["/empresas", "src/pages/Empresas.tsx", "triagem-ti-pequena-empresa.md"],
];
const records = [];
for (const [url, source, draft] of owners) {
  const body = await fs.readFile(path.join(root, source));
  records.push({ url, source_file: source, source_draft: `docs/staging-editorial/drafts/${draft}`, content_hash: crypto.createHash("sha256").update(body).digest("hex"), release_status: "PROMOTED_EXISTING_OWNER", d14: "HISTORICAL_ONLY", gsc: "NOT_COLLECTED", bing: "NOT_COLLECTED", public_url_changed_by_release: false });
}
const out = { release_id: "EDITORIAL_RELEASE_BATCH_1", status: "PUBLISHED_GOVERNANCE_RELEASE", authorized_by: override.authorizationSource, authorized_at: new Date().toISOString(), owners: records, historical_experiment: { d14: "PRESERVED_AND_NON_BLOCKING", gsc: "PRESERVED_AND_NOT_INVENTED", bing: "PRESERVED_AND_NOT_INVENTED" }, indexnow: { eligible: 0, submitted: 0, reason: "owner content already present; no new public URL diff in this release" } };
await fs.writeFile(path.join(root, "reports", "editorial-promotion-d0.json"), `${JSON.stringify(out, null, 2)}\n`);
await fs.writeFile(path.join(root, "reports", "editorial-release-batch-1.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log(`PASS — release editorial Batch 1 registrado para ${records.length} owners; D14/GSC/Bing preservados como histórico e não utilizados como veto.`);
