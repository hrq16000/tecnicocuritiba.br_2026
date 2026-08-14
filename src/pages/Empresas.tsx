import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EmpresasSchema } from "@/components/EmpresasSchema";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/siteConfig";
import { track, trackWaClick } from "@/lib/funnelAnalytics";
import { trackPageView } from "@/lib/analytics";
import { ArrowRight, Building2, CheckCircle2, MessageCircle, Network, ShieldCheck } from "lucide-react";

const PATH = "/empresas";
const TITLE = "Atendimento Empresarial de TI | Técnico em Curitiba";
const DESCRIPTION =
  "Solicite atendimento de TI para sua empresa em Curitiba: informe empresa, quantidade de equipamentos, problema, prioridade e região. Retorno pelo WhatsApp.";

const PRIORIDADES = [
  { id: "parado", label: "Operação parada (urgente)" },
  { id: "impacto", label: "Impacto parcial (hoje/amanhã)" },
  { id: "planejado", label: "Planejado (sem urgência)" },
] as const;

type PrioridadeId = (typeof PRIORIDADES)[number]["id"];

const NECESSIDADES = [
  {
    icon: Network,
    title: "Rede e Wi-Fi instáveis",
    desc: "Quedas de conexão, cabeamento improvisado e roteadores sem cobertura no escritório inteiro.",
  },
  {
    icon: Building2,
    title: "Estações de trabalho lentas",
    desc: "Computadores travando, inicialização demorada e falta de padronização entre máquinas.",
  },
  {
    icon: ShieldCheck,
    title: "Backup e continuidade",
    desc: "Arquivos críticos sem rotina de cópia, risco de perda e ausência de teste de restauração.",
  },
] as const;

const ETAPAS = [
  "Você envia o contexto (equipamentos, problema, prioridade e região).",
  "Fazemos a triagem por WhatsApp e definimos a modalidade: remoto, no local ou coleta.",
  "Diagnóstico com escopo e condições informados antes de qualquer execução.",
  "Qualquer adicional só acontece com autorização explícita da empresa.",
  "Conclusão com registro do que foi feito e orientações de prevenção.",
];

/** Fonte única das perguntas: o texto visível e o FAQPage saem daqui. */
const FAQS = [
  {
    question: "Vocês atendem empresas em Curitiba e Região Metropolitana?",
    answer:
      "Sim. Atendemos empresas em Curitiba e na Região Metropolitana, incluindo São José dos Pinhais, Pinhais, Colombo, Araucária e Campo Largo. A modalidade (remoto, no local ou coleta) é definida na triagem pelo WhatsApp, conforme o problema e a urgência informados no formulário.",
  },
  {
    question: "Como funciona o atendimento quando a operação está parada?",
    answer:
      "Solicitações marcadas como operação parada entram primeiro na fila de triagem. Fazemos a checagem inicial por WhatsApp para tentar restabelecer o essencial no mesmo dia e, quando é necessário atendimento presencial, o escopo e as condições são informados antes do deslocamento.",
  },
  {
    question: "É possível contratar suporte recorrente para a empresa?",
    answer:
      "Sim. Depois do primeiro atendimento é possível combinar acompanhamento recorrente com manutenção preventiva, revisão de rede e rotina de backup. A periodicidade é definida caso a caso, sempre com escopo e valores informados por escrito antes de iniciar.",
  },
  {
    question: "Como são informados os valores do atendimento empresarial?",
    answer:
      "O valor é informado antes da execução, a partir do diagnóstico. Nada é executado sem autorização explícita da empresa e qualquer adicional identificado durante o serviço volta para aprovação antes de continuar.",
  },
] as const;


const Empresas = () => {
  const [empresa, setEmpresa] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [problema, setProblema] = useState("");
  const [prioridade, setPrioridade] = useState<PrioridadeId>("impacto");
  const [regiao, setRegiao] = useState("");
  const [contato, setContato] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => trackPageView(PATH, TITLE), 1500);
    return () => window.clearTimeout(id);
  }, []);

  const podeEnviar = empresa.trim().length >= 2 && problema.trim().length >= 10 && contato.trim().length >= 5;

  const mensagem = useMemo(() => {
    const prioridadeLabel = PRIORIDADES.find((p) => p.id === prioridade)?.label ?? "";
    return [
      "Solicitação de atendimento empresarial (Técnico em Curitiba)",
      `Empresa: ${empresa || "-"}`,
      `Equipamentos (aprox.): ${quantidade || "-"}`,
      `Prioridade: ${prioridadeLabel}`,
      `Endereço/região: ${regiao || "-"}`,
      `Contato: ${contato || "-"}`,
      "",
      `Problema: ${problema || "-"}`,
    ].join("\n");
  }, [empresa, quantidade, prioridade, regiao, contato, problema]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podeEnviar) return;
    track("empresas_form_submit", {
      prioridade,
      tem_quantidade: quantidade.trim().length > 0,
      tem_regiao: regiao.trim().length > 0,
      problema_len: problema.trim().length,
    });
    trackWaClick("empresas_formulario", { prioridade });
    window.open(
      `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(mensagem)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const abrirWhatsApp = (location: string, texto: string) => {
    trackWaClick(location);
    window.open(
      `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Página de conversão empresarial: noindex,follow para não disputar a
          intenção institucional de /empresa-de-ti-curitiba. */}
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        noindex
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Empresas", path: PATH },
        ]}
      />
      <EmpresasSchema path={PATH} faqs={FAQS} />
      <Header />
      <main>
        <section className="bg-card border-b border-border">
          <div className="container mx-auto py-10 md:py-14">
            <Breadcrumbs items={[{ label: "Empresas", href: PATH }]} />
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-4 mb-4">
                Atendimento empresarial de TI em Curitiba
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                Descreva a situação da sua empresa em um formulário curto. A triagem continua pelo
                WhatsApp com escopo e condições definidos antes de qualquer execução.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={() =>
                    abrirWhatsApp(
                      "empresas_hero",
                      "Preciso de atendimento de TI para a minha empresa em Curitiba.",
                    )
                  }
                >
                  <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  Falar com o técnico agora
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#solicitar-atendimento">
                    Preencher formulário
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <AnimatedSection>
          <section className="py-12 md:py-16">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6">
                Necessidades empresariais mais comuns
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {NECESSIDADES.map(({ icon: Icon, title, desc }) => (
                  <article key={title} className="rounded-xl border border-border bg-card p-5">
                    <Icon className="h-5 w-5 text-accent mb-3" aria-hidden="true" />
                    <h3 className="font-bold text-primary mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </article>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Quer entender a estrutura de suporte antes de solicitar?{" "}
                <Link to="/empresa-de-ti-curitiba" className="text-accent font-semibold hover:underline">
                  Veja a página institucional de empresa de TI em Curitiba
                </Link>
                .
              </p>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section id="solicitar-atendimento" className="py-12 md:py-16 bg-card border-y border-border">
            <div className="container mx-auto max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">
                Solicitar atendimento empresarial
              </h2>
              <p className="text-muted-foreground mb-6">
                O envio abre o WhatsApp com o resumo pronto — você confere antes de mandar.
              </p>

              <form onSubmit={enviar} className="space-y-4">
                <div>
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Input
                    id="empresa"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Nome da empresa"
                    maxLength={80}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="quantidade">Quantidade aproximada de equipamentos</Label>
                  <Input
                    id="quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="Ex.: 12 computadores e 2 impressoras"
                    maxLength={80}
                  />
                </div>

                <div>
                  <Label htmlFor="problema">Problema *</Label>
                  <Textarea
                    id="problema"
                    value={problema}
                    onChange={(e) => setProblema(e.target.value)}
                    placeholder="Descreva o que está acontecendo, desde quando e quantas pessoas são afetadas."
                    rows={4}
                    maxLength={1200}
                    required
                  />
                </div>

                <fieldset>
                  <legend className="text-sm font-medium mb-2">Prioridade</legend>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {PRIORIDADES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={prioridade === p.id}
                        onClick={() => {
                          setPrioridade(p.id);
                          track("empresas_form_prioridade", { prioridade: p.id });
                        }}
                        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                          prioridade === p.id
                            ? "border-accent bg-accent/10 text-foreground font-semibold"
                            : "border-border text-muted-foreground hover:border-accent/40"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <Label htmlFor="regiao">Endereço ou região</Label>
                  <Input
                    id="regiao"
                    value={regiao}
                    onChange={(e) => setRegiao(e.target.value)}
                    placeholder="Bairro, cidade ou endereço do escritório"
                    maxLength={120}
                  />
                </div>

                <div>
                  <Label htmlFor="contato">Contato (nome e WhatsApp) *</Label>
                  <Input
                    id="contato"
                    value={contato}
                    onChange={(e) => setContato(e.target.value)}
                    placeholder="Ex.: Ana — (41) 9....."
                    maxLength={120}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={!podeEnviar}>
                  <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  Enviar pelo WhatsApp
                </Button>
                {!podeEnviar && (
                  <p className="text-xs text-muted-foreground">
                    Preencha empresa, problema (mín. 10 caracteres) e contato para liberar o envio.
                  </p>
                )}
              </form>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-12 md:py-16">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6">
                Como funciona da solicitação até a execução
              </h2>
              <ol className="space-y-3">
                {ETAPAS.map((etapa, i) => (
                  <li key={etapa} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Etapa {i + 1}.</strong> {etapa}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Button
                  size="lg"
                  onClick={() =>
                    abrirWhatsApp(
                      "empresas_como_funciona",
                      "Quero entender as condições de atendimento empresarial de TI em Curitiba.",
                    )
                  }
                >
                  <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  Tirar dúvidas pelo WhatsApp
                </Button>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section id="faq-empresas" className="py-12 md:py-16 bg-card border-t border-border">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6">
                Perguntas frequentes sobre atendimento empresarial
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq) => (
                  <details
                    key={faq.question}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <summary className="cursor-pointer font-semibold text-primary">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default Empresas;
