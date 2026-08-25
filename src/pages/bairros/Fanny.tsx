import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Fanny",
  slug: "fanny",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Fanny | Curitiba",
  metaDescription: "Técnico de informática no Fanny, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Fanny – Curitiba",
  subtitulo: "Atendimento técnico no Fanny com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Fanny é um bairro residencial da região sul, com casas, condomínios menores e comércio de bairro. Os problemas mais recorrentes que atendemos ali são computador lento, sistema que não inicia, vírus e a necessidade de backup antes de formatar. Também é comum o pedido de melhoria de Wi-Fi em casas com laje ou área nos fundos. O contato começa no WhatsApp, o diagnóstico acontece antes de qualquer valor e a execução depende da sua aprovação. Quando é caso de bancada — solda, conector de energia, tela — combinamos coleta e devolução no endereço.",
  pontosReferencia: ["Av. Winston Churchill","Lindóia (divisa)","Novo Mundo (divisa)","Hauer (próx.)","Boqueirão (próx.)","Linha Verde"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const Fanny = () => <BairroTemplate data={data} />;

export default Fanny;
