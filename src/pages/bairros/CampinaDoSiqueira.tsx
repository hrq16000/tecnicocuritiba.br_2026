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
  problemasComuns: [
    "Estação de trabalho lenta em escritório pequeno ou home office",
    "Notebook que não reconhece carregador, SSD ou periférico",
    "Internet funciona em um ponto, mas falha em outros ambientes do imóvel",
    "Necessidade de organizar backup antes de trocar, formatar ou atualizar o computador",
  ],
  conteudoExclusivo: "Campina do Siqueira reúne usos diferentes para a informática: moradores que precisam recuperar um notebook para estudo ou trabalho, profissionais atendendo de casa e pequenas operações que dependem de computador, internet e impressão para manter a rotina. A triagem identifica primeiro se o problema é isolado em uma máquina, ligado à rede ou causado por dados e programas acumulados ao longo do tempo.\n\nEm equipamentos lentos, a análise considera o estado do SSD ou HD, memória, atualizações, inicialização e temperatura. Isso permite justificar quando um upgrade de SSD ou RAM faz sentido e quando uma limpeza de software ou formatação com cópia dos arquivos é mais adequada. Se houver suspeita de falha física, a pessoa recebe a explicação do próximo passo antes de qualquer serviço de bancada.\n\nPara empresas pequenas, o foco é reduzir recorrência: manter cópias de segurança acessíveis, padronizar atualizações, separar acessos e revisar a rede quando há quedas ou lentidão. O suporte é apresentado como continuidade de operação, com escopo definido, e não como uma promessa genérica de disponibilidade.",
  dicasLocais: [
    "Ao relatar uma queda de internet, diga se ela ocorre em todos os dispositivos ou apenas em uma estação; essa diferença muda o diagnóstico.",
    "Antes de substituir um HD por SSD, confirme quais dados e programas precisam ser migrados para evitar perda de arquivos importantes.",
    "Em ambientes de trabalho, mantenha uma cópia dos arquivos críticos fora do computador principal e teste periodicamente se ela pode ser aberta.",
  ],
  indexavel: false,
};

const CampinaDoSiqueira = () => <BairroTemplate data={data} />;

export default CampinaDoSiqueira;
