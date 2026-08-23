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
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/organizationJsonLd";
import { HOME_FAQS, HOME_SERVICES } from "@/lib/home/homeContent";
import { CIDADES } from "@/lib/cidadesData";
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

/** Hubs que realmente respondem 200 — só eles podem virar nó intermediário. */
const HUB_PATHS: Record<string, string> = {
  "/servicos": "Serviços",
  "/problemas": "Problemas",
  "/blog": "Blog",
  "/empresas": "Empresas",
};

interface Crumb {
  name: string;
  path: string;
}

/** Trilha derivada do path real (Início > hub existente > página atual). */
function buildBreadcrumbs(path: string, title: string): Crumb[] {
  if (path === "/") return [];
  const segments = path.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ name: "Início", path: "/" }];
  let acc = "";
  segments.forEach((seg, i) => {
    acc += `/${seg}`;
    if (i === segments.length - 1) {
      crumbs.push({ name: shortTitle(title), path: acc });
    } else if (HUB_PATHS[acc]) {
      crumbs.push({ name: HUB_PATHS[acc], path: acc });
    }
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

  // Identidade institucional — um nó por documento, idêntico ao cliente
  // (mesmos builders), portanto adotado na hidratação sem duplicar.
  scripts.push(jsonLd("organization", buildOrganizationSchema()));
  scripts.push(jsonLd("website", buildWebSiteSchema()));

  if (localBusiness) {
    scripts.push(
      jsonLd("local-business", buildLocalBusinessSchema({ path, description })),
    );
  }

  // Home: WebPage + ItemList derivados do conteúdo realmente renderizado.
  if (path === "/") {
    scripts.push(
      jsonLd("web-page", {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${siteConfig.baseUrl}/#webpage-home`,
        url: `${siteConfig.baseUrl}/`,
        name: title,
        description,
        isPartOf: { "@id": `${siteConfig.baseUrl}/#website` },
        about: { "@id": `${siteConfig.baseUrl}/#organization` },
        inLanguage: "pt-BR",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tldr", "[data-speakable]"],
        },
      }),
    );
    scripts.push(
      jsonLd("item-list-services", {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${siteConfig.baseUrl}/#services-list`,
        name: "Serviços de informática em Curitiba",
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: HOME_SERVICES.length,
        itemListElement: HOME_SERVICES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.t,
          url: absoluteUrl(s.href),
        })),
      }),
    );
  }

  const citySlug = path.startsWith("/tecnico-informatica-")
    ? path.slice("/tecnico-informatica-".length)
    : undefined;
  const cityFaqs = citySlug && CIDADES[citySlug]
    ? CIDADES[citySlug].faqs
    : undefined;
  const faqItems =
    faq?.length
      ? faq
      : cityFaqs?.length
        ? cityFaqs
        : path === "/"
          ? HOME_FAQS.map((f) => ({ question: f.q, answer: f.a }))
          : undefined;

  if (faqItems?.length) {
    scripts.push(
      jsonLd("faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqItems.map((f) => ({
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
  if (path.startsWith("/servicos/") || path === "/empresa-de-ti-curitiba") {
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
