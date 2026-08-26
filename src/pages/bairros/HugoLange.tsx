import { BairroTemplate } from "./BairroTemplate";

/** Página em enriquecimento; permanece noindex até cumprir o gate visual. */
const data = {
  nome: "Hugo Lange",
  slug: "hugo-lange",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Hugo Lange | Curitiba",
  metaDescription: "Técnico de informática no Hugo Lange, Curitiba: manutenção de notebook, computador lento, backup e Wi-Fi. Diagnóstico antes do valor.",
  h1: "Técnico de Informática no Hugo Lange – Curitiba",
  subtitulo: "Atendimento no Hugo Lange com diagnóstico antes do valor, orientação objetiva e aprovação antes da execução.",
  descricaoLonga: `No Hugo Lange, a informática costuma atender duas necessidades que exigem cuidado: equipamentos usados em home office e redes domésticas com vários dispositivos conectados. Um notebook que demora para iniciar ou um Wi-Fi que falha em determinado cômodo pode ter causas diferentes, por isso a avaliação começa pelo cenário de uso, pelos sintomas e pelos dados que precisam permanecer protegidos.

    Para máquinas lentas, investigamos armazenamento, memória, programas em inicialização e aquecimento antes de indicar upgrade ou formatação. Para rede, verificamos se a falha está no provedor, no roteador, no alcance ou em um dispositivo específico. Se o reparo depende de bancada, como conector, tela ou placa, explicamos o encaminhamento e combinamos a coleta previamente.`,
  pontosReferencia: ["Jardim Botânico (próximo)", "Rua Fernando Amaro", "Alto da XV (próx.)", "Praça da Ucrânia", "Rua Agostinho Merlin"],
  tempoDeslocamento: "Atendimento agendado conforme a disponibilidade da agenda",
  servicosDestaque: [
    "Formatação de computador",
    "Conserto de notebook",
    "Remoção de vírus e malware",
    "Upgrade SSD e memória",
    "Configuração de rede Wi-Fi",
    "Backup e recuperação de dados"
  ],
  problemasComuns: ["Notebook lento ou com aquecimento recorrente", "Wi-Fi irregular em pontos específicos da residência", "Falha de inicialização ou atualização do Windows", "Necessidade de backup antes de manutenção ou migração"],
  conteudoExclusivo: "O diagnóstico de um notebook deve considerar tanto o desempenho quanto a continuidade dos dados. Ao identificar lentidão, verificamos se há sinais de falha no armazenamento, espaço insuficiente, temperatura elevada ou uso excessivo de memória. Assim, a recomendação de limpeza, SSD, RAM ou reinstalação é baseada no problema observado.\n\nPara famílias e profissionais que concentram arquivos em uma única máquina, a cópia de segurança não deve ficar para depois. Antes de modificar o sistema, avaliamos o que é possível preservar e quais acessos precisam ser mantidos. A manutenção é explicada passo a passo, para que a pessoa saiba o motivo de cada intervenção.",
  dicasLocais: ["Liste os dispositivos conectados à rede antes da triagem de Wi-Fi.", "Mantenha documentos importantes em cópia separada do computador principal.", "Se o notebook aquece, informe em quais programas ou situações o sintoma aparece."],
  indexavel: false,
};

const HugoLange = () => <BairroTemplate data={data} />;

export default HugoLange;
