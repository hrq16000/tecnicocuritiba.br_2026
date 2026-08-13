import { useLocation } from "react-router-dom";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { buildLocalBusinessSchema } from "@/lib/localBusinessJsonLd";
import { PROBLEMAS_HUB } from "@/lib/problemasHub";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import { PRECOS } from "@/lib/precosConfig";

/**
 * Elegibilidade a rich results nas rotas /problemas/*.
 *
 * As páginas de sintoma já declaram WebPage + FAQPage próprias. Aqui entram os
 * dois nós que faltavam para o trio LocalBusiness + Service + FAQ:
 *
 *  - LocalBusiness (NAP único, vindo de localBusinessJsonLd);
 *  - Service (diagnóstico do sintoma daquela rota, com provider e areaServed).
 *
 * Montado uma única vez dentro do Router — nenhuma página precisa ser editada,
 * e o slot garante no máximo um nó por documento.
 */

const ITENS = new Map(
  PROBLEMAS_HUB.flatMap((g) => g.itens.map((i) => [i.to, { ...i, grupo: g.titulo }])),
);

export const ProblemaLocalSchema = () => {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "") || "/";
  const item = path.startsWith("/problemas/") ? ITENS.get(path) : undefined;
  const url = absoluteUrl(path);

  const localBusiness = item
    ? buildLocalBusinessSchema({
        path,
        description: `${item.titulo} em Curitiba e região metropolitana: diagnóstico técnico, coleta e entrega. ${item.desc}`,
        services: [{ name: item.titulo, url }],
      })
    : null;

  const service = item
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Diagnóstico e reparo — ${item.titulo}`,
        description: item.desc,
        serviceType: item.grupo,
        category: "Assistência Técnica de Informática",
        provider: { "@id": `${siteConfig.baseUrl}/#organization` },
        areaServed: siteConfig.serviceArea.map((name) => ({ "@type": "City", name })),
        url,
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: String(PRECOS.diagnostico ?? 99.99),
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/precos"),
        },
      }
    : null;

  useJsonLdSlot(SCHEMA_SLOTS.localBusiness, localBusiness, SLOT_PRIORITY.page);
  useJsonLdSlot(SCHEMA_SLOTS.service, service, SLOT_PRIORITY.page);
  return null;
};

export default ProblemaLocalSchema;
