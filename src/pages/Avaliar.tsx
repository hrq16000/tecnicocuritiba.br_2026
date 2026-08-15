import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "@/lib/router-compat";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackReviewLinkOpen, trackReviewSubmit } from "@/lib/funnelAnalytics";
import { checkAntiSpam, markSubmitted, alreadySubmitted } from "@/lib/reviewAntiSpam";


const MIN_COMMENT = 10;

const Avaliar = () => {
  const [params] = useSearchParams();
  const { toast } = useToast();

  const protocolo = params.get("os") ?? "";
  const servico = params.get("servico") ?? "";
  const bairro = params.get("bairro") ?? "";

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [nome, setNome] = useState("");
  const [comentario, setComentario] = useState("");
  const [autoriza, setAutoriza] = useState(true);
  const [lgpd, setLgpd] = useState(false);
  const [tentou, setTentou] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  // Anti-spam: honeypot invisível + tempo mínimo de permanência.
  const [honeypot, setHoneypot] = useState("");
  const [openedAt] = useState(() => Date.now());
  const [duplicado, setDuplicado] = useState(false);

  useEffect(() => {
    setDuplicado(alreadySubmitted(protocolo));
    trackReviewLinkOpen({
      protocolo: protocolo || null,
      utmSource: params.get("utm_source"),
      servico: servico || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const erros = useMemo(
    () => ({
      rating: rating < 1,
      nome: nome.trim().length < 2,
      comentario: comentario.trim().length < MIN_COMMENT,
      lgpd: !lgpd,
    }),
    [rating, nome, comentario, lgpd],
  );
  const invalido = Object.values(erros).some(Boolean);
  const alerta = (campo: keyof typeof erros) =>
    tentou && erros[campo] ? "field-alert" : "";

  const enviar = async () => {
    setTentou(true);
    if (invalido) {
      toast({
        title: "Faltam informações",
        description: "Preencha os campos destacados para enviar sua avaliação.",
        variant: "destructive",
      });
      return;
    }
    const verdict = checkAntiSpam({ honeypot, openedAt, protocolo });
    if (verdict.ok === false) {
      if (verdict.reason === "duplicate") setDuplicado(true);
      toast({
        title: "Envio não concluído",
        description: verdict.message,
        variant: "destructive",
      });
      return;
    }
    setEnviando(true);

    const { error } = await supabase.from("reviews").insert({
      author_name: nome.trim().slice(0, 80),
      rating,
      comment: comentario.trim().slice(0, 1500),
      source: "site",
      verified: false,
      published: false,
      authorized_publication: autoriza,
      service_slug: servico ? servico.slice(0, 80) : null,
      neighborhood: bairro ? bairro.slice(0, 80) : null,
      city: "Curitiba",
      origin_protocol: protocolo ? protocolo.slice(0, 40) : null,
      origin_path: "/avaliar",
    });
    setEnviando(false);
    if (error) {
      toast({
        title: "Não foi possível registrar agora",
        description: "Tente novamente em instantes ou responda direto no WhatsApp.",
        variant: "destructive",
      });
      return;
    }
    markSubmitted(protocolo);
    trackReviewSubmit({ rating, authorized: autoriza, servico, bairro });
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Avaliar atendimento | Técnico em Curitiba"
        description="Registre sua avaliação com estrelas do atendimento técnico em Curitiba e autorize (ou não) a publicação do comentário no site."
        path="/avaliar"
        noindex
      />
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Como foi o seu atendimento?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sua nota ajuda a manter o padrão do serviço e orienta outros moradores de Curitiba e
            região. Leva menos de um minuto.
            {protocolo && (
              <>
                {" "}Ordem de serviço <strong className="text-foreground">{protocolo}</strong>.
              </>
            )}
          </p>

          {enviado || duplicado ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-accent" aria-hidden="true" />
              <h2 className="mt-3 font-heading text-xl font-semibold text-foreground">
                {enviado ? "Avaliação registrada" : "Avaliação já recebida"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {!enviado
                  ? "Este atendimento já tem uma avaliação registrada por aqui. Se precisar corrigir algo, fale com a gente pelo WhatsApp."
                  : autoriza
                    ? "Obrigado! Seu comentário passará por conferência antes de aparecer no site."
                    : "Obrigado! Seu retorno ficará apenas como feedback interno, sem publicação."}
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-5 md:p-7">
              {/* honeypot anti-bot — invisível para pessoas, ignorado por leitores de tela */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <fieldset>
                <legend className="text-sm font-semibold text-foreground">Sua nota</legend>
                <div
                  className={`mt-3 inline-flex gap-1 rounded-xl p-1 ${alerta("rating")}`}
                  role="radiogroup"
                  aria-label="Nota de 1 a 5 estrelas"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(n)}
                      className="p-1"
                    >
                      <Star
                        className={`h-9 w-9 ${
                          (hover || rating) >= n
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="nome" className="text-sm font-semibold text-foreground">
                  Seu primeiro nome
                </label>
                <input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  maxLength={80}
                  className={`mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground ${alerta("nome")}`}
                  placeholder="Ex.: Anderson"
                />
              </div>

              <div>
                <label htmlFor="comentario" className="text-sm font-semibold text-foreground">
                  Como foi o serviço?
                </label>
                <textarea
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  maxLength={1500}
                  rows={5}
                  className={`mt-2 w-full rounded-xl border border-input bg-background p-4 text-foreground ${alerta("comentario")}`}
                  placeholder="Conte o que foi resolvido, prazo e atendimento."
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Mínimo de {MIN_COMMENT} caracteres. Não inclua telefone, endereço ou dados pessoais.
                </p>
              </div>

              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={autoriza}
                  onChange={(e) => setAutoriza(e.target.checked)}
                  className="mt-1 h-5 w-5"
                />
                <span>
                  Autorizo a publicação do meu comentário e primeiro nome no site. Sem esta marcação,
                  a avaliação é usada apenas internamente.
                </span>
              </label>

              <label
                className={`flex items-start gap-3 rounded-xl p-2 text-sm text-muted-foreground ${alerta("lgpd")}`}
              >
                <input
                  type="checkbox"
                  checked={lgpd}
                  onChange={(e) => setLgpd(e.target.checked)}
                  className="mt-1 h-5 w-5"
                />
                <span>
                  Li e concordo que os dados enviados serão usados para conferência do atendimento
                  (LGPD). Posso solicitar a exclusão a qualquer momento em{" "}
                  <a href="/excluir-meus-dados" className="underline">
                    exclusão de dados
                  </a>
                  .
                </span>
              </label>

              <Button
                onClick={enviar}
                disabled={enviando}
                className="min-h-12 w-full text-base font-semibold"
              >
                {enviando ? "Enviando..." : "Enviar avaliação"}
              </Button>

              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                Toda avaliação passa por conferência antes de aparecer no site. Publicamos apenas as
                autorizadas e vinculadas a um atendimento real.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Avaliar;
