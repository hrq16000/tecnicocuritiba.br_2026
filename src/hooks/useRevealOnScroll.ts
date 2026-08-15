import { useEffect } from "react";
import { useLocation } from "@/lib/router-compat";

const REVEAL_SELECTOR = ".reveal-text, .reveal-text-left, .reveal-text-right, .reveal-scale";

/**
 * Re-initializes reveal elements on every route change so hero titles,
 * subtitles and CTAs never stay invisible after navigation.
 */
export function useRevealOnScroll() {
  const location = useLocation();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (!elements.length) return;

    const revealElement = (el: HTMLElement) => {
      const delay = Number.parseInt(el.dataset.revealDelay || "0", 10);
      if (delay > 0) {
        window.setTimeout(() => el.classList.add("revealed"), delay);
      } else {
        el.classList.add("revealed");
      }
    };

    elements.forEach((el) => el.classList.remove("revealed"));

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      elements.forEach(revealElement);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealElement(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    const fallbackFrame = window.requestAnimationFrame(() => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          revealElement(el);
          observer.unobserve(el);
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(fallbackFrame);
      observer.disconnect();
    };
  }, [location.pathname]);
}
