import { Link } from "@/lib/router-compat";
import { CheckCircle2, Cpu, HardDrive, Info, MemoryStick, Monitor, Wind } from "lucide-react";

/**
 * RODADA 3N — Workstations e estações de trabalho profissionais.
 * Levantamento de requisitos, componentes e limites. Sem promessa de FPS,
 * tempo de render, benchmark sem teste ou desempenho em software nomeado.
 */

const REQUISITOS = [
  "Programas efetivamente utilizados no dia a dia",
  "Tamanho típico dos arquivos e dos projetos",
  "Quantidade de aplicações abertas ao mesmo tempo",
  "Resolução e quantidade de monitores",
  "Uso predominante de processador",
  "Uso de memória em picos de trabalho",
  "Uso de placa de vídeo pela aplicação",
  "Armazenamento necessário para sistema, projetos e cache",
  "Necessidade de expansão futura",
  "Faixa de investimento disponível",
  "Vida útil esperada da máquina",
  "Compatibilidade com o que já existe na empresa",
];

const COMPONENTES = [
  {
    icon: Cpu,
    titulo: "Processador",
    desc: "Relacionado ao tipo de carga e à duração das tarefas. Trabalhos longos e contínuos pedem um conjunto diferente de tarefas curtas e intercaladas.",
  },
  {
    icon: MemoryStick,
    titulo: "Memória",
    desc: "Relacionada ao volume dos projetos, à quantidade de aplicações simultâneas e ao tamanho dos arquivos abertos ao mesmo tempo.",
  },
  {
    icon: Monitor,
    titulo: "Placa de vídeo",
    desc: "Relevante somente quando a aplicação utiliza aceleração gráfica compatível. Nem toda carga profissional se beneficia de uma GPU mais cara.",
  },
  {
    icon: HardDrive,
    titulo: "Armazenamento",
    desc: "Considerar sistema, programas, arquivos de trabalho, cache, projetos ativos e o espaço reservado para a rotina de backup.",
  },
  {
    icon: Wind,
    titulo: "Fonte e refrigeração",
    desc: "Devem ser compatíveis com o conjunto e com a carga prevista. Máquina que trabalha horas seguidas depende de dissipação estável, não de pico.",
  },
];

export const WorkstationSection = () => (
  <section className="bg-background py-12 md:py-14">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-3 text-2xl font-heading font-bold text-foreground md:text-3xl">
          Workstations e estações de trabalho profissionais
        </h2>
        <p className="mb-4 text-muted-foreground leading-relaxed">
          Estação de trabalho não é apenas um computador mais caro: é um conjunto dimensionado para
          a carga que a pessoa executa todos os dias. Antes de indicar peça, fazemos o levantamento
          de requisitos — o que roda, com que tamanho de arquivo, por quanto tempo e em quantos
          monitores. Configurações copiadas da internet costumam errar exatamente aí.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-bold text-foreground">Levantamento de requisitos</h3>
        <p className="mb-4 text-muted-foreground leading-relaxed">
          Não existe configuração universal. A lista abaixo é o que perguntamos antes de propor
          qualquer conjunto de peças:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {REQUISITOS.map((r) => (
            <li key={r} className="flex gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <h3 className="mb-4 mt-8 text-xl font-bold text-foreground">
          O papel de cada componente na estação
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {COMPONENTES.map((c) => (
            <div key={c.titulo} className="rounded-xl border border-border bg-card p-5">
              <c.icon className="mb-2 h-6 w-6 text-accent" />
              <h4 className="mb-1 font-bold text-foreground">{c.titulo}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-3 mt-8 text-xl font-bold text-foreground">
          Limites de desempenho e software
        </h3>
        <p className="mb-3 text-muted-foreground leading-relaxed">
          O levantamento considera categorias de uso — programas de desenho técnico, modelagem,
          renderização, edição, análise de dados e desenvolvimento — porque cada uma pressiona o
          conjunto de um jeito. Ainda assim, compatibilidade e desempenho dependem da versão do
          programa, do tipo de projeto e dos requisitos oficiais publicados pelo fabricante do
          software.
        </p>
        <div className="rounded-xl border border-accent/40 bg-accent/5 p-5">
          <p className="flex gap-2 text-sm leading-relaxed text-foreground">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <span>
              <strong>A montagem correta não garante desempenho específico em um programa.</strong>{" "}
              A configuração deve ser definida a partir dos requisitos da aplicação, do tipo de
              projeto e do valor disponível para o investimento.
            </span>
          </p>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Não prometemos quadros por segundo, tempo de renderização, resultado de teste comparativo
          sem medição real na sua máquina nem qualquer selo de homologação de fabricante.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-bold text-foreground">
          Estação de trabalho dentro do ambiente da empresa
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Uma estação nova raramente vive isolada: ela entra numa rede, imprime, guarda arquivos e
          precisa de rotina de cópia. O acompanhamento do dia a dia é feito pelo{" "}
          <Link
            to="/servicos/suporte-tecnico-empresarial"
            className="font-semibold text-accent hover:underline"
          >
            suporte técnico empresarial
          </Link>
          ; a revisão periódica pela{" "}
          <Link
            to="/servicos/manutencao-preventiva-empresas"
            className="font-semibold text-accent hover:underline"
          >
            manutenção preventiva para empresas
          </Link>
          ; a proteção dos projetos pelo{" "}
          <Link
            to="/servicos/backup-para-empresas"
            className="font-semibold text-accent hover:underline"
          >
            backup para empresas
          </Link>
          . Os tipos de equipamento que atendemos estão em{" "}
          <Link to="/equipamentos-atendidos" className="font-semibold text-accent hover:underline">
            equipamentos atendidos
          </Link>
          , e as condições comerciais em{" "}
          <Link to="/precos-e-politicas" className="font-semibold text-accent hover:underline">
            preços e políticas
          </Link>
          .
        </p>
      </div>
    </div>
  </section>
);
