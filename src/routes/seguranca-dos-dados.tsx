import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SegurancaDosDados from "@/pages/SegurancaDosDados";

export const Route = createFileRoute("/seguranca-dos-dados")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/seguranca-dos-dados",
    "title": "Segurança dos Dados na Assistência Técnica | Curitiba",
    "description": "Como arquivos, senhas e acessos são tratados durante a assistência técnica em Curitiba: autorização, acesso mínimo, backup prévio, cópias temporárias, limites e responsabilidades.",
    "faq": [
      {
        "question": "O técnico precisa acessar meus arquivos?",
        "answer": "Depende do serviço. Backup, formatação e recuperação de dados exigem localizar e manipular pastas de arquivos. Ajuste de rede, instalação de programa ou configuração de impressora normalmente não exigem. O acesso é sempre limitado ao necessário para executar o que foi combinado."
      },
      {
        "question": "Preciso informar minhas senhas?",
        "answer": "Apenas a senha do próprio equipamento ou da conta local, quando o serviço não puder ser executado sem ela. Senhas de banco, códigos de autenticação em duas etapas e credenciais sensíveis não devem ser enviados por mensagem nem informados durante o atendimento."
      },
      {
        "question": "Meus arquivos podem ser apagados?",
        "answer": "Procedimentos como formatação apagam o conteúdo do disco por definição, e por isso a cópia prévia é feita antes, com a sua autorização. Em discos já com falha, parte do conteúdo pode não ser legível. Nenhuma intervenção é totalmente livre de risco para os dados."
      },
      {
        "question": "É obrigatório fazer backup antes do atendimento?",
        "answer": "Não é uma exigência formal, mas é a recomendação técnica. Sempre que possível, mantenha uma cópia atualizada dos arquivos importantes antes de entregar ou liberar o equipamento. A cópia que fazemos durante o serviço depende do estado do armazenamento."
      },
      {
        "question": "Como funciona o acesso remoto?",
        "answer": "Com programa de fonte legítima, autorização explícita e você acompanhando a sessão na tela do próprio computador. O acesso é encerrado ao final do atendimento e nenhuma solicitação financeira é feita durante a sessão."
      },
      {
        "question": "Arquivos recuperados ficam armazenados com vocês?",
        "answer": "Cópias temporárias criadas durante o serviço existem apenas pelo tempo necessário para a entrega e a conferência do resultado. Depois da validação com você, essas cópias são descartadas, salvo combinação diferente registrada no atendimento."
      },
      {
        "question": "O serviço garante que não haverá perda de dados?",
        "answer": "Não. Nenhum serviço técnico honesto pode prometer proteção absoluta ou ausência total de risco. O que garantimos é o cuidado no procedimento, a informação antecipada sobre o risco de cada etapa e a decisão sempre nas suas mãos."
      },
      {
        "question": "Como são tratados dados de empresas?",
        "answer": "Com o mesmo princípio de acesso mínimo, acrescido da definição de quem autoriza o quê. Em ambiente corporativo, alterações em contas, políticas e sistemas dependem da autorização de quem responde pela empresa, e não do usuário do equipamento."
      }
    ]
  }),
  /* seo:auto-end */
  component: SegurancaDosDados,
});
