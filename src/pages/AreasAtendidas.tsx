import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { MapPin, Building2, Home, Truck, MonitorSmartphone, MessageCircle } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { FastHeader } from "@/components/FastHeader";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LocalFAQSection } from "@/components/LocalFAQSection";
import { CIDADE_LIST, CURITIBA_BAIRROS, MODALIDADES_ATENDIMENTO } from "@/lib/cidadesData";
import { CIDADES_RMC_NOMES } from "@/lib/bairrosSelect";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const PATH = "/areas-atendidas";
const TITLE = "Áreas Atendidas em Curitiba e Região | Bairros e Cidades";
const DESCRIPTION =
  "Bairros de Curitiba e cidades da região metropolitana atendidas pelo Técnico em Curitiba, com a modalidade indicada em cada caso: no local, remoto ou coleta para bancada.";

const REGIONAIS = [
  {
    nome: "Centro e região central",
    bairros: ["Centro", "Centro Cívico", "Alto da Glória", "Alto da XV", "São Francisco", "Rebouças", "Prado Velho"],
    perfil: "Escritórios, consultórios e comércio: atendimento com hora marcada para não parar o expediente.",
  },
  {
    nome: "Sul",
    bairros: ["Água Verde", "Portão", "Fanny", "Novo Mundo", "Capão Raso", "Pinheirinho", "Xaxim", "Sítio Cercado", "Boqueirão", "Hauer", "Uberaba"],
    perfil: "Alto volume residencial e home office: notebook lento, formatação, SSD e Wi-Fi instável.",
  },
  {
    nome: "Oeste e CIC",
    bairros: ["CIC (Cidade Industrial)", "Campo Comprido", "Santa Quitéria", "Fazendinha", "Vila Izabel", "Seminário", "Mossunguê", "Ecoville", "Bigorrilho", "Champagnat"],
    perfil: "Mistura de indústria, comércio e condomínios: manutenção de parque de máquinas e rede.",
  },
  {
    nome: "Norte",
    bairros: ["Santa Cândida", "Boa Vista", "Bacacheri", "Bairro Alto", "Abranches", "Pilarzinho", "Ahú", "Cabral", "Juvevê", "São Lourenço", "Barreirinha", "Tarumã"],
    perfil: "Residências e pequenos negócios: limpeza interna, troca de disco e remoção de vírus.",
  },
  {
    nome: "Leste",
    bairros: ["Cristo Rei", "Jardim Botânico", "Jardim das Américas", "Cajuru", "Capão da Imbuia", "Guabirotuba", "Hugo Lange", "Jardim Social", "Vista Alegre"],
    perfil: "Perfil universitário e profissional liberal: urgência em recuperar arquivos e voltar a produzir.",
  },
  {
    nome: "Santa Felicidade e entorno",
    bairros: ["Santa Felicidade", "Mercês", "São Braz", "Campina do Siqueira", "Lindóia", "Parolin", "Guaíra", "Alto Boqueirão", "Tatuquara", "Umbará"],
    perfil: "Distâncias maiores: a agenda considera deslocamento, e casos de bancada saem por coleta.",
  },
];

const criteriosModalidade = [
  {
    icon: Home,
    titulo: "Atendimento no endereço",
    desc:
      "Indicado quando o equipamento não pode sair do lugar, quando há vários aparelhos no mesmo local ou quando o problema é de rede, cabeamento e posicionamento de roteador.",
    to: "/atendimento-domicilio",
  },
  {
    icon: MonitorSmartphone,
    titulo: "Suporte remoto",
    desc:
      "Resolve sistema, configuração, lentidão por software, e-mail e acesso a programas sem deslocamento — vale para qualquer bairro ou cidade da lista.",
    to: "/atendimento-remoto",
  },
  {
    icon: Truck,
    titulo: "Coleta para bancada",
    desc:
      "Necessária em reparo de placa, tela, conector de energia, TV e monitor: o equipamento é retirado, avaliado em bancada e devolvido ao final.",
    to: "/coleta-e-entrega",
  },
];

const faqs = [
  {
    question: "Meu bairro não aparece na lista. Vocês atendem mesmo assim?",
    answer:
      "Provavelmente sim. A lista mostra os bairros com maior volume de atendimento em Curitiba, não um limite fechado. Descreva o endereço e o problema na triagem do WhatsApp: confirmamos na hora se o atendimento é no local, remoto ou por coleta e qual é a janela de agenda disponível.",
  },
  {
    question: "Vocês têm loja física em cada bairro atendido?",
    answer:
      "Não. O atendimento é agendado: acontece no seu endereço, por acesso remoto ou com coleta do equipamento para bancada. Nenhum bairro tem balcão de loja, e nós não anunciamos endereço que não existe.",
  },
  {
    question: "O valor muda conforme o bairro ou a cidade?",
    answer:
      "O diagnóstico técnico parte de R$ 99,99 em toda a área atendida. Deslocamentos mais longos na região metropolitana podem alterar a janela de agenda e, em alguns casos, o valor do atendimento presencial — isso é informado e aprovado antes de qualquer serviço, nunca depois.",
  },
  {
    question: "Como vocês decidem entre visita, remoto e coleta?",
    answer:
      "Pelo sintoma. Problema de sistema, configuração e lentidão por software costuma ser resolvido remotamente. Rede, Wi-Fi e vários equipamentos no mesmo local pedem visita. Reparo de placa, tela, TV e monitor exige bancada, e nesse caso o equipamento é coletado.",
  },
  {
    question: "Atendem empresas fora de Curitiba?",
    answer:
      "Sim, nas cidades da região metropolitana listadas nesta página. Para empresas, a combinação mais comum é suporte remoto no dia a dia e visita programada para o que exige presença física, evitando deslocamento desnecessário.",
  },
  {
    question: "Existe garantia igual em toda a área atendida?",
    answer:
      "Sim. A mão de obra do serviço executado tem 90 dias de garantia no mesmo defeito tratado, independentemente do bairro ou da cidade. Peças seguem a garantia do fornecedor ou fabricante.",
  },
];

const cidadesComPagina = CIDADE_LIST.filter((c) => c.slug !== "curitiba");
const cidadesComPaginaNomes = new Set(cidadesComPagina.map((c) => c.cidade));
const cidadesSemPagina = CIDADES_RMC_NOMES.filter((c) => !cidadesComPaginaNomes.has(c));

const AreasAtendidas = () => {
  useEffect(() => {
    trackPageView(PATH, "Áreas atendidas");
  }, []);

  const abrirFunil = (location: string, message?: string) => {
    trackCTAClick("whatsapp", location);
    window.dispatchEvent(new CustomEvent("wa-funnel:open", { detail: { location, message } }));
  };

  const abrirFunilLocal = (escopo: "bairro" | "cidade", nome: string) =>
    abrirFunil(
      `areas_${escopo}_${nome.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      `Olá! Preciso de atendimento técnico em ${nome} (${escopo === "bairro" ? "Curitiba" : "região metropolitana de Curitiba"}). Pode confirmar agenda e a modalidade indicada para o meu caso?`,
    );


  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Áreas atendidas", path: PATH },
        ]}
      />
      <LocalBusinessJsonLd
        path={PATH}
        description={DESCRIPTION}
        services={[
          { name: "Manutenção de notebook", url: "/servicos/manutencao-de-notebook" },
          { name: "Manutenção de computador", url: "/servicos/manutencao-de-computador" },
          { name: "Formatação e remoção de vírus", url: "/servicos/formatacao" },
          { name: "Redes e Wi-Fi", url: "/servicos/redes-e-wifi" },
          { name: "Conserto de monitor", url: "/servicos/conserto-monitor" },
          { name: "Conserto de placa", url: "/servicos/conserto-placa" },
          { name: "Suporte de TI para empresas", url: "/empresa-de-ti-curitiba" },
        ]}
      />

      <FastHeader />
      <main className="pt-[var(--site-header-height)]">
        <Breadcrumbs items={[{ label: "Áreas atendidas" }]} />

        <section className="border-b border-border/60 bg-secondary/40">
          <div className="container mx-auto py-12 md:py-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                <MapPin className="h-4 w-4" />
                Cobertura de atendimento
              </span>
              <h1 className="mt-5 text-3xl font-heading font-bold leading-tight text-foreground md:text-5xl">
                Áreas atendidas em <span className="text-accent">Curitiba e região</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground">
                Esta página reúne os bairros de Curitiba e as cidades da região metropolitana onde o
                atendimento acontece, junto com a modalidade indicada em cada situação. Sem promessa de
                tempo de chegada e sem endereço de loja que não existe: o que existe é agenda combinada,
                diagnóstico antes do valor e garantia de 90 dias na mão de obra.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => abrirFunil("areas_hero")}
                  data-cta-location="areas_hero"
                  data-wa-funnel="required"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-bold text-accent-foreground shadow-[0_14px_34px_-10px_hsl(var(--accent)/0.6)] transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Confirmar atendimento no meu endereço
                </button>
                <Link
                  to="/como-funciona"
                  className="inline-flex min-h-14 items-center justify-center rounded-lg border border-border px-6 text-base font-semibold text-foreground transition-colors hover:bg-secondary/60"
                >
                  Ver como funciona o atendimento
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Mapa de cobertura por região de Curitiba
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Em vez de um mapa decorativo, o quadro abaixo mostra como a agenda é organizada: por região,
              com o perfil de chamado mais comum em cada uma. É isso que define se o caso vai para visita,
              remoto ou coleta.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {REGIONAIS.map((r) => (
                <article key={r.nome} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-heading font-bold text-foreground">{r.nome}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.perfil}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {r.bairros.map((b) => {
                      const comPagina = CURITIBA_BAIRROS.find((x) => x.label === b);
                      return (
                        <li key={b}>
                          {comPagina ? (
                            <Link
                              to={comPagina.to}
                              className="inline-flex rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent"
                            >
                              {b}
                            </Link>
                          ) : (
                            <span className="inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
                              {b}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    onClick={() => abrirFunilLocal("bairro", r.nome)}
                    data-cta-location={`areas_regiao_${r.nome}`}
                    data-wa-funnel="required"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-4 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Falar sobre atendimento nesta região
                  </button>
                </article>

              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Bairros destacados possuem página local própria com detalhes de operação. Os demais são
              atendidos normalmente, apenas não têm página dedicada.
            </p>
          </div>
        </section>

        <section className="border-t border-border/60 bg-secondary/30 py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Cidades da região metropolitana
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Fora de Curitiba, o atendimento segue a mesma regra: triagem primeiro, modalidade definida pelo
              sintoma e valor aprovado antes da execução.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cidadesComPagina.map((c) => (
                <article key={c.slug} className="rounded-2xl border border-border bg-card p-6">
                  <Building2 className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-3 text-lg font-heading font-bold text-foreground">{c.cidade}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.subtitulo}</p>
                  <Link
                    to={`/tecnico-informatica-${c.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-accent underline underline-offset-4"
                  >
                    Ver atendimento em {c.cidade}
                  </Link>
                  <button
                    type="button"
                    onClick={() => abrirFunilLocal("cidade", c.cidade)}
                    data-cta-location={`areas_cidade_${c.slug}`}
                    data-wa-funnel="required"
                    className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-4 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Confirmar agenda em {c.cidade}
                  </button>
                </article>

              ))}
            </div>
            {cidadesSemPagina.length > 0 && (
              <p className="mt-6 max-w-3xl text-muted-foreground">
                Também atendemos, mediante confirmação de agenda e deslocamento:{" "}
                <strong className="text-foreground">{cidadesSemPagina.join(", ")}</strong>. Nessas cidades o
                suporte remoto é imediato e o atendimento presencial depende da rota do dia.
              </p>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Em Curitiba, a página-mãe do atendimento é{" "}
              <Link to="/tecnico-informatica-curitiba" className="text-accent underline underline-offset-4">
                técnico de informática em Curitiba
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="border-t border-border/60 py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Qual modalidade se aplica ao seu caso
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {criteriosModalidade.map((m) => (
                <article key={m.titulo} className="rounded-2xl border border-border bg-card p-6">
                  <m.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-heading font-bold text-foreground">{m.titulo}</h3>
                  <p className="mt-2 text-muted-foreground">{m.desc}</p>
                  <Link
                    to={m.to}
                    className="mt-4 inline-flex text-sm font-semibold text-accent underline underline-offset-4"
                  >
                    Detalhes da modalidade
                  </Link>
                </article>
              ))}
            </div>
            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {MODALIDADES_ATENDIMENTO.map((m) => (
                <li key={m.to} className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                  <Link to={m.to} className="font-semibold text-foreground underline underline-offset-4">
                    {m.label}
                  </Link>
                  <span className="mt-1 block">{m.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <LocalFAQSection title="Perguntas frequentes sobre a área atendida" faqs={faqs} />

        <section className="border-t border-border/60 bg-secondary/40 py-12 md:py-16">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">
              Confirme a cobertura do seu endereço
            </h2>
            <p className="mt-4 text-muted-foreground">
              Diga o bairro ou a cidade e descreva o problema. A triagem informa a modalidade indicada, a
              janela de agenda real e o que será avaliado antes de qualquer valor.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => abrirFunil("areas_final")}
                data-cta-location="areas_final"
                data-wa-funnel="required"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-bold text-accent-foreground transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-5 w-5" />
                Falar com o técnico
              </button>
              <Link
                to="/precos-e-politicas"
                className="inline-flex min-h-14 items-center justify-center rounded-lg border border-border px-6 text-base font-semibold text-foreground transition-colors hover:bg-secondary/60"
              >
                Ver preços e políticas
              </Link>
            </div>
            <nav aria-label="Serviços atendidos na região" className="mt-10 text-sm">
              <h3 className="font-heading text-base font-bold text-foreground">Serviços atendidos nessas áreas</h3>
              <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
                {[
                  { to: "/servicos", label: "Todos os serviços" },
                  { to: "/servicos/manutencao-de-notebook", label: "Manutenção de notebook" },
                  { to: "/servicos/formatacao", label: "Formatação de computador" },
                  { to: "/servicos/redes-e-wifi", label: "Redes e Wi-Fi" },
                  { to: "/servicos/conserto-monitor", label: "Conserto de monitor" },
                  { to: "/servicos/conserto-placa", label: "Conserto de placa" },
                  { to: "/empresa-de-ti-curitiba", label: "Suporte de TI para empresas" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="font-medium text-foreground underline underline-offset-4 hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AreasAtendidas;