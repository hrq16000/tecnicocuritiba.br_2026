import { BairroTemplate } from "./BairroTemplate";

/** Página em enriquecimento; permanece noindex até cumprir o gate visual. */
const data = {
  nome: "Vila Izabel",
  slug: "vila-izabel",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática na Vila Izabel | Curitiba",
  metaDescription: "Técnico de informática na Vila Izabel, Curitiba: suporte para notebook, computador lento, Wi-Fi, backup e remoção de vírus. Diagnóstico antes do valor.",
  h1: "Técnico de Informática na Vila Izabel – Curitiba",
  subtitulo: "Atendimento na Vila Izabel com diagnóstico técnico, explicação clara e aprovação antes da execução.",
  descricaoLonga: `A Vila Izabel reúne casas, apartamentos e atividades de serviço onde computador, notebook e Wi-Fi fazem parte do trabalho, estudo e organização da rotina. Problemas como lentidão, tela azul, falhas de inicialização e rede instável precisam ser investigados sem atalhos: antes de qualquer orçamento, verificamos o sintoma, o histórico e a necessidade de preservar arquivos e acessos.

    A manutenção pode envolver limpeza de software, correção de configurações, backup, melhoria de armazenamento ou avaliação de hardware. Quando existe indicação de formatação, ela é planejada com os dados essenciais; quando o defeito exige bancada, como tela, conector ou placa, a pessoa recebe a explicação e aprova o encaminhamento antes da coleta.`,
  pontosReferencia: ["Rua Bom Jesus de Iguape", "Praça Vila Izabel", "Av. República Argentina (próxima)", "Portão (divisa)", "Rua Holanda"],
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
    "Notebook ou PC lento, com pouco espaço e demora para abrir programas",
    "Computador com anúncios, vírus, navegador alterado ou comportamento inesperado",
    "Wi-Fi irregular em quartos, escritório ou áreas mais afastadas do roteador",
    "Equipamento que não reconhece carregador, SSD, impressora ou outro periférico",
  ],
  conteudoExclusivo: "A decisão entre reparar, atualizar ou formatar precisa levar em conta o uso de cada equipamento. Para um computador de estudos, por exemplo, estabilidade e cópia dos arquivos costumam ser mais importantes do que instalar programas desnecessários. Para quem trabalha de casa, também entram na avaliação o acesso a e-mail, videochamadas, impressoras e a qualidade da conexão nos ambientes de uso.\n\nA recomendação de SSD ou memória é feita depois de verificar onde está o gargalo. Um SSD pode reduzir bastante o tempo de inicialização em máquinas compatíveis, enquanto a memória ajuda em cenários de vários programas e abas abertos. A explicação inclui o que muda na prática e quais dados precisam ser migrados.\n\nEm problemas de Wi-Fi, o atendimento verifica se a falha está na conexão, no roteador, no dispositivo ou no alcance dentro do imóvel. Essa separação evita comprar equipamento sem resolver a causa e permite planejar uma cobertura mais coerente com a rotina da casa.",
  dicasLocais: [
    "Antes de uma visita, liste os programas e equipamentos que precisam voltar a funcionar depois da manutenção.",
    "Se houver tela azul ou reinicialização, fotografe o código exibido e informe quando o problema começou.",
    "Evite compartilhar senhas por mensagem; use os meios necessários apenas no momento do atendimento e altere-as depois, se preferir.",
  ],
  indexavel: false,
};

const VilaIzabel = () => <BairroTemplate data={data} />;

export default VilaIzabel;
