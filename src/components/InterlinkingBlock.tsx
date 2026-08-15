import { Link } from "@/lib/router-compat";
import { ArrowRight, HelpCircle, DollarSign, Wrench, Search, Truck, AlertTriangle, Monitor, Cpu, Wifi, Shield, HardDrive, Tv, CircuitBoard, Server, Camera, MapPin, BookOpen, MessageCircle, AlertCircle } from "lucide-react";

const atendimentoLinks = [
  { icon: HelpCircle, title: "Como Funciona", desc: "Passo a passo do atendimento", to: "/como-funciona" },
  { icon: DollarSign, title: "Preços e Políticas", desc: "Tabela de valores e condições", to: "/precos-e-politicas" },
  { icon: Search, title: "Diagnóstico Técnico", desc: "Por que o diagnóstico é essencial", to: "/diagnostico-tecnico" },
  { icon: Monitor, title: "Equipamentos", desc: "O que atendemos", to: "/equipamentos-atendidos" },
  { icon: Truck, title: "Coleta e Entrega", desc: "Logística para equipamentos", to: "/coleta-e-entrega" },
  { icon: AlertTriangle, title: "Quando Não Compensa", desc: "Transparência na decisão", to: "/quando-nao-compensa" },
  { icon: BookOpen, title: "Casos Reais", desc: "Problemas e soluções reais", to: "/problemas-reais-e-casos" },
  { icon: MessageCircle, title: "Contato", desc: "Fale conosco", to: "/contato" },
];

const servicoLinks = [
  { icon: Monitor, title: "Formatação", desc: "Windows com backup", to: "/servicos/formatacao" },
  { icon: Wrench, title: "Manutenção de Notebook", desc: "Aquecimento, tela e bateria", to: "/servicos/manutencao-de-notebook" },
  { icon: Cpu, title: "Manutenção de Computador", desc: "Travamentos e hardware", to: "/servicos/manutencao-de-computador" },
  { icon: HardDrive, title: "Upgrade SSD/RAM", desc: "Mais desempenho real", to: "/servicos/upgrade-ssd-ram" },
  { icon: Shield, title: "Remoção de Vírus", desc: "Limpeza segura de malware", to: "/servicos/remocao-de-virus" },
  { icon: Server, title: "Recuperação de Dados", desc: "HD, SSD e pendrive", to: "/servicos/recuperacao-de-dados" },
  { icon: Wifi, title: "Redes e Wi-Fi", desc: "Cobertura e estabilidade", to: "/servicos/redes-e-wifi" },
  { icon: CircuitBoard, title: "Suporte Empresarial", desc: "TI para empresas", to: "/servicos/suporte-tecnico-empresarial" },
];

const regiaoLinks = [
  { title: "Curitiba", to: "/tecnico-informatica-curitiba" },
  { title: "São José dos Pinhais", to: "/tecnico-informatica-sao-jose-pinhais" },
  { title: "Araucária", to: "/tecnico-informatica-araucaria" },
  { title: "Campo Largo", to: "/tecnico-informatica-campo-largo" },
  { title: "Pinhais", to: "/tecnico-informatica-pinhais" },
  { title: "Colombo", to: "/tecnico-informatica-colombo" },
  { title: "Fazenda Rio Grande", to: "/tecnico-informatica-fazenda-rio-grande" },
  { title: "Almirante Tamandaré", to: "/tecnico-informatica-almirante-tamandare" },
  { title: "Piraquara", to: "/tecnico-informatica-piraquara" },
  { title: "Campo Magro", to: "/tecnico-informatica-campo-magro" },
  { title: "Quatro Barras", to: "/tecnico-informatica-quatro-barras" },
];

const problemaLinks = [
  { title: "PC Não Liga", to: "/problemas/computador-nao-liga-curitiba" },
  { title: "PC Lento", to: "/problemas/computador-lento-curitiba" },
  { title: "PC Travando", to: "/problemas/computador-travando-curitiba" },
  { title: "Tela Preta", to: "/problemas/computador-com-tela-preta-curitiba" },
  { title: "Superaquecendo", to: "/problemas/pc-superaquecendo-curitiba" },
  { title: "Notebook Não Liga", to: "/problemas/notebook-nao-liga-curitiba" },
  { title: "Notebook Lento", to: "/problemas/notebook-lento-curitiba" },
  { title: "Notebook com Água", to: "/problemas/notebook-com-agua-ou-liquido-curitiba" },
  { title: "Tela Quebrada", to: "/problemas/notebook-com-tela-quebrada-curitiba" },
  { title: "TV Não Liga", to: "/problemas/tv-nao-liga-curitiba" },
  { title: "TV Sem Imagem", to: "/problemas/tv-com-som-sem-imagem-curitiba" },
  { title: "Placa-Mãe Queimada", to: "/problemas/placa-mae-queimada" },
  { title: "GPU Desgastada", to: "/problemas/gpu-desgastada" },
  { title: "Erro de Upgrade", to: "/problemas/upgrade-deu-problema" },
  { title: "Vírus no PC", to: "/problemas/computador-com-virus-curitiba" },
  { title: "Windows Lento", to: "/problemas/windows-lento-curitiba" },
  { title: "Vale Consertar?", to: "/problemas/vale-a-pena-consertar-computador" },
  { title: "Técnico Urgente", to: "/problemas/assistencia-tecnica-urgente-curitiba" },
];

export const InterlinkingBlock = () => {
  return (
    <section className="py-10 md:py-14 bg-secondary relative overflow-hidden noise-overlay">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none orb-float" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none morph-blob" />
      <div className="container mx-auto relative z-10">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Atendimento */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-2 text-center reveal-text">
              Entenda Mais Sobre Nosso <span className="gradient-text">Atendimento</span>
            </h2>
            <div className="glow-separator max-w-xs mx-auto mb-5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {atendimentoLinks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={i}
                    to={item.to}
                    className="bg-background rounded-xl p-4 text-center border border-transparent hover:border-accent/20 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1.5 hover:scale-[1.03] transition-all duration-300 group hover-streak slide-up-stagger"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="bg-primary rounded-lg p-2 w-fit mx-auto mb-2 group-hover:bg-accent group-hover:scale-110 transition-all duration-300 relative">
                      <Icon className="h-5 w-5 text-primary-foreground icon-bounce" />
                      <div className="absolute inset-0 rounded-lg bg-accent/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </div>
                    <h3 className="font-semibold text-primary text-sm group-hover:text-accent transition-colors duration-200 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground hidden md:block">{item.desc}</p>
                    <ArrowRight className="h-3 w-3 text-accent mx-auto mt-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-2 text-center reveal-text">
              Nossos <span className="gradient-text">Serviços</span>
            </h2>
            <div className="glow-separator max-w-xs mx-auto mb-5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {servicoLinks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={i}
                    to={item.to}
                    className="bg-background rounded-xl p-4 text-center border border-transparent hover:border-accent/20 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1.5 hover:scale-[1.03] transition-all duration-300 group hover-streak slide-up-stagger"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="bg-accent rounded-lg p-2 w-fit mx-auto mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative">
                      <Icon className="h-5 w-5 text-accent-foreground icon-bounce" />
                      <div className="absolute inset-0 rounded-lg bg-accent/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </div>
                    <h3 className="font-semibold text-primary text-sm group-hover:text-accent transition-colors duration-200 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground hidden md:block">{item.desc}</p>
                    <ArrowRight className="h-3 w-3 text-accent mx-auto mt-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Regiões */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-2 text-center reveal-text">
              Regiões <span className="gradient-text">Atendidas</span>
            </h2>
            <div className="glow-separator max-w-xs mx-auto mb-5" />
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {regiaoLinks.map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  className="inline-flex items-center gap-1.5 bg-background rounded-full px-4 py-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-accent/20 hover:scale-105 hover:shadow-[var(--shadow-sm)] transition-all duration-200 elastic-click"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Problemas Comuns */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-2 text-center reveal-text">
              Problemas Mais <span className="gradient-text">Comuns</span>
            </h2>
            <div className="glow-separator max-w-xs mx-auto mb-5" />
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {problemaLinks.map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  className="inline-flex items-center gap-1.5 bg-background rounded-full px-4 py-2 text-sm font-medium text-primary hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 hover:scale-105 hover:shadow-[var(--shadow-sm)] transition-all duration-200 elastic-click"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
