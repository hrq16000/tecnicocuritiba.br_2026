import { BairroTemplate } from "./BairroTemplate";

/** Página em enriquecimento; permanece noindex até cumprir o gate visual. */
const data = {
  nome: "Tingui",
  slug: "tingui",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Tingui | Curitiba",
  metaDescription: "Técnico de informática no Tingui, Curitiba: manutenção de PC e notebook, backup, SSD, remoção de vírus e Wi-Fi. Diagnóstico antes do valor.",
  h1: "Técnico de Informática no Tingui – Curitiba",
  subtitulo: "Atendimento no Tingui com diagnóstico antes do valor e autorização antes de qualquer manutenção.",
  descricaoLonga: `No Tingui, computadores e notebooks atendem rotinas diversas, de trabalho remoto e estudo à organização da casa. Quando há tela azul, lentidão, falha de inicialização ou Wi-Fi instável, a avaliação identifica o que mudou e quais dados precisam ser preservados. A solução pode estar em software, armazenamento, memória, rede ou um componente físico; por isso não partimos de uma correção padrão.

    Antes de formatar, trocar SSD ou enviar o equipamento para bancada, explicamos o diagnóstico e o escopo. Manutenções de sistema e rede podem ser resolvidas conforme o caso no local; defeitos de tela, conector ou placa exigem procedimento próprio, com coleta combinada e aprovação prévia.`,
  pontosReferencia: ["Parque Tingui", "Av. Fredolin Wolf", "Terminal de Santa Cândida (próx.)", "Boa Vista (divisa)", "Bacacheri (divisa)", "Atuba (divisa)"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador", "Remoção de vírus e malware", "Conserto de notebook", "Upgrade SSD e memória", "Configuração de rede Wi-Fi", "Backup e recuperação de dados"],
  problemasComuns: ["Computador que apresenta tela azul ou demora para iniciar", "Notebook com baixo desempenho e armazenamento cheio", "Internet que cai apenas em determinados dispositivos ou ambientes", "Dados importantes sem backup antes de uma possível formatação"],
  conteudoExclusivo: "Quando o computador apresenta erro ou fica lento, registrar o momento em que o sintoma aparece ajuda mais do que aplicar várias correções sem critério. A triagem considera mensagens de erro, programas usados, espaço disponível e alterações recentes. Com isso, é possível separar uma atualização problemática de falha de disco, memória ou aquecimento.\n\nUm upgrade de SSD ou RAM pode melhorar a experiência em equipamentos compatíveis, mas deve ser indicado de acordo com a necessidade. A manutenção também considera a migração de arquivos e a instalação do essencial. Em rede Wi-Fi, verificamos se a causa está na cobertura, no roteador ou em um único dispositivo para evitar diagnósticos imprecisos.",
  dicasLocais: ["Envie uma foto da tela azul ou da mensagem de erro durante a triagem.", "Não interrompa uma atualização do sistema apenas por estar demorando, salvo quando houver travamento evidente.", "Faça cópia de documentos e fotos críticos antes de qualquer alteração mais ampla no sistema."],
  indexavel: false,
};

const Tingui = () => <BairroTemplate data={data} />;

export default Tingui;
