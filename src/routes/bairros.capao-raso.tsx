import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CapaoRaso from "@/pages/bairros/CapaoRaso";

export const Route = createFileRoute("/bairros/capao-raso")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/capao-raso",
    "title": "Técnico de Informática no Capão Raso (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Capão Raso, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e upgrade de SSD. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "O Wi-Fi do meu apartamento no Capão Raso é fraco no quarto. Dá para resolver?",
        "answer": "Sim. Verificamos canal, posicionamento e interferência de redes vizinhas — em prédio, é comum o problema ser congestionamento de canal, e não falta de aparelho."
      },
      {
        "question": "Meu computador demora minutos para ligar. O que costuma ser?",
        "answer": "Na maior parte dos casos é disco mecânico somado a programas iniciando junto com o sistema. Migração para SSD e limpeza de inicialização mudam completamente a experiência de uso."
      },
      {
        "question": "Atendem loja com sistema de vendas?",
        "answer": "Sim. Combinamos horário de menor movimento, avaliamos o computador de caixa, a impressora e a rede, e orientamos sobre backup dos registros."
      },
      {
        "question": "Vocês tentam recuperar arquivos de HD com defeito?",
        "answer": "Fazemos a tentativa em bancada e informamos as chances antes. Recuperação de dados nunca tem garantia de sucesso — o que garantimos é transparência sobre o que é possível."
      },
      {
        "question": "Quanto custa o atendimento no Capão Raso?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e de peças, sempre apresentado e aprovado antes da execução."
      }
    ]
  }),
  /* seo:auto-end */
  component: CapaoRaso,
});
