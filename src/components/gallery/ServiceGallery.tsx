import { memo } from "react";

export interface ServiceGalleryImage {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}

interface ServiceGalleryProps {
  title: string;
  subtitle?: string;
  images: ServiceGalleryImage[];
  id?: string;
}

/**
 * Galeria responsiva "o que está incluso no atendimento".
 * - `loading="lazy"` + `decoding="async"` para preservar LCP fora do fold.
 * - Fonte de imagens é externa (Unsplash CDN já responde em WebP quando o
 *   browser envia `Accept: image/webp`, mantido pelo `auto=format` na URL).
 * - Cada `<figure>` tem alt e legenda visíveis para acessibilidade e SEO.
 */
export const ServiceGallery = memo(function ServiceGallery({
  title,
  subtitle,
  images,
  id,
}: ServiceGalleryProps) {
  return (
    <section id={id} className="py-10 md:py-14 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">{title}</h2>
            {subtitle && (
              <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => {
              // Constrói srcset para Unsplash (fmt=webp via `auto=format`).
              // Fallback: usa a src original se não for URL do Unsplash.
              const isUnsplash = /images\.unsplash\.com/.test(img.src);
              const base = img.src.replace(/([?&])w=\d+/, "$1").replace(/&&+/g, "&");
              const buildSrc = (w: number) =>
                isUnsplash
                  ? `${base}${base.includes("?") ? "&" : "?"}w=${w}&auto=format&fit=crop&q=70`
                  : img.src;
              const srcSet = isUnsplash
                ? [400, 600, 900].map((w) => `${buildSrc(w)} ${w}w`).join(", ")
                : undefined;
              const w = img.width || 600;
              const h = img.height || 400;
              return (
                <figure
                  key={img.src}
                  className="rounded-xl overflow-hidden bg-background border border-border shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Wrapper com aspect-ratio fixo evita CLS enquanto a imagem carrega,
                      mesmo antes do <img loading="lazy" decoding="async"> ter dimensões pintadas pelo browser. */}
                  <div
                    className="w-full bg-muted/40"
                    style={{ aspectRatio: `${w} / ${h}` }}
                  >
                    <img
                      src={buildSrc(600)}
                      srcSet={srcSet}
                      // sizes refinado: mobile pequeno tem 1 coluna full-width,
                      // tablet 2 colunas (50vw), desktop grid de 3 (~360px).
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      // Galeria fica sempre abaixo do fold → nunca é LCP.
                      fetchPriority="low"
                      width={w}
                      height={h}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="p-3 text-xs md:text-sm text-muted-foreground text-center italic">
                    {img.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
});
