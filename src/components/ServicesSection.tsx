import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Monitor, ShieldCheck, Wrench, HardDrive, Wifi, Database,
  Building2, Headphones, MapPin, ArrowRight, Camera, Clock, MessageCircle,
} from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";

type Service = {
  icon: typeof Monitor;
  title: string;
  problem: string;          // dor / sintoma do cliente
  solution: string;         // o que fazemos
  benefit: string;          // resultado para o cliente
  link: string;
  preco: string;
  tempo: string;
  badge?: string;
  waMessage: string;
  details: {
    what: string;
    bring: string;
  };
};

// Ordem definida pelo briefing comercial: notebook, computador, formatação,
// vírus, upgrade SSD, atendimento a domicílio — depois os demais.
const allServices: Service[] = [
  {
    icon: Wrench,
    title: "Conserto de Notebook",
    problem: "Notebook não liga, tela preta, esquenta ou desliga sozinho.",
    solution: "Diagnóstico técnico, teste de fonte/tela/placa e reparo com peças compatíveis.",
    benefit: "Você só aprova o serviço após o valor informado — sem surpresas na conta.",
    link: "/servicos/manutencao-de-computador",
    preco: "Diagnóstico grátis",
    tempo: "24–48h",
    badge: "Mais pedido",
    waMessage: "Olá! Meu notebook está com defeito. Pode me ajudar com o diagnóstico?",
    details: { what: "Teste de fonte, memória, disco, tela e sistema.", bring: "Carregador, cabo de energia e descrição do sintoma." },
  },
  {
    icon: Monitor,
    title: "Conserto de Computador (PC)",
    problem: "PC trava, reinicia, faz barulho ou não dá vídeo.",
    solution: "Avaliação de hardware (placa, fonte, HD/SSD, memória) e correção do que falha.",
    benefit: "Valor fechado antes de mexer — equipamento volta estável.",
    link: "/servicos/manutencao-de-computador",
    preco: "Diagnóstico grátis",
    tempo: "24–48h",
    waMessage: "Olá! Meu PC desktop está com problema. Pode me ajudar?",
    details: { what: "Teste completo de hardware e sistema operacional.", bring: "Descrição do problema e quando começou." },
  },
  {
    icon: Monitor,
    title: "Formatação com Windows",
    problem: "Sistema travando, cheio de erro, lento ou com tela azul.",
    solution: "Backup orientado, instalação limpa do Windows, drivers e programas essenciais.",
    benefit: "PC rápido como novo, com seus arquivos preservados.",
    link: "/servicos/formatacao",
    preco: "R$ 99,99",
    tempo: "Conforme agenda",
    waMessage: "Olá! Quero formatar meu computador com Windows + programas. Pode me passar o passo a passo?",
    details: { what: "Backup, Windows, drivers e programas essenciais.", bring: "Carregador, senhas e lista dos programas usados." },
  },
  {
    icon: ShieldCheck,
    title: "Remoção de Vírus e Malware",
    problem: "PC abrindo abas sozinho, propaganda, lentidão ou aviso de ameaça.",
    solution: "Varredura profunda, remoção de malware, ajuste do navegador e proteção básica.",
    benefit: "Equipamento limpo, navegação segura e sem propaganda invasiva.",
    link: "/servicos/remocao-de-virus",
    preco: "R$ 99,99",
    tempo: "1–2h",
    badge: "Mais pedido",
    waMessage: "Olá! Meu computador está com vírus / lento / abrindo coisas sozinho. Preciso de ajuda hoje.",
    details: { what: "Varredura, remoção de malware e proteção básica.", bring: "Senha do Windows e avisos que aparecem na tela." },
  },
  {
    icon: HardDrive,
    title: "Upgrade de SSD e Memória",
    problem: "PC demorando para ligar, abrir programas e travando no uso comum.",
    solution: "Instalação de SSD/memória compatível, clonagem do sistema quando aplicável.",
    benefit: "Boot em segundos e ganho real de velocidade no dia a dia.",
    link: "/servicos/upgrade-ssd-ram",
    preco: "A partir de R$ 80 (mão de obra)",
    tempo: "1h",
    waMessage: "Olá! Quero fazer upgrade de SSD/memória no meu computador. Pode me ajudar a escolher?",
    details: { what: "Instalação física, clonagem quando aplicável e validação.", bring: "Modelo do equipamento ou foto da etiqueta." },
  },
  {
    icon: MapPin,
    title: "Suporte Técnico a Domicílio",
    problem: "Sem tempo de levar o equipamento ou problema que precisa ver no local.",
    solution: "Técnico vai até você em Curitiba e região, com diagnóstico no local.",
    benefit: "Preço fechado antes de começar — você acompanha cada etapa.",
    link: "/atendimento-domicilio",
    preco: "A partir de R$ 99,99",
    tempo: "Hoje",
    waMessage: "Olá! Quero atendimento técnico a domicílio em Curitiba. Qual a disponibilidade hoje?",
    details: { what: "Diagnóstico no local e preço aprovado antes do serviço.", bring: "Bairro, ponto de referência e melhor horário." },
  },
  {
    icon: Wifi,
    title: "Redes e Wi-Fi",
    problem: "Sinal fraco, internet caindo ou repetidor mal configurado.",
    solution: "Ajuste de roteador, repetidor/mesh, canal e senha segura.",
    benefit: "Conexão estável onde você mais precisa, sem queda em reunião.",
    link: "/servicos/redes-e-wifi",
    preco: "A partir de R$ 80",
    tempo: "1–2h",
    waMessage: "Olá! Meu Wi-Fi está fraco / caindo. Preciso de ajuda para configurar a rede.",
    details: { what: "Ajuste de roteador, repetidor/mesh e senha segura.", bring: "Login da operadora e local dos equipamentos." },
  },
  {
    icon: Database,
    title: "Backup e Recuperação de Dados",
    problem: "HD/pendrive não abre ou perdeu fotos, planilhas ou documentos.",
    solution: "Triagem do disco, cópia segura e tentativa de recuperação.",
    benefit: "Avaliação antes de mexer — você decide com o cenário claro.",
    link: "/servicos/recuperacao-de-dados",
    preco: "A partir de R$ 80",
    tempo: "24h",
    waMessage: "Olá! Preciso recuperar arquivos / fotos do meu HD ou pendrive. Pode me ajudar?",
    details: { what: "Triagem do disco, cópia segura e tentativa de recuperação.", bring: "HD/pendrive e pasta/arquivos prioritários." },
  },
  {
    icon: Headphones,
    title: "Atendimento Remoto",
    problem: "Problema de software simples que dá para resolver online.",
    solution: "Acesso remoto assistido (AnyDesk) com sua autorização.",
    benefit: "Resolve em minutos, sem precisar sair de casa.",
    link: "/atendimento-remoto",
    preco: "R$ 79,99",
    tempo: "~15 min",
    waMessage: "Olá! Quero atendimento remoto agora. Pode me ajudar pelo AnyDesk?",
    details: { what: "Acesso remoto assistido para ajustes, vírus leves e programas.", bring: "Internet ativa e autorização para acesso remoto." },
  },
  {
    icon: Building2,
    title: "Suporte para Empresas",
    problem: "Equipe parada por falha de TI, sem suporte recorrente confiável.",
    solution: "Suporte remoto/presencial, rede, backup e estações.",
    benefit: "Atendimento prioritário para manter a operação rodando.",
    link: "/servicos/suporte-tecnico-empresarial",
    preco: "Sob consulta",
    tempo: "Prazo combinado",
    waMessage: "Olá! Quero contratar suporte de TI para minha empresa em Curitiba.",
    details: { what: "Suporte remoto/presencial, rede, backup e estações.", bring: "Quantidade de computadores e urgências atuais." },
  },
  {
    icon: Camera,
    title: "CFTV — Câmeras de Segurança",
    problem: "Quer monitorar imóvel ou comércio pelo celular, com segurança.",
    solution: "Kit Intelbras com instalação, cabeamento, DVR/NVR e aplicativo.",
    benefit: "Acesso remoto configurado e funcionando no seu celular.",
    link: "/cftv",
    preco: "R$ 1.350 instalado",
    tempo: "1 dia",
    waMessage: "Olá! Quero instalar câmeras de segurança (CFTV). Pode me passar o valor do atendimento?",
    details: { what: "Instalação, cabeamento, DVR/NVR e aplicativo.", bring: "Fotos do local e quantidade de pontos desejada." },
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const buildWa = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const trackServiceWhatsApp = (service: Service) => {
  import("@/lib/analytics").then(({ trackCTAClick }) =>
    trackCTAClick("whatsapp", `services_card_${service.link.replace(/\W+/g, "_")}`),
  );
};

export const ServicesSection = () => {
  const isMobile = useIsMobile();
  // Mantém os 6 serviços prioritários (briefing comercial) no topo e embaralha os extras.
  const services = useMemo(() => {
    const pinned = allServices.slice(0, 6);
    const rest = shuffleArray(allServices.slice(6));
    const all = [...pinned, ...rest];
    return isMobile ? all.slice(0, 6) : all.slice(0, 9);
  }, [isMobile]);


  return (
    <section
      id="servicos"
      className="py-14 md:py-18 lg:py-24 bg-background relative overflow-hidden spotlight-sweep mesh-gradient-warm noise-overlay"
    >
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none orb-float" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none orb-float-reverse" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 tracking-tight reveal-text">
            Qual é o seu <span className="gradient-text">problema hoje?</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
            Clique no serviço e fale direto no WhatsApp — diagnóstico sem compromisso e preço fechado antes de começar.
          </p>
          <div className="glow-separator max-w-xs mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            const waUrl = buildWa(service.waMessage);
            return (
              <article
                key={service.title}
                className="group relative flex flex-col glass-card gradient-border rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl card-shine animated-border slide-up-stagger"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {service.badge && (
                  <span className="absolute -top-2 right-4 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent-foreground shadow-md">
                    {service.badge}
                  </span>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-primary rounded-xl p-3 flex-shrink-0 group-hover:bg-accent group-hover:scale-110 transition-all duration-300 shadow-xs">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-base md:text-lg leading-tight group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12.5px] font-semibold">
                      <span className="text-accent">{service.preco}</span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" /> {service.tempo}
                      </span>
                    </div>
                  </div>
                </div>

                <dl className="mb-3 space-y-1.5 text-sm leading-relaxed flex-1">
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Problema</dt>
                    <dd className="text-foreground/90">{service.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Solução</dt>
                    <dd className="text-foreground/90">{service.solution}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-accent">Benefício</dt>
                    <dd className="text-foreground/90">{service.benefit}</dd>
                  </div>
                </dl>


                <details className="group/details mb-4 rounded-lg border border-border bg-background/55 px-3 py-2 text-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                    Detalhes do atendimento
                    <span aria-hidden="true" className="text-accent transition-transform group-open/details:rotate-180">⌄</span>
                  </summary>
                  <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                    <p><strong className="text-foreground">O que fazemos:</strong> {service.details.what}</p>
                    <p><strong className="text-foreground">Tempo estimado:</strong> {service.tempo}</p>
                    <p><strong className="text-foreground">O que levar/enviar:</strong> {service.details.bring}</p>
                  </div>
                </details>

                <div className="mt-auto flex items-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener nofollow"
                    data-cta-location={`services_card_${service.link.replace(/\W+/g, "_")}`}
                    data-wa-medium="services_card"
                    onClick={() => trackServiceWhatsApp(service)}
                    aria-label={`Falar no WhatsApp sobre ${service.title}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[hsl(var(--whatsapp))] px-3 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_-8px_hsl(145_63%_42%/0.6)] transition-all hover:scale-[1.02] hover:bg-[hsl(var(--whatsapp-hover))]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <Link
                    to={service.link}
                    aria-label={`Ver detalhes de ${service.title}`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Página
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/valores"
            className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all underline-grow text-[15px] group"
          >
            Ver tabela completa de preços
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={buildWa("Olá! Meu problema não está na lista. Pode me ajudar a identificar?")}
            target="_blank"
            rel="noopener nofollow"
            data-cta-location="services_section_footer"
            data-wa-medium="services_footer"
            onClick={() => import("@/lib/analytics").then(({ trackCTAClick }) => trackCTAClick("whatsapp", "services_section_footer"))}
            className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--whatsapp))] px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md hover:bg-[hsl(var(--whatsapp-hover))] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Meu problema não está aqui
          </a>
        </div>
      </div>
    </section>
  );
};
