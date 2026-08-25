/**
 * ─────────────────────────────────────────────────────────────
 * GOVERNANÇA DETERMINÍSTICA DE JSON-LD (slots)
 * ─────────────────────────────────────────────────────────────
 * Cada entidade estruturada do site pertence a um SLOT com chave estável
 * (`data-schema-key`). Um slot existe no máximo uma vez no DOM.
 *
 * Regras:
 *  1. Registro (upsert) por chave — nunca por `@type`.
 *  2. Vários donos podem registrar o mesmo slot; vence a MAIOR prioridade
 *     (página > global > estático). Empate: o registro mais recente.
 *  3. Ao desmontar (navegação SPA), o dono libera o slot; se restar um
 *     registro de menor prioridade, ele volta a valer; se não restar
 *     nenhum, o conteúdo estático do prerender é restaurado (quando havia)
 *     ou o nó é removido.
 *  4. O nó estático do prerender é ADOTADO (reaproveitado) pelo slot de
 *     mesma chave — nunca duplicado nem removido por coincidência de tipo.
 *
 * Nada aqui depende de timers, polling ou MutationObserver.
 */
import { useEffect, useId } from "react";
import { validateSchema } from "@/lib/schemaValidation";

export const SCHEMA_SLOTS = {
  organization: "organization",
  website: "website",
  localBusiness: "local-business",
  webPage: "web-page",
  aboutPage: "about-page",
  contactPage: "contact-page",
  service: "service",
  breadcrumb: "breadcrumb",
  faq: "faq",
  itemListServices: "item-list-services",
  siteNavigation: "site-navigation",
  article: "article",
  howTo: "how-to",
} as const;

export type SchemaSlot = (typeof SCHEMA_SLOTS)[keyof typeof SCHEMA_SLOTS];

/** Prioridades: quanto maior, mais específico. */
export const SLOT_PRIORITY = {
  /** Conteúdo vindo do prerender estático (nenhum dono client-side). */
  static: 0,
  /** Entidade institucional presente em todo o site (ex.: footer). */
  global: 10,
  /** Componente reutilizável de página (ex.: breadcrumb visual). */
  component: 20,
  /** Entidade específica da rota atual. */
  page: 30,
} as const;

type JsonLdObject = Record<string, unknown>;

interface SlotEntry {
  owner: string;
  schema: JsonLdObject;
  priority: number;
  seq: number;
}

const registry = new Map<SchemaSlot, SlotEntry[]>();
/** HTML original do nó estático adotado, para restauração no unmount. */
const staticSnapshot = new Map<SchemaSlot, string>();
let seqCounter = 0;

const nodeFor = (slot: SchemaSlot) =>
  typeof document === "undefined"
    ? null
    : document.head.querySelector<HTMLScriptElement>(`script[data-schema-key="${slot}"]`);

/** Nó estático do prerender ainda não adotado (marcado no build). */
const adoptStaticNode = (slot: SchemaSlot) => {
  const existing = nodeFor(slot);
  if (existing && !staticSnapshot.has(slot) && existing.dataset.staticJsonld === "1") {
    staticSnapshot.set(slot, existing.text);
  }
  return existing;
};

function renderSlot(slot: SchemaSlot) {
  if (typeof document === "undefined") return;
  const entries = registry.get(slot) ?? [];
  const node = adoptStaticNode(slot);

  if (entries.length === 0) {
    const snapshot = staticSnapshot.get(slot);
    if (node && snapshot !== undefined) {
      // Restaura o schema estático original do prerender.
      node.text = snapshot;
      node.dataset.schemaOwner = "static";
      node.dataset.schemaPriority = String(SLOT_PRIORITY.static);
    } else if (node) {
      node.remove();
    }
    return;
  }

  const winner = entries.reduce((best, e) =>
    e.priority > best.priority || (e.priority === best.priority && e.seq > best.seq) ? e : best,
  );

  const el = node ?? document.createElement("script");
  if (!node) {
    el.type = "application/ld+json";
    el.dataset.schemaKey = slot;
    document.head.appendChild(el);
  }
  el.text = JSON.stringify(winner.schema);
  el.dataset.schemaOwner = winner.owner;
  el.dataset.schemaPriority = String(winner.priority);
  el.dataset.schemaRoute = typeof window === "undefined" ? "" : window.location.pathname;
}

/** Registra/atualiza um dono do slot e re-renderiza o nó único. */
export function registerJsonLdSlot(
  slot: SchemaSlot,
  owner: string,
  schema: JsonLdObject | null,
  priority: number = SLOT_PRIORITY.page,
): boolean {
  if (typeof document === "undefined" || !schema) return false;

  const { valid, errors } = validateSchema(schema as JsonLdObject & { "@type"?: string | string[] });
  if (!valid) {
    if (import.meta.env?.DEV) console.error(`[json-ld slot ${slot}] inválido — ignorado:`, errors);
    return false;
  }

  const entries = registry.get(slot) ?? [];
  const next = entries.filter((e) => e.owner !== owner);
  next.push({ owner, schema, priority, seq: ++seqCounter });
  registry.set(slot, next);
  renderSlot(slot);
  return true;
}

/** Libera o slot para este dono (navegação SPA / unmount). */
export function releaseJsonLdSlot(slot: SchemaSlot, owner: string) {
  const entries = registry.get(slot);
  if (!entries) return;
  const next = entries.filter((e) => e.owner !== owner);
  if (next.length) registry.set(slot, next);
  else registry.delete(slot);
  renderSlot(slot);
}

/** Hook: mantém exatamente um nó por slot durante o ciclo de vida do dono. */
export function useJsonLdSlot(
  slot: SchemaSlot,
  schema: JsonLdObject | null,
  priority: number = SLOT_PRIORITY.page,
) {
  const owner = `${slot}:${useId()}`;
  const serialized = schema ? JSON.stringify(schema) : "";
  useEffect(() => {
    if (!serialized) {
      releaseJsonLdSlot(slot, owner);
      return;
    }
    registerJsonLdSlot(slot, owner, JSON.parse(serialized) as JsonLdObject, priority);
    return () => releaseJsonLdSlot(slot, owner);
  }, [slot, owner, serialized, priority]);
}

/** `@id` estável para entidades ancoradas em uma URL do site. */
export function entityId(absoluteUrlOfPage: string, fragment: string) {
  return `${absoluteUrlOfPage.replace(/\/$/, "")}/#${fragment}`;
}

/** Somente para testes/diagnóstico. */
export function __slotRegistrySnapshot() {
  return Array.from(registry.entries()).map(([slot, entries]) => ({
    slot,
    owners: entries.map((e) => ({ owner: e.owner, priority: e.priority })),
  }));
}
