export interface ServicoData {
  slug: string;
  nome: string;
  servicoSlugExistente?: string; // maps to existing /servicos/ route slug
}

export interface CidadeData {
  slug: string;
  nome: string;
}

export const SERVICOS: ServicoData[] = [
  { slug: "formatacao-computador", nome: "Formatação de Computador", servicoSlugExistente: "formatacao-computador" },
  { slug: "remocao-virus", nome: "Remoção de Vírus", servicoSlugExistente: "remocao-virus" },
  { slug: "conserto-notebook", nome: "Conserto de Notebook", servicoSlugExistente: "conserto-pc-notebook" },
  { slug: "conserto-pc", nome: "Conserto de PC", servicoSlugExistente: "conserto-pc-notebook" },
  { slug: "conserto-tv", nome: "Conserto de TV", servicoSlugExistente: "conserto-tv" },
  { slug: "conserto-celular", nome: "Conserto de Celular", servicoSlugExistente: "conserto-celular" },
  { slug: "upgrade-ssd", nome: "Upgrade de SSD e Memória", servicoSlugExistente: "upgrade-ssd-memoria" },
  { slug: "redes-wifi", nome: "Redes e Wi-Fi", servicoSlugExistente: "redes-wifi" },
  { slug: "backup-recuperacao", nome: "Backup e Recuperação de Dados", servicoSlugExistente: "backup-recuperacao" },
  { slug: "suporte-empresas", nome: "Suporte Técnico para Empresas" },
  { slug: "atendimento-remoto", nome: "Atendimento Remoto" },
];

export const CIDADES: CidadeData[] = [
  { slug: "curitiba", nome: "Curitiba" },
  { slug: "sao-jose-dos-pinhais", nome: "São José dos Pinhais" },
  { slug: "araucaria", nome: "Araucária" },
  { slug: "campo-largo", nome: "Campo Largo" },
  { slug: "pinhais", nome: "Pinhais" },
  { slug: "colombo", nome: "Colombo" },
  { slug: "almirante-tamandare", nome: "Almirante Tamandaré" },
  { slug: "fazenda-rio-grande", nome: "Fazenda Rio Grande" },
  { slug: "piraquara", nome: "Piraquara" },
  { slug: "campo-magro", nome: "Campo Magro" },
  { slug: "quatro-barras", nome: "Quatro Barras" },
  { slug: "balsa-nova", nome: "Balsa Nova" },
  { slug: "contenda", nome: "Contenda" },
  { slug: "mandirituba", nome: "Mandirituba" },
  { slug: "tijucas-do-sul", nome: "Tijucas do Sul" },
  { slug: "rio-branco-do-sul", nome: "Rio Branco do Sul" },
];

type FaqItem = { pergunta: string; resposta: string };

export function getFaqPorServico(servicoSlug: string, cidadeNome: string): FaqItem[] {
  const faqs: Record<string, FaqItem[]> = {
    "formatacao-computador": [
      { pergunta: `Quanto custa formatar computador em ${cidadeNome}?`, resposta: `Entre em contato pelo WhatsApp para atendimento sem compromisso. Atendemos em ${cidadeNome} a domicílio.` },
      { pergunta: "Quanto tempo leva a formatação?", resposta: "Em média 2 a 4 horas, dependendo do equipamento e programas a instalar." },
      { pergunta: "Vou perder meus arquivos?", resposta: "Fazemos backup antes de formatar. Documentos, fotos e arquivos ficam protegidos." },
      { pergunta: `O técnico vai até minha casa em ${cidadeNome}?`, resposta: `Sim. Fazemos atendimento a domicílio em ${cidadeNome}. Sem precisar sair de casa.` },
      { pergunta: "Como agendar?", resposta: "Pelo WhatsApp. Respondemos em até 15 minutos." },
    ],
    "remocao-virus": [
      { pergunta: "Como saber se meu computador tem vírus?", resposta: "Sinais: lentidão excessiva, anúncios em excesso, programas abrindo sozinhos, antivírus desabilitado." },
      { pergunta: "A remoção apaga meus arquivos?", resposta: "Não. A remoção é cirúrgica — eliminamos ameaças sem apagar dados pessoais." },
      { pergunta: `Atendem empresas em ${cidadeNome}?`, resposta: `Sim, residências e empresas em ${cidadeNome} e toda a RMC.` },
      { pergunta: "Tem garantia?", resposta: "Sim. Se o vírus retornar em até 30 dias, retornamos sem custo adicional." },
      { pergunta: "Posso ter vírus com antivírus instalado?", resposta: "Sim. Antivírus gratuitos não detectam ameaças recentes. Fazemos varredura manual avançada." },
    ],
    "conserto-notebook": [
      { pergunta: "Notebook esquentando muito é perigoso?", resposta: "Sim. Superaquecimento causa danos permanentes. Limpeza interna resolve na maioria dos casos." },
      { pergunta: "Vale mais consertar ou comprar um novo?", resposta: "Depende da idade e do defeito. Avaliamos no local e damos opinião honesta antes de cobrar." },
      { pergunta: `Quanto custa em ${cidadeNome}?`, resposta: "atendimento sem compromisso pelo WhatsApp. O técnico avalia no local antes de qualquer cobrança." },
      { pergunta: "Trocam pasta térmica?", resposta: "Sim, incluída na limpeza completa." },
      { pergunta: "Atendem qualquer marca?", resposta: "Sim. Dell, HP, Lenovo, Acer, Asus, Samsung, Positivo e todas as demais." },
    ],
    "upgrade-ssd": [
      { pergunta: "Qual SSD indicam para meu computador?", resposta: "Depende do modelo. Avaliamos compatibilidade e indicamos a melhor opção custo-benefício." },
      { pergunta: "A migração de dados está inclusa?", resposta: "Sim, migramos todos os dados do HD antigo para o SSD novo sem perda." },
      { pergunta: "Quanto o computador fica mais rápido?", resposta: "Na maioria dos casos o sistema inicia e abre programas 3 a 5 vezes mais rápido." },
      { pergunta: "Posso continuar usando o Windows atual?", resposta: "Sim, migramos o sistema operacional sem reinstalar do zero, preservando programas e configurações." },
      { pergunta: `Atendem em ${cidadeNome}?`, resposta: `Sim, fazemos o upgrade de SSD a domicílio em ${cidadeNome}. Levamos as peças.` },
    ],
    "redes-wifi": [
      { pergunta: "Internet lenta pode ser problema do roteador?", resposta: "Sim. Roteadores mal configurados ou desatualizados causam lentidão e quedas frequentes." },
      { pergunta: "Configuram qualquer marca?", resposta: "Sim. TP-Link, Intelbras, D-Link, Asus, Xiaomi e todos os demais." },
      { pergunta: `Atendem em ${cidadeNome}?`, resposta: `Sim, configuração presencial em ${cidadeNome}. Testamos sinal em todos os cômodos.` },
      { pergunta: "Como melhorar o sinal Wi-Fi?", resposta: "Posicionamento do roteador, canal de frequência e configuração de banda dupla resolvem a maioria dos casos." },
      { pergunta: "Configuram redes para empresas?", resposta: "Sim. Redes corporativas, cabeamento e múltiplos pontos de acesso." },
    ],
    "backup-recuperacao": [
      { pergunta: "Conseguem recuperar HD danificado?", resposta: "Dependendo do tipo de dano, sim. Avaliamos gratuitamente antes de qualquer cobrança." },
      { pergunta: "Quais arquivos conseguem recuperar?", resposta: "Documentos, fotos, vídeos, planilhas — qualquer tipo de arquivo apagado ou de HD com defeito." },
      { pergunta: "Quanto tempo leva a recuperação?", resposta: "Varia conforme a gravidade do dano. Casos simples em 1 a 2 horas; casos complexos em até 48h." },
      { pergunta: "O serviço tem garantia de recuperação?", resposta: "Avaliamos primeiro. Só cobramos pelo que for efetivamente recuperado." },
      { pergunta: `Atendem em ${cidadeNome}?`, resposta: `Sim, fazemos avaliação a domicílio em ${cidadeNome} ou você pode nos enviar o equipamento.` },
    ],
    "suporte-empresas": [
      { pergunta: `Atendem pequenas empresas em ${cidadeNome}?`, resposta: "Sim, nosso foco são residências e pequenas e médias empresas em toda a RMC." },
      { pergunta: "Oferecem contratos de manutenção?", resposta: "Sim. O escopo, a periodicidade das visitas e o suporte remoto são combinados caso a caso e registrados por escrito." },
      { pergunta: "Quanto tempo para atender uma chamada?", resposta: "Depende da disponibilidade da agenda e da modalidade. A janela de atendimento é confirmada na triagem." },
      { pergunta: "Trabalham com TI terceirizada?", resposta: "Sim. Assumimos toda a gestão de TI da empresa: hardware, rede, software e suporte." },
      { pergunta: `Atendem em ${cidadeNome}?`, resposta: `Sim, atendemos empresas em ${cidadeNome} e toda a região metropolitana de Curitiba.` },
    ],
    "atendimento-remoto": [
      { pergunta: "Como funciona o atendimento remoto?", resposta: "Usamos software de acesso seguro. Você vê tudo na tela em tempo real e pode encerrar quando quiser." },
      { pergunta: "É seguro?", resposta: "Sim. Usamos ferramentas profissionais com criptografia. Você controla e acompanha tudo." },
      { pergunta: "Quais problemas resolvem remotamente?", resposta: "Vírus, lentidão, erros de sistema, instalação de programas, configurações de email e muito mais." },
      { pergunta: "Precisa instalar algum programa?", resposta: "Enviamos um link seguro. O programa roda apenas durante o atendimento." },
      { pergunta: "Quanto custa?", resposta: "Entre em contato pelo WhatsApp para valor do atendimento. Atendimento remoto geralmente é mais rápido e econômico." },
    ],
    "conserto-pc": [
      { pergunta: `Quanto custa consertar PC em ${cidadeNome}?`, resposta: `Entre em contato pelo WhatsApp para atendimento sem compromisso. Atendemos em ${cidadeNome} a domicílio.` },
      { pergunta: "Quais defeitos vocês consertam?", resposta: "PC que não liga, tela azul, lentidão, superaquecimento, fontes queimadas, placas com defeito e mais." },
      { pergunta: "Consertam PC gamer?", resposta: "Sim. Trabalhamos com diagnóstico e reparo de desktops gamers, incluindo placas de vídeo e refrigeração." },
      { pergunta: `Atendem a domicílio em ${cidadeNome}?`, resposta: `Sim. O técnico vai até seu endereço em ${cidadeNome} com ferramentas profissionais.` },
      { pergunta: "Tem garantia?", resposta: "Sim, todos os serviços contam com garantia por escrito." },
    ],
    "conserto-tv": [
      { pergunta: `Vocês fazem visita técnica para TV em ${cidadeNome}?`, resposta: `Não. Para TVs, o atendimento é por coleta e entrega em ${cidadeNome}: retiramos o aparelho no seu endereço, avaliamos em bancada e devolvemos testado. Não realizamos visita técnica a domicílio para televisores.` },
      { pergunta: "Quanto custa consertar TV?", resposta: "O valor depende do defeito e da peça necessária. Fazemos diagnóstico e informamos o valor antes de qualquer execução. Sem compromisso." },
      { pergunta: "Consertam Smart TV?", resposta: "Sim. LED, LCD, OLED, Smart TV de todas as marcas: Samsung, LG, Sony, TCL, Philips e mais." },
      { pergunta: "Quanto tempo leva?", resposta: "Depende do defeito e disponibilidade de peças. Em geral, de 3 a 10 dias úteis." },
      { pergunta: "Consertam tela quebrada de TV?", resposta: "Avaliamos caso a caso. Em muitos modelos, a troca do painel custa quase o valor de uma TV nova. Orientamos com honestidade." },
    ],
    "conserto-celular": [
      { pergunta: `Vocês fazem visita para celular em ${cidadeNome}?`, resposta: `Não. Para celulares, o aparelho é retirado e devolvido por coleta e entrega. Não fazemos visita a domicílio para smartphones.` },
      { pergunta: "Quanto custa trocar tela de celular?", resposta: "Depende do modelo. Fazemos diagnóstico e informamos o valor antes de executar. Sem compromisso." },
      { pergunta: "Consertam iPhone?", resposta: "Sim. Trabalhamos com todos os modelos de iPhone, com telas originais e compatíveis de alta qualidade." },
      { pergunta: "Quanto tempo leva o reparo?", resposta: "Reparos simples (tela, bateria) ficam prontos em poucas horas. Defeitos de placa podem levar 3 a 5 dias." },
      { pergunta: "Trocam bateria?", resposta: "Sim. Substituímos baterias de todas as marcas para restaurar a autonomia original do aparelho." },
    ],
  };

  return faqs[servicoSlug] || faqs["formatacao-computador"];
}

export function getServico(slug: string): ServicoData | undefined {
  return SERVICOS.find(s => s.slug === slug);
}

export function getCidade(slug: string): CidadeData | undefined {
  return CIDADES.find(c => c.slug === slug);
}
