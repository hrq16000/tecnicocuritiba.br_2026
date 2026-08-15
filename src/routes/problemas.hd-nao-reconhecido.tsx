import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaHdNaoReconhecido from "@/pages/problemas/HdNaoReconhecido";

export const Route = createFileRoute("/problemas/hd-nao-reconhecido")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/hd-nao-reconhecido",
    "title": "HD ou SSD Não é Reconhecido: O Que Fazer | Curitiba",
    "description": "O computador não reconhece o HD ou SSD? Entenda a diferença entre falha de cabo, de partição e de mecânica, por que insistir reduz a chance de recuperar arquivos e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "O computador pede para formatar o disco. Posso aceitar?",
        "answer": "Não aceite. Essa mensagem aparece quando o sistema não consegue interpretar a estrutura da unidade, o que na maioria das vezes não significa que os arquivos sumiram. Formatar reescreve justamente as tabelas que um trabalho de recuperação usaria para remontar as pastas. O procedimento correto é desconectar o disco, não usá-lo mais e encaminhar para leitura em bancada, sobre uma cópia."
      },
      {
        "question": "Como saber se o problema é o disco ou o computador?",
        "answer": "O primeiro teste é a BIOS. Se a unidade aparece lá e o sistema não inicia, o disco está vivo eletricamente e a falha é de estrutura lógica. Se não aparece nem na BIOS, o passo seguinte é trocar cabo e porta antes de qualquer conclusão — mau contato e porta SATA defeituosa produzem exatamente o mesmo sintoma de disco morto e custam muito menos para resolver."
      },
      {
        "question": "Meu HD está fazendo barulho de clique. Isso tem conserto?",
        "answer": "O clique ritmado indica que a cabeça de leitura não consegue se posicionar, e o desfecho depende muito da rapidez. Cada nova tentativa de ligar aumenta o risco de riscar a superfície, então a orientação é desligar imediatamente e não testar mais. Recuperação nesse cenário é procedimento especializado, com chance variável — informamos a expectativa real antes, e não iniciamos tentativa quando ela é improvável."
      },
      {
        "question": "Programas de recuperação que eu baixo funcionam?",
        "answer": "Funcionam em casos leves, como arquivo apagado por engano em disco saudável. Em disco que não é reconhecido, costumam piorar a situação por dois motivos: são instalados no mesmo equipamento afetado, sobrescrevendo áreas úteis, e trabalham diretamente sobre a unidade com defeito, forçando leituras que aceleram a degradação. O caminho seguro é sempre clonar primeiro e trabalhar sobre a cópia."
      },
      {
        "question": "Quanto custa recuperar os dados?",
        "answer": "Depende do tipo de falha, e por isso o valor não sai antes da avaliação. Casos lógicos, com o disco íntegro, são bem mais acessíveis que casos com dano mecânico. Damos a faixa provável a partir da sua descrição e o valor fechado depois da inspeção, sempre com sua aprovação antes de qualquer execução. Se a chance for baixa, dizemos isso em vez de vender uma tentativa."
      },
      {
        "question": "Como o disco chega até vocês?",
        "answer": "Por coleta no endereço informado — não temos balcão de atendimento ao público. Você aciona pelo WhatsApp, combinamos a retirada do computador ou apenas da unidade, a avaliação é feita em bancada e a devolução acontece no mesmo endereço. Para HD com ruído mecânico, orientamos transporte sem energizar o aparelho."
      },
      {
        "question": "Os arquivos recuperados vêm de que forma?",
        "answer": "Entregamos em mídia separada — outro disco ou pen drive, conforme o volume — e nunca de volta na unidade que falhou. Você confere o conteúdo antes de encerrarmos o atendimento. Nada dos seus arquivos permanece conosco depois da entrega, e não abrimos documentos além do necessário para verificar a integridade da recuperação."
      },
      {
        "question": "Existe garantia em recuperação de dados?",
        "answer": "Garantimos o serviço executado e a mídia de entrega por 90 dias, mas não existe garantia de resultado em recuperação: nenhuma bancada honesta promete trazer 100% dos arquivos de um disco com defeito. O que garantimos é transparência sobre a chance antes de começar, procedimento sobre cópia e devolução do equipamento com laudo quando o resultado não for possível."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaHdNaoReconhecido,
});
