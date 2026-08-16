import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SantaFelicidade from "@/pages/bairros/SantaFelicidade";

export const Route = createFileRoute("/bairros/santa-felicidade")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/santa-felicidade",
    "title": "Técnico de Informática em Santa Felicidade | Curitiba",
    "description": "Técnico de informática em Santa Felicidade, Curitiba: conserto de PC e notebook, formatação, Wi-Fi em casa grande e suporte a comércio. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "O Wi-Fi não chega aos fundos da casa. Como resolvem?",
        "answer": "Em casas grandes o ponto de partida é medir o sinal ambiente por ambiente. A partir disso indicamos reposicionamento, troca de canal, cabeamento até um segundo ponto ou sistema mesh — sem prometer solução antes de medir."
      },
      {
        "question": "Atendem restaurantes e lojas de Santa Felicidade?",
        "answer": "Sim. Damos suporte pontual ou combinado ao computador do caixa, à impressora de comanda e à rede do estabelecimento, com foco em reduzir o tempo de parada."
      },
      {
        "question": "Posso levar o equipamento até vocês?",
        "answer": "Não trabalhamos com balcão ao público. Quando o caso exige bancada, fazemos coleta e entrega no seu endereço, com sua aprovação antes de qualquer serviço."
      },
      {
        "question": "Qual o valor do atendimento em Santa Felicidade?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças, sempre informado e aprovado antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: SantaFelicidade,
});
