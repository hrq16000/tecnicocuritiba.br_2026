import type { BairroData } from "@/lib/bairroDataSchema";

/**
 * ENRIQUECIMENTO GRADATIVO DE PÁGINAS DE BAIRRO (Rodada 3)
 *
 * Estrutura data-driven para eliminar "thin content" sem gerar texto
 * genérico: cada bloco só existe quando há dado EXCLUSIVO daquele bairro
 * (referências geográficas reais, dicas locais, problemas recorrentes).
 * Nada é inventado — se o dado não foi levantado, o bloco não é emitido e a
 * URL aparece como pendente no relatório de auditoria.
 */

export interface BlocoEnriquecimento {
  id: "referencias" | "deslocamento" | "problemas" | "dicas";
  titulo: string;
  paragrafos: string[];
  itens?: string[];
}

const contarPalavras = (texto: string) => texto.trim().split(/\s+/).filter(Boolean).length;

/** Blocos exclusivos derivados exclusivamente de dados reais do bairro. */
export function blocosEnriquecimento(data: BairroData): BlocoEnriquecimento[] {
  const blocos: BlocoEnriquecimento[] = [];
  const refs = data.pontosReferencia?.filter(Boolean) ?? [];

  if (refs.length >= 2) {
    blocos.push({
      id: "referencias",
      titulo: `Referências que usamos para chegar no ${data.nome}`,
      paragrafos: [
        `No ${data.nome} (${data.cidade}) a coleta e a entrega são combinadas por referência de rua, não por endereço genérico. ` +
          `Os pontos que mais usamos para fechar horário com o cliente são ${refs.slice(0, 4).join(", ")}.`,
      ],
      itens: refs,
    });
  }

  if (data.tempoDeslocamento) {
    blocos.push({
      id: "deslocamento",
      titulo: "Tempo de deslocamento e janela de atendimento",
      paragrafos: [
        `O deslocamento até o ${data.nome} leva ${data.tempoDeslocamento}. ` +
          `Esse número define a janela que conseguimos confirmar no WhatsApp: quanto mais cedo o contato, maior a chance de coleta no mesmo dia. ` +
          `Não há balcão para o cliente levar o equipamento — a retirada e a devolução são feitas por nós.`,
      ],
    });
  }

  const problemas = data.problemasComuns?.filter(Boolean) ?? [];
  if (problemas.length >= 2) {
    blocos.push({
      id: "problemas",
      titulo: `O que mais aparece no ${data.nome}`,
      paragrafos: [
        `Os atendimentos registrados no ${data.nome} se concentram nos casos abaixo. ` +
          `A lista vem do histórico local e orienta quais peças e ferramentas saem com o técnico.`,
      ],
      itens: problemas,
    });
  }

  const dicas = data.dicasLocais?.filter(Boolean) ?? [];
  if (dicas.length >= 1) {
    blocos.push({
      id: "dicas",
      titulo: `Dicas específicas para quem mora no ${data.nome}`,
      paragrafos: [],
      itens: dicas,
    });
  }

  return blocos;
}

export interface DiagnosticoEnriquecimento {
  slug: string;
  palavras: number;
  blocos: string[];
  lacunas: string[];
  /** true quando a página tem lastro local suficiente para sair de thin content. */
  suficiente: boolean;
}

/** Diagnóstico usado por relatório/painel e por testes de build. */
export function diagnosticarEnriquecimento(
  data: BairroData,
  minimoPalavras = 300,
): DiagnosticoEnriquecimento {
  const blocos = blocosEnriquecimento(data);
  const texto = [
    data.descricaoLonga,
    data.conteudoExclusivo ?? "",
    ...blocos.flatMap((b) => [...b.paragrafos, ...(b.itens ?? [])]),
  ].join(" ");
  const palavras = contarPalavras(texto);

  const lacunas: string[] = [];
  if ((data.pontosReferencia?.length ?? 0) < 2) lacunas.push("pontosReferencia (mínimo 2 referências reais)");
  if (!data.tempoDeslocamento) lacunas.push("tempoDeslocamento");
  if ((data.dicasLocais?.length ?? 0) < 1) lacunas.push("dicasLocais (mínimo 1 dica exclusiva)");
  if (!data.conteudoExclusivo) lacunas.push("conteudoExclusivo (texto autoral do bairro)");
  if (palavras < minimoPalavras) lacunas.push(`texto local com ${palavras} palavras (mínimo ${minimoPalavras})`);

  return {
    slug: data.slug,
    palavras,
    blocos: blocos.map((b) => b.id),
    lacunas,
    suficiente: lacunas.length === 0,
  };
}

/**
 * JSON-LD de bairro: LocalBusiness + Place/Neighborhood com a localidade
 * exata e as dicas locais materializadas como additionalProperty.
 * Campos obrigatórios (validados em teste e no gate de build):
 *   areaServed.name, areaServed.address.addressLocality e additionalProperty.
 */
export function bairroLocalBusinessSchema(data: BairroData, baseUrl = "https://tecnico.curitiba.br") {
  const url = `${baseUrl}/bairros/${data.slug}`;
  const dicas = data.dicasLocais?.filter(Boolean) ?? [];
  const refs = data.pontosReferencia?.filter(Boolean) ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness`,
    url,
    name: `Técnico de Informática em ${data.nome}`,
    description: data.metaDescription,
    areaServed: {
      "@type": ["Place", "Neighborhood"],
      name: data.nome,
      address: {
        "@type": "PostalAddress",
        addressLocality: data.cidade,
        addressRegion: "PR",
        addressCountry: "BR",
      },
      ...(refs.length
        ? { containsPlace: refs.map((nome) => ({ "@type": "Place", name: nome })) }
        : {}),
    },
    ...(dicas.length
      ? {
          additionalProperty: dicas.map((dica, i) => ({
            "@type": "PropertyValue",
            name: `Dica local ${i + 1} — ${data.nome}`,
            value: dica,
          })),
        }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de Informática",
      itemListElement: data.servicosDestaque.map((servico) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: servico, areaServed: data.nome },
      })),
    },
  };
}
