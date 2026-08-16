import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CristoRei from "@/pages/bairros/CristoRei";

export const Route = createFileRoute("/bairros/cristo-rei")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/cristo-rei",
    "title": "Técnico de Informática no Cristo Rei (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Cristo Rei, Curitiba: conserto de notebook, formatação, upgrade de SSD e Wi-Fi para estudantes e famílias. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Meu notebook travou e tenho trabalho para entregar. Dá para priorizar?",
        "answer": "Informe o prazo já na triagem pelo WhatsApp. Quando o caso permite, priorizamos o acesso aos arquivos primeiro — mesmo que o reparo completo leve mais tempo depois."
      },
      {
        "question": "Vale a pena consertar um computador antigo no Cristo Rei?",
        "answer": "Depende do equipamento. Em muitos casos SSD e memória devolvem a agilidade por um custo bem menor que a troca; em outros, o reparo não se paga. Explicamos os dois cenários antes de você decidir."
      },
      {
        "question": "Atendem repúblicas e apartamentos de estudante?",
        "answer": "Sim. Serviços de software, rede e upgrade costumam ser feitos no próprio endereço. Casos de bancada seguem por coleta e entrega, com aprovação prévia."
      },
      {
        "question": "Qual o valor do atendimento no Cristo Rei?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado antes da execução."
      }
    ]
  }),
  /* seo:auto-end */
  component: CristoRei,
});
