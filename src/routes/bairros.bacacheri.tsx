import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Bacacheri from "@/pages/bairros/Bacacheri";

export const Route = createFileRoute("/bairros/bacacheri")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/bacacheri",
    "title": "Técnico de Informática no Bacacheri (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Bacacheri, Curitiba: conserto de notebook, manutenção de computador, formatação e rede Wi-Fi. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Minha casa é grande e o Wi-Fi não chega nos fundos. O que fazem?",
        "answer": "Medimos a intensidade do sinal nos cômodos críticos, avaliamos reposicionamento do roteador e, quando necessário, indicamos ponto de acesso adicional ou repetidor com posicionamento correto — não apenas um aparelho a mais na tomada."
      },
      {
        "question": "Trabalho em casa e não posso ficar sem o computador. Como funciona?",
        "answer": "Priorizamos deixar a máquina operacional no atendimento e separamos para bancada apenas o que exige desmontagem. Combinamos previamente o tempo estimado de indisponibilidade."
      },
      {
        "question": "Meu PC de mesa é antigo. Compensa consertar?",
        "answer": "Avaliamos o hardware atual e o uso pretendido. Se a base ainda for adequada, SSD, memória e limpeza térmica costumam resolver. Se não for, dizemos com clareza que a substituição é a melhor escolha."
      },
      {
        "question": "Vocês fazem coleta no Bacacheri?",
        "answer": "Sim, para os casos que exigem bancada. A coleta é combinada na triagem e o equipamento é devolvido após o reparo aprovado."
      },
      {
        "question": "Quanto custa o atendimento no Bacacheri?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e de peças, informado e aprovado antes da execução."
      }
    ]
  }),
  /* seo:auto-end */
  component: Bacacheri,
});
