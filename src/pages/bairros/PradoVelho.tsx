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
  problemasComuns: [
    "Notebook usado em estudo ou trabalho com pouco espaço, lentidão ou falha para iniciar",
    "Equipamento antigo que precisa de avaliação antes de receber SSD ou memória adicional",
    "Conta, arquivo acadêmico ou documento que precisa ser preservado antes de formatar",
    "Wi-Fi que cai durante aulas, reuniões ou uso simultâneo de vários dispositivos",
  ],
  conteudoExclusivo: "No Prado Velho, a assistência precisa considerar equipamentos usados por estudantes, moradores e pequenos negócios, muitas vezes com arquivos que não podem ser recuperados facilmente depois. Por isso a conversa começa identificando o que precisa ser protegido: trabalhos, documentos, fotos, acessos e programas usados no dia a dia. A partir daí, o diagnóstico separa falhas de sistema, armazenamento, memória, bateria e rede.\n\nQuando o computador está lento, o upgrade de SSD pode ser uma boa alternativa, mas não é uma resposta automática. Avaliamos a condição do equipamento e o uso pretendido para explicar se a troca vai resolver o gargalo. Formatação também exige planejamento: backup viável, instalação do essencial e validação básica antes da devolução.\n\nSe o notebook não liga, apresenta tela azul ou desliga sozinho, evitar tentativas repetidas pode reduzir risco para dados e componentes. O atendimento define se o caso pode ser examinado no local ou se depende de bancada, sempre com autorização antes de qualquer reparo.",
  dicasLocais: [
    "Mantenha uma cópia de trabalhos e documentos importantes fora do notebook principal, especialmente antes de atualizações ou formatações.",
    "Não continue usando um carregador com mau contato; informe se o conector precisa ficar em determinada posição para carregar.",
    "Ao pedir um upgrade, diga quais programas utiliza e qual é a principal dificuldade atual para receber uma recomendação adequada.",
  ],
  indexavel: false,
};

const PradoVelho = () => <BairroTemplate data={data} />;

export default PradoVelho;
