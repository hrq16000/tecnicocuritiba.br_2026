import { describe, expect, it } from "vitest";
import { rankLocalidades } from "./localidade-filter";

const options = ["Água Verde, Curitiba", "São José dos Pinhais, PR", "São Francisco, Curitiba", "Pinhais, PR", "Portão, Curitiba"];

describe("busca manual de localidade", () => {
  it("busca sem acentos, caixa ou ordem exata", () => {
    expect(rankLocalidades(options, "AGUA VERDE")).toEqual([options[0]]);
    expect(rankLocalidades(options, "pinhais sao jose")).toEqual([options[1]]);
  });
  it("prioriza prefixo e preserva valor canônico", () => {
    expect(rankLocalidades(options, "pinhais")).toEqual([options[3], options[1]]);
  });
  it("limita sugestões, inclusive em catálogo extenso", () => {
    const long = Array.from({ length: 130 }, (_, index) => `Bairro ${index}, Curitiba`);
    expect(rankLocalidades(long, "").length).toBe(8);
    expect(rankLocalidades(long, "bairro 129")).toEqual([long[129]]);
  });
  it("não inventa correspondências", () => {
    expect(rankLocalidades(options, "inexistente")).toEqual([]);
  });
});
