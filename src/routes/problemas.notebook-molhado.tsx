import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaNotebookMolhado from "@/pages/problemas/NotebookMolhado";

export const Route = createFileRoute("/problemas/notebook-molhado")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/notebook-molhado",
    "title": "Notebook Molhado? O Que Fazer nas Primeiras Horas | Curitiba",
    "description": "Derramou líquido no notebook? Entenda por que ligar o aparelho piora o quadro, o que fazer nas primeiras horas, como funciona a limpeza de placa e em que casos o.",
    "faq": [
      {
        "question": "Derramei líquido e o notebook continua ligando. Preciso fazer alguma coisa?",
        "answer": "Precisa, e com urgência maior do que parece. O aparelho que sobrevive ao primeiro momento é o que mais chega com dano irreversível semanas depois, porque a oxidação avança silenciosamente entre os contatos enquanto tudo aparenta normalidade. O procedimento correto é desligar, não religar e encaminhar para limpeza de placa — mesmo funcionando. Limpeza feita cedo custa uma fração de um reparo em placa oxidada."
      },
      {
        "question": "Colocar no arroz funciona?",
        "answer": "Não. O arroz não alcança o líquido que está entre a placa e os componentes, não neutraliza o resíduo condutivo de bebidas açucaradas e ainda deixa pó e amido nas aberturas de ventilação. A crença é popular porque muitos aparelhos voltam a ligar sozinhos depois de alguns dias — e voltam mesmo, com a oxidação já instalada, falhando pouco tempo depois."
      },
      {
        "question": "Quanto tempo eu tenho para agir?",
        "answer": "Não há um prazo exato, mas a diferença entre encaminhar no mesmo dia e esperar uma semana costuma ser a diferença entre limpeza e microssolda. Água limpa é a mais tolerante; café, refrigerante, cerveja e sucos deixam resíduo ácido ou açucarado que segue corroendo depois de seco. Quanto mais cedo a placa é limpa, maior a chance de recuperação integral e menor o custo."
      },
      {
        "question": "Vocês conseguem dizer o valor pelo WhatsApp?",
        "answer": "Damos a faixa provável a partir do que você descreve, mas o valor fechado sai depois da abertura, porque só a inspeção mostra a extensão da oxidação. O que garantimos é que nada é executado sem sua aprovação: você recebe diagnóstico, valor e prazo antes, e decide. Se o quadro for ruim, dizemos isso com clareza em vez de começar um reparo com baixa chance."
      },
      {
        "question": "Como o aparelho chega até vocês?",
        "answer": "Por coleta no endereço informado — não existe atendimento presencial em balcão. Você aciona pelo WhatsApp, combinamos a retirada, o notebook é avaliado em bancada e depois devolvido no mesmo endereço. Para casos de líquido, orientamos o transporte com o aparelho desligado e com a tela entreaberta, sem carregador conectado."
      },
      {
        "question": "Meus arquivos ficam perdidos se a placa não tiver conserto?",
        "answer": "Na maioria dos casos, não. O armazenamento fica em módulo separado da área que costuma sofrer com o líquido e normalmente é lido sem dificuldade em outro equipamento. Fazemos a cópia dos seus arquivos e entregamos em mídia à parte, o que permite decidir sobre o reparo com calma, sem o peso de perder documentos e fotos."
      },
      {
        "question": "Qual é a garantia em reparo de aparelho que sofreu líquido?",
        "answer": "90 dias sobre a mão de obra e sobre as peças aplicadas, escopados ao que foi reparado. Em equipamento que recebeu líquido, a garantia não se estende a falhas futuras em blocos que estavam funcionando na entrega: a corrosão pode ter atingido pontos que só se manifestam depois. Explicamos essa limitação antes do serviço, por escrito, e não vendemos garantia total onde ela não existe."
      },
      {
        "question": "Em que situação vocês recusam o reparo?",
        "answer": "Quando a inspeção mostra corrosão extensa em áreas críticas da placa, com custo de recuperação próximo ou superior ao valor de um aparelho equivalente. Nesses casos entregamos laudo com foto do estado interno, oferecemos a recuperação dos arquivos e devolvemos o equipamento. Não iniciamos reparo improvável apenas para faturar a tentativa."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaNotebookMolhado,
});
