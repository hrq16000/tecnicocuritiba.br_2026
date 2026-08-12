/**
 * Tokens de movimento (design-motion-principles).
 * Fonte única de duração/easing para toda a interface. Nunca hardcodar
 * durações novas em componentes — importe daqui.
 */
export const MOTION_DURATION = {
  /** micro-feedback: hover, press, toggles */
  instant: 120,
  /** entrada de elementos pequenos (badges, ícones, chips) */
  fast: 200,
  /** padrão: cards, seções, modais */
  base: 320,
  /** transições amplas (overlays de página, drawers) */
  slow: 480,
} as const;

export const MOTION_EASING = {
  /** entrada: rápido no começo, desacelera (natural) */
  enter: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** saída: acelera para fora */
  exit: "cubic-bezier(0.4, 0, 1, 1)",
  /** movimento contínuo (progresso, loops) */
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** ênfase leve com overshoot controlado */
  emphasis: "cubic-bezier(0.34, 1.4, 0.64, 1)",
} as const;

/** Atraso escalonado, limitado para nunca atrasar a leitura. */
export const staggerDelay = (index: number, step = 60, max = 360) =>
  Math.min(index * step, max);

/** true quando o usuário pediu menos movimento (SSR-safe). */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
