import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Centro from "@/pages/bairros/Centro";

export const Route = createFileRoute("/bairros/centro")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/centro",
    "title": "Técnico de Informática no Centro de Curitiba | Notebook e PC",
    "description": "Técnico de informática no Centro de Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para escritórios.",
    "faq": [
      {
        "question": "Atendem escritórios e lojas no Centro de Curitiba?",
        "answer": "Sim. Boa parte da demanda no Centro é comercial: PCs de balcão, escritórios e consultórios. Fazemos suporte pontual ou recorrente sob consulta, começando pela triagem no WhatsApp."
      },
      {
        "question": "Vocês têm loja física no Centro?",
        "answer": "Não trabalhamos com loja de balcão. O atendimento é combinado por WhatsApp e realizado a domicílio, remotamente ou por coleta e entrega, conforme o tipo de serviço."
      },
      {
        "question": "Dá para reduzir o tempo de parada da empresa?",
        "answer": "Esse é o foco no Centro: triagem rápida e diagnóstico objetivo. Casos simples costumam ser resolvidos no local; quando é preciso bancada, informamos o prazo antes de retirar o equipamento."
      },
      {
        "question": "Qual o valor da avaliação no Centro?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, e é sempre aprovado por você antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: Centro,
});
