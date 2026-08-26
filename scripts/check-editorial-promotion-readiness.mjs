#!/usr/bin/env node
import { promises as fs } from 'node:fs';
const root=process.cwd(); const plan=JSON.parse(await fs.readFile('reports/editorial-promotion-plan.json','utf8')); const inv=JSON.parse(await fs.readFile('reports/editorial-master-inventory.json','utf8'));
const failures=[]; const allowed=['/empresas','/servicos/backup-para-empresas','/servicos/redes-e-wifi','/servicos/upgrade-ssd-ram','/servicos/manutencao-de-computador','/problemas/windows-nao-inicia'];
for(const d of plan.drafts||[]) { if(!allowed.includes(d.target_owner)) failures.push(`${d.draft}: owner inexistente`); if(d.state!=='NEEDS_REVIEW') failures.push(`${d.draft}: não está em revisão humana`); }
if(inv.draft_count!==37) failures.push(`inventário esperado 37, encontrado ${inv.draft_count}`);
if(failures.length){console.error('FALHA — promotion readiness'); failures.forEach(x=>console.error('- '+x)); process.exit(1);} console.log(`PASS — ${plan.drafts?.length||0} candidatos com owner e revisão definidos; promoção ainda bloqueada.`);
