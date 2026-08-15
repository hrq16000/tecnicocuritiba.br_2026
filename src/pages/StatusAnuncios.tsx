import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "@/lib/router-compat";
import { useCanonical } from "@/lib/canonicalUrl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CheckCircle2, XCircle, FileText, Cookie, ShieldCheck } from "lucide-react";

const CANONICAL = "https://tecnico.curitiba.br/status-de-anuncios";

type AdsStatus = {
  checkedAt: string;
  origin: string;
  publisherId: string;
  ok: boolean;
  results: Array<{ check: string; ok: boolean; detail: string }>;
};

type BuildStatus = {
  startedAt: string;
  finishedAt: string;
  ok: boolean;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  gates: Array<{
    id: string;
    label: string;
    status: "ok" | "fail" | "skipped";
    detail: string;
    durationMs: number;
    checkedAt: string;
  }>;
};

const StatusAnuncios = () => {
  useCanonical(CANONICAL);
  const [status, setStatus] = useState<AdsStatus | null>(null);
  const [build, setBuild] = useState<BuildStatus | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    fetch("/ads-status.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStatus)
      .catch(() => setErro(true));
    fetch("/build-status.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setBuild)
      .catch(() => setBuild(null));
  }, []);


  return (
    <>
      <Helmet>
        <title>Status de Anúncios e Transparência | Técnico em Curitiba</title>
        <meta
          name="description"
          content="Estado da verificação do ads.txt, do identificador de publisher e das políticas de cookies e privacidade do tecnico.curitiba.br."
        />
        <meta property="og:title" content="Status de Anúncios e Transparência" />
        <meta property="og:url" content={CANONICAL} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Header />
      <main className="bg-background">
        <PageHero
          title="Status de anúncios e transparência"
          subtitle="Verificação automática do ads.txt, do publisher ID e dos documentos de privacidade."
        />

        <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
          <section className="mb-10 rounded-2xl border border-border bg-muted/30 p-5">
            <h2 className="text-lg font-heading font-bold text-foreground mb-3">
              Última verificação automática
            </h2>
            {erro && (
              <p className="text-sm text-muted-foreground">
                Relatório ainda não gerado neste ambiente. Ele é criado a cada build/deploy.
              </p>
            )}
            {status && (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Origem: <strong>{status.origin}</strong> · Publisher:{" "}
                  <strong>{status.publisherId}</strong> · Executada em{" "}
                  {new Date(status.checkedAt).toLocaleString("pt-BR")}
                </p>
                <ul className="space-y-2">
                  {status.results.map((r) => (
                    <li key={r.check} className="flex items-start gap-2 text-[15px]">
                      {r.ok ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                      )}
                      <span className="text-foreground/85">
                        <strong className="text-foreground">{r.check}</strong> — {r.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {build && (
            <section className="mb-10 rounded-2xl border border-border bg-muted/30 p-5">
              <h2 className="text-lg font-heading font-bold text-foreground mb-3">
                Validações executadas no último build
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {build.passed}/{build.total} gates aprovados · {build.failed} falha(s) ·{" "}
                {build.skipped} pulado(s) · concluído em{" "}
                {new Date(build.finishedAt).toLocaleString("pt-BR")}
              </p>
              <ul className="space-y-2">
                {build.gates.map((g) => (
                  <li key={g.id} className="flex items-start gap-2 text-[15px]">
                    {g.status === "ok" ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <XCircle
                        className={`mt-0.5 h-5 w-5 shrink-0 ${g.status === "fail" ? "text-destructive" : "text-muted-foreground"}`}
                      />
                    )}
                    <span className="text-foreground/85">
                      <strong className="text-foreground">{g.label}</strong> — {g.detail}{" "}
                      <span className="text-muted-foreground">
                        ({g.durationMs}ms · {new Date(g.checkedAt).toLocaleTimeString("pt-BR")})
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}



          <section className="mb-10">
            <h2 className="text-lg font-heading font-bold text-foreground mb-3">Documentos e arquivos</h2>
            <ul className="space-y-2 text-[15px]">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                <a className="text-accent underline" href="/ads.txt" rel="noopener">/ads.txt</a>
              </li>
              <li className="flex items-center gap-2">
                <Cookie className="h-4 w-4 text-accent" />
                <Link className="text-accent underline" to="/politica-de-cookies-e-anuncios">
                  Política de Cookies e Anúncios
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <Link className="text-accent underline" to="/politica-de-privacidade">
                  Política de Privacidade
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                <Link className="text-accent underline" to="/termos-e-condicoes">
                  Termos e Condições
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                <a className="text-accent underline" href="/sitemap.xml" rel="noopener">/sitemap.xml</a>
                {" · "}
                <a className="text-accent underline" href="/robots.txt" rel="noopener">/robots.txt</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-bold text-foreground mb-3">Como o consentimento funciona</h2>
            <p className="text-foreground/85 text-[15px] leading-relaxed">
              O site carrega com todos os sinais do Consent Mode v2 negados. O script{" "}
              <code>adsbygoogle</code> só é injetado depois do aceite de anúncios no banner, e cada
              decisão é registrada (sem dados pessoais) para auditoria de conformidade.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default StatusAnuncios;
