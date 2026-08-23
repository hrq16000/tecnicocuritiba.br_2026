import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Batel from "@/pages/bairros/Batel";

export const Route = createFileRoute("/bairros/batel")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/batel",
    "title": "Técnico de Informática no Batel (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Batel, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Diagnóstico a partir de R$ 99,99.",
    "faq": [
      {
        "question": "Fazem suporte para home office no Batel?",
        "answer": "Sim. Ajustamos desempenho, organizamos programas e melhoramos a estabilidade do Wi-Fi para reuniões online. A avaliação do que é necessário é feita após a triagem pelo WhatsApp."
      },
      {
        "question": "Atendem apartamentos e prédios no Batel?",
        "answer": "Sim, atendemos residências e pequenos escritórios. Em prédios, basta liberar o acesso na portaria no horário combinado. A modalidade depende do tipo de serviço."
      },
      {
        "question": "Meu notebook está lento — precisa trocar?",
        "answer": "Nem sempre. Muitas vezes um upgrade de SSD e memória, somado a uma limpeza, devolve a agilidade. Avaliamos antes de indicar troca e explicamos o ganho realista."
      },
      {
        "question": "Qual o valor do atendimento no Batel?",
        "answer": "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: Batel,
});
