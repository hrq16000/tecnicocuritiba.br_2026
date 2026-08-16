import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Cajuru from "@/pages/bairros/Cajuru";

export const Route = createFileRoute("/bairros/cajuru")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/cajuru",
    "title": "Técnico de Informática no Cajuru (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Cajuru, Curitiba: conserto de notebook e PC, formatação com backup, remoção de vírus e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "Atendem comércio pequeno no Cajuru?",
        "answer": "Sim. Damos suporte pontual ao PC do caixa, à impressora de cupom e à rede do estabelecimento, com foco em reduzir o tempo em que o atendimento fica parado."
      },
      {
        "question": "O Wi-Fi não cobre a casa toda. O que fazer?",
        "answer": "Em casas com muitos cômodos e paredes espessas, medimos o sinal ambiente por ambiente antes de indicar solução: pode ser reposicionamento, troca de canal, cabo até um segundo ponto ou mesh."
      },
      {
        "question": "Posso levar o equipamento até vocês?",
        "answer": "Não trabalhamos com balcão ao público. Atendemos no seu endereço ou fazemos coleta e entrega quando o serviço exige bancada."
      },
      {
        "question": "Quanto custa o atendimento no Cajuru?",
        "answer": "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre informado e aprovado antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: Cajuru,
});
