import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Butiatuvinha",
  slug: "butiatuvinha",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Butiatuvinha | Curitiba",
  metaDescription: "Técnico de informática no Butiatuvinha, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Butiatuvinha – Curitiba",
  subtitulo: "Atendimento técnico no Butiatuvinha com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "Butiatuvinha fica na região oeste de Curitiba, com perfil mais espaçado, chácaras, casas e pequenos negócios familiares. Os pedidos mais comuns são computador que ficou lento, formatação com backup, remoção de vírus, upgrade de SSD e cobertura de Wi-Fi em terrenos grandes, onde um único roteador não dá conta. Trabalhamos com triagem no WhatsApp, diagnóstico técnico antes de informar valor e aprovação sua antes da execução. Quando o defeito exige bancada — placa, fonte, tela — combinamos coleta e devolução, sem prometer prazo que não seja realista.",
  pontosReferencia: ["Santa Felicidade (divisa)","Vista Alegre (próx.)","Orleans (próx.)","São Braz (próx.)","Rodovia do Café (próx.)","Av. Manoel Ribas"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const Butiatuvinha = () => <BairroTemplate data={data} />;

export default Butiatuvinha;
