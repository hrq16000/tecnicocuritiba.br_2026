import { describe, expect, it } from "vitest";
import {
  OS_STATUS,
  calcularValores,
  ehStatusOs,
  proximosStatus,
  transicaoPermitida,
} from "@/lib/os/statusOs";
import { OS_TEMPLATES, linkWhatsAppOs, montarMensagemOs } from "@/lib/os/whatsappOs";
import { assinaturaOrdem } from "@/lib/os/osAdminPdf";

describe("status da O.S.", () => {
  it("reconhece apenas status válidos", () => {
    expect(ehStatusOs("ABERTA")).toBe(true);
    expect(ehStatusOs("QUALQUER")).toBe(false);
  });

  it("permite o fluxo natural e bloqueia saltos incoerentes", () => {
    expect(transicaoPermitida("ABERTA", "AGUARDANDO_DIAGNOSTICO")).toBe(true);
    expect(transicaoPermitida("EM_ATENDIMENTO", "CONCLUIDA")).toBe(true);
    expect(transicaoPermitida("ABERTA", "ENTREGUE")).toBe(false);
    expect(transicaoPermitida("ENTREGUE", "ABERTA")).toBe(false);
    expect(transicaoPermitida("CANCELADA", "EM_ATENDIMENTO")).toBe(false);
    expect(transicaoPermitida("ABERTA", "ABERTA")).toBe(false);
  });

  it("estados terminais não têm continuação", () => {
    expect(proximosStatus("ENTREGUE")).toHaveLength(0);
    expect(proximosStatus("CANCELADA")).toHaveLength(0);
  });

  it("cancelamento é possível em todo estado aberto", () => {
    const abertos = OS_STATUS.filter((s) => !["CONCLUIDA", "ENTREGUE", "CANCELADA"].includes(s));
    for (const s of abertos) expect(proximosStatus(s)).toContain("CANCELADA");
  });
});

describe("cálculo financeiro", () => {
  it("soma serviços e peças e aplica desconto", () => {
    const v = calcularValores({
      valorServicos: 199.9,
      pecas: [
        { descricao: "SSD 480GB", quantidade: 1, valorUnitario: 220 },
        { descricao: "Pasta térmica", quantidade: 2, valorUnitario: 15.5 },
      ],
      desconto: 20,
    });
    expect(v.valorPecas).toBe(251);
    expect(v.total).toBe(430.9);
  });

  it("nunca produz total negativo", () => {
    expect(() => calcularValores({ valorServicos: 50, pecas: [], desconto: 80 })).toThrow();
    const v = calcularValores({ valorServicos: 0, pecas: [], desconto: 0 });
    expect(v.total).toBe(0);
  });
});

const base = {
  protocolo: "OS-20260825-AB12",
  primeiroNome: "Marina Souza",
  equipamento: "Notebook",
  marcaModelo: "Dell Inspiron",
};

describe("templates de WhatsApp", () => {
  it("nenhum template gera placeholder inválido, mesmo sem dados opcionais", () => {
    for (const t of OS_TEMPLATES) {
      const msg = montarMensagemOs(t, { protocolo: base.protocolo });
      expect(msg).not.toMatch(/undefined|null|NaN|\{\{/i);
      expect(msg).toContain(base.protocolo);
    }
  });

  it("omite linhas sem dado em vez de imprimir vazio", () => {
    const msg = montarMensagemOs("PROPOSTA_DISPONIVEL", { protocolo: base.protocolo });
    expect(msg).not.toMatch(/Diagnóstico:/);
    expect(msg).not.toMatch(/Valor do reparo:/);
  });

  it("usa o primeiro nome e os dados reais quando existem", () => {
    const msg = montarMensagemOs("PROPOSTA_DISPONIVEL", {
      ...base,
      diagnostico: "Troca da placa de energia",
      total: 430.9,
    });
    expect(msg).toContain("Olá, Marina!");
    expect(msg).toContain("Notebook Dell Inspiron");
    expect(msg).toContain("Troca da placa de energia");
    expect(msg).toMatch(/430,90/);
  });

  it("recusa telefone inválido e normaliza DDI no deep link", () => {
    expect(linkWhatsAppOs("123", "oi")).toBeNull();
    expect(linkWhatsAppOs("(41) 99708-6380", "oi")).toContain("https://wa.me/5541997086380");
  });
});

describe("integridade do PDF", () => {
  it("a assinatura muda quando o estado da O.S. muda", () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const os: any = {
      protocolo: base.protocolo,
      clienteNome: "Marina",
      telefone: "41999999999",
      equipamento: "Notebook",
      marcaModelo: null,
      numeroSerie: null,
      sintomas: "Não liga",
      diagnostico: null,
      servicoExecutado: null,
      observacoes: null,
      tecnicoResponsavel: null,
      modalidade: null,
      status: "ABERTA",
      pagamentoStatus: "pendente",
      pecas: [],
      valorServicos: 0,
      valorPecas: 0,
      desconto: 0,
      total: 0,
      previsaoConclusao: null,
      abertaEm: "2026-08-25T00:00:00Z",
      concluidaEm: null,
      criadoEm: "2026-08-25T00:00:00Z",
      atualizadoEm: "2026-08-25T00:00:00Z",
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const antes = assinaturaOrdem(os);
    expect(assinaturaOrdem({ ...os })).toBe(antes);
    expect(assinaturaOrdem({ ...os, total: 430.9 })).not.toBe(antes);
  });
});
