import { creditFor, LICENSE_SOURCES } from "@/lib/imageCredits";

/** Crédito visível junto da foto; não atribui licença a um host desconhecido. */
export function PhotoCaption({ src, caption }: { src: string; caption?: string | undefined }) {
  let hostname: string | undefined;
  try { hostname = new URL(src).hostname; } catch { /* asset local */ }
  const licensed = hostname === LICENSE_SOURCES.unsplash.host || hostname === LICENSE_SOURCES.pexels.host;
  const credit = licensed ? creditFor(src) : null;
  if (!caption && !credit) return null;

  return (
    <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">
      {caption && <span>{caption}</span>}
      {credit && (
        <span className="block not-italic">
          {credit.creditText} · <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{credit.license}</a>
        </span>
      )}
    </figcaption>
  );
}
