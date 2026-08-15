import { useEffect } from 'react';
import { useLocation } from '@/lib/router-compat';
import { initScrollAnimations, cleanupScrollAnimations } from '@/lib/scrollAnimations';

/**
 * Hook that initializes global scroll animations after each route change.
 * Waits for React to finish rendering before scanning the DOM.
 */
export function useScrollAnimations() {
  const location = useLocation();

  useEffect(() => {
    const run = () => initScrollAnimations();
    const idleId = typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(run, { timeout: 2500 })
      : window.setTimeout(run, 1200);

    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      cleanupScrollAnimations();
    };
  }, [location.pathname]);
}
