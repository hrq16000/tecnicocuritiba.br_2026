import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/manutencao-preventiva-empresas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-preventiva-empresas",
    "title": "Manutenção Preventiva de Computadores em Curitiba | Empresas",
    "description": "Manutenção preventiva de computadores para empresas em Curitiba: inventário, inspeção, armazenamento, atualizações e relatório de riscos priorizado, sem promessa de.",
    "faq": [
      {
        "question": "Com que frequência a manutenção deve ser feita?",
        "answer": "Depende do ambiente. Escritório limpo e com máquinas novas costuma trabalhar bem com revisões semestrais; ambiente com poeira, uso pesado ou equipamentos antigos pede intervalos mais curtos. A frequência é definida após a primeira inspeção, não por regra fixa."
      },
      {
        "question": "A manutenção preventiva evita todos os defeitos?",
        "answer": "Não. Ela reduz riscos previsíveis — disco no limite, superaquecimento, atualização pendente, desgaste visível — mas não elimina falhas inesperadas nem substitui backup, segurança e renovação de equipamentos. Componente eletrônico pode falhar sem aviso."
      },
      {
        "question": "O serviço pode ser feito fora do horário comercial?",
        "answer": "Pode ser agendado fora do horário de maior movimento conforme a disponibilidade da agenda. Não mantemos plantão nem equipe em turno noturno, então esse formato é combinado caso a caso antes da execução."
      },
      {
        "question": "É necessário parar todos os computadores?",
        "answer": "Não. Trabalhamos por lotes, começando pelas máquinas menos críticas, para que a operação continue. Cada equipamento fica indisponível apenas durante a própria inspeção."
      },
      {
        "question": "Limpeza está sempre incluída?",
        "answer": "Não. A limpeza interna é executada quando a inspeção indica necessidade — poeira acumulada, temperatura alta, ventoinha ruidosa. Abrir equipamento sem motivo não melhora nada e ainda gera risco desnecessário."
      },
      {
        "question": "Peças estão incluídas?",
        "answer": "Não. Memória, SSD, fonte, ventoinha e demais componentes são tratados à parte. Quando a inspeção indica troca, informamos o motivo e o custo antes, e nada é substituído sem a sua autorização."
      },
      {
        "question": "É fornecido relatório?",
        "answer": "Sim. Entregamos a lista dos equipamentos inspecionados com os riscos encontrados e as recomendações em ordem de prioridade, para que a empresa decida o que fazer agora e o que pode esperar."
      },
      {
        "question": "Pode ser feita em atendimento recorrente?",
        "answer": "Sim. O acompanhamento periódico é definido na contratação, com escopo e intervalo combinados. Não trabalhamos com contrato de suporte ilimitado nem com prazos de resposta garantidos fora do que foi acordado."
      },
      {
        "question": "A manutenção preventiva melhora o desempenho?",
        "answer": "Melhora quando o problema é software acumulado, disco cheio ou superaquecimento. Quando a limitação é hardware — HD mecânico, memória insuficiente, processador antigo — o ganho real vem de upgrade, e explicamos isso no relatório em vez de prometer resultado."
      },
      {
        "question": "Vocês cuidam do backup durante a preventiva?",
        "answer": "Conferimos o que existe hoje e apontamos as falhas do processo. Estruturar cópias, definir retenção e testar restauração é escopo da página de backup para empresas, contratado à parte."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="manutencao-preventiva-empresas" />,
});
