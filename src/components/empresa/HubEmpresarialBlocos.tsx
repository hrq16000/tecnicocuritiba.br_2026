import { Link } from "@/lib/router-compat";
import { Monitor, Network, ShieldCheck, Headset, ArrowRight } from "lucide-react";

/**
 * RODADA 3S — blocos visuais exclusivos do hub empresarial.
 *
 * Apenas apresentação de informação já publicada:
 *   • Pilares operacionais — quatro frentes, cada uma apontando para
 *     uma rota canônica existente (nenhum serviço novo).
 *   • Mapa de serviços empresariais — navegação com no máximo sete
 *     entradas, sem preço, sem plano e sem duplicar os cards da home.
 *
 * Sem CTA de WhatsApp: a hierarquia de CTAs do hub (hero, intermediário
 * e final) permanece inalterada.
 */

const PILARES = [
  {
    icon: Monitor,
    titulo: "Computadores e usuários",
    texto:
      "Lentidão, falhas, configurações, estações de trabalho e o suporte ao usuário que precisa voltar a produzir.",
    to: "/servicos/suporte-tecnico-empresarial",
    linkLabel: "Suporte técnico empresarial",
  },
  {
    icon: Network,
    titulo: "Redes e conectividade",
    texto:
      "Wi-Fi, cabeamento, impressoras em rede, compartilhamento de arquivos e estabilidade da conexão no escritório.",
    to: "/servicos/redes-e-wifi",
    linkLabel: "Redes e Wi-Fi",
  },
  {
    icon: ShieldCheck,
    titulo: "Prevenção e continuidade",
    texto:
      "Manutenção preventiva, rotinas de backup, organização do ambiente e recomendações para reduzir riscos de parada.",
    to: "/servicos/manutencao-preventiva-empresas",
    linkLabel: "Manutenção preventiva",
  },
  {
    icon: Headset,
    titulo: "Atendimento remoto e presencial",
    texto:
      "A triagem indica a modalidade compatível com a demanda, o que pode ser resolvido a distância e o que exige visita.",
    to: "/atendimento-remoto",
    linkLabel: "Atendimento remoto",
  },
];

const MAPA = [
  {
    label: "Suporte técnico empresarial",
    to: "/servicos/suporte-tecnico-empresarial",
    desc: "Chamados do dia a dia: estações, usuários, acessos e falhas que param a operação.",
  },
  {
    label: "Manutenção preventiva",
    to: "/servicos/manutencao-preventiva-empresas",
    desc: "Revisão periódica dos equipamentos para antecipar falhas, com escopo definido em conjunto.",
  },
  {
    label: "Backup para empresas",
    to: "/servicos/backup-para-empresas",
    desc: "Estruturação e conferência das rotinas de cópia dos arquivos que a empresa não pode perder.",
  },
  {
    label: "Redes e Wi-Fi",
    to: "/servicos/redes-e-wifi",
    desc: "Levantamento do ambiente, cobertura, cabeamento e impressoras compartilhadas.",
  },
  {
    label: "Atendimento remoto",
    to: "/atendimento-remoto",
    desc: "Ajustes e desbloqueios que dispensam visita, quando o acesso do usuário permite.",
  },
  {
    label: "Montagem de workstation",
    to: "/servicos/montagem-de-pc",
    desc: "Máquinas para tarefas exigentes, com requisitos discutidos antes da compra das peças.",
  },
  {
    label: "Segurança dos dados",
    to: "/seguranca-dos-dados",
    desc: "Responsabilidades sobre credenciais, acessos e o que fica com o fornecedor do sistema.",
  },
];

export const PilaresOperacionaisSection = () => (
  <section id="pilares" className="scroll-mt-24 bg-background py-12 md:py-14">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-2xl font-heading font-bold text-foreground md:text-3xl">
          Pilares do atendimento empresarial
        </h2>
        <p className="mb-8 max-w-3xl text-muted-foreground leading-relaxed">
          O atendimento a empresas se organiza em quatro frentes. Cada uma leva à página que
          detalha escopo, limites e como o serviço é executado — nada aqui é serviço novo.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {PILARES.map((p) => (
            <div key={p.titulo} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <p.icon className="mb-3 h-7 w-7 text-accent" aria-hidden="true" />
              <h3 className="mb-2 text-lg font-bold text-foreground">{p.titulo}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
              <Link
                to={p.to}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                {p.linkLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const MapaServicosEmpresariaisSection = () => (
  <section id="mapa-servicos" className="scroll-mt-24 bg-secondary py-12 md:py-14">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-2xl font-heading font-bold text-foreground md:text-3xl">
          Mapa dos serviços empresariais
        </h2>
        <p className="mb-8 text-muted-foreground leading-relaxed">
          Onde procurar cada assunto. As páginas abaixo tratam do escopo em detalhe; esta aqui
          continua sendo a visão geral do ambiente.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {MAPA.map((m) => (
            <li key={m.to}>
              <Link
                to={m.to}
                className="flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
              >
                <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  {m.label}
                  <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
                </span>
                <span className="mt-1 text-sm text-muted-foreground">{m.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
