import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Vista Alegre",
  slug: "vista-alegre",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Vista Alegre | Curitiba",
  metaDescription: "Técnico de informática no Vista Alegre, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Vista Alegre – Curitiba",
  subtitulo: "Atendimento técnico no Vista Alegre com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Vista Alegre é um bairro residencial arborizado da região oeste, com casas maiores, terrenos amplos e boa presença de home office. Terreno grande costuma significar Wi-Fi que não chega na edícula ou no fundo da casa, então a demanda por diagnóstico de rede é alta, junto com lentidão de computador, formatação com backup e upgrade de SSD. Atendemos com triagem pelo WhatsApp, diagnóstico antes de qualquer valor e aprovação obrigatória. Reparos de bancada, como placa e tela, seguem por coleta com data combinada.",
  pontosReferencia: ["Santa Felicidade (divisa)","Bigorrilho (próx.)","Mercês (próx.)","Pilarzinho (divisa)","Av. Manoel Ribas","Butiatuvinha (próx.)"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const VistaAlegre = () => <BairroTemplate data={data} />;

export default VistaAlegre;
