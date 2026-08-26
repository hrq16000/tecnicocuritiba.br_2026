#!/usr/bin/env node
import { promises as fs } from 'node:fs';
const dry=process.argv.includes('--dry-run');
if(!dry){console.error('FAIL-CLOSED: use --dry-run; promoção real exige D14 selado e autorização.');process.exit(1);}
const score=JSON.parse(await fs.readFile('reports/promotion-candidate-scorecard.json','utf8'));
const owners=score.candidates.slice(0,5);
const lines=['# Editorial Canary 1 — dry-run','',`Experiment: EDITORIAL_CANARY_1`,`Owners: ${owners.length}`,`D14: ${score.d14_status}`,'','| Owner | Current hash | Planned hash | Patch hash | Sections | Schema | Meta | IndexNow |','| --- | --- | --- | --- | ---: | --- | --- | --- |'];
for(const c of owners) lines.push(`| ${c.owner} | pending live snapshot | pending patch | pending frozen patch | ${c.sections} | 0 | 0 | eligible only after promotion |`);
lines.push('','PUBLIC_FILES_WRITTEN: 0','LASTMOD_UPDATED: 0','INDEXNOW_SUBMITTED: 0','GATES: editorial quality, technical review, SSR/schema, graph, build, live validation','DECISION: WAITING_FOR_D14');
await fs.writeFile('reports/editorial-canary-dry-run.md',lines.join('\n')+'\n');
console.log('PASS — dry-run gerado; nenhum arquivo público alterado.');
