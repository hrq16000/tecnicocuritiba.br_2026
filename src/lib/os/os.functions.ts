import { createServerFn } from "@tanstack/react-start";
import { randomInt } from "crypto";
import { z } from "zod";

import { TERMOS_VERSAO } from "./termosOs";

const textoCurto = z.string().trim().max(120);

const criarSchema = z.object({
  tipo: z.enum(["visita", "laboratorio"]),
  nome: z.string().trim().min(2).max(80),
  local: textoCurto.optional().default(""),
  equipamento: z.string().trim().min(2).max(80),
  marcaModelo: textoCurto.optional().default(""),
  acessorios: textoCurto.optional().default(""),
  sintoma: z.string().trim().min(5).max(1000),
  modalidadeId: z.string().trim().min(2).max(40),
  valorLabel: z.string().trim().min(2).max(60),
});

const consultarSchema = z.object({
  protocolo: z
    .string()
    .trim()
    .regex(/^OS-\d{8}-[A-Z0-9]{4}$/i, "Protocolo inválido")
    .transform((v) => v.toUpperCase()),
});

function gerarProtocolo(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let sufixo = "";
  for (let i = 0; i < 4; i += 1) sufixo += alfabeto[randomInt(alfabeto.length)];
  return `OS-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${sufixo}`;
}

/** Cria a ordem de serviço e devolve o protocolo público de consulta. */
export const criarOs = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => criarSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Contenção simples de abuso: limite global de aberturas por janela curta.
    const desde = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("os_publicas")
      .select("id", { count: "exact", head: true })
      .gte("created_at", desde);
    if ((count ?? 0) >= 30) {
      throw new Error("Muitas ordens abertas em sequência. Tente novamente em alguns minutos.");
    }

    let ultimoErro: string | null = null;
    for (let tentativa = 0; tentativa < 5; tentativa += 1) {
      const protocolo = gerarProtocolo();
      const { error } = await supabaseAdmin.from("os_publicas").insert({
        protocolo,
        tipo: data.tipo,
        nome: data.nome,
        local: data.local || null,
        equipamento: data.equipamento,
        marca_modelo: data.marcaModelo || null,
        acessorios: data.acessorios || null,
        sintoma: data.sintoma,
        modalidade_id: data.modalidadeId,
        valor_label: data.valorLabel,
        termos_versao: TERMOS_VERSAO,
      });
      if (!error) return { protocolo };
      ultimoErro = error.message;
      if (!error.message.includes("duplicate key")) break;
    }

    console.error("[os] falha ao registrar ordem de serviço", ultimoErro);
    throw new Error("Não foi possível registrar a ordem de serviço agora.");
  });

export interface OsPublica {
  protocolo: string;
  tipo: "visita" | "laboratorio";
  nome: string;
  local: string | null;
  equipamento: string;
  marcaModelo: string | null;
  acessorios: string | null;
  sintoma: string;
  modalidadeId: string;
  valorLabel: string;
  status: string;
  criadoEm: string;
}

/** Consulta pública por protocolo — devolve apenas campos seguros. */
export const consultarOs = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => consultarSchema.parse(input))
  .handler(async ({ data }): Promise<OsPublica | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("os_publicas")
      .select(
        "protocolo, tipo, nome, local, equipamento, marca_modelo, acessorios, sintoma, modalidade_id, valor_label, status, created_at",
      )
      .eq("protocolo", data.protocolo)
      .maybeSingle();

    if (error) {
      console.error("[os] falha ao consultar ordem de serviço", error.message);
      throw new Error("Não foi possível consultar a ordem de serviço agora.");
    }
    if (!row) return null;

    const primeiroNome = row.nome.split(/\s+/)[0] ?? row.nome;
    return {
      protocolo: row.protocolo,
      tipo: row.tipo === "laboratorio" ? "laboratorio" : "visita",
      nome: primeiroNome,
      local: row.local,
      equipamento: row.equipamento,
      marcaModelo: row.marca_modelo,
      acessorios: row.acessorios,
      sintoma: row.sintoma,
      modalidadeId: row.modalidade_id,
      valorLabel: row.valor_label,
      status: row.status,
      criadoEm: row.created_at,
    };
  });
