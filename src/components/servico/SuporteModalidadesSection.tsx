import { Link } from "@/lib/router-compat";
import { CheckCircle2, Repeat, ShieldAlert, Wrench } from "lucide-react";

/**
 * RODADA 3N — Atendimento avulso ou recorrente + limites por contexto.
 * Planos mensais por máquina são exibidos no bloco de suporte gerenciado.
 * Sem franquia de horas, sem prazo garantido e sem promessa de plantão.
 */

const AVULSO = [
  "Problema pontual em um computador específico",
  "Instalação, ajuste ou configuração isolada",
  "Falha de rede ou de impressão que apareceu agora",
  "Diagnóstico de uma máquina instável",
  "Manutenção sem previsão de repetir",
  "Suporte remoto para desbloquear um usuário",
];

const AVULSO_REGRAS = [
  "Escopo definido por solicitação, a cada chamado",
  "Prioridade conforme a agenda disponível no momento",
  "Valor apresentado após o diagnóstico e executado só com sua autorização",
  "Peças e serviços de terceiros tratados à parte",
  "Não existe disponibilidade permanente reservada para a empresa",
];

const RECORRENTE = [
  "Vários computadores em uso diário",
  "Demandas técnicas que se repetem todo mês",
  "Necessidade de manutenção preventiva organizada",
  "Usuários que precisam de suporte periódico",
  "Rede compartilhada entre setores",
  "Backup que exige revisão e conferência",
  "Necessidade de histórico e organização do que foi feito",
];

const RECORRENTE_DEPENDE = [
  "Levantamento inicial do ambiente",
  "Quantidade de equipamentos e usuários",
  "Frequência das visitas ou revisões",
  "Modalidades usadas (remoto, presencial, bancada)",
  "Escopo do que entra e do que fica de fora",
  "Horários de atendimento combinados",
  "Regra de prioridade entre chamados",
  "Responsabilidades de cada lado",
];

const COMPARATIVO = [
  { criterio: "Uso", avulso: "Demanda pontual", recorrente: "Necessidades frequentes" },
  { criterio: "Escopo", avulso: "Definido por chamado", recorrente: "Definido por acordo" },
  { criterio: "Histórico", avulso: "Por atendimento", recorrente: "Acompanhamento organizado" },
  { criterio: "Preventiva", avulso: "Contratada separadamente", recorrente: "Pode fazer parte do escopo" },
  { criterio: "Prioridade", avulso: "Conforme agenda", recorrente: "Conforme regra contratada" },
  { criterio: "Valor", avulso: "Conforme serviço", recorrente: "Plano por máquina ou escopo levantado" },
];

const PODE = [
  "Verificar o computador e o comportamento do sistema",
  "Validar conectividade, rede e acesso local",
  "Registrar o erro por escrito, com evidência",
  "Auxiliar na comunicação técnica com o fornecedor",
  "Executar procedimentos autorizados pela empresa",
  "Configurar componentes compatíveis na estação",
];

const NAO_PROMETE = [
  "Corrigir código interno do sistema de terceiros",
  "Liberar licença de software",
  "Redefinir credencial mantida por outro fornecedor",
  "Alterar política corporativa definida pela empresa",
  "Garantir o funcionamento de plataforma externa",
  "Substituir o suporte oficial do fornecedor",
  "Burlar restrição, bloqueio ou proteção",
  "Assumir responsabilidade por indisponibilidade externa",
];

const DEPENDENTES = [
  "software empresarial",
  "sistema contábil",
  "prontuário",
  "sistema judicial",
  "ERP",
  "CRM",
  "certificado digital",
  "e-mail corporativo",
  "domínio",
  "provedor",
  "operadora",
  "fabricante",
  "administrador da empresa",
];

export const SuporteModalidadesSection = () => (
  <>
    <section className="bg-background py-12 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-2xl font-heading font-bold text-foreground md:text-3xl">
            Atendimento avulso ou recorrente
          </h2>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            Os dois formatos existem e nenhum é automaticamente melhor. O avulso resolve o incidente
            de agora; o recorrente organiza o que se repete. A escolha depende da quantidade de
            equipamentos, da frequência das demandas e de quanto a parada custa para a operação.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <Wrench className="mb-3 h-6 w-6 text-accent" />
              <h3 className="mb-2 text-lg font-bold text-foreground">Atendimento avulso</h3>
              <p className="mb-3 text-sm text-muted-foreground">Indicado para:</p>
              <ul className="mb-4 space-y-2">
                {AVULSO.map((i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-2 text-sm font-semibold text-foreground">Como funciona:</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {AVULSO_REGRAS.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <Repeat className="mb-3 h-6 w-6 text-accent" />
              <h3 className="mb-2 text-lg font-bold text-foreground">Atendimento recorrente</h3>
              <p className="mb-3 text-sm text-muted-foreground">Faz sentido quando existem:</p>
              <ul className="mb-4 space-y-2">
                {RECORRENTE.map((i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-2 text-sm font-semibold text-foreground">O formato depende de:</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {RECORRENTE_DEPENDE.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparativo entre atendimento avulso e atendimento recorrente
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-bold text-foreground">Critério</th>
                  <th scope="col" className="py-3 pr-4 font-bold text-foreground">Avulso</th>
                  <th scope="col" className="py-3 font-bold text-foreground">Recorrente</th>
                </tr>
              </thead>
              <tbody>
                {COMPARATIVO.map((r) => (
                  <tr key={r.criterio} className="border-b border-border/60">
                    <th scope="row" className="py-3 pr-4 font-semibold text-foreground">{r.criterio}</th>
                    <td className="py-3 pr-4 text-muted-foreground">{r.avulso}</td>
                    <td className="py-3 text-muted-foreground">{r.recorrente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Não trabalhamos com suporte ilimitado, plantão permanente nem prazo de resposta garantido. O
            acompanhamento preventivo e os itens atendidos dependem do plano ou escopo registrado. As condições comerciais aplicáveis estão em{" "}
            <Link to="/precos-e-politicas" className="font-semibold text-accent hover:underline">
              preços e políticas
            </Link>
            , e a visão empresarial mais ampla fica em{" "}
            <Link to="/empresa-de-ti-curitiba" className="font-semibold text-accent hover:underline">
              empresa de TI em Curitiba
            </Link>
            .
          </p>
        </div>
      </div>
    </section>

    <section className="bg-secondary py-12 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-heading font-bold text-foreground md:text-3xl">
            <ShieldAlert className="h-6 w-6 text-accent" /> O que depende de fornecedor, autorização
            ou especialização
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Parte dos problemas de uma empresa não está no computador. Eles pertencem a quem mantém
            a plataforma: {DEPENDENTES.join(", ")}. Nesses casos o papel do suporte é identificar
            onde a falha está e documentar isso, para que a empresa acione o responsável certo.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 font-bold text-foreground">O que o suporte pode fazer</h3>
              <ul className="space-y-2">
                {PODE.map((i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
              <h3 className="mb-3 font-bold text-foreground">O que o suporte não promete</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {NAO_PROMETE.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            A divisão de responsabilidade sobre credenciais e acessos está detalhada em{" "}
            <Link to="/seguranca-dos-dados" className="font-semibold text-accent hover:underline">
              segurança dos dados
            </Link>
            . Para o que pode ser resolvido sem visita, veja o{" "}
            <Link to="/atendimento-remoto" className="font-semibold text-accent hover:underline">
              atendimento remoto
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  </>
);
