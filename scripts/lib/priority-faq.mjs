/**
 * Extrai as FAQs REAIS já renderizadas nas páginas comerciais P0 a partir do
 * próprio código-fonte da página — sem reescrever nem inventar conteúdo.
 * Garante paridade entre o que o usuário vê (hidratado) e o FAQPage estático.
 *
 * Só há entrada aqui para páginas que realmente exibem um bloco de perguntas
 * frequentes. Páginas sem FAQ visível NÃO recebem FAQPage (seria markup sem
 * conteúdo correspondente, contra as diretrizes de rich results).
 */
import { readFileSync, existsSync } from "node:fs";

const SOURCES = {
  "/tecnico-informatica-curitiba": "src/pages/TecnicoInformaticaCuritiba.tsx",
  "/atendimento-domicilio": "src/pages/AtendimentoDomicilio.tsx",
  "/empresa-de-ti-curitiba": "src/pages/EmpresaDeTiCuritiba.tsx",
  "/faq": "src/pages/FAQ.tsx",
  "/problemas/notebook-nao-liga": "src/pages/problemas/NotebookNaoLiga.tsx",
  "/problemas/computador-lento": "src/pages/problemas/ComputadorLento.tsx",
  "/problemas/tela-azul-windows": "src/pages/problemas/TelaAzulWindows.tsx",
  "/problemas/notebook-nao-carrega-bateria": "src/pages/problemas/NotebookNaoCarregaBateria.tsx",
  "/problemas/tv-nao-liga": "src/pages/problemas/TvNaoLiga.tsx",
  "/problemas/computador-desliga-sozinho": "src/pages/problemas/ComputadorDesligaSozinho.tsx",
  "/problemas/wifi-caindo-toda-hora": "src/pages/problemas/WifiCaindoTodaHora.tsx",
  "/problemas/tv-com-som-sem-imagem": "src/pages/problemas/TvComSomSemImagem.tsx",
  "/problemas/notebook-molhado": "src/pages/problemas/NotebookMolhado.tsx",
  "/problemas/tela-de-notebook-quebrada": "src/pages/problemas/TelaDeNotebookQuebrada.tsx",
  "/problemas/hd-nao-reconhecido": "src/pages/problemas/HdNaoReconhecido.tsx",
  "/problemas/computador-nao-liga": "src/pages/problemas/ComputadorNaoLiga.tsx",
  "/problemas/teclado-de-notebook-nao-funciona": "src/pages/problemas/TecladoNotebookNaoFunciona.tsx",
  "/problemas/computador-fazendo-barulho": "src/pages/problemas/ComputadorFazendoBarulho.tsx",
  "/problemas/tv-com-linhas-na-tela": "src/pages/problemas/TvComLinhasNaTela.tsx",
  "/problemas/notebook-com-tela-preta": "src/pages/problemas/NotebookComTelaPreta.tsx",
  "/problemas/tv-desligando-sozinha": "src/pages/problemas/TvDesligandoSozinha.tsx",
  "/problemas/tv-sem-som": "src/pages/problemas/TvSemSom.tsx",
  "/problemas/impressora-nao-imprime": "src/pages/problemas/ImpressoraNaoImprime.tsx",
  "/problemas/monitor-sem-sinal": "src/pages/problemas/MonitorSemSinal.tsx",
  "/problemas/notebook-lento": "src/pages/problemas/NotebookLento.tsx",
  "/problemas/computador-travando": "src/pages/problemas/ComputadorTravando.tsx",
  "/problemas/notebook-desligando-sozinho": "src/pages/problemas/NotebookDesligandoSozinho.tsx",
  "/problemas/pen-drive-nao-reconhecido": "src/pages/problemas/PenDriveNaoReconhecido.tsx",
  "/problemas/touchpad-nao-funciona": "src/pages/problemas/TouchpadNaoFunciona.tsx",
  "/problemas/dobradica-do-notebook-quebrada": "src/pages/problemas/DobradicaNotebookQuebrada.tsx",
  "/problemas/computador-sem-som": "src/pages/problemas/ComputadorSemSom.tsx",
  "/problemas/tela-do-computador-piscando": "src/pages/problemas/TelaDoComputadorPiscando.tsx",
  "/problemas/notebook-nao-conecta-no-wifi": "src/pages/problemas/NotebookNaoConectaWifi.tsx",
  "/problemas/windows-nao-inicia": "src/pages/problemas/WindowsNaoInicia.tsx",
  "/problemas/webcam-nao-funciona": "src/pages/problemas/WebcamNaoFunciona.tsx",
  "/problemas/tv-nao-conecta-no-wifi": "src/pages/problemas/TvNaoConectaWifi.tsx",
  "/problemas/tv-com-imagem-escura": "src/pages/problemas/TvComImagemEscura.tsx",
  "/problemas/tv-travando": "src/pages/problemas/TvTravando.tsx",
  "/problemas/mouse-nao-funciona": "src/pages/problemas/MouseNaoFunciona.tsx",
  "/problemas/notebook-superaquecendo": "src/pages/problemas/NotebookSuperaquecendo.tsx",
  "/precos-e-politicas": "src/components/TermosConteudo.tsx",
  "/como-funciona": "src/pages/ComoFunciona.tsx",
  "/equipamentos-atendidos": "src/pages/EquipamentosAtendidos.tsx",
};

const PAIR =
  /question:\s*"((?:[^"\\]|\\.)*)"\s*,\s*answer:\s*(?:"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/g;

const unescape = (s) =>
  s
    .replace(/\\"/g, '"')
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Par `q:`/`a:` usado pelo conteúdo canônico de termos e preços. */
const PAIR_QA = /\bq:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*(?:"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/g;

/** FAQ da rota no formato usado pelo gerador estático, ou null. */
export function priorityFaq(path) {
  const file = SOURCES[path];
  if (!file || !existsSync(file)) return null;
  const src = readFileSync(file, "utf8");
  const out = [];
  for (const re of [PAIR, PAIR_QA]) {
    for (const m of src.matchAll(re)) {
      const pergunta = unescape(m[1]);
      const resposta = unescape(m[2] ?? m[3] ?? "");
      if (pergunta && resposta) out.push({ pergunta, resposta });
    }
    if (out.length) break;
  }
  return out.length ? out.slice(0, 10) : null;
}

export const PRIORITY_FAQ_PATHS = Object.keys(SOURCES);
