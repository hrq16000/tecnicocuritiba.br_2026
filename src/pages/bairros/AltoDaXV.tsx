import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Alto da XV",
  slug: "alto-da-xv",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Alto da XV | Curitiba",
  metaDescription: "Técnico de informática no Alto da XV, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Alto da XV – Curitiba",
  subtitulo: "Atendimento técnico no Alto da XV com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Alto da XV é um bairro residencial verticalizado, com forte presença de consultórios, clínicas e profissionais liberais que trabalham de casa. Isso significa computadores usados muitas horas por dia, notebooks que aquecem e Wi-Fi que precisa cobrir apartamento inteiro sem cair em videochamada. Atendemos a região começando pela triagem no WhatsApp, com diagnóstico técnico antes do valor e aprovação sua antes de qualquer execução. Serviços de software, limpeza, upgrade de SSD e configuração de rede costumam ser resolvidos na visita; reparos de placa seguem para bancada com coleta combinada.",
  pontosReferencia: ["Rua XV de Novembro","Praça Osório (próx.)","Hospital das Clínicas (próx.)","Cristo Rei (divisa)","Juvevê (divisa)","Centro (divisa)"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const AltoDaXV = () => <BairroTemplate data={data} />;

export default AltoDaXV;
