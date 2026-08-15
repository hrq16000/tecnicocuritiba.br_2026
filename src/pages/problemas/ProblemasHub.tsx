import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";
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
import { trackPageView, trackCTAClick, trackInternalLink } from "@/lib/analytics";
import { MOTION_DURATION, MOTION_EASING, staggerDelay } from "@/lib/motion";
import { PROBLEMAS_HUB, TOTAL_PROBLEMAS } from "@/lib/problemasHub";

const PATH = "/problemas";
const TITLE = "Problemas de Computador, Notebook e TV | Curitiba";
const DESCRIPTION =
  "Índice de sintomas atendidos em Curitiba: computador lento, tela azul, Wi-Fi caindo, notebook que não liga e smart TV com defeito. Cada página explica causas prováveis, testes seguros e o que resolve, com avaliação técnica e coleta no endereço.";

const WA_MESSAGE =
  "Olá! Vim do índice de problemas do site e quero descrever o sintoma do meu equipamento para avaliação.";

const FAQS = [
  {
    question: "Como escolho a página certa para o meu caso?",
    answer:
      "Escolha pelo comportamento do aparelho, não pela suspeita. Se o equipamento não dá sinal de vida, procure a página de não liga; se liga e a imagem não aparece, procure tela preta ou sem sinal; se tudo funciona devagar, procure lentidão. Sintoma descrito com precisão encurta o diagnóstico e evita troca de peça sem necessidade.",
  },
  {
    question: "Lentidão sempre é vírus?",
    answer:
      "Não. Na maior parte dos casos que recebemos, lentidão vem de disco mecânico antigo, memória insuficiente para o uso atual ou aquecimento reduzindo a velocidade do processador. Infecção existe e aparece com propaganda, extensões estranhas e consumo alto sem programa aberto — nesse cenário a rota é a remoção de vírus, com verificação depois da limpeza.",
  },
  {
    question: "Posso tentar resolver sozinho antes de chamar alguém?",
    answer:
      "Pode, e cada página lista os testes que não pioram o quadro: trocar cabo, testar outra tomada, reiniciar o roteador, conferir a saída de áudio selecionada. O que não recomendamos é abrir equipamento com suspeita de dano interno, tentar recuperar dados de disco com ruído mecânico ou instalar programas que prometem consertar tudo automaticamente.",
  },
  {
    question: "Vocês atendem no local ou levam o equipamento?",
    answer:
      "Depende do sintoma. Cobertura de rede, configuração e ajuste de sistema são resolvidos no local ou remotamente. Falha de placa, tela, fonte e recuperação de dados são serviços de bancada, com retirada e devolução no endereço informado em Curitiba e região. Não temos balcão de atendimento ao público.",
  },
  {
    question: "Como funciona o custo do diagnóstico?",
    answer:
      "A visita técnica inicial é sem compromisso e a coleta é gratuita nos serviços acima de uma hora de bancada. Para procedimentos de bancada existe um mínimo pré-aprovado de R$ 299,99, informado antes de qualquer execução. Você aprova o valor antes de o serviço começar; se não aprovar, o equipamento volta como estava.",
  },
  {
    question: "E quando o conserto não compensa?",
    answer:
      "Dizemos isso abertamente. Em aparelhos antigos, o custo de placa ou painel pode passar do valor de mercado do equipamento, e nesses casos apontamos a alternativa mais barata — inclusive quando ela não envolve serviço nosso. Preferimos perder uma ordem de serviço a entregar um reparo que não se paga.",
  },
];

const ProblemasHub = () => {
  const waHref = whatsappLink(WA_MESSAGE);

  useEffect(() => {
    trackPageView(PATH, TITLE);
  }, []);

  useJsonLdSlot(
    SCHEMA_SLOTS.webPage,
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(PATH)}#webpage`,
      name: "Problemas atendidos: sintomas de computador, notebook e TV em Curitiba",
      description: DESCRIPTION,
      url: absoluteUrl(PATH),
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      publisher: { "@id": `${absoluteUrl("/")}#organization` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: TOTAL_PROBLEMAS,
        itemListElement: PROBLEMAS_HUB.flatMap((g) => g.itens).map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.titulo,
          url: absoluteUrl(item.to),
        })),
      },
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `hub-problemas-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Índice de sintomas · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Problemas atendidos: encontre o seu sintoma antes de gastar
          </h1>
          <p className="mb-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:text-base">
            {TOTAL_PROBLEMAS} páginas de sintoma escritas a partir dos atendimentos reais da bancada. Cada uma
            mostra as causas prováveis, os testes que você pode fazer sem risco e o que realmente resolve.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="hub_problemas_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Descrever meu problema
            </a>
          </Button>
        </div>
      </section>

      <TrustStrip />

      <RealImageSection
        imageKey="diagnostico"
        secondaryImageKey="bancadaTecnica"
        layout="duo"
        caption="Diagnóstico inicial: reproduzir o sintoma antes de abrir qualquer equipamento"
        secondaryCaption="Bancada onde os casos de placa, fonte e tela são avaliados em Curitiba"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "como-usar", label: "Como usar este índice" },
            ...PROBLEMAS_HUB.map((g) => ({ id: g.id, label: g.titulo })),
            { id: "sem-pagina", label: "Meu sintoma não está na lista" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="como-usar" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Como usar este índice de problemas</h2>
          <p className="mb-3 text-muted-foreground">
            A maioria dos orçamentos errados começa com uma suspeita, não com um sintoma. Quem chega dizendo
            &ldquo;acho que é a placa&rdquo; costuma pagar por uma peça que não era o problema. Por isso este índice está
            organizado pelo que o equipamento faz — não liga, liga sem imagem, trava, esquenta, perde rede — e não pelo
            componente que alguém imaginou estar em falha.
          </p>
          <p className="mb-3 text-muted-foreground">
            Cada página segue a mesma lógica que usamos na bancada: primeiro os testes gratuitos que separam grandes
            grupos de causa, depois as verificações seguras que você pode fazer em casa e só então as intervenções que
            exigem ferramenta e equipamento de medição. Nenhum passo sugerido abre o aparelho, apaga dados ou anula
            garantia de fabricante.
          </p>
          <p className="text-muted-foreground">
            Se preferir ir direto ao serviço, os caminhos mais procurados são{" "}
            <Link to="/servicos/manutencao-de-notebook" className="font-medium text-accent hover:underline">
              manutenção de notebook
            </Link>
            ,{" "}
            <Link to="/servicos/remocao-de-virus" className="font-medium text-accent hover:underline">
              remoção de vírus
            </Link>
            ,{" "}
            <Link to="/servicos/redes-e-wifi" className="font-medium text-accent hover:underline">
              redes e Wi-Fi
            </Link>{" "}
            e{" "}
            <Link to="/servicos/conserto-tv" className="font-medium text-accent hover:underline">
              conserto de TV
            </Link>
            .
          </p>
        </section>

        {PROBLEMAS_HUB.map((grupo) => (
          <section key={grupo.id} id={grupo.id} className="scroll-mt-24 mb-12">
            <h2 className="mb-3 text-2xl font-bold text-foreground">{grupo.titulo}</h2>
            <p className="mb-5 text-muted-foreground">{grupo.intro}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {grupo.itens.map((item, i) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => trackInternalLink(item.to, `hub_problemas_${grupo.id}`)}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent focus-visible:border-accent"
                  style={{
                    transitionDuration: `${MOTION_DURATION.fast}ms`,
                    transitionTimingFunction: MOTION_EASING.standard,
                    animationDelay: `${staggerDelay(i)}ms`,
                  }}
                >
                  <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                    {item.titulo}
                    <ArrowRight className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section id="sem-pagina" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Meu sintoma não está na lista</h2>
          <p className="mb-4 text-muted-foreground">
            O índice cobre os sintomas mais frequentes, mas a bancada recebe casos fora do padrão toda semana: placa com
            corrosão depois de infiltração, equipamento que só falha em um horário do dia, TV que funciona por cabo e não
            por streaming. Descrever o comportamento em duas frases já é suficiente para dizermos se é caso de ajuste
            remoto, visita ou bancada.
          </p>
          <ul className="mb-5 grid gap-2 md:grid-cols-2">
            {[
              "Diga o que acontece e desde quando começou",
              "Informe se houve queda de energia, queda física ou líquido",
              "Diga se o problema é constante ou intermitente",
              "Conte o que já foi tentado antes de nos chamar",
            ].map((t) => (
              <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("sem_pagina")} data-cta-location="hub_problemas_meio">
              <MessageCircle className="mr-2 h-5 w-5" /> Enviar meu sintoma
            </a>
          </Button>
        </section>

        <ProximosPassos waHref={waHref} onCta={cta("proximos_passos")} ctaLocation="hub_problemas_proximos_passos" />

        <section id="faq" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Perguntas frequentes sobre os problemas atendidos</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{f.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-muted/40 p-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Ainda em dúvida sobre o próximo passo?</h2>
          <p className="mb-5 text-muted-foreground">
            Envie o sintoma pelo WhatsApp. Respondemos com a hipótese mais provável, o tipo de atendimento indicado e a
            faixa de custo antes de qualquer coleta.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="hub_problemas_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar com um técnico
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProblemasHub;
