import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Bairro Alto",
  slug: "bairro-alto",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Bairro Alto | Curitiba",
  metaDescription: "Técnico de informática no Bairro Alto, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Bairro Alto – Curitiba",
  subtitulo: "Atendimento técnico no Bairro Alto com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Bairro Alto é predominantemente residencial, com casas, comércio de vizinhança e muitas famílias que usam um único computador para trabalho, estudo e entretenimento. Por isso a maior parte dos chamados envolve lentidão, vírus, formatação com backup dos arquivos e Wi-Fi que não cobre a casa inteira. Atendemos a região com triagem pelo WhatsApp, diagnóstico técnico antes do valor e aprovação obrigatória antes de qualquer serviço. Quando o reparo exige bancada — placa-mãe, fonte, tela de notebook — combinamos coleta e devolução, sem promessa de prazo que não possamos cumprir.",
  pontosReferencia: ["Terminal Bairro Alto","Av. Paraná","Boa Vista (divisa)","Atuba (divisa)","Tarumã (divisa)","Cajuru (próx.)"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  problemasComuns: ["Computador compartilhado pela família ficando lento ou sem espaço", "Notebook que não carrega, aquece ou desliga sozinho", "Wi-Fi com quedas em cômodos afastados", "Vírus, anúncios e navegador com comportamento inesperado"],
  conteudoExclusivo: "No Bairro Alto, um mesmo computador pode ser usado para atividades de casa, estudo, trabalho e serviços digitais. Isso aumenta a importância de diferenciar lentidão causada por programas e armazenamento cheio de falhas reais de hardware. O diagnóstico verifica os sinais antes de indicar formatação, limpeza ou upgrade.\n\nQuando há suspeita de vírus, a avaliação também procura extensões, programas instalados sem consentimento e mudanças no navegador. Se a correção envolver reinstalação, identificamos antes os arquivos, contas e programas que precisam ser preservados. Para notebook que não carrega ou desliga sozinho, informamos se o caso exige avaliação de bateria, carregador, conector, ventilação ou bancada.\n\nEm redes domésticas, o objetivo é entender onde a conexão falha e quantos dispositivos dependem dela. Essa informação permite orientar a configuração e a cobertura sem transformar uma questão de sinal em uma compra desnecessária.",
  dicasLocais: ["Não instale vários antivírus para tentar resolver anúncios ou lentidão; isso pode dificultar o diagnóstico.", "Em computador compartilhado, crie usuários separados quando possível para reduzir alterações acidentais.", "Se o notebook não carrega, teste outra tomada e relate se o indicador de carga acende."],
  indexavel: false,
};

const BairroAlto = () => <BairroTemplate data={data} />;

export default BairroAlto;
