import { useEffect, useState } from "react";

/**
 * Barra de progresso de navegação (topo). Sobe rápido até ~90% enquanto a
 * rota carrega e completa em 100% ao terminar — feedback de progresso
 * contínuo, sem travar a leitura. Respeita prefers-reduced-motion via CSS.
 */
export const RouteProgress = ({ active }: { active: boolean }) => {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    let timeout = 0;

    if (active) {
      setVisible(true);
      setValue(8);
      const tick = () => {
        setValue((v) => (v >= 90 ? v : v + Math.max(0.6, (90 - v) / 14)));
        raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
    } else if (visible) {
      setValue(100);
      timeout = window.setTimeout(() => {
        setVisible(false);
        setValue(0);
      }, 260);
    }

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      if (timeout) window.clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Carregando página"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      className="route-progress"
    >
      <div className="route-progress-bar" style={{ width: `${value}%` }} />
    </div>
  );
};

export default RouteProgress;
