import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Helmet } from "react-helmet";
import { useCanonical } from "@/lib/canonicalUrl";
import { ArrowLeft, MessageCircle, CalendarCheck, CheckCircle2 } from "lucide-react";
import {
  EQUIPMENTS,
  type DiagnosticBranch,
  type DiagnosticLeaf,
  type DiagnosticNode,
  isLeaf,
} from "@/lib/diagnostico60sTree";

const WA_NUMBER = "5541997086380";

function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

type Step =
  | { kind: "equipment" }
  | { kind: "node"; node: DiagnosticNode; equipmentSlug: string; path: string[] }
  | { kind: "leaf"; leaf: DiagnosticLeaf; equipmentSlug: string; path: string[] };

function findLeaf(
  node: DiagnosticNode,
  ids: string[],
): { leaf?: DiagnosticLeaf; node: DiagnosticNode; path: string[] } {
  if (ids.length === 0) return { node, path: [] };
  const [head, ...rest] = ids;
  const opt = node.options.find((o) => o.id === head);
  if (!opt) return { node, path: [] };
  if (isLeaf(opt)) return { leaf: opt, node, path: [head] };
  const sub = findLeaf(opt.next, rest);
  return { ...sub, path: [head, ...sub.path] };
}

export default function Diagnostico60s() {
  const [params, setParams] = useSearchParams();
  const eq = params.get("eq");
  const pathParam = params.get("p");

  const step: Step = useMemo(() => {
    if (!eq) return { kind: "equipment" };
    const equipment = EQUIPMENTS.find((e) => e.slug === eq);
    if (!equipment) return { kind: "equipment" };
    const ids = pathParam ? pathParam.split(".") : [];
    const r = findLeaf(equipment.root, ids);
    if (r.leaf) return { kind: "leaf", leaf: r.leaf, equipmentSlug: equipment.slug, path: r.path };
    return { kind: "node", node: r.node, equipmentSlug: equipment.slug, path: r.path };
  }, [eq, pathParam]);

  useCanonical("https://tecnico.curitiba.br/diagnostico-60s");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [eq, pathParam]);

  function goEquipment(slug: string) {
    setParams({ eq: slug });
  }
  function goOption(opt: DiagnosticBranch | DiagnosticLeaf, currentPath: string[]) {
    const newPath = [...currentPath, opt.id].join(".");
    setParams({ eq: eq!, p: newPath });
  }
  function goBack() {
    if (step.kind === "equipment") return;
    const path = step.path.slice(0, -1);
    if (path.length === 0) setParams({ eq: step.equipmentSlug });
    else setParams({ eq: step.equipmentSlug, p: path.join(".") });
  }
  function reset() {
    setParams({});
  }

  // FAQPage schema construído a partir das folhas mais comuns.
  const faqJsonLd = useMemo(() => {
    const faqs: Array<{ q: string; a: string }> = [];
    for (const equipment of EQUIPMENTS) {
      for (const opt of equipment.root.options) {
        if (isLeaf(opt)) {
          faqs.push({
            q: `${equipment.label}: ${opt.label.toLowerCase()}, o que fazer?`,
            a: opt.advice,
          });
        } else {
          for (const sub of opt.next.options) {
            if (isLeaf(sub)) {
              faqs.push({
                q: `${equipment.label}: ${sub.label.toLowerCase()}`,
                a: sub.advice,
              });
            }
          }
        }
      }
    }
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.slice(0, 25).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Diagnóstico em 60s — Assistência Técnica Curitiba</title>
        <meta
          name="description"
          content="Descubra em 60 segundos o que está acontecendo com seu notebook, TV, celular, impressora ou Wi-Fi. Diagnóstico guiado + WhatsApp direto com técnico em Curitiba."
        />
        <meta property="og:title" content="Diagnóstico em 60s — Técnico em Curitiba" />
        <meta property="og:url" content="https://tecnico.curitiba.br/diagnostico-60s" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto max-w-3xl px-4 py-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao site
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">Diagnóstico em 60s</h1>
          <p className="text-muted-foreground mt-2">
            Responda 1–3 perguntas e receba uma recomendação técnica + atendimento direto no
            WhatsApp.
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-8">
        {step.kind === "equipment" && (
          <section aria-labelledby="eq-q">
            <h2 id="eq-q" className="text-xl font-semibold mb-4">
              Qual equipamento está com problema?
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {EQUIPMENTS.map((e) => (
                <button
                  key={e.slug}
                  onClick={() => goEquipment(e.slug)}
                  className="text-left p-5 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all"
                  data-funnel-skip="1"
                >
                  <div className="text-3xl mb-2" aria-hidden>
                    {e.emoji}
                  </div>
                  <div className="font-semibold">{e.label}</div>
                  <div className="text-sm text-muted-foreground">{e.tagline}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step.kind === "node" && (
          <section aria-labelledby="node-q">
            <button
              onClick={goBack}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3"
              data-funnel-skip="1"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 id="node-q" className="text-xl font-semibold mb-4">
              {step.node.question}
            </h2>
            <div className="grid gap-3">
              {step.node.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => goOption(opt, step.path)}
                  className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all"
                  data-funnel-skip="1"
                >
                  <div className="font-semibold">{opt.label}</div>
                  {isLeaf(opt) && opt.description && (
                    <div className="text-sm text-muted-foreground mt-1">{opt.description}</div>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {step.kind === "leaf" && (
          <section aria-labelledby="leaf-q">
            <button
              onClick={goBack}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3"
              data-funnel-skip="1"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>

            <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h2 id="leaf-q" className="text-xl font-bold">
                    {step.leaf.label}
                  </h2>
                  {step.leaf.description && (
                    <p className="text-muted-foreground mt-1">{step.leaf.description}</p>
                  )}
                </div>
              </div>

              <div className="mt-5 p-4 rounded-lg bg-background border border-border">
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                  Recomendação do técnico
                </div>
                <p className="text-base leading-relaxed">{step.leaf.advice}</p>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a
                  href={waLink(step.leaf.waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-medium="diagnostico-60s"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" /> Falar no WhatsApp agora
                </a>
                <a
                  href={waLink("Olá! Quero agendar atendimento técnico em Curitiba.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border bg-card font-semibold hover:bg-muted transition-colors"
                >
                  <CalendarCheck className="w-5 h-5" /> Agendar no WhatsApp
                </a>
              </div>

              {step.leaf.relatedHref && (
                <div className="mt-4 text-sm">
                  <Link
                    to={step.leaf.relatedHref}
                    className="text-primary hover:underline font-medium"
                  >
                    → {step.leaf.relatedLabel ?? "Ver serviço relacionado"}
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={reset}
                className="text-sm text-muted-foreground hover:text-foreground underline"
                data-funnel-skip="1"
              >
                Diagnosticar outro equipamento
              </button>
            </div>
          </section>
        )}

        <aside className="mt-12 p-5 rounded-xl border border-border bg-muted/30 text-sm">
          <strong className="block mb-1">Por que esse diagnóstico funciona?</strong>
          Mais de 90% dos chamados na nossa bancada caem em 1 de 15 padrões. Pré-classificar
          poupa tempo, evita visita desnecessária e já chega no atendimento certo. Atendemos em
          Curitiba e região metropolitana.
        </aside>
      </main>
    </div>
  );
}
