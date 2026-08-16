import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Uberaba from "@/pages/bairros/Uberaba";

export const Route = createFileRoute("/bairros/uberaba")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/uberaba",
    "title": "Técnico de Informática no Uberaba (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Uberaba, Curitiba: conserto de notebook, formatação, remoção de vírus e Wi-Fi para home office. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "Trabalho em casa e não posso ficar sem o notebook. Como fica?",
        "answer": "Diga isso na triagem. Priorizamos o que pode ser resolvido remotamente ou no seu endereço e, quando a coleta é inevitável, alinhamos prazo antes de retirar o equipamento."
      },
      {
        "question": "A internet do apartamento oscila nas chamadas. É o provedor?",
        "answer": "Pode ser, mas em prédios o mais comum é disputa de canal com dezenas de redes vizinhas. Medimos e ajustamos canal, banda e posição do roteador antes de sugerir trocar de plano ou aparelho."
      },
      {
        "question": "Vocês instalam programas e configuram e-mail corporativo?",
        "answer": "Sim, incluindo pacote de escritório, VPN, impressoras e contas de e-mail, com atenção às licenças que você já possui."
      },
      {
        "question": "Qual o valor do serviço no Uberaba?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final é definido após o diagnóstico e depende do equipamento, da complexidade e de peças, sempre aprovado antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: Uberaba,
});
