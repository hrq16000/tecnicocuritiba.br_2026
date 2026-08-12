import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Tv, MessageCircle } from "lucide-react";
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

const PATH = "/problemas/tv-travando";
const TITLE = "TV Travando ou Muito Lenta: O Que Fazer | Curitiba";
const DESCRIPTION =
  "Smart TV travando, aplicativo congelando ou controle demorando para responder? Veja como separar memória cheia, aplicativo desatualizado, rede saturada e falha de placa antes de trocar a televisão, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre TV travando. Minha smart TV está travando e preciso de avaliação técnica.";

const SINTOMAS = [
  {
    titulo: "A TV liga, mas demora minutos para responder",
    desc: "Armazenamento interno lotado e atualização mal concluída dominam esse quadro. O painel e a fonte costumam estar intactos.",
  },
  {
    titulo: "Só um aplicativo trava, os outros funcionam",
    desc: "Cache corrompido ou versão do app incompatível com o sistema da TV. É o cenário mais simples e não exige bancada.",
  },
  {
    titulo: "Vídeo congela e o som continua",
    desc: "Aponta para decodificação de vídeo: rede instável, buffer insuficiente ou processamento em falha.",
  },
  {
    titulo: "A TV reinicia sozinha ao abrir streaming",
    desc: "Consumo de pico revelando fonte cansada. O travamento é sintoma; a origem é elétrica.",
  },
  {
    titulo: "Controle responde com atraso enorme",
    desc: "Pode ser pareamento Bluetooth instável, pilha fraca ou sistema saturado. Testar o controle do celular separa os casos.",
  },
  {
    titulo: "Trava só com internet, nunca em HDMI",
    desc: "Quando o conteúdo local roda liso, a suspeita sai da TV e vai para o Wi-Fi da casa.",
  },
];

const CAUSAS = [
  "Armazenamento interno da smart TV praticamente cheio com apps e cache",
  "Sistema desatualizado ou atualização interrompida por queda de energia",
  "Aplicativo de streaming em versão incompatível com o modelo da TV",
  "Wi-Fi com sinal fraco no cômodo da TV, forçando queda de qualidade e buffer",
  "Roteador saturado por muitos aparelhos disputando a mesma faixa",
  "Fonte interna com capacitor cansado, causando reinício sob carga",
  "Memória da placa principal em degradação, comum em modelos com muitos anos de uso",
  "Ventilação obstruída por móvel ou painel encostado na parede",
];

const VERIFICACOES = [
  "Teste um conteúdo por HDMI (notebook, console ou receptor): se roda liso, o problema é sistema ou rede, não painel.",
  "Meça o sinal de Wi-Fi no cômodo com o celular parado no mesmo ponto da TV, e não perto do roteador.",
  "Feche e limpe o cache do aplicativo que trava, pelo menu de aplicativos da própria TV.",
  "Desligue a TV da tomada por dois minutos: isso descarrega a placa e resolve travamentos temporários de sistema.",
  "Desinstale aplicativos que você não usa; espaço livre muda o comportamento de forma perceptível.",
  "Confira se há atualização de sistema pendente e execute com a TV em rede estável, sem desligar no meio.",
  "Observe se o travamento acontece sempre depois de um tempo ligada: isso reforça a hipótese térmica.",
  "Não instale arquivos de firmware baixados de sites não oficiais: firmware errado deixa a TV inoperante.",
];

const OPCOES = [
  {
    titulo: "Ajuste de sistema e aplicativos",
    desc: "Quando a TV trava por espaço, cache ou atualização incompleta, a correção é de configuração e não exige troca de peça.",
    to: "/servicos/conserto-tv",
    label: "Conserto de TV",
  },
  {
    titulo: "Correção da rede que alimenta a TV",
    desc: "Sinal fraco no cômodo da TV é causa frequente de travamento em streaming. O trabalho aqui é sobre cobertura e canal, não sobre a televisão.",
    to: "/servicos/redes-e-wifi",
    label: "Redes e Wi-Fi",
  },
  {
    titulo: "Reparo de fonte e placa",
    desc: "Reinício sob carga e travamento térmico apontam para fonte ou placa principal. Nesse cenário o diagnóstico é de bancada, com teste sob carga real.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Quando a TV desliga em vez de travar",
    desc: "Se além de lenta a televisão desliga sozinha, o roteiro de investigação muda de foco.",
    to: "/problemas/tv-desligando-sozinha",
    label: "TV desligando sozinha",
  },
];

const FAQS = [
  {
    question: "Minha smart TV travando significa que ela está no fim da vida útil?",
    answer:
      "Não necessariamente. Travamento é, na maioria dos atendimentos, resultado de armazenamento lotado, sistema desatualizado ou rede instável — três causas que não têm relação com desgaste do painel. A avaliação técnica separa o que é software do que é placa antes de qualquer conversa sobre trocar o aparelho.",
  },
  {
    question: "Vale a pena consertar uma TV que trava ou é melhor comprar outra?",
    answer:
      "Depende do que está travando. Se for sistema, aplicativo ou rede, o custo é baixo e a TV volta a funcionar bem. Se for placa principal em degradação em um modelo antigo, dizemos abertamente quando o reparo não compensa frente ao valor do aparelho. Essa recomendação sai depois do diagnóstico, nunca antes.",
  },
  {
    question: "Um aparelho de streaming externo resolve a TV lenta?",
    answer:
      "Em boa parte dos casos, sim, e é uma alternativa honesta quando o sistema da TV já não recebe atualização. O conteúdo passa a rodar no aparelho externo e a televisão vira apenas monitor. Ainda assim, vale confirmar antes que a lentidão não venha da rede, porque nesse caso o aparelho novo travaria igual.",
  },
  {
    question: "A TV trava só na Netflix ou no YouTube. Isso é problema da TV?",
    answer:
      "Quando um único aplicativo falha e os demais rodam, a suspeita principal é o próprio app: cache corrompido ou versão incompatível com o sistema do modelo. Limpar dados do aplicativo e reinstalar resolve grande parte desses casos, sem retirar a televisão do lugar.",
  },
  {
    question: "Trocar o roteador resolve travamento de streaming?",
    answer:
      "Resolve quando a origem é cobertura. Vale medir o sinal no ponto exato onde a TV está, com o celular parado, antes de comprar equipamento. Muitas vezes o ganho vem de reposicionar o roteador ou separar as faixas de frequência, sem trocar nada.",
  },
  {
    question: "A TV reinicia sozinha quando abro um aplicativo pesado. O que é?",
    answer:
      "Esse é o padrão clássico de fonte com capacitor cansado: no pico de consumo a tensão cai e a placa reinicia. É serviço de bancada, com teste sob carga depois do reparo, e não se resolve com ajuste de sistema.",
  },
  {
    question: "Como funciona o atendimento para TV em Curitiba?",
    answer:
      "Não temos balcão de atendimento ao público. Fazemos retirada e devolução no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Painel de TV trincado não é recuperado por nós, e isso é dito antes de retirar o aparelho.",
  },
];

const TvTravando = () => {
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
      name: "TV travando: memória cheia, aplicativo, rede ou placa",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-tv-travando-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas" }, { label: "TV travando" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            TV travando: memória cheia, aplicativo, rede ou placa
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Antes de aposentar a televisão, vale descobrir se o que trava é o sistema, o aplicativo, o Wi-Fi do
            cômodo ou a placa. Três dessas quatro causas custam pouco para resolver.
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
        imageKey="smartTv"
        secondaryImageKey="redesWifi"
        layout="duo"
        caption="Teste de resposta do sistema e das entradas HDMI antes de qualquer intervenção física na televisão"
        secondaryCaption="Medição do sinal de Wi-Fi no cômodo da TV, etapa que separa travamento de rede de falha do aparelho"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "ordem", label: "A ordem certa de investigar" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="ordem" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">A ordem certa de investigar TV lenta</h2>
          <p className="mb-3 text-muted-foreground">
            O primeiro teste não envolve ferramenta nenhuma: ligue um conteúdo por HDMI. Se a imagem roda sem
            engasgo, o painel e o processamento de vídeo estão saudáveis, e a investigação passa a ser sobre sistema
            e rede.
          </p>
          <p className="mb-3 text-muted-foreground">
            O segundo divisor é o momento do travamento. Travar já na tela inicial aponta para memória e sistema.
            Travar apenas dentro de aplicativos de streaming aponta para rede, buffer ou versão do app.
          </p>
          <p className="text-muted-foreground">
            Se a televisão também apresenta falha de imagem, vale conferir{" "}
            <Link to="/problemas/tv-com-linhas-na-tela" className="font-medium text-accent hover:underline">
              TV com linhas na tela
            </Link>
            . Para entender a logística de retirada, veja{" "}
            <Link to="/coleta-e-entrega" className="font-medium text-accent hover:underline">
              coleta e entrega
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
            Armazenamento lotado e Wi-Fi fraco no cômodo somam a maioria dos atendimentos de smart TV lenta. Fonte
            cansada aparece principalmente em aparelhos com mais de cinco anos ligados em rede elétrica instável.
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
            <Tv className="h-6 w-6 text-accent" /> Verificações seguras antes de trocar a televisão
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhum passo abaixo exige abrir a TV nem instalar arquivo externo. Siga na ordem e pare assim que
            identificar o cenário.
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
            O que não recomendamos: abrir a traseira da televisão por conta própria, porque a fonte guarda carga
            mesmo desligada da tomada, e comprar roteador novo antes de medir o sinal no ponto da TV.
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
              <h3 className="mb-2 font-semibold text-foreground">Sistema e rede antes de peça</h3>
              <p className="text-sm text-muted-foreground">
                A investigação começa por armazenamento, aplicativo e cobertura de Wi-Fi. Só depois disso o
                diagnóstico avança para fonte e placa.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Recomendação honesta sobre troca</h3>
              <p className="text-sm text-muted-foreground">
                Quando o reparo não compensa frente ao valor do aparelho, dizemos isso com números na mão em vez de
                empurrar serviço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia do serviço executado</h3>
              <p className="text-sm text-muted-foreground">
                Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo realizado. Sem balcão:
                retirada e devolução no endereço informado.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: recuperação de painel trincado, atualização de sistema em modelo que o fabricante
            já abandonou e prazo fixo antes da avaliação.
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
          <h2 className="mb-3 text-2xl font-bold">Conte como e quando a TV trava</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Se trava só em streaming, só depois de um tempo ligada ou desde que ligou, isso muda a suspeita e encurta
            o diagnóstico.
          </p>
          <Button asChild size="lg" variant="secondary" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar sobre minha TV
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TvTravando;
