import { BairroTemplate } from "./BairroTemplate";

/**
 * FILA DE ENRIQUECIMENTO AGRESSIVO — seoDepth: "baseline".
 * Página estrutural (noindex até receber conteúdo autoral + prova visual real).
 * Fonte de verdade do status: src/lib/bairrosBaseline.ts
 */
const data = {
  nome: "Centro Cívico",
  slug: "centro-civico",
  cidade: "Curitiba",
  metaTitle: "Assistência Técnica de Informática no Centro Cívico | Curitiba",
  metaDescription: "Técnico de informática no Centro Cívico, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.",
  h1: "Técnico de Informática no Centro Cívico – Curitiba",
  subtitulo: "Atendimento técnico no Centro Cívico com triagem pelo WhatsApp, diagnóstico antes do valor e aprovação sua antes de qualquer serviço.",
  descricaoLonga: "O Centro Cívico concentra órgãos públicos, escritórios e prédios residenciais em um raio pequeno, o que cria uma demanda muito específica: máquinas que não podem ficar paradas durante o expediente e redes domésticas em apartamentos com muita interferência de sinal. Atendemos moradores e escritórios da região com triagem pelo WhatsApp, diagnóstico antes de informar qualquer valor e aprovação obrigatória do serviço. Quando o problema é de software, rede ou desempenho, normalmente resolvemos na própria visita; quando exige bancada, como reparo de placa ou troca de tela, combinamos coleta e devolução.",
  pontosReferencia: ["Palácio Iguaçu","Assembleia Legislativa","Praça Nossa Senhora de Salette","Centro (divisa)","Alto da Glória (divisa)","Juvevê (divisa)"],
  tempoDeslocamento: "Atendimento por agendamento",
  servicosDestaque: ["Formatação de computador","Remoção de vírus e malware","Conserto de notebook","Upgrade SSD e memória","Configuração de rede Wi-Fi","Backup e recuperação de dados"],
  problemasComuns: [
    "Notebook que ficou lento durante o trabalho ou não inicia o Windows",
    "Wi-Fi instável em apartamento, sala comercial ou sala de reunião",
    "E-mail, arquivos de trabalho ou documentos que precisam de cópia segura antes de formatar",
    "Computador que aquece, desliga sozinho ou perde desempenho em tarefas do dia a dia",
  ],
  conteudoExclusivo: "No Centro Cívico, uma falha de informática pode interromper desde uma rotina doméstica até o trabalho de um profissional que depende de documentos, planilhas, certificados e videoconferências. Por isso a avaliação começa entendendo o sintoma, quando ele aparece e quais arquivos ou acessos precisam ser preservados. Esse cuidado evita a solução automática de formatar sem necessidade e ajuda a separar falha de sistema, armazenamento, rede ou hardware.\n\nPara computador lento, verificamos espaço de armazenamento, programas iniciando com o Windows, integridade do disco e sinais de aquecimento antes de recomendar limpeza, upgrade de SSD ou formatação. Em notebooks, também avaliamos bateria, carregador, conector e ventilação quando o equipamento desliga ou reduz o desempenho. Quando há risco aos dados, o backup é tratado como etapa anterior a qualquer alteração no sistema.\n\nEm escritórios pequenos e home offices, a prioridade é devolver previsibilidade: rede Wi-Fi com alcance adequado, estações atualizadas, contas organizadas e uma orientação clara sobre o que foi encontrado. O serviço é explicado em linguagem direta, com valor apresentado após o diagnóstico e execução somente com aprovação.",
  dicasLocais: [
    "Antes de levar o notebook, informe se há arquivos, certificados ou acessos de trabalho que não podem ser perdidos.",
    "Em apartamentos e salas comerciais, anote em quais cômodos o Wi-Fi cai; isso ajuda a distinguir cobertura, interferência e falha do equipamento.",
    "Se o computador ficou lento de forma repentina, evite instalar vários programas de limpeza: preserve o cenário para um diagnóstico mais confiável.",
  ],
  indexavel: false,
};

const CentroCivico = () => <BairroTemplate data={data} />;

export default CentroCivico;
