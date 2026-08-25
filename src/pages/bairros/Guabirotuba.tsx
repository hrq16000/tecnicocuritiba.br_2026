import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Guabirotuba",
  slug: "guabirotuba",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Guabirotuba | Curitiba",
  metaDescription: "Técnico de informática no Guabirotuba, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Guabirotuba – Curitiba",
  subtitulo: "Atendimento técnico no Guabirotuba com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Guabirotuba é um bairro residencial tranquilo, com casas, sobrados e um comércio local ativo ao longo das avenidas principais. Recebemos chamados de moradores com notebooks antigos que ficaram lentos, computadores que não ligam e redes Wi-Fi que caem em determinados cômodos. O atendimento começa pela triagem no WhatsApp, o diagnóstico vem antes do valor e nada é feito sem aprovação. Limpeza, upgrade de SSD, formatação com backup e ajuste de rede costumam ser resolvidos na visita; reparo de placa ou troca de tela vai para bancada, sempre com coleta combinada.",
  pontosReferencia: ["Av. Salgado Filho","Jardim das Américas (divisa)","Prado Velho (divisa)","Uberaba (divisa)","Hauer (próx.)","Linha Verde"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const Guabirotuba = () => <BairroTemplate data={data} />;

export default Guabirotuba;
