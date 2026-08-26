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
  problemasComuns: [
    "Notebook aquecendo ou perdendo desempenho em videochamadas e tarefas profissionais",
    "Computador lento, com SSD cheio ou Windows demorando para iniciar",
    "Rede Wi-Fi que não chega bem aos cômodos mais afastados do apartamento",
    "Arquivos, fotos e documentos que precisam de backup antes de manutenção ou formatação",
  ],
  conteudoExclusivo: "O atendimento no Alto da XV é organizado para quem usa o computador como ferramenta de trabalho, estudo ou gestão da casa. Em vez de supor que todo travamento exige formatação, o diagnóstico investiga o histórico do equipamento: início lento, mensagens de erro, espaço disponível, aquecimento, falhas de conexão e mudanças recentes no sistema. A decisão pode ser uma correção pontual, limpeza técnica, troca de armazenamento ou uma reinstalação planejada com backup.\n\nQuando o notebook superaquece, a orientação não é apenas trocar a pasta térmica sem avaliar o conjunto. Ventoinha, saídas de ar, estado do SSD, uso de memória e programas em segundo plano interferem no resultado. O objetivo é explicar o motivo da perda de desempenho e indicar a intervenção proporcional ao problema, sem prometer uma solução única para todos os casos.\n\nPara Wi-Fi residencial, o ponto de partida é entender a planta do imóvel, os cômodos críticos e os equipamentos conectados. A partir disso, avaliamos posição do roteador, configuração, alcance e necessidade de melhoria de cobertura. Assim, o morador recebe uma recomendação que considera o uso real, não apenas a velocidade contratada.",
  dicasLocais: [
    "Guarde senhas e códigos de recuperação em local seguro antes de qualquer manutenção de sistema.",
    "Se o notebook esquenta, evite usá-lo sobre cama, sofá ou superfície que bloqueie as entradas de ar.",
    "Em caso de falha de Wi-Fi, teste um dispositivo perto do roteador e outro no ponto onde a conexão falha para relatar o comportamento corretamente.",
  ],
  indexavel: false,
};

const AltoDaXV = () => <BairroTemplate data={data} />;

export default AltoDaXV;
