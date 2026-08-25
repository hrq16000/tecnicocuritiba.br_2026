import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Prado Velho",
  slug: "prado-velho",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Prado Velho | Curitiba",
  metaDescription: "Técnico de informática no Prado Velho, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Prado Velho – Curitiba",
  subtitulo: "Atendimento técnico no Prado Velho com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Prado Velho reúne universidade, comércio e moradia, com muitos estudantes e pequenos negócios dependendo de notebooks e computadores mais antigos. As demandas mais comuns na região são lentidão, formatação com backup, remoção de vírus e upgrade de SSD para dar sobrevida ao equipamento. Trabalhamos com triagem no WhatsApp, diagnóstico antes de falar em valor e aprovação prévia de tudo que for executado. Casos simples resolvemos na visita; quando o problema é físico — placa, conector de energia, tela — a peça vai para bancada por coleta agendada.",
  pontosReferencia: ["PUCPR","Rebouças (divisa)","Jardim Botânico (próx.)","Guabirotuba (divisa)","Parolin (divisa)","Linha Verde"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const PradoVelho = () => <BairroTemplate data={data} />;

export default PradoVelho;
