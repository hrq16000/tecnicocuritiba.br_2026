/**
 * Mapa único de interlinking contextual entre páginas de sintoma (/problemas/*).
 *
 * Regra: só entram rotas indexáveis já publicadas e que NÃO competem pela mesma
 * intenção de busca (ver scripts/check-cannibalization.mjs). O objetivo é
 * navegação e crawl — nunca repetir a mesma keyword em páginas diferentes.
 */

export interface ProblemaRelacionado {
  to: string;
  titulo: string;
  desc: string;
}

/** Rótulo curto por rota de sintoma. */
export const PROBLEMA_LABELS: Record<string, string> = {
  "/problemas/tela-azul-windows": "Tela azul no Windows",
  "/problemas/windows-nao-inicia": "Windows não inicia",
  "/problemas/computador-lento": "Computador lento",
  "/problemas/notebook-lento": "Notebook lento",
  "/problemas/notebook-nao-liga": "Notebook não liga",
  "/problemas/notebook-superaquecendo": "Notebook superaquecendo",
  "/problemas/notebook-nao-conecta-no-wifi": "Notebook não conecta no Wi-Fi",
  "/problemas/wifi-caindo-toda-hora": "Wi-Fi caindo toda hora",
  "/problemas/webcam-nao-funciona": "Webcam não funciona",
  "/problemas/tv-nao-conecta-no-wifi": "TV não conecta no Wi-Fi",
  "/problemas/tv-travando": "TV travando",
  "/problemas/tv-com-imagem-escura": "TV com imagem escura",
  "/problemas/tela-do-computador-piscando": "Tela piscando",
  "/problemas/computador-travando": "Computador travando",
  "/problemas/computador-sem-som": "Computador sem som",
};

const DESCRICOES: Record<string, string> = {
  "/problemas/tela-azul-windows":
    "Quando a instabilidade interrompe o sistema e o código de erro indica memória, disco ou driver.",
  "/problemas/windows-nao-inicia":
    "Quando o equipamento liga, mas o sistema não carrega — boot, disco ou arquivos de sistema.",
  "/problemas/computador-lento":
    "Quando tudo abre, mas demora: disco mecânico, memória insuficiente ou aquecimento.",
  "/problemas/notebook-lento":
    "Lentidão específica de notebook, com limite térmico e economia de energia no meio do caminho.",
  "/problemas/notebook-nao-liga":
    "Sem sinal de energia ou sem imagem: alimentação, bateria, placa ou tela.",
  "/problemas/notebook-superaquecendo":
    "Cooler acelerado, queda de desempenho e desligamento por temperatura.",
  "/problemas/notebook-nao-conecta-no-wifi":
    "Conexão que não aparece, cai ao suspender ou só falha no seu notebook.",
  "/problemas/wifi-caindo-toda-hora":
    "Queda intermitente do sinal na casa ou no escritório: cobertura, canal e roteador.",
  "/problemas/webcam-nao-funciona":
    "Câmera sem imagem em chamadas: permissão, cabo flat, driver ou módulo.",
  "/problemas/tv-nao-conecta-no-wifi":
    "Smart TV que não entra na rede, perde conexão ou não enxerga a faixa de 5 GHz.",
  "/problemas/tv-travando":
    "Aplicativos travando, reinício sozinho e resposta lenta do controle.",
  "/problemas/tv-com-imagem-escura":
    "Imagem visível só com lanterna: backlight, fita de LED e placa de fonte.",
  "/problemas/tela-do-computador-piscando":
    "Piscada, flicker e faixas na imagem: cabo, taxa de atualização ou placa de vídeo.",
  "/problemas/computador-travando":
    "Congelamento total com o equipamento ligado — travamento é diferente de lentidão.",
  "/problemas/computador-sem-som":
    "Sem áudio no desktop: saída selecionada, driver ou chip de som.",
};

/**
 * Grafo de sintomas relacionados por rota.
 * Cada rota aponta para 3–4 vizinhos de investigação (nunca concorrentes diretos).
 */
const GRAFO: Record<string, string[]> = {
  "/problemas/notebook-nao-conecta-no-wifi": [
    "/problemas/wifi-caindo-toda-hora",
    "/problemas/tv-nao-conecta-no-wifi",
    "/problemas/notebook-lento",
    "/problemas/webcam-nao-funciona",
  ],
  "/problemas/wifi-caindo-toda-hora": [
    "/problemas/notebook-nao-conecta-no-wifi",
    "/problemas/tv-nao-conecta-no-wifi",
    "/problemas/tv-travando",
    "/problemas/computador-lento",
  ],
  "/problemas/webcam-nao-funciona": [
    "/problemas/notebook-nao-conecta-no-wifi",
    "/problemas/computador-sem-som",
    "/problemas/notebook-lento",
    "/problemas/tela-do-computador-piscando",
  ],
  "/problemas/tv-nao-conecta-no-wifi": [
    "/problemas/wifi-caindo-toda-hora",
    "/problemas/tv-travando",
    "/problemas/tv-com-imagem-escura",
    "/problemas/notebook-nao-conecta-no-wifi",
  ],
  "/problemas/tela-azul-windows": [
    "/problemas/windows-nao-inicia",
    "/problemas/computador-travando",
    "/problemas/notebook-superaquecendo",
    "/problemas/tela-do-computador-piscando",
  ],
};

/** Retorna os sintomas relacionados de uma rota (vazio quando não mapeada). */
export function problemasRelacionados(path: string): ProblemaRelacionado[] {
  return (GRAFO[path] || [])
    .filter((to) => to !== path && PROBLEMA_LABELS[to])
    .map((to) => ({
      to,
      titulo: PROBLEMA_LABELS[to],
      desc: DESCRICOES[to] || "",
    }));
}
