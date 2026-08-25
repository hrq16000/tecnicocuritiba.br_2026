import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Santa Quitéria",
  slug: "santa-quiteria",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Santa Quitéria | Curitiba",
  metaDescription: "Técnico de informática no Santa Quitéria, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Santa Quitéria – Curitiba",
  subtitulo: "Atendimento técnico no Santa Quitéria com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "Santa Quitéria é um bairro residencial próximo ao eixo do Portão, com casas, prédios menores e comércio de rua. A maior parte dos atendimentos envolve computador lento, formatação com backup, remoção de vírus, troca de HD por SSD e configuração de Wi-Fi para cobrir toda a residência. O contato começa pela triagem no WhatsApp, o diagnóstico vem antes do valor e o serviço só é executado depois da sua aprovação. Reparos que dependem de bancada, como conserto de placa ou substituição de tela, são feitos por coleta agendada com devolução combinada.",
  pontosReferencia: ["Av. República Argentina","Portão (divisa)","Vila Izabel (divisa)","Campina do Siqueira (divisa)","Fazendinha (próx.)","Seminário (próx.)"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const SantaQuiteria = () => <BairroTemplate data={data} />;

export default SantaQuiteria;
