import { Link } from "@/lib/router-compat";
import { Users, Laptop, MapPinned, FileCheck2, ArrowRight, CheckCircle2 } from "lucide-react";
import { SUPORTE_GERENCIADO } from "@/lib/politicaComercial";

/**
 * RODADA 3S — blocos visuais exclusivos da página de serviço empresarial
 * (/servicos/suporte-tecnico-empresarial).
 *
 * Apresentação de informação já publicada:
 *   • Indicadores de escopo — sem número inventado, sem SLA.
 *   • Fluxo do chamado — etapas, sem prometer visita única.
 *   • Impacto operacional — ajuda a descrever prioridade, sem criar
 *     prioridade automática nem prazo.
 *
 * Nenhum CTA de WhatsApp novo: a hierarquia de CTAs da página não muda.
 */

const INDICADORES = [
  { icon: Laptop, label: "Computadores e usuários" },
  { icon: MapPinned, label: "Remoto e presencial" },
  { icon: Users, label: "Avulso ou recorrente" },
  { icon: FileCheck2, label: "Escopo autorizado antes da execução" },
];

const FLUXO = [
  { passo: "Solicitação", texto: "Você descreve o que parou, em qual equipamento e desde quando." },
  { passo: "Triagem", texto: "Confirmamos os dados do chamado e o que já foi tentado." },
  { passo: "Impacto e equipamentos", texto: "Quantos usuários e quais máquinas estão envolvidos." },
  { passo: "Modalidade", texto: "Remoto, presencial ou bancada, conforme o que a demanda permite." },
  { passo: "Diagnóstico", texto: "Avaliação do que está acontecendo e do que é possível executar." },
  { passo: "Autorização", texto: "Valor e escopo apresentados; nada é executado sem o seu aceite." },
  { passo: "Execução", texto: "Serviço realizado dentro do escopo aprovado." },
  { passo: "Registro e orientação", texto: "Registro do que foi feito e orientação sobre o próximo passo." },
];

const IMPACTO = [
  "Um usuário afetado, com o restante da equipe trabalhando",
  "Vários usuários parados ao mesmo tempo",
  "Equipamento crítico da operação fora do ar",
  "Rede ou Wi-Fi instável para todo o escritório",
  "Impressão indisponível",
  "Arquivos de trabalho inacessíveis",
  "Acesso a sistema externo bloqueado",
  "Existe alternativa temporária enquanto o problema não é resolvido",
];

export const SuporteEmpresarialBlocos = () => (
  <>
    <section
      id="escopo-empresarial"
      className="scroll-mt-24 border-y border-border bg-secondary py-8"
      aria-label="Indicadores de escopo do suporte empresarial"
    >
      <div className="container mx-auto px-4">
        <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INDICADORES.map((i) => (
            <li
              key={i.label}
              className="flex items-start gap-2 rounded-lg border border-border bg-card p-4 text-sm font-medium text-foreground"
            >
              <i.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              {i.label}
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section id="planos-suporte-gerenciado" className="scroll-mt-24 bg-background py-12 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Suporte gerenciado de TI</p>
            <h2 className="mt-2 text-2xl font-heading font-bold text-foreground md:text-3xl">
              Planos proativos para empresas a partir de {SUPORTE_GERENCIADO.minimoEquipamentos} computadores
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              O objetivo é organizar a rotina de tecnologia antes que cada problema vire uma urgência. A cobertura é
              definida por máquina cadastrada e o escopo fica documentado: assim a empresa sabe o que está incluído,
              o que precisa de avaliação e quem acompanha cada decisão técnica.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {SUPORTE_GERENCIADO.planos.map((plano) => (
              <article
                key={plano.nome}
                className={`rounded-xl border bg-card p-6 ${plano.nome === "Pro" ? "border-accent shadow-[0_12px_32px_-18px_hsl(var(--accent)/0.65)]" : "border-border"}`}
              >
                <p className="text-sm font-semibold text-accent">{plano.destaque}</p>
                <h3 className="mt-2 text-xl font-heading font-bold text-foreground">Plano {plano.nome}</h3>
                <p className="mt-4 text-3xl font-heading font-bold text-foreground">
                  {plano.valorLabel}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">/ máquina / mês</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Mínimo de {SUPORTE_GERENCIADO.minimoEquipamentos} computadores gerenciados.</p>
                <ul className="mt-6 space-y-3">
                  {plano.recursos.map((recurso) => (
                    <li key={recurso} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      <span>{recurso}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-xl border border-border bg-secondary p-5 text-sm text-muted-foreground md:grid-cols-2">
            <p><strong className="text-foreground">O que é avaliado à parte:</strong> {SUPORTE_GERENCIADO.exclusoesLabel}</p>
            <p><strong className="text-foreground">Limites transparentes:</strong> {SUPORTE_GERENCIADO.limitesLabel}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="fluxo-empresarial" className="scroll-mt-24 bg-background py-12 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-2xl font-heading font-bold text-foreground md:text-3xl">
            Como corre um chamado empresarial
          </h2>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            As etapas abaixo descrevem o percurso do chamado. Elas não acontecem necessariamente em
            uma única visita: diagnóstico, autorização e execução podem ocorrer em momentos
            diferentes, conforme o que for encontrado.
          </p>
          <ol className="grid gap-3 sm:grid-cols-2">
            {FLUXO.map((f, idx) => (
              <li key={f.passo} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                  {idx + 1}
                </span>
                <span>
                  <span className="block text-sm font-bold text-foreground">{f.passo}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{f.texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>

    <section id="impacto" className="scroll-mt-24 bg-secondary py-12 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-2xl font-heading font-bold text-foreground md:text-3xl">
            Como descrever o impacto na operação
          </h2>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            Descrever o impacto ajuda a organizar a triagem. Escolha a situação mais próxima da sua
            ao abrir o chamado:
          </p>
          <ul className="mb-6 grid gap-2 sm:grid-cols-2">
            {IMPACTO.map((i) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
              >
                {i}
              </li>
            ))}
          </ul>
          <p className="rounded-lg border border-border bg-card p-4 text-sm text-foreground">
            O impacto informado ajuda na triagem, mas prazo e prioridade dependem de
            disponibilidade, escopo e eventual contratação específica.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Responsabilidades sobre credenciais e acessos estão detalhadas em{" "}
            <Link to="/seguranca-dos-dados" className="font-semibold text-accent hover:underline">
              segurança dos dados
            </Link>
            , e a visão do ambiente completo fica em{" "}
            <Link
              to="/empresa-de-ti-curitiba"
              className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
            >
              empresa de TI em Curitiba
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  </>
);
