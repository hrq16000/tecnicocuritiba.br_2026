import { creditFor } from "@/lib/imageCredits";

/** Crédito factual de foto remota exibido junto à própria imagem. */
export function ImageLicenseCaption({ src }: { src: string }) {
  if (!/^https:\/\/(images\.unsplash\.com|images\.pexels\.com)\//i.test(src)) return null;
  const credit = creditFor(src);
  return (
    <figcaption className="px-3 py-2 text-xs text-muted-foreground text-center bg-background">
      <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">
        {credit.creditText}
      </a>
    </figcaption>
  );
}
