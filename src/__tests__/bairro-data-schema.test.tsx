import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BairroDataSchema } from "@/lib/bairroDataSchema";
import { DicasLocaisList } from "@/components/bairro/DicasLocaisList";

const validData = {
  nome: "Água Verde",
  slug: "agua-verde",
  cidade: "Curitiba",
  metaTitle: "Técnico em informática no Água Verde",
  metaDescription: "Atendimento técnico em informática no Água Verde.",
  h1: "Assistência técnica no Água Verde",
  subtitulo: "Suporte local para computadores e notebooks",
  descricaoLonga: "Diagnóstico, manutenção e suporte com atendimento combinado.",
  pontosReferencia: ["Av. República Argentina"],
  tempoDeslocamento: "Atendimento conforme agenda",
  servicosDestaque: ["Manutenção de notebook"],
  dicasLocais: ["Agendamos a visita conforme o acesso ao condomínio."],
};

describe("BairroData e dicasLocais", () => {
  it("aceita dados completos e tipa dicasLocais como strings", () => {
    const parsed = BairroDataSchema.parse(validData);
    expect(parsed.dicasLocais).toEqual(["Agendamos a visita conforme o acesso ao condomínio."]);
  });

  it("rejeita itens não textuais em dicasLocais", () => {
    const result = BairroDataSchema.safeParse({ ...validData, dicasLocais: [{ texto: "inválido" }] });
    expect(result.success).toBe(false);
  });

  it("renderiza cada dica na lista do bairro", () => {
    render(<DicasLocaisList nome="Água Verde" dicas={validData.dicasLocais} />);
    expect(screen.getByRole("heading", { name: /Dicas para quem é do Água Verde/i })).toBeInTheDocument();
    expect(screen.getByRole("list").querySelectorAll("li")).toHaveLength(1);
    expect(screen.getByText(validData.dicasLocais[0])).toBeInTheDocument();
  });
});
