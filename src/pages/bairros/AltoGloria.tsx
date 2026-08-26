import { BairroTemplate } from "./BairroTemplate";

/** Página em enriquecimento; permanece noindex até cumprir o gate visual. */
const data = {
  nome: "Alto da Glória",
  slug: "alto-da-gloria",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Alto da Glória | Curitiba",
  metaDescription: "Técnico de informática no Alto da Glória, Curitiba: notebook lento, formatação com backup, remoção de vírus e rede Wi-Fi. Diagnóstico antes do valor.",
  h1: "Técnico de Informática no Alto da Glória – Curitiba",
  subtitulo: "Atendimento no Alto da Glória com triagem técnica, diagnóstico antes do valor e aprovação antes de qualquer serviço.",
  descricaoLonga: `O Alto da Glória combina moradias, serviços e atividades profissionais perto da região central. Isso cria necessidades variadas: notebook usado em trabalho remoto, computador doméstico com arquivos acumulados, Wi-Fi que não cobre bem todos os cômodos e pequenas operações que dependem de e-mail, documentos e impressão. A triagem começa pelo histórico do problema, sem presumir que a solução será sempre formatação ou troca de peça.

    O diagnóstico diferencia falha de sistema, armazenamento, memória, rede e hardware. Para casos de lentidão, verificamos o uso real e a condição do equipamento antes de indicar limpeza, upgrade ou reinstalação. Quando existe risco de perda de arquivos, o backup vem antes da intervenção. Serviços que dependem de bancada, como conector, tela ou reparo de placa, são explicados e combinados antes da coleta.`,
  pontosReferencia: ["Passeio Público", "Centro Cívico", "Rua Amintas de Barros", "Praça Eufrásio Correia", "Shopping Mueller (próximo)", "Rua Ubaldino do Amaral"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: [
    "Formatação de computador",
    "Conserto de notebook",
    "Remoção de vírus e malware",
    "Upgrade SSD e memória",
    "Configuração de rede Wi-Fi",
    "Backup e recuperação de dados"
  ],
  problemasComuns: [
    "Notebook lento, aquecendo ou desligando enquanto executa tarefas comuns",
    "Windows com erros, atualizações pendentes ou inicialização demorada",
    "Rede Wi-Fi com sinal fraco em parte do imóvel",
    "Documentos e fotos que precisam ser protegidos antes de corrigir o sistema",
  ],
  conteudoExclusivo: "Para quem trabalha ou estuda a partir do Alto da Glória, uma falha pequena pode virar perda de tempo se não for investigada na ordem certa. Um notebook lento pode estar com armazenamento próximo do limite, programas iniciando sem necessidade, memória insuficiente ou ventilação comprometida. A avaliação procura a causa antes de recomendar qualquer mudança.\n\nEm redes domésticas, não basta medir a velocidade perto do roteador. A posição do aparelho, paredes, outros equipamentos e o número de dispositivos conectados interferem na experiência. O atendimento orienta o ajuste necessário de acordo com os pontos onde a conexão é realmente utilizada.\n\nQuando a pessoa precisa recuperar acesso, arquivos ou um computador que não inicia, a comunicação deve ser objetiva: o que foi identificado, o que pode ser feito sem risco adicional e qual é o próximo passo. Assim, a decisão de reparar, fazer backup, atualizar ou substituir um componente é tomada com informação clara.",
  dicasLocais: [
    "Se o computador travar após uma atualização, não instale ferramentas de correção aleatórias antes de registrar a mensagem exibida.",
    "Ao perceber lentidão, verifique se o armazenamento está quase cheio; esse é um dado útil para a triagem.",
    "Para problemas de sinal, identifique os dois locais onde o Wi-Fi funciona melhor e pior no imóvel.",
  ],
  indexavel: false,
};

const AltoGloria = () => <BairroTemplate data={data} />;

export default AltoGloria;
