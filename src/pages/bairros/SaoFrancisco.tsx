import { BairroTemplate } from "./BairroTemplate";

/** Página em enriquecimento; permanece noindex até cumprir o gate visual. */
const SaoFrancisco = () => {
  const data = {
    nome: "São Francisco",
    slug: "sao-francisco",
    cidade: "São José dos Pinhais",
    metaTitle: "Técnico de Informática no São Francisco SJP | Técnico Curitiba",
    metaDescription: "Técnico de informática no São Francisco, São José dos Pinhais. Manutenção, conserto de PC e notebook. Atendimento domiciliar. a partir de R$ 99,99.",
    h1: "Técnico de Informática no São Francisco – São José dos Pinhais",
    subtitulo: "Suporte de informática no São Francisco com triagem, diagnóstico antes do valor e execução somente após aprovação.",
    descricaoLonga: `No São Francisco, em São José dos Pinhais, computadores e notebooks são usados para trabalho, estudos, serviços digitais e a rotina de casa. Quando o sistema fica lento, a internet cai ou o notebook para de iniciar, o primeiro passo é entender o sintoma e preservar o que importa. A triagem pelo WhatsApp ajuda a identificar urgência, arquivos a proteger e se o atendimento indicado é no local ou em bancada.

    A análise pode envolver armazenamento cheio, falha de Windows, atualização mal sucedida, aquecimento, bateria, carregador ou configuração de rede. Antes de sugerir formatação, troca de SSD ou reparo, explicamos o diagnóstico e o valor. Nenhuma intervenção é executada sem aprovação, e casos que exigem bancada são combinados com antecedência para coleta e devolução.`,
    pontosReferencia: [
      "Centro de SJP",
      "Afonso Pena",
      "Del Rey",
      "Cruzeiro",
      "Região Residencial",
      "Terminal de ônibus",
    ],
    tempoDeslocamento: "Atendimento por agendamento",
    servicosDestaque: [
      "Formatação completa",
      "Remoção de vírus e malware",
      "Upgrade de SSD",
      "Troca de memória RAM",
      "Conserto de notebook",
      "Configuração de Wi-Fi",
      "Backup na nuvem",
    ],
    problemasComuns: [
      "Notebook que liga, mas não inicia o Windows ou fica travado na tela de carregamento",
      "Computador lento por armazenamento cheio, programas em excesso ou falha no disco",
      "Wi-Fi que oscila em parte da residência, mesmo com internet funcionando perto do roteador",
      "Arquivos importantes que precisam de cópia antes de manutenção, migração ou formatação",
    ],
    conteudoExclusivo: "Uma manutenção bem feita não começa trocando peça nem reinstalando o sistema automaticamente. Para um computador lento, avaliamos se o gargalo está no HD ou SSD, na memória, nos programas que iniciam junto com o Windows ou na temperatura. Essa sequência evita gasto sem necessidade e permite justificar, por exemplo, quando o upgrade traz ganho real para o uso da pessoa.\n\nEm casos de vírus, anúncios persistentes ou navegador alterado, o objetivo é remover a causa e revisar as entradas que permitiram o problema, sem prometer que toda lentidão é infecção. Se houver necessidade de instalação do sistema, a prioridade é mapear contas, arquivos e programas essenciais antes de iniciar o procedimento.\n\nPara pequenas empresas e profissionais autônomos, o atendimento pode orientar uma rotina simples de prevenção: cópias verificáveis, atualizações planejadas, contas separadas e rede organizada. O escopo é definido de acordo com o que foi avaliado, com comunicação direta sobre limites e próximos passos.",
    dicasLocais: [
      "Antes de solicitar suporte, anote a mensagem de erro ou envie uma foto da tela; esse detalhe acelera a triagem.",
      "Não force reinicializações repetidas se o computador estiver fazendo ruído diferente ou desligando por aquecimento.",
      "Guarde os dados de acesso de e-mail e serviços importantes antes de uma manutenção que envolva reinstalação do sistema.",
    ],
    indexavel: false,
  };

  return <BairroTemplate data={data} />;
};

export default SaoFrancisco;
