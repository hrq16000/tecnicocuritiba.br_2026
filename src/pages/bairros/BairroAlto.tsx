import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Bairro Alto",
  slug: "bairro-alto",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Bairro Alto | Curitiba",
  metaDescription: "Técnico de informática no Bairro Alto, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Bairro Alto – Curitiba",
  subtitulo: "Atendimento técnico no Bairro Alto com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Bairro Alto é predominantemente residencial, com casas, comércio de vizinhança e muitas famílias que usam um único computador para trabalho, estudo e entretenimento. Por isso a maior parte dos chamados envolve lentidão, vírus, formatação com backup dos arquivos e Wi-Fi que não cobre a casa inteira. Atendemos a região com triagem pelo WhatsApp, diagnóstico técnico antes do valor e aprovação obrigatória antes de qualquer serviço. Quando o reparo exige bancada — placa-mãe, fonte, tela de notebook — combinamos coleta e devolução, sem promessa de prazo que não possamos cumprir.",
  pontosReferencia: ["Terminal Bairro Alto","Av. Paraná","Boa Vista (divisa)","Atuba (divisa)","Tarumã (divisa)","Cajuru (próx.)"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const BairroAlto = () => <BairroTemplate data={data} />;

export default BairroAlto;
