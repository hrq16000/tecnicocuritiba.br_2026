import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, Volume2 } from "lucide-react";
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

const PATH = "/problemas/tv-sem-som";
const TITLE = "TV Sem Som: Causas, Testes e Conserto | Curitiba";
const DESCRIPTION =
  "TV com imagem normal e sem áudio, som chiado ou saída de fone mudo? Veja como separar configuração de saída, falha do amplificador de áudio e alto-falante rompido antes de orçar, com avaliação por coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre TV sem som. Minha televisão está com imagem normal, mas sem áudio, e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Imagem perfeita e nenhum som em nenhuma fonte",
    desc: "Quando o silêncio acompanha TV aberta, HDMI e aplicativos, a suspeita sai da fonte externa e passa para o circuito de áudio interno ou para uma saída configurada errada.",
  },
  {
    titulo: "Som sumiu só em um aplicativo ou numa entrada HDMI",
    desc: "Falha isolada por entrada quase sempre é ajuste: formato de áudio incompatível, cabo com contato ruim ou aparelho externo enviando faixa que a TV não decodifica.",
  },
  {
    titulo: "Áudio distorcido, chiado ou estalando",
    desc: "Distorção indica estágio de amplificação em sofrimento ou cone de alto-falante rompido. Continuar usando nesse estado costuma piorar o dano do próprio alto-falante.",
  },
  {
    titulo: "Só um lado toca",
    desc: "Perda de um canal aponta para um alto-falante específico ou para metade do amplificador. É o cenário mais favorável a reparo pontual em bancada.",
  },
  {
    titulo: "Som funciona no fone ou na barra, mas não nos alto-falantes",
    desc: "Sinal saindo pela saída digital ou pelo fone prova que o processamento de áudio está vivo — o problema mora do amplificador para frente.",
  },
  {
    titulo: "Volume sobe na tela mas nada muda",
    desc: "Barra de volume subindo sem resposta sonora é sintoma típico de saída redirecionada para outro dispositivo ou de amplificador silenciado por proteção.",
  },
];

const CAUSAS = [
  "Saída de áudio configurada para dispositivo externo (barra, receptor, Bluetooth)",
  "Formato de áudio do aplicativo ou do decodificador incompatível com o televisor",
  "Amplificador de áudio da placa principal com componente em curto ou aberto",
  "Alto-falante com cone rompido ou bobina travada por uso em volume alto",
  "Conector de alto-falante frouxo ou oxidado depois de mudança de lugar",
  "Solda fadigada no bloco de áudio, com falha que aparece e desaparece",
  "Modo de acessibilidade ou saída mudo ativada por engano no controle",
  "Firmware interrompido durante atualização, deixando o áudio inativo",
];

const VERIFICACOES = [
  "Teste três fontes diferentes: TV aberta, um HDMI e um aplicativo interno da própria TV.",
  "No menu de som, force a saída para os alto-falantes internos e desative Bluetooth e saída digital.",
  "Confirme se o formato de saída está em PCM ou estéreo, e não em um formato que dependa de receptor.",
  "Coloque um fone na saída da TV, se houver: som no fone e silêncio nos alto-falantes já indica o bloco defeituoso.",
  "Desconecte barra de som, receptor e conversor e teste o televisor sozinho na tomada.",
  "Suba o volume devagar e ouça se há chiado ou estalo — distorção é informação diagnóstica relevante.",
  "Não abra a traseira do televisor: a fonte guarda carga perigosa mesmo desligada da tomada.",
  "Não insista em volume alto com som distorcido; isso costuma terminar de romper o alto-falante.",
];

const OPCOES = [
  {
    titulo: "Avaliação do bloco de áudio",
    desc: "Medimos o sinal desde o processamento até a saída dos alto-falantes para descobrir onde ele se perde. Só depois disso existe orçamento — palpite por relato não fecha diagnóstico de áudio.",
    to: "/servicos/conserto-tv",
    label: "Conserto de TV",
  },
  {
    titulo: "Reparo em nível de componente",
    desc: "Amplificador de áudio e soldas fadigadas são tratados pontualmente com estação de retrabalho, sem substituir a placa inteira quando o restante do circuito está íntegro.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Quando o reparo não compensa",
    desc: "Se a peça de áudio do modelo saiu de linha ou o custo se aproxima do valor de um aparelho equivalente, dizemos isso com o número na mão em vez de empurrar serviço.",
    to: "/quando-nao-compensa",
    label: "Quando não compensa reparar",
  },
  {
    titulo: "Coleta e devolução no endereço",
    desc: "O televisor é retirado embalado no endereço informado, avaliado em bancada e devolvido no mesmo endereço. Nada é executado antes de você aprovar o valor apresentado.",
    to: "/coleta-e-entrega",
    label: "Como funciona a coleta",
  },
];

const FAQS = [
  {
    question: "Minha TV está com imagem e sem som. Isso tem conserto?",
    answer:
      "Na maior parte dos casos, sim, e costuma ser um dos reparos mais viáveis do televisor. Falha de áudio raramente envolve o painel, que é a peça cara do aparelho. Ela se concentra no amplificador da placa principal ou nos alto-falantes, dois blocos que aceitam reparo pontual. Antes disso vale eliminar o gratuito: saída redirecionada para barra de som, Bluetooth pareado ou formato de áudio incompatível no aplicativo.",
  },
  {
    question: "Como sei se é configuração ou defeito de verdade?",
    answer:
      "O teste decisivo é variar a fonte. Se o silêncio aparece na TV aberta, num HDMI e num aplicativo interno ao mesmo tempo, o problema é do televisor. Se só um deles fica mudo, a origem está no ajuste daquela entrada ou no aparelho conectado a ela. Forçar a saída para os alto-falantes internos no menu de som resolve uma parte real dos chamados sem qualquer custo.",
  },
  {
    question: "O som sai pelo fone e pela barra, mas não pelos alto-falantes. O que significa?",
    answer:
      "Significa que a parte de processamento está funcionando e o sinal chega até a saída. O que falhou está entre o amplificador e os alto-falantes. É um cenário favorável: normalmente envolve componente do estágio de amplificação, conector solto ou alto-falante rompido, sem mexer em placa de painel nem em fonte.",
  },
  {
    question: "O som está chiado e distorcido. Posso continuar usando assim?",
    answer:
      "Não recomendamos. Distorção significa que o sinal já está saindo fora de forma, e insistir em volume alto costuma terminar de romper a bobina do alto-falante. Um caso que seria de reparo de componente vira troca de alto-falante mais reparo, com custo maior. Baixar o volume e agendar a avaliação evita esse agravamento.",
  },
  {
    question: "Vocês trocam apenas o alto-falante?",
    answer:
      "Quando a avaliação mostra alto-falante rompido e o restante do circuito íntegro, sim. O que não fazemos é adaptar alto-falante genérico com impedância diferente da original: isso força o amplificador e cria um defeito novo poucos meses depois. Se a peça correta não existir para o modelo, informamos e você decide com o número na mão.",
  },
  {
    question: "Preciso levar a TV até vocês?",
    answer:
      "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das maiores causas de dano de painel, um problema muito mais caro que a falta de som. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado.",
  },
  {
    question: "Qual a garantia do reparo de áudio?",
    answer:
      "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo no circuito de áudio cobre o circuito de áudio. Falha posterior em fonte, painel ou placa principal é avaliada como caso novo. Descarga elétrica e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertas.",
  },
];

const TvSemSom = () => {
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
      name: "TV sem som: testes, causas e limites do reparo",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-tv-sem-som-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "TV sem som" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            TV sem som: ajuste de saída, amplificador de áudio ou alto-falante rompido
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Televisor com imagem normal e nenhum áudio tem três origens bem distintas, e elas se separam com testes que
            você mesmo faz em poucos minutos. Esta página mostra a sequência que usamos antes de qualquer orçamento.
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
        secondaryImageKey="amplificadorSom"
        layout="duo"
        caption="Televisor em teste de áudio por fonte, comparando TV aberta, HDMI e aplicativo interno"
        secondaryCaption="Verificação do estágio de amplificação antes de indicar troca de alto-falante"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "onde-falha", label: "Onde o som se perde" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="onde-falha" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">O som se perde em um de três pontos</h2>
          <p className="mb-3 text-muted-foreground">
            O áudio de um televisor percorre um caminho curto: a fonte gera o sinal, o processamento decide por onde ele
            sai, o amplificador dá potência e os alto-falantes transformam isso em som. Falta de áudio é sempre a
            interrupção desse caminho em um desses pontos, e cada um tem um custo bem diferente.
          </p>
          <p className="mb-3 text-muted-foreground">
            Por isso o primeiro passo não é orçamento, é teste de fonte. Silêncio em todas as entradas coloca a suspeita
            dentro do aparelho. Silêncio em uma só entrega o caso para ajuste de formato, cabo ou aparelho externo — sem
            reparo nenhum.
          </p>
          <p className="text-muted-foreground">
            Se além do som faltar imagem, o quadro é outro e está descrito em{" "}
            <Link to="/problemas/tv-nao-liga" className="font-medium text-accent hover:underline">
              TV não liga
            </Link>
            . Se o som existe e a imagem é que some, veja{" "}
            <Link to="/problemas/tv-com-som-sem-imagem" className="font-medium text-accent hover:underline">
              TV com som e sem imagem
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
            Barra de som instalada e esquecida no menu, aplicativo enviando formato que o televisor não decodifica e
            aparelhos com muitos anos de uso em volume alto respondem pela maior parte dos chamados de áudio.
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
            <Volume2 className="h-6 w-6 text-accent" /> Testes que você pode fazer antes de acionar alguém
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os quatro primeiros itens resolvem sozinhos uma parte real dos casos, sem nenhum custo.
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
            O que não recomendamos em nenhuma hipótese: abrir a traseira do televisor, ligar alto-falante externo direto
            na placa e transportar o aparelho sem proteção rígida nas bordas.
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
            Valem para todo atendimento de televisor e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Limite declarado</h3>
              <p className="text-sm text-muted-foreground">
                Não adaptamos alto-falante com impedância diferente da original. Sem a peça correta para o modelo,
                informamos e devolvemos o aparelho sem tentativa de improviso.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. O televisor é retirado embalado no endereço informado e
                devolvido no mesmo endereço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia com escopo</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e peça aplicada, limitada ao bloco de áudio reparado. Descarga elétrica
                posterior é dano novo e não está coberta.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: fechar diagnóstico apenas pelo relato no WhatsApp, garantir peça de linha
            descontinuada e sustentar reparo em aparelho com dano por descarga elétrica generalizada.
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
          <h2 className="mb-3 text-2xl font-bold">Conte em quais fontes o som some</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo, se o silêncio acontece em todas as entradas e se o fone ou a barra de som ainda tocam. Com
            essas três informações já conseguimos orientar a expectativa antes da coleta.
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

export default TvSemSom;
