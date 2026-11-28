import { creditFor, LICENSE_SOURCES } from "@/lib/imageCredits";

/** Atribuição visível e vinculada à figura, usando o contrato de licenças existente. */
export function LicensedPhotoCaption({
  src,
  caption,
  className = "mt-2 text-center text-xs text-muted-foreground",
}: { src: string; caption?: string; className?: string }) {
  let host = "";
  try { host = new URL(src).hostname; } catch { /* assets locais usam caminhos relativos */ }
  const credit = host === LICENSE_SOURCES.unsplash.host || host === LICENSE_SOURCES.pexels.host
    ? creditFor(src)
    : null;
  if (!caption && !credit) return null;

  return (
    <figcaption className={className}>
      {caption && <span className="block italic">{caption}</span>}
      {credit && (
        <span className="block">
          {credit.creditText} ·{" "}
          <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {credit.license}
          </a>
        </span>
      )}
    </figcaption>
  );
}
