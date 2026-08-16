import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Juveve from "@/pages/bairros/Juveve";

export const Route = createFileRoute("/bairros/juveve")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/juveve",
    "title": "Técnico de Informática no Juvevê (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Juvevê, Curitiba: suporte a home office, formatação, upgrade de SSD, Wi-Fi e conserto de notebook. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Meu notebook ficou lento depois de anos de uso. SSD resolve?",
        "answer": "Ajuda muito, mas raramente sozinho. Avaliamos disco, memória e refrigeração juntos: trocar só o disco em uma máquina que superaquece devolve pouco ganho percebido."
      },
      {
        "question": "Quanto tempo leva um upgrade de SSD?",
        "answer": "Quando é feito no local e a máquina permite acesso simples, costuma ser resolvido na mesma visita, incluindo migração dos seus dados. Casos com carcaça complexa vão para bancada."
      },
      {
        "question": "Vocês atendem em apartamento com portaria?",
        "answer": "Sim. Só pedimos que a autorização de acesso seja combinada antes, no horário definido na triagem."
      },
      {
        "question": "Dá para melhorar o Wi-Fi no escritório do apartamento?",
        "answer": "Sim. Medimos a cobertura no cômodo de trabalho, ajustamos faixa e canal e, se ainda faltar sinal, indicamos a solução mais estável para a planta do imóvel."
      },
      {
        "question": "Qual o valor do atendimento no Juvevê?",
        "answer": "A partir de R$ 99,99 quando aplicável, com valor final informado após o diagnóstico e aprovado antes da execução."
      }
    ]
  }),
  /* seo:auto-end */
  component: Juveve,
});
