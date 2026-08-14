import { forwardRef } from "react";

import { cn } from "@/lib/utils";

/** Bloco base do skeleton (shimmer + reduced-motion safe). */
export const SkeletonBlock = forwardRef<HTMLSpanElement, { className?: string }>(
  ({ className }, ref) => (
    <span ref={ref} aria-hidden="true" className={cn("skeleton-block", className)} />
  ),
);
SkeletonBlock.displayName = "SkeletonBlock";

/** Linhas de texto simuladas. */
export const SkeletonText = forwardRef<HTMLSpanElement, { lines?: number; className?: string }>(
  ({ lines = 3, className }, ref) => (
  <span ref={ref} className={cn("block space-y-2", className)} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        className={cn("h-3.5 w-full", i === lines - 1 && "w-3/5")}
      />
    ))}
  </span>
  ),
);
SkeletonText.displayName = "SkeletonText";

/** Card genérico (imagem + título + texto). */
export const SkeletonCard = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
  <div ref={ref} className={cn("rounded-xl border border-border p-4", className)}>
    <SkeletonBlock className="h-32 w-full rounded-lg" />
    <SkeletonBlock className="mt-4 h-4 w-2/3" />
    <SkeletonText lines={2} className="mt-3" />
  </div>
  ),
);
SkeletonCard.displayName = "SkeletonCard";

/** Grade de cards para listas em carregamento. */
export const SkeletonCardGrid = ({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) => (
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    aria-label="Carregando conteúdo"
    className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/** KPIs / métricas em carregamento. */
export const SkeletonStats = ({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) => (
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    aria-label="Carregando métricas"
    className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border p-4">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="mt-3 h-7 w-16" />
      </div>
    ))}
  </div>
);

/** Tabela em carregamento. */
export const SkeletonTable = ({
  rows = 6,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) => (
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    aria-label="Carregando tabela"
    className={cn("rounded-xl border border-border p-4", className)}
  >
    <div className="flex gap-3 pb-3">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBlock key={i} className="h-3 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-3 border-t border-border py-3">
        {Array.from({ length: cols }).map((_, c) => (
          <SkeletonBlock key={c} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);
