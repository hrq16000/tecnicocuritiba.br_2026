import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import FAQ from "@/pages/FAQ";

export const Route = createFileRoute("/faq")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/faq",
    "title": "FAQ Técnico Curitiba | Preço, Prazo e Garantia",
    "description": "Dúvidas sobre preço, prazo, garantia, formatação, vírus e atendimento técnico em Curitiba. Veja respostas rápidas e chame no WhatsApp.",
    "faq": [
      {
        "question": "Quanto custa chamar um técnico em Curitiba?",
        "answer": "Quando há visita ou diagnóstico presencial aplicável, o atendimento começa a partir de R$ 99,99. O valor final depende da avaliação do problema, do tempo necessário e de eventuais peças, licenças ou materiais. Passamos a estimativa antes de iniciar."
      },
      {
        "question": "O valor do atendimento é passado antes do serviço?",
        "answer": "Sim. Você recebe orientação, prazo estimado e condições antes de qualquer execução. O serviço só avança após o seu alinhamento. Estimativas iniciais são feitas pelo WhatsApp; casos que exigem análise podem precisar de diagnóstico presencial ou em laboratório."
      },
      {
        "question": "Vocês atendem notebook e computador?",
        "answer": "Sim. Trabalhamos com notebooks e computadores (PC), incluindo manutenção, formatação, limpeza, otimização e diagnóstico de problemas de hardware e software."
      },
      {
        "question": "Fazem formatação com backup?",
        "answer": "Sim. Fazemos formatação e reinstalação do sistema e podemos realizar backup dos seus dados antes do processo, quando solicitado. O backup pode influenciar o prazo e o valor do atendimento."
      },
      {
        "question": "Fazem upgrade para SSD e memória RAM?",
        "answer": "Sim. Verificamos a compatibilidade do seu equipamento e fazemos upgrade de SSD e de memória RAM. As peças não estão incluídas na mão de obra e podem ser cobradas à parte."
      },
      {
        "question": "Removem vírus?",
        "answer": "Sim. Fazemos varredura, remoção de ameaças e configuração de proteção adequada. Em casos complexos, pode ser necessário mais tempo de análise, o que é informado antes."
      },
      {
        "question": "Recuperação de dados é garantida?",
        "answer": "Não. A recuperação de dados depende do tipo e da gravidade do dano no equipamento, por isso não é possível garantir sucesso. Fazemos a análise e explicamos as possibilidades e condições antes de prosseguir."
      },
      {
        "question": "Atendem Wi-Fi e redes?",
        "answer": "Sim. Configuramos roteadores, redes Wi-Fi, melhoria de sinal e organização de rede para residências e empresas."
      },
      {
        "question": "Atendem empresas?",
        "answer": "Sim. Oferecemos suporte técnico empresarial, com atendimento pontual ou escopo recorrente sob consulta, conforme a estrutura e as necessidades da empresa."
      },
      {
        "question": "Quais regiões são atendidas?",
        "answer": "Atendemos Curitiba e a região metropolitana, incluindo São José dos Pinhais, Pinhais, Colombo, Araucária e Campo Largo. Parte dos atendimentos também pode ser feita de forma remota."
      }
    ]
  }),
  /* seo:auto-end */
  component: FAQ,
});
