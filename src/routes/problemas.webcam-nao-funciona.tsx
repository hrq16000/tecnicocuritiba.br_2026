import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaWebcamNaoFunciona from "@/pages/problemas/WebcamNaoFunciona";

export const Route = createFileRoute("/problemas/webcam-nao-funciona")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/webcam-nao-funciona",
    "title": "Webcam Não Funciona: Causas e Solução | Curitiba",
    "description": "Webcam do notebook sem imagem, tela preta na reunião ou câmera não encontrada pelo sistema? Veja como separar permissão do sistema, driver, cabo flat e falha do módulo antes de comprar câmera externa, com avaliação técnica em Curitiba.",
    "faq": [
      {
        "question": "Minha webcam parou depois de uma atualização. É defeito de hardware?",
        "answer": "Quase nunca. Atualização que troca o driver por uma versão genérica é a causa mais comum desse cenário, e o sintoma característico é a câmera aparecer na lista de dispositivos com aviso de erro. A correção é de sistema e costuma ser feita por acesso remoto, sem retirar o equipamento do lugar."
      },
      {
        "question": "A imagem fica preta só na reunião, mas o aplicativo de câmera funciona. O que é?",
        "answer": "Se o aplicativo nativo mostra a imagem, o hardware está bom. Nesse caso, o bloqueio está na permissão daquele programa específico ou em outro software segurando a câmera aberta em segundo plano. Fechar todos os programas de vídeo e testar um por vez identifica o responsável em poucos minutos."
      },
      {
        "question": "A câmera do notebook some quando eu mexo na tampa. Tem conserto?",
        "answer": "Tem, e é um reparo de bancada. Esse comportamento indica cabo flat prensado ou com trilha rompida na passagem pela dobradiça. O serviço envolve abrir a moldura da tela com cuidado, avaliar o cabo e o módulo e testar a imagem antes da devolução. Não recomendamos abrir por conta própria porque o flat rasga com pouquíssima força."
      },
      {
        "question": "Vale mais a pena comprar uma webcam externa?",
        "answer": "Depende do uso. Se você precisa de imagem hoje para trabalhar, uma câmera externa resolve de imediato e é uma solução legítima. Mas se o notebook é novo ou se a falha veio junto com outros sintomas, avaliar antes evita conviver com um defeito que pode ser de cabo e que tende a piorar com o tempo."
      },
      {
        "question": "Câmera esverdeada ou com imagem tremida é sujeira na lente?",
        "answer": "Sujeira deixa a imagem embaçada, não esverdeada nem tremida. Cor alterada e imagem instável apontam para o sensor ou para o conector do módulo com contato parcial. Limpar a lente com pano seco é seguro e vale o teste, mas se a distorção continuar, o caminho é avaliação técnica."
      },
      {
        "question": "Pode ser vírus acessando ou bloqueando minha câmera?",
        "answer": "Bloqueio por antivírus ou por política de privacidade é bem mais comum que vírus. Vários pacotes de segurança trazem proteção de câmera ativada por padrão e barram programas legítimos. Verificamos essa camada antes de qualquer suspeita de hardware, e explicamos o que foi encontrado em vez de sugerir formatação por precaução."
      },
      {
        "question": "Como funciona o atendimento?",
        "answer": "Não temos balcão de atendimento ao público. Fazemos retirada e devolução no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Casos de permissão e driver costumam ser resolvidos remotamente, e avisamos quando esse é o caminho."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaWebcamNaoFunciona,
});
