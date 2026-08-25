import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Centro Cívico",
  slug: "centro-civico",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Centro Cívico | Curitiba",
  metaDescription: "Técnico de informática no Centro Cívico, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Centro Cívico – Curitiba",
  subtitulo: "Atendimento técnico no Centro Cívico com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Centro Cívico concentra órgãos públicos, escritórios e prédios residenciais em um raio pequeno, o que cria uma demanda muito específica: máquinas que não podem ficar paradas durante o expediente e redes domésticas em apartamentos com muita interferência de sinal. Atendemos moradores e escritórios da região com triagem pelo WhatsApp, diagnóstico antes de informar qualquer valor e aprovação obrigatória do serviço. Quando o problema é de software, rede ou desempenho, normalmente resolvemos na própria visita; quando exige bancada, como reparo de placa ou troca de tela, combinamos coleta e devolução.",
  pontosReferencia: ["Palácio Iguaçu","Assembleia Legislativa","Praça Nossa Senhora de Salette","Centro (divisa)","Alto da Glória (divisa)","Juvevê (divisa)"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const CentroCivico = () => <BairroTemplate data={data} />;

export default CentroCivico;
