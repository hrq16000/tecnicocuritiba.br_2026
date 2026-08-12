/**
 * Fluxo guiado da Home: PROBLEMA → EQUIPAMENTO → SOLUÇÃO → ATENDIMENTO.
 *
 * Regras:
 * - Só aponta para rotas que JÁ existem e são indexáveis (nada de doorway).
 * - Não promete prazo, preço fechado nem solução no local.
 * - A etapa de atendimento respeita a política real: visita de inspeção de até
 *   30 minutos ou coleta e entrega (não existe balcão ao público).
 */

export type Modalidade = "domicilio" | "remoto" | "coleta";

export type SolutionOption = {
  /** Rótulo do equipamento dentro do problema escolhido. */
  equipamento: string;
  /** Rota de solução (serviço ou página de problema) — precisa existir. */
  solucao: { label: string; path: string };
  /** Modalidade recomendada de atendimento para esse par. */
  modalidade: Modalidade;
  /** Justificativa curta e honesta da recomendação. */
  porque: string;
  /** Mensagem inicial usada ao abrir a triagem do WhatsApp. */
  mensagem: string;
};

export type SolutionProblem = {
  id: string;
  /** Como o cliente descreve o problema (linguagem de busca real). */
  label: string;
  descricao: string;
  opcoes: SolutionOption[];
};

export const MODALIDADE_LABEL: Record<Modalidade, string> = {
  domicilio: "Visita técnica de inspeção (até 30 min)",
  remoto: "Atendimento remoto",
  coleta: "Coleta e entrega no seu endereço",
};

export const MODALIDADE_DETALHE: Record<Modalidade, string> = {
  domicilio:
    "Inspeção, diagnóstico e tentativa de reparo rápido compatível com o tempo contratado. Peças não inclusas.",
  remoto:
    "Resolvido por acesso remoto quando o problema é de sistema, configuração ou software — sem deslocamento.",
  coleta:
    "Serviço de bancada: buscamos e devolvemos no endereço combinado. Não temos balcão de atendimento ao público.",
};

export const SOLUTION_FLOW: SolutionProblem[] = [
  {
    id: "lento",
    label: "Está lento ou travando",
    descricao: "Demora para ligar, trava ao abrir programas ou esquenta demais.",
    opcoes: [
      {
        equipamento: "Notebook",
        solucao: { label: "Upgrade de SSD e memória", path: "/servicos/upgrade-ssd-ram" },
        modalidade: "coleta",
        porque: "Troca de SSD/RAM e limpeza interna exigem bancada e teste de estabilidade.",
        mensagem: "Meu notebook está lento e travando. Quero avaliar upgrade de SSD/memória.",
      },
      {
        equipamento: "Computador de mesa",
        solucao: { label: "Computador lento: causas e reparo", path: "/problemas/computador-lento" },
        modalidade: "domicilio",
        porque: "Boa parte dos casos é resolvida na inspeção inicial, no seu endereço.",
        mensagem: "Meu computador de mesa está lento. Quero uma inspeção para entender a causa.",
      },
    ],
  },
  {
    id: "nao-liga",
    label: "Não liga ou não dá imagem",
    descricao: "Sem sinal de vida, luz piscando ou tela apagada mesmo ligado.",
    opcoes: [
      {
        equipamento: "Notebook",
        solucao: { label: "Notebook não liga", path: "/problemas/notebook-nao-liga" },
        modalidade: "coleta",
        porque: "Falha elétrica pede medição em bancada antes de qualquer troca de peça.",
        mensagem: "Meu notebook não liga. Quero diagnóstico em bancada com coleta.",
      },
      {
        equipamento: "Notebook que só liga na tomada",
        solucao: { label: "Notebook não carrega a bateria", path: "/problemas/notebook-nao-carrega-bateria" },
        modalidade: "coleta",
        porque: "Antes de trocar bateria medimos fonte, conector e circuito de carga.",
        mensagem: "Meu notebook só funciona na tomada e não carrega a bateria. Quero avaliação.",
      },
      {
        equipamento: "Placa-mãe / placa eletrônica",
        solucao: { label: "Conserto de placa", path: "/servicos/conserto-placa" },
        modalidade: "coleta",
        porque: "Reparo em nível de componente só é feito com instrumentação de bancada.",
        mensagem: "Suspeito de problema na placa. Quero avaliação técnica com coleta.",
      },
      {
        equipamento: "Monitor",
        solucao: { label: "Conserto de monitor", path: "/servicos/conserto-monitor" },
        modalidade: "coleta",
        porque: "Testamos fonte e placa; painel trincado não é recuperado — avisamos antes.",
        mensagem: "Meu monitor não dá imagem. Quero avaliação antes de qualquer reparo.",
      },
    ],
  },
  {
    id: "desliga",
    label: "Desliga sozinho ou reinicia do nada",
    descricao: "Apaga em plena carga de uso, reinicia sem aviso ou trava com tela azul.",
    opcoes: [
      {
        equipamento: "Computador de mesa",
        solucao: { label: "Computador desliga sozinho", path: "/problemas/computador-desliga-sozinho" },
        modalidade: "coleta",
        porque: "Separar proteção térmica de falha de fonte exige teste sob carga em bancada.",
        mensagem: "Meu computador desliga sozinho durante o uso. Quero diagnóstico técnico.",
      },
      {
        equipamento: "Computador fazendo barulho",
        solucao: { label: "Computador fazendo barulho", path: "/problemas/computador-fazendo-barulho" },
        modalidade: "coleta",
        porque: "Ruído de cooler, de fonte e de disco exigem testes diferentes — medimos antes de trocar peça.",
        mensagem: "Meu computador está fazendo barulho. Quero avaliação da refrigeração e do disco.",
      },
      {
        equipamento: "Notebook com tela preta",
        solucao: { label: "Notebook com tela preta", path: "/problemas/notebook-com-tela-preta" },
        modalidade: "coleta",
        porque: "O teste do monitor externo separa conjunto de tela de falha de placa antes de qualquer peça.",
        mensagem: "Meu notebook liga mas a tela fica preta. Quero avaliação técnica.",
      },
      {
        equipamento: "Notebook esquentando muito",
        solucao: { label: "Notebook superaquecendo", path: "/problemas/notebook-superaquecendo" },
        modalidade: "coleta",
        porque: "Limpeza do sistema de arrefecimento e troca de pasta térmica são serviços de bancada.",
        mensagem: "Meu notebook esquenta muito e desliga. Quero limpeza e avaliação térmica.",
      },
      {
        equipamento: "Windows com tela azul",
        solucao: { label: "Tela azul no Windows", path: "/problemas/tela-azul-windows" },
        modalidade: "remoto",
        porque: "Leitura dos códigos de erro e testes de memória começam por acesso remoto.",
        mensagem: "Meu Windows está dando tela azul. Quero análise dos códigos de erro.",
      },
    ],
  },
  {
    id: "liquido",
    label: "Caiu líquido no equipamento",
    descricao: "Café, água ou refrigerante no teclado — as primeiras horas decidem o resultado.",
    opcoes: [
      {
        equipamento: "Notebook molhado",
        solucao: { label: "Notebook molhado: o que fazer", path: "/problemas/notebook-molhado" },
        modalidade: "coleta",
        porque: "Quanto antes a limpeza técnica, menor a corrosão na placa. Arroz e secador pioram o quadro.",
        mensagem: "Caiu líquido no meu notebook. Preciso de coleta e limpeza técnica com urgência.",
      },
    ],
  },
  {
    id: "virus",
    label: "Vírus, propaganda ou comportamento estranho",
    descricao: "Pop-ups, navegador sequestrado, arquivos bloqueados ou lentidão súbita.",
    opcoes: [
      {
        equipamento: "Windows (PC ou notebook)",
        solucao: { label: "Remoção de vírus", path: "/servicos/remocao-de-virus" },
        modalidade: "remoto",
        porque: "Na maioria dos casos resolvemos por acesso remoto, sem deslocamento.",
        mensagem: "Meu computador está com vírus/propagandas. Quero atendimento remoto.",
      },
      {
        equipamento: "Sistema comprometido",
        solucao: { label: "Formatação com backup", path: "/servicos/formatacao" },
        modalidade: "coleta",
        porque: "Reinstalação com backup dos dados é feita em bancada, com conferência.",
        mensagem: "Quero formatar meu computador preservando os arquivos importantes.",
      },
    ],
  },
  {
    id: "dados",
    label: "Perdi arquivos ou preciso de backup",
    descricao: "Arquivos apagados, HD que não é reconhecido ou rotina de backup inexistente.",
    opcoes: [
      {
        equipamento: "HD / SSD com arquivos",
        solucao: { label: "Recuperação de dados", path: "/servicos/recuperacao-de-dados" },
        modalidade: "coleta",
        porque: "Cada tentativa extra reduz a chance de recuperação: paramos o uso e avaliamos.",
        mensagem: "Perdi arquivos importantes. Quero avaliação de recuperação de dados.",
      },
      {
        equipamento: "Pen drive não reconhecido",
        solucao: { label: "Pen drive não reconhecido", path: "/problemas/pen-drive-nao-reconhecido" },
        modalidade: "coleta",
        porque: "Formatar ou rodar reparador automático apaga a estrutura usada no resgate dos arquivos.",
        mensagem: "Meu pen drive não é reconhecido e preciso dos arquivos. Quero avaliação.",
      },
      {
        equipamento: "Empresa / vários computadores",
        solucao: { label: "Backup para empresas", path: "/servicos/backup-para-empresas" },
        modalidade: "domicilio",
        porque: "Rotina de backup é desenhada no local, junto do fluxo real de trabalho.",
        mensagem: "Preciso estruturar backup na minha empresa em Curitiba.",
      },
    ],
  },
  {
    id: "rede",
    label: "Internet cai ou Wi-Fi não pega",
    descricao: "Sinal fraco em cômodos, quedas constantes ou rede lenta com cabo.",
    opcoes: [
      {
        equipamento: "Casa ou apartamento",
        solucao: { label: "Redes e Wi-Fi", path: "/servicos/redes-e-wifi" },
        modalidade: "domicilio",
        porque: "Cobertura de sinal só é medida no ambiente real, ponto a ponto.",
        mensagem: "Meu Wi-Fi está ruim em casa. Quero uma inspeção de cobertura.",
      },
      {
        equipamento: "Internet caindo o tempo todo",
        solucao: { label: "Wi-Fi caindo toda hora", path: "/problemas/wifi-caindo-toda-hora" },
        modalidade: "domicilio",
        porque: "Separamos queda do provedor, limite do roteador e falha de cobertura antes de indicar equipamento.",
        mensagem: "Meu Wi-Fi cai toda hora. Quero uma inspeção para achar a causa real.",
      },
      {
        equipamento: "Escritório / empresa",
        solucao: { label: "Suporte técnico empresarial", path: "/servicos/suporte-tecnico-empresarial" },
        modalidade: "domicilio",
        porque: "Rede corporativa envolve cabeamento, switches e prioridade de tráfego.",
        mensagem: "A rede da minha empresa está instável. Quero suporte técnico empresarial.",
      },
      {
        equipamento: "Notebook desligando sozinho",
        solucao: { label: "Notebook desligando sozinho", path: "/problemas/notebook-desligando-sozinho" },
        modalidade: "coleta",
        porque: "Temperatura, bateria e circuito de energia precisam ser medidos em bancada.",
        mensagem: "Meu notebook está desligando sozinho. Quero avaliação técnica.",
      },
      {
        equipamento: "Computador congelando",
        solucao: { label: "Computador travando", path: "/problemas/computador-travando" },
        modalidade: "coleta",
        porque: "Memória, temperatura e disco em falha exigem teste cruzado em bancada.",
        mensagem: "Meu computador está travando e congelando. Quero avaliação técnica.",
      },
      {
        equipamento: "Touchpad do notebook sem resposta",
        solucao: { label: "Touchpad não funciona", path: "/problemas/touchpad-nao-funciona" },
        modalidade: "remoto",
        porque: "Atalho desativado e driver respondem pela maior parte dos casos e se resolvem por acesso remoto.",
        mensagem: "O touchpad do meu notebook parou de funcionar. Quero avaliação.",
      },
      {
        equipamento: "Notebook lento ou travando",
        solucao: { label: "Notebook lento", path: "/problemas/notebook-lento" },
        modalidade: "coleta",
        porque: "Disco mecânico, memória curta e calor acumulado respondem pela maior parte dos casos e exigem bancada.",
        mensagem: "Meu notebook está muito lento. Quero avaliação do que está travando.",
      },
      {
        equipamento: "Monitor sem sinal",
        solucao: { label: "Monitor sem sinal", path: "/problemas/monitor-sem-sinal" },
        modalidade: "coleta",
        porque: "Teste cruzado separa cabo, saída de vídeo e monitor antes de qualquer orçamento.",
        mensagem: "Meu monitor está mostrando sem sinal. Quero avaliação técnica.",
      },
      {
        equipamento: "Impressora offline ou sem imprimir",
        solucao: { label: "Impressora não imprime", path: "/problemas/impressora-nao-imprime" },
        modalidade: "remoto",
        porque: "Fila travada, driver e endereço de rede respondem pela maior parte dos casos e se resolvem por acesso remoto.",
        mensagem: "Minha impressora não está imprimindo. Quero avaliação do driver e da rede.",
      },

    ],
  },
  {
    id: "tv",
    label: "TV ou eletrônico com defeito",
    descricao: "TV sem imagem, com som apenas, ou desligando sozinha.",
    opcoes: [
      {
        equipamento: "Smart TV",
        solucao: { label: "Conserto de TV", path: "/servicos/conserto-tv" },
        modalidade: "coleta",
        porque: "Fonte e placas são testadas em bancada; painel danificado não é reparado.",
        mensagem: "Minha TV está com defeito. Quero avaliação técnica com coleta.",
      },
      {
        equipamento: "TV que não liga",
        solucao: { label: "TV não liga", path: "/problemas/tv-nao-liga" },
        modalidade: "coleta",
        porque: "LED piscando ou apagado indica caminhos diferentes na fonte — medimos antes de trocar peça.",
        mensagem: "Minha TV não liga. Quero avaliação da fonte e das placas.",
      },
      {
        equipamento: "TV com som, mas sem imagem",
        solucao: { label: "TV com som e sem imagem", path: "/problemas/tv-com-som-sem-imagem" },
        modalidade: "coleta",
        porque: "O teste da lanterna já separa backlight de placa; painel trincado não é recuperado.",
        mensagem: "Minha TV tem som mas não tem imagem. Quero avaliação técnica com coleta.",
      },
      {
        equipamento: "TV que desliga sozinha",
        solucao: { label: "TV desligando sozinha", path: "/problemas/tv-desligando-sozinha" },
        modalidade: "coleta",
        porque: "Falha térmica de fonte só aparece com o aparelho aquecido e medição sob carga em bancada.",
        mensagem: "Minha TV está desligando sozinha. Quero avaliação da fonte com coleta.",
      },
      {
        equipamento: "TV com imagem e sem som",
        solucao: { label: "TV sem som", path: "/problemas/tv-sem-som" },
        modalidade: "coleta",
        porque: "O sinal de áudio é medido do processamento até os alto-falantes para separar ajuste, amplificador e alto-falante.",
        mensagem: "Minha TV está com imagem normal e sem som. Quero avaliação técnica com coleta.",
      },
      {
        equipamento: "TV com linhas na imagem",
        solucao: { label: "TV com linhas na tela", path: "/problemas/tv-com-linhas-na-tela" },
        modalidade: "coleta",
        porque: "Conexão do painel e placa de controle são testadas em bancada; dano de painel é recusado com aviso.",
        mensagem: "Minha TV está com linhas na tela. Quero avaliação técnica com coleta.",
      },
    ],
  },
];

/** Todas as rotas de solução referenciadas pelo fluxo (usado em testes/gates). */
export const SOLUTION_FLOW_ROUTES = Array.from(
  new Set(SOLUTION_FLOW.flatMap((p) => p.opcoes.map((o) => o.solucao.path))),
);
