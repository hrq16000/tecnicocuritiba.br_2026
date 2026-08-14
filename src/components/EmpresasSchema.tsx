import { useMemo } from "react";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { siteConfig, absoluteUrl } from "@/lib/siteConfig";
import { AREA_SERVED } from "@/lib/localBusinessJsonLd";

/**
 * JSON-LD da landing /empresas.
 *
 * Organization/WebSite já são globais (InstitutionalJsonLd) — aqui entram
 * apenas as entidades específicas da rota:
 *   • Service (atendimento empresarial de TI), com provider apontando para a
 *     Organization oficial e areaServed padronizado;
 *   • FAQPage espelhando 1:1 as perguntas VISÍVEIS da página (paridade
 *     exigida pelo gate check:faq-parity).
 *
 * Nunca inclui rating/review.
 */
export interface EmpresasFaqItem {
  question: string;
  answer: string;
}

export const EmpresasSchema = ({
  path = "/empresas",
  faqs,
}: {
  path?: string;
  faqs: readonly EmpresasFaqItem[];
}) => {
  const url = absoluteUrl(path);

  const service = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: "Atendimento empresarial de TI em Curitiba",
      description:
        "Suporte técnico de TI para empresas em Curitiba e Região Metropolitana: estações de trabalho, redes e Wi-Fi corporativo, backup e continuidade. Triagem por WhatsApp com escopo e condições definidos antes da execução.",
      serviceType: "Suporte técnico de TI para empresas",
      category: "Assistência Técnica de Informática",
      url,
      provider: { "@id": `${siteConfig.baseUrl}/#organization` },
      areaServed: AREA_SERVED,
      audience: { "@type": "BusinessAudience", name: "Empresas e escritórios" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Frentes de atendimento empresarial",
        itemListElement: [
          "Suporte técnico a estações de trabalho",
          "Redes e Wi-Fi corporativo",
          "Backup e continuidade de dados",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url,
          seller: { "@id": `${siteConfig.baseUrl}/#organization` },
        })),
      },
    }),
    [url],
  );

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    }),
    [url, faqs],
  );

  useJsonLdSlot(SCHEMA_SLOTS.service, service, SLOT_PRIORITY.page);
  useJsonLdSlot(SCHEMA_SLOTS.faq, faqSchema, SLOT_PRIORITY.page);
  return null;
};

export default EmpresasSchema;
