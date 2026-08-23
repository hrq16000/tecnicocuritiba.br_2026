/**
 * Head SSR-first por rota (title, description, canonical, OpenGraph e JSON-LD).
 *
 * Motivação: os componentes `PageSEO`/`*JsonLd` só rodam no cliente (useEffect),
 * então crawlers sem JS (e o HTML prerenderizado) ficavam com o head da raiz.
 * Aqui o mesmo conteúdo é emitido no servidor, via `head()` das rotas.
 *
 * Os `<script type="application/ld+json">` levam `data-schema-key` +
 * `data-static-jsonld="1"`, exatamente o contrato que `src/lib/jsonLdSlots.ts`
 * usa para ADOTAR o nó estático na hidratação (sem duplicar entidades).
 */
import { buildLocalBusinessSchema } from "@/lib/localBusinessJsonLd";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export interface RouteFaq {
  question: string;
  answer: string;
}

export interface RouteHeadInput {
  path: string;
  title: string;
  description: string;
  faq?: RouteFaq[];
  /** Desliga o LocalBusiness estático (rotas institucionais/editoriais). */
  localBusiness?: boolean;
  ogImage?: string;
  ogType?: "website" | "article";
  /** Bloqueia indexação (usado pelo gate de prova visual real). */
  noindex?: boolean;
}

const jsonLd = (key: string, schema: unknown) => ({
  type: "application/ld+json",
  "data-schema-key": key,
  "data-static-jsonld": "1",
  children: JSON.stringify(schema),
});

/** Título curto (sem sufixo de marca) para nomes de entidade. */
const shortTitle = (title: string) => title.split(/\s[|—–]\s/)[0].trim();

const SEGMENT_LABELS: Record<string, string> = {
  servicos: "Serviços",
  bairros: "Bairros",
  problemas: "Problemas",
  blog: "Blog",
  precos: "Preços",
  empresas: "Empresas",
};

const prettify = (slug: string) =>
  slug
    .split("-")
    .map((w) => (w.length <= 2 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

interface Crumb {
  name: string;
  path: string;
}

/** Trilha derivada do path real (Home > seções > página atual). */
function buildBreadcrumbs(path: string, title: string): Crumb[] {
  const segments = path.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ name: "Início", path: "/" }];
  let acc = "";
  segments.forEach((seg, i) => {
    acc += `/${seg}`;
    const isLast = i === segments.length - 1;
    crumbs.push({
      name: isLast ? shortTitle(title) : (SEGMENT_LABELS[seg] ?? prettify(seg)),
      path: acc,
    });
  });
  return crumbs;
}


export function seoHead({
  path,
  title,
  description,
  faq,
  localBusiness = true,
  ogImage = siteConfig.defaultOgImage,
  ogType = "website",
  noindex = false,
}: RouteHeadInput) {
  const url = absoluteUrl(path);

  const scripts: Array<Record<string, unknown>> = [];

  if (localBusiness) {
    scripts.push(
      jsonLd("local-business", buildLocalBusinessSchema({ path, description })),
    );
  }

  if (faq?.length) {
    scripts.push(
      jsonLd("faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }),
    );
  }

  // BreadcrumbList — derivado do próprio path (dados reais da árvore de URLs).
  const crumbs = buildBreadcrumbs(path, title);
  if (crumbs.length > 1) {
    scripts.push(
      jsonLd("breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: absoluteUrl(c.path),
        })),
      }),
    );
  }

  // Service — apenas em rotas de serviço; sem preço inventado (o componente
  // client-side sobrescreve o slot com a oferta real quando existir).
  if (path.startsWith("/servicos/")) {
    scripts.push(
      jsonLd("service", {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${url}#service`,
        name: shortTitle(title),
        description,
        category: "Assistência Técnica de Informática",
        serviceType: shortTitle(title),
        url,
        provider: { "@id": `${siteConfig.baseUrl}/#organization` },
        areaServed: siteConfig.serviceArea.map((name) => ({ "@type": "City", name })),
      }),
    );
  }

  // Article — artigos editoriais aprovados (ogType article em /blog/*).
  if (ogType === "article" && path.startsWith("/blog/") && !noindex) {
    scripts.push(
      jsonLd("article", {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: shortTitle(title),
        description,
        inLanguage: "pt-BR",
        mainEntityOfPage: url,
        image: ogImage,
        author: { "@id": `${siteConfig.baseUrl}/#organization` },
        publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
      }),
    );
  }


  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: url },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      { name: "robots", content: noindex ? "noindex, follow" : "index, follow" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}
