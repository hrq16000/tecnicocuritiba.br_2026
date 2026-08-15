import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "@/lib/router-compat";
import { brandsData } from "@/lib/brandsData";

const animations = [
  "animate-brand-flip",
  "animate-brand-zoom",
  "animate-brand-slide-up",
  "animate-brand-slide-down",
  "animate-brand-rotate",
  "animate-brand-blur-in",
  "animate-brand-bounce-in",
  "animate-brand-glitch",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const TechBrandsMarquee = () => {
  const [visibleBrands, setVisibleBrands] = useState<
    { slug: string; name: string; logoPath: string; color: string; anim: string; key: number }[]
  >([]);
  const keyRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const generate = useCallback(() => {
    const shuffled = shuffle(brandsData).slice(0, 8);
    keyRef.current++;
    setVisibleBrands(
      shuffled.map((brand, i) => ({
        slug: brand.slug,
        name: brand.name,
        logoPath: brand.logoPath,
        color: brand.color,
        anim: animations[Math.floor(Math.random() * animations.length)],
        key: keyRef.current * 100 + i,
      }))
    );
  }, []);

  useEffect(() => {
    generate();
    intervalRef.current = setInterval(generate, 4000);
    return () => clearInterval(intervalRef.current);
  }, [generate]);

  return (
    <section className="py-8 md:py-10 bg-muted/30 border-y border-border/50 overflow-hidden relative">
      <div className="container mx-auto mb-5">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest font-medium">
          Marcas que atendemos
        </p>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 items-center justify-items-center min-h-[60px]">
          {visibleBrands.map((b) => (
            <Link
              key={b.key}
              to={`/marcas/${b.slug}`}
              className={`${b.anim} select-none group flex flex-col items-center gap-1.5 hover:scale-110 transition-transform duration-300`}
              title={`Assistência Técnica ${b.name}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 md:w-9 md:h-9 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_var(--brand-shadow)]"
                fill="currentColor"
                stroke="none"
                style={{
                  color: b.color === "#000000" ? "hsl(var(--muted-foreground))" : b.color,
                  ["--brand-shadow" as string]: `${b.color}80`,
                }}
              >
                <path d={b.logoPath} />
              </svg>
              <span className="text-muted-foreground font-heading font-bold text-[11px] md:text-xs tracking-wide group-hover:text-accent transition-colors duration-300 text-center leading-tight">
                {b.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
