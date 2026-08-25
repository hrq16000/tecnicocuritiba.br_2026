import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Campina do Siqueira",
  slug: "campina-do-siqueira",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Campina do Siqueira | Curitiba",
  metaDescription: "Técnico de informática no Campina do Siqueira, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Campina do Siqueira – Curitiba",
  subtitulo: "Atendimento técnico no Campina do Siqueira com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "Campina do Siqueira mistura prédios residenciais, escritórios e comércio de serviço ao longo dos eixos de transporte, o que gera chamados tanto domésticos quanto de pequenas empresas. Os pedidos mais frequentes envolvem computador lento, formatação com backup, configuração de rede em escritório pequeno e conserto de notebook. O contato começa pelo WhatsApp, o diagnóstico vem antes de qualquer valor e nada é executado sem sua aprovação. Reparos que dependem de bancada, como solda ou troca de tela, são feitos com coleta e devolução combinadas previamente.",
  pontosReferencia: ["Shopping Curitiba (próx.)","Terminal Campina do Siqueira","Av. República Argentina","Bigorrilho (divisa)","Vila Izabel (divisa)","Santa Quitéria (divisa)"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  indexavel: false,
};

const CampinaDoSiqueira = () => <BairroTemplate data={data} />;

export default CampinaDoSiqueira;
