import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Fanny",
  slug: "fanny",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Fanny | Curitiba",
  metaDescription: "Técnico de informática no Fanny, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Fanny – Curitiba",
  subtitulo: "Atendimento técnico no Fanny com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Fanny é um bairro residencial da região sul, com casas, condomínios menores e comércio de bairro. Os problemas mais recorrentes que atendemos ali são computador lento, sistema que não inicia, vírus e a necessidade de backup antes de formatar. Também é comum o pedido de melhoria de Wi-Fi em casas com laje ou área nos fundos. O contato começa no WhatsApp, o diagnóstico acontece antes de qualquer valor e a execução depende da sua aprovação. Quando é caso de bancada — solda, conector de energia, tela — combinamos coleta e devolução no endereço.",
  pontosReferencia: ["Av. Winston Churchill","Fanny (divisa)","Novo Mundo (divisa)","Capão Raso (próx.)","Portão (próx.)","Terminal Portão"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  problemasComuns: [
    "PC ou notebook lento, com tela travando ou inicialização demorada",
    "Rede Wi-Fi fraca em casa, especialmente em cômodos afastados do roteador",
    "Windows com erro, vírus, anúncios indevidos ou programas desconhecidos",
    "Notebook que liga mas não carrega, desliga sozinho ou não reconhece o SSD",
  ],
  conteudoExclusivo: "No Fanny, muitos atendimentos começam com um equipamento que ainda liga, mas já não acompanha a rotina: o Windows demora, programas fecham, a internet parece instável ou o notebook esquenta quando é mais necessário. A investigação começa pelo sintoma e pelo uso do computador para definir se a causa está no sistema, no armazenamento, na rede, na memória ou na parte física. Isso reduz troca de peça desnecessária e mantém o orçamento ligado ao que realmente precisa ser feito.\n\nEm casos de formatação, a prioridade é descobrir se os arquivos podem e devem ser preservados. Fotos, documentos, conversas e pastas de trabalho não são tratados como detalhe: primeiro avaliamos a possibilidade de backup, depois definimos a instalação e a configuração essenciais. Para vírus e comportamentos estranhos, o diagnóstico inclui sinais de programas indesejados, extensões, navegadores e atualizações, sem afirmar que todo computador lento está infectado.\n\nA melhoria de Wi-Fi também precisa considerar como a casa é usada. Uma conexão que atende bem perto do roteador pode falhar no quarto, no escritório ou em uma área externa. A análise orienta sobre posição, configuração e cobertura antes da recomendação de novos equipamentos. Quando há necessidade de bancada, a coleta e a devolução são combinadas, com explicação do serviço antes da execução.",
  dicasLocais: [
    "Antes de formatar, separe os arquivos que não podem ser perdidos e informe onde eles estão salvos.",
    "Se o notebook desliga sozinho, registre se ele aquece e se o problema acontece também conectado ao carregador.",
    "Para melhorar o Wi-Fi, evite deixar o roteador escondido dentro de armário ou atrás de objetos metálicos; a posição pode alterar bastante a cobertura.",
  ],
  indexavel: false,
};

const Fanny = () => <BairroTemplate data={data} />;

export default Fanny;
