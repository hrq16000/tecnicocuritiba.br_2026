import { Link } from "@/lib/router-compat";
import { AlertTriangle, Building2, CheckCircle2, ClipboardList, ShieldAlert } from "lucide-react";

/**
 * RODADA 3N — Contextos empresariais atendidos.
 * Conteúdo generalista: descreve situações operacionais reais, sem prometer
 * especialização setorial, conformidade ou suporte a sistemas de terceiros.
 */

const CONTEXTOS = [
  {
    titulo: "Escritórios com prazos e arquivos sensíveis",
    desc: "Operações que dependem de estações de trabalho estáveis, impressão e digitalização em ordem, arquivos acessíveis e cópia de segurança revisada. Nesses casos o ponto crítico costuma ser a continuidade durante períodos importantes: múltiplos monitores funcionando, conectividade estável e atendimento remoto disponível para ajustes rápidos no meio do expediente.",
    limite:
      "Não prometemos suporte especializado a sistemas judiciais, plataformas setoriais, certificados digitais complexos, assinatura eletrônica avançada ou conformidade junto a conselhos de classe.",
  },
  {
    titulo: "Recepções e postos de atendimento ao público",
    desc: "O computador da recepção, a impressora em rede, o Wi-Fi da sala de espera, os arquivos compartilhados, câmera e áudio para chamadas e o acesso a sistemas mantidos por terceiros. O objetivo é manter o posto de atendimento funcionando, com o mínimo de interrupção para quem está sendo atendido.",
    limite:
      "O suporte de informática não inclui manutenção de equipamentos médicos, laboratoriais ou outros dispositivos especializados.",
  },
  {
    titulo: "Escritórios com períodos de fechamento",
    desc: "Fim de mês, fechamento de período e entregas concentradas aumentam temporariamente o uso: mais programas abertos ao mesmo tempo, impressoras exigidas, armazenamento no limite, backup que precisa estar em dia, estações que não podem travar e acesso remoto para quem trabalha fora. O planejamento preventivo antes da janela crítica costuma custar menos que a parada durante ela.",
    limite:
      "Não prometemos suporte especializado ao funcionamento interno de software contábil ou fiscal: atuamos na máquina, na rede e no acesso, não dentro do sistema do fornecedor.",
  },
  {
    titulo: "Profissionais que trabalham com arquivos pesados",
    desc: "Projetos grandes, muitas aplicações simultâneas e arquivos que crescem a cada versão exigem avaliação de memória, armazenamento, refrigeração, quantidade de monitores e rede. É o cenário típico de montagem ou atualização de uma estação de trabalho dimensionada para a carga real.",
    limite:
      "Não afirmamos desempenho garantido em um programa específico: a configuração é definida a partir dos requisitos da aplicação e do tipo de projeto.",
  },
];

const REGISTRAR = [
  "Equipamento afetado (identificação ou local na empresa)",
  "Usuário afetado e se o problema atinge outras pessoas",
  "Horário aproximado em que o problema começou",
  "Mensagem de erro exibida, se houver (foto da tela ajuda)",
  "Programa ou serviço envolvido",
  "Alteração recente: atualização, troca de peça, mudança de rede ou de senha",
  "Impacto na operação e quantas pessoas estão paradas",
  "Quantidade de estações com o mesmo comportamento",
  "Se o acesso remoto é possível no momento",
  "Se existe backup recente dos arquivos envolvidos",
  "Quem autoriza alterações no equipamento ou na conta",
  "Contato do fornecedor do sistema, quando o problema for dele",
];

const NAO_ENVIAR = [
  "Senha por mensagem",
  "Código de autenticação em duas etapas",
  "Dados bancários ou de cartão",
  "Arquivos confidenciais sem necessidade técnica",
  "Acesso administrativo sem que o serviço exija",
  "Documento pessoal digitalizado",
];

export const ContextosEmpresariaisSection = () => (
  <section className="bg-background py-12 md:py-14">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-3 text-2xl font-heading font-bold text-foreground md:text-3xl">
          Contextos empresariais que podem precisar de suporte
        </h2>
        <p className="mb-8 text-muted-foreground leading-relaxed">
          Empresas de segmentos diferentes chegam com problemas parecidos. O que muda é o contexto
          de uso: quantas pessoas dependem do equipamento, qual arquivo não pode parar e qual
          sistema externo está envolvido. Abaixo estão situações operacionais que atendemos —
          descritas como contexto, não como especialização setorial.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {CONTEXTOS.map((c) => (
            <div key={c.titulo} className="rounded-xl border border-border bg-card p-6">
              <Building2 className="mb-3 h-6 w-6 text-accent" />
              <h3 className="mb-2 text-lg font-bold text-foreground">{c.titulo}</h3>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <p className="flex gap-2 text-sm text-muted-foreground">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>
                  <strong className="text-foreground">Limite: </strong>
                  {c.limite}
                </span>
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Precisa de uma estação dimensionada para arquivos pesados? A avaliação de requisitos está
          descrita em{" "}
          <Link to="/servicos/montagem-de-pc" className="font-semibold text-accent hover:underline">
            montagem de PC e workstation
          </Link>
          . A execução do dia a dia é conduzida pelo{" "}
          <Link
            to="/servicos/suporte-tecnico-empresarial"
            className="font-semibold text-accent hover:underline"
          >
            suporte técnico empresarial
          </Link>
          , e o tratamento de acessos e credenciais está em{" "}
          <Link to="/seguranca-dos-dados" className="font-semibold text-accent hover:underline">
            segurança dos dados
          </Link>
          .
        </p>
      </div>
    </div>
  </section>
);

export const RegistrarAntesSection = () => (
  <section className="bg-secondary py-12 md:py-14">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-3 flex items-center gap-2 text-2xl font-heading font-bold text-foreground md:text-3xl">
          <ClipboardList className="h-6 w-6 text-accent" /> O que registrar antes de solicitar suporte
        </h2>
        <p className="mb-6 text-muted-foreground leading-relaxed">
          Informações objetivas sobre o equipamento, o erro e o impacto ajudam a direcionar a
          triagem. Senhas e códigos de autenticação não devem ser enviados por mensagem.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 font-bold text-foreground">Registre antes de abrir o chamado</h3>
            <ul className="space-y-2">
              {REGISTRAR.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground">
              <AlertTriangle className="h-5 w-5 text-destructive" /> O que nunca pedimos por mensagem
            </h3>
            <ul className="space-y-2">
              {NAO_ENVIAR.map((n) => (
                <li key={n} className="text-sm text-muted-foreground">
                  • {n}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Se alguma dessas informações for solicitada em nome da empresa, desconfie. O
              tratamento de credenciais durante o atendimento está detalhado em{" "}
              <Link to="/seguranca-dos-dados" className="font-semibold text-accent hover:underline">
                segurança dos dados
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
