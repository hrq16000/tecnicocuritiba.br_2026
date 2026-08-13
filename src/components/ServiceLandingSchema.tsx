import { useMemo } from "react";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";

/**
 * JSON-LD por landing de serviço: Service + Offer + FAQPage + WebPage + Speakable.
 * Usa validateAndInjectSchema (bloqueia AggregateRating com <5 reviews e injeta dateModified).
 */
const BASE_URL = "https://tecnico.curitiba.br";

export interface ServiceFaq {
  question: string;
  answer: string;
}

interface ServiceLandingSchemaProps {
  serviceName: string;
  description: string;
  path: string;
  priceFrom: number;
  category?: string;
  faqs: ServiceFaq[];
  /** ISO date opcional; default = build time. Atualizar quando reescrever a página. */
  dateModified?: string;
}

export const ServiceLandingSchema = ({
  serviceName,
  description,
  path,
  priceFrom,
  category = "Assistência Técnica de Informática",
  faqs,
  dateModified,
}: ServiceLandingSchemaProps) => {
  const schemas = useMemo(() => {
    const url = `${BASE_URL}${path}`;
    const modified = dateModified ?? new Date().toISOString();

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: serviceName,
      description,
      category,
      serviceType: serviceName,
      url,
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: [
        { "@type": "City", name: "Curitiba" },
        { "@type": "City", name: "São José dos Pinhais" },
        { "@type": "City", name: "Pinhais" },
        { "@type": "City", name: "Colombo" },
        { "@type": "City", name: "Araucária" },
        { "@type": "City", name: "Campo Largo" },
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: priceFrom.toFixed(2),
        priceSpecification: {
          "@type": "PriceSpecification",
          price: priceFrom.toFixed(2),
          priceCurrency: "BRL",
          minPrice: priceFrom.toFixed(2),
          valueAddedTaxIncluded: true,
        },
        availability: "https://schema.org/InStock",
        url,
        seller: { "@id": `${BASE_URL}/#organization` },
      },
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };

    // WebPage + Speakable — otimizado para Bing Copilot / Google AI Overviews
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: serviceName,
      description,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#organization` },
      dateModified: modified,
      primaryImageOfPage: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".tldr", "[data-speakable]"],
      },
      mainEntity: { "@id": `${url}#service` },
    };

    return { serviceSchema, faqSchema, webPageSchema };
  }, [serviceName, description, path, priceFrom, category, faqs, dateModified]);

  useJsonLdSlot(SCHEMA_SLOTS.service, schemas.serviceSchema, SLOT_PRIORITY.page);
  useJsonLdSlot(SCHEMA_SLOTS.faq, schemas.faqSchema, SLOT_PRIORITY.page);
  useJsonLdSlot(SCHEMA_SLOTS.webPage, schemas.webPageSchema, SLOT_PRIORITY.page);

  // LocalBusiness (NAP único) completa o trio exigido para rich results locais
  // em toda landing de serviço.
  return (
    <LocalBusinessJsonLd
      path={path}
      description={description}
      services={[{ name: serviceName, url: `${BASE_URL}${path}` }]}
    />
  );
};

export default ServiceLandingSchema;
