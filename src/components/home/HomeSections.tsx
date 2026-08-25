import { lazy, Suspense } from "react";
import { siteConfig, whatsappLink } from "@/lib/siteConfig";
import { HOME_FAQS, HOME_SERVICES } from "@/lib/home/homeContent";
import { EeatProofsSection } from "@/components/EeatProofsSection";
import { AtendimentoFluxoSection } from "@/components/home/AtendimentoFluxoSection";
import { BancadaRealSection } from "@/components/home/BancadaRealSection";
import { GaleriaIlustrativaSection } from "@/components/home/GaleriaIlustrativaSection";

import { RegioesCuritibaSection } from "@/components/home/RegioesCuritibaSection";

import {
  VALOR_VISITA_LABEL,
  VALOR_PACOTE_2H_LABEL,
  VALOR_COLETA_MINIMO_LABEL,
  REGRA_CANCELAMENTO,
  QUANDO_VISITA_COMPATIVEL,
} from "@/lib/precosConfig";


const ReviewsGrid = lazy(() =>
  import("@/components/ReviewsGrid").then((m) => ({ default: m.ReviewsGrid })),
);

const wa = (msg: string) => whatsappLink(msg);
const track = (loc: string) =>
  import("@/lib/analytics").then(({ trackCTAClick }) => trackCTAClick("whatsapp", loc));

// ── Dados ────────────────────────────────────────────────────────
const pains = [
  { t: "Notebook travando", d: "Lentidão, superaquecimento ou desligando sozinho." },
  { t: "PC lento", d: "Demora para ligar, abrir programas e navegar." },
  { t: "Empresa parada", d: "Estações, rede ou sistema fora do ar travam a operação." },
  { t: "Arquivos em risco", d: "HD com falha, exclusão acidental ou disco não reconhecido." },
  { t: "Internet instável", d: "Wi-Fi caindo, sinal fraco ou rede mal configurada." },
  { t: "Sistema corrompido", d: "Erros de boot, tela azul, vírus ou Windows danificado." },
];

const services = HOME_SERVICES;



const faqs = HOME_FAQS;



/** Hubs de distribuição de autoridade: cada bloco cobre uma intenção distinta. */
const authorityHubs: { t: string; d: string; links: { href: string; label: string }[] }[] = [
  {
    t: "Serviços mais procurados",
    d: "Páginas com escopo, prazo e limites de cada reparo.",
    links: [
      { href: "/servicos/formatacao", label: "Formatação de computador" },
      { href: "/servicos/manutencao-de-notebook", label: "Manutenção de notebook" },
      { href: "/servicos/upgrade-ssd-ram", label: "Upgrade de SSD e memória" },
      { href: "/servicos/recuperacao-de-dados", label: "Recuperação de dados" },
      { href: "/servicos", label: "Ver todos os serviços" },
    ],
  },
  {
    t: "Como o atendimento funciona",
    d: "Formatos, valores e o que esperar antes de agendar.",
    links: [
      { href: "/como-funciona", label: "Como funciona o atendimento" },
      { href: "/precos-e-politicas", label: "Preços e políticas" },
      { href: "/equipamentos-atendidos", label: "Equipamentos atendidos" },
      { href: "/quando-nao-compensa", label: "Quando não compensa consertar" },
      { href: "/faq", label: "Perguntas frequentes" },
    ],
  },
  {
    t: "Diagnóstico e referência",
    d: "Conteúdo técnico para identificar o problema antes do contato.",
    links: [
      { href: "/diagnostico-60s", label: "Diagnóstico em 60 segundos" },
      { href: "/problemas-reais-e-casos", label: "Problemas reais e casos" },
      { href: "/marcas", label: "Marcas atendidas" },
      { href: "/tecnico-informatica-curitiba", label: "Técnico de informática em Curitiba" },
      { href: "/blog", label: "Blog técnico" },
    ],
  },
  {
    t: "Cobertura local",
    d: "Bairros de Curitiba e cidades da região com página própria.",
    links: [
      { href: "/tecnico-informatica-curitiba", label: "Atendimento em Curitiba (página principal)" },
      { href: "/bairros/batel", label: "Atendimento técnico no Batel" },
      { href: "/bairros/agua-verde", label: "Suporte de informática no Água Verde" },
      { href: "/tecnico-informatica-sao-jose-pinhais", label: "Suporte técnico em São José dos Pinhais" },
      { href: "/tecnico-informatica-pinhais", label: "Manutenção de computador em Pinhais" },
    ],
  },
];


// ── UI helpers ───────────────────────────────────────────────────
const SectionTitle = ({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) => (
  <div className="mx-auto mb-10 max-w-2xl text-center">
    {eyebrow && (
      <span className="text-xs font-bold uppercase tracking-wider text-accent">{eyebrow}</span>
    )}
    <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
      {title}
    </h2>
    {sub && <p className="mt-3 text-base text-muted-foreground">{sub}</p>}
  </div>
);

/** Link de transparência obrigatório junto de qualquer CTA único. */
const TermosLink = ({ className = "" }: { className?: string }) => (
  <p className={`text-xs text-muted-foreground ${className}`}>
    Antes de agendar, confira os{" "}
    <a href="/termos-e-condicoes" className="underline underline-offset-2 hover:text-foreground">
      termos, condições, valores e prazos
    </a>
    .
  </p>
);

const FunnelButton = ({ loc, msg, children, variant = "accent" }: { loc: string; msg: string; children: React.ReactNode; variant?: "accent" | "ghost" }) => (

  <a
    href={wa(msg)}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => track(loc)}
    data-cta-location={loc}
    className={
      variant === "accent"
        ? "inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02]"
        : "inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
    }
  >
    {children}
  </a>
);

export const HomeSections = () => {
  return (
    <>
      {/* 2. DORES */}
      <section className="border-b border-border bg-secondary py-14 md:py-18">
        <div className="container mx-auto">
          <SectionTitle
            eyebrow="Sinais de que algo está errado"
            title="Quando o computador para, o prejuízo começa."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pains.map((p) => (
              <div key={p.t} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-heading text-base font-bold text-foreground">{p.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVIÇOS */}
      <section id="servicos" className="py-14 md:py-18">
        <div className="container mx-auto">
          <SectionTitle
            eyebrow="O que resolvemos"
            title="Serviços de informática em Curitiba"
            sub="Foco em notebook, PC e suporte empresarial. Valor definido após avaliação, sem número inventado."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.t} className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-[var(--shadow-md)]">
                <h3 className="font-heading text-base font-bold leading-snug text-foreground">
                  <a href={s.href} className="transition-colors hover:text-accent hover:underline">
                    {s.t}
                  </a>
                </h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{s.d}</p>
                <a
                  href={s.href}
                  data-cta-location={s.loc}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent hover:underline"
                >
                  {s.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <a href="/servicos" className="font-semibold text-accent hover:underline">Ver todos os serviços</a>
            {" · "}
            <a href="/termos-e-condicoes" className="underline underline-offset-2 hover:text-foreground">
              termos, condições, valores e prazos
            </a>
          </p>

        </div>
      </section>

      {/* 4. ROTEADOR PF × PJ — separa a intenção antes de abrir a triagem */}
      <section className="border-y border-border bg-secondary py-14 md:py-18">
        <div className="container mx-auto">
          <SectionTitle
            eyebrow="Escolha o caminho certo"
            title="Você é pessoa física ou empresa?"
            sub="A triagem muda conforme o perfil: em casa o foco é o equipamento; na empresa, a operação que não pode parar."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Pessoa física
              </span>
              <h3 className="mt-3 font-heading text-lg font-bold text-foreground">
                Residencial e uso pessoal
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                Notebook e PC lentos, formatação, remoção de vírus, upgrade de SSD/RAM,
                backup de fotos e documentos, Wi-Fi doméstico e recuperação de dados.
                O atendimento pode ser no endereço, remoto ou com coleta, conforme o caso.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/atendimento-domicilio" className="font-semibold text-accent hover:underline">
                    Atendimento em domicílio
                  </a>{" "}
                  — o técnico vai até o seu endereço.
                </li>
                <li>
                  <a href="/coleta-e-entrega" className="font-semibold text-accent hover:underline">
                    Coleta e entrega
                  </a>{" "}
                  — quando o reparo exige bancada.
                </li>
                <li>
                  <a href="/atendimento-remoto" className="font-semibold text-accent hover:underline">
                    Atendimento remoto
                  </a>{" "}
                  — problemas de software resolvidos à distância.
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <FunnelButton
                  loc="home_router_pf"
                  msg="Olá! Sou pessoa física e preciso de atendimento para o meu equipamento."
                >
                  Sou pessoa física
                </FunnelButton>
                <a
                  href="/atendimento-domicilio"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Ver atendimento residencial
                </a>
              </div>
              <TermosLink className="mt-3" />

            </div>

            <div className="flex flex-col rounded-2xl border border-accent/30 bg-accent/[0.04] p-6">
              <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
                Empresa
              </span>
              <h3 className="mt-3 font-heading text-lg font-bold text-foreground">
                Empresarial e profissional
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                Estações de trabalho, rede e cabeamento, suporte técnico contínuo,
                manutenção preventiva e resposta a urgências operacionais. A triagem
                empresarial prioriza o que impede a equipe de trabalhar.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/empresa-de-ti-curitiba" className="font-semibold text-accent hover:underline">
                    Empresa de TI em Curitiba
                  </a>{" "}
                  — diagnóstico do ambiente e organização do suporte.
                </li>
                <li>
                  <a href="/servicos/suporte-tecnico-empresarial" className="font-semibold text-accent hover:underline">
                    Suporte técnico empresarial
                  </a>{" "}
                  — atendimento recorrente sob demanda.
                </li>
                <li>
                  <a href="/servicos/redes-e-wifi" className="font-semibold text-accent hover:underline">
                    Redes e Wi-Fi
                  </a>{" "}
                  — conexão estável em todo o escritório.
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <FunnelButton
                  loc="home_router_pj"
                  msg="Olá! Represento uma empresa em Curitiba e preciso de suporte de informática."
                >
                  Somos empresa
                </FunnelButton>
                <a
                  href="/empresa-de-ti-curitiba"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Ver atendimento empresarial
                </a>
              </div>
              <TermosLink className="mt-3" />

            </div>
          </div>
        </div>
      </section>


      {/* 5. COMO FUNCIONA — fluxo de conversão WhatsApp → triagem → diagnóstico → remoto/local/bancada */}
      <AtendimentoFluxoSection />

      {/* 5B. PROVA REAL — bancada, técnico identificado e atendimento (fail-closed) */}
      <BancadaRealSection />

      {/* 5C. GALERIA ILUSTRATIVA — fotos licenciadas (Pexels), declaradas como ilustrativas */}
      <GaleriaIlustrativaSection />



      {/* 6. PREÇOS E POLÍTICAS */}
      <section className="border-y border-border bg-secondary py-14 md:py-18">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Preços e políticas
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent" aria-hidden="true">▸</span>
                <span>
                  Diagnóstico/visita a partir de <strong className="text-foreground">{VALOR_VISITA_LABEL}</strong> — no
                  atendimento avulso é <strong className="text-foreground">visita técnica de inspeção sem compromisso</strong>,
                  a partir de R$ 99,99 por até (ou a cada) 30 minutos de atendimento.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent" aria-hidden="true">▸</span>
                <span>
                  Pacote pré-acordado de visita técnica de até 2 horas por{" "}
                  <strong className="text-foreground">{VALOR_PACOTE_2H_LABEL}</strong>, sem promessas e sem peças inclusas.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent" aria-hidden="true">▸</span>
                <span>
                  Na maioria dos casos: diagnóstico com compromisso e tentativa de reparos compatíveis, com coleta e entrega
                  inclusas, valor mínimo pré-aprovado de <strong className="text-foreground">{VALOR_COLETA_MINIMO_LABEL}</strong>.
                  Peças não inclusas.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent" aria-hidden="true">▸</span>
                <span>{REGRA_CANCELAMENTO}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent" aria-hidden="true">▸</span>
                <span>{QUANDO_VISITA_COMPATIVEL}</span>
              </li>
            </ul>

            <p className="mt-5 rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
              {siteConfig.pricingDisclaimer}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <FunnelButton loc="pricing_cta" msg="Olá! Quero um valor para meu equipamento.">
                Iniciar triagem do meu equipamento
              </FunnelButton>
              <a
                href="/precos-e-politicas"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Ver preços e políticas
              </a>
            </div>
            <TermosLink className="mt-3" />

          </div>
        </div>
      </section>

      {/* 7. PROVA DE CONFIANÇA REAL (sem rating inventado) */}
      <section className="py-14 md:py-18">
        <div className="container mx-auto">
          <Suspense fallback={<div style={{ minHeight: 320 }} aria-hidden="true" />}>
            <ReviewsGrid title="O que dizem sobre o atendimento" whatsappCta limit={6} />
          </Suspense>
        </div>
      </section>

      {/* 8. ÁREAS ATENDIDAS — regiões e bairros de Curitiba + RMC (sem endereço/CEP) */}
      <RegioesCuritibaSection />


      {/* 8B. DISTRIBUIDORA DE AUTORIDADE — hub de links internos por intenção */}
      <section className="py-14 md:py-18">
        <div className="container mx-auto">
          <SectionTitle
            eyebrow="Continue por aqui"
            title="Encontre a página certa para o seu caso"
            sub="Cada bloco leva direto ao conteúdo específico, sem repetir a mesma explicação."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {authorityHubs.map((hub) => (
              <nav key={hub.t} aria-label={hub.t} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-heading text-base font-bold text-foreground">{hub.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{hub.d}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {hub.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="font-medium text-foreground transition-colors hover:text-accent hover:underline">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </section>



      {/* 9. FAQ */}
      <section className="py-14 md:py-18">
        <div className="container mx-auto">
          <SectionTitle eyebrow="Dúvidas frequentes" title="Perguntas e respostas" />
          <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-accent transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9b. PROVAS DE E-E-A-T (só renderiza com dado real cadastrado) */}
      <EeatProofsSection className="bg-secondary/40" />

      {/* 10. CTA FINAL */}
      <section className="bg-[hsl(var(--hero-bg))] py-16 text-white md:py-20">
        <div className="container mx-auto text-center">
          <h2 className="mx-auto max-w-2xl font-heading text-2xl font-bold tracking-tight md:text-3xl">
            Precisa resolver um problema técnico hoje?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Inicie a triagem por WhatsApp e receba orientação, prazo e condições antes de qualquer reparo.
          </p>
          <div className="mt-7 flex justify-center">
            <a
              href={wa("Olá! Preciso resolver um problema técnico hoje. Pode me ajudar?")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("cta_final")}
              data-cta-location="cta_final"
              className="inline-flex min-h-14 items-center justify-center rounded-lg bg-accent px-8 text-base font-bold text-accent-foreground shadow-[0_14px_34px_-10px_hsl(var(--accent)/0.6)] transition-transform hover:scale-[1.02]"
            >
              Começar triagem agora
            </a>
          </div>
          <p className="mt-4 text-xs text-white/70">
            Antes de agendar, confira os{" "}
            <a href="/termos-e-condicoes" className="underline underline-offset-2 hover:text-white">
              termos, condições, valores e prazos
            </a>
            .
          </p>
        </div>

      </section>
    </>
  );
};

export default HomeSections;
