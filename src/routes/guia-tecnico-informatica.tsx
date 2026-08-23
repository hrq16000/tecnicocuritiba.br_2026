import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import GuiaTecnicoInformatica from "@/pages/GuiaTecnicoInformatica";

export const Route = createFileRoute("/guia-tecnico-informatica")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/guia-tecnico-informatica",
    "title": "Guia Técnico: Manutenção de PC e Notebook Passo a Passo",
    "description": "Guia completo de manutenção de computador e notebook: como identificar a família da falha, o que verificar antes de chamar o técnico, quando o upgrade compensa.",
    "faq": [
      {
        "question": "Como sei se o problema é de hardware ou de software?",
        "answer": "O padrão do sintoma ajuda. Falha que aparece antes do sistema carregar — sem imagem, bipes, desligamento imediato, não ligar — aponta para hardware. Problema que só ocorre depois da área de trabalho carregar, com erros, lentidão ou programas indesejados, aponta para software. A confirmação só vem com o equipamento avaliado."
      },
      {
        "question": "Vale a pena consertar um computador antigo?",
        "answer": "Depende da relação entre o custo do reparo e o valor de um equipamento equivalente. Quando a soma de peças se aproxima desse valor, ou quando a placa não suporta mais memória e o processador limita o uso pretendido, explicamos o cenário e a alternativa, incluindo a migração dos seus dados."
      },
      {
        "question": "Formatar resolve lentidão?",
        "answer": "Resolve quando a causa é software. Se o gargalo é HD mecânico, memória insuficiente ou aquecimento, a máquina volta a ficar lenta pouco tempo depois da formatação. Por isso a lentidão é investigada por família de causa antes de definir o procedimento."
      },
      {
        "question": "Meus arquivos correm risco durante a manutenção?",
        "answer": "O procedimento é sempre combinado antes. Quando há suspeita de falha de disco, a prioridade é preservar os dados antes de qualquer tentativa de reparo. Em formatação, o backup é tratado como etapa obrigatória do serviço, e não como opcional."
      },
      {
        "question": "O atendimento pode ser feito sem sair de casa?",
        "answer": "Boa parte dos casos de sistema, configuração e programa é resolvida por atendimento remoto. Rede, instalação e verificação inicial funcionam bem em domicílio. Falha física, troca de peça e recuperação de dados pedem bancada, com coleta e entrega quando necessário."
      },
      {
        "question": "Quanto tempo demora uma manutenção de computador ou notebook?",
        "answer": "Depende da família da falha. Serviços de sistema, configuração e remoção de programas indesejados costumam ser resolvidos no mesmo atendimento. Reparo com troca de peça depende da disponibilidade do componente. Avaliação de disco com falha é o caso mais longo, porque a leitura é feita em etapas para não agravar o problema. O prazo estimado é informado na aprovação, antes da execução."
      },
      {
        "question": "Trocar HD por SSD faz diferença em um computador antigo?",
        "answer": "Na maior parte dos casos de lentidão em máquina com disco mecânico, é a intervenção de maior impacto percebido: o tempo de inicialização e a abertura de programas caem de forma evidente. O SSD não resolve travamento por superaquecimento nem falta de memória, então a avaliação verifica o conjunto antes de recomendar apenas a troca."
      },
      {
        "question": "Notebook desligando sozinho é sempre superaquecimento?",
        "answer": "Não. Desligamento repentino aparece em aquecimento, mas também em fonte ou carregador inadequado, bateria degradada, falha de alimentação da placa e até em erro de sistema. O que separa os cenários é o momento em que ocorre: sob esforço, logo ao ligar ou em qualquer situação. Essa informação é pedida já na triagem."
      },
      {
        "question": "Preciso levar o equipamento ou o atendimento pode ser em casa?",
        "answer": "Sistema, configuração e programas normalmente são resolvidos por atendimento remoto. Rede, impressora e verificação inicial funcionam bem em domicílio. Falha física, troca de peça, microssoldagem e recuperação de dados exigem bancada, com coleta e entrega quando necessário. A modalidade é definida na triagem, não depois."
      }
    ]
  }),
  /* seo:auto-end */
  component: GuiaTecnicoInformatica,
});
