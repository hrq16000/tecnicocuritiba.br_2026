// Per-city OG and hero image mapping for /arrumar-pc/:cidade pages.
// Uses Vite's eager glob so we get hashed asset URLs without 40+ explicit imports.

const ogModules = import.meta.glob("../../assets/og-arrumar-pc-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// Hero variants: hero-arrumar-pc-<slug>.jpg (original) and
// hero-arrumar-pc-<slug>-<width>.{webp,jpg} (responsive variants)
const heroJpgModules = import.meta.glob("../../assets/hero-arrumar-pc-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const heroWebpModules = import.meta.glob("../../assets/hero-arrumar-pc-*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function fileName(p: string) {
  return p.split("/").pop() ?? "";
}

const ogBySlug: Record<string, string> = {};
for (const [p, url] of Object.entries(ogModules)) {
  const slug = fileName(p).replace("og-arrumar-pc-", "").replace(/\.jpg$/, "");
  if (slug) ogBySlug[slug] = url;
}

export type HeroImageSet = {
  src: string; // fallback (largest jpg)
  jpgSrcset: string;
  webpSrcset: string;
  sizes: string;
  width: number;
  height: number;
  preloadHref: string; // mobile-sized webp for LCP preload
  preloadType: string;
};

const WIDTHS = [768, 1280, 1536] as const;

const heroBySlug: Record<string, HeroImageSet> = {};
const heroFallbackJpg: Record<string, string> = {};

for (const [p, url] of Object.entries(heroJpgModules)) {
  const name = fileName(p).replace(/\.jpg$/, "");
  // Skip width-suffixed variants here; only keep the base original
  if (/-(\d+)$/.test(name)) continue;
  const slug = name.replace("hero-arrumar-pc-", "");
  if (slug) heroFallbackJpg[slug] = url;
}

function pickVariant(
  modules: Record<string, string>,
  slug: string,
  width: number,
  ext: "jpg" | "webp",
): string | undefined {
  const key = Object.keys(modules).find((p) =>
    fileName(p) === `hero-arrumar-pc-${slug}-${width}.${ext}`,
  );
  return key ? modules[key] : undefined;
}

for (const slug of Object.keys(heroFallbackJpg)) {
  const jpgs: string[] = [];
  const webps: string[] = [];
  let largestJpg = heroFallbackJpg[slug];
  for (const w of WIDTHS) {
    const j = pickVariant(heroJpgModules, slug, w, "jpg");
    const wp = pickVariant(heroWebpModules, slug, w, "webp");
    if (j) {
      jpgs.push(`${j} ${w}w`);
      largestJpg = j;
    }
    if (wp) webps.push(`${wp} ${w}w`);
  }
  const preload = pickVariant(heroWebpModules, slug, 768, "webp")
    ?? pickVariant(heroJpgModules, slug, 768, "jpg")
    ?? largestJpg;

  heroBySlug[slug] = {
    src: largestJpg,
    jpgSrcset: jpgs.join(", "),
    webpSrcset: webps.join(", "),
    sizes: "(max-width: 768px) 92vw, (max-width: 1280px) 80vw, 768px",
    width: 1536,
    height: 768,
    preloadHref: preload,
    preloadType: preload.endsWith(".webp") ? "image/webp" : "image/jpeg",
  };
}

import ogFallback from "@/assets/og-arrumar-pc-brasil.jpg";

export function getCityOgImage(slug: string): string {
  return ogBySlug[slug] ?? ogFallback;
}

export function getCityHeroImage(slug: string): HeroImageSet | undefined {
  return heroBySlug[slug];
}
