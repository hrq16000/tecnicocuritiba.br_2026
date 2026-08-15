import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import EmpresaDeTiCuritiba from "@/pages/EmpresaDeTiCuritiba";

export const Route = createFileRoute("/empresa-de-ti-curitiba")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/empresa-de-ti-curitiba",
    "title": "Empresa de TI em Curitiba | Soluções para Pequenas Empresas",
    "description": "Soluções de informática para empresas em Curitiba: diagnóstico do ambiente, computadores, redes, manutenção e organização do suporte técnico.",
    "faq": [
      {
        "question": "O que faz uma empresa de TI em Curitiba?",
        "answer": "Cuida da parte de tecnologia do seu negócio: manutenção de computadores e notebooks, rede e Wi-Fi, servidores locais, impressoras, backup de dados e segurança. O objetivo é manter a operação funcionando com o mínimo de paradas."
      },
      {
        "question": "Vocês atendem suporte de TI recorrente ou só emergência?",
        "answer": "Os dois. Atendemos chamados pontuais quando algo para de funcionar e também manutenção preventiva recorrente sob consulta, que costuma sair mais barato do que resolver tudo no modo emergência."
      },
      {
        "question": "Atendem empresas de qual porte?",
        "answer": "Trabalhamos com autônomos, escritórios, comércios e pequenas e médias empresas de Curitiba e região metropolitana. O escopo é adequado ao número de máquinas e à complexidade da rede."
      },
      {
        "question": "Como funciona o valor do atendimento do suporte de TI?",
        "answer": "Começa com uma avaliação para entender o ambiente e a demanda. A partir daí apresentamos o valor do atendimento, que só é executado após a sua aprovação. O diagnóstico começa a partir de"
      },
      {
        "question": "Vocês atendem no local da empresa?",
        "answer": "Sim, atendemos presencialmente em Curitiba e região, e também remotamente para ajustes que não exigem visita. Reparos de bancada podem usar coleta e entrega."
      },
      {
        "question": "O suporte pode ser avulso?",
        "answer": "Pode. Muitas empresas começam com um chamado único — uma máquina parada, um usuário sem acesso, a impressora fora da rede — e só depois avaliam um acompanhamento recorrente. Não exigimos vínculo para atender."
      },
      {
        "question": "Vocês atendem computadores de funcionários?",
        "answer": "Sim, desde que sejam os equipamentos usados no trabalho e que a empresa autorize o atendimento. Organizamos por lote e prioridade para que a operação não pare inteira durante o serviço."
      },
      {
        "question": "Redes e Wi-Fi fazem parte do atendimento?",
        "answer": "Fazem. Instabilidade, cobertura irregular, compartilhamento e impressoras em rede são tratados na página de redes e Wi-Fi, que detalha o levantamento do ambiente e os limites do que conseguimos executar."
      },
      {
        "question": "Como funciona o diagnóstico?",
        "answer": "Começa pela triagem, com a descrição do que está acontecendo, quais máquinas e desde quando. Em seguida avaliamos o ambiente ou o equipamento, explicamos o que foi encontrado e apresentamos o valor. Nada é executado sem a sua autorização."
      },
      {
        "question": "Quais informações devo registrar antes de pedir suporte?",
        "answer": "Equipamento e usuário afetados, horário aproximado do início do problema, mensagem de erro, programa envolvido, alteração recente, impacto na operação, quantas pessoas estão paradas, se o acesso remoto é possível, se existe backup recente, quem autoriza alterações e o contato do fornecedor do sistema quando o problema for dele. Senhas e códigos de autenticação não devem ser enviados por mensagem."
      }
    ]
  }),
  /* seo:auto-end */
  component: EmpresaDeTiCuritiba,
});
