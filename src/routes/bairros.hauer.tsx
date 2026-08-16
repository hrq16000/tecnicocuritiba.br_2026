import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Hauer from "@/pages/bairros/Hauer";

export const Route = createFileRoute("/bairros/hauer")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/hauer",
    "title": "Técnico de Informática no Hauer (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Hauer, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e rede Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "Vocês atendem no Hauer no mesmo dia?",
        "answer": "Depende da agenda e do tipo de problema. Na triagem pelo WhatsApp informamos o primeiro horário realmente disponível, sem prometer prazo que não conseguimos cumprir."
      },
      {
        "question": "Meu computador esquenta e trava. Precisa trocar?",
        "answer": "Na maioria dos casos, não. Superaquecimento costuma vir de dissipador entupido e pasta térmica ressecada. Fazemos a limpeza, medimos temperatura sob carga e só indicamos peça se o problema persistir."
      },
      {
        "question": "Atendem comércio na Marechal Floriano?",
        "answer": "Sim. Trabalhamos com estações de frente de caixa, impressora e rede da loja, combinando horário fora do pico para reduzir o impacto no atendimento ao cliente."
      },
      {
        "question": "O Wi-Fi não chega nos quartos dos fundos. Tem solução?",
        "answer": "Sim. Medimos o sinal ponto a ponto, avaliamos reposicionamento do roteador e, se realmente for necessário, indicamos repetidor ou ponto de acesso adicional com cabeamento."
      },
      {
        "question": "Quanto custa o atendimento no Hauer?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e de eventuais peças, sempre apresentado e aprovado antes da execução."
      }
    ]
  }),
  /* seo:auto-end */
  component: Hauer,
});
