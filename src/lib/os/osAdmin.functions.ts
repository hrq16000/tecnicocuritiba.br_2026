// ─────────────────────────────────────────────────────────────
// SERVER FUNCTIONS ADMINISTRATIVAS DA ORDEM DE SERVIÇO
// Toda função exige sessão autenticada (requireSupabaseAuth) E papel
// admin verificado no servidor via has_role(). O RLS da tabela repete
// a mesma exigência: esconder o botão no frontend nunca é a fronteira.
// ─────────────────────────────────────────────────────────────
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

import { OS_STATUS, calcularValores, ehStatusOs, transicaoPermitida } from "./statusOs";
import { OS_TEMPLATES } from "./whatsappOs";

const pecaSchema = z.object({
  descricao: z.string().trim().min(1).max(120),
  quantidade: z.number().int().min(1).max(999),
  valorUnitario: z.number().min(0).max(1_000_000),
});

const dadosSchema = z.object({
  clienteNome: z.string().trim().min(2).max(120),
  telefone: z.string().trim().min(10).max(20),
  equipamento: z.string().trim().max(120).optional().default(""),
  marcaModelo: z.string().trim().max(120).optional().default(""),
  numeroSerie: z.string().trim().max(80).optional().default(""),
  sintomas: z.string().trim().max(4000).optional().default(""),
  diagnostico: z.string().trim().max(4000).optional().default(""),
  servicoExecutado: z.string().trim().max(4000).optional().default(""),
  observacoes: z.string().trim().max(4000).optional().default(""),
  tecnicoResponsavel: z.string().trim().max(80).optional().default(""),
  modalidade: z.string().trim().max(40).optional().default(""),
  pecas: z.array(pecaSchema).max(40).optional().default([]),
  valorServicos: z.number().min(0).max(1_000_000).optional().default(0),
  desconto: z.number().min(0).max(1_000_000).optional().default(0),
  pagamentoStatus: z.enum(["pendente", "parcial", "pago", "isento"]).optional().default("pendente"),
  previsaoConclusao: z.string().trim().max(40).optional().default(""),
});

export interface OsAdminRow {
  id: string;
  protocolo: string;
  clienteNome: string | null;
  telefone: string;
  equipamento: string | null;
  marcaModelo: string | null;
  numeroSerie: string | null;
  sintomas: string | null;
  diagnostico: string | null;
  servicoExecutado: string | null;
  observacoes: string | null;
  tecnicoResponsavel: string | null;
  modalidade: string | null;
  status: string;
  pagamentoStatus: string;
  pecas: { descricao: string; quantidade: number; valorUnitario: number }[];
  valorServicos: number;
  valorPecas: number;
  desconto: number;
  total: number;
  previsaoConclusao: string | null;
  abertaEm: string;
  concluidaEm: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

const COLUNAS =
  "id, protocolo, cliente_nome, telefone, equipamento, marca_modelo, numero_serie, sintomas, diagnostico, servico_executado, observacoes, tecnico_responsavel, modalidade, status, pagamento_status, pecas, valor_servicos, valor_pecas, desconto, total, previsao_conclusao, aberta_em, concluida_em, created_at, updated_at";

/* eslint-disable @typescript-eslint/no-explicit-any */
const mapear = (r: any): OsAdminRow => ({
  id: r.id,
  protocolo: r.protocolo,
  clienteNome: r.cliente_nome,
  telefone: r.telefone,
  equipamento: r.equipamento,
  marcaModelo: r.marca_modelo,
  numeroSerie: r.numero_serie ?? null,
  sintomas: r.sintomas,
  diagnostico: r.diagnostico ?? null,
  servicoExecutado: r.servico_executado ?? null,
  observacoes: r.observacoes_publicas ?? r.observacoes ?? null,
  tecnicoResponsavel: r.tecnico_responsavel ?? null,
  modalidade: r.modalidade,
  status: r.status,
  pagamentoStatus: r.pagamento_status ?? "pendente",
  pecas: Array.isArray(r.pecas) ? r.pecas : [],
  valorServicos: Number(r.valor_servicos ?? 0),
  valorPecas: Number(r.valor_pecas ?? 0),
  desconto: Number(r.desconto ?? 0),
  total: Number(r.total ?? 0),
  previsaoConclusao: r.previsao_conclusao ?? null,
  abertaEm: r.aberta_em ?? r.created_at,
  concluidaEm: r.concluida_em ?? null,
  criadoEm: r.created_at,
  atualizadoEm: r.updated_at,
});
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Falha fechada: sem papel admin no banco, nada é lido ou escrito. */
async function exigirAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || data !== true) throw new Error("Acesso negado.");
}

const protocoloSchema = z.object({
  protocolo: z
    .string()
    .trim()
    .regex(/^OS-\d{8}-[A-Z0-9]{4}$/i)
    .transform((v) => v.toUpperCase()),
});

export const listarOrdens = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        busca: z.string().trim().max(80).optional().default(""),
        status: z.string().trim().max(40).optional().default(""),
        tecnico: z.string().trim().max(80).optional().default(""),
        desde: z.string().trim().max(30).optional().default(""),
        ate: z.string().trim().max(30).optional().default(""),
        pagina: z.number().int().min(1).max(500).optional().default(1),
        porPagina: z.number().int().min(5).max(100).optional().default(20),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ itens: OsAdminRow[]; total: number }> => {
    await exigirAdmin(context);
    const de = (data.pagina - 1) * data.porPagina;
    let q = context.supabase
      .from("ordens_servico")
      .select(COLUNAS, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(de, de + data.porPagina - 1);

    if (data.status && ehStatusOs(data.status)) q = q.eq("status", data.status);
    if (data.tecnico) q = q.ilike("tecnico_responsavel", `%${data.tecnico}%`);
    if (data.desde) q = q.gte("created_at", data.desde);
    if (data.ate) q = q.lte("created_at", data.ate);
    if (data.busca) {
      const termo = data.busca.replace(/[%,()]/g, " ");
      q = q.or(
        `protocolo.ilike.%${termo}%,cliente_nome.ilike.%${termo}%,telefone.ilike.%${termo}%,equipamento.ilike.%${termo}%`,
      );
    }

    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);
    return { itens: (rows ?? []).map(mapear), total: count ?? 0 };
  });

export interface OsEvento {
  id: string;
  tipo: string;
  descricao: string;
  deStatus: string | null;
  paraStatus: string | null;
  ator: string | null;
  em: string;
}

export interface OsLembrete {
  id: string;
  tipo: string;
  quando: string;
  status: string;
  responsavel: string | null;
  observacao: string | null;
}

export const obterOrdem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => protocoloSchema.parse(input))
  .handler(
    async ({
      data,
      context,
    }): Promise<{ ordem: OsAdminRow; eventos: OsEvento[]; lembretes: OsLembrete[] } | null> => {
      await exigirAdmin(context);
      const { data: row, error } = await context.supabase
        .from("ordens_servico")
        .select(COLUNAS)
        .eq("protocolo", data.protocolo)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!row) return null;
      const ordem = mapear(row);

      const [{ data: eventos }, { data: lembretes }] = await Promise.all([
        context.supabase
          .from("os_eventos")
          .select("id, tipo, descricao, de_status, para_status, ator_email, created_at")
          .eq("ordem_id", ordem.id)
          .order("created_at", { ascending: false }),
        context.supabase
          .from("os_lembretes")
          .select("id, tipo, quando, status, responsavel, observacao")
          .eq("ordem_id", ordem.id)
          .order("quando", { ascending: true }),
      ]);

      return {
        ordem,
        /* eslint-disable @typescript-eslint/no-explicit-any */
        eventos: (eventos ?? []).map((e: any) => ({
          id: e.id,
          tipo: e.tipo,
          descricao: e.descricao,
          deStatus: e.de_status,
          paraStatus: e.para_status,
          ator: e.ator_email,
          em: e.created_at,
        })),
        lembretes: (lembretes ?? []).map((l: any) => ({
          id: l.id,
          tipo: l.tipo,
          quando: l.quando,
          status: l.status,
          responsavel: l.responsavel,
          observacao: l.observacao,
        })),
        /* eslint-enable @typescript-eslint/no-explicit-any */
      };
    },
  );

async function registrarEvento(
  context: { supabase: any; userId: string; claims?: Record<string, unknown> },
  ordemId: string,
  tipo: string,
  descricao: string,
  status?: { de?: string | null; para?: string | null },
) {
  await context.supabase.from("os_eventos").insert({
    ordem_id: ordemId,
    tipo,
    descricao,
    de_status: status?.de ?? null,
    para_status: status?.para ?? null,
    ator_id: context.userId,
    ator_email: (context.claims?.["email"] as string | undefined) ?? null,
  });
}

function gerarProtocolo(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let sufixo = "";
  for (let i = 0; i < 4; i += 1) {
    sufixo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return `OS-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${sufixo}`;
}

export const criarOrdemAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => dadosSchema.parse(input))
  .handler(async ({ data, context }): Promise<{ protocolo: string }> => {
    await exigirAdmin(context);
    const valores = calcularValores({
      valorServicos: data.valorServicos,
      pecas: data.pecas,
      desconto: data.desconto,
    });
    const protocolo = gerarProtocolo();
    const { data: row, error } = await context.supabase
      .from("ordens_servico")
      .insert({
        protocolo,
        cliente_nome: data.clienteNome,
        telefone: data.telefone,
        equipamento: data.equipamento || null,
        marca_modelo: data.marcaModelo || null,
        numero_serie: data.numeroSerie || null,
        sintomas: data.sintomas || null,
        diagnostico: data.diagnostico || null,
        servico_executado: data.servicoExecutado || null,
        observacoes_publicas: data.observacoes || null,
        tecnico_responsavel: data.tecnicoResponsavel || null,
        modalidade: data.modalidade || null,
        status: "ABERTA",
        pagamento_status: data.pagamentoStatus,
        pecas: data.pecas,
        valor_servicos: valores.valorServicos,
        valor_pecas: valores.valorPecas,
        desconto: valores.desconto,
        total: valores.total,
        previsao_conclusao: data.previsaoConclusao || null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await registrarEvento(context, row.id, "CRIACAO", `Ordem ${protocolo} aberta.`, {
      para: "ABERTA",
    });
    return { protocolo };
  });

export const atualizarOrdem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ protocolo: protocoloSchema.shape.protocolo, dados: dadosSchema }).parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await exigirAdmin(context);
    const d = data.dados;
    const valores = calcularValores({
      valorServicos: d.valorServicos,
      pecas: d.pecas,
      desconto: d.desconto,
    });
    const { data: antes, error: erroAntes } = await context.supabase
      .from("ordens_servico")
      .select("id, total, desconto, diagnostico")
      .eq("protocolo", data.protocolo)
      .maybeSingle();
    if (erroAntes) throw new Error(erroAntes.message);
    if (!antes) throw new Error("Ordem de serviço não encontrada.");

    const { error } = await context.supabase
      .from("ordens_servico")
      .update({
        cliente_nome: d.clienteNome,
        telefone: d.telefone,
        equipamento: d.equipamento || null,
        marca_modelo: d.marcaModelo || null,
        numero_serie: d.numeroSerie || null,
        sintomas: d.sintomas || null,
        diagnostico: d.diagnostico || null,
        servico_executado: d.servicoExecutado || null,
        observacoes_publicas: d.observacoes || null,
        tecnico_responsavel: d.tecnicoResponsavel || null,
        modalidade: d.modalidade || null,
        pagamento_status: d.pagamentoStatus,
        pecas: d.pecas,
        valor_servicos: valores.valorServicos,
        valor_pecas: valores.valorPecas,
        desconto: valores.desconto,
        total: valores.total,
        previsao_conclusao: d.previsaoConclusao || null,
      })
      .eq("id", antes.id);
    if (error) throw new Error(error.message);

    const mudancas: string[] = [];
    if (Number(antes.total) !== valores.total) mudancas.push("valor total");
    if (Number(antes.desconto) !== valores.desconto) mudancas.push("desconto");
    if ((antes.diagnostico ?? "") !== (d.diagnostico ?? "")) mudancas.push("diagnóstico");
    await registrarEvento(
      context,
      antes.id,
      mudancas.length ? "ALTERACAO_CRITICA" : "EDICAO",
      mudancas.length ? `Alteração de ${mudancas.join(", ")}.` : "Dados da ordem atualizados.",
    );
    return { ok: true };
  });

export const alterarStatusOrdem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        protocolo: protocoloSchema.shape.protocolo,
        status: z.enum(OS_STATUS),
        nota: z.string().trim().max(300).optional().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await exigirAdmin(context);
    const { data: atual, error: erroAtual } = await context.supabase
      .from("ordens_servico")
      .select("id, status")
      .eq("protocolo", data.protocolo)
      .maybeSingle();
    if (erroAtual) throw new Error(erroAtual.message);
    if (!atual) throw new Error("Ordem de serviço não encontrada.");

    const de = ehStatusOs(atual.status) ? atual.status : "ABERTA";
    if (!transicaoPermitida(de, data.status)) {
      throw new Error(`Transição inválida: ${de} → ${data.status}.`);
    }

    const patch: Record<string, unknown> = { status: data.status };
    if (data.status === "CONCLUIDA") patch["concluida_em"] = new Date().toISOString();

    const { error } = await context.supabase
      .from("ordens_servico")
      .update(patch)
      .eq("id", atual.id);
    if (error) throw new Error(error.message);

    await registrarEvento(
      context,
      atual.id,
      "STATUS",
      data.nota ? `Status alterado. ${data.nota}` : "Status alterado.",
      { de, para: data.status },
    );
    return { ok: true };
  });

export const registrarMensagemPreparada = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ protocolo: protocoloSchema.shape.protocolo, template: z.enum(OS_TEMPLATES) })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await exigirAdmin(context);
    const { data: row } = await context.supabase
      .from("ordens_servico")
      .select("id")
      .eq("protocolo", data.protocolo)
      .maybeSingle();
    if (!row) throw new Error("Ordem de serviço não encontrada.");
    // MESSAGE_PREPARED: geramos apenas o deep link. Nenhuma prova de envio.
    await registrarEvento(
      context,
      row.id,
      "MESSAGE_PREPARED",
      `Mensagem preparada no WhatsApp (${data.template}).`,
    );
    return { ok: true };
  });

export const registrarPdfOrdem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        protocolo: protocoloSchema.shape.protocolo,
        docHash: z.string().trim().regex(/^[a-f0-9]{16,64}$/i),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ versao: number }> => {
    await exigirAdmin(context);
    const { data: row } = await context.supabase
      .from("ordens_servico")
      .select("id")
      .eq("protocolo", data.protocolo)
      .maybeSingle();
    if (!row) throw new Error("Ordem de serviço não encontrada.");

    const { data: ultimos } = await context.supabase
      .from("os_pdf_snapshots")
      .select("versao, doc_hash")
      .eq("ordem_id", row.id)
      .order("versao", { ascending: false })
      .limit(1);
    const ultimo = ultimos?.[0];
    if (ultimo?.doc_hash === data.docHash) return { versao: ultimo.versao };

    const versao = (ultimo?.versao ?? 0) + 1;
    await context.supabase.from("os_pdf_snapshots").insert({
      ordem_id: row.id,
      versao,
      doc_hash: data.docHash,
      generated_by: context.userId,
      generated_by_email: (context.claims?.["email"] as string | undefined) ?? null,
    });
    await registrarEvento(context, row.id, "PDF", `PDF gerado (versão ${versao}).`);
    return { versao };
  });

export const salvarLembrete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        protocolo: protocoloSchema.shape.protocolo,
        tipo: z.string().trim().min(2).max(60),
        quando: z.string().trim().min(10).max(40),
        responsavel: z.string().trim().max(80).optional().default(""),
        observacao: z.string().trim().max(300).optional().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await exigirAdmin(context);
    const { data: row } = await context.supabase
      .from("ordens_servico")
      .select("id")
      .eq("protocolo", data.protocolo)
      .maybeSingle();
    if (!row) throw new Error("Ordem de serviço não encontrada.");
    const { error } = await context.supabase.from("os_lembretes").insert({
      ordem_id: row.id,
      tipo: data.tipo,
      quando: new Date(data.quando).toISOString(),
      responsavel: data.responsavel || null,
      observacao: data.observacao || null,
      created_by: context.userId,
    });
    if (error) throw new Error(error.message);
    await registrarEvento(context, row.id, "LEMBRETE", `Lembrete criado (${data.tipo}).`);
    return { ok: true };
  });

export const concluirLembrete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await exigirAdmin(context);
    const { error } = await context.supabase
      .from("os_lembretes")
      .update({ status: "concluido" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
