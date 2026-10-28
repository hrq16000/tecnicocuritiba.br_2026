import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { problemaArticlesPlugin } from "./scripts/generate-problema-articles.mjs";

export default defineConfig({
  plugins: [problemaArticlesPlugin(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "scripts/**", "node_modules/**", "dist/**"],
    testTimeout: 15_000,
  },
});
