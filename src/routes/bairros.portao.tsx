import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Portao from "@/pages/bairros/Portao";

export const Route = createFileRoute("/bairros/portao")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/portao",
    "title": "Técnico de Informática no Portão (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Portão, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Atendimento a domicílio a partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Atendem o comércio do Portão?",
        "answer": "Sim. Damos suporte ao PC do balcão, à impressora e à rede de pequenos comércios, com foco em reduzir o tempo de parada. A avaliação começa pela triagem no WhatsApp."
      },
      {
        "question": "O Wi-Fi não cobre a casa toda — vocês resolvem?",
        "answer": "Avaliamos o posicionamento do roteador e a necessidade de repetidor ou sistema mesh para melhorar a cobertura. A indicação depende do tamanho do imóvel e da estrutura."
      },
      {
        "question": "Recebi um aviso pedindo pagamento para liberar o PC. É golpe?",
        "answer": "Quase sempre é golpe. Não pague nada antes de uma avaliação. Fale conosco pelo WhatsApp que verificamos o caso com segurança antes de qualquer serviço."
      },
      {
        "question": "Qual o valor do atendimento no Portão?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças, sempre aprovado por você antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: Portao,
});
