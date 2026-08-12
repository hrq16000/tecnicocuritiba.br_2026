import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Classe aplicada ao wrapper (aspect/ratio, arredondamento). */
  wrapperClassName?: string;
  /** Imagem crítica (LCP): carrega com prioridade e sem skeleton. */
  priority?: boolean;
}

/**
 * Imagem real com skeleton shimmer + fade-in ao carregar.
 * - lazy loading nativo (exceto `priority`)
 * - reserva de espaço (sem CLS)
 * - respeita prefers-reduced-motion via CSS (.smart-img)
 */
export const SmartImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  priority = false,
  width = 600,
  height = 400,
  ...rest
}: SmartImageProps) => {
  const [loaded, setLoaded] = useState(priority);

  return (
    <span className={cn("smart-img-wrap", wrapperClassName)}>
      {!loaded && <span aria-hidden="true" className="smart-img-skeleton" />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cn("smart-img", loaded && "is-loaded", className)}
        {...rest}
      />
    </span>
  );
};

export default SmartImage;
