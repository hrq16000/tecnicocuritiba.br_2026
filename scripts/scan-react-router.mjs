#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const IGNORED_DIRS = new Set(['.git','node_modules','dist','.vite','.cache']);
const EXTENSIONS = new Set(['.ts','.tsx','.js','.jsx','.mjs','.cjs']);

const patterns = [
  /react-router-dom/g,
  /react-router/g,
  /router-compat/g,
  /useNavigate\(/g,
  /useParams\(/g,
  /useSearchParams\(/g,
  /<Link\b/g,
  /<NavLink\b/g,
  /<Outlet\b/g,
  /<Navigate\b/g,
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    if (IGNORED_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      results.push(...(await walk(full)));
    } else if (e.isFile()) {
      if (EXTENSIONS.has(path.extname(e.name))) results.push(full);
    }
  }
  return results;
}

async function scan() {
  const files = await walk(ROOT);
  const matches = {};
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      for (const regex of patterns) {
        const m = content.match(regex);
        if (m && m.length > 0) {
          if (!matches[file]) matches[file] = new Set();
          matches[file].add(regex.source);
        }
      }
    } catch (err) {
      // ignore
    }
  }

  const out = Object.entries(matches).map(([k, v]) => ({ file: k, patterns: Array.from(v) }));
  if (out.length === 0) {
    console.log('No legacy react-router usages found.');
    process.exit(0);
  }
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

scan().catch((err) => { console.error(err); process.exit(2); });
