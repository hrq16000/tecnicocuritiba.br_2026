import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, PowerOff, MessageCircle } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const PATH = "/problemas/notebook-desligando-sozinho";
const TITLE = "Notebook Desligando Sozinho: Causas | Curitiba";
const DESCRIPTION =
  "Notebook desligando sozinho do nada, só em jogos ou quando tira da tomada? Veja como separar superaquecimento, bateria em fim de vida, carregador fraco e falha de placa antes de gastar, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre notebook desligando sozinho. Meu notebook está desligando do nada e quero avaliação.";

const SINTOMAS = [
  {
    titulo: "Desliga depois de alguns minutos ligado",
    desc: "Desligamento por tempo de uso é a assinatura clássica de superaquecimento: a proteção térmica corta a energia antes que o processador se danifique.",
  },
  {
    titulo: "Desliga só em jogos ou programas pesados",
    desc: "Sob carga, o consumo sobe. Temperatura alta, pasta térmica ressecada ou carregador subdimensionado aparecem exatamente nesse momento.",
  },
  {
    titulo: "Desliga ao tirar da tomada",
    desc: "Aqui não é falha misteriosa: a bateria perdeu capacidade e não sustenta o aparelho sozinha, mesmo mostrando percentual alto no sistema.",
  },
  {
    titulo: "Desliga com estalo ou cheiro",
    desc: "Estalo, cheiro de queimado ou fumaça exigem desligar e não religar. Insistir nesse cenário costuma transformar reparo pontual em troca de placa.",
  },
  {
    titulo: "Desliga em qualquer situação, sem padrão",
    desc: "Sem padrão claro, entram na lista placa de energia instável, conector de alimentação com mau contato e carregador com defeito intermitente.",
  },
  {
    titulo: "Desliga e demora para religar",
    desc: "A espera obrigatória antes de voltar a ligar é indício forte de proteção térmica atuando: o aparelho só aceita ligar depois de esfriar.",
  },
];

const CAUSAS = [
  "Dissipador obstruído por poeira, bloqueando a saída de ar quente",
  "Pasta térmica ressecada, sem transferir calor do processador para o dissipador",
  "Cooler travado, com rolamento gasto ou girando abaixo da rotação correta",
  "Bateria em fim de vida útil, sem sustentar o consumo fora da tomada",
  "Carregador com potência menor que a exigida pelo modelo",
  "Conector de alimentação com mau contato ou solda fria",
  "Circuito de energia da placa-mãe instável sob carga",
  "Uso apoiado em cama, sofá ou almofada, obstruindo as entradas de ar",
];

const VERIFICACOES = [
  "Anote em que situação desliga: minutos após ligar, só em jogos, só na bateria ou sem padrão. Esse dado orienta todo o diagnóstico.",
  "Encoste a mão na saída de ar: fluxo fraco ou ar frio com o aparelho quente indica dissipador obstruído ou cooler parado.",
  "Use o notebook sobre superfície rígida e plana por um dia. Se o problema reduz, a origem é térmica.",
  "Teste com o carregador conectado e a bateria removida quando o modelo permitir: isolar a bateria responde metade das dúvidas.",
  "Confira se o carregador é o original ou tem a mesma potência indicada na etiqueta do aparelho.",
  "Observe a temperatura sob carga com um monitor de sistema antes do desligamento.",
  "Ouça o notebook: cooler silencioso demais em um aparelho quente é sinal de ventoinha parada.",
  "Se houver estalo, cheiro de queimado ou marca de aquecimento no carregador, pare de usar e peça avaliação.",
];

const OPCOES = [
  {
    titulo: "Limpeza interna e troca de pasta térmica",
    desc: "Resolve a maior parte dos desligamentos por temperatura. Inclui limpeza do dissipador, revisão do cooler e teste de temperatura sob carga depois do serviço.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Avaliação de bateria e carregador",
    desc: "Quando o desligamento acontece fora da tomada, medimos a capacidade real da bateria e a entrega do carregador antes de indicar qualquer troca.",
    to: "/problemas/notebook-nao-carrega-bateria",
    label: "Notebook não carrega",
  },
  {
    titulo: "Reparo do circuito de energia",
    desc: "Conector com mau contato e falha no circuito de alimentação são serviços de bancada com microssolda, sujeitos à viabilidade avaliada caso a caso.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Comparativo com o notebook que não liga",
    desc: "Se o aparelho chegou ao ponto de não voltar mais, o roteiro muda. A página de notebook que não liga cobre esse cenário em detalhe.",
    to: "/problemas/notebook-nao-liga",
    label: "Notebook não liga",
  },
];

const FAQS = [
  {
    question: "Notebook desligando sozinho é sempre superaquecimento?",
    answer:
      "Não, mas é a causa mais frequente. Superaquecimento tem uma assinatura reconhecível: o aparelho desliga depois de alguns minutos de uso ou sob carga, e às vezes precisa esfriar antes de aceitar ligar de novo. Quando o desligamento acontece de forma aleatória, mesmo com o aparelho frio, a investigação passa para bateria, carregador e circuito de energia da placa.",
  },
  {
    question: "Desliga só quando tiro da tomada. É a bateria?",
    answer:
      "Na prática, quase sempre sim. Bateria em fim de vida perde capacidade real de entrega mesmo continuando a exibir percentual alto no sistema, porque o indicador se baseia em tensão e não em autonomia efetiva. Medimos a capacidade real antes de indicar a troca — não trocamos bateria por suposição.",
  },
  {
    question: "Limpeza resolve mesmo ou é só paliativo?",
    answer:
      "Quando a causa é térmica, limpeza com troca de pasta térmica resolve de fato, e o resultado é verificável: medimos a temperatura sob carga depois do serviço e mostramos o número. O que não resolve é limpeza superficial com ar comprimido pelas grades, que costuma empurrar a poeira ainda mais para dentro do dissipador.",
  },
  {
    question: "Posso continuar usando enquanto não conserto?",
    answer:
      "Em caso de desligamento térmico, o uso continuado acelera o desgaste do processador e do próprio cooler, então não recomendamos. Já em caso de estalo, cheiro de queimado ou aquecimento anormal no carregador, a orientação é parar imediatamente: nesses cenários o risco deixa de ser só o aparelho.",
  },
  {
    question: "Comprei um carregador genérico. Pode ser a causa?",
    answer:
      "Pode, e vemos isso com frequência. Carregador com potência abaixo da exigida pelo modelo dá conta do consumo em repouso, mas não sustenta o aparelho sob carga, provocando desligamento justo nos momentos de uso pesado. Confira a etiqueta do notebook e compare com a saída indicada no carregador.",
  },
  {
    question: "Vale a pena consertar ou é melhor trocar de notebook?",
    answer:
      "Limpeza, pasta térmica e bateria costumam custar muito abaixo do valor de um aparelho novo e devolvem anos de uso. Reparo de circuito de energia exige uma conta mais cuidadosa, feita em cima do estado geral do equipamento. Damos o cenário real e o valor antes de qualquer serviço, com mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada.",
  },
  {
    question: "Preciso levar o notebook até vocês?",
    answer:
      "Não temos balcão de atendimento ao público. Fazemos coleta e devolução no endereço informado, e a coleta é gratuita nos serviços acima de uma hora de bancada. As condições completas estão descritas na página de preços e políticas.",
  },
];

const NotebookDesligandoSozinho = () => {
  const waHref = whatsappLink(WA_MESSAGE);

  useEffect(() => {
    trackPageView(PATH, TITLE);
  }, []);

  useJsonLdSlot(
    SCHEMA_SLOTS.webPage,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl(PATH)}#webpage`,
      name: "Notebook desligando sozinho: temperatura, bateria, carregador ou placa",
      description: DESCRIPTION,
      url: absoluteUrl(PATH),
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      publisher: { "@id": `${absoluteUrl("/")}#organization` },
    },
    SLOT_PRIORITY.page,
  );

  useJsonLdSlot(
    SCHEMA_SLOTS.faq,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${absoluteUrl(PATH)}#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    SLOT_PRIORITY.page,
  );

  const cta = (location: string) => () =>
    trackCTAClick("whatsapp", `problema-notebook-desligando-sozinho-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Notebook desligando sozinho" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Notebook desligando sozinho: temperatura, bateria, carregador ou placa
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            O momento em que o notebook desliga é o dado mais valioso do diagnóstico. Esta página mostra como usá-lo
            para separar problema térmico de bateria e de falha elétrica.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="problema_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </div>
      </section>

      <TrustStrip />

      <RealImageSection
        imageKey="notebookReparo"
        secondaryImageKey="bancadaTecnica"
        layout="duo"
        caption="Notebook aberto para limpeza do dissipador e troca de pasta térmica"
        secondaryCaption="Bancada onde medimos temperatura sob carga antes e depois do serviço"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "quando-desliga", label: "Quando ele desliga" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="quando-desliga" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">O momento do desligamento resolve metade do caso</h2>
          <p className="mb-3 text-muted-foreground">
            Um notebook que desliga sozinho não emite mensagem de erro, mas entrega o padrão. Desligar sempre depois de
            alguns minutos aponta para temperatura. Desligar apenas fora da tomada aponta para bateria. Desligar sem
            padrão nenhum aponta para carregador ou circuito de energia.
          </p>
          <p className="mb-3 text-muted-foreground">
            Essa separação evita o erro mais caro dessa categoria: trocar bateria em um aparelho que na verdade estava
            superaquecendo, ou pagar limpeza em um aparelho cuja bateria já não sustenta carga.
          </p>
          <p className="text-muted-foreground">
            Se o notebook esquenta muito mas ainda não desliga, veja{" "}
            <Link to="/problemas/notebook-superaquecendo" className="font-medium text-accent hover:underline">
              notebook superaquecendo
            </Link>
            . Se ele parou de ligar completamente, comece por{" "}
            <Link to="/problemas/notebook-nao-liga" className="font-medium text-accent hover:underline">
              notebook não liga
            </Link>
            .
          </p>
        </section>

        <section id="sintomas" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Sintomas e o que cada um costuma indicar</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SINTOMAS.map((s) => (
              <div key={s.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{s.titulo}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="causas" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Causas mais comuns nos casos que recebemos</h2>
          <p className="mb-4 text-muted-foreground">
            Poeira acumulada e pasta térmica ressecada lideram com folga em aparelhos com mais de dois anos de uso.
            Bateria degradada vem em seguida, e carregador incompatível aparece com frequência em quem substituiu a
            fonte original por uma genérica.
          </p>
          <ul className="grid gap-2 md:grid-cols-2">
            {CAUSAS.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <PowerOff className="h-6 w-6 text-accent" /> Verificações gratuitas antes de qualquer orçamento
          </h2>
          <p className="mb-4 text-muted-foreground">
            Faça na ordem. Nenhum desses passos exige abrir o aparelho e todos ajudam a chegar com informação útil no
            atendimento.
          </p>
          <ol className="space-y-2">
            {VERIFICACOES.map((t, i) => (
              <li key={t} className="flex gap-3 text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            O que não recomendamos: soprar ar comprimido pelas grades, apoiar o notebook em base improvisada com o
            cooler bloqueado e continuar usando após cheiro de queimado.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">O que resolve cada cenário</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {OPCOES.map((o) => (
              <div key={o.titulo} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{o.titulo}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{o.desc}</p>
                <Link
                  to={o.to}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  {o.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-accent/30 bg-accent/5 p-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Critérios objetivos antes de você decidir</h2>
          <p className="mb-5 text-muted-foreground">
            As condições completas de atendimento estão em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Medição, não suposição</h3>
              <p className="text-sm text-muted-foreground">
                Temperatura sob carga e capacidade real de bateria são medidas antes de indicar serviço, e o número é
                informado a você.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Valor aprovado antes</h3>
              <p className="text-sm text-muted-foreground">
                Serviços de bancada têm mínimo pré-aprovado de R$ 299,99. Nada é executado sem sua confirmação do
                valor e do escopo.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e garantia</h3>
              <p className="text-sm text-muted-foreground">
                Sem balcão: retirada e devolução no endereço informado. Garantia de 90 dias sobre mão de obra e peça
                aplicada, limitada ao serviço executado.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: prazo fechado antes de conhecer o aparelho, sobrevida garantida de bateria antiga e
            reparo viável em placa com dano extenso por líquido.
          </p>
        </section>

        <section id="faq" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Perguntas frequentes</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{f.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Diga em que momento ele desliga</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo e se o desligamento acontece por tempo de uso, sob carga ou só fora da tomada. Com isso já
            indicamos o caminho mais provável.
          </p>
          <Button asChild size="lg" variant="secondary" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar sobre meu caso
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotebookDesligandoSozinho;
