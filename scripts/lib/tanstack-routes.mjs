import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir, files = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.tsx?$/.test(entry) && !entry.endsWith(".gen.ts")) files.push(full);
  }
  return files;
};

export function tanstackRouteFiles(root) {
  return walk(join(root, "src/routes"));
}

export function tanstackRouteIndex(root) {
  const staticRoutes = new Set();
  const dynamicRoutes = [];
  const files = tanstackRouteFiles(root);

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/g)) {
      const route = match[1].replace(/\/$/, "") || "/";
      if (route.includes("$")) {
        const pattern = route
          .split(/(\$[A-Za-z0-9_]+)/g)
          .map((part) => part.startsWith("$") ? "[^/]+" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("");
        dynamicRoutes.push(
          new RegExp(`^${pattern}/?$`),
        );
      } else {
        staticRoutes.add(route);
      }
    }
  }
  return { files, staticRoutes, dynamicRoutes };
}
