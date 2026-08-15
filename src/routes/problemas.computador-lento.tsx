import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaComputadorLento from "@/pages/problemas/ComputadorLento";

export const Route = createFileRoute("/problemas/computador-lento")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/computador-lento",
    "title": "Computador Lento? Diagnóstico Técnico em Curitiba",
    "description": "Computador ou notebook lento para ligar e abrir programas? Veja os sintomas, as causas possíveis, quando SSD ou memória resolvem, quando formatar e quando trocar o equipamento.",
    "faq": [
      {
        "question": "Por que o computador fica lento com o tempo?",
        "answer": "Raramente por um motivo só. O disco vai enchendo e o sistema perde espaço de trabalho, programas se acumulam na inicialização, atualizações aumentam a exigência de memória e a poeira reduz a refrigeração. Cada fator sozinho seria discreto; somados, mudam a percepção de uso. Por isso a avaliação olha os quatro grupos antes de indicar qualquer intervenção."
      },
      {
        "question": "Vírus pode deixar o computador lento?",
        "answer": "Pode, e é uma das origens possíveis. Programas indesejados, extensões de navegador e mineradores consomem processamento e rede continuamente. Quando a lentidão vem acompanhada de anúncios, abas abrindo sozinhas ou busca alterada, essa hipótese entra na frente — mas ela é confirmada na avaliação, não presumida."
      },
      {
        "question": "Travamentos podem indicar falha no HD ou no SSD?",
        "answer": "Podem. Travamentos progressivos, arquivos que demoram a abrir, mensagens de erro de leitura e ruído de clique são sinais que pedem verificação da saúde do armazenamento. Não é conclusão automática: o mesmo comportamento aparece em problemas de memória ou de sistema. A diferença é que, havendo suspeita de disco, preservar os dados passa à frente de qualquer reparo."
      },
      {
        "question": "É seguro continuar usando o computador enquanto está lento?",
        "answer": "Se a lentidão é estável e não há ruídos, erros de leitura nem travamentos progressivos, o uso normal costuma ser possível. Quando existem esses sinais ou arquivos importantes ainda sem cópia, insistir no uso aumenta o risco de perda de dados — nesse cenário o recomendado é fazer backup enquanto o sistema ainda abre e procurar avaliação, se necessário com apoio de recuperação de dados."
      },
      {
        "question": "Computador lento precisa sempre de formatação?",
        "answer": "Não. Formatar resolve o que é software — sistema corrompido, infecção persistente ou acúmulo de instalações. Não resolve HD mecânico lento, memória insuficiente nem aquecimento. Formatar nesses casos devolve uma melhora curta, e a lentidão volta em poucos dias."
      },
      {
        "question": "Trocar o HD por SSD resolve mesmo?",
        "answer": "Na maioria dos equipamentos que ainda usam HD mecânico como disco do sistema, é a mudança mais perceptível no dia a dia: inicialização, abertura de programas e resposta geral. Se a máquina já tem SSD e continua lenta, a causa é outra e o diagnóstico investiga memória, temperatura, software ou saúde do disco."
      },
      {
        "question": "Quanta memória RAM é suficiente?",
        "answer": "Depende do uso real. Navegação com muitas abas, planilhas grandes e programas de trabalho simultâneos exigem mais do que uso básico. O que definimos na avaliação é o limite suportado pela placa, o padrão compatível e se a memória é de fato o gargalo — ampliar sem necessidade não traz ganho."
      },
      {
        "question": "Posso perder arquivos ao resolver a lentidão?",
        "answer": "Instalação de SSD, ampliação de memória e limpeza interna não exigem apagar dados. Quando o caminho envolve reinstalação do sistema, a cópia dos arquivos é feita antes e você é avisado do que será preservado. Se o disco apresentar falha, preservar os dados vira prioridade sobre qualquer outra etapa."
      },
      {
        "question": "Quando vale mais trocar o computador do que investir nele?",
        "answer": "Quando a placa não suporta mais memória, quando o processador limita o uso pretendido, quando a soma das peças se aproxima do valor de um equipamento equivalente ou quando há falha estrutural. Nesses casos explicamos o cenário e a alternativa, incluindo a migração dos seus dados para a máquina nova."
      },
      {
        "question": "O valor pode ser informado antes do diagnóstico?",
        "answer": "Não com precisão. Lentidão é sintoma, não causa: o mesmo comportamento aparece em situações de complexidade bem diferente. As condições comerciais vigentes estão publicadas na página de preços e políticas, e o valor do serviço é apresentado depois da causa confirmada, dependendo da sua autorização."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaComputadorLento,
});
