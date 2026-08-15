import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PageSEO } from "@/components/PageSEO";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Flame, RefreshCw, Smartphone, Zap, Wrench, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

const WHATSAPP_NUMBER = "5541997086380";

const PROCEDIMENTOS = [
  {
    slug: "reflow-bga-curitiba",
    title: "Reflow BGA",
    icon: Flame,
    desc: "Reaquecimento das soldas BGA para restabelecer contato elétrico. Solução rápida e acessível — porém temporária. Indicado quando o valor do atendimento é limitado ou o equipamento é antigo.",
    preco: "R$ 150 – R$ 350",
    garantia: "Sem garantia",
    indicacao: "GPU com artefatos, notebook/console sem vídeo",
    tag: "Temporário",
    tagColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    slug: "reballing-bga-curitiba",
    title: "Reballing BGA",
    icon: RefreshCw,
    desc: "Remoção completa do chip, limpeza das ilhas de solda e re-aplicação de microesferas novas. Mais duradouro que o reflow por reconstruir totalmente a conexão.",
    preco: "R$ 400 – R$ 800",
    garantia: "90 dias",
    indicacao: "Solda fria em GPU/chipset, falhas recorrentes",
    tag: "Duradouro",
    tagColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    slug: "troca-chip-bga-curitiba",
    title: "Troca de Chip BGA",
    icon: Cpu,
    desc: "Substituição total do componente BGA defeituoso por um novo ou recondicionado. Solução definitiva quando o chip está internamente danificado.",
    preco: "R$ 500 – R$ 1.200",
    garantia: "90 dias",
    indicacao: "Chip queimado, curto-circuito interno, dano irreversível",
    tag: "Definitivo",
    tagColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    slug: "microsoldagem-celular-curitiba",
    title: "Microsoldagem para Celular",
    icon: Smartphone,
    desc: "Solda e troca de componentes SMD em placas de celular com estação de solda de precisão e microscópio. Reparo fino em nível de componente.",
    preco: "R$ 200 – R$ 600",
    garantia: "90 dias",
    indicacao: "Celular não carrega, sem rede, sem áudio, curto na placa",
    tag: "Precisão",
    tagColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    slug: "recapacitacao-placa-eletronica-curitiba",
    title: "Recapacitação de Placa",
    icon: Zap,
    desc: "Substituição de capacitores e componentes passivos degradados. Resolve instabilidades, desligamentos e falhas intermitentes causadas por capacitores estufados ou secos.",
    preco: "R$ 150 – R$ 500",
    garantia: "90 dias",
    indicacao: "Placa com capacitores estufados, TV/monitor que desliga sozinho",
    tag: "Restauração",
    tagColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
];

const ProcedimentosPlaca = () => {
  useEffect(() => {
    document.title = "Procedimentos Técnicos em Placa — Reflow, Reballing, Microsoldagem | Curitiba";
    trackPageView("/procedimentos-placa", "Procedimentos Técnicos em Placa");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Procedimentos Técnicos em Placa — Reflow, Reballing, Microsoldagem | Curitiba"
        description="Conheça os procedimentos técnicos de reparo em placa: reflow BGA, reballing, troca de chip, microsoldagem para celular e recapacitação. Curitiba e região."
        path="/procedimentos-placa"
        breadcrumbs={[{ name: "Início", path: "/" }, { name: "Serviços", path: "/servicos" }, { name: "Conserto de Placa", path: "/servicos/conserto-placa" }, { name: "Procedimentos", path: "/procedimentos-placa" }]}
      />
      <Header />
      <Breadcrumbs items={[
        { label: "Serviços", href: "/servicos" },
        { label: "Conserto de Placa", href: "/servicos/conserto-placa" },
        { label: "Procedimentos Técnicos" },
      ]} />

      <main className="py-10 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Hero */}
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Wrench className="h-4 w-4" /> Procedimentos Especializados
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Procedimentos Técnicos em{" "}
                <span className="gradient-text">Placa Eletrônica</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Cada tipo de defeito exige um procedimento específico. Conheça as técnicas que utilizamos
                para reparar placas de notebook, celular, TV, console e outros equipamentos.
              </p>
            </div>
          </AnimatedSection>

          {/* Hierarchy / Flow */}
          <AnimatedSection delay={0.1}>
            <div className="glass-card rounded-xl p-6 mb-10">
              <h2 className="text-lg font-bold text-foreground mb-4 text-center">
                📊 Comparativo Rápido — Qual Procedimento Para Cada Caso?
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Procedimento</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Faixa de Preço</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Garantia</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Durabilidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROCEDIMENTOS.map((p) => (
                      <tr key={p.slug} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-foreground">
                          <Link to={`/procedimentos/${p.slug}`} className="hover:text-accent transition-colors">
                            {p.title}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{p.preco}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{p.garantia}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.tagColor}`}>{p.tag}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>

          {/* Cards */}
          <div className="grid gap-6">
            {PROCEDIMENTOS.map((proc, i) => {
              const Icon = proc.icon;
              return (
                <AnimatedSection key={proc.slug} delay={0.1 * (i + 1)}>
                  <div className="glass-card gradient-border rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Icon className="h-7 w-7 text-accent" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold text-foreground">{proc.title}</h2>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${proc.tagColor}`}>{proc.tag}</span>
                        </div>
                        <p className="text-muted-foreground">{proc.desc}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-foreground"><strong>Faixa:</strong> {proc.preco}</span>
                          <span className="text-foreground"><strong>Garantia:</strong> {proc.garantia}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Indicado para:</strong> {proc.indicacao}
                        </p>
                        <Link to={`/procedimentos/${proc.slug}`}>
                          <Button variant="outline" size="sm" className="gap-2 mt-2">
                            Saiba mais <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* CTA */}
          <AnimatedSection delay={0.6}>
            <div className="mt-12 glass-card rounded-xl p-8 text-center space-y-4 bg-accent/5">
              <h2 className="text-xl font-bold text-foreground">
                Não sabe qual procedimento seu equipamento precisa?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Envie fotos e a descrição do problema. Nosso técnico analisa e indica o procedimento correto — sem compromisso.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Preciso de um reparo em placa. Qual procedimento seria indicado para o meu caso?")}`}
                  data-cta-location="procedimentos_placa_cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="h-4 w-4" /> Consultar via WhatsApp
                  </Button>
                </a>
                <Link to="/coleta-formulario">
                  <Button variant="outline" className="gap-2">
                    Agendar Coleta <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>

          {/* Related links */}
          <AnimatedSection delay={0.7}>
            <div className="mt-10 glass-card rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 text-center">Páginas Relacionadas</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: "Conserto de Placa", to: "/servicos/conserto-placa" },
                  { label: "Manutenção de Computador", to: "/servicos/manutencao-de-computador" },
                  { label: "Manutenção de TV", to: "/servicos/manutencao-tv" },
                  { label: "Reparo Placa Notebook", to: "/problemas/reparo-placa-mae-notebook-curitiba" },
                  { label: "Por Que Conserto de Placa é Caro?", to: "/problemas/por-que-conserto-placa-mae-custa-caro-curitiba" },
                  { label: "Diagnóstico Técnico", to: "/diagnostico-tecnico" },
                  { label: "Coleta e Entrega", to: "/coleta-e-entrega" },
                  { label: "Quando Não Compensa", to: "/quando-nao-compensa" },
                  { label: "Problemas Reais e Casos", to: "/problemas-reais-e-casos" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all text-sm text-muted-foreground hover:text-accent text-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProcedimentosPlaca;
