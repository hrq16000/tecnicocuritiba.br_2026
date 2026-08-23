/**
 * Fonte única do conteúdo textual da Home renderizado no SSR.
 *
 * Existe para que o JSON-LD (FAQPage e ItemList de serviços) seja construído
 * a partir EXATAMENTE do mesmo conteúdo visível — sem perguntas ou URLs que
 * não existam na página. Importado por `HomeSections.tsx` (render) e por
 * `src/lib/seo/routeHead.ts` (SSR do grafo).
 */

export interface HomeFaq {
  q: string;
  a: string;
}

export interface HomeService {
  t: string;
  d: string;
  loc: string;
  cta: string;
  href: string;
}

export const HOME_SERVICES: HomeService[] = [
  { t: "Formatação e instalação de sistema", d: "Windows limpo, drivers e programas essenciais.", loc: "svc_formatacao", cta: "Como funciona a formatação →", href: "/servicos/formatacao" },
  { t: "Manutenção de notebook", d: "Limpeza, troca de pasta térmica, teclado e reparos.", loc: "svc_notebook", cta: "Detalhes do reparo de notebook →", href: "/servicos/manutencao-de-notebook" },
  { t: "Manutenção de computador", d: "Diagnóstico completo de PC e correção de falhas.", loc: "svc_pc", cta: "O que inclui a manutenção de PC →", href: "/servicos/manutencao-de-computador" },
  { t: "Upgrade SSD/RAM", d: "Mais velocidade com SSD e ampliação de memória.", loc: "svc_upgrade", cta: "Ganhos reais do upgrade →", href: "/servicos/upgrade-ssd-ram" },
  { t: "Remoção de vírus", d: "Limpeza de malware, adware e otimização segura.", loc: "svc_virus", cta: "Etapas da limpeza do sistema →", href: "/servicos/remocao-de-virus" },
  { t: "Backup e recuperação de dados", d: "Recuperação e cópia segura dos seus arquivos.", loc: "svc_backup", cta: "Como avaliamos a recuperação →", href: "/servicos/recuperacao-de-dados" },
  { t: "Redes e Wi-Fi", d: "Configuração, cabeamento e melhoria de sinal.", loc: "svc_redes", cta: "Como melhoramos o sinal →", href: "/servicos/redes-e-wifi" },
  { t: "Suporte técnico empresarial", d: "Manutenção preventiva e suporte para empresas.", loc: "svc_empresa", cta: "Escopo do suporte para empresas →", href: "/servicos/suporte-tecnico-empresarial" },
];

export const HOME_FAQS: HomeFaq[] = [
  { q: "Quanto custa chamar um técnico em Curitiba?", a: "O diagnóstico começa a partir de R$ 99,99 quando aplicável. O valor do atendimento do reparo depende do equipamento e do problema, e é apresentado antes da execução." },
  { q: "Vocês atendem notebook e computador?", a: "Sim. Atendemos notebook, PC e periféricos, com foco em informática." },
  { q: "Fazem atendimento empresarial?", a: "Sim. Prestamos suporte técnico para empresas: estações, rede e manutenção preventiva." },
  { q: "Tem recuperação de dados?", a: "Sim, avaliamos cada caso. A recuperação depende da condição real do disco e é informada após diagnóstico." },
  { q: "O valor do atendimento é fechado antes do serviço?", a: "Sim. Você aprova o valor antes de qualquer reparo. Nada é executado sem sua confirmação." },
  { q: "O atendimento é pelo WhatsApp?", a: "Sim, o contato e a triagem acontecem pelo WhatsApp para agilizar o diagnóstico." },
  { q: "O número fica visível no site?", a: "O contato é feito diretamente pelo botão de atendimento, que abre a triagem por WhatsApp." },
  { q: "Em quanto tempo conseguem atender?", a: "Sempre que houver disponibilidade na agenda, buscamos atender conforme a disponibilidade da agenda. A confirmação vem na triagem." },
];
