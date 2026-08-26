import { z } from "zod";

export const BairroDataSchema = z.object({
  nome: z.string().min(1),
  slug: z.string().min(1),
  cidade: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  h1: z.string().min(1),
  subtitulo: z.string().min(1),
  descricaoLonga: z.string().min(1),
  pontosReferencia: z.array(z.string()),
  tempoDeslocamento: z.string().min(1),
  servicosDestaque: z.array(z.string()).min(1),
  conteudoExclusivo: z.string().optional(),
  problemasComuns: z.array(z.string()).optional(),
  dicasLocais: z.array(z.string().min(1)).min(1).optional(),
  indexavel: z.boolean().optional(),
});

export type BairroData = z.infer<typeof BairroDataSchema>;
