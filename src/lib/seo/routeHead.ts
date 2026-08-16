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
