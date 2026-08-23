import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { isEditorialApproved } from "@/lib/blogEditorialRegistry";
import { getArticleSources } from "@/lib/blogEditorialSources";


type FAQItem = { q: string; a: string };

const BASE_FAQ: FAQItem[] = [
  {
    q: "Quanto custa o atendimento em Curitiba?",
    a: "A visita técnica em Curitiba começa em R$ 99,99 e o valor do atendimento do serviço é apresentado antes da execução. Você só aprova se concordar.",
  },
  {
    q: "Em quanto tempo o técnico atende?",
    a: "Atendemos conforme a disponibilidade da agenda em Curitiba e região metropolitana, conforme disponibilidade da agenda. Confirme o horário pelo WhatsApp.",
  },
  {
    q: "Atende em domicílio ou só na bancada?",
    a: "Atendemos a domicílio em Curitiba e região, com opção de coleta e entrega quando o serviço exigir bancada.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos PIX, dinheiro e cartão. Pagamento somente após o serviço entregue e aprovado.",
  },
];

const CATEGORY_EXTRA: Record<string, FAQItem[]> = {
  CFTV: [
    {
      q: "Vocês instalam câmeras em residência e comércio?",
      a: "Sim. Fazemos projeto, passagem de cabos, instalação de DVR/NVR e configuração de acesso remoto pelo celular.",
    },
  ],
  Formatação: [
    {
      q: "A formatação apaga meus arquivos?",
      a: "Antes da formatação fazemos backup dos seus arquivos importantes. Você aprova o que deve ser preservado.",
    },
  ],
  Vírus: [
    {
      q: "Vocês removem vírus sem perder meus arquivos?",
      a: "Na maioria dos casos sim. Avaliamos o tipo de infecção e priorizamos preservar seus dados.",
    },
  ],
  Notebook: [
    {
      q: "Vocês consertam qualquer marca de notebook?",
      a: "Atendemos as principais marcas: Dell, Lenovo, Acer, HP, Samsung, Asus, Positivo, Apple e outras.",
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// FAQ EDITORIAL POR ARTIGO (pilotos em revisão).
// Perguntas específicas por tema, distintas entre si, sem preço,
// sem prazo prometido e sem promessa de resultado. Quando um slug
// tem override aqui, ele NÃO usa o BASE_FAQ nem os extras de
// categoria (que contêm valores comerciais).
// ─────────────────────────────────────────────────────────────
const PILOT_FAQ: Record<string, FAQItem[]> = {
  "notebook-nao-liga-o-que-fazer": [
    {
      q: "O notebook não dá nenhum sinal ao ligar. O que pode ser?",
      a: "Pode estar relacionado à alimentação (tomada, cabo, carregador), à bateria, à memória, ao armazenamento ou à placa. As verificações seguras ajudam a estreitar, mas a causa só se confirma no diagnóstico.",
    },
    {
      q: "O notebook liga, mas a tela fica preta. É a tela?",
      a: "Nem sempre. Ligar o notebook a um monitor externo ajuda a saber se o problema é da tela ou da parte que gera a imagem.",
    },
    {
      q: "Posso abrir o notebook para verificar?",
      a: "Verificações externas (tomada, cabo, carregador, periféricos, monitor externo) são seguras. Abrir o carregador, a bateria ou desmontar o notebook sem preparo pode piorar o quadro e é melhor evitar.",
    },
    {
      q: "O notebook parou depois de uma queda de energia. Tem solução?",
      a: "É preciso avaliar. Oscilações podem afetar o carregador, o conector, a bateria ou a placa; o diagnóstico define quais são as opções antes de qualquer troca.",
    },
  ],

  "computador-lento-causas-solucoes": [
    {
      q: "Formatar resolve a lentidão?",
      a: "Só quando a causa é software acumulado ou corrompido. Não resolve lentidão por HD desgastado, pouca memória, superaquecimento ou hardware antigo.",
    },
    {
      q: "Trocar por SSD deixa o computador rápido?",
      a: "Costuma ajudar bastante na inicialização e na abertura de programas, mas o ganho depende do restante do hardware.",
    },
    {
      q: "Como sei se a lentidão é vírus?",
      a: "Lentidão acompanhada de pop-ups, navegador alterado ou uso alto de recursos sem motivo são sinais. A confirmação exige análise.",
    },
    {
      q: "Vale a pena investir num computador antigo?",
      a: "Depende do uso e do estado do equipamento. Às vezes um upgrade simples compensa; em outros casos, não.",
    },
  ],
  "como-instalar-windows-11-do-zero": [
    {
      q: "Qual a diferença entre atualizar e fazer instalação limpa?",
      a: "Atualizar mantém arquivos, programas e configurações; a instalação limpa apaga o disco do sistema e instala o Windows 11 do zero, exigindo backup antes.",
    },
    {
      q: "A instalação limpa apaga meus arquivos?",
      a: "Sim, o disco do sistema é apagado. Por isso o backup conferido dos dados vem antes de qualquer instalação limpa.",
    },
    {
      q: "Preciso baixar o Windows 11 de onde?",
      a: "Apenas das ferramentas e downloads oficiais da Microsoft. Imagens modificadas, ativadores e downloads de terceiros trazem risco de segurança e problemas de licença.",
    },
    {
      q: "Vocês fornecem chave, ativador ou bypass de requisitos?",
      a: "Não. Trabalhamos apenas com licenças legítimas e não orientamos ativadores, cracks ou formas de contornar os requisitos do Windows 11.",
    },
  ],

  "quando-trocar-hd-por-ssd": [
    {
      q: "O SSD deixa qualquer computador rápido?",
      a: "Ele acelera bastante o armazenamento, mas não substitui memória ou processador limitados.",
    },
    {
      q: "Qualquer computador aceita qualquer SSD?",
      a: "Não. É preciso conferir a interface (SATA ou NVMe) e o espaço físico disponível no equipamento.",
    },
    {
      q: "É melhor clonar o sistema ou instalar do zero?",
      a: "Clonar mantém tudo, inclusive problemas do sistema atual; a instalação limpa costuma ser mais estável. Em qualquer caso, backup antes é indispensável.",
    },
    {
      q: "Preciso trocar o computador todo ou só o disco?",
      a: "Depende do estado do equipamento. A avaliação do hardware ajuda a decidir se o SSD sozinho resolve.",
    },
  ],
  "notebook-superaquecendo-o-que-fazer": [
    {
      q: "Meu notebook esquenta muito. É normal?",
      a: "Em tarefas pesadas o calor sobe. Desligamentos, base muito quente em uso leve ou queda de desempenho já são sinais de alerta.",
    },
    {
      q: "Posso fazer a limpeza interna sozinho?",
      a: "A limpeza externa das saídas de ar é segura. Abrir para limpeza interna e trocar a pasta térmica exige prática para não danificar peças.",
    },
    {
      q: "A bateria está estufada. O que faço?",
      a: "Pare de usar, não fure nem pressione a bateria e procure um técnico. Bateria deformada é sinal de risco.",
    },
    {
      q: "De quanto em quanto tempo trocar a pasta térmica?",
      a: "Varia conforme o equipamento e o uso. Não existe um prazo único que sirva para todos os casos.",
    },
  ],
  "backup-como-proteger-seus-arquivos": [
    {
      q: "Copiar para outra pasta do mesmo disco é backup?",
      a: "Não. Se o disco falhar, a cópia na mesma unidade se perde junto com o original.",
    },
    {
      q: "Sincronizar com a nuvem é backup?",
      a: "Ajuda, mas se um arquivo é apagado ou criptografado a mudança pode se espalhar. Backup guarda versões que não são sobrescritas automaticamente.",
    },
    {
      q: "Com que frequência devo fazer backup?",
      a: "Conforme o quanto os dados mudam e o quanto você não pode perdê-los. O essencial é manter uma rotina.",
    },
    {
      q: "Já perdi arquivos. Ainda dá para recuperar?",
      a: "Às vezes sim, mas não há garantia. Por isso o backup preventivo é sempre mais seguro do que depender de recuperação.",
    },
  ],
  "como-saber-se-pc-tem-virus-malware": [
    {
      q: "Todo computador lento está com vírus?",
      a: "Não. Lentidão tem várias causas possíveis; vírus é uma delas e precisa ser confirmado por análise.",
    },
    {
      q: "Apareceu um alerta com telefone de suporte. Devo ligar?",
      a: "Não. É um golpe de falso suporte. Feche a janela, não ligue para o número e não instale nada que a tela pedir.",
    },
    {
      q: "Dá para remover vírus sem perder arquivos?",
      a: "Em muitos casos sim, mas depende do tipo de ameaça. Não é possível prometer que nunca haverá perda de dados.",
    },
    {
      q: "Meus arquivos ficaram bloqueados ou criptografados. O que faço?",
      a: "Pode ser ransomware. Desconecte da internet, não pague o resgate e busque avaliação antes de mexer nos arquivos.",
    },
  ],
  "como-melhorar-sinal-wifi-em-casa": [
    {
      q: "Como sei se o problema é do roteador ou da operadora?",
      a: "Se todos os aparelhos ficam sem internet ao mesmo tempo e o problema persiste após reiniciar, tende a ser a operadora. Se cai só longe do roteador, é alcance da rede local.",
    },
    {
      q: "Trocar de roteador resolve?",
      a: "Nem sempre. Se a causa é a operadora, o cabeamento ou o posicionamento, o aparelho novo repete o mesmo problema.",
    },
    {
      q: "Repetidor ou sistema mesh?",
      a: "Depende do tamanho e do layout do imóvel. Casas grandes com pontos cegos costumam se beneficiar de mesh.",
    },
    {
      q: "O Wi-Fi cai só em um aparelho. É a rede?",
      a: "Provavelmente não. Quando o problema é isolado em um dispositivo, a causa costuma estar no próprio aparelho.",
    },
  ],

  // ── Rodada 3O — conteúdos educacionais empresariais.
  "organizacao-de-ti-para-pequenos-escritorios": [
    {
      q: "Uma empresa pequena precisa de inventário de computadores?",
      a: "Sim. Sem a lista do que existe, cada compra vira palpite e cada parada vira urgência. O inventário mostra a máquina mais antiga, quem depende de qual programa e o que não pode ficar fora do ar.",
    },
    {
      q: "Quais informações devem ser registradas?",
      a: "Equipamento, categoria, usuário, local interno, configuração relevante, sistema operacional, programas principais, data aproximada de compra, garantia, problema conhecido e importância operacional.",
    },
    {
      q: "Preciso guardar senhas junto com o inventário?",
      a: "Não. Senhas, códigos de autenticação, dados bancários e dados de clientes não devem ficar no inventário. Credenciais compartilhadas ficam em um gerenciador de senhas com acesso controlado.",
    },
    {
      q: "Backup em nuvem é suficiente?",
      a: "Depende do que é sincronização e do que é cópia recuperável. Sincronização propaga exclusão e corrupção. O que define a proteção é ter versões anteriores, cópia separada e teste de restauração.",
    },
    {
      q: "Quem deve ser responsável pela informática?",
      a: "Alguém interno precisa responder pelas decisões — autorizar acessos, acionar fornecedores e acompanhar as rotinas — mesmo quando a execução técnica é externa.",
    },
    {
      q: "Atendimento avulso é suficiente?",
      a: "Para ambientes pequenos e estáveis, muitas vezes sim. O atendimento avulso resolve o caso pontual, sem acompanhamento contínuo entre os chamados.",
    },
    {
      q: "Quando vale considerar suporte recorrente?",
      a: "Quando os chamados se repetem, há mais estações do que consegue acompanhar, o histórico se perde entre atendimentos ou a operação depende de rotinas preventivas com data.",
    },
    {
      q: "Como registrar um problema antes de pedir suporte?",
      a: "Anote equipamento, usuário, horário de início, mensagem de erro exata, programa envolvido, alteração recente, quantas pessoas estão paradas e se o acesso remoto é possível. Nunca envie senhas por mensagem.",
    },
  ],
  "como-escolher-uma-workstation": [
    {
      q: "Qual é a diferença entre workstation e PC gamer?",
      a: "A carga de trabalho. Uma estação profissional costuma rodar horas seguidas, com arquivos grandes e prioridade em estabilidade, memória e armazenamento. O foco de um PC de jogos é outro.",
    },
    {
      q: "Toda workstation precisa de placa de vídeo dedicada?",
      a: "Não. A placa só é decisiva quando a aplicação usa aceleração gráfica compatível. Consulte os requisitos oficiais do programa antes de investir nesse componente.",
    },
    {
      q: "Quanta memória RAM é necessária?",
      a: "Não existe número universal. A quantidade depende do tamanho dos projetos, das aplicações abertas ao mesmo tempo e do limite da plataforma escolhida.",
    },
    {
      q: "É melhor usar um ou mais SSDs?",
      a: "Depende da separação desejada entre sistema, projetos ativos e cache. Unidades separadas ajudam na organização e no espaço livre; uma única unidade bem dimensionada também pode atender.",
    },
    {
      q: "É possível aproveitar componentes antigos?",
      a: "Em alguns casos sim, quando há compatibilidade de plataforma e o componente não é o gargalo. Isso é avaliado peça a peça, não por regra geral.",
    },
    {
      q: "Como saber se as peças são compatíveis?",
      a: "Pela verificação de plataforma, encaixe, alimentação, dimensões do gabinete e requisitos de cada componente. A conferência é feita antes da compra, com a lista em mãos.",
    },
    {
      q: "O desempenho em um programa pode ser garantido?",
      a: "Não. A montagem correta reduz gargalos, mas o resultado depende da versão do software, do tipo de projeto, dos plugins e dos requisitos oficiais da aplicação.",
    },
    {
      q: "É possível fazer upgrade futuramente?",
      a: "Quando a plataforma e o gabinete preveem expansão, sim. Deixar encaixes livres e espaço físico disponível na escolha inicial é o que mantém essa possibilidade.",
    },
    {
      q: "Os testes estão incluídos?",
      a: "O escopo de testes é confirmado antes da execução e pode incluir reconhecimento dos componentes, inicialização, memória, armazenamento, temperatura, estabilidade, portas, vídeo e rede.",
    },
    {
      q: "O valor pode ser informado sem conhecer os requisitos?",
      a: "Não de forma responsável. Sem saber o que roda, o tamanho dos arquivos e o uso diário, qualquer número é chute. O levantamento vem antes.",
    },
  ],
};

export const BlogPostFAQ = ({ category, slug }: { category: string; slug: string }) => {
  const override = PILOT_FAQ[slug];
  const extras = CATEGORY_EXTRA[category] ?? [];
  const items = override ?? [...extras, ...BASE_FAQ].slice(0, 5);

  // FAQPage ocupa o SLOT único de FAQ da página (prioridade de página):
  // substitui o FAQ institucional global e nunca duplica o nó do SSR.
  // Fail-closed: schema apenas para conteúdo aprovado — a FAQ visível
  // continua renderizada em rascunhos, só sem rich result.
  useJsonLdSlot(
    SCHEMA_SLOTS.faq,
    isEditorialApproved(slug)
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `https://tecnico.curitiba.br/blog/${slug}#faq`,
          mainEntity: items.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }
      : null,
    SLOT_PRIORITY.page,
  );

  return (
    <section className="not-prose mt-12">
      <h2 className="font-heading font-bold text-primary text-xl md:text-2xl mb-4">
        Perguntas frequentes
      </h2>
      <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {items.map((it, i) => (
          <details key={i} className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-4 md:p-5 font-semibold text-foreground hover:bg-muted/40 transition-colors">
              <span>{it.q}</span>
              <span className="text-accent text-xl leading-none group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
            </summary>
            <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm md:text-base text-muted-foreground leading-relaxed">
              {it.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// FONTES E REFERÊNCIAS TÉCNICAS (visíveis) — pilotos em revisão.
//
// Renderiza APENAS as fontes realmente registradas no manifesto
// (src/lib/blogEditorialSources.ts) para o slug. Sem fonte registrada,
// não renderiza nada (artigos baseados em conhecimento técnico estável,
// justificados no manifesto). Nunca expõe status interno, factChecked,
// classificação ou notas privadas. Âncora descritiva, publisher visível,
// rel="noopener noreferrer" e target de nova aba.
// ─────────────────────────────────────────────────────────────
export const EditorialReferences = ({ slug }: { slug: string }) => {
  const sources = getArticleSources(slug);
  if (sources.length === 0) return null;

  return (
    <section className="not-prose mt-12">
      <h2 className="font-heading font-bold text-primary text-xl md:text-2xl mb-4">
        Fontes e referências técnicas
      </h2>
      <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden m-0 list-none p-0">
        {sources.map((s) => (
          <li key={s.id} className="p-4 md:p-5">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              {s.title}
            </a>
            <span className="block text-sm text-muted-foreground mt-1">{s.publisher}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BlogPostFAQ;

