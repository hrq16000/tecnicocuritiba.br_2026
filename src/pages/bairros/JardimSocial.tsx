import { BairroTemplate } from "./BairroTemplate";

/** Página em enriquecimento; permanece noindex até cumprir o gate visual. */
const data = {
  nome: "Jardim Social",
  slug: "jardim-social",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Jardim Social | Curitiba",
  metaDescription: "Técnico de informática no Jardim Social, Curitiba: suporte para notebook, computador, backup e Wi-Fi residencial. Diagnóstico antes do valor.",
  h1: "Técnico de Informática no Jardim Social – Curitiba",
  subtitulo: "Suporte de informática no Jardim Social com análise técnica, explicação clara e aprovação antes do serviço.",
  descricaoLonga: `O Jardim Social reúne residências onde a tecnologia apoia trabalho, estudo, entretenimento e segurança de arquivos. Quando a conexão não alcança todos os ambientes, o notebook fica lento ou o computador perde acesso a periféricos, o atendimento começa separando falha de rede, sistema e hardware. Essa investigação evita soluções genéricas e ajuda a preservar contas, fotos e documentos antes de qualquer alteração.

    A manutenção pode incluir organização de software, atualização planejada, backup, avaliação de SSD e memória ou ajuste da rede Wi-Fi. A recomendação é ligada ao uso real do imóvel e do equipamento; quando há necessidade de reparo em bancada, o motivo e o próximo passo são apresentados antes da aprovação.`,
  pontosReferencia: ["Rua Atílio Bório", "Tarumã (divisa)", "Alto da XV (próximo)", "Rua Moyses Marcondes", "Parque São Lourenço (próximo)"],
  tempoDeslocamento: "Atendimento agendado conforme a disponibilidade da agenda",
  servicosDestaque: [
    "Formatação de computador",
    "Conserto de notebook",
    "Remoção de vírus e malware",
    "Upgrade SSD e memória",
    "Configuração de rede Wi-Fi",
    "Backup e recuperação de dados"
  ],
  problemasComuns: ["Wi-Fi sem cobertura uniforme em todos os ambientes", "Notebook lento em tarefas de trabalho e videoconferência", "Arquivos e fotos sem cópia de segurança verificável", "Computador que não reconhece impressora, SSD ou outro periférico"],
  conteudoExclusivo: "Em uma rede residencial com vários dispositivos, a qualidade da conexão não depende apenas do plano contratado. Posição do roteador, distância, paredes, interferência e quantidade de aparelhos influenciam o resultado. A análise procura localizar o ponto de falha antes de recomendar ajustes ou novos equipamentos.\n\nPara computadores usados em home office, estabilidade também significa cuidar das contas, atualizações e dados. Uma revisão bem direcionada pode reduzir travamentos e organizar a rotina de backup sem prometer resultado impossível. O objetivo é que a pessoa entenda o que foi encontrado e consiga decidir sobre a manutenção com clareza.",
  dicasLocais: ["Teste a conexão em mais de um cômodo antes de relatar uma falha de Wi-Fi.", "Informe quais periféricos precisam funcionar após a manutenção.", "Mantenha os códigos de recuperação das contas importantes guardados de forma segura."],
  indexavel: false,
};

const JardimSocial = () => <BairroTemplate data={data} />;

export default JardimSocial;
