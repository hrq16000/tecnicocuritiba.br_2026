import { Link } from "@/lib/router-compat";
import { Star, MessageCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";

const PATH = "/como-avaliar";

const PASSOS = [
  {
    titulo: "1. Abra o link enviado no WhatsApp",
    texto:
      "Depois que o atendimento é finalizado, você recebe uma mensagem com o link da avaliação já preenchido com o número da sua ordem de serviço, o bairro e o serviço executado. Isso evita que você precise digitar qualquer dado técnico.",
  },
  {
    titulo: "2. Dê a nota em estrelas",
    texto:
      "A nota vai de 1 a 5 estrelas e considera o que importa no atendimento: clareza do diagnóstico, prazo cumprido, preço combinado antes do serviço e resultado final no equipamento.",
  },
  {
    titulo: "3. Escreva o que foi resolvido",
    texto:
      "Descreva em poucas linhas o problema e o que mudou depois do atendimento. Comentários concretos ajudam muito mais outros clientes do que elogios genéricos — e são exatamente o que o Google valoriza.",
  },
  {
    titulo: "4. Autorize (ou não) a publicação",
    texto:
      "A publicação no site só acontece se você marcar a autorização. Sem essa marcação, a avaliação fica registrada apenas internamente, como retorno de qualidade, e nunca aparece publicamente.",
  },
  {
    titulo: "5. Aguarde a moderação",
    texto:
      "Toda avaliação passa por conferência: confirmamos que existe uma ordem de serviço correspondente antes de publicar. Quando ela for aprovada e publicada, você recebe um aviso no mesmo WhatsApp do atendimento.",
  },
];

const ComoAvaliar = () => {
  const abrirWhatsApp = () => {
    trackCTAClick("whatsapp", "como_avaliar");
    const msg = encodeURIComponent(
      "Olá! Fui atendido e quero o link para registrar minha avaliação.",
    );
    window.open(`https://wa.me/${siteConfig.phoneE164.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  return (
    <>
      <PageSEO
        title="Como avaliar o atendimento | Técnico em Curitiba"
        description="Passo a passo para registrar sua avaliação com estrelas após o atendimento, autorizar a publicação no site e acompanhar a moderação."
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Como avaliar", path: PATH },
        ]}
      />
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Como avaliar o atendimento
          </h1>
          <p className="text-muted-foreground mb-8">
            Sua avaliação leva menos de um minuto e é o que ajuda outra pessoa na mesma
            situação a decidir com segurança. Abaixo está exatamente como funciona, do
            link no WhatsApp até a publicação no site.
          </p>

          <ol className="space-y-4 mb-10">
            {PASSOS.map((p) => (
              <li key={p.titulo} className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  {p.titulo}
                </h2>
                <p className="text-sm text-muted-foreground">{p.texto}</p>
              </li>
            ))}
          </ol>

          <section className="rounded-xl border border-border bg-card p-5 mb-10">
            <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              O que fazemos com os seus dados
            </h2>
            <p className="text-sm text-muted-foreground">
              Guardamos apenas o nome informado, a nota, o comentário, o bairro e o
              serviço. O número de telefone nunca é publicado. Você pode pedir a remoção
              da avaliação e dos seus dados a qualquer momento em{" "}
              <Link to="/excluir-meus-dados" className="text-primary underline">
                excluir meus dados
              </Link>{" "}
              e conferir o tratamento completo na{" "}
              <Link to="/politica-de-privacidade" className="text-primary underline">
                política de privacidade
              </Link>
              .
            </p>
          </section>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/avaliar">
                <Star className="w-5 h-5 mr-2" />
                Avaliar agora
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={abrirWhatsApp}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Pedir o link no WhatsApp
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Quer ver as avaliações já publicadas? Elas ficam em{" "}
            <Link to="/depoimentos" className="text-primary underline">
              depoimentos
            </Link>
            , com filtro por bairro e por serviço.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ComoAvaliar;
