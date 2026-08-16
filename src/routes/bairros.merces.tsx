import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Merces from "@/pages/bairros/Merces";

export const Route = createFileRoute("/bairros/merces")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/merces",
    "title": "Técnico de Informática nas Mercês (Curitiba) | Notebook e PC",
    "description": "Técnico de informática nas Mercês, Curitiba: conserto de notebook, formatação com backup, recuperação de arquivos e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "Consigo recuperar arquivos de um disco que parou de abrir?",
        "answer": "Em muitos casos sim, quando a falha é lógica ou o disco ainda é reconhecido. Avaliamos antes e informamos com honestidade a chance real de recuperação, sem cobrar promessa de resultado."
      },
      {
        "question": "Atendem consultórios sem parar o atendimento?",
        "answer": "Sim. Combinamos janela de horário fora da agenda de pacientes e priorizamos o que pode ser feito sem derrubar o sistema em uso."
      },
      {
        "question": "Tenho três repetidores e o Wi-Fi continua ruim. Por quê?",
        "answer": "Repetidores em série dividem a banda e aumentam a latência. Medimos o sinal e normalmente substituímos o arranjo por um ponto de acesso bem posicionado, com cabo quando possível."
      },
      {
        "question": "Vocês configuram backup automático?",
        "answer": "Sim, em nuvem e/ou disco externo, com rotina programada e teste de restauração para comprovar que os arquivos voltam."
      },
      {
        "question": "Quanto custa o atendimento nas Mercês?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final sai após o diagnóstico e só é executado com sua aprovação."
      }
    ]
  }),
  /* seo:auto-end */
  component: Merces,
});
