import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SitioCercado from "@/pages/bairros/SitioCercado";

export const Route = createFileRoute("/bairros/sitio-cercado")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/sitio-cercado",
    "title": "Técnico de Informática no Sítio Cercado (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Sítio Cercado, Curitiba: formatação com backup, remoção de vírus, troca de SSD e conserto de notebook. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Vale a pena consertar um notebook antigo do Sítio Cercado ou comprar outro?",
        "answer": "Depende do diagnóstico. Se a placa está saudável e o gargalo é disco mecânico, memória curta ou sistema comprometido, o reparo custa muito menos que um aparelho novo. Quando a placa exige reparo caro, dizemos isso com clareza e você decide."
      },
      {
        "question": "Consigo atendimento fora do horário comercial?",
        "answer": "Combinamos horário na triagem, incluindo fim de tarde. Não prometemos horário antes de confirmar a agenda do dia."
      },
      {
        "question": "Meus arquivos e fotos se perdem na formatação?",
        "answer": "Não, quando o disco está legível. Fazemos o backup antes, você confere o que foi salvo e só então reinstalamos o sistema."
      },
      {
        "question": "O Wi-Fi não sobe para o segundo andar. Preciso de repetidor?",
        "answer": "Nem sempre. Medimos o sinal em cada cômodo e testamos reposicionamento e troca de canal antes de indicar qualquer equipamento extra."
      },
      {
        "question": "Atendem pequenos comércios do bairro?",
        "answer": "Sim. Trabalhamos com computador de caixa, impressora fiscal e rede da loja, com horário combinado para não parar o movimento."
      }
    ]
  }),
  /* seo:auto-end */
  component: SitioCercado,
});
