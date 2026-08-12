import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, Droplets } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ServicosCorrelatos } from "@/components/informatica/ServicosCorrelatos";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const PATH = "/problemas/notebook-molhado";
const TITLE = "Notebook Molhado? O Que Fazer nas Primeiras Horas | Curitiba";
const DESCRIPTION =
  "Derramou líquido no notebook? Entenda por que ligar o aparelho piora o quadro, o que fazer nas primeiras horas, como funciona a limpeza de placa e em que casos o reparo deixa de compensar. Coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre notebook molhado. Derramei líquido no meu notebook e preciso de orientação urgente.";

const SINTOMAS = [
  {
    titulo: "Desligou na hora e não liga mais",
    desc: "O líquido criou caminho entre pontos de tensão e a proteção cortou a alimentação. É o cenário com melhor prognóstico quando o aparelho não é religado antes da limpeza.",
  },
  {
    titulo: "Continua funcionando normalmente",
    desc: "O quadro mais enganoso de todos. A corrosão avança por dias em silêncio e a falha aparece semanas depois, quando o dano já se espalhou pela placa.",
  },
  {
    titulo: "Teclas repetindo ou travadas",
    desc: "Resíduo açucarado entre as membranas do teclado gera repetição, tecla presa ou digitação fantasma. Nem sempre significa dano na placa principal.",
  },
  {
    titulo: "Liga, mas desliga sozinho depois de minutos",
    desc: "Comportamento típico de trilha com fuga de corrente: o circuito aquece o ponto afetado e a proteção atua. Quanto mais tentativas, maior o dano acumulado.",
  },
  {
    titulo: "Carregador não é mais reconhecido",
    desc: "A etapa de entrada de energia costuma ser a primeira a sofrer, porque concentra as tensões mais altas da placa e fica próxima às laterais do aparelho.",
  },
  {
    titulo: "Cheiro adocicado ou marcas esbranquiçadas",
    desc: "Indicam resíduo remanescente e oxidação em curso. É sinal de que existe material ativo sobre a placa mesmo com o aparelho aparentemente seco.",
  },
];

const CAUSAS = [
  "Curto momentâneo entre pontos de tensão no instante do contato com o líquido",
  "Oxidação progressiva de trilhas e terminais nas horas seguintes",
  "Resíduo condutivo de bebidas açucaradas, que continua atuando depois de seco",
  "Corrosão nos conectores do teclado, do trackpad e da tela",
  "Dano na etapa de entrada de energia e no circuito de carga",
  "Infiltração para o teclado, com teclas presas ou repetição",
  "Contato do líquido com a bateria, exigindo avaliação antes de qualquer religamento",
  "Tentativas de ligar o aparelho ainda úmido, que transformam oxidação em queima definitiva",
];

const VERIFICACOES = [
  "Desligar imediatamente pressionando o botão de energia até apagar — não usar o desligamento pelo sistema.",
  "Retirar o carregador da tomada e, em seguida, do aparelho.",
  "Virar o notebook com a tela entreaberta, apoiado como uma barraca, para o líquido escorrer para fora.",
  "Não tentar ligar para 'ver se funciona': cada tentativa aumenta o dano.",
  "Não usar secador quente, que espalha o líquido e derrete peças plásticas internas.",
  "Não colocar em arroz: não remove líquido de dentro da placa e ainda deixa resíduo nas aberturas.",
  "Anotar o que foi derramado, a quantidade aproximada e o horário — água, café, refrigerante e cerveja têm agressividades diferentes.",
  "Acionar a coleta o quanto antes: as primeiras horas mudam o resultado mais do que qualquer outra variável.",
];

const OPCOES = [
  {
    titulo: "Limpeza técnica de placa",
    desc: "Desmontagem completa, remoção de resíduo com solução apropriada, banho controlado e secagem em estufa. Feito cedo, é o procedimento que mais recupera aparelhos e o de menor custo entre os cenários.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Reparo em nível de componente",
    desc: "Quando a oxidação já comprometeu trilhas ou componentes, o trabalho passa para microssolda: medição ponto a ponto, reconstrução de trilha e substituição das peças afetadas, com registro do que foi feito.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Substituição de teclado ou conectores",
    desc: "Casos em que a placa está íntegra e o dano ficou restrito ao teclado, ao trackpad ou aos conectores internos. É a intervenção mais simples e a de prazo mais curto.",
    to: "/servicos/manutencao-de-notebook",
    label: "Reparo de teclado",
  },
  {
    titulo: "Recuperação de arquivos antes de decidir",
    desc: "Se o aparelho não voltar, os dados normalmente voltam. A unidade de armazenamento costuma sobreviver ao líquido e pode ser lida separadamente, com a cópia entregue em mídia à parte.",
    to: "/servicos/recuperacao-de-dados",
    label: "Recuperação de dados",
  },
];

const FAQS = [
  {
    question: "Derramei líquido e o notebook continua ligando. Preciso fazer alguma coisa?",
    answer:
      "Precisa, e com urgência maior do que parece. O aparelho que sobrevive ao primeiro momento é o que mais chega com dano irreversível semanas depois, porque a oxidação avança silenciosamente entre os contatos enquanto tudo aparenta normalidade. O procedimento correto é desligar, não religar e encaminhar para limpeza de placa — mesmo funcionando. Limpeza feita cedo custa uma fração de um reparo em placa oxidada.",
  },
  {
    question: "Colocar no arroz funciona?",
    answer:
      "Não. O arroz não alcança o líquido que está entre a placa e os componentes, não neutraliza o resíduo condutivo de bebidas açucaradas e ainda deixa pó e amido nas aberturas de ventilação. A crença é popular porque muitos aparelhos voltam a ligar sozinhos depois de alguns dias — e voltam mesmo, com a oxidação já instalada, falhando pouco tempo depois.",
  },
  {
    question: "Quanto tempo eu tenho para agir?",
    answer:
      "Não há um prazo exato, mas a diferença entre encaminhar no mesmo dia e esperar uma semana costuma ser a diferença entre limpeza e microssolda. Água limpa é a mais tolerante; café, refrigerante, cerveja e sucos deixam resíduo ácido ou açucarado que segue corroendo depois de seco. Quanto mais cedo a placa é limpa, maior a chance de recuperação integral e menor o custo.",
  },
  {
    question: "Vocês conseguem dizer o valor pelo WhatsApp?",
    answer:
      "Damos a faixa provável a partir do que você descreve, mas o valor fechado sai depois da abertura, porque só a inspeção mostra a extensão da oxidação. O que garantimos é que nada é executado sem sua aprovação: você recebe diagnóstico, valor e prazo antes, e decide. Se o quadro for ruim, dizemos isso com clareza em vez de começar um reparo com baixa chance.",
  },
  {
    question: "Como o aparelho chega até vocês?",
    answer:
      "Por coleta no endereço informado — não existe atendimento presencial em balcão. Você aciona pelo WhatsApp, combinamos a retirada, o notebook é avaliado em bancada e depois devolvido no mesmo endereço. Para casos de líquido, orientamos o transporte com o aparelho desligado e com a tela entreaberta, sem carregador conectado.",
  },
  {
    question: "Meus arquivos ficam perdidos se a placa não tiver conserto?",
    answer:
      "Na maioria dos casos, não. O armazenamento fica em módulo separado da área que costuma sofrer com o líquido e normalmente é lido sem dificuldade em outro equipamento. Fazemos a cópia dos seus arquivos e entregamos em mídia à parte, o que permite decidir sobre o reparo com calma, sem o peso de perder documentos e fotos.",
  },
  {
    question: "Qual é a garantia em reparo de aparelho que sofreu líquido?",
    answer:
      "90 dias sobre a mão de obra e sobre as peças aplicadas, escopados ao que foi reparado. Em equipamento que recebeu líquido, a garantia não se estende a falhas futuras em blocos que estavam funcionando na entrega: a corrosão pode ter atingido pontos que só se manifestam depois. Explicamos essa limitação antes do serviço, por escrito, e não vendemos garantia total onde ela não existe.",
  },
  {
    question: "Em que situação vocês recusam o reparo?",
    answer:
      "Quando a inspeção mostra corrosão extensa em áreas críticas da placa, com custo de recuperação próximo ou superior ao valor de um aparelho equivalente. Nesses casos entregamos laudo com foto do estado interno, oferecemos a recuperação dos arquivos e devolvemos o equipamento. Não iniciamos reparo improvável apenas para faturar a tentativa.",
  },
];

const NotebookMolhado = () => {
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
      name: "Notebook molhado: o que fazer nas primeiras horas",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-notebook-molhado-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Notebook molhado" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Notebook molhado: o que fazer nas primeiras horas
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Em aparelho que recebeu líquido, o que decide o desfecho não é a sorte: é o que acontece nas primeiras
            horas. Ligar para testar, secar com secador quente e esperar "porque voltou a funcionar" são as três
            atitudes que transformam uma limpeza simples em reparo de placa. Esta página descreve a sequência correta,
            o que cada sintoma indica e quando o conserto deixa de compensar.
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
        secondaryImageKey="microsoldagem"
        layout="duo"
        caption="Notebook aberto em bancada para limpeza técnica após contato com líquido"
        secondaryCaption="Reparo em nível de componente quando a oxidação já atingiu trilhas da placa"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "primeiras-horas", label: "As primeiras horas" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "O que o líquido provoca" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="primeiras-horas" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Por que as primeiras horas decidem o resultado</h2>
          <p className="mb-3 text-muted-foreground">
            O dano de líquido acontece em duas etapas independentes. A primeira é elétrica e imediata: o líquido cria
            caminho entre pontos com tensões diferentes e algo queima ou entra em proteção. Essa etapa termina em
            segundos e, quando o aparelho desliga sozinho, muitas vezes a proteção fez exatamente o trabalho dela.
          </p>
          <p className="mb-3 text-muted-foreground">
            A segunda é química e lenta: o resíduo que ficou sobre a placa continua reagindo com o cobre das trilhas e
            com os terminais dos componentes por dias. É essa etapa que separa o aparelho recuperado com limpeza do
            aparelho que chega semanas depois exigindo microssolda. Refrigerante, café com açúcar e cerveja aceleram
            muito esse processo em relação à água.
          </p>
          <p className="text-muted-foreground">
            Por isso a orientação é a mesma para quem teve o notebook desligado e para quem seguiu usando: desligar,
            não religar e encaminhar para limpeza. O procedimento e os prazos estão descritos em{" "}
            <Link to="/servicos/manutencao-de-notebook" className="font-medium text-accent hover:underline">
              manutenção de notebook
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">O que o líquido provoca por dentro</h2>
          <p className="mb-4 text-muted-foreground">
            Os efeitos abaixo aparecem, em combinações diferentes, na maior parte dos aparelhos que recebemos com
            histórico de líquido. Nenhum é confirmado por descrição: a inspeção interna é que mostra a extensão real.
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
            <Droplets className="h-6 w-6 text-accent" /> Sequência correta logo depois do acidente
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os quatro primeiros passos valem para qualquer líquido e não exigem ferramenta nenhuma.
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
            O que não recomendamos, em nenhuma hipótese: religar para verificar se funciona, conectar o carregador
            enquanto houver suspeita de umidade e desmontar sem ferramenta adequada — parafuso perdido e flat rompido
            somam custo ao problema que já existe.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">O que resolve cada cenário</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {OPCOES.map((o) => (
              <div key={o.titulo} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{o.titulo}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{o.desc}</p>
                <Link to={o.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                  {o.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-accent/30 bg-accent/5 p-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Critérios objetivos antes de você decidir</h2>
          <p className="mb-5 text-muted-foreground">
            Valem para todo aparelho com histórico de líquido, da triagem à entrega, e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. Coletamos no endereço informado e devolvemos no mesmo
                endereço, com o aparelho embalado para transporte.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Prognóstico honesto</h3>
              <p className="text-sm text-muted-foreground">
                Em caso de líquido não prometemos recuperação: informamos a chance real depois da inspeção e
                recusamos reparo improvável, com laudo e foto do estado interno.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia escopada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre a mão de obra e as peças aplicadas, limitados ao bloco reparado. Falhas futuras
                decorrentes da corrosão em outras áreas não estão cobertas, e isso é dito antes.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: recuperação garantida de placa com corrosão extensa, prazo fixo antes da inspeção
            interna e cobertura sobre áreas que o líquido atingiu mas ainda não se manifestaram.
          </p>
        </section>

        <ServicosCorrelatos
          itens={[
            {
              to: "/servicos/manutencao-de-notebook",
              titulo: "Manutenção de notebook",
              desc: "Limpeza técnica de placa, secagem controlada, troca de teclado e reparo de conectores internos.",
            },
            {
              to: "/servicos/conserto-placa",
              titulo: "Conserto de placa",
              desc: "Microssolda e reconstrução de trilha quando a oxidação já comprometeu o circuito.",
            },
            {
              to: "/servicos/recuperacao-de-dados",
              titulo: "Recuperação de dados",
              desc: "Cópia dos seus arquivos em mídia à parte, mesmo quando o aparelho não volta a funcionar.",
            },
            {
              to: "/como-funciona",
              titulo: "Como funciona o atendimento",
              desc: "Da triagem pelo WhatsApp até a coleta e a entrega, com as etapas descritas antes de começar.",
            },
          ]}
        />

        <section id="faq" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Perguntas frequentes</h2>
          <div className="space-y-5">
            {FAQS.map((f) => (
              <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{f.question}</h3>
                <p className="text-sm text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Conte o que aconteceu com o seu notebook</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o líquido derramado, a quantidade aproximada, há quanto tempo aconteceu e se o aparelho chegou a
            ser ligado depois. Esses quatro dados mudam a orientação e a urgência da coleta.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotebookMolhado;
