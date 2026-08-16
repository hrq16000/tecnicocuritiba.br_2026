import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Pinheirinho from "@/pages/bairros/Pinheirinho";

export const Route = createFileRoute("/bairros/pinheirinho")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/pinheirinho",
    "title": "Técnico de Informática no Pinheirinho (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Pinheirinho, Curitiba: manutenção de computador, conserto de notebook, formatação e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "Formatar apaga meus arquivos e fotos?",
        "answer": "Não, quando o backup é feito antes. Combinamos o que precisa ser salvo, copiamos os dados, reinstalamos o sistema e devolvemos os arquivos organizados na máquina."
      },
      {
        "question": "Meu notebook está cheio de propaganda abrindo sozinha. É vírus?",
        "answer": "Normalmente é adware instalado junto com algum programa baixado fora da loja oficial. Fazemos a remoção, limpamos os navegadores e mostramos de onde veio para evitar reincidência."
      },
      {
        "question": "Vale a pena colocar SSD num computador antigo?",
        "answer": "Na maioria das vezes sim. Em máquinas com disco mecânico, a troca por SSD costuma ser o upgrade com maior ganho percebido por real investido. Avaliamos antes se a máquina comporta."
      },
      {
        "question": "Atendem pequenos negócios no Pinheirinho?",
        "answer": "Sim. Atendemos comércios de rua com computador de vendas, impressora e rede, com horário combinado para não travar o atendimento."
      },
      {
        "question": "Qual o valor do serviço no Pinheirinho?",
        "answer": "A partir de R$ 99,99 quando aplicável. O total depende do serviço executado e de peças, sempre aprovado por você antes de começarmos."
      }
    ]
  }),
  /* seo:auto-end */
  component: Pinheirinho,
});
