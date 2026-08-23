import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AtendimentoRemoto from "@/pages/AtendimentoRemoto";

export const Route = createFileRoute("/atendimento-remoto")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/atendimento-remoto",
    "title": "Suporte Remoto de Informática em Curitiba | Online",
    "description": "Suporte remoto de informática em Curitiba para configurações, sistema, programas, e-mail, impressora já conectada, orientação e home office — com autorização e.",
    "faq": [
      {
        "question": "O que pode ser resolvido remotamente?",
        "answer": "Configurações do sistema, erros do Windows, atualizações, drivers, instalação de programas legítimos, e-mail, impressora já conectada, acesso a arquivos e pastas, ajustes de navegador, orientação ao usuário e o diagnóstico inicial de lentidão ligada a software."
      },
      {
        "question": "Meu computador precisa estar funcionando?",
        "answer": "Sim. O atendimento remoto depende de o equipamento ligar, o sistema carregar e existir conexão de internet estável. Sem esses três itens não há como estabelecer a sessão, e o caso passa para atendimento presencial ou coleta."
      },
      {
        "question": "O técnico consegue ver meus arquivos?",
        "answer": "Durante a sessão, a tela do seu computador fica visível para quem atende, e alguns serviços exigem abrir pastas ou configurações. O acesso é limitado ao necessário para executar o que foi combinado, e você acompanha cada passo."
      },
      {
        "question": "Preciso informar minha senha?",
        "answer": "Apenas a senha do próprio computador, quando o serviço não puder ser executado sem ela — e no momento do atendimento. Senhas bancárias, códigos de autenticação em duas etapas e credenciais sensíveis não devem ser enviados por mensagem."
      },
      {
        "question": "O programa de acesso fica instalado depois?",
        "answer": "Não precisa ficar. Encerramos o acesso ao final do atendimento e, se você preferir, orientamos a remoção do programa. Não mantemos acesso permanente nem monitoramento contínuo do seu equipamento."
      },
      {
        "question": "Problemas de hardware podem ser resolvidos remotamente?",
        "answer": "Não. Equipamento que não liga, tela sem imagem, aquecimento, dano por líquido, bateria, fonte, placa-mãe ou disco fisicamente danificado exigem avaliação presencial ou coleta. O remoto pode, no máximo, ajudar a levantar indícios antes da visita."
      },
      {
        "question": "O atendimento remoto possui garantia?",
        "answer": "O serviço executado tem garantia sobre aquilo que foi feito, nas condições descritas na página de preços e políticas. A garantia não cobre novo problema de causa diferente nem alterações feitas depois por outra pessoa."
      },
      {
        "question": "O valor é informado antes do início?",
        "answer": "Sim. Depois da triagem, confirmamos se o caso é compatível com acesso remoto e apresentamos o valor do atendimento. A sessão só começa após a sua aprovação."
      }
    ]
  }),
  /* seo:auto-end */
  component: AtendimentoRemoto,
});
