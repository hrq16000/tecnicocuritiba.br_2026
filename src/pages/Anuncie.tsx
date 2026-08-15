import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import {
  Megaphone,
  LayoutPanelTop,
  MapPin,
  Handshake,
  CheckCircle2,
  XCircle,
  MessageCircle,
  FileText,
} from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { FastHeader } from "@/components/FastHeader";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LocalFAQSection } from "@/components/LocalFAQSection";
import { siteConfig, whatsappLink } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick, trackFileDownload } from "@/lib/analytics";
import { PropostaMidiaForm } from "@/components/anuncie/PropostaMidiaForm";



const CTA_CLASS =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-bold text-accent-foreground shadow-[0_14px_34px_-10px_hsl(var(--accent)/0.6)] transition-transform hover:scale-[1.02]";

const formatos = [
  {
    icon: LayoutPanelTop,
    title: "Banner de topo (above the fold)",
    desc: "Espaço fixo no topo das páginas de serviço, visível antes da primeira rolagem em celular e desktop.",
    obs: "Formato responsivo. Sem pop-up, sem interstitial e sem bloqueio do conteúdo.",
  },
  {
    icon: FileText,
    title: "Bloco no meio do conteúdo",
    desc: "Inserção entre seções editoriais das páginas de conteúdo técnico (sintomas, guias e FAQ).",
    obs: "Sempre identificado como conteúdo publicitário, separado do conteúdo editorial.",
  },
  {
    icon: Handshake,
    title: "Patrocínio de seção",
    desc: "Assinatura discreta de marca em uma vertical inteira (ex.: TV, placas ou redes) por período contratado.",
    obs: "Não altera recomendações técnicas nem o conteúdo das páginas patrocinadas.",
  },
  {
    icon: MapPin,
    title: "Destaque local por cidade ou bairro",
    desc: "Presença de marca nas páginas locais de Curitiba e região metropolitana atendidas pelo portal.",
    obs: "Disponível apenas para as localidades já publicadas no portal.",
  },
];

const publico = [
  "Buscas comerciais por conserto, manutenção e suporte técnico em Curitiba e região metropolitana.",
  "Usuários residenciais com notebook, PC, TV, monitor e rede doméstica com defeito.",
  "Empresas e profissionais liberais procurando suporte de TI, backup e manutenção preventiva.",
  "Intenção alta: a maior parte das visitas chega por termos de problema, preço ou urgência.",
];

const regras = [
  "Todo anúncio é identificado como publicidade e fica separado do conteúdo editorial.",
  "Não vendemos menção editorial disfarçada, review pago nem recomendação técnica.",
  "Não publicamos avaliação, nota ou depoimento de terceiros que não seja real.",
  "Não aceitamos anúncios que violem as políticas de publicidade dos parceiros de mídia.",
  "Reservamo-nos o direito de recusar campanhas incompatíveis com o público do portal.",
];

const naoOferecemos = [
  "Não divulgamos números de audiência sem base verificável: métricas são enviadas sob consulta, direto dos painéis oficiais.",
  "Não garantimos volume de cliques, leads ou posição em buscadores.",
  "Não fazemos permuta por links pagos sem marcação adequada.",
];

const disponibilidade = [
  {
    regiao: "Curitiba — bairros com página publicada",
    formatos: "Banner de topo, bloco no meio do conteúdo e destaque local",
    situacao: "Aberto para reserva, uma marca por posição e por período",
  },
  {
    regiao: "Curitiba — demais bairros",
    formatos: "Banner de topo e bloco no meio do conteúdo (páginas gerais)",
    situacao: "Sem destaque local dedicado enquanto a página não for publicada",
  },
  {
    regiao: "Região metropolitana com página de cidade",
    formatos: "Banner de topo, bloco no meio do conteúdo e destaque local",
    situacao: "Aberto para reserva, sujeito a confirmação do período",
  },
  {
    regiao: "Verticais técnicas (TV, placas, monitor, redes)",
    formatos: "Patrocínio de seção e bloco no meio do conteúdo",
    situacao: "Exclusividade por vertical durante o período contratado",
  },
  {
    regiao: "Fora da área atendida pelo portal",
    formatos: "Nenhum",
    situacao: "Não comercializamos espaço em região que não atendemos",
  },
];

const faqPublicidade = [
  {
    question: "Quais formatos de anúncio existem no portal?",
    answer:
      "Banner de topo antes da primeira rolagem, bloco entre seções do conteúdo, patrocínio de uma vertical técnica inteira e destaque local nas páginas de cidade ou bairro já publicadas. Não usamos pop-up, interstitial nem formato que bloqueie a leitura.",
  },
  {
    question: "Qual é o prazo entre a aprovação e a peça no ar?",
    answer:
      "Depois que a peça, o link de destino e o período estiverem aprovados por escrito, a inserção entra na publicação seguinte do portal. Alterações de arte durante a campanha seguem o mesmo fluxo de aprovação.",
  },
  {
    question: "Em quais territórios posso anunciar?",
    answer:
      "Em Curitiba e nas cidades da região metropolitana que já têm página publicada no portal. Não vendemos destaque local para regiões que o portal não atende nem para páginas que ainda não existem.",
  },
  {
    question: "Como funciona a aprovação do anúncio?",
    answer:
      "Analisamos a peça antes da publicação: ela precisa ser identificável como publicidade, ter link de destino próprio e respeitar as políticas de publicidade dos parceiros de mídia. Campanhas incompatíveis com o público do portal podem ser recusadas.",
  },
  {
    question: "Vocês vendem review, nota ou recomendação técnica?",
    answer:
      "Não. O conteúdo editorial e as recomendações técnicas não estão à venda em nenhum formato, e não publicamos avaliação ou depoimento que não seja real.",
  },
  {
    question: "Vocês garantem número de cliques ou de leads?",
    answer:
      "Não. Entregamos espaço, período e posição contratados. As métricas de audiência são enviadas sob consulta, direto dos painéis oficiais, sem projeção inventada de resultado.",
  },
  {
    question: "Como confirmo a data e a posição da minha campanha?",
    answer:
      "Envie segmento, região, formato e período pelo WhatsApp comercial ou pela página de contato. Confirmamos a disponibilidade real da posição no período e a reserva passa a valer quando estiver registrada por escrito.",
  },
];


const Anuncie = () => {
  useEffect(() => {
    trackPageView("/anuncie", "Anuncie e patrocine");
  }, []);

  const waHref = whatsappLink(
    "Olá! Tenho interesse comercial em anunciar/patrocinar no portal Técnico em Curitiba. Pode me enviar o mídia kit e os formatos disponíveis?",
  );

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Anuncie e Patrocine | Mídia Kit do Técnico em Curitiba"
        description="Formatos de anúncio, posições recomendadas e regras de publicidade do portal Técnico em Curitiba. Fale com o comercial e receba o mídia kit atualizado."
        path="/anuncie"
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Anuncie", path: "/anuncie" },
        ]}
      />

      <FastHeader />
      <main className="pt-[var(--site-header-height)]">
        <Breadcrumbs items={[{ label: "Anuncie" }]} />

        <section className="border-b border-border/60 bg-secondary/40">
          <div className="container mx-auto py-12 md:py-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                <Megaphone className="h-4 w-4" />
                Espaço comercial e patrocínio
              </span>
              <h1 className="mt-5 text-3xl font-heading font-bold leading-tight text-foreground md:text-5xl">
                Anuncie no <span className="text-accent">Técnico em Curitiba</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                Portal de conteúdo técnico e atendimento em informática, TV, placas e redes em{" "}
                {siteConfig.primaryCity} e região metropolitana. Aqui você encontra os formatos disponíveis,
                as posições recomendadas e as regras de publicidade do portal.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CTA_CLASS}
                  data-cta-location="anuncie_hero"
                  onClick={() => trackCTAClick("whatsapp", "anuncie_hero")}
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar com o comercial
                </a>
                <Link
                  to="/contato"
                  className="inline-flex min-h-14 items-center justify-center rounded-lg border border-border px-6 text-base font-semibold text-foreground transition-colors hover:bg-secondary/60"
                >
                  Enviar proposta pelo contato
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Formatos e posições disponíveis
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Todos os formatos respeitam a leitura do conteúdo: nada de pop-up cobrindo a tela, autoplay com som
              ou anúncio que empurre o texto durante a rolagem.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {formatos.map((f) => (
                <article key={f.title} className="rounded-2xl border border-border bg-card p-6">
                  <f.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-heading font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-muted-foreground">{f.desc}</p>
                  <p className="mt-3 text-sm text-muted-foreground/90">{f.obs}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-secondary/30 py-12 md:py-16">
          <div className="container mx-auto grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
                Público e contexto do portal
              </h2>
              <ul className="mt-5 space-y-3">
                {publico.map((p) => (
                  <li key={p} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                Métricas de audiência (sessões, páginas mais acessadas e origem de tráfego) são enviadas sob
                consulta, extraídas dos painéis oficiais de analytics e do Search Console — não publicamos
                estimativas sem lastro.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
                Regras de publicidade
              </h2>
              <ul className="mt-5 space-y-3">
                {regras.map((r) => (
                  <li key={r} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 space-y-3">
                {naoOferecemos.map((n) => (
                  <li key={n} className="flex gap-3 text-muted-foreground">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 py-12 md:py-16">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Disponibilidade por cidade e bairro
            </h2>
            <p className="mt-4 text-muted-foreground">
              Só comercializamos destaque local em localidades que já possuem página publicada no portal.
              O quadro abaixo mostra a situação por região — a confirmação de datas e posições é sempre feita
              caso a caso, porque cada posição é exclusiva por período.
            </p>
            <div className="mt-8 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Disponibilidade de formatos publicitários por região atendida
                </caption>
                <thead className="bg-secondary/60 text-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Região</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Formatos liberados</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Situação</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {disponibilidade.map((linha) => (
                    <tr key={linha.regiao} className="border-t border-border/60">
                      <th scope="row" className="px-4 py-3 font-semibold text-foreground">
                        {linha.regiao}
                      </th>
                      <td className="px-4 py-3">{linha.formatos}</td>
                      <td className="px-4 py-3">{linha.situacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-5">
              <h3 className="text-base font-heading font-bold text-foreground">
                Como confirmar datas e posicionamentos
              </h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Envie segmento, região desejada, formato e o período pretendido.</li>
                <li>Verificamos se a posição está livre no período e devolvemos a disponibilidade real.</li>
                <li>
                  Aprovada a peça (arquivo, link de destino e identificação de publicidade), a inserção entra
                  na próxima publicação do portal.
                </li>
                <li>
                  A reserva só é considerada confirmada por escrito, com período, formato e região definidos.
                </li>
              </ol>
            </div>
          </div>
        </section>

        <LocalFAQSection title="Perguntas frequentes sobre anunciar no portal" faqs={faqPublicidade} />

        <section className="py-12 md:py-16">

          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Transparência, cookies e privacidade
            </h2>
            <p className="mt-4 text-muted-foreground">
              O portal exibe publicidade de terceiros e opera com banner de consentimento configurável
              (anúncios e análise) integrado ao Consent Mode v2. O visitante pode recusar cookies opcionais a
              qualquer momento e continuar navegando normalmente.
            </p>
            <ul className="mt-6 space-y-2 text-muted-foreground">
              <li>
                <Link to="/politica-de-cookies-e-anuncios" className="text-accent underline underline-offset-4">
                  Política de cookies e anúncios
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidade" className="text-accent underline underline-offset-4">
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link to="/status-de-anuncios" className="text-accent underline underline-offset-4">
                  Status de anúncios (verificação do ads.txt)
                </Link>
              </li>
              <li>
                <Link to="/termos-e-condicoes" className="text-accent underline underline-offset-4">
                  Termos e condições de uso
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section id="proposta" className="border-t border-border/60 py-12 md:py-16">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Peça sua proposta em um minuto
            </h2>
            <p className="mt-4 text-muted-foreground">
              Informe segmento, cidade/bairro, formato e período. Confirmamos a disponibilidade real da posição
              no período pedido — a reserva passa a valer quando estiver registrada por escrito.
            </p>
            <div className="mt-8">
              <PropostaMidiaForm />
            </div>
          </div>
        </section>



        <section className="border-t border-border/60 bg-secondary/40 py-12 md:py-16">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Receba o mídia kit atualizado
            </h2>
            <p className="mt-4 text-muted-foreground">
              Envie o segmento, a região de interesse e o período da campanha. Respondemos com formatos
              disponíveis, posições livres e as métricas atuais do portal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
                data-cta-location="anuncie_final"
                onClick={() => trackCTAClick("whatsapp", "anuncie_final")}
              >
                <MessageCircle className="h-5 w-5" />
                Solicitar mídia kit
              </a>
              <a
                href="/midia-kit-tecnico-curitiba.pdf"
                target="_blank"
                rel="noopener"
                download
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-border px-6 text-base font-semibold text-foreground transition-colors hover:bg-secondary/60"
                data-cta-location="anuncie_midia_kit_pdf"
                onClick={() => trackFileDownload("midia-kit-tecnico-curitiba.pdf", "anuncie_midia_kit_pdf")}

              >
                <FileText className="h-5 w-5" />
                Baixar mídia kit em PDF
              </a>
              <Link
                to="/servicos"
                className="inline-flex min-h-14 items-center justify-center rounded-lg border border-border px-6 text-base font-semibold text-foreground transition-colors hover:bg-secondary/60"
              >
                Ver páginas de serviço do portal
              </Link>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Anuncie;
