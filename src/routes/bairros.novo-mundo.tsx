import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import NovoMundo from "@/pages/bairros/NovoMundo";

export const Route = createFileRoute("/bairros/novo-mundo")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/novo-mundo",
    "title": "Técnico de Informática no Novo Mundo (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Novo Mundo, Curitiba: manutenção de computador, conserto de notebook, upgrade de SSD e rede para comércio. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Atendem lojas e escritórios no Novo Mundo?",
        "answer": "Sim, com suporte pontual ou acompanhamento recorrente: computador do balcão, impressora, rede e rotina de backup. Combinamos a janela de atendimento para reduzir o impacto no expediente."
      },
      {
        "question": "O computador demora muito para abrir o sistema. É vírus?",
        "answer": "Nem sempre. Disco mecânico saturado, memória insuficiente e programas em segundo plano explicam boa parte dos casos. O diagnóstico distingue causa de software e de hardware antes de qualquer troca."
      },
      {
        "question": "Perdi arquivos importantes. Ainda dá para recuperar?",
        "answer": "Em muitos casos sim, desde que o equipamento pare de ser usado imediatamente. Avaliamos o disco e informamos a chance real de recuperação antes de iniciar."
      },
      {
        "question": "Como é cobrado o serviço no Novo Mundo?",
        "answer": "A partir de R$ 99,99 quando aplicável, com o valor final definido após o diagnóstico e aprovado por você antes da execução."
      }
    ]
  }),
  /* seo:auto-end */
  component: NovoMundo,
});
