#!/usr/bin/env node
import { resolve } from "node:path";
import { checkPhotoVariants } from "./lib/photo-variants.mjs";

try {
  const result = await checkPhotoVariants({ directory: resolve("src/assets") });
  console.log(
    "[photo-variants] PASS: " + result.originals + " originais / " +
    result.variants + " WebP, larguras " + result.widths.join(", ") +
    ", limite " + Math.round(result.maxBytes / 1024) + " KB",
  );
} catch (error) {
  console.error("[photo-variants] FAIL: " + error.message);
  process.exitCode = 1;
}
