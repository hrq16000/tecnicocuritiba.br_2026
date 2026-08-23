import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from '@/lib/jsonLdSlots';
import { buildLocalBusinessSchema } from '@/lib/localBusinessJsonLd';
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/organizationJsonLd';
import { HOME_FAQS, HOME_SERVICES } from '@/lib/home/homeContent';

const SITE = "https://tecnico.curitiba.br";

// NAP, área atendida e horários vêm da fonte única (localBusinessJsonLd.ts)
const localBusinessSchema = {
  ...buildLocalBusinessSchema({
    path: "/",
    description:
      "Técnico de informática em Curitiba e região metropolitana. Formatação, conserto de computadores e notebooks, remoção de vírus, upgrade SSD, redes. Diagnóstico honesto antes de informar o valor.",
  }),
  slogan: "Assistência Técnica em Informática em Curitiba",
  knowsAbout: [
    "Manutenção de computadores", "Conserto de notebooks", "Formatação Windows",
    "Remoção de vírus", "Upgrade de hardware", "Configuração de redes",
    "Suporte técnico em informática", "Instalação de câmeras CFTV",
    "Conserto de impressoras", "Assistência de eletrodomésticos inteligentes"
  ],
  hasMap: "https://www.google.com/maps/search/?api=1&query=T%C3%A9cnico+em+Curitiba",
};


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE}/#faq`,
  mainEntity: HOME_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const websiteSchema = buildWebSiteSchema();
const organizationSchema = buildOrganizationSchema();

// WebPage com Speakable — extração prioritária para Bing Copilot / AI Overviews
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE}/#webpage-home`,
  url: `${SITE}/`,
  name: "Técnico em Curitiba | Assistência Técnica e Suporte Local",
  description:
    "Assistência técnica em Curitiba com diagnóstico honesto: atendimento a domicílio, remoto ou com coleta. Escolha o serviço e continue pelo WhatsApp.",
  isPartOf: { "@id": `${SITE}/#website` },
  about: { "@id": `${SITE}/#organization` },
  inLanguage: "pt-BR",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".tldr", "[data-speakable]"],
  },
};

// ItemList — mesmos serviços exibidos na home (URLs reais, 200 no sitemap).
const serviceItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE}/#services-list`,
  name: "Serviços de informática em Curitiba",
  itemListOrder: "https://schema.org/ItemListUnordered",
  numberOfItems: HOME_SERVICES.length,
  itemListElement: HOME_SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.t,
    url: `${SITE}${s.href}`,
  })),
};

export const JsonLdSchema = () => {
  // Entidades institucionais globais — um slot cada, cedidos a schemas de rota.
  useJsonLdSlot(SCHEMA_SLOTS.localBusiness, localBusinessSchema, SLOT_PRIORITY.global);
  useJsonLdSlot(SCHEMA_SLOTS.website, websiteSchema, SLOT_PRIORITY.global);
  useJsonLdSlot(SCHEMA_SLOTS.organization, organizationSchema, SLOT_PRIORITY.global);

  // FAQ, WebPage e ItemList são ancorados na home: só valem na própria home.
  const isHome =
    typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === '';
  useJsonLdSlot(SCHEMA_SLOTS.faq, isHome ? faqSchema : null, SLOT_PRIORITY.global);
  useJsonLdSlot(SCHEMA_SLOTS.webPage, isHome ? webPageSchema : null, SLOT_PRIORITY.global);
  useJsonLdSlot(
    SCHEMA_SLOTS.itemListServices,
    isHome ? serviceItemListSchema : null,
    SLOT_PRIORITY.global,
  );

  return null;
};
