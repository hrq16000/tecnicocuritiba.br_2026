import { describe, expect, it } from "vitest";
import {
  bairroLocalBusinessSchema,
  blocosEnriquecimento,
  diagnosticarEnriquecimento,
} from "@/lib/bairroEnriquecimento";
import { BairroDataSchema, type BairroData } from "@/lib/bairroDataSchema";

const base: BairroData = BairroDataSchema.parse({
  nome: "Água Verde",
  slug: "agua-verde",
  cidade: "Curitiba",
  metaTitle: "Técnico de informática no Água Verde",
  metaDescription: "Atendimento de informática no Água Verde, em Curitiba, com coleta e entrega.",
  h1: "Técnico de informática no Água Verde",
  subtitulo: "Coleta e entrega no bairro",
  descricaoLonga: "Atendimento técnico no Água Verde ".repeat(30),
  pontosReferencia: ["Praça do Água Verde", "Av. República Argentina", "Shopping Curitiba"],
  tempoDeslocamento: "cerca de 20 minutos a partir do centro",
  servicosDestaque: ["Formatação", "Troca de SSD"],
  conteudoExclusivo: "Texto autoral do bairro. ".repeat(40),
  problemasComuns: ["Notebook não liga", "Wi-Fi caindo em prédio antigo"],
  dicasLocais: ["Em prédios antigos da Av. República Argentina, o roteador único não cobre o apartamento inteiro."],
});

describe("schema de bairro (LocalBusiness/Neighborhood)", () => {
  const schema = bairroLocalBusinessSchema(base);

  it("injeta a localidade exata do bairro e da cidade", () => {
    expect(schema["@type"]).toBe("LocalBusiness");
    expect(schema.areaServed.name).toBe("Água Verde");
    expect(schema.areaServed["@type"]).toEqual(["Place", "Neighborhood"]);
    expect(schema.areaServed.address.addressLocality).toBe("Curitiba");
    expect(schema.areaServed.address.addressRegion).toBe("PR");
    expect(schema["@id"]).toContain("/bairros/agua-verde");
  });

  it("materializa dicasLocais como additionalProperty", () => {
    const props = (schema as { additionalProperty?: { value: string }[] }).additionalProperty ?? [];
    expect(props).toHaveLength(base.dicasLocais!.length);
    expect(props[0].value).toBe(base.dicasLocais![0]);
  });

  it("lista referências geográficas reais em containsPlace", () => {
    const places = (schema.areaServed as { containsPlace?: { name: string }[] }).containsPlace ?? [];
    expect(places.map((p) => p.name)).toEqual(base.pontosReferencia);
  });

  it("omite additionalProperty quando não há dicas (sem inventar dado)", () => {
    const semDicas = bairroLocalBusinessSchema({ ...base, dicasLocais: undefined });
    expect("additionalProperty" in semDicas).toBe(false);
  });
});

describe("enriquecimento gradativo", () => {
  it("gera blocos apenas a partir de dados exclusivos existentes", () => {
    expect(blocosEnriquecimento(base).map((b) => b.id)).toEqual([
      "referencias",
      "deslocamento",
      "problemas",
      "dicas",
    ]);
    const magro = blocosEnriquecimento({
      ...base,
      pontosReferencia: [],
      problemasComuns: [],
      dicasLocais: undefined,
    });
    expect(magro.map((b) => b.id)).toEqual(["deslocamento"]);
  });

  it("aponta lacunas de thin content", () => {
    expect(diagnosticarEnriquecimento(base).suficiente).toBe(true);
    const diag = diagnosticarEnriquecimento({
      ...base,
      descricaoLonga: "curto",
      conteudoExclusivo: undefined,
      pontosReferencia: [],
      dicasLocais: undefined,
    });
    expect(diag.suficiente).toBe(false);
    expect(diag.lacunas.join(" ")).toMatch(/pontosReferencia|dicasLocais|conteudoExclusivo/);
  });
});
