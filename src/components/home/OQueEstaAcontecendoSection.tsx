import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MODALIDADE_DETALHE,
  MODALIDADE_LABEL,
  SOLUTION_FLOW,
  type Modalidade,
  type SolutionOption,
  type SolutionProblem,
} from "@/lib/homeSolutionFlow";
import { track } from "@/lib/funnelAnalytics";

const MODALIDADE_PATH: Record<Modalidade, string> = {
  domicilio: "/atendimento-domicilio",
  remoto: "/atendimento-remoto",
  coleta: "/coleta-e-entrega",
};

const STEPS = ["Problema", "Equipamento", "Solução", "Atendimento"];

/**
 * "O que está acontecendo?" — navegação guiada da Home.
 * Leva o visitante do sintoma até o canal certo, sem inventar diagnóstico
 * e sem prometer solução no local.
 */
export const OQueEstaAcontecendoSection = () => {
  const [problema, setProblema] = useState<SolutionProblem | null>(null);
  const [opcao, setOpcao] = useState<SolutionOption | null>(null);

  const stepIndex = opcao ? 2 : problema ? 1 : 0;

  const escolherProblema = (p: SolutionProblem) => {
    setProblema(p);
    setOpcao(null);
    track("home_solution_step", { step: "problema", problema: p.id });
  };

  const escolherEquipamento = (o: SolutionOption) => {
    setOpcao(o);
    track("home_solution_step", {
      step: "equipamento",
      problema: problema?.id,
      equipamento: o.equipamento,
      solucao: o.solucao.path,
      modalidade: o.modalidade,
    });
  };

  const reiniciar = () => {
    setProblema(null);
    setOpcao(null);
    track("home_solution_step", { step: "reiniciar" });
  };

  const abrirTriagem = (o: SolutionOption) => {
    track("home_solution_cta", {
      problema: problema?.id,
      equipamento: o.equipamento,
      solucao: o.solucao.path,
      modalidade: o.modalidade,
    });
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", {
        detail: { location: "home_solution_flow", message: o.mensagem },
      }),
    );
  };

  return (
    <section id="o-que-esta-acontecendo" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3">
              O que está acontecendo?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o sintoma e mostramos o caminho: qual serviço resolve e qual modalidade de
              atendimento faz sentido — visita de inspeção, remoto ou coleta e entrega.
            </p>
          </div>

          {/* Trilha de etapas */}
          <ol className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs md:text-sm">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 border transition-colors ${
                    i <= stepIndex
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground border-border"
                  }`}
                >
                  {i + 1}. {label}
                </span>
                {i < STEPS.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />}
              </li>
            ))}
          </ol>

          {/* Etapa 1 — problema */}
          {!problema && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SOLUTION_FLOW.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => escolherProblema(p)}
                  className="text-left rounded-xl border border-border bg-card p-4 hover:border-accent/40 hover:shadow-[var(--shadow-md)] transition-all duration-200"
                >
                  <span className="block font-semibold text-primary mb-1">{p.label}</span>
                  <span className="block text-sm text-muted-foreground">{p.descricao}</span>
                </button>
              ))}
            </div>
          )}

          {/* Etapa 2 — equipamento */}
          {problema && !opcao && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                <strong className="text-foreground">{problema.label}.</strong> Qual equipamento?
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {problema.opcoes.map((o) => (
                  <button
                    key={o.equipamento}
                    type="button"
                    onClick={() => escolherEquipamento(o)}
                    className="text-left rounded-xl border border-border bg-card p-4 hover:border-accent/40 hover:shadow-[var(--shadow-md)] transition-all duration-200"
                  >
                    <span className="block font-semibold text-primary mb-1">{o.equipamento}</span>
                    <span className="block text-sm text-muted-foreground">{o.solucao.label}</span>
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-4" onClick={reiniciar}>
                <RotateCcw className="h-4 w-4 mr-1" /> Escolher outro sintoma
              </Button>
            </div>
          )}

          {/* Etapas 3 e 4 — solução + atendimento */}
          {problema && opcao && (
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <p className="text-sm text-muted-foreground mb-4">
                {problema.label} · {opcao.equipamento}
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" /> Solução indicada
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{opcao.porque}</p>
                  <Link
                    to={opcao.solucao.path}
                    className="inline-flex items-center text-sm font-semibold text-accent hover:underline"
                  >
                    {opcao.solucao.label}
                    <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                  </Link>
                </div>

                <div>
                  <h3 className="font-bold text-primary mb-2">Atendimento recomendado</h3>
                  <p className="text-sm font-semibold text-foreground">{MODALIDADE_LABEL[opcao.modalidade]}</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">{MODALIDADE_DETALHE[opcao.modalidade]}</p>
                  <Link
                    to={MODALIDADE_PATH[opcao.modalidade]}
                    className="inline-flex items-center text-sm font-semibold text-accent hover:underline"
                  >
                    Como funciona essa modalidade
                    <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button onClick={() => abrirTriagem(opcao)} className="sm:flex-1">
                  <MessageCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                  Continuar pelo WhatsApp
                </Button>
                <Button variant="outline" onClick={reiniciar}>
                  <RotateCcw className="h-4 w-4 mr-1" aria-hidden="true" /> Recomeçar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OQueEstaAcontecendoSection;
