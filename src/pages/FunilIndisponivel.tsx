import { Link } from "@/lib/router-compat";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageCircle, AlertTriangle } from "lucide-react";
import { appendUtmsToUrl } from "@/lib/utmCapture";
import { withVideoWarning } from "@/lib/funnelWarning";

const WHATSAPP_NUMBER = "5541997086380";

const FALLBACK_TEXT = withVideoWarning(
  "Olá! Tive um problema técnico no formulário do site e gostaria de falar com um atendente.",
);


/**
 * Rota fallback quando o insert de submission falha.
 * Link direto para WhatsApp com data-funnel-skip="1" para não reabrir o funil.
 */

const FunilIndisponivel = () => {
  const url = (() => {
    try {
      const u = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
      u.searchParams.set("text", FALLBACK_TEXT);
      return appendUtmsToUrl(u).toString();
    } catch {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(FALLBACK_TEXT)}`;
    }
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Funil temporariamente indisponível | Técnico Curitiba</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-xl">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold mb-2">Não conseguimos abrir o formulário agora</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Tivemos uma instabilidade no envio das suas mídias ou no nosso sistema. Para não te deixar esperando,
            você pode falar direto no WhatsApp — sem triagem prévia.
            Apenas tente já enviar fotos do equipamento na primeira mensagem.
          </p>
          <Button
            asChild
            className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white gap-2"
            size="lg"
          >
            <a href={url} target="_blank" rel="noopener noreferrer" data-funnel-skip="1">
              <MessageCircle className="h-5 w-5" /> Falar no WhatsApp agora
            </a>
          </Button>
          <p className="mt-6 text-xs text-muted-foreground">
            Prefere tentar de novo?{" "}
            <Link to="/" className="underline hover:text-foreground">Voltar ao início</Link>
            {" · "}
            <Link to="/termos-e-condicoes" className="underline hover:text-foreground">Ver termos</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FunilIndisponivel;
