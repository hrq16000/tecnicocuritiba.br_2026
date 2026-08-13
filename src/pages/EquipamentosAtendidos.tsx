import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { IMAGES } from "@/lib/images";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import {
  Monitor, Laptop, HardDrive, Wifi, Server, Cpu, Keyboard,
  MessageCircle, ArrowRight, CheckCircle2, AlertTriangle, Ban, MonitorSmartphone,
} from "lucide-react";

const PATH = "/equipamentos-atendidos";
const TITLE = "Equipamentos Atendidos | Técnico em Curitiba";
const DESCRIPTION =
  "Notebooks, desktops, PC gamer, All in One, estações de trabalho, equipamentos de home office, redes e armazenamento: o que atendemos em Curitiba, os limites e a modalidade indicada.";

const equipamentos = [
  {
    icon: Laptop,
    nome: "Notebooks e ultrabooks",
    desc: "Dell, Lenovo, HP, Acer, Asus, Samsung, Positivo, Vaio e similares",
    problemas: [
      "Lentidão, travamento e superaquecimento no uso diário",
      "Não liga, não dá imagem ou desliga sozinho",
      "Bateria que não segura carga e conector de energia com mau contato",
      "Teclado, dobradiça e carcaça com dano de uso ou queda",
      "Disco em fim de vida e falhas ao iniciar o sistema",
    ],
    servico: { label: "Manutenção de notebook", to: "/servicos/manutencao-de-notebook" },
    modalidade: "Casos de software resolvem remotamente ou no local; falha física normalmente exige coleta e bancada.",
    limite: "Reparo com microssolda, dano por líquido e placa-mãe passam por avaliação antes de qualquer previsão.",
  },
  {
    icon: Monitor,
    nome: "Computadores desktop",
    desc: "PCs de mesa domésticos e de escritório, montados ou de fabricante",
    problemas: [
      "Computador lento, cheio de programas na inicialização ou com pop-ups",
      "Não liga, reinicia sozinho ou apresenta tela azul",
      "Ruído e aquecimento por acúmulo de poeira e pasta térmica ressecada",
      "Fonte instável e HD em fim de vida útil",
      "Sistema corrompido após atualização ou infecção",
    ],
    servico: { label: "Manutenção de computador", to: "/servicos/manutencao-de-computador" },
    modalidade: "Boa parte é resolvida em visita ao endereço; troca de peça pode exigir bancada.",
    limite: "Componentes precisam estar disponíveis no mercado; equipamentos muito antigos podem não compensar reparo.",
  },
  {
    icon: Cpu,
    nome: "PC gamer",
    desc: "Máquinas de alto desempenho com placa de vídeo dedicada",
    problemas: [
      "Queda de desempenho e engasgos em jogos e edição",
      "Temperatura alta, ventoinha ruidosa e desligamento sob carga",
      "Instabilidade após troca de peça ou de fonte subdimensionada",
      "Erros de driver de vídeo e travamento de tela",
      "Necessidade de upgrade de memória, SSD ou armazenamento adicional",
    ],
    servico: { label: "Montagem de PC e PC Gamer", to: "/servicos/montagem-de-pc" },
    modalidade: "Diagnóstico térmico e de estabilidade costuma exigir bancada e testes sob carga.",
    limite: "Não fazemos overclock extremo nem assumimos responsabilidade por configuração fora de especificação do fabricante.",
  },
  {
    icon: MonitorSmartphone,
    nome: "All in One",
    desc: "Computadores integrados ao monitor, comuns em recepções e consultórios",
    problemas: [
      "Lentidão e sistema desatualizado",
      "Superaquecimento por ventilação restrita do gabinete integrado",
      "Falha ao iniciar e disco com setores defeituosos",
      "Dificuldade de upgrade por limitação de projeto",
    ],
    servico: { label: "Manutenção de computador", to: "/servicos/manutencao-de-computador" },
    modalidade: "Serviço de software no local; abertura e troca de componente em bancada.",
    limite: "Peças de All in One são específicas do modelo e nem sempre têm reposição disponível.",
  },
  {
    icon: Server,
    nome: "Estações de trabalho e equipamentos empresariais",
    desc: "Máquinas de uso profissional, estações compartilhadas e infraestrutura de escritório",
    problemas: [
      "Parque de máquinas heterogêneo e sem padronização",
      "Lentidão generalizada afetando produtividade da equipe",
      "Falta de rotina de manutenção e de cópia de arquivos",
      "Compartilhamento de arquivos e impressoras instável",
    ],
    servico: { label: "Suporte técnico empresarial", to: "/servicos/suporte-tecnico-empresarial" },
    modalidade: "Combinação de visita técnica e suporte remoto, conforme o caso.",
    limite: "Alterações em contas, políticas e sistemas corporativos dependem de autorização de quem responde pela empresa.",
  },
  {
    icon: Wifi,
    nome: "Redes e conectividade",
    desc: "Roteadores, access points, mesh, repetidores e switches compatíveis",
    problemas: [
      "Wi-Fi fraco em parte do imóvel e queda de conexão",
      "Roteador mal posicionado, canal congestionado ou firmware antigo",
      "Rede lenta em horário de pico com vários dispositivos",
      "Impressora ou pasta compartilhada que some da rede",
    ],
    servico: { label: "Redes e Wi-Fi", to: "/servicos/redes-e-wifi" },
    modalidade: "Avaliação no local costuma ser necessária; ajustes de configuração podem ser remotos.",
    limite: "Obra, passagem de cabo e ponto de rede novo são avaliados à parte; falha do provedor é responsabilidade da operadora.",
  },
  {
    icon: HardDrive,
    nome: "Armazenamento e arquivos",
    desc: "HD mecânico, SSD SATA e NVMe, HD externo, pendrive e cartão de memória",
    problemas: [
      "Disco lento, com ruído anormal ou não reconhecido",
      "Arquivos corrompidos e sistema que não inicia",
      "Necessidade de migrar dados para equipamento novo",
      "Perda de arquivos após formatação ou exclusão acidental",
    ],
    servico: { label: "Recuperação de dados", to: "/servicos/recuperacao-de-dados" },
    modalidade: "Sempre avaliação física primeiro; nunca prometemos resultado antes do teste da mídia.",
    limite: "Dano severo de mídia pode inviabilizar a leitura. Recuperação é tentativa, não garantia.",
  },
  {
    icon: Keyboard,
    nome: "Periféricos e posto de home office",
    desc: "Monitor adicional, dock, teclado, mouse, headset, webcam e impressora já compatível",
    problemas: [
      "Segundo monitor não reconhecido ou com resolução errada",
      "Câmera e microfone falhando em reuniões",
      "Impressora que parou de imprimir ou saiu da rede",
      "Posto de trabalho desorganizado e cabeamento improvisado",
    ],
    servico: { label: "Suporte para home office", to: "/servicos/suporte-home-office" },
    modalidade: "Maioria resolve em atendimento remoto; instalação física no local.",
    limite: "Defeito mecânico de impressora e reparo interno de periférico ficam com a assistência da marca.",
  },
];

const foraDoEscopo = [
  "Celulares e smartphones",
  "Televisores e equipamentos de áudio e vídeo",
  "Eletrodomésticos em geral",
  "Câmeras e sistemas de CFTV",
  "Videogames e consoles",
  "Impressoras como vertical de reparo independente",
  "Equipamentos industriais e automação",
  "Tablets, exceto configurações já ligadas ao ambiente atendido",
];

const faqs = [
  {
    question: "Vocês atendem qualquer marca de notebook e computador?",
    answer:
      "Atendemos as marcas de mercado mais comuns em Curitiba, como Dell, Lenovo, HP, Acer, Asus, Samsung, Positivo e máquinas montadas. O que define a viabilidade não é a marca, e sim a disponibilidade de peça e o resultado da avaliação técnica.",
  },
  {
    question: "MacBook está incluído?",
    answer:
      "Somente mediante avaliação prévia. Parte dos serviços de sistema, arquivos e configuração é possível, mas reparos que dependem de peça específica ou ferramenta proprietária podem ser encaminhados para assistência especializada. Confirme o caso na triagem antes de agendar.",
  },
  {
    question: "Por que televisores e celulares não estão na lista?",
    answer:
      "Porque este portal trabalha com informática: computadores, notebooks, redes, armazenamento e o posto de trabalho. Listar aparelhos fora dessa capacidade real geraria expectativa que não conseguiríamos cumprir.",
  },
  {
    question: "Como sei qual modalidade de atendimento serve para o meu equipamento?",
    answer:
      "Depende do sintoma. Problema de sistema, configuração ou programa costuma resolver por atendimento remoto. Rede, instalação e verificação inicial funcionam bem em domicílio. Falha física, troca de peça e recuperação de dados pedem coleta e bancada.",
  },
  {
    question: "Vocês atendem mais de um equipamento na mesma visita?",
    answer:
      "Sim. Informe na triagem a quantidade de máquinas e o problema de cada uma, porque isso define o tempo previsto e o escopo do atendimento, combinados antes do agendamento.",
  },
  {
    question: "Equipamento muito antigo ainda vale a pena consertar?",
    answer:
      "Nem sempre. Quando o custo do reparo se aproxima do valor de um equipamento equivalente, orientamos a substituição. Essa análise faz parte do diagnóstico e está detalhada na página sobre quando não compensa reparar.",
  },
];

const EquipamentosAtendidos = () => {
  useEffect(() => {
    trackPageView(PATH, "Equipamentos Atendidos");
  }, []);

  useJsonLdSlot(
    SCHEMA_SLOTS.webPage,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl(PATH)}#webpage`,
      name: "Equipamentos atendidos pela assistência técnica de informática",
      description: DESCRIPTION,
      url: absoluteUrl(PATH),
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      publisher: { "@id": `${absoluteUrl("/")}#organization` },
    },
    SLOT_PRIORITY.page,
  );

  const whatsappUrl = whatsappLink("Olá! Preciso de assistência técnica para o meu equipamento de informática.");
  const handleCTA = (label: string) => trackCTAClick("whatsapp", `equipamentos-${label}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Equipamentos Atendidos", path: PATH },
        ]}
      />
      <JsonLdSchema />
      <Header />
      <Breadcrumbs items={[{ label: "Equipamentos Atendidos" }]} />

      <main>
        <section className="relative hero-gradient pt-10 pb-10 md:pt-12 md:pb-12">
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Equipamentos atendidos em Curitiba e região
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Este é o mapa do que realmente atendemos em informática: notebooks, desktops, PC gamer, All in One,
                estações de trabalho, redes, armazenamento e o posto de home office. Para cada categoria, os problemas
                mais comuns, o serviço correspondente, a modalidade provável e o limite honesto do que é possível.
              </p>
              <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("hero")}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Falar sobre o meu equipamento
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-0 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto -mt-8 relative z-20">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img decoding="async" src={IMAGES.ferramentas} alt={IMAGES.ferramentasAlt} className="w-full h-48 md:h-64 object-cover" loading="eager" width="800" height="400" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="mb-3 text-2xl md:text-3xl font-bold text-foreground">Como usar esta página</h2>
              <p className="mb-3 text-muted-foreground leading-relaxed">
                Cada bloco abaixo funciona como uma porta de entrada: você identifica o seu equipamento, confere se o
                sintoma aparece na lista de problemas comuns e segue para a página do serviço que executa o reparo. A
                indicação de modalidade evita a frustração mais comum da assistência técnica — marcar uma visita para
                um problema que só se resolve em bancada, ou levar o equipamento para algo que se resolveria remotamente.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Os limites declarados em cada categoria não são ressalva burocrática: são o resultado real da avaliação
                técnica. Peça sem reposição, mídia com dano severo e equipamento fora da nossa capacidade operacional
                são informados antes, e não depois do serviço iniciado.
              </p>
            </div>
          </div>
        </section>

        {equipamentos.map((eq, i) => {
          const Icon = eq.icon;
          return (
            <section key={eq.nome} className={`py-8 md:py-10 ${i % 2 === 0 ? "bg-secondary" : "bg-background"}`}>
              <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary rounded-xl p-3">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-primary">{eq.nome}</h2>
                      <p className="text-muted-foreground">{eq.desc}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-foreground mb-3">Problemas mais comuns</h3>
                      <ul className="space-y-2">
                        {eq.problemas.map((s) => (
                          <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Modalidade provável</h3>
                        <p className="text-sm text-muted-foreground">{eq.modalidade}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Limitações</h3>
                        <p className="text-sm text-muted-foreground">{eq.limite}</p>
                      </div>
                      <Link
                        to={eq.servico.to}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                      >
                        {eq.servico.label} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* Matriz equipamento × modalidade */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-3 text-2xl md:text-3xl font-bold text-foreground">
                Matriz: qual modalidade cada situação exige
              </h2>
              <p className="mb-6 text-muted-foreground">
                A tabela abaixo mostra o encaminhamento mais comum por tipo de equipamento e sintoma. É uma
                orientação inicial: a modalidade final é confirmada na triagem, depois que você descreve o caso.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border bg-background">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <caption className="sr-only">
                    Modalidade de atendimento indicada por equipamento e situação
                  </caption>
                  <thead>
                    <tr className="border-b border-border bg-secondary/60">
                      <th scope="col" className="p-3 font-bold text-foreground">Equipamento</th>
                      <th scope="col" className="p-3 font-bold text-foreground">Situação</th>
                      <th scope="col" className="p-3 font-bold text-foreground">Modalidade indicada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Notebook", "Lentidão, sistema travando, programa ou e-mail", "Remoto"],
                      ["Notebook", "Bateria, teclado, dobradiça, superaquecimento", "Coleta e entrega"],
                      ["Desktop", "Sistema corrompido, vírus, configuração", "Remoto ou domicílio"],
                      ["Desktop", "Não liga, reinicia sozinho, ruído e poeira", "Domicílio ou coleta"],
                      ["PC gamer / workstation", "Queda de desempenho sob carga, temperatura", "Domicílio (avaliação) e coleta se houver peça"],
                      ["All in One", "Qualquer falha física", "Coleta e entrega"],
                      ["Rede e Wi-Fi", "Sinal fraco, canal, roteador e repetidor", "Domicílio"],
                      ["Rede e Wi-Fi", "Configuração de senha, rede de visitantes, impressora", "Remoto"],
                      ["Armazenamento", "Disco lento, troca por SSD, clonagem", "Domicílio ou coleta"],
                      ["Armazenamento", "Disco não reconhecido, ruído, arquivos perdidos", "Coleta com avaliação prévia"],
                      ["Posto de home office", "Monitor extra, dock, headset, webcam, impressora", "Remoto ou domicílio"],
                      ["Avaliação especial", "Dano por líquido, bloqueio de conta, sinal de queima", "Coleta com avaliação antes de qualquer previsão"],
                    ].map(([eq, sit, mod]) => (
                      <tr key={`${eq}-${sit}`} className="border-b border-border last:border-0">
                        <th scope="row" className="p-3 font-semibold text-foreground">{eq}</th>
                        <td className="p-3 text-muted-foreground">{sit}</td>
                        <td className="p-3 text-muted-foreground">{mod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Situações com peça, teste prolongado ou risco para os dados sempre passam por bancada. Entenda o
                método na página de{" "}
                <Link to="/diagnostico-tecnico" className="font-semibold text-accent hover:underline">
                  diagnóstico técnico
                </Link>{" "}
                e as condições em{" "}
                <Link to="/precos-e-politicas" className="font-semibold text-accent hover:underline">
                  preços e políticas
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-2xl md:text-3xl font-bold text-foreground">Equipamentos sujeitos a avaliação</h2>
              <p className="mb-4 text-muted-foreground">
                Alguns casos não têm resposta antes do teste: MacBook, equipamento com histórico de dano por líquido,
                máquina com bloqueio de conta do fabricante, placa com sinal de queima e mídias de armazenamento com
                falha física. Nessas situações, a avaliação vem primeiro e o encaminhamento é decidido depois — inclusive
                a indicação de assistência especializada quando for o caminho correto.
              </p>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground">
                  <Ban className="h-5 w-5 text-destructive" /> O que não faz parte do escopo
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {foraDoEscopo.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-5 text-2xl md:text-3xl font-bold text-foreground">Modalidades de atendimento</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Link to="/atendimento-remoto" className="rounded-xl bg-background p-5 transition-colors hover:ring-1 hover:ring-accent">
                  <h3 className="mb-1 font-bold text-foreground">Atendimento remoto</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema, programas, e-mail, configurações e orientação, com autorização e acompanhamento na tela.
                  </p>
                </Link>
                <Link to="/atendimento-domicilio" className="rounded-xl bg-background p-5 transition-colors hover:ring-1 hover:ring-accent">
                  <h3 className="mb-1 font-bold text-foreground">Atendimento em domicílio</h3>
                  <p className="text-sm text-muted-foreground">
                    Verificação e execução no seu endereço, indicada para rede, instalação e avaliação inicial.
                  </p>
                </Link>
                <Link to="/coleta-e-entrega" className="rounded-xl bg-background p-5 transition-colors hover:ring-1 hover:ring-accent">
                  <h3 className="mb-1 font-bold text-foreground">Coleta e entrega</h3>
                  <p className="text-sm text-muted-foreground">
                    Para falha física, troca de peça e testes prolongados que exigem bancada e ambiente controlado.
                  </p>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Ainda em dúvida? O{" "}
                <Link to="/diagnostico-tecnico" className="font-semibold text-accent hover:underline">
                  diagnóstico técnico
                </Link>{" "}
                explica como a causa é confirmada, e{" "}
                <Link to="/quando-nao-compensa" className="font-semibold text-accent hover:underline">
                  quando não compensa reparar
                </Link>{" "}
                ajuda na decisão entre consertar e substituir.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-2xl md:text-3xl font-bold text-foreground">
                Perguntas frequentes sobre equipamentos atendidos
              </h2>
              <div className="space-y-4">
                {faqs.map((f) => (
                  <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="mb-2 font-bold text-foreground">{f.question}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-20 bg-primary">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Seu equipamento precisa de atenção?</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Descreva o equipamento e o sintoma na triagem. Indicamos a modalidade certa antes de qualquer agendamento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("cta-final")}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
                </a>
              </Button>
              <Button variant="heroCta" size="lg" asChild>
                <Link to="/servicos">
                  Ver Serviços <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default EquipamentosAtendidos;
