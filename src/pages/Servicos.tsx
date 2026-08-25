import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import {
  Monitor,
  Laptop,
  Cpu,
  HardDrive,
  ShieldCheck,
  Database,
  Wifi,
  Wrench,
  Building2,
  Tv,
  CircuitBoard,
  ArrowRight,
} from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExperienciaBadge } from "@/components/social-proof/ExperienciaBadge";
import { GarantiaNotaFiscalPagamento } from "@/components/comercial/GarantiaNotaFiscalPagamento";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { siteConfig, whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { SERVICOS_CORE } from "@/lib/servicosCore";

const FAQS = [
  {
    question: "Como começa o atendimento e em quanto tempo tenho retorno?",
    answer:
      "O atendimento começa por uma triagem no WhatsApp: você descreve o equipamento e o sintoma e recebe a orientação do próximo passo, que pode ser acesso remoto, visita ou coleta. O retorno depende da disponibilidade de agenda do dia, e informamos a janela real em vez de prometer prazo fixo.",
  },
  {
    question: "Vocês informam o valor antes de executar o serviço?",
    answer:
      "Sim. Nenhum serviço é executado sem aprovação: o escopo e o valor são apresentados antes da execução. Peças e componentes são cobrados à parte da mão de obra e também dependem da sua autorização expressa.",
  },
  {
    question: "Qual serviço escolher se eu não sei qual é o problema?",
    answer:
      "Não precisa saber. Descreva o sintoma na triagem e nós indicamos o caminho. Se preferir ler antes, as páginas de sintoma explicam os cenários mais comuns de notebook que não liga e de computador lento.",
  },
  {
    question: "O serviço pode ser feito remotamente ou precisa ser presencial?",
    answer:
      "Depende da causa. Problemas de sistema, configuração, lentidão por software e suporte a home office costumam ser resolvidos por acesso remoto. Falhas de hardware, tela, energia e reparo de placa exigem atendimento presencial ou coleta para bancada.",
  },
  {
    question: "Atendem empresas e não apenas usuários domésticos?",
    answer:
      "Sim. Além dos serviços para uso doméstico, atendemos empresas com suporte técnico, manutenção preventiva, redes e Wi-Fi corporativo e rotinas de backup, de forma pontual ou recorrente.",
  },
  {
    question: "Existe garantia do serviço executado?",
    answer:
      "Sim. A mão de obra do serviço executado tem 90 dias de garantia no mesmo defeito tratado, e peças seguem a garantia do fornecedor ou fabricante. Nota fiscal de serviço é emitida mediante solicitação.",
  },
];


const CTA_BASE =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-7 text-base font-bold text-accent-foreground shadow-[0_14px_34px_-10px_hsl(var(--accent)/0.6)] transition-transform hover:scale-[1.02]";

const CARDS = [
  { slug: "formatacao", icon: Monitor, blurb: "Windows lento ou corrompido? Formatação com backup e sistema pronto para o uso." },
  { slug: "manutencao-de-notebook", icon: Laptop, blurb: "Aquecimento, tela, teclado, bateria e lentidão — com diagnóstico antes de informar o valor." },
  { slug: "manutencao-de-computador", icon: Cpu, blurb: "Desktop travando ou sem vídeo? Fonte, memória, armazenamento e placa-mãe avaliados." },
  { slug: "montagem-de-pc", icon: Wrench, blurb: "Peças novas ou já compradas: compatibilidade verificada, montagem e testes antes da entrega." },
  { slug: "upgrade-ssd-ram", icon: HardDrive, blurb: "Ganho real de desempenho com SSD e memória, respeitando a compatibilidade." },
  { slug: "remocao-de-virus", icon: ShieldCheck, blurb: "Pop-ups, lentidão e navegador sequestrado, com atenção aos seus dados." },
  { slug: "recuperacao-de-dados", icon: Database, blurb: "HD, SSD e pendrive: avaliação primeiro. Recuperação não é garantida." },
  { slug: "redes-e-wifi", icon: Wifi, blurb: "Wi-Fi caindo ou sinal fraco em casa e na empresa? Cobertura e estabilidade." },
  { slug: "suporte-tecnico-empresarial", icon: Building2, blurb: "Estações, rede, impressoras e backups, pontual ou recorrente sob consulta." },
  { slug: "conserto-tv", icon: Tv, blurb: "TV LED, LCD e Smart TV: avaliação em bancada com coleta e entrega, sem visita." },
  { slug: "conserto-placa", icon: CircuitBoard, blurb: "Placa de notebook, PC e TV reparada em nível de componente quando é viável." },
] as const;

const TITLE = "Serviços de Informática em Curitiba | PC e Notebook";
const DESCRIPTION =
  "Conheça os serviços de formatação, manutenção de computadores e notebooks, SSD, vírus, recuperação de dados, Wi-Fi e suporte empresarial.";

const Servicos = () => {
  useEffect(() => {
    trackPageView("/servicos", "Serviços");
  }, []);

  const waHref = whatsappLink("Olá! Gostaria de saber mais sobre os serviços.");
  const handleCta = () => trackCTAClick("whatsapp", "servicos-hub");

  useJsonLdSlot(
    SCHEMA_SLOTS.faq,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${absoluteUrl("/servicos")}#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    SLOT_PRIORITY.page,
  );



  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path="/servicos"
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Serviços", path: "/servicos" },
        ]}
      />
      <LocalBusinessJsonLd
        path="/servicos"
        description={DESCRIPTION}
        services={CARDS.map((c) => ({ name: c.slug.replace(/-/g, " "), url: `/servicos/${c.slug}` }))}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Serviços" }]} />
      <main id="conteudo">

      {/* Hero — identidade "centro técnico local premium" */}
      <section className="relative overflow-hidden bg-[hsl(var(--hero-bg))] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hero-bg))] via-[hsl(205_55%_16%)] to-[hsl(var(--hero-bg-end))]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />
        <div className="container relative z-10 mx-auto py-14 md:py-20">
          <div className="max-w-3xl">
            <ExperienciaBadge tone="hero" suffix="Serviços em Curitiba" />

            <h1 className="mt-5 font-heading text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
              Serviços de informática em Curitiba
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              Assistência técnica focada em computadores, notebooks, redes e empresas. O atendimento
              começa por uma triagem no WhatsApp: você descreve o problema, recebe orientação e o
              valor é aprovado antes de qualquer serviço.
            </p>
            <div className="mt-7">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCta}
                data-cta-location="servicos_hub_hero"
                className={CTA_BASE}
              >
                Iniciar atendimento no WhatsApp
              </a>
            </div>
            <p className="mt-5 text-sm text-white/70">
              Curitiba e região • A partir de {siteConfig.minPriceLabel} • Diagnóstico honesto, sem
              promessa falsa
            </p>
          </div>
        </div>
      </section>

      {/* Grid dos 8 serviços essenciais */}
      <section className="py-14 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
            Serviços essenciais
          </h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Encontre o serviço adequado para seu computador, notebook, rede ou empresa. Cada página
            explica os sintomas atendidos, o processo e o que pode influenciar o valor do atendimento.
          </p>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Procurando pelo sintoma? Comece pelo{" "}
            <Link to="/problemas" className="font-medium text-[hsl(var(--accent))] hover:underline">
              hub de problemas atendidos em Curitiba
            </Link>
            , que organiza as falhas por equipamento, ou vá direto para{" "}
            <Link to="/problemas/notebook-nao-liga" className="font-medium text-[hsl(var(--accent))] hover:underline">
              Notebook não liga: sinais, causas possíveis e diagnóstico
            </Link>{" "}
            ou{" "}
            <Link to="/problemas/computador-lento" className="font-medium text-[hsl(var(--accent))] hover:underline">
              Computador lento: causas e o que realmente resolve
            </Link>
            .
          </p>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Quer entender o problema antes de escolher o serviço? O{" "}
            <Link
              to="/guia-tecnico-informatica"
              className="font-medium text-[hsl(var(--accent))] hover:underline"
            >
              guia técnico de manutenção de PC e notebook
            </Link>{" "}
            reúne as famílias de falha, o checklist prévio e o que realmente melhora o desempenho.
            Para atendimento local, veja{" "}
            <Link
              to="/tecnico-informatica-curitiba"
              className="font-medium text-[hsl(var(--accent))] hover:underline"
            >
              técnico de informática em Curitiba
            </Link>
            .
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map(({ slug, icon: Icon, blurb }) => {
              const data = SERVICOS_CORE[slug];
              return (
                <div
                  key={slug}
                  className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-[hsl(var(--accent))]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-[hsl(var(--accent))]">
                    <Link to={`/servicos/${slug}`} className="focus-visible:underline">
                      {data.serviceName}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{blurb}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={whatsappLink(
                        `Olá! Preciso de ${data.serviceName.toLowerCase()} em Curitiba. Pode me ajudar?`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackCTAClick("whatsapp", `servicos_card_${slug}`)}
                      data-cta-location={`servicos_card_${slug}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[hsl(var(--accent))] px-4 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02]"
                    >
                      Falar sobre este serviço
                    </a>
                    <Link
                      to={`/servicos/${slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--accent))] hover:underline"
                    >
                      Ver detalhes
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Triagem: sintoma → serviço indicado */}
      <section className="py-14 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Qual serviço resolve cada sintoma
            </h2>
            <p className="mt-3 text-muted-foreground">
              Antes de escolher um serviço, vale separar o que o equipamento está fazendo. O mesmo sintoma
              pode ter causa de software, de hardware, de rede ou de alimentação — e o serviço correto muda
              conforme essa separação. A tabela abaixo mostra por onde a triagem começa em cada caso.
            </p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-secondary text-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">O que você observa</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Causa mais provável</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Por onde começar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  <tr>
                    <td className="px-4 py-3">Demora para ligar e abrir programas, disco sempre em uso alto</td>
                    <td className="px-4 py-3">Armazenamento mecânico ou pouca memória</td>
                    <td className="px-4 py-3">
                      <Link to="/servicos/upgrade-ssd-ram" className="text-[hsl(var(--accent))] hover:underline">
                        Upgrade de SSD e memória
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Anúncios abrindo sozinhos, navegador alterado, avisos estranhos</td>
                    <td className="px-4 py-3">Programas indesejados ou infecção ativa</td>
                    <td className="px-4 py-3">
                      <Link to="/servicos/remocao-de-virus" className="text-[hsl(var(--accent))] hover:underline">
                        Remoção de vírus
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Sistema instável, erros recorrentes, anos de acúmulo</td>
                    <td className="px-4 py-3">Sistema comprometido no nível de software</td>
                    <td className="px-4 py-3">
                      <Link to="/servicos/formatacao" className="text-[hsl(var(--accent))] hover:underline">
                        Formatação com backup
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Disco não reconhecido, arquivos apagados, ruído no HD</td>
                    <td className="px-4 py-3">Falha lógica ou física de armazenamento</td>
                    <td className="px-4 py-3">
                      <Link to="/servicos/recuperacao-de-dados" className="text-[hsl(var(--accent))] hover:underline">
                        Recuperação de dados
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Não dá sinal nenhum, ou liga e não completa a inicialização</td>
                    <td className="px-4 py-3">Alimentação, placa ou falha de boot</td>
                    <td className="px-4 py-3">
                      <Link to="/problemas/computador-nao-liga" className="text-[hsl(var(--accent))] hover:underline">
                        Diagnóstico de “não liga”
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Lentidão só na navegação, com o resto respondendo bem</td>
                    <td className="px-4 py-3">Rede, sinal Wi-Fi ou link de internet</td>
                    <td className="px-4 py-3">
                      <Link to="/servicos/redes-e-wifi" className="text-[hsl(var(--accent))] hover:underline">
                        Redes e Wi-Fi
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Se o sintoma aparece antes do Windows carregar, ou persiste em outro sistema, a suspeita passa a ser
              hardware. Se desaparece em modo de segurança ou em outro perfil, a suspeita é software. Essa separação
              é o primeiro passo do diagnóstico e evita pagar pelo serviço errado.
            </p>
          </div>
        </div>
      </section>



      {/* Como o atendimento começa */}
      <section className="py-14 md:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              O atendimento começa pela triagem
            </h2>
            <p className="mt-4 text-muted-foreground">
              Não trabalhamos com preço fechado universal. Você fala com o técnico pelo WhatsApp,
              explicamos os próximos passos e o diagnóstico começa a partir de {siteConfig.minPriceLabel}.
              O valor final depende do equipamento, da complexidade, de eventuais peças e da condição
              real do problema.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/como-funciona"
                className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm text-foreground transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
              >
                Como funciona
              </Link>
              <Link
                to="/diagnostico-tecnico"
                className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm text-foreground transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
              >
                Diagnóstico técnico
              </Link>
              <Link
                to="/precos-e-politicas"
                className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm text-foreground transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
              >
                Preços e políticas
              </Link>
              <Link
                to="/faq"
                className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm text-foreground transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
              >
                Dúvidas frequentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cluster interno: empresas e remoto */}
      <section className="py-14 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Atendimento para empresas e suporte remoto
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Se a demanda é de uma empresa ou pode ser resolvida sem deslocamento, comece por estas páginas —
              elas explicam escopo, limites e como a triagem funciona em cada caso.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Link
                to="/empresa-de-ti-curitiba"
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-[hsl(var(--accent))]"
              >
                <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-[hsl(var(--accent))]">
                  Empresa de TI em Curitiba
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Suporte técnico empresarial, manutenção preventiva, redes e backup — pontual ou recorrente.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--accent))]">
                  Ver atendimento PJ <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                to="/atendimento-remoto"
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-[hsl(var(--accent))]"
              >
                <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-[hsl(var(--accent))]">
                  Suporte técnico remoto
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  O que dá para resolver por acesso remoto, o que exige presença e como a sessão é conduzida.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--accent))]">
                  Ver atendimento remoto <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <GarantiaNotaFiscalPagamento />

      {/* FAQ */}
      <section className="py-14 md:py-16 bg-background" id="perguntas-frequentes">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Perguntas frequentes sobre os serviços
            </h2>
            <div className="mt-8 space-y-6">
              {FAQS.map((f) => (
                <div key={f.question} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground">{f.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Mais dúvidas em{" "}
              <Link to="/faq" className="font-semibold text-[hsl(var(--accent))] hover:underline">
                dúvidas frequentes
              </Link>{" "}
              e em{" "}
              <Link to="/precos-e-politicas" className="font-semibold text-[hsl(var(--accent))] hover:underline">
                preços e políticas
              </Link>
              .
            </p>
          </div>
        </div>
      </section>



      {/* CTA final */}
      <section className="bg-[hsl(var(--hero-bg))] py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold">Vamos resolver isso hoje?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Fale direto com o técnico pelo WhatsApp. Diagnóstico honesto e valor aprovado antes de
            qualquer serviço.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCta}
            data-cta-location="servicos_hub_final"
            className={`${CTA_BASE} mt-7`}
          >
            Iniciar atendimento no WhatsApp
          </a>
        </div>
      </section>

      <InterlinkingBlock />
      </main>
      <Footer />
    </div>
  );
};

export default Servicos;
