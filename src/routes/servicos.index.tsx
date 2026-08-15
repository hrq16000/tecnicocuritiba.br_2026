import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Servicos from "@/pages/Servicos";

export const Route = createFileRoute("/servicos/")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos",
    "title": "Serviços de Informática em Curitiba | PC e Notebook",
    "description": "Conheça os serviços de formatação, manutenção de computadores e notebooks, SSD, vírus, recuperação de dados, Wi-Fi e suporte empresarial.",
    "faq": [
      {
        "question": "Como começa o atendimento e em quanto tempo tenho retorno?",
        "answer": "O atendimento começa por uma triagem no WhatsApp: você descreve o equipamento e o sintoma e recebe a orientação do próximo passo, que pode ser acesso remoto, visita ou coleta. O retorno depende da disponibilidade de agenda do dia, e informamos a janela real em vez de prometer prazo fixo."
      },
      {
        "question": "Vocês informam o valor antes de executar o serviço?",
        "answer": "Sim. Nenhum serviço é executado sem aprovação: o escopo e o valor são apresentados antes da execução. Peças e componentes são cobrados à parte da mão de obra e também dependem da sua autorização expressa."
      },
      {
        "question": "Qual serviço escolher se eu não sei qual é o problema?",
        "answer": "Não precisa saber. Descreva o sintoma na triagem e nós indicamos o caminho. Se preferir ler antes, as páginas de sintoma explicam os cenários mais comuns de notebook que não liga e de computador lento."
      },
      {
        "question": "O serviço pode ser feito remotamente ou precisa ser presencial?",
        "answer": "Depende da causa. Problemas de sistema, configuração, lentidão por software e suporte a home office costumam ser resolvidos por acesso remoto. Falhas de hardware, tela, energia e reparo de placa exigem atendimento presencial ou coleta para bancada."
      },
      {
        "question": "Atendem empresas e não apenas usuários domésticos?",
        "answer": "Sim. Além dos serviços para uso doméstico, atendemos empresas com suporte técnico, manutenção preventiva, redes e Wi-Fi corporativo e rotinas de backup, de forma pontual ou recorrente."
      },
      {
        "question": "Existe garantia do serviço executado?",
        "answer": "Sim. A mão de obra do serviço executado tem 90 dias de garantia no mesmo defeito tratado, e peças seguem a garantia do fornecedor ou fabricante. Nota fiscal de serviço é emitida mediante solicitação."
      }
    ]
  }),
  /* seo:auto-end */
  component: Servicos,
});
