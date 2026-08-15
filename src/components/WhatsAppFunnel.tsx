import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import * as Icons from "lucide-react";
import { ArrowRight, ArrowLeft, CheckCircle2, Lock, MessageCircle, Copy, ExternalLink } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";
import {
  trackFunnelOpen,
  trackFunnelStep,
  trackFunnelSubmit,
  trackFunnelClose,
  trackFunnelBlocked,
  trackFunnelAgendarClick,
  trackFunnelAgendarImpression,
  trackFunnelModalOpen,
  trackFunnelModalImpression,
  trackFunnelQualification,
  trackFunnelBranch,
  trackFunnelBusinessProfile,
  setFunnelBranchContext,
  trackWaClick,
  trackAgendamentoDeepLinkClick,
  trackTriageAutoOpen,
  trackTriagePreset,
  trackTriageFieldFill,
  trackTriageRestore,
  trackTriagePreview,
  trackTriageFallbackTab,
} from "@/lib/funnelAnalytics";
import {
  resolveTriagePreset,
  saveDeepLinkContext,
  readDeepLinkContext,
  clearDeepLinkContext,
  dismissTriageForSession,
  wasTriageDismissed,
  clearTriageDismissal,
} from "@/lib/triagePreset";
import { appendUtmsToUrl, captureUtmsFromUrl } from "@/lib/utmCapture";
import { geoSuggestion } from "@/lib/geoContext";
import { getSessionId, recordSubmission } from "@/lib/funnelSubmission";
import { TriageErrorBoundary } from "@/components/funnel/TriageErrorBoundary";
import { TriageField } from "@/components/funnel/TriageField";
import { CriteriosAceiteCard } from "@/components/funnel/CriteriosAceiteCard";
import { ColetaGateCard, type ColetaGateState } from "@/components/funnel/ColetaGateCard";
import { categoriaPorEquipamento } from "@/lib/operacaoCategorias";

import {
  EQUIPMENTS,
  EMPTY_ANSWERS,
  CUSTOMER_TYPE_OPTIONS,
  RECURRING_NOTICE,
  URGENCY_OPTIONS,
  WHATSAPP_NUMBER,
  STORAGE_KEY,
  getEquipment,
  type CustomerType,
  type EquipmentId,
  type TriageAnswers,
} from "@/lib/funnel/triageConfig";
import {
  buildTriageSummary,
  buildWhatsAppMessage,
  clearPersisted,
  determineServiceRoute,
  getBusinessContextFields,
  getBusinessModalityFields,
  getBusinessNeedFields,
  getDetailsFields,
  getIdentityFields,
  getPricingRules,
  getStepName,
  getSteps,
  getTermsForAnswers,
  isBusiness,
  isRecurring,
  loadPersisted,
  makeTriageId,
  persist,
  resetBusinessDependents,
  resetForCustomerType,
  resetForEquipment,
  resetForSymptom,
  validateStep,
} from "@/lib/funnel/triageMachine";
import { setErrorContext } from "@/lib/errorReporter";


const WA_HOSTS = ["wa.me", "api.whatsapp.com"];
const REDUCED_MOTION =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function isWhatsAppHref(href: string | null): boolean {
  if (!href) return false;
  try {
    const u = new URL(href, window.location.origin);
    return WA_HOSTS.some((h) => u.hostname.endsWith(h));
  } catch {
    return false;
  }
}

function appendUtms(url: URL) {
  appendUtmsToUrl(url);
  if (!url.searchParams.has("utm_medium") || url.searchParams.get("utm_medium") === "organic") {
    url.searchParams.set("utm_medium", "funnel");
  }
  if (!url.searchParams.has("utm_campaign")) {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "") || "home";
    url.searchParams.set("utm_campaign", path.replace(/\//g, "_").slice(0, 80));
  }
}

/** Bip curtíssimo, apenas após tentativa explícita de avançar com erro. */
function playErrorBeep() {
  if (REDUCED_MOTION) return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 320;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
    osc.onended = () => ctx.close().catch(() => {});
  } catch {
    /* respeita bloqueios do navegador */
  }
}

export const WhatsAppFunnel = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<TriageAnswers>(EMPTY_ANSWERS);
  const [originLocation, setOriginLocation] = useState("cta");
  const [presetMessage, setPresetMessage] = useState<string | null>(null);
  const [invalidField, setInvalidField] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);
  const [fallback, setFallback] = useState<{ message: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const submittingRef = useRef(false);
  const isTransitioning = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fieldRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const openerRef = useRef<HTMLElement | null>(null);
  const sessionId = useMemo(() => getSessionId(), []);

  // Restaura estado persistido (com versionamento — descarta versões antigas).
  useEffect(() => {
    const restored = loadPersisted(STORAGE_KEY);
    if (restored) setAnswers(restored);
  }, []);

  const clearTimers = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    advanceTimer.current = null;
    pulseTimer.current = null;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const commit = useCallback((next: TriageAnswers) => {
    setAnswers(next);
    persist(STORAGE_KEY, next);
    return next;
  }, []);

  // ---------- derivations ----------
  const equipment = getEquipment(answers.equipment);
  const rules = useMemo(() => getPricingRules(answers), [answers]);
  const terms = useMemo(() => getTermsForAnswers(answers), [answers]);
  // Prévia da mensagem (mesmo builder do envio; id definitivo é gerado no submit).
  const previewMessage = useMemo(
    () =>
      buildWhatsAppMessage(
        answers,
        "—",
        typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : undefined,
      ),
    [answers],
  );
  // Ciência dos critérios de aceite/recusa da categoria (Rodada 3X).
  const [criteriosOk, setCriteriosOk] = useState(false);
  // Gate de coleta e entrega premium: faixa de raio + pré-requisitos + status.
  const [coleta, setColeta] = useState<ColetaGateState>({ prerequisitos: [], status: "", ok: false });

  const canAdvance = useMemo(() => validateStep(step, answers).ok, [step, answers]);
  const steps = useMemo(() => getSteps(answers), [answers]);
  const totalSteps = steps.length;
  const business = isBusiness(answers);

  // Mantém o contexto de analytics/erros alinhado ao ramo (inclui estado restaurado).
  useEffect(() => {
    const ct = answers.customerType ?? "unknown";
    setFunnelBranchContext({ customer_type: ct });
    setErrorContext({ funnel_customer_type: ct });
  }, [answers.customerType]);


  // ---------- navigation ----------
  const goTo = useCallback((s: number) => {
    setStep(Math.max(0, Math.min(s, totalSteps - 1)));
    setInvalidField(null);
  }, [totalSteps]);

  const doPulse = useCallback(() => {
    setPulse(true);
    pulseTimer.current = setTimeout(() => setPulse(false), 500);
  }, []);

  const advance = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    doPulse();
    const delay = REDUCED_MOTION ? 0 : 420;
    advanceTimer.current = setTimeout(() => {
      setStep((s) => Math.min(s + 1, totalSteps - 1));
      setInvalidField(null);
      isTransitioning.current = false;
    }, delay);

  }, [doPulse, totalSteps]);

  const focusFirstIncomplete = useCallback((s: number, a: TriageAnswers) => {
    const v = validateStep(s, a);
    if (v.ok || !v.firstIncomplete) return;
    setInvalidField(v.firstIncomplete);
    const el = fieldRefs.current.get(v.firstIncomplete);
    if (el) {
      el.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth", block: "center" });
      const focusable = el.querySelector<HTMLElement>("button,input,textarea,[tabindex]");
      focusable?.focus();
    }
  }, []);

  const handleNext = useCallback(() => {
    clearTimers();
    if (isTransitioning.current) return;
    const v = validateStep(step, answers);
    if (!v.ok) {
      playErrorBeep();
      focusFirstIncomplete(step, answers);
      return;
    }
    advance();
  }, [step, answers, advance, focusFirstIncomplete, clearTimers]);

  const back = useCallback(() => {
    clearTimers();
    isTransitioning.current = false;
    goTo(step - 1);
  }, [step, goTo, clearTimers]);

  // Auto-advance depois de uma seleção que completa a etapa.
  const AUTO_ADVANCE_STEPS = ["equipment", "identity", "details", "business-need", "business-context", "business-modality"];
  const maybeAutoAdvance = useCallback(
    (nextAnswers: TriageAnswers) => {
      const name = getStepName(step, nextAnswers);
      if (!AUTO_ADVANCE_STEPS.includes(name)) return;
      if (!validateStep(step, nextAnswers).ok) return;
      clearTimers();
      advance();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, advance, clearTimers],
  );

  /** Aplica uma resposta ao estado, respeitando o roteamento por prefixo. */
  const applyField = useCallback((prev: TriageAnswers, id: string, value: string): TriageAnswers => {
    if (id === "symptom") return resetForSymptom(prev, value);
    if (id.startsWith("biz-")) {
      const next = { ...prev, business: { ...prev.business, [id]: value } };
      // Trocar necessidade/engajamento invalida modalidade incompatível.
      return id === "biz-intent" || id === "biz-engagement" ? resetBusinessDependents(next) : next;
    }
    return { ...prev, fields: { ...prev.fields, [id]: value } };
  }, []);

  /** Estado resultante de uma seleção — determinístico, sem depender do setState. */
  const computeNext = useCallback(
    (id: string, value: string): TriageAnswers => applyField(answers, id, value),
    [answers, applyField],
  );

  // ---------- field updates ----------
  const setField = useCallback(
    (id: string, value: string) => {
      setInvalidField(null);
      if (value) trackTriageFieldFill(id);
      setAnswers((prev) => {
        const next = applyField(prev, id, value);
        persist(STORAGE_KEY, next);
        return next;
      });
    },
    [applyField],
  );

  const setCustomerType = useCallback(
    (value: CustomerType) => {
      setInvalidField(null);
      // Idempotência: duplo clique/tap fantasma no mesmo ramo não pode reemitir
      // `wa_funnel_branch`, descartar respostas nem cancelar o avanço já agendado
      // (clearTimers durante a transição deixava a triagem presa na etapa 0).
      if (answers.customerType === value) {
        if (isTransitioning.current) return;
        clearTimers();
        advance();
        return;
      }
      const next = resetForCustomerType(answers, value);
      commit(next);
      setFunnelBranchContext({ customer_type: value });
      setErrorContext({ funnel_customer_type: value });
      trackFunnelBranch({ customerType: value, ctaLocation: originLocation });
      // Troca real de ramo durante uma transição pendente: cancela e reagenda.
      clearTimers();
      isTransitioning.current = false;
      advance();
    },
    [answers, commit, originLocation, advance, clearTimers],
  );




  const setEquipment = useCallback(
    (id: EquipmentId) => {
      setInvalidField(null);
      const next = resetForEquipment(answers, id);
      commit(next);
      maybeAutoAdvance(next);
    },
    [answers, commit, maybeAutoAdvance],
  );

  const setUrgency = useCallback(
    (value: string) => {
      setInvalidField(null);
      const next = { ...answers, urgency: value };
      commit(next);
      maybeAutoAdvance(next);
    },
    [answers, commit, maybeAutoAdvance],
  );

  const setTerm = useCallback(
    (id: string, checked: boolean) => {
      setInvalidField(null);
      const next = { ...answers, termsAccepted: { ...answers.termsAccepted, [id]: checked } };
      commit(next);
    },
    [answers, commit],
  );

  const reset = useCallback(() => {
    clearTimers();
    isTransitioning.current = false;
    commit(EMPTY_ANSWERS);
    clearPersisted(STORAGE_KEY);
    clearDeepLinkContext();
    setFallback(null);
    setStep(0);
    setInvalidField(null);
  }, [commit, clearTimers]);

  // ---------- open / close ----------
  const lastOpenRef = useRef(0);
  const openFunnel = useCallback((loc: string, preset?: string) => {
    const now = Date.now();
    if (now - lastOpenRef.current < 600) return;
    lastOpenRef.current = now;
    openerRef.current = (document.activeElement as HTMLElement) ?? null;
    setOriginLocation(loc);
    setPresetMessage(preset ?? null);
    setFallback(null);
    setStep(0);
    setOpen(true);
    // Sugestão de bairro/cidade detectada (IP ou localização precisa).
    // Só preenche quando o campo está vazio — o usuário pode editar.
    const sugestao = geoSuggestion();
    if (sugestao) {
      setAnswers((prev) =>
        prev.fields.bairro ? prev : { ...prev, fields: { ...prev.fields, bairro: sugestao } },
      );
    }
    captureUtmsFromUrl();
    trackFunnelOpen(loc, !!preset);
  }, []);

  // Esconde botões flutuantes / rodapé WhatsApp enquanto o modal está aberto.
  useEffect(() => {
    if (open) document.body.setAttribute("data-triage-open", "1");
    else document.body.removeAttribute("data-triage-open");
    return () => document.body.removeAttribute("data-triage-open");
  }, [open]);

  // Global click interception for any WhatsApp anchor.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (submittingRef.current) return;
      const target = e.target as HTMLElement | null;
      const a = target?.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!isWhatsAppHref(href)) return;
      if (a.dataset.funnelSkip === "1") return;
      e.preventDefault();
      e.stopPropagation();
      let loc = "cta";
      const ctaLoc = a.closest<HTMLElement>("[data-cta-location]")?.dataset.ctaLocation;
      if (ctaLoc) loc = ctaLoc;
      else if (a.closest("header")) loc = "header";
      else if (a.closest("footer")) loc = "footer";
      else if (a.closest("[data-wa-medium]")) loc = (a.closest("[data-wa-medium]") as HTMLElement).dataset.waMedium || "cta";
      else if (a.getAttribute("aria-label")?.toLowerCase().includes("whatsapp")) loc = "float";
      let preset: string | undefined;
      try {
        const u = new URL(href!, window.location.origin);
        preset = u.searchParams.get("text") || undefined;
      } catch { /* noop */ }
      trackCTAClick("whatsapp", loc);
      openFunnel(loc, preset);
    };
    document.addEventListener("click", handler, true);

    const evHandler = (e: Event) => {
      const detail = (e as CustomEvent<{ location?: string; message?: string }>).detail || {};
      const loc = detail.location || "programmatic";
      trackCTAClick("whatsapp", loc);
      openFunnel(loc, detail.message);
    };
    window.addEventListener("wa-funnel:open", evHandler as EventListener);

    const originalOpen = window.open.bind(window);
    window.open = ((url?: string | URL, targetName?: string, features?: string) => {
      try {
        if (submittingRef.current) return originalOpen(url, targetName, features);
        const href = typeof url === "string" ? url : url?.toString();
        if (href && isWhatsAppHref(href)) {
          let preset: string | undefined;
          try {
            const u = new URL(href, window.location.origin);
            preset = u.searchParams.get("text") || undefined;
          } catch { /* noop */ }
          const trackedLocation = window.__lastCtaType === "whatsapp" ? window.__lastCtaLocation : undefined;
          openFunnel(trackedLocation || "programmatic", preset);
          return null;
        }
      } catch { /* fall through */ }
      return originalOpen(url, targetName, features);
    }) as typeof window.open;

    return () => {
      document.removeEventListener("click", handler, true);
      window.removeEventListener("wa-funnel:open", evHandler as EventListener);
      window.open = originalOpen;
    };
  }, [openFunnel]);

  // Deep link de agendamento (booking link do Google Business Profile):
  // qualquer URL do site com #agendamento (ou #agendar / #triagem) abre a
  // triagem direto, como popup, mesmo vindo de fora. Também funciona ao
  // clicar em âncoras internas com esse hash, sem recarregar a página.
  //
  // Rodada 4J: além de abrir, a triagem já vem pré-selecionada conforme a
  // rota (equipamento/sintoma validados na config — nunca cidade/bairro),
  // o contexto sobrevive a um reload e há fallback em nova aba se o popup
  // não montar (bloqueio de navegador/extension).
  const openScheduling = useCallback(
    (loc: string, opts: { href?: string; restore?: boolean } = {}) => {
      const path = window.location.pathname;
      const preset = resolveTriagePreset(path);
      if (opts.restore) {
        trackTriageRestore({ presetSource: preset?.source, origem: loc });
      } else {
        // Intenção explícita do usuário: pode reabrir mesmo após dispensa.
        clearTriageDismissal();
        trackAgendamentoDeepLinkClick({ href: opts.href, origem: loc, preset: preset?.source });
      }

      openFunnel(loc);

      if (preset?.equipment) {
        setAnswers((prev) => {
          // Nunca sobrescreve resposta já dada pelo usuário.
          if (prev.equipment) return prev;
          let next = resetForEquipment(prev, preset.equipment!);
          if (preset.symptom) next = resetForSymptom(next, preset.symptom);
          persist(STORAGE_KEY, next);
          return next;
        });
        trackTriagePreset({
          equipamento: preset.equipment,
          sintoma: preset.symptom,
          presetSource: preset.source,
        });
      }

      // Só grava contexto em aberturas reais (clique/deep link). Restauração
      // não renova o TTL, para não reabrir indefinidamente a cada reload.
      if (!opts.restore) saveDeepLinkContext({ path, location: loc, preset });

      // Fallback: se o diálogo não montar (popup bloqueado por extensão,
      // erro de render), abre a triagem em nova aba mantendo o contexto.
      window.setTimeout(() => {
        if (document.querySelector('[role="dialog"][data-triage="1"]')) return;
        const url = new URL(window.location.href);
        url.hash = "agendamento";
        const win = window.open(url.toString(), "_blank", "noopener,noreferrer");
        trackTriageFallbackTab({ motivo: win ? "dialog_nao_montou" : "nova_aba_bloqueada", url: url.toString() });
      }, 1200);
    },
    [openFunnel],
  );

  useEffect(() => {
    const HASHES = new Set(["#agendamento", "#agendar", "#triagem"]);
    const openFromHash = () => {
      if (!HASHES.has(window.location.hash.toLowerCase())) return;
      trackTriageAutoOpen("hash", { href: window.location.hash });
      openScheduling("deep_link_agendamento", { href: window.location.hash });
      // Limpa o hash para não reabrir ao voltar/atualizar.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    };
    const openedFromHash = HASHES.has(window.location.hash.toLowerCase());
    openFromHash();

    // Restauração após reload: mesmo contexto (rota + preset), sem inventar
    // cidade/bairro e sem reabrir em rota diferente da original.
    if (!openedFromHash) {
      const ctx = readDeepLinkContext();
      if (ctx && ctx.path === window.location.pathname) {
        if (wasTriageDismissed()) {
          // Usuário já dispensou nesta sessão: não reabrir, mesmo com TTL válido.
          clearDeepLinkContext();
          trackTriageAutoOpen("blocked_dismissed", { path: ctx.path });
        } else {
          trackTriageAutoOpen("ttl_restore", { path: ctx.path });
          openScheduling(ctx.location || "deep_link_agendamento", { restore: true });
        }
      }
    }

    const anchorHandler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a") as HTMLAnchorElement | null;
      const href = a?.getAttribute("href");
      if (!href) return;
      const hash = href.startsWith("#") ? href.toLowerCase() : "";
      if (!HASHES.has(hash)) return;
      e.preventDefault();
      trackTriageAutoOpen("anchor_click", { href: href.slice(0, 120) });
      openScheduling("deep_link_agendamento", { href });
    };
    window.addEventListener("hashchange", openFromHash);
    document.addEventListener("click", anchorHandler, true);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      document.removeEventListener("click", anchorHandler, true);
    };
  }, [openScheduling]);


  const stepName = getStepName(step, answers);


  useEffect(() => {
    if (!open) return;
    trackFunnelStep(step, answers.equipment, answers.symptom, originLocation, stepName);
  }, [open, step, answers.equipment, answers.symptom, originLocation, stepName]);

  // Perfil empresarial: dispara ao concluir a etapa de contexto do ramo PJ.
  useEffect(() => {
    if (!open || !business) return;
    if (stepName !== "business-modality") return;
    trackFunnelBusinessProfile({
      intent: answers.business["biz-intent"],
      engagement: answers.business["biz-engagement"],
      deviceRange: answers.business["biz-device-range"],
      impact: answers.business["biz-impact"],
      modalidade: rules.route,
    });
  }, [open, business, stepName, answers.business, rules.route]);


  // Modal open/impression — dispara quando o Dialog transiciona para aberto.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      trackFunnelModalOpen({ ctaLocation: originLocation, hasPreset: !!presetMessage });
      trackFunnelModalImpression({ ctaLocation: originLocation });
    }
    wasOpenRef.current = open;
  }, [open, originLocation, presetMessage]);

  // Impressão do botão "Agendar agora": IntersectionObserver com 400ms de dwell.
  const agendarBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const el = agendarBtnRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let timer: number | null = null;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (timer !== null) continue;
          timer = window.setTimeout(() => {
            trackFunnelAgendarImpression({
              ctaLocation: originLocation,
              modalidade: rules.route,
              equipamento: answers.equipment,
            });
            io.disconnect();
          }, 400);
        } else if (timer !== null) {
          clearTimeout(timer);
          timer = null;
        }
      }
    }, { threshold: [0, 0.5, 1] });
    io.observe(el);
    return () => {
      if (timer !== null) clearTimeout(timer);
      io.disconnect();
    };
  }, [step, originLocation, rules.route, answers.equipment]);

  const hasAnswers = !!answers.equipment;
  const handleOpenChange = (v: boolean) => {
    if (!v) {
      if (hasAnswers && !fallback) {
        const ok = window.confirm("Fechar a triagem? Suas respostas ficam salvas para continuar depois.");
        if (!ok) return;
      }
      trackFunnelClose(step, answers.equipment);
      clearTimers();
      // Usuário dispensou a triagem: não reabrir automaticamente em reloads
      // nem ao navegar internamente para outra rota nesta mesma sessão.
      clearDeepLinkContext();
      dismissTriageForSession();
      isTransitioning.current = false;
      openerRef.current?.focus?.();
    }
    setOpen(v);
  };

  // ---------- submit ----------
  const submit = useCallback(async () => {
    if (submittingRef.current) return;
    // Emitido antes da validação: reflete a *intenção* de agendar do usuário,
    // independentemente de a triagem estar completa. Assim conseguimos medir
    // desistência entre "clicou em Agendar agora" e "efetivamente abriu o WhatsApp".
    trackFunnelAgendarClick({
      equipamento: answers.equipment,
      sintoma: answers.symptom,
      modalidade: rules.route,
      ctaLocation: originLocation,
    });
    for (let s = 0; s < getSteps(answers).length; s++) {
      const v = validateStep(s, answers);
      if (!v.ok) {
        trackFunnelBlocked(`submit_invalid_step_${s}`, answers.equipment);
        setStep(s);
        setTimeout(() => focusFirstIncomplete(s, answers), 60);
        return;
      }
    }
    submittingRef.current = true;
    try {
      const triageId = makeTriageId();
      const originUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}${window.location.search}`
          : undefined;
      trackFunnelQualification({
        nome: answers.fields.nome,
        bairro: answers.fields.bairro,
        urgencia: answers.urgency,
        sintoma: answers.symptom,
        categoria: answers.equipment,
        modalidade: rules.route,
        triageId,
        originUrl,
      });
      const base = buildWhatsAppMessage(answers, triageId, originUrl);
      const logistica =
        rules.route === "coleta" && coleta.faixa
          ? [
              "",
              `*Coleta:* ${coleta.faixa.nome} · ${coleta.faixa.taxaLabel}`,
              `*Janelas:* ${coleta.faixa.janelas} · retirada em até ${coleta.faixa.prazoColetaDias} dia(s) útil(eis)`,
              `*Status inicial:* ${coleta.status}`,
              `*Pré-requisitos confirmados:* ${coleta.prerequisitos.length} itens aceitos na triagem`,
            ].join("\n")
          : "";
      const withLogistica = `${base}${logistica}`;
      const finalMessage = presetMessage ? `${presetMessage}\n\n---\n${withLogistica}` : withLogistica;


      try {
        await recordSubmission({
          sessionId,
          equipamento: equipment?.label,
          marca: answers.fields.marca || answers.fields.console || answers.fields["equip-nome"],
          sintoma: answers.symptom || undefined,
          requiresColeta: rules.route === "coleta",
          minimumAccepted: true,
          ctaLocation: originLocation,
          waMessage: finalMessage,
        });
      } catch (err) {
        console.warn("[triage] submission insert failed", err);
        trackFunnelBlocked("insert_failed", answers.equipment);
      }

      const url = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
      url.searchParams.set("text", finalMessage);
      appendUtms(url);

      trackFunnelSubmit({
        ctaLocation: originLocation,
        equipamento: answers.equipment,
        sintoma: answers.symptom,
        requiresColeta: rules.route === "coleta",
        mediaCount: 0,
        minimumAccepted: true,
      });
      trackCTAClick("whatsapp", `funnel_${originLocation}`);
      // Rodada 4D.1 — ponta final da mensuração: a abertura efetiva do canal
      // WhatsApp após a triagem passa a persistir `wa_click` em click_events,
      // permitindo calcular submit → WhatsApp. Sem alteração de UI/copy.
      trackWaClick(`funnel_${originLocation}`, {
        equipamento: answers.equipment || undefined,
        modalidade: rules.route,
      });

      // Contexto reduzido pós-triagem, lido pela página /obrigado.
      // Sem PII: apenas modalidade, rótulo do equipamento, triageId e origem.
      try {
        const ctx = {
          modality: rules.route,
          equipmentLabel: equipment?.label ?? "",
          equipmentId: answers.equipment ?? "",
          triageId,
          ctaLocation: originLocation,
          savedAt: Date.now(),
        };
        sessionStorage.setItem("wa-funnel:last-triage", JSON.stringify(ctx));
      } catch { /* storage indisponível: segue silenciosamente */ }

      const win = window.open(url.toString(), "_blank", "noopener,noreferrer");
      if (!win) {
        // Popup bloqueado: preserva triagem e oferece cópia da mensagem.
        setFallback({ message: finalMessage, url: url.toString() });
      } else {
        clearPersisted(STORAGE_KEY);
        clearDeepLinkContext();
        trackTriagePreview("confirm", { equipamento: answers.equipment || undefined });
        setOpen(false);
        // Navega para /obrigado usando o mesmo mecanismo do InstantNavigation.
        try {
          if (window.location.pathname !== "/obrigado") {
            window.history.pushState({}, "", "/obrigado");
            window.dispatchEvent(new PopStateEvent("popstate"));
            window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
          }
        } catch { /* fallback silencioso */ }
      }
    } finally {
      setTimeout(() => { submittingRef.current = false; }, 300);
    }
  }, [answers, equipment, rules, originLocation, presetMessage, sessionId, focusFirstIncomplete]);

  const copyMessage = useCallback(async () => {
    if (!fallback) return;
    try {
      await navigator.clipboard.writeText(fallback.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  }, [fallback]);

  // ---------- render helpers ----------
  const registerRef = (id: string) => (el: HTMLDivElement | null) => {
    fieldRefs.current.set(id, el);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-triage="1"
        className="z-[120] w-[calc(100vw-1.5rem)] max-w-[600px] max-h-[92dvh] gap-0 overflow-hidden p-0 sm:w-full"
      >
        {/* Cabeçalho fixo compacto */}
        <DialogHeader className="space-y-1 border-b border-border bg-card/60 px-4 py-3 sm:px-5">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
            Triagem antes do atendimento
          </DialogTitle>
          <DialogDescription className="text-xs">
            O WhatsApp humano abre <strong>somente após a triagem</strong>. Etapa {step + 1} de {totalSteps}.
          </DialogDescription>
          <div className={`mt-1.5 flex gap-1 transition-transform ${pulse && !REDUCED_MOTION ? "scale-y-150" : ""}`}>
            {Array.from({ length: totalSteps }).map((_, i) => (

              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </DialogHeader>

        {/* Conteúdo rolável */}
        <div className="max-h-[calc(92dvh-8.5rem)] overflow-y-auto px-4 py-4 sm:px-5">
          <TriageErrorBoundary onReset={reset}>
            {fallback ? (
              <FallbackView
                copied={copied}
                onCopy={copyMessage}
                url={fallback.url}
              />
            ) : (
              <>
                {/* ETAPA 0 — PF × PJ */}
                {stepName === "customer" && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Este atendimento é para quem?</p>
                    <p className="text-xs text-muted-foreground">
                      A triagem muda conforme o contexto: residencial ou empresarial.
                    </p>
                    <div className="grid gap-2">
                      {CUSTOMER_TYPE_OPTIONS.map((o) => {
                        const active = answers.customerType === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setCustomerType(o.value as CustomerType)}
                            className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
                              active ? "border-primary bg-primary/10 font-medium" : "border-border bg-card hover:border-primary/60"
                            }`}
                          >
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PJ — ETAPA 1: necessidade */}
                {stepName === "business-need" && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium">Atendimento para empresa</p>
                    {getBusinessNeedFields(answers).map((f) => (
                      <TriageField
                        key={f.id}
                        ref={registerRef(f.id)}
                        field={f}
                        value={f.id.startsWith("biz-") ? answers.business[f.id] ?? "" : answers.fields[f.id] ?? ""}
                        invalid={invalidField === f.id}
                        onChange={(v) => setField(f.id, v)}
                        onSelect={(v) => maybeAutoAdvance(computeNext(f.id, v))}
                      />
                    ))}
                    {isRecurring(answers) && (
                      <p className="rounded-lg border border-border bg-card/50 p-2.5 text-xs leading-snug text-foreground/80">
                        {RECURRING_NOTICE}
                      </p>
                    )}
                    <FunnelNav onBack={back} onNext={handleNext} canNext={canAdvance} />
                  </div>
                )}

                {/* PJ — ETAPA 2: ambiente e impacto */}
                {stepName === "business-context" && (
                  <div className="space-y-4">
                    {getBusinessContextFields(answers).map((f) => (
                      <TriageField
                        key={f.id}
                        ref={registerRef(f.id)}
                        field={f}
                        value={answers.business[f.id] ?? ""}
                        invalid={invalidField === f.id}
                        onChange={(v) => setField(f.id, v)}
                        onSelect={(v) => maybeAutoAdvance(computeNext(f.id, v))}
                      />
                    ))}
                    <FunnelNav onBack={back} onNext={handleNext} canNext={canAdvance} />
                  </div>
                )}

                {/* PJ — ETAPA 3: modalidade + localização + urgência */}
                {stepName === "business-modality" && (
                  <div className="space-y-4">
                    {getBusinessModalityFields(answers).map((f) => (
                      <TriageField
                        key={f.id}
                        ref={registerRef(f.id)}
                        field={f}
                        value={f.id.startsWith("biz-") ? answers.business[f.id] ?? "" : answers.fields[f.id] ?? ""}
                        invalid={invalidField === f.id}
                        onChange={(v) => setField(f.id, v)}
                      />
                    ))}
                    <div ref={registerRef("__urgency")} className={`space-y-1.5 scroll-mt-4 ${invalidField === "__urgency" ? "rounded-lg ring-2 ring-destructive/70 animate-pulse" : ""}`}>
                      <p className="text-sm font-medium">Qual a urgência? <span className="text-destructive">*</span></p>
                      <div role="radiogroup" className="grid gap-1.5">
                        {URGENCY_OPTIONS.map((u) => {
                          const active = answers.urgency === u.value;
                          return (
                            <button
                              key={u.value}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              onClick={() => setUrgency(u.value)}
                              className={`min-h-11 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
                                active ? "border-primary bg-primary/10 font-medium" : "border-border bg-card hover:border-primary/60"
                              }`}
                            >
                              {u.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Modalidade indicada</p>
                      <p className="mt-1 text-lg font-bold text-foreground">{rules.routeLabel}</p>
                      <p className="mt-2 text-sm leading-snug text-foreground/80">{rules.explanation}</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <InfoBox title="Valor mínimo" value={rules.minPrice} />
                      <InfoBox title="Prazo estimado" value={rules.prazo} />
                    </div>
                    <FunnelNav onBack={back} onNext={handleNext} canNext={canAdvance} />
                  </div>
                )}

                {/* ETAPA 1 — equipamento */}

                {stepName === "equipment" && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Qual o equipamento?</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {EQUIPMENTS.map((eq) => {
                        const Icon = (Icons[eq.icon as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;
                        const active = answers.equipment === eq.id;
                        return (
                          <button
                            key={eq.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setEquipment(eq.id)}
                            className={`flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
                              active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/60"
                            }`}
                          >
                            <Icon className="h-6 w-6 text-primary" />
                            <span className="text-xs font-semibold leading-tight">{eq.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <FunnelNav onBack={back} onNext={handleNext} canNext={canAdvance} />

                  </div>
                )}

                {/* ETAPA 1 — identificação + sintoma */}
                {stepName === "identity" && equipment && (
                  <div className="space-y-4">
                    {getIdentityFields(answers).map((f) => (
                      <TriageField
                        key={f.id}
                        ref={registerRef(f.id)}
                        field={f}
                        value={f.id === "symptom" ? answers.symptom ?? "" : answers.fields[f.id] ?? ""}
                        invalid={invalidField === f.id}
                        onChange={(v) => setField(f.id, v)}
                        onSelect={(v) => maybeAutoAdvance(computeNext(f.id, v))}
                      />
                    ))}
                    <FunnelNav onBack={back} onNext={handleNext} canNext={canAdvance} />
                  </div>
                )}

                {/* ETAPA 2 — contexto + urgência */}
                {stepName === "details" && equipment && (
                  <div className="space-y-4">
                    {getDetailsFields(answers).length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Só falta a urgência para seguir.
                      </p>
                    )}
                    {getDetailsFields(answers).map((f) => (
                      <TriageField
                        key={f.id}
                        ref={registerRef(f.id)}
                        field={f}
                        value={f.id === "__event" ? answers.fields.__event ?? "" : answers.fields[f.id] ?? ""}
                        invalid={invalidField === f.id}
                        onChange={(v) => setField(f.id, v)}
                        onSelect={(v) => maybeAutoAdvance(computeNext(f.id, v))}
                      />
                    ))}
                    <div ref={registerRef("__urgency")} className={`space-y-1.5 scroll-mt-4 ${invalidField === "__urgency" ? "rounded-lg ring-2 ring-destructive/70 animate-pulse" : ""}`}>
                      <p className="text-sm font-medium">Qual a urgência? <span className="text-destructive">*</span></p>
                      <div role="radiogroup" className="grid gap-1.5">
                        {URGENCY_OPTIONS.map((u) => {
                          const active = answers.urgency === u.value;
                          return (
                            <button
                              key={u.value}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              onClick={() => setUrgency(u.value)}
                              className={`min-h-11 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
                                active ? "border-primary bg-primary/10 font-medium" : "border-border bg-card hover:border-primary/60"
                              }`}
                            >
                              {u.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <FunnelNav onBack={back} onNext={handleNext} canNext={canAdvance} />
                  </div>
                )}

                {/* ETAPA 3 — modalidade definida */}
                {stepName === "modality" && (
                  <div className="space-y-3">
                    <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Modalidade indicada</p>
                      <p className="mt-1 text-lg font-bold text-foreground">{rules.routeLabel}</p>
                      <p className="mt-2 text-sm leading-snug text-foreground/80">{rules.explanation}</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <InfoBox title="Valor mínimo" value={rules.minPrice} />
                      <InfoBox title="Prazo estimado" value={rules.prazo} />
                    </div>
                    {rules.priceHint && (
                      <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs leading-snug text-foreground/80">
                        💡 {rules.priceHint} <em>Estimativa informativa — não substitui diagnóstico.</em>
                      </p>
                    )}
                    <FunnelNav onBack={back} onNext={handleNext} canNext nextLabel="Continuar" />
                  </div>
                )}

                {/* ETAPA 4 — ciência e aceite */}
                {stepName === "terms" && (
                  <div className="space-y-3">
                    <CriteriosAceiteCard
                      equipamento={answers.equipment}
                      accepted={criteriosOk}
                      onAcceptChange={setCriteriosOk}
                    />
                    {rules.route === "coleta" && (
                      <ColetaGateCard bairro={answers.fields.bairro} value={coleta} onChange={setColeta} />
                    )}
                    <p className="text-sm font-medium">Registro de ciência e aceite eletrônico</p>

                    <div className="space-y-2">
                      {terms.map((t) => {
                        const checked = !!answers.termsAccepted[t.id];
                        return (
                          <label
                            key={t.id}
                            ref={registerRef(t.id) as unknown as React.Ref<HTMLLabelElement>}
                            className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-snug transition-colors cursor-pointer ${
                              invalidField === t.id ? "border-destructive ring-2 ring-destructive/40" : "border-border bg-card/50"
                            }`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) => setTerm(t.id, !!v)}
                              className="mt-0.5"
                              aria-label="Confirmar item de ciência"
                            />
                            <span className="text-foreground/85">{t.text}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Leia também os{" "}
                      <a href="/termos-e-condicoes" data-funnel-skip="1" className="underline hover:text-foreground" onClick={() => setOpen(false)}>
                        Termos e Condições
                      </a>.
                    </p>
                    <FunnelNav
                      onBack={back}
                      onNext={handleNext}
                      canNext={
                        canAdvance &&
                        (criteriosOk || !categoriaPorEquipamento(answers.equipment)) &&
                        (rules.route !== "coleta" || coleta.ok)
                      }

                      nextLabel="Continuar"
                    />
                  </div>
                )}

                {/* ETAPA 5 — revisão + WhatsApp */}
                {stepName === "review" && (
                  <div className="space-y-3">
                    <div className="flex gap-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                      <div className="text-xs leading-snug">
                        <p className="font-semibold text-foreground">Triagem completa</p>
                        <p className="mt-0.5 text-foreground/70">Confira o resumo e agende pelo WhatsApp.</p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card/50 p-3">
                      <dl className="grid gap-1 text-xs">
                        {buildTriageSummary(answers).map((r) => (
                          <div key={r.label} className="flex gap-2">
                            <dt className="min-w-[92px] font-semibold text-foreground/70">{r.label}</dt>
                            <dd className="flex-1 text-foreground">{r.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <Textarea
                      placeholder="Observação adicional (opcional)"
                      rows={2}
                      value={answers.finalNotes}
                      maxLength={500}
                      aria-label="Observação adicional"
                      onChange={(e) => commit({ ...answers, finalNotes: e.target.value })}
                    />

                    {/* Prévia da mensagem: o usuário confere exatamente o que
                        será enviado ao WhatsApp antes de confirmar. */}
                    <div className="rounded-lg border border-border bg-muted/40 p-3">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-2 text-xs font-semibold text-foreground"
                        aria-expanded={showPreview}
                        onClick={() => {
                          const next = !showPreview;
                          setShowPreview(next);
                          if (next) trackTriagePreview("open", { equipamento: answers.equipment || undefined });
                        }}
                      >
                        <span>Prévia da mensagem do WhatsApp</span>
                        <span className="text-muted-foreground">{showPreview ? "ocultar" : "ver"}</span>
                      </button>
                      {showPreview && (
                        <pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap break-words rounded-md bg-background/70 p-2 text-[11px] leading-snug text-foreground/85">
                          {previewMessage}
                        </pre>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" onClick={back} className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Voltar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={reset}>Recomeçar</Button>
                      <Button
                        ref={agendarBtnRef}
                        onClick={submit}
                        className="ml-auto gap-2 bg-[hsl(var(--whatsapp))] text-white hover:bg-[hsl(var(--whatsapp-hover))]"
                      >
                        <MessageCircle className="h-4 w-4" /> Agendar agora
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TriageErrorBoundary>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---------- subcomponents ----------
const FunnelNav = ({
  onBack, onNext, canNext, nextLabel = "Continuar",
}: { onBack: () => void; onNext: () => void; canNext: boolean; nextLabel?: string }) => (
  <div className="flex gap-2 pt-1">
    <Button variant="outline" size="sm" onClick={onBack} className="gap-1">
      <ArrowLeft className="h-4 w-4" /> Voltar
    </Button>
    <Button onClick={onNext} disabled={!canNext} className="ml-auto gap-1">
      {nextLabel} <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
);

const InfoBox = ({ title, value }: { title: string; value: string }) => (
  <div className="rounded-lg border border-border bg-card/50 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
    <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
  </div>
);

const FallbackView = ({
  copied, onCopy, url,
}: { copied: boolean; onCopy: () => void; url: string }) => (
  <div className="space-y-3">
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-snug">
      <p className="font-semibold text-foreground">Não conseguimos abrir o WhatsApp automaticamente</p>
      <p className="mt-1 text-foreground/80">
        Seu navegador pode ter bloqueado a janela. Copie a mensagem da triagem e cole no WhatsApp, ou abra pelo botão abaixo. Suas respostas continuam salvas.
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={onCopy} className="gap-2">
        <Copy className="h-4 w-4" /> {copied ? "Copiado!" : "Copiar mensagem"}
      </Button>
      <Button asChild size="sm" variant="outline" className="gap-2">
        <a href={url} target="_blank" rel="noopener noreferrer" data-funnel-skip="1">
          <ExternalLink className="h-4 w-4" /> Abrir WhatsApp
        </a>
      </Button>
    </div>
  </div>
);

// Backward-compat export (componentes legados podem importar isto).
export const TransparencyNote = ({ className = "" }: { className?: string }) => (
  <p className={`text-xs text-muted-foreground leading-relaxed ${className}`}>
    📌 <strong>Transparência:</strong> Valor do atendimento inicial por WhatsApp. Visita técnica para PC/Notebook a partir de
    {" "}R$ 99,99 (30 min) · coleta e entrega a partir de R$ 299,99.{" "}
    <a href="/termos-e-condicoes" className="underline hover:text-foreground">Ver termos</a>
  </p>
);

export default WhatsAppFunnel;
