// ─────────────────────────────────────────────────────────────
// PDF PROFISSIONAL DA ORDEM DE SERVIÇO (uso administrativo)
// Regra de integridade: só imprime o que existe na O.S. Campo vazio
// não vira linha, e nada de garantia/prazo/CNPJ/assinatura é
// inventado — se não houver fonte confiável, o bloco é omitido.
// ─────────────────────────────────────────────────────────────
import { createPdf, downloadBlob } from "@/lib/pdfDoc";
import { siteConfig } from "@/lib/siteConfig";
import { OS_STATUS_LABEL, formatarBRL, type OsStatus } from "./statusOs";
import type { OsAdminRow } from "./osAdmin.functions";

const fmtData = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : null;

const texto = (v?: string | null) => {
  const s = (v ?? "").trim();
  return s || null;
};

const PAGAMENTO_LABEL: Record<string, string> = {
  pendente: "Pagamento pendente",
  parcial: "Pagamento parcial",
  pago: "Pago",
  isento: "Isento",
};

/** SHA-256 do conteúdo textual do documento — usado para versionar snapshots. */
export async function hashDocumento(conteudo: string): Promise<string> {
  const bytes = new TextEncoder().encode(conteudo);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Assinatura textual determinística do estado da O.S. no momento da geração. */
export function assinaturaOrdem(os: OsAdminRow): string {
  return JSON.stringify({
    protocolo: os.protocolo,
    cliente: os.clienteNome,
    equipamento: [os.equipamento, os.marcaModelo, os.numeroSerie],
    sintomas: os.sintomas,
    diagnostico: os.diagnostico,
    servico: os.servicoExecutado,
    pecas: os.pecas,
    valores: [os.valorServicos, os.valorPecas, os.desconto, os.total],
    status: os.status,
    pagamento: os.pagamentoStatus,
    tecnico: os.tecnicoResponsavel,
  });
}

/** Gera, baixa e devolve o hash do PDF (para registro de versão/auditoria). */
export async function baixarPdfOrdemAdmin(os: OsAdminRow): Promise<string> {
  const pdf = await createPdf();
  const geradoEm = fmtData(new Date().toISOString());

  pdf.title(`Ordem de serviço ${os.protocolo}`);
  pdf.paragraph(`${siteConfig.brandName} — ${siteConfig.domain}`, { muted: true });
  if (geradoEm) pdf.paragraph(`Documento gerado em ${geradoEm}.`, { muted: true });
  pdf.rule();

  pdf.heading("Situação");
  pdf.keyValue("Situação", OS_STATUS_LABEL[os.status as OsStatus] ?? os.status);
  const aberta = fmtData(os.abertaEm);
  if (aberta) pdf.keyValue("Abertura", aberta);
  if (texto(os.previsaoConclusao)) pdf.keyValue("Previsão", texto(os.previsaoConclusao)!);
  const concluida = fmtData(os.concluidaEm);
  if (concluida) pdf.keyValue("Conclusão", concluida);
  if (texto(os.tecnicoResponsavel)) pdf.keyValue("Responsável", texto(os.tecnicoResponsavel)!);

  pdf.heading("Cliente");
  if (texto(os.clienteNome)) pdf.keyValue("Nome", texto(os.clienteNome)!);
  if (texto(os.telefone)) pdf.keyValue("Contato", texto(os.telefone)!);

  pdf.heading("Equipamento");
  if (texto(os.equipamento)) pdf.keyValue("Tipo", texto(os.equipamento)!);
  if (texto(os.marcaModelo)) pdf.keyValue("Marca/modelo", texto(os.marcaModelo)!);
  if (texto(os.numeroSerie)) pdf.keyValue("Número de série", texto(os.numeroSerie)!);

  if (texto(os.sintomas)) {
    pdf.heading("Problema relatado");
    pdf.paragraph(texto(os.sintomas)!);
  }
  if (texto(os.diagnostico)) {
    pdf.heading("Diagnóstico técnico");
    pdf.paragraph(texto(os.diagnostico)!);
  }
  if (texto(os.servicoExecutado)) {
    pdf.heading("Serviço executado");
    pdf.paragraph(texto(os.servicoExecutado)!);
  }
  if (os.pecas.length) {
    pdf.heading("Peças utilizadas");
    for (const p of os.pecas) {
      pdf.bullet(
        `${p.quantidade}× ${p.descricao}`,
        `${formatarBRL(p.valorUnitario)} cada · ${formatarBRL(p.quantidade * p.valorUnitario)}`,
      );
    }
  }

  pdf.heading("Valores");
  if (os.valorServicos > 0) pdf.keyValue("Serviços", formatarBRL(os.valorServicos));
  if (os.valorPecas > 0) pdf.keyValue("Peças", formatarBRL(os.valorPecas));
  if (os.desconto > 0) pdf.keyValue("Desconto", `− ${formatarBRL(os.desconto)}`);
  pdf.keyValue("Total", formatarBRL(os.total));
  pdf.keyValue("Situação do pagamento", PAGAMENTO_LABEL[os.pagamentoStatus] ?? os.pagamentoStatus);

  if (texto(os.observacoes)) {
    pdf.heading("Observações");
    pdf.paragraph(texto(os.observacoes)!);
  }

  pdf.space(10);
  pdf.footer(`${siteConfig.brandName} · O.S. ${os.protocolo}`);

  downloadBlob(pdf.blob(), `os-${os.protocolo}.pdf`);
  return hashDocumento(assinaturaOrdem(os));
}
