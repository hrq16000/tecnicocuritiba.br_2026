import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Lindóia",
  slug: "lindoia",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Lindóia | Curitiba",
  metaDescription: "Técnico de informática no Lindóia, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Lindóia – Curitiba",
  subtitulo: "Atendimento técnico no Lindóia com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Lindóia é um bairro residencial da zona sul, com ruas de casas e comércio de vizinhança. Os chamados que mais chegam da região envolvem lentidão do computador, formatação com backup dos arquivos, remoção de vírus, upgrade de SSD e memória e ajuste de rede sem fio. Atendemos com triagem pelo WhatsApp, diagnóstico técnico antes de informar valor e aprovação obrigatória antes de executar. Quando o defeito é físico e exige bancada, como placa-mãe ou tela de notebook, o equipamento é coletado com data combinada e devolvido após o reparo aprovado.",
  pontosReferencia: ["Av. Winston Churchill","Fanny (divisa)","Novo Mundo (divisa)","Capão Raso (próx.)","Portão (próx.)","Terminal Portão"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const Lindoia = () => <BairroTemplate data={data} />;

export default Lindoia;
