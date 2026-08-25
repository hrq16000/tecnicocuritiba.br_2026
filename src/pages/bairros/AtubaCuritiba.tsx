import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Atuba",
  slug: "atuba",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Atuba | Curitiba",
  metaDescription: "Técnico de informática no Atuba, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Atuba – Curitiba",
  subtitulo: "Atendimento técnico no Atuba com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Atuba fica na divisa norte de Curitiba com Colombo e tem perfil residencial, com muitas casas e pequenos comércios de bairro. As solicitações mais comuns são computador travando, formatação com backup, remoção de vírus, troca de HD por SSD e configuração de roteador para melhorar o sinal nos fundos do terreno. Começamos pela triagem no WhatsApp, entregamos o diagnóstico antes de informar o valor e só executamos com a sua aprovação. Serviços que exigem bancada seguem por coleta agendada, com devolução combinada no mesmo endereço.",
  pontosReferencia: ["Rio Atuba","Bairro Alto (divisa)","Tingui (divisa)","Boa Vista (próx.)","Colombo (divisa)","Av. Paraná"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const AtubaCuritiba = () => <BairroTemplate data={data} />;

export default AtubaCuritiba;
