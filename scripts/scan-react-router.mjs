#!/usr/bin/env node
// scripts/scan-react-router.mjs
// Scans the src directory for common React Router imports/usages.

import fs from 'fs/promises';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src');
const patterns = [
  'react-router-dom',
  'react-router',
  'BrowserRouter',
  'Routes',
  'Route',
  'useNavigate(',
  'useParams(',
  "<Link",
  "NavLink",
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const res = path.resolve(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await walk(res)));
    } else if (/\.(js|ts|jsx|tsx|mjs)$/.test(e.name)) {
      files.push(res);
    }
  }
  return files;
}

async function main() {
  try {
    const exists = await fs.stat(ROOT).then(() => true).catch(() => false);
    if (!exists) {
      console.error('src directory not found.');
      process.exit(2);
    }
    const files = await walk(ROOT);
    let found = 0;
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const hits = patterns.filter((p) => content.includes(p));
      if (hits.length) {
        found++;
        console.log(file + ':');
        for (const h of hits) console.log('  contains ->', h);
        console.log('');
      }
    }
    if (found === 0) console.log('No React Router legacy usages found.');
    else console.log(`Found ${found} files with potential legacy usages.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
