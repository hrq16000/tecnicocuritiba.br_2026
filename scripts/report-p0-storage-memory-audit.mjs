#!/usr/bin/env node
// Auditoria temática inicial do acervo auxiliar. É relatório, não conteúdo público.
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const files = ["src/data/blogPostsContent.tsx", "src/data/blogProgrammaticPosts.tsx"];
const topics = {
  recuperacao_dados: /recupera[cç][aã]o|arquivos apagados|dados inacessíveis|hd defeituoso/i,
  ssd_hdd: /\bssd\b|\bhdd\b|\bhd\b|armazenamento|disco/i,
  memoria_ram: /\bram\b|mem[oó]ria/i,
  computador_lento: /computador lento|pc lento|notebook lento|lentid[aã]o/i,
  travamentos: /travando|travamento|reiniciando|tela azul/i,
  windows: /windows.*(n[aã]o inicia|formata|sistema)|formata[cç][aã]o/i,
  backup: /backup|c[oó]pia de seguran[cç]a|sincroniza[cç][aã]o/i,
};
const outOfCore = /cftv|c[aâ]mera|celular|android|smart.?tv|impressora|linux|docker|chatgpt|intelig[eê]ncia artificial/i;
const risk = /\b(?:99|100)%|\b(?:5x|10x)|garant(?:e|ido|ida)|taxa de recupera[cç][aã]o/i;
const duplicateSignals = /como instalar windows 11 do zero 2026|pc muito lento|notebook superaquecendo solu[cç][oõ]es/i;

const records = [];
for (const file of files) {
  const source = await fs.readFile(path.join(ROOT, file), "utf8");
  const blocks = [...source.matchAll(/(?:^|\n)\s*["']?([a-z0-9-]{8,})["']?\s*:\s*\{([\s\S]*?)(?=\n\s*["']?[a-z0-9-]{8,}["']?\s*:\s*\{|\n\s*\};)/g)];
  for (const match of blocks) {
    const slug = match[1];
    const body = match[2];
    const title = body.match(/title:\s*["'`]([^"'`]+)["'`]/)?.[1] ?? slug;
    const matchedTopics = Object.entries(topics).filter(([, re]) => re.test(`${slug} ${title} ${body}`)).map(([key]) => key);
    if (!matchedTopics.length) continue;
    let classification = "COMPLEMENTAR";
    if (outOfCore.test(`${slug} ${title}`)) classification = "OUT_OF_CORE";
    else if (risk.test(body)) classification = "CONFLITANTE";
    else if (duplicateSignals.test(slug)) classification = "DUPLICADO";
    else if (body.length < 500) classification = "SUPERFICIAL";
    else if (/diagn[oó]stico|causa|segur|preserv|n[aã]o recomendamos/i.test(body)) classification = "REUTILIZAVEL";
    records.push({ slug, title, source: file, topics: matchedTopics, classification, bodyChars: body.length });
  }
}

const unique = [...new Map(records.map((r) => [r.slug, r])).values()];
const counts = Object.fromEntries([...new Set(unique.flatMap((r) => r.topics))].map((topic) => [topic, unique.filter((r) => r.topics.includes(topic)).length]));
const classifications = Object.fromEntries([...new Set(unique.map((r) => r.classification))].map((c) => [c, unique.filter((r) => r.classification === c).length]));
const output = { status: "staging_only", method: "heuristic_first_pass", total_related_articles: unique.length, topic_counts: counts, classification_counts: classifications, records: unique };
await fs.mkdir(path.join(ROOT, "reports"), { recursive: true });
await fs.writeFile(path.join(ROOT, "reports/p0-storage-memory-article-audit.json"), JSON.stringify(output, null, 2) + "\n");
console.log(`✔ Auditoria P0.2: ${unique.length} artigos relacionados classificados; ${Object.entries(classifications).map(([k, v]) => `${k}=${v}`).join(", ")}`);
