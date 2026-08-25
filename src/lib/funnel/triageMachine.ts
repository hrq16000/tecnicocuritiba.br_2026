/**
 * ============================================================================
 * TRIAGEM — MÁQUINA DE ESTADOS (lógica pura, testável, sem React)
 * ============================================================================
 * Toda a decisão de rota, validação, resumo e mensagem vive aqui.
 * Os componentes apenas renderizam. Isto mantém a lógica reutilizável entre
 * projetos e facilita testes automatizados.
 */
import {
  EQUIPMENTS,
  EVENT_LABELS,
  EVENT_OPTIONS,
  EMPTY_ANSWERS,
  PRICING,
  QUALIFICATION_FIELDS,
  QUALIFICATION_NOME,
  QUALIFICATION_BAIRRO,
  BUSINESS_FIELDS,
  BUSINESS_INTENT_OPTIONS,
  BUSINESS_ENGAGEMENT_OPTIONS,
  BUSINESS_DEVICE_RANGE_OPTIONS,
  BUSINESS_ENVIRONMENT_OPTIONS,
  BUSINESS_IMPACT_OPTIONS,
  BUSINESS_MODALITY_OPTIONS,
  RECURRING_NOTICE,
  getBusinessModalityValues,
  PRAZO_COLETA,
  ROUTE_LABEL,
  ROUTE_MIN_PRICE,
  ROUTE_PRAZO,
  TRIAGE_VERSION,
  BRAND_NAME,
  getEquipment,
  type CustomerType,
  type EquipmentConfig,
  type Field,
  type FieldOption,
  type ServiceRoute,
  type SymptomMeta,
  type TriageAnswers,
} from "./triageConfig";
import { buildTemplateOpening, buildTrackingLine } from "@/lib/whatsappTemplates";

// ─────────────────────────────────────────────────────────────
// ETAPAS — a sequência depende do ramo (PF × PJ), mas o motor é o mesmo.
// ─────────────────────────────────────────────────────────────
export const RESIDENTIAL_STEPS = [
  "customer",  // 0 — PF × PJ
  "equipment", // 1
  "identity",  // 2 — identificação + sintoma
  "details",   // 3 — contexto + urgência
  "modality",  // 4 — modalidade definida (informativo)
  "terms",     // 5 — ciência e aceite
  "review",    // 6 — revisão + WhatsApp
] as const;

export const BUSINESS_STEPS = [
  "customer",          // 0
  "business-need",     // 1 — nome, empresa, necessidade, avulso × recorrente
  "business-context",  // 2 — equipamentos, ambiente, impacto, descrição
  "business-modality", // 3 — modalidade, localização, urgência
  "terms",             // 4
  "review",            // 5
] as const;

export type StepName =
  | (typeof RESIDENTIAL_STEPS)[number]
  | (typeof BUSINESS_STEPS)[number];

/** Sequência de etapas do ramo atual. PJ só após escolher "empresa". */
export function getSteps(a: TriageAnswers): readonly StepName[] {
  return a.customerType === "business" ? BUSINESS_STEPS : RESIDENTIAL_STEPS;
}

export function getStepName(step: number, a: TriageAnswers): StepName {
  const steps = getSteps(a);
  return steps[Math.max(0, Math.min(step, steps.length - 1))];
}

export function getTotalSteps(a: TriageAnswers): number {
  return getSteps(a).length;
}

/** Compat: sequência residencial (ramo padrão). */
export const STEPS = RESIDENTIAL_STEPS;
export const TOTAL_STEPS = RESIDENTIAL_STEPS.length;

export const isBusiness = (a: TriageAnswers): boolean => a.customerType === "business";
export const isRecurring = (a: TriageAnswers): boolean =>
  isBusiness(a) && a.business["biz-engagement"] === "recurring_evaluation";


// ─────────────────────────────────────────────────────────────
// SINTOMA / EVENTO
// ─────────────────────────────────────────────────────────────
export function getSymptomMeta(a: TriageAnswers): SymptomMeta | undefined {
  const eq = getEquipment(a.equipment);
  if (!eq || !a.symptom) return undefined;
  return eq.symptomMeta[a.symptom];
}

export function getSymptomLabel(a: TriageAnswers): string {
  const eq = getEquipment(a.equipment);
  if (!eq || !a.symptom) return "";
  if (eq.symptomField.type === "textarea") return a.symptom;
  return eq.symptomField.options?.find((o) => o.value === a.symptom)?.label ?? a.symptom;
}

/** Campo temporal condicional derivado do sintoma (pode não existir). */
export function getEventField(a: TriageAnswers): Field | null {
  const meta = getSymptomMeta(a);
  if (!meta?.event) return null;
  return {
    id: "__event",
    label: EVENT_LABELS[meta.event],
    type: "single",
    required: true,
    options: EVENT_OPTIONS[meta.event],
  };
}

// ─────────────────────────────────────────────────────────────
// CAMPOS VISÍVEIS POR ETAPA
// ─────────────────────────────────────────────────────────────
function visible(fields: Field[], a: TriageAnswers): Field[] {
  return fields.filter((f) => !f.visibleWhen || f.visibleWhen(a));
}

/** Campos da etapa "identity" (qualificação + identificação + sintoma). */
export function getIdentityFields(a: TriageAnswers): Field[] {
  const eq = getEquipment(a.equipment);
  if (!eq) return [];
  return [
    ...QUALIFICATION_FIELDS,
    ...visible(eq.identityFields, a),
    eq.symptomField,
  ];
}


/** Campos da etapa "details" (contextuais + evento + urgência). */
export function getDetailsFields(a: TriageAnswers): Field[] {
  const eq = getEquipment(a.equipment);
  if (!eq) return [];
  const out: Field[] = [];
  const ev = getEventField(a);
  if (ev) out.push(ev);
  out.push(...visible(eq.contextFields, a));
  return out;
}

// ─────────────────────────────────────────────────────────────
// CAMPOS DO RAMO EMPRESARIAL
// ─────────────────────────────────────────────────────────────
/** Etapa "business-need": nome, empresa, necessidade e tipo de engajamento. */
export function getBusinessNeedFields(_a: TriageAnswers): Field[] {
  return [
    QUALIFICATION_NOME,
    BUSINESS_FIELDS.empresa,
    BUSINESS_FIELDS.intent,
    BUSINESS_FIELDS.engagement,
  ];
}

/** Etapa "business-context": ambiente e impacto. */
export function getBusinessContextFields(a: TriageAnswers): Field[] {
  const out: Field[] = [BUSINESS_FIELDS.deviceRange, BUSINESS_FIELDS.environment];
  // Avaliação recorrente não pergunta impacto de incidente pontual.
  if (!isRecurring(a)) out.push(BUSINESS_FIELDS.impact);
  out.push(
    isRecurring(a)
      ? {
          ...BUSINESS_FIELDS.descricao,
          label: "Descreva brevemente o ambiente e o que a empresa precisa",
        }
      : BUSINESS_FIELDS.descricao,
  );
  return out;
}

/** Etapa "business-modality": modalidade condicional + localização. */
export function getBusinessModalityFields(a: TriageAnswers): Field[] {
  const options = getBusinessModalityValues(a.business["biz-intent"], a.business["biz-engagement"]);
  return [
    { ...BUSINESS_FIELDS.modality, options },
    QUALIFICATION_BAIRRO,
  ];
}

function businessLabel(options: FieldOption[], value?: string): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Rótulos legíveis do ambiente (campo múltiplo, valores separados por vírgula). */
export function getBusinessEnvironmentLabels(a: TriageAnswers): string[] {
  const raw = a.business["biz-environment"] || "";
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => businessLabel(BUSINESS_ENVIRONMENT_OPTIONS, v));
}


// ─────────────────────────────────────────────────────────────
// DETERMINAÇÃO DA MODALIDADE
// ─────────────────────────────────────────────────────────────
const PC_NOT_WORKING = ["nao-liga", "liga-nao-inicia", "liga-desliga"];

export function determineServiceRoute(a: TriageAnswers): ServiceRoute {
  // Ramo empresarial: a modalidade é escolhida entre as opções compatíveis.
  if (isBusiness(a)) {
    const chosen = a.business["biz-modality"] as ServiceRoute | undefined;
    const allowed = getBusinessModalityValues(a.business["biz-intent"], a.business["biz-engagement"]);
    if (chosen && allowed.some((o) => o.value === chosen)) return chosen;
    return "orientacao";
  }
  const eq = getEquipment(a.equipment);
  if (!eq) return "coleta";
  // Equipamentos com rota fixa → sempre coleta.
  if (eq.forcedRoute) return eq.forcedRoute;


  // PC / Notebook — única categoria com remoto/visita.
  if (eq.id === "pc") {
    const liga = a.fields.liga;
    if (PC_NOT_WORKING.includes(liga)) return "coleta";
    const meta = a.symptom ? eq.symptomMeta[a.symptom] : undefined;
    if (!meta) return "visita";
    // remoto exige computador ligando normalmente (garantido acima).
    if (meta.route === "remoto") return liga === "liga-normal" ? "remoto" : "coleta";
    return meta.route;
  }
  return "coleta";
}

export interface PricingRules {
  route: ServiceRoute;
  routeLabel: string;
  minPrice: string;
  prazo: string;
  priceHint?: string;
  /** Explicação em linguagem simples do porquê da modalidade. */
  explanation: string;
}

export function getPricingRules(a: TriageAnswers): PricingRules {
  const route = determineServiceRoute(a);
  const eq = getEquipment(a.equipment);
  const meta = getSymptomMeta(a);
  const equipLabel = eq?.label ?? "equipamento";

  if (isBusiness(a)) {
    const recurring = isRecurring(a);
    const explanation = recurring
      ? `${RECURRING_NOTICE} Nesta etapa fazemos apenas o entendimento inicial: escopo, valores e formato são definidos depois da avaliação.`
      : route === "orientacao"
        ? `Vamos entender a necessidade da empresa antes de indicar a modalidade. Qualquer serviço executado respeita o valor mínimo de ${PRICING.minGeral}.`
        : route === "coleta"
          ? `O equipamento da empresa precisa ser avaliado em bancada. O valor mínimo é de ${PRICING.coletaMin}, com peças não inclusas.`
          : route === "visita"
            ? `O atendimento no endereço da empresa custa ${PRICING.visita} por até 30 minutos. Se for identificada necessidade de bancada, coleta ou peças, você será informado antes.`
            : `A demanda pode ser compatível com atendimento remoto. A confirmação é feita no WhatsApp e o valor mínimo é de ${PRICING.minGeral}.`;

    return {
      route,
      routeLabel: ROUTE_LABEL[route],
      minPrice: recurring ? "Definido após avaliação" : ROUTE_MIN_PRICE[route],
      prazo: recurring ? "Definido após avaliação" : ROUTE_PRAZO[route],
      explanation,
    };
  }

  let explanation = "";

  // Impressora 3D: bancada dedicada, mínimo pré-aprovado próprio (R$ 500,00).
  if (a.equipment === "impressora3d") {
    return {
      route: "coleta",
      routeLabel: ROUTE_LABEL.coleta,
      minPrice: PRICING.impressora3dMin,
      prazo: ROUTE_PRAZO.coleta,
      priceHint: meta?.priceHint,
      explanation: `Impressora 3D é avaliada em bancada dedicada${
        meta?.category ? `, com indício de ${meta.category}` : ""
      }. O mínimo pré-aprovado é de ${PRICING.impressora3dMin}, com coleta e entrega inclusas e peças não inclusas. Qualquer valor acima disso é informado antes da execução.`,
    };
  }

  if (route === "remoto") {
    explanation =
      "Pelas informações fornecidas, o serviço pode ser compatível com atendimento remoto, pois o computador está funcionando e a solicitação envolve instalação ou configuração. A confirmação será feita no WhatsApp.";
  } else if (route === "visita") {
    explanation =
      "Pelas informações fornecidas, seu caso pode ser avaliado por visita técnica. O atendimento custa R$ 99,99 por até 30 minutos. Se for identificada necessidade de bancada, coleta ou peças, você será informado antes.";
  } else if (meta?.category) {
    explanation = `Os sintomas informados têm indício de ${meta.category}. O valor depende de avaliação técnica e este equipamento precisa ser encaminhado por coleta e entrega. O valor mínimo é de ${PRICING.coletaMin}, com peças não inclusas.`;
  } else {
    explanation = `Pelas informações fornecidas, este ${equipLabel.toLowerCase()} precisa ser encaminhado por coleta e entrega para avaliação técnica. O valor mínimo é de ${PRICING.coletaMin}, com peças não inclusas.`;
  }

  return {
    route,
    routeLabel: ROUTE_LABEL[route],
    minPrice: ROUTE_MIN_PRICE[route],
    prazo: ROUTE_PRAZO[route],
    priceHint: route === "coleta" ? meta?.priceHint : undefined,
    explanation,
  };
}


// ─────────────────────────────────────────────────────────────
// TERMOS / ACEITES (dependem da rota)
// ─────────────────────────────────────────────────────────────
export interface TermItem {
  id: string;
  text: string;
}

export function getTermsForRoute(route: ServiceRoute): TermItem[] {
  const base: TermItem[] = [
    {
      id: "ciencia-geral",
      text: "Esta triagem é obrigatória e registra minha ciência sobre a modalidade indicada, os valores mínimos, os prazos e as condições. O WhatsApp será aberto apenas para agendar o atendimento compatível.",
    },
  ];

  if (route === "coleta") {
    return [
      ...base,
      {
        id: "coleta-min",
        text: `Estou ciente de que o valor mínimo da coleta e entrega é de ${PRICING.coletaMin}, com peças não inclusas. Serviços ou procedimentos de até ${PRICING.coletaTeto} poderão ser realizados sem nova autorização. Valores acima de ${PRICING.coletaTeto} serão informados previamente para aprovação.`,
      },
      {
        id: "coleta-cancel",
        text: `Estou ciente de que, em caso de cancelamento, desistência ou não aprovação do valor do serviço, será cobrado ${PRICING.coletaCancel} pelo diagnóstico, análise e permanência do equipamento na fila técnica.`,
      },
      {
        id: "coleta-prazo",
        text: `Estou ciente de que o prazo estimado é de ${PRAZO_COLETA}.`,
      },
    ];
  }

  if (route === "visita") {
    return [
      ...base,
      {
        id: "visita-valor",
        text: `Estou ciente de que a visita técnica para PC / Notebook custa ${PRICING.visita}, com nova cobrança a cada período adicional de até 30 minutos. A visita não garante o reparo e peças não estão inclusas.`,
      },
    ];
  }

  if (route === "orientacao") {
    return [
      ...base,
      {
        id: "orientacao-valor",
        text: `Estou ciente de que esta etapa é apenas de entendimento da necessidade e que qualquer serviço executado respeita o valor mínimo de ${PRICING.minGeral}, definido após avaliação.`,
      },
    ];
  }

  // remoto
  return [
    ...base,
    {
      id: "remoto-valor",
      text: `Estou ciente de que o valor mínimo do atendimento é de ${PRICING.minGeral} e que o serviço remoto depende de o equipamento estar ligado, com acesso e conexão à internet.`,
    },
  ];
}

/**
 * Termos efetivos considerando o ramo. PJ recorrente troca os termos de preço
 * por ciência neutra de que escopo e valores dependem de avaliação.
 */
export function getTermsForAnswers(a: TriageAnswers): TermItem[] {
  if (isRecurring(a)) {
    return [
      {
        id: "ciencia-geral",
        text: "Esta triagem é obrigatória e registra minha ciência de que o WhatsApp será aberto apenas para agendar o entendimento inicial da necessidade da empresa.",
      },
      {
        id: "pj-recorrente",
        text: `${RECURRING_NOTICE} Estou ciente de que não há plano, escopo, prazo de resposta ou valor definidos nesta etapa.`,
      },
    ];
  }
  return getTermsForRoute(determineServiceRoute(a));
}


// ─────────────────────────────────────────────────────────────
// VALIDAÇÃO POR ETAPA
// ─────────────────────────────────────────────────────────────
export interface ValidationResult {
  ok: boolean;
  /** id do primeiro campo incompleto (para foco). */
  firstIncomplete?: string;
  reason?: string;
}

function fieldValue(a: TriageAnswers, f: Field): string {
  if (f.id === "symptom") return a.symptom ?? "";
  if (f.id === "__event") return a.fields.__event ?? "";
  if (f.id.startsWith("biz-")) return a.business[f.id] ?? "";
  return a.fields[f.id] ?? "";
}

function fieldComplete(a: TriageAnswers, f: Field): boolean {
  if (!f.required) return true;
  const v = fieldValue(a, f).trim();
  if (!v) return false;
  if (f.minLength && v.length < f.minLength) return false;
  return true;
}

function validateFields(a: TriageAnswers, fields: Field[]): ValidationResult | null {
  for (const f of fields) {
    if (!fieldComplete(a, f)) {
      return { ok: false, firstIncomplete: f.id, reason: `Preencha: ${f.label}` };
    }
  }
  return null;
}

export function validateStep(step: number, a: TriageAnswers): ValidationResult {
  const name = getStepName(step, a);
  if (name === "customer") {
    return a.customerType ? { ok: true } : { ok: false, reason: "Selecione para quem é o atendimento." };
  }
  if (name === "equipment") {
    return a.equipment ? { ok: true } : { ok: false, reason: "Selecione o equipamento." };
  }
  if (name === "identity") {
    return validateFields(a, getIdentityFields(a)) ?? { ok: true };
  }
  if (name === "details") {
    const invalid = validateFields(a, getDetailsFields(a));
    if (invalid) return invalid;
    if (!a.urgency) {
      return { ok: false, firstIncomplete: "__urgency", reason: "Selecione a urgência." };
    }
    return { ok: true };
  }
  if (name === "business-need") {
    return validateFields(a, getBusinessNeedFields(a)) ?? { ok: true };
  }
  if (name === "business-context") {
    return validateFields(a, getBusinessContextFields(a)) ?? { ok: true };
  }
  if (name === "business-modality") {
    const invalid = validateFields(a, getBusinessModalityFields(a));
    if (invalid) return invalid;
    if (!a.urgency) {
      return { ok: false, firstIncomplete: "__urgency", reason: "Selecione a urgência." };
    }
    return { ok: true };
  }
  if (name === "modality") {
    return { ok: true };
  }
  if (name === "terms") {
    for (const t of getTermsForAnswers(a)) {
      if (!a.termsAccepted[t.id]) {
        return { ok: false, firstIncomplete: t.id, reason: "Confirme todos os itens para continuar." };
      }
    }
    return { ok: true };
  }
  return { ok: true };
}

export function getFirstIncompleteField(step: number, a: TriageAnswers): string | undefined {
  return validateStep(step, a).firstIncomplete;
}

// ─────────────────────────────────────────────────────────────
// LIMPEZA DE RESPOSTAS DEPENDENTES
// ─────────────────────────────────────────────────────────────
/** Ao trocar de equipamento, descarta tudo que era específico do anterior. */
export function resetForEquipment(a: TriageAnswers, next: TriageAnswers["equipment"]): TriageAnswers {
  if (a.equipment === next) return a;
  return {
    ...EMPTY_ANSWERS,
    customerType: a.customerType, // ramo PF/PJ é anterior ao equipamento
    equipment: next,
    urgency: a.urgency, // urgência é neutra, pode ser preservada

    // Qualificação é neutra em relação ao equipamento: preserva.
    fields: {
      ...(a.fields.nome ? { nome: a.fields.nome } : {}),
      ...(a.fields.bairro ? { bairro: a.fields.bairro } : {}),
    },
  };
}

/**
 * Ao trocar PF × PJ, descarta TUDO do ramo anterior (equipamento, sintoma,
 * campos condicionais, respostas `biz-`, aceites e modalidade) e preserva
 * apenas o que é neutro entre ramos: nome, bairro/cidade e urgência.
 */
export function resetForCustomerType(a: TriageAnswers, next: CustomerType): TriageAnswers {
  if (a.customerType === next) return a;
  return {
    ...EMPTY_ANSWERS,
    customerType: next,
    urgency: a.urgency,
    fields: {
      ...(a.fields.nome ? { nome: a.fields.nome } : {}),
      ...(a.fields.bairro ? { bairro: a.fields.bairro } : {}),
    },
  };
}

/** Ao trocar a necessidade/engajamento PJ, limpa a modalidade incompatível. */
export function resetBusinessDependents(a: TriageAnswers): TriageAnswers {
  const allowed = getBusinessModalityValues(a.business["biz-intent"], a.business["biz-engagement"]);
  const chosen = a.business["biz-modality"];
  if (!chosen || allowed.some((o) => o.value === chosen)) return a;
  const business = { ...a.business };
  delete business["biz-modality"];
  return { ...a, business };
}


/** Ao trocar o sintoma, descarta respostas contextuais que dependiam dele. */
export function resetForSymptom(a: TriageAnswers, nextSymptom: string): TriageAnswers {
  if (a.symptom === nextSymptom) return a;
  const eq = getEquipment(a.equipment);
  if (!eq) return { ...a, symptom: nextSymptom };
  // Remove valores de campos contextuais + evento (serão recalculados).
  const keptFields: Record<string, string> = {};
  const contextIds = new Set(eq.contextFields.map((f) => f.id));
  for (const [k, v] of Object.entries(a.fields)) {
    if (k === "__event") continue;
    if (contextIds.has(k)) continue;
    keptFields[k] = v;
  }
  return { ...a, symptom: nextSymptom, fields: keptFields };
}

// ─────────────────────────────────────────────────────────────
// RESUMO + MENSAGEM DE WHATSAPP
// ─────────────────────────────────────────────────────────────
export interface SummaryRow {
  label: string;
  value: string;
}

function detailLabel(eq: EquipmentConfig, a: TriageAnswers): string {
  // Junta respostas contextuais legíveis (evento + campos).
  const parts: string[] = [];
  const ev = getEventField(a);
  if (ev) {
    const v = a.fields.__event;
    const opt = ev.options?.find((o) => o.value === v);
    if (opt) parts.push(`${ev.label} ${opt.label}`);
  }
  for (const f of visible(eq.contextFields, a)) {
    const raw = a.fields[f.id];
    if (!raw) continue;
    const label = f.options?.find((o) => o.value === raw)?.label ?? raw;
    parts.push(`${f.label} ${label}`);
  }
  return parts.join(" · ");
}

export function buildTriageSummary(a: TriageAnswers): SummaryRow[] {
  const eq = getEquipment(a.equipment);
  const rules = getPricingRules(a);
  const rows: SummaryRow[] = [];

  if (isBusiness(a)) {
    rows.push({ label: "Tipo de atendimento", value: "Empresa / organização" });
    if (a.fields.nome) rows.push({ label: "Contato", value: a.fields.nome });
    if (a.business["biz-empresa"]) rows.push({ label: "Empresa", value: a.business["biz-empresa"] });
    const intent = businessLabel(BUSINESS_INTENT_OPTIONS, a.business["biz-intent"]);
    if (intent) rows.push({ label: "Necessidade", value: intent });
    const engagement = businessLabel(BUSINESS_ENGAGEMENT_OPTIONS, a.business["biz-engagement"]);
    if (engagement) rows.push({ label: "Formato", value: engagement });
    const devices = businessLabel(BUSINESS_DEVICE_RANGE_OPTIONS, a.business["biz-device-range"]);
    if (devices) rows.push({ label: "Equipamentos", value: devices });
    const env = getBusinessEnvironmentLabels(a);
    if (env.length) rows.push({ label: "Ambiente", value: env.join(" · ") });
    const impact = businessLabel(BUSINESS_IMPACT_OPTIONS, a.business["biz-impact"]);
    if (impact) rows.push({ label: "Impacto", value: impact });
    if (a.business["biz-descricao"]) {
      rows.push({ label: "Descrição", value: a.business["biz-descricao"].trim() });
    }
    if (a.fields.bairro) rows.push({ label: "Bairro/cidade", value: a.fields.bairro });
    if (a.urgency) {
      const u = URGENCY_LABEL(a.urgency);
      if (u) rows.push({ label: "Urgência", value: u });
    }
    rows.push({ label: "Modalidade indicada", value: rules.routeLabel });
    rows.push({ label: "Valor mínimo informado", value: rules.minPrice });
    rows.push({ label: "Prazo informado", value: rules.prazo });
    if (isRecurring(a)) rows.push({ label: "Observação", value: RECURRING_NOTICE });
    if (a.finalNotes.trim()) rows.push({ label: "Observação adicional", value: a.finalNotes.trim() });
    return rows;
  }

  if (a.fields.nome) rows.push({ label: "Nome", value: a.fields.nome });
  if (a.fields.bairro) rows.push({ label: "Bairro/cidade", value: a.fields.bairro });
  if (eq) rows.push({ label: "Equipamento", value: eq.label });


  const marca = a.fields.marca || a.fields.console || a.fields["equip-nome"];
  const modelo = a.fields.modelo;
  const marcaModelo = [marca, modelo].filter(Boolean).join(" · ");
  if (marcaModelo) rows.push({ label: "Marca/modelo", value: marcaModelo });

  if (a.fields.idade) {
    const idadeOpt = eq?.identityFields
      .find((f) => f.id === "idade")
      ?.options?.find((o) => o.value === a.fields.idade);
    rows.push({ label: "Idade aproximada", value: idadeOpt?.label ?? a.fields.idade });
  }

  const symptom = getSymptomLabel(a);
  if (symptom) rows.push({ label: "Problema", value: symptom });

  const details = eq ? detailLabel(eq, a) : "";
  if (details) rows.push({ label: "Detalhes", value: details });

  if (a.urgency) {
    const u = URGENCY_LABEL(a.urgency);
    if (u) rows.push({ label: "Urgência", value: u });
  }

  rows.push({ label: "Modalidade indicada", value: rules.routeLabel });
  rows.push({ label: "Valor mínimo informado", value: rules.minPrice });
  rows.push({ label: "Prazo informado", value: rules.prazo });

  if (a.finalNotes.trim()) rows.push({ label: "Observação adicional", value: a.finalNotes.trim() });
  return rows;
}

import { URGENCY_OPTIONS } from "./triageConfig";
function URGENCY_LABEL(v: string): string {
  return URGENCY_OPTIONS.find((o) => o.value === v)?.label ?? v;
}

/** Identificador simples da triagem (data/hora + hash curto). */
export function makeTriageId(): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `T-${stamp}-${rand}`;
}

export function buildWhatsAppMessage(
  a: TriageAnswers,
  triageId: string,
  originUrl?: string,
): string {
  const rows = buildTriageSummary(a);
  const business = isBusiness(a);
  const lines: string[] = [];
  if (business) {
    const quem = a.fields.nome ? `Olá, aqui é ${a.fields.nome}.` : "Olá!";
    const empresa = a.business["biz-empresa"] ? ` da ${a.business["biz-empresa"]}` : "";
    lines.push(`${quem} Preciso de atendimento técnico para uma empresa${empresa}.`);
  } else {
    lines.push(
      buildTemplateOpening({
        cat: a.equipment ?? "outro",
        sym: getSymptomLabel(a),
        bairro: a.fields.bairro,
        nome: a.fields.nome,
      }),
    );
  }
  lines.push(`Concluí a triagem obrigatória pelo site ${BRAND_NAME}.`);
  lines.push("");
  for (const r of rows) {
    if (r.label === "Observação adicional") continue; // vai por último
    lines.push(`*${r.label}:* ${r.value}`);
  }
  if (originUrl) {
    lines.push(`*Página de origem:* ${originUrl}`);
  }
  lines.push("");
  lines.push("Confirmo que li e aceitei as condições apresentadas no funil.");
  const obs = rows.find((r) => r.label === "Observação adicional");
  if (obs) {
    lines.push("");
    lines.push(`*Observação adicional:* ${obs.value}`);
  }
  lines.push("");
  lines.push(
    buildTrackingLine({
      cat: business ? "empresa" : (a.equipment ?? "outro"),
      sym: business ? businessLabel(BUSINESS_INTENT_OPTIONS, a.business["biz-intent"]) : getSymptomLabel(a),
      bairro: a.fields.bairro,
      servico: getPricingRules(a).routeLabel,
    }),
  );

  lines.push(`_Triagem ${triageId} · ${new Date().toLocaleString("pt-BR")} · v${TRIAGE_VERSION}_`);
  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────
// PERSISTÊNCIA COM VERSIONAMENTO + MIGRAÇÃO SELETIVA (fail-safe)
// ─────────────────────────────────────────────────────────────
interface PersistShape {
  version: string;
  answers: TriageAnswers;
}

/** Versões anteriores reconhecidas (migráveis para o schema v6). */
export const LEGACY_TRIAGE_VERSIONS = ["1.0", "2.0", "3.0", "4.0", "4.1", "5.0"] as const;
export const LEGACY_STORAGE_KEYS = LEGACY_TRIAGE_VERSIONS.map((v) => `triage_state_${v}`);

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

const strMap = (v: unknown): Record<string, string> => {
  if (!isPlainObject(v)) return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) {
    if (typeof val === "string" && val.trim()) out[k] = val;
    else if (typeof val === "number" || typeof val === "boolean") out[k] = String(val);
  }
  return out;
};

const boolMap = (v: unknown): Record<string, boolean> => {
  if (!isPlainObject(v)) return {};
  const out: Record<string, boolean> = {};
  for (const [k, val] of Object.entries(v)) if (val === true) out[k] = true;
  return out;
};

/**
 * Normaliza qualquer estado (v6 ou anterior) para o contrato v6, descartando
 * apenas o que for incompatível com o ramo. Idempotente por construção.
 */
export function normalizeAnswers(input: unknown): TriageAnswers {
  const a = isPlainObject(input) ? input : {};
  const customerType =
    a.customerType === "business" || a.customerType === "residential" ? a.customerType : null;
  const fields = strMap(a.fields);
  const business = strMap(a.business);
  const equipment = EQUIPMENTS.some((e) => e.id === a.equipment)
    ? (a.equipment as TriageAnswers["equipment"])
    : null;
  const urgency =
    typeof a.urgency === "string" && URGENCY_OPTIONS.some((o) => o.value === a.urgency)
      ? a.urgency
      : null;
  const symptom = typeof a.symptom === "string" && a.symptom.trim() ? a.symptom : null;

  const base: TriageAnswers = {
    ...EMPTY_ANSWERS,
    customerType,
    equipment,
    fields,
    business,
    symptom,
    urgency,
    termsAccepted: boolMap(a.termsAccepted),
    finalNotes: typeof a.finalNotes === "string" ? a.finalNotes : "",
  };

  // Coerência de ramo: nenhum campo do ramo oposto sobrevive.
  if (base.customerType === "business") {
    return {
      ...base,
      equipment: null,
      symptom: null,
      fields: {
        ...(fields.nome ? { nome: fields.nome } : {}),
        ...(fields.bairro ? { bairro: fields.bairro } : {}),
      },
    };
  }
  return { ...base, business: {} };
}

/** Sessão de versão anterior → ramo residencial, preservando o compatível. */
export function migrateLegacyAnswers(input: unknown): TriageAnswers {
  const normalized = normalizeAnswers(input);
  return {
    ...normalized,
    customerType: "residential",
    business: {},
    // Aceites são versionados pelos termos: precisam ser refeitos.
    termsAccepted: {},
  };
}

export function loadPersisted(key: string): TriageAnswers | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistShape>;
      if (parsed && parsed.version === TRIAGE_VERSION && isPlainObject(parsed.answers)) {
        return normalizeAnswers(parsed.answers);
      }
      // Versão desconhecida/futura na chave atual: fallback seguro.
      sessionStorage.removeItem(key);
    }
    return migrateFromLegacy(key);
  } catch {
    try { sessionStorage.removeItem(key); } catch { /* noop */ }
    return null;
  }
}

/** Migra a primeira sessão antiga válida encontrada e limpa as chaves legadas. */
function migrateFromLegacy(currentKey: string): TriageAnswers | null {
  let migrated: TriageAnswers | null = null;
  for (const legacyKey of LEGACY_STORAGE_KEYS) {
    let raw: string | null = null;
    try { raw = sessionStorage.getItem(legacyKey); } catch { raw = null; }
    if (!raw) continue;
    if (!migrated) {
      try {
        const parsed = JSON.parse(raw) as Partial<PersistShape>;
        const answers = isPlainObject(parsed?.answers) ? parsed.answers : parsed;
        const candidate = migrateLegacyAnswers(answers);
        const hasContent =
          !!candidate.equipment ||
          !!candidate.symptom ||
          Object.keys(candidate.fields).length > 0;
        if (hasContent) migrated = candidate;
      } catch {
        migrated = null; // sessão corrompida: descarta, sem quebrar o funil
      }
    }
    try { sessionStorage.removeItem(legacyKey); } catch { /* noop */ }
  }
  if (migrated) persist(currentKey, migrated);
  return migrated;
}


export function persist(key: string, answers: TriageAnswers): void {
  try {
    const payload: PersistShape = { version: TRIAGE_VERSION, answers };
    sessionStorage.setItem(key, JSON.stringify(payload));
  } catch {
    /* noop */
  }
}

export function clearPersisted(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* noop */
  }
}
