import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Xaxim from "@/pages/bairros/Xaxim";

export const Route = createFileRoute("/bairros/xaxim")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/xaxim",
    "title": "Técnico de Informática no Xaxim (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Xaxim, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi em casa. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "O Wi-Fi cai quando todos usam ao mesmo tempo. Tem solução?",
        "answer": "Geralmente sim. Medimos o sinal nos cômodos usados, verificamos interferência de canal e o limite do aparelho da operadora, e só então indicamos reposicionamento, ponto extra por cabo ou mesh."
      },
      {
        "question": "Vale a pena consertar um notebook antigo do Xaxim?",
        "answer": "Depende do estado da placa, da tela e do custo da peça. Fazemos o diagnóstico e dizemos com clareza quando o reparo compensa e quando o dinheiro é melhor aplicado em outro equipamento."
      },
      {
        "question": "Vocês atendem à noite ou no fim de semana?",
        "answer": "Trabalhamos por agendamento e ajustamos a janela conforme a agenda disponível. Informe na triagem o melhor horário e confirmamos o que é possível."
      },
      {
        "question": "Quanto custa o atendimento no Xaxim?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: Xaxim,
});
