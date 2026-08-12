import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Gauge, MessageCircle } from "lucide-react";
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

const PATH = "/problemas/notebook-lento";
const TITLE = "Notebook Lento: Causas Reais e Solução | Curitiba";
const DESCRIPTION =
  "Notebook demorando para ligar, travando ao abrir programas ou lento só na bateria? Veja como separar disco mecânico, memória insuficiente, calor e software antes de trocar de aparelho, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre notebook lento. Meu notebook está demorando para responder e quero avaliação do que está travando.";

const SINTOMAS = [
  {
    titulo: "Demora vários minutos para chegar na área de trabalho",
    desc: "Inicialização longa com o disco em uso constante é a assinatura do HD mecânico. Nesse cenário, nenhuma limpeza de software devolve velocidade: o gargalo é físico e mecânico.",
  },
  {
    titulo: "Trava ao abrir a segunda ou terceira janela",
    desc: "Lentidão que aparece só com vários programas abertos aponta para memória insuficiente. O sistema passa a usar o disco como memória, e tudo desacelera de uma vez.",
  },
  {
    titulo: "Fica lento depois de meia hora ligado",
    desc: "Queda de desempenho com o aparelho quente é proteção térmica reduzindo a frequência do processador. A causa costuma ser dissipador obstruído e pasta térmica ressecada, não software.",
  },
  {
    titulo: "Rápido na tomada e lento na bateria",
    desc: "Diferença entre tomada e bateria é plano de energia em modo econômico ou bateria degradada limitando o consumo do processador. É um dos poucos casos com solução imediata e gratuita.",
  },
  {
    titulo: "Cursor engasgando e cliques com atraso",
    desc: "Travamentos curtos e repetidos sugerem disco com setores em falha ou processo em segundo plano consumindo tudo. Um leva a backup urgente, o outro a ajuste de sistema.",
  },
  {
    titulo: "Navegador consome tudo sozinho",
    desc: "Extensões acumuladas, muitas abas e programas iniciando junto com o sistema derrubam o desempenho de máquinas que continuam saudáveis por dentro.",
  },
];

const CAUSAS = [
  "Disco rígido mecânico como unidade principal do sistema",
  "Memória RAM insuficiente para o uso real (navegador, planilhas e videochamada ao mesmo tempo)",
  "Dissipador obstruído por poeira e pasta térmica ressecada causando redução de frequência",
  "Disco de armazenamento quase cheio, sem espaço para arquivos temporários",
  "Excesso de programas iniciando junto com o sistema",
  "Extensões e barras de ferramentas acumuladas no navegador",
  "Setores defeituosos no disco provocando releituras constantes",
  "Plano de energia em modo econômico ou bateria degradada limitando o processador",
];

const VERIFICACOES = [
  "Abra o gerenciador de tarefas e observe qual recurso fica em 100%: disco, memória, processador ou rede.",
  "Confira o espaço livre do disco do sistema; abaixo de 10% a lentidão é esperada e piora com o tempo.",
  "Desative o que inicia junto com o sistema e mantenha apenas o que você realmente usa todo dia.",
  "Remova extensões do navegador que você não reconhece e feche abas que ficam esquecidas em segundo plano.",
  "Ligue o notebook na tomada e verifique se o desempenho muda; se muda, ajuste o plano de energia.",
  "Encoste na saída de ar durante o uso: ar quente com pouca vazão indica dissipador obstruído.",
  "Se o disco fizer estalos ou cliques, pare de usar e priorize backup — isso é falha física em curso.",
  "Não instale otimizadores nem limpadores de registro: eles não resolvem gargalo de hardware e adicionam risco.",
];

const OPCOES = [
  {
    titulo: "Troca para SSD e ampliação de memória",
    desc: "É a mudança que resolve a maior parte dos casos reais. Sai o disco mecânico, entra SSD, e a memória é ajustada ao uso. O ganho é imediato e mensurável no tempo de inicialização e na abertura de programas.",
    to: "/servicos/upgrade-ssd-ram",
    label: "Upgrade de SSD e memória",
  },
  {
    titulo: "Limpeza interna e troca de pasta térmica",
    desc: "Quando a lentidão só aparece com o aparelho quente, o caminho é bancada: dissipador limpo, pasta térmica renovada e teste de temperatura sob carga para confirmar o resultado.",
    to: "/problemas/notebook-superaquecendo",
    label: "Notebook superaquecendo",
  },
  {
    titulo: "Reinstalação limpa do sistema",
    desc: "Sistema com anos de instalações e restos de programas fica lento mesmo em hardware bom. A reinstalação é feita com backup dos seus arquivos antes e restauração depois, nunca no improviso.",
    to: "/servicos/formatacao",
    label: "Formatação com backup",
  },
  {
    titulo: "Verificação de vírus e programas indesejados",
    desc: "Mineradores, adwares e programas instalados por engano consomem processador em segundo plano. A verificação separa isso de gargalo de hardware antes de qualquer indicação de peça.",
    to: "/servicos/remocao-de-virus",
    label: "Remoção de vírus",
  },
];

const FAQS = [
  {
    question: "Meu notebook ficou muito lento. Vale a pena consertar ou é melhor comprar outro?",
    answer:
      "Na maioria dos aparelhos com até seis ou sete anos, a troca do disco mecânico por SSD e o ajuste de memória entregam um salto de desempenho por uma fração do valor de um notebook novo. O que muda a conta é dano de placa, dobradiça arrebentada ou tela comprometida ao mesmo tempo. Quando a soma dos reparos se aproxima do valor de um aparelho equivalente, dizemos isso com o número na mão em vez de empurrar serviço.",
  },
  {
    question: "Trocar por SSD resolve mesmo ou é exagero de técnico?",
    answer:
      "Resolve quando o gargalo é o disco, e isso é verificável antes: se o gerenciador de tarefas mostra o disco em 100% enquanto processador e memória estão folgados, o disco é o limite. Nesse caso o SSD muda a experiência inteira, do tempo de inicialização à abertura de programas. Se o gargalo for memória ou temperatura, SSD sozinho decepciona, e é por isso que a avaliação vem antes da peça.",
  },
  {
    question: "Formatar deixa o notebook rápido de novo?",
    answer:
      "Ajuda quando a causa é software acumulado: programas iniciando junto, restos de instalações e infecção. Não ajuda quando o limite é físico. Notebook com HD mecânico continua lento depois de formatado, porque o disco continua sendo o mesmo. Por isso avaliamos primeiro e evitamos vender formatação como solução universal.",
  },
  {
    question: "Por que ele fica lento só depois de um tempo ligado?",
    answer:
      "Porque o processador reduz a própria frequência para não superaquecer. Isso acontece quando o dissipador está obstruído por poeira e a pasta térmica perdeu eficiência, situação comum em notebooks com mais de dois anos sem limpeza interna. A correção é mecânica, feita em bancada, com teste de temperatura sob carga depois do serviço para comprovar o ganho.",
  },
  {
    question: "Programas otimizadores ajudam?",
    answer:
      "Não recomendamos. Limpadores de registro e aceleradores prometem ganho que não existe, muitas vezes instalam componentes indesejados e, em alguns casos, removem itens necessários ao sistema. Desativar a inicialização automática do que você não usa é gratuito, seguro e entrega mais resultado do que qualquer um desses programas.",
  },
  {
    question: "Perco meus arquivos na troca de disco ou na formatação?",
    answer:
      "Não. O backup dos seus dados é feito antes de qualquer intervenção e a restauração acontece depois, com conferência junto com você. A exceção é o disco já em falha física: quando há estalos ou setores ilegíveis, parte dos dados pode não ser recuperável, e isso é informado antes de começar, sem promessa que não se possa cumprir.",
  },
  {
    question: "Preciso levar o notebook até vocês?",
    answer:
      "Não temos balcão de atendimento ao público. Casos de software e configuração costumam ser resolvidos por acesso remoto. Quando o serviço envolve troca de disco, memória ou limpeza interna, retiramos o aparelho no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado, com 90 dias de garantia sobre mão de obra e peça aplicada.",
  },
];

const NotebookLento = () => {
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
      name: "Notebook lento: causas reais, testes e o que resolve",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-notebook-lento-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Notebook lento" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Notebook lento: disco mecânico, memória curta, calor ou software acumulado
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Lentidão tem quatro origens bem diferentes, e cada uma tem um custo próprio. Esta página mostra como
            identificar a sua antes de gastar com peça, formatação ou aparelho novo.
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
        secondaryImageKey="componentesSsd"
        layout="duo"
        caption="Notebook em avaliação de desempenho com leitura de uso de disco, memória e temperatura"
        secondaryCaption="Substituição de disco mecânico por SSD, a intervenção que mais muda a percepção de velocidade"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "onde-falha", label: "Onde nasce a lentidão" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="onde-falha" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">A lentidão nasce em um de quatro lugares</h2>
          <p className="mb-3 text-muted-foreground">
            Disco, memória, temperatura e software. Um notebook lento está limitado por um desses quatro pontos, e cada
            um deixa uma assinatura diferente no comportamento do aparelho. Confundir os quatro é o motivo de tanta
            gente gastar com formatação e continuar com o mesmo problema no dia seguinte.
          </p>
          <p className="mb-3 text-muted-foreground">
            A leitura do gerenciador de tarefas resolve boa parte da dúvida em dois minutos, sem custo: o recurso que
            fica em 100% enquanto os outros estão folgados é o gargalo real. Só depois disso faz sentido falar em peça,
            reinstalação ou limpeza interna.
          </p>
          <p className="text-muted-foreground">
            Se o problema for de computador de mesa, o cenário muda e está descrito em{" "}
            <Link to="/problemas/computador-lento" className="font-medium text-accent hover:underline">
              computador lento
            </Link>
            . Se junto com a lentidão o aparelho esquenta muito ou desliga sozinho, veja{" "}
            <Link to="/problemas/notebook-superaquecendo" className="font-medium text-accent hover:underline">
              notebook superaquecendo
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
            Disco mecânico e memória curta respondem pela maior parte dos atendimentos de lentidão em notebook. Calor
            acumulado vem logo atrás, sobretudo em aparelhos com mais de dois anos sem limpeza interna.
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
            <Gauge className="h-6 w-6 text-accent" /> Testes que você pode fazer antes de acionar alguém
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os cinco primeiros itens já identificam o gargalo e resolvem sozinhos parte real dos casos,
            sem nenhum custo.
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
            O que não recomendamos em nenhuma hipótese: instalar otimizadores, apagar arquivos de sistema para liberar
            espaço e continuar usando disco que faz estalos antes de salvar os dados.
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
            Valem para todo atendimento de notebook e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Limite declarado</h3>
              <p className="text-sm text-muted-foreground">
                Não vendemos formatação como solução de gargalo físico. Se o limite for o disco ou a memória, dizemos
                isso antes, mesmo quando o serviço mais barato seria mais fácil de aprovar.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. Serviços de bancada começam com a retirada do aparelho no
                endereço informado e terminam com a devolução no mesmo endereço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia com escopo</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e peça aplicada, limitada ao serviço executado. Falha posterior em outro
                componente é avaliada como caso novo.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: desempenho de máquina nova em hardware antigo, recuperação integral de dados em disco
            já com falha física e prazo fixo antes de conhecer o equipamento.
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
          <h2 className="mb-3 text-2xl font-bold">Conte como a lentidão aparece</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo, há quanto tempo está assim e o que o gerenciador de tarefas mostra em 100%. Com isso já
            indicamos se o caso é remoto, de upgrade ou de limpeza interna em bancada.
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

export default NotebookLento;
