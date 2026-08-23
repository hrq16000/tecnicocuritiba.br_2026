import { useEffect, useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Link } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FloatingParticles } from "@/components/FloatingParticles";
import { trackPageView } from "@/lib/analytics";
import { getApprovedSlugs } from "@/lib/blogEditorialRegistry";
import { getEditorialCover } from "@/lib/blogEditorialCovers";
import { BLOG_POSTS_META } from "@/lib/seo/blogPostsMeta";


import {
  BookOpen, ShieldCheck, FileSearch, Wrench, MessageCircle,
  ArrowRight, CheckCircle2, Clock,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// HUB EDITORIAL FAIL-CLOSED
// A listagem exibe SOMENTE artigos com aprovação editorial válida
// (registro em src/lib/blogEditorialRegistry.ts). O registro inicia
// vazio, então o hub apresenta um estado editorial honesto e permanece
// noindex enquanto houver menos de 3 artigos aprovados.
// ─────────────────────────────────────────────────────────────

const MIN_APPROVED_TO_INDEX = 3;

const EDITORIAL_POLICY = [
  "Conteúdos só são liberados após revisão editorial.",
  "A autoria precisa ser identificada antes da publicação.",
  "As fontes são verificadas quando necessárias.",
  "As datas só são atualizadas após mudança material no conteúdo.",
  "Toda imagem precisa ter origem conhecida (própria, licenciada ou gerada).",
  "Correções podem ser solicitadas pela página de contato.",
  "Conteúdo patrocinado, quando houver, será claramente identificado.",
  "Exemplos didáticos nunca serão apresentados como casos reais.",
  "Avaliações e resultados não serão inventados.",
];

const INSTITUTIONAL_LINKS = [
  { to: "/servicos", label: "Serviços de informática", icon: Wrench, desc: "Formatação, manutenção, SSD, vírus, redes e mais." },
  { to: "/diagnostico-tecnico", label: "Diagnóstico técnico", icon: FileSearch, desc: "Entenda o problema antes de decidir o reparo." },
  { to: "/sobre", label: "Sobre", icon: ShieldCheck, desc: "Quem somos e como trabalhamos em Curitiba." },
  { to: "/contato", label: "Contato", icon: MessageCircle, desc: "Fale conosco ou solicite uma correção editorial." },
];

const Blog = () => {
  const approvedSlugs = getApprovedSlugs();
  const hasApproved = approvedSlugs.length > 0;
  // Fail-closed: hub permanece noindex enquanto não houver massa editorial aprovada.
  const noindex = approvedSlugs.length < MIN_APPROVED_TO_INDEX;

  // Títulos/resumos reais dos artigos. O estado inicial vem do espelho estático
  // (BLOG_POSTS_META) para que o HTML servido já traga títulos legíveis, e não o slug.
  const [summaries, setSummaries] = useState<
    Record<string, { title: string; excerpt: string }>
  >(() => {
    const seed: Record<string, { title: string; excerpt: string }> = {};
    for (const slug of approvedSlugs) {
      const meta = BLOG_POSTS_META[slug];
      if (meta) seed[slug] = { title: meta.title, excerpt: meta.description };
    }
    return seed;
  });


  useEffect(() => {
    trackPageView("/blog", "Blog - Hub editorial");
  }, []);

  useEffect(() => {
    if (!hasApproved) return;
    let active = true;
    import("@/data/blogPostsContent").then((mod) => {
      if (!active) return;
      const next: Record<string, { title: string; excerpt: string }> = {};
      for (const slug of approvedSlugs) {
        const post = mod.blogPostsContentBase[slug];
        if (post) next[slug] = { title: post.title, excerpt: post.excerpt };

      }
      setSummaries(next);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasApproved]);


  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Guias de Informática | Técnico em Curitiba"
        description="Guias sobre manutenção, segurança, computadores, notebooks, redes e cuidados com dados, publicados após revisão editorial."
        path="/blog"
        noindex={noindex}
        breadcrumbs={[{ name: "Início", path: "/" }, { name: "Guias", path: "/blog" }]}
      />

      <JsonLdSchema />
      <Header />

      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 premium-gradient" />
          <FloatingParticles count={20} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.07] blur-[120px] animate-breathe" />
            <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[100px] animate-breathe" style={{ animationDelay: "2.5s" }} />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "32px 32px" }} />

          <div className="container mx-auto relative z-10 pt-14 pb-20 md:pt-20 md:pb-24 px-4">
            <AnimatedSection animation="fade-up">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-sm font-medium text-white/90 mb-6 border border-white/15">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span>Guias técnicos</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-5">
                  Guias de Informática
                </h1>
                <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                  Guias sobre manutenção, segurança, computadores, notebooks, redes e
                  cuidados com dados — publicados após revisão editorial.
                </p>
                <div className="glow-separator max-w-[200px] mx-auto mt-6" />
              </div>
            </AnimatedSection>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* ═══════════ ESTADO EDITORIAL ═══════════ */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            {!hasApproved ? (
              <AnimatedSection>
                <div className="max-w-2xl mx-auto text-center rounded-2xl border border-border bg-card p-8 md:p-12 shadow-xs">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-6">
                    <Clock className="h-7 w-7 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
                    Conteúdos técnicos em revisão editorial
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Estamos revisando autoria, fontes, imagens e atualização dos materiais
                    antes de liberar novos guias. Assim que os primeiros conteúdos passarem
                    pela revisão, eles aparecerão aqui.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Enquanto isso, você pode ir direto ao que resolve o seu problema:
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <Link
                      to="/servicos"
                      className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Ver serviços <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/diagnostico-tecnico"
                      className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-5 py-3 rounded-xl hover:border-accent/40 transition-colors"
                    >
                      Diagnóstico técnico
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ) : (
              <AnimatedSection>
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 text-center">
                    Guias publicados
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {approvedSlugs.map((slug) => {
                      const meta = summaries[slug];
                      const cover = getEditorialCover(slug);
                      return (
                        <li key={slug}>
                          <Link
                            to={`/blog/${slug}`}
                            className="block h-full rounded-xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-colors"
                          >
                            {cover && (
                              <img
                                src={cover.src}
                                alt={cover.alt}
                                width={1200}
                                height={630}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-40 object-cover"
                              />
                            )}
                            <span className="block p-5">
                              <span className="block text-foreground font-semibold">
                                {meta?.title ?? slug}
                              </span>
                              {meta?.excerpt && (
                                <span className="block text-sm text-muted-foreground mt-2 leading-relaxed">
                                  {meta.excerpt}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </AnimatedSection>
            )}

          </div>
        </section>

        {/* ═══════════ PARA QUE SERVEM OS GUIAS ═══════════ */}
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto space-y-5 text-foreground/90 leading-relaxed">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  Para que servem estes guias
                </h2>
                <p>
                  Cada guia nasce de uma dúvida que aparece repetidamente no atendimento em
                  Curitiba: se vale a pena consertar ou trocar um equipamento, o que muda de
                  verdade ao instalar um SSD, como reduzir o risco de perder arquivos, quando
                  a formatação resolve e quando ela só empurra o problema para a frente. Em vez
                  de responder o mesmo assunto por mensagem, escrevemos o raciocínio completo,
                  com os critérios que usamos na bancada.
                </p>
                <p>
                  O texto é escrito por quem executa o serviço, revisado antes de publicar e
                  atualizado apenas quando há mudança material — não trocamos a data para
                  simular conteúdo novo. Quando um guia cita um limite (peça sem reposição,
                  reparo que não compensa, garantia que não cobre determinada falha), esse
                  limite fica escrito, mesmo quando não favorece a venda do serviço.
                </p>
                <h3 className="text-xl font-heading font-semibold text-foreground pt-2">
                  Como usar junto com o diagnóstico
                </h3>
                <p>
                  Guia não substitui diagnóstico. O material aqui ajuda a entender o cenário e
                  a chegar na conversa com as perguntas certas; a definição do reparo depende de
                  ver o equipamento, os sintomas reais e o histórico de uso. Se o seu caso já
                  tem sintoma claro, o caminho mais rápido é partir do sintoma e não do artigo.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      Sintoma definido (lentidão, travamento, não liga, Wi-Fi caindo):
                      comece pelo{" "}
                      <Link to="/problemas" className="text-accent font-medium hover:underline">
                        hub de problemas
                      </Link>
                      , que separa cada falha por causa provável.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      Precisa de preço e prazo antes de decidir: veja a tabela em{" "}
                      <Link to="/precos" className="text-accent font-medium hover:underline">
                        preços
                      </Link>{" "}
                      e a explicação de{" "}
                      <Link to="/como-funciona" className="text-accent font-medium hover:underline">
                        como funciona o atendimento
                      </Link>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      Equipamento parado de empresa ou home office: a página de{" "}
                      <Link to="/empresas" className="text-accent font-medium hover:underline">
                        atendimento para empresas
                      </Link>{" "}
                      descreve prioridade, coleta e continuidade de trabalho.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      Quer saber onde atendemos: a lista de{" "}
                      <Link to="/areas-atendidas" className="text-accent font-medium hover:underline">
                        áreas atendidas
                      </Link>{" "}
                      mostra bairros de Curitiba e cidades da região metropolitana com coleta
                      e entrega.
                    </span>
                  </li>
                </ul>
                <h3 className="text-xl font-heading font-semibold text-foreground pt-2">
                  Ritmo de publicação
                </h3>
                <p>
                  Publicamos poucos guias por vez, de propósito. Preferimos um material longo,
                  específico e verificável a uma lista extensa de textos rasos — inclusive
                  porque cada publicação passa por checagem de autoria, de fontes e de origem
                  das imagens antes de entrar no ar. Guias que ainda não passaram por essa
                  revisão simplesmente não aparecem nesta página.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>



        {/* ═══════════ POLÍTICA EDITORIAL ═══════════ */}
        <section className="py-14 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                  Política editorial
                </h2>
                <p className="text-muted-foreground mb-8">
                  Estas são as regras que guiam a publicação dos nossos guias técnicos.
                </p>
                <ul className="space-y-3">
                  {EDITORIAL_POLICY.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/90 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-8">
                  Encontrou algo que precisa de correção? Fale conosco pela{" "}
                  <Link to="/contato" className="text-accent font-medium hover:underline">
                    página de contato
                  </Link>
                  .
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══════════ LINKS INSTITUCIONAIS ═══════════ */}
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6 text-center">
                  Continue por aqui
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {INSTITUTIONAL_LINKS.map(({ to, label, icon: Icon, desc }) => (
                    <Link
                      key={to}
                      to={to}
                      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-accent/40 hover:shadow-md transition-all"
                    >
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-accent/10 flex-shrink-0">
                        <Icon className="h-5 w-5 text-accent" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-foreground group-hover:text-accent transition-colors">
                          {label}
                        </span>
                        <span className="block text-sm text-muted-foreground mt-0.5">{desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
