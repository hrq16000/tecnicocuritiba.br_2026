import metadata from "@/data/problema-route-meta.generated.json";

export interface ProblemaRouteMeta {
  title: string;
  metaDescription: string;
  h1: string;
}

/** Não importa o corpo editorial para validar a URL ou construir o head. */
export function getProblemaRouteMeta(slug: string): ProblemaRouteMeta | undefined {
  if (!Object.prototype.hasOwnProperty.call(metadata, slug)) return undefined;
  return (metadata as Record<string, ProblemaRouteMeta>)[slug];
}

export const getAllProblemaRouteSlugs = () => Object.keys(metadata);
