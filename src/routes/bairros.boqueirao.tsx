import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Boqueirao from "@/pages/bairros/Boqueirao";

export const Route = createFileRoute("/bairros/boqueirao")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/boqueirao",
    "title": "Técnico de Informática no Boqueirão (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Boqueirão, Curitiba: conserto de PC e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Meu PC emite nota e não pode parar. Como funciona?",
        "answer": "Informe isso na triagem. Fazemos backup e conferimos acessos e licenças antes de mexer no sistema, e combinamos a janela de atendimento para reduzir o tempo de parada."
      },
      {
        "question": "Vale trocar o HD por SSD em máquina antiga?",
        "answer": "Na maior parte dos casos sim: é a mudança que mais devolve agilidade por um custo baixo. Avaliamos o equipamento antes e dizemos com clareza quando o investimento não compensa."
      },
      {
        "question": "Preciso levar o equipamento a algum endereço?",
        "answer": "Não. Não temos balcão ao público: atendemos no seu endereço ou fazemos coleta e entrega quando o caso exige bancada."
      },
      {
        "question": "Qual o valor do atendimento no Boqueirão?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças, sempre aprovado antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: Boqueirao,
});
