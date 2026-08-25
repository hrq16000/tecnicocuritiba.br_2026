import { ServicoBairroTemplate, ServicoBairroData } from "./ServicoBairroTemplate";

const data: ServicoBairroData = {
  metaTitle: "Montagem de PC Personalizado no CIC Curitiba | Gamer e Workstation | Técnico Curitiba",
  metaDescription: "Montagem de PC gamer e workstation no CIC, Curitiba. Peças de qualidade, montagem profissional e teste completo. Valor personalizado.",
  
  servico: "Montagem de PC",
  servicoSlug: "montagem-pc",
  bairro: "CIC",
  bairroSlug: "cic",
  cidade: "Curitiba",
  
  h1: "Montagem de PC Personalizado no CIC",
  subtitulo: "PC gamer, workstation ou escritório montado sob medida. Peças de qualidade com garantia e entrega no CIC.",
  
  precoBase: "R$ 149,99",
  precoDescricao: "Serviço de montagem e configuração. Peças com valores à parte.",
  
  descricaoLonga: `Quer montar um PC personalizado no CIC? Seja para jogos, trabalho pesado com edição de vídeo, 
    modelagem 3D ou uso corporativo, nossa equipe monta seu computador sob medida. Selecionamos as 
    melhores peças com o melhor custo-benefício, realizamos a montagem profissional com cable 
    management, instalamos o sistema operacional e fazemos testes de estresse completos. 
    Entregamos no CIC com tudo funcionando perfeitamente. Ideal para empresas da Cidade Industrial 
    que precisam de estações de trabalho confiáveis.`,
  
  beneficios: [
    "Consultoria para escolha das melhores peças",
    "Montagem profissional com cable management",
    "Instalação de Windows e drivers completos",
    "Teste de estresse de CPU, GPU e RAM",
    "Configuração de BIOS e XMP otimizados",
    "Entrega e instalação no seu local",
    "Garantia de 90 dias sobre o serviço executado (peças seguem a garantia do fornecedor)",
    "Suporte pós-montagem incluso",
  ],
  
  processoPasso: [
    { titulo: "Consulta", descricao: "Entendemos sua necessidade e valor do atendimento disponível" },
    { titulo: "Peças", descricao: "Selecionamos os melhores componentes compatíveis" },
    { titulo: "Montagem", descricao: "Montamos com cuidado profissional e testes" },
    { titulo: "Entrega", descricao: "Entregamos funcionando com Windows e programas" },
  ],
  
  faq: [
    { 
      pergunta: "Vocês compram as peças ou eu forneço?", 
      resposta: "Ambas opções! Podemos adquirir todas as peças com desconto especial ou montar com componentes que você já possui." 
    },
    { 
      pergunta: "Montam PC para edição de vídeo?", 
      resposta: "Sim! Montamos workstations otimizadas para Premiere, DaVinci Resolve, After Effects e outras aplicações pesadas." 
    },
    { 
      pergunta: "Qual o prazo de montagem?", 
      resposta: "Com as peças em mãos, a montagem é feita em 24-48 horas, incluindo instalação de sistema e testes completos." 
    },
    { 
      pergunta: "Montam PCs para empresas em quantidade?", 
      resposta: "Sim! Atendemos empresas do CIC com montagem em volume, com preços especiais e configuração padronizada." 
    },
  ],
  
  pontosReferencia: [
    "Av. das Indústrias",
    "Terminal CIC",
    "Rua João Bettega",
    "Rua Pedro Gusso",
    "Barracão Industrial CIC",
    "Parque Barigüi (proximidades)",
    "Rua Desembargador Westphalen",
  ],
  
  tempoAtendimento: "Montagem em 24-48h",
  
  servicosRelacionados: [
    { nome: "Upgrade SSD e Memória", slug: "upgrade-ssd-memoria" },
    { nome: "Redes Wi-Fi", slug: "redes-wifi" },
    { nome: "Formatação de Computador", slug: "formatacao-computador" },
  ],
  
  bairrosProximos: [
    { nome: "Campo Comprido", slug: "campo-comprido" },
    { nome: "Portão", slug: "portao" },
    { nome: "Santa Felicidade", slug: "santa-felicidade" },
    { nome: "Centro", slug: "centro" },
  ],
};

const MontagemPcCIC = () => <ServicoBairroTemplate data={data} />;
export default MontagemPcCIC;
