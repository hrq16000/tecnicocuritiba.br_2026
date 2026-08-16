import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AguaVerde from "@/pages/bairros/AguaVerde";

export const Route = createFileRoute("/bairros/agua-verde")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/agua-verde",
    "title": "Técnico de Informática no Água Verde | Notebook e PC",
    "description": "Técnico de informática no Água Verde, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Diagnóstico a partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Vocês fazem upgrade de SSD no Água Verde?",
        "answer": "Sim, é um dos serviços mais pedidos no bairro. A troca por SSD com aumento de memória costuma trazer ganho perceptível em máquinas antigas, avaliado caso a caso."
      },
      {
        "question": "Formatam com backup dos meus arquivos?",
        "answer": "Sim. Sempre que possível, fazemos o backup dos arquivos antes de reinstalar o Windows e devolvemos a máquina com drivers, antivírus e programas essenciais já configurados."
      },
      {
        "question": "Conseguem recuperar arquivos apagados?",
        "answer": "Fazemos a tentativa de recuperação de dados. Não há garantia, pois o resultado depende do estado físico e lógico da mídia — e explicamos as chances antes de iniciar."
      },
      {
        "question": "O atendimento é a domicílio no Água Verde?",
        "answer": "Pode ser a domicílio ou por coleta e entrega, conforme o serviço. Reparos de bancada seguem para a oficina; a definição acontece após a triagem pelo WhatsApp."
      }
    ]
  }),
  /* seo:auto-end */
  component: AguaVerde,
});
