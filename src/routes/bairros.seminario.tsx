import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Seminario from "@/pages/bairros/Seminario";

export const Route = createFileRoute("/bairros/seminario")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/seminario",
    "title": "Técnico de Informática no Seminário (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Seminário, Curitiba: formatação, remoção de vírus, upgrade de SSD, Wi-Fi e conserto de notebook. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Preciso do notebook para uma entrega esta semana. Dá para priorizar?",
        "answer": "Informe o prazo na triagem. Priorizamos o que é possível dentro da agenda real do dia e dizemos com antecedência se o prazo não é viável."
      },
      {
        "question": "Mais memória ou SSD: o que resolve meu caso?",
        "answer": "Medimos o uso real da máquina antes de indicar. Planilhas grandes e muitas abas pedem memória; lentidão para abrir sistema e programas pede SSD. Muitas vezes o ganho vem da combinação."
      },
      {
        "question": "Meus trabalhos ficam salvos na formatação?",
        "answer": "Sim, quando o disco está legível. Fazemos backup, você confere os arquivos e só depois reinstalamos o sistema."
      },
      {
        "question": "O Wi-Fi cai no quarto do fundo durante aula online. Como resolvem?",
        "answer": "Medimos o sinal no cômodo em uso, ajustamos faixa e canal do roteador e, se necessário, indicamos ponto de acesso adicional — mostrando a medição antes e depois."
      },
      {
        "question": "Quanto custa o atendimento no Seminário?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e das peças, sempre aprovado por você antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: Seminario,
});
