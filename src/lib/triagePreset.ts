/**
 * Pré-seleção automática da triagem por rota (deep link #agendamento).
 *
 * Regras de segurança do projeto:
 * - Nunca inventa cidade/bairro: apenas equipamento/sintoma derivados da rota.
 * - Só aplica valores que EXISTEM na configuração da triagem (validação real).
 * - Nunca sobrescreve resposta já dada pelo usuário.
 */
import { EQUIPMENTS, type EquipmentId } from "@/lib/funnel/triageConfig";

export type TriagePreset = {
  equipment?: EquipmentId;
  symptom?: string;
  /** Rótulo curto da regra que casou — usado só em telemetria. */
  source: string;
};

type Rule = { test: RegExp; equipment?: EquipmentId; symptom?: string; source: string };

/** Da rota mais específica para a mais genérica. */
const RULES: Rule[] = [
  { test: /^\/servicos\/conserto-impressora-3d/, equipment: "impressora3d", source: "servico_impressora3d" },
  { test: /^\/servicos\/conserto-tv/, equipment: "tv", source: "servico_tv" },
  { test: /^\/servicos\/conserto-monitor/, equipment: "pc", symptom: "tela-teclado-bateria", source: "servico_monitor" },
  { test: /^\/servicos\/conserto-placa/, equipment: "pc", symptom: "nao-liga-placa", source: "servico_placa" },
  { test: /^\/servicos\/montagem-de-pc/, equipment: "pc", symptom: "trocar-componente", source: "servico_montagem" },
  { test: /^\/servicos\/(suporte-tecnico-empresarial|manutencao-preventiva-empresas|backup-para-empresas|suporte-home-office)/, equipment: "pc", source: "servico_pj" },
  { test: /^\/problemas\/notebook-nao-liga/, equipment: "pc", symptom: "nao-liga-placa", source: "problema_nao_liga" },
  { test: /^\/problemas\/computador-lento/, equipment: "pc", symptom: "virus-lentidao", source: "problema_lento" },
  { test: /formatacao|formatar/, equipment: "pc", symptom: "windows-sistema", source: "formatacao" },
  { test: /recuperacao-de-dados|recuperar-arquivos/, equipment: "pc", symptom: "recuperar-arquivos", source: "recuperacao" },
  { test: /remocao-de-virus|virus/, equipment: "pc", symptom: "virus-lentidao", source: "virus" },
  { test: /impressora/, equipment: "pc", symptom: "impressora-periferico", source: "impressora" },
  { test: /celular|smartphone|tablet/, equipment: "celular", source: "celular" },
  { test: /videogame|playstation|xbox/, equipment: "videogame", source: "videogame" },
  { test: /surface/, equipment: "surface", source: "surface" },
  { test: /(^|\/)(conserto-de-tv|tv-smart|smart-tv)/, equipment: "tv", source: "tv" },
  { test: /^\/(informatica|tecnico-informatica|arrumar-pc|empresa-de-ti)/, equipment: "pc", source: "cluster_informatica" },
];

/** Confere se o par equipamento/sintoma realmente existe na configuração. */
function validate(preset: Rule): TriagePreset | null {
  if (!preset.equipment) return null;
  const eq = EQUIPMENTS.find((e) => e.id === preset.equipment);
  if (!eq) return null;
  const symptomOk =
    !preset.symptom || (eq.symptomField.options ?? []).some((o) => o.value === preset.symptom);
  return { equipment: eq.id as EquipmentId, symptom: symptomOk ? preset.symptom : undefined, source: preset.source };
}

export function resolveTriagePreset(pathname: string): TriagePreset | null {
  const path = (pathname || "/").toLowerCase();
  for (const rule of RULES) {
    if (rule.test.test(path)) {
      const ok = validate(rule);
      if (ok) return ok;
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Contexto do deep link — sobrevive a um reload da página             */
/* ------------------------------------------------------------------ */

const CTX_KEY = "wa-funnel:deeplink-ctx";
const CTX_TTL_MS = 30 * 60 * 1000;

export type DeepLinkContext = {
  path: string;
  location: string;
  preset?: TriagePreset | null;
  savedAt: number;
};

export function saveDeepLinkContext(ctx: Omit<DeepLinkContext, "savedAt">) {
  try {
    sessionStorage.setItem(CTX_KEY, JSON.stringify({ ...ctx, savedAt: Date.now() }));
  } catch { /* storage indisponível */ }
}

export function readDeepLinkContext(): DeepLinkContext | null {
  try {
    const raw = sessionStorage.getItem(CTX_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeepLinkContext;
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > CTX_TTL_MS) {
      sessionStorage.removeItem(CTX_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearDeepLinkContext() {
  try { sessionStorage.removeItem(CTX_KEY); } catch { /* noop */ }
}

/* ------------------------------------------------------------------ */
/* Dispensa explícita — vale só para a sessão atual (sessionStorage)   */
/* ------------------------------------------------------------------ */

const DISMISS_KEY = "wa-funnel:dismissed";

/**
 * Marca que o usuário fechou a triagem manualmente. Enquanto a flag existir,
 * nenhuma abertura AUTOMÁTICA (restauração por TTL) acontece — mesmo que o
 * contexto do deep link ainda estivesse válido. Ações explícitas (clique em
 * CTA ou link com #agendamento) continuam abrindo normalmente.
 */
export function dismissTriageForSession() {
  try { sessionStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* noop */ }
}

export function wasTriageDismissed(): boolean {
  try { return !!sessionStorage.getItem(DISMISS_KEY); } catch { return false; }
}

/** Intenção explícita do usuário reabre a triagem: limpa a dispensa. */
export function clearTriageDismissal() {
  try { sessionStorage.removeItem(DISMISS_KEY); } catch { /* noop */ }
}
