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
        equipamento: "Escritório / empresa",
        solucao: { label: "Suporte técnico empresarial", path: "/servicos/suporte-tecnico-empresarial" },
        modalidade: "domicilio",
        porque: "Rede corporativa envolve cabeamento, switches e prioridade de tráfego.",
        mensagem: "A rede da minha empresa está instável. Quero suporte técnico empresarial.",
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
    ],
  },
];

/** Todas as rotas de solução referenciadas pelo fluxo (usado em testes/gates). */
export const SOLUTION_FLOW_ROUTES = Array.from(
  new Set(SOLUTION_FLOW.flatMap((p) => p.opcoes.map((o) => o.solucao.path))),
);
