import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/remocao-de-virus")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/remocao-de-virus",
    "title": "Remoção de Vírus e Malware em Curitiba | PC e Notebook",
    "description": "Remoção de vírus, malware e sequestro de navegador em Curitiba. Limpeza segura, proteção dos seus dados e reinstalação quando necessário. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "Vou perder meus arquivos na remoção de vírus?",
        "answer": "O objetivo é preservar seus dados. Em infecções graves, com criptografia ou corrupção, nem sempre há garantia de integridade total — por isso priorizamos o backup antes de intervir e explicamos os riscos."
      },
      {
        "question": "Sempre precisa formatar para remover vírus?",
        "answer": "Não. Muitos casos são resolvidos com limpeza direcionada. A formatação só é indicada quando o sistema está comprometido demais."
      },
      {
        "question": "Meu navegador foi 'sequestrado', dá para resolver?",
        "answer": "Sim. Removemos extensões e redirecionamentos maliciosos e reconfiguramos o navegador com segurança."
      },
      {
        "question": "PC lento é sempre vírus?",
        "answer": "Não. Lentidão pode vir de HD desgastado, pouca memória, aquecimento, programas iniciando junto com o Windows, falta de espaço ou falha física. Vírus é uma hipótese quando a lentidão vem com pop-ups, redirecionamentos, programas desconhecidos, uso anormal de rede ou acessos suspeitos. O diagnóstico separa causa de software e hardware antes de indicar limpeza ou formatação."
      },
      {
        "question": "Como identificar vírus no computador sem piorar o problema?",
        "answer": "Observe sinais objetivos: navegador abrindo páginas diferentes, extensões que você não instalou, avisos falsos, contas com login desconhecido ou arquivos bloqueados. Não clique em alertas que pedem telefone ou pagamento e não instale ferramentas anunciadas nesses avisos. Se houver dados importantes, desconecte a internet e procure orientação por outro aparelho."
      },
      {
        "question": "Como evitar pegar vírus de novo?",
        "answer": "Orientamos sobre antivírus, atualizações, downloads seguros e cuidado com anexos e links. A prevenção faz parte do atendimento."
      },
      {
        "question": "Recebi um aviso pedindo pagamento, é golpe?",
        "answer": "Avisos que pedem pagamento ou ligação urgente costumam ser golpe. Não pague nem ligue: avaliamos o equipamento e orientamos com segurança."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="remocao-de-virus" />,
});
