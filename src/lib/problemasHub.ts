/**
 * Índice único do hub /problemas.
 *
 * Fonte de verdade para o agrupamento dos sintomas indexáveis por família de
 * equipamento. Só entram rotas já publicadas e presentes no sitemap curado
 * (scripts/lib/curated-urls.mjs → PROBLEMAS). Nenhuma rota nova é criada aqui.
 */

export interface ProblemaHubItem {
  to: string;
  titulo: string;
  desc: string;
}

export interface ProblemaHubGrupo {
  id: string;
  titulo: string;
  intro: string;
  itens: ProblemaHubItem[];
}

export const PROBLEMAS_HUB: ProblemaHubGrupo[] = [
  {
    id: "notebook",
    titulo: "Notebook",
    intro:
      "Notebook concentra energia, tela, teclado e refrigeração no mesmo corpo, então sintomas parecidos têm origens bem diferentes. Comece pelo comportamento exato do aparelho ao pressionar o botão de ligar.",
    itens: [
      { to: "/problemas/notebook-nao-liga", titulo: "Notebook não liga", desc: "Sem luz, sem ventoinha ou liga e apaga: fonte, bateria, placa ou tela." },
      { to: "/problemas/notebook-com-tela-preta", titulo: "Notebook com tela preta", desc: "Liga, faz barulho, mas a imagem não aparece: cabo flat, backlight ou vídeo." },
      { to: "/problemas/notebook-lento", titulo: "Notebook lento", desc: "Demora para abrir tudo, com limite térmico e economia de energia no caminho." },
      { to: "/problemas/notebook-superaquecendo", titulo: "Notebook superaquecendo", desc: "Cooler acelerado, base quente e queda de desempenho sob uso normal." },
      { to: "/problemas/notebook-desligando-sozinho", titulo: "Notebook desligando sozinho", desc: "Desliga sem aviso: temperatura, bateria em fim de vida ou alimentação." },
      { to: "/problemas/notebook-nao-carrega-bateria", titulo: "Notebook não carrega a bateria", desc: "Fica preso em 0%, só funciona na tomada ou acusa carregador não reconhecido." },
      { to: "/problemas/notebook-molhado", titulo: "Notebook molhado", desc: "O que fazer nas primeiras horas para evitar corrosão e perda da placa." },
      { to: "/problemas/tela-de-notebook-quebrada", titulo: "Tela de notebook quebrada", desc: "Trinca, manchas e linhas fixas: quando é painel e quando é cabo." },
      { to: "/problemas/teclado-de-notebook-nao-funciona", titulo: "Teclado de notebook não funciona", desc: "Teclas mortas, repetição ou teclado inteiro sem resposta." },
      { to: "/problemas/touchpad-nao-funciona", titulo: "Touchpad não funciona", desc: "Cursor parado ou gesto sem resposta: atalho, driver ou cabo interno." },
      { to: "/problemas/dobradica-do-notebook-quebrada", titulo: "Dobradiça do notebook quebrada", desc: "Tampa solta ou carcaça estalando — risco direto ao cabo de vídeo." },
      { to: "/problemas/webcam-nao-funciona", titulo: "Webcam não funciona", desc: "Câmera sem imagem em reuniões: permissão, driver, cabo flat ou módulo." },
    ],
  },
  {
    id: "computador",
    titulo: "Computador de mesa",
    intro:
      "No desktop as peças são independentes, e isso ajuda: dá para isolar fonte, memória, vídeo e armazenamento por partes. O primeiro corte é sempre entre não ligar, ligar sem imagem e ligar com instabilidade.",
    itens: [
      { to: "/problemas/computador-nao-liga", titulo: "Computador não liga", desc: "Sem POST, sem ventoinha ou sem reação: fonte, placa-mãe ou botão." },
      { to: "/problemas/computador-lento", titulo: "Computador lento", desc: "Tudo abre, mas devagar: disco mecânico, memória curta ou aquecimento." },
      { to: "/problemas/computador-travando", titulo: "Computador travando", desc: "Congelamento total com o equipamento ligado — diferente de lentidão." },
      { to: "/problemas/computador-desliga-sozinho", titulo: "Computador desliga sozinho", desc: "Corte seco de energia sob carga: fonte, temperatura ou tomada." },
      { to: "/problemas/computador-fazendo-barulho", titulo: "Computador fazendo barulho", desc: "Zumbido, clique ou chiado: cooler, disco rígido ou peça solta." },
      { to: "/problemas/computador-sem-som", titulo: "Computador sem som", desc: "Sem áudio no desktop: saída selecionada, driver ou chip de som." },
      { to: "/problemas/monitor-sem-sinal", titulo: "Monitor sem sinal", desc: "Mensagem de sem sinal com o gabinete ligado: cabo, entrada ou vídeo." },
      { to: "/problemas/tela-do-computador-piscando", titulo: "Tela do computador piscando", desc: "Flicker e faixas na imagem: cabo, taxa de atualização ou placa de vídeo." },
    ],
  },
  {
    id: "tv",
    titulo: "Smart TV",
    intro:
      "Televisão quase nunca quebra inteira: falha uma etapa da cadeia entre fonte, placa principal, backlight e painel. Identificar em qual etapa o sinal para evita coleta desnecessária e conversa sobre troca de aparelho.",
    itens: [
      { to: "/problemas/tv-nao-liga", titulo: "TV não liga", desc: "Sem LED, LED piscando ou clique sem imagem: fonte e placa principal." },
      { to: "/problemas/tv-com-imagem-escura", titulo: "TV com imagem escura", desc: "Imagem só visível com lanterna: backlight, fita de LED e driver." },
      { to: "/problemas/tv-com-som-sem-imagem", titulo: "TV com som e sem imagem", desc: "Áudio normal com tela apagada — o corte está no caminho de vídeo." },
      { to: "/problemas/tv-com-linhas-na-tela", titulo: "TV com linhas na tela", desc: "Faixas verticais ou horizontais: conector do painel ou painel em falha." },
      { to: "/problemas/tv-sem-som", titulo: "TV sem som", desc: "Imagem perfeita e áudio mudo: saída selecionada, amplificador ou alto-falante." },
      { to: "/problemas/tv-desligando-sozinha", titulo: "TV desligando sozinha", desc: "Reinício espontâneo e proteção da fonte entrando em ação." },
      { to: "/problemas/tv-travando", titulo: "TV travando", desc: "Aplicativos travando, controle lento e reinício no meio do uso." },
    ],
  },
  {
    id: "rede",
    titulo: "Rede e Wi-Fi",
    intro:
      "Problema de rede engana porque o sintoma aparece no aparelho, mas a causa costuma estar na cobertura. A regra é simples: se só um equipamento sofre, o suspeito é o equipamento; se todos sofrem, o suspeito é a rede.",
    itens: [
      { to: "/problemas/wifi-caindo-toda-hora", titulo: "Wi-Fi caindo toda hora", desc: "Queda intermitente na casa ou escritório: cobertura, canal e roteador." },
      { to: "/problemas/notebook-nao-conecta-no-wifi", titulo: "Notebook não conecta no Wi-Fi", desc: "Rede que não aparece, cai ao suspender ou falha só no seu notebook." },
      { to: "/problemas/tv-nao-conecta-no-wifi", titulo: "TV não conecta no Wi-Fi", desc: "Smart TV fora da rede, sem enxergar 5 GHz ou caindo no meio do filme." },
    ],
  },
  {
    id: "sistema",
    titulo: "Sistema, vírus e dados",
    intro:
      "Sistema que não carrega, travamento com código de erro e arquivos inacessíveis pedem cuidado redobrado: cada tentativa mal feita reduz a chance de recuperar dados. Aqui a ordem dos testes importa mais do que a ferramenta usada.",
    itens: [
      { to: "/problemas/tela-azul-windows", titulo: "Tela azul no Windows", desc: "Interrupção com código de erro apontando memória, disco ou driver." },
      { to: "/problemas/windows-nao-inicia", titulo: "Windows não inicia", desc: "Liga, mas o sistema não carrega: boot, disco ou arquivos de sistema." },
      { to: "/problemas/hd-nao-reconhecido", titulo: "HD não reconhecido", desc: "Disco sumindo da lista: conexão, controladora ou falha mecânica." },
      { to: "/problemas/pen-drive-nao-reconhecido", titulo: "Pen drive não reconhecido", desc: "Mídia removível ignorada pelo sistema ou pedindo formatação." },
    ],
  },
  {
    id: "perifericos",
    titulo: "Periféricos",
    intro:
      "Periférico com defeito raramente exige bancada, mas trava o trabalho do mesmo jeito. Antes de comprar outro, vale separar cabo, porta, driver e o aparelho em si.",
    itens: [
      { to: "/problemas/impressora-nao-imprime", titulo: "Impressora não imprime", desc: "Fila travada, driver perdido ou comunicação de rede interrompida." },
      { to: "/problemas/mouse-nao-funciona", titulo: "Mouse não funciona", desc: "Cursor parado, clique intermitente ou receptor sem resposta." },
    ],
  },
];

/** Total de sintomas publicados no hub — usado na copy e nos gates. */
export const TOTAL_PROBLEMAS = PROBLEMAS_HUB.reduce((acc, g) => acc + g.itens.length, 0);
