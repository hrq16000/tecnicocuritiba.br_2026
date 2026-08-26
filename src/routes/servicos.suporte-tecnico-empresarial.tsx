import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/suporte-tecnico-empresarial")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/suporte-tecnico-empresarial",
    "title": "Suporte Técnico para Empresas em Curitiba | Informática",
    "description": "Suporte técnico de informática para empresas em Curitiba, com atendimento para computadores, usuários, redes, impressoras e manutenção preventiva.",
    "faq": [
      {
        "question": "O suporte pode ser contratado uma única vez?",
        "answer": "Sim. O atendimento avulso resolve uma demanda específica — máquina parada, usuário sem acesso, impressora fora do ar — sem exigir qualquer vínculo recorrente."
      },
      {
        "question": "Vocês atendem remotamente?",
        "answer": "Sim, para o que não depende de intervenção física: sistema, configuração, acessos, programas, impressão e boa parte dos incidentes de usuário. Falhas de hardware, rede e infraestrutura exigem visita."
      },
      {
        "question": "O atendimento inclui programas?",
        "answer": "Inclui instalação, configuração e correção de programas compatíveis, desde que a empresa forneça instalador e licença. Não damos suporte ao funcionamento interno de sistemas de terceiros que possuem fabricante próprio."
      },
      {
        "question": "Peças estão incluídas?",
        "answer": "Não. Componentes e materiais são tratados à parte, informados antes e substituídos apenas mediante a sua autorização."
      },
      {
        "question": "Existe prazo garantido?",
        "answer": "Não trabalhamos com prazo de resposta garantido nem plantão. O atendimento é agendado conforme a disponibilidade, e prioridades e prazos, quando aplicáveis, são definidos na contratação do atendimento recorrente."
      },
      {
        "question": "É possível atender vários computadores?",
        "answer": "Sim. Atendimentos com várias estações são organizados por lote e por prioridade, para que a operação não pare inteira durante o serviço."
      },
      {
        "question": "Como funciona o faturamento?",
        "answer": "O escopo é definido após o diagnóstico e o valor é apresentado e aprovado antes da execução. As formas de pagamento e as condições aplicáveis estão descritas na página de preços e políticas."
      },
      {
        "question": "Há garantia?",
        "answer": "Sim, conforme o serviço executado e as condições publicadas em preços e políticas. A garantia cobre o serviço realizado, não novas falhas de causa diferente nem alterações feitas depois da entrega."
      },
      {
        "question": "Vocês atendem empresas de qual porte?",
        "answer": "Atendemos principalmente autônomos, escritórios, comércios e micro e pequenas empresas em Curitiba e região, de forma avulsa ou recorrente, dentro da nossa capacidade operacional."
      },
      {
        "question": "Quando uma pequena empresa precisa terceirizar o suporte de TI?",
        "answer": "Quando as falhas começam a consumir tempo da equipe, não existe responsável claro pelas máquinas e rede, ou os mesmos incidentes voltam sem registro. Terceirizar não significa contratar suporte ilimitado: significa definir um escopo, uma rotina e uma referência técnica para diagnosticar, priorizar e documentar as decisões."
      },
      {
        "question": "O que preparar antes de pedir suporte técnico empresarial?",
        "answer": "Informe quantas pessoas foram afetadas, qual equipamento ou setor parou, mensagem de erro, horário de início, o que mudou, impacto na operação e se existe backup recente. Não envie senhas ou códigos de autenticação por mensagem. Com esse contexto, a triagem diferencia urgência real de ajuste simples e orienta se o caso pode começar remotamente."
      },
      {
        "question": "Como funcionam os planos de suporte gerenciado?",
        "answer": "Para empresas com quatro ou mais computadores, existem os planos Essencial, Pro e Premium, cobrados por máquina gerenciada. Antes de contratar, registramos os ativos, o escopo, os horários, as responsabilidades e o que fica fora. Os planos não significam suporte ilimitado ou plantão 24 horas."
      },
      {
        "question": "Fazem atendimento de emergência?",
        "answer": "Avaliamos situações com operação parada e priorizamos o restabelecimento conforme a disponibilidade da agenda. Não mantemos plantão em regime ininterrupto."
      },
      {
        "question": "Resolvem problemas de rede e impressão?",
        "answer": "Sim, esses estão entre os chamados mais comuns. Casos que envolvem cobertura, cabeamento ou reestruturação da conectividade são conduzidos pela página de redes e Wi-Fi."
      },
      {
        "question": "Vocês acessam sistemas e contas de terceiros da empresa?",
        "answer": "Somente quando a empresa autoriza, com credenciais fornecidas por quem tem poder para isso e apenas pelo tempo do atendimento. Atuamos na camada de acesso e configuração local: instalar, conectar, corrigir sessão, ajustar navegador, impressora ou permissão do sistema operacional. Não administramos a conta, não respondemos pelo funcionamento interno da plataforma e não substituímos o suporte do fornecedor dela."
      },
      {
        "question": "Quem responde quando o problema está no sistema do fornecedor?",
        "answer": "O fornecedor. Nós identificamos e registramos que a falha está fora do computador — servidor do fabricante fora do ar, atualização do sistema, licença vencida, regra de acesso alterada — e entregamos essa constatação por escrito para você acionar quem mantém a plataforma. Não abrimos chamado em nome da empresa sem autorização expressa."
      },
      {
        "question": "Qual é a diferença entre atendimento avulso e recorrente?",
        "answer": "No avulso o escopo é definido a cada solicitação, a prioridade segue a agenda disponível e o valor é apresentado após o diagnóstico. No recorrente combinamos previamente escopo, itens acompanhados, frequência, horários e regra de prioridade, a partir de um levantamento inicial do ambiente. Nenhum dos dois é automaticamente melhor: depende da quantidade de equipamentos e de quanto a parada custa."
      },
      {
        "question": "Atendimento recorrente significa suporte ilimitado?",
        "answer": "Não. O recorrente é um acordo delimitado: o que entra no escopo, com que frequência e em quais horários fica registrado antes de começar, e o que fica de fora é tratado à parte. Não trabalhamos com suporte ilimitado, plantão permanente, prazo de resposta garantido nem monitoramento contínuo."
      },
      {
        "question": "Vocês corrigem problemas dentro de sistemas de terceiros?",
        "answer": "Não. Verificamos o computador, validamos a conectividade, registramos o erro por escrito, executamos procedimentos autorizados e ajudamos na comunicação técnica com o fornecedor. Corrigir código do sistema, liberar licença, redefinir credencial mantida por terceiro ou responder pela indisponibilidade da plataforma externa é responsabilidade de quem mantém o sistema."
      },
      {
        "question": "Vocês guardam senhas da empresa?",
        "answer": "Não mantemos credenciais depois do atendimento. Recomendamos que a empresa troque a senha usada em qualquer acesso pontual e que credenciais administrativas fiquem sob controle de um responsável interno. Trabalhamos com o mínimo de acesso necessário para resolver o chamado."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="suporte-tecnico-empresarial" />,
});
