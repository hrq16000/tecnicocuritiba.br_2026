import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, HardDrive, MessageCircle } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import ProximosProblemas from "@/components/problemas/ProximosProblemas";

const PATH = "/problemas/windows-nao-inicia";
const TITLE = "Windows Não Inicia: Como Recuperar o Sistema | Curitiba";
const DESCRIPTION =
  "Windows travado no logo, reparo automático em loop ou mensagem de disco de inicialização não encontrado? Veja como separar falha de sistema, disco com setor ruim e configuração de BIOS antes de formatar, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre Windows que não inicia. Meu computador liga mas o sistema não carrega e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Trava no logo do Windows com a bolinha girando",
    desc: "Carregamento que nunca termina costuma ser driver corrompido, atualização interrompida ou disco com leitura lenta em setores do sistema.",
  },
  {
    titulo: "Reparo automático em loop",
    desc: "A tela de recuperação reaparece a cada reinício quando os arquivos de boot estão inconsistentes ou o disco responde com erro intermitente.",
  },
  {
    titulo: "Mensagem de dispositivo de boot não encontrado",
    desc: "Aqui o sistema nem chega a ser lido: ou a BIOS perdeu a ordem de inicialização ou o disco não está sendo reconhecido.",
  },
  {
    titulo: "Tela preta com cursor piscando",
    desc: "Indica que o firmware entregou o controle mas o carregador do Windows não foi encontrado no lugar esperado.",
  },
  {
    titulo: "Reinicia sozinho antes da tela de login",
    desc: "Reinício antes do login aponta para driver crítico, memória instável ou corrupção do registro do sistema.",
  },
  {
    titulo: "Erro logo após uma atualização",
    desc: "Atualização interrompida por queda de energia deixa arquivos pela metade e é uma das causas mais frequentes que recebemos.",
  },
];

const CAUSAS = [
  "Atualização do Windows interrompida por desligamento abrupto ou queda de energia",
  "Arquivos de inicialização corrompidos após desligar o equipamento no botão repetidas vezes",
  "Disco rígido com setores defeituosos exatamente na área do sistema",
  "SSD com firmware travado ou controladora em falha, comum em unidades muito antigas",
  "Ordem de boot alterada na BIOS depois de instalar outro disco ou pen drive",
  "Modo de armazenamento trocado entre AHCI e RAID por reset de configuração",
  "Memória RAM instável, que derruba o carregamento antes da tela de login",
  "Infecção que altera o carregador de inicialização e impede a carga do sistema",
];

const VERIFICACOES = [
  "Retire pen drives, HDs externos e cartões de memória antes de ligar: um deles pode estar assumindo a ordem de boot.",
  "Ligue e observe se aparece a marca do fabricante. Se aparece, o hardware básico respondeu e o problema está mais à frente.",
  "Anote a mensagem exata de erro ou fotografe a tela. O texto muda completamente a suspeita.",
  "Se o equipamento entra na tela de recuperação, evite clicar em restaurar sem antes saber se há backup dos seus arquivos.",
  "Desligue da tomada, aguarde alguns minutos e ligue novamente para descartar travamento momentâneo de firmware.",
  "Não instale nenhum Windows por cima antes da avaliação: reinstalação apressada é o caminho mais rápido para perder arquivos.",
  "Se houver ruído de clique vindo do disco, pare de ligar o equipamento e nos informe imediatamente.",
  "Registre há quanto tempo o problema começou e o que foi feito antes dele aparecer.",
];

const OPCOES = [
  {
    titulo: "Recuperação do sistema sem perder arquivos",
    desc: "Quando o disco está saudável, o reparo do carregador e a correção dos arquivos de boot devolvem o sistema sem formatar. É o cenário mais comum e o que sempre tentamos primeiro.",
    to: "/servicos/formatacao",
    label: "Formatação e sistema",
  },
  {
    titulo: "Cópia dos dados antes de qualquer intervenção",
    desc: "Se o disco apresenta erro de leitura, a prioridade muda: primeiro copiamos o que dá para copiar, depois discutimos reparo do sistema.",
    to: "/servicos/recuperacao-de-dados",
    label: "Recuperação de dados",
  },
  {
    titulo: "Troca de disco e migração",
    desc: "Disco com setores defeituosos não volta a ser confiável. A saída é migrar para SSD, e o valor sai antes de qualquer compra.",
    to: "/servicos/upgrade-ssd-ram",
    label: "Upgrade de SSD e memória",
  },
  {
    titulo: "Quando o computador nem chega a ligar",
    desc: "Se não aparece imagem nenhuma e nada acende, o roteiro de verificação é outro e começa pela alimentação.",
    to: "/problemas/computador-nao-liga",
    label: "Computador não liga",
  },
];

const FAQS = [
  {
    question: "Windows não inicia significa que vou perder meus arquivos?",
    answer:
      "Não necessariamente, e na maioria dos atendimentos os arquivos são preservados. Sistema que não carrega e disco danificado são coisas diferentes. A avaliação começa justamente medindo a saúde do disco antes de qualquer reparo, e só então definimos se dá para recuperar o sistema no lugar ou se convém copiar os dados primeiro.",
  },
  {
    question: "Formatar resolve o problema?",
    answer:
      "Resolve em parte dos casos, mas é a última alternativa e não a primeira. Formatar apaga o que estiver no disco e, se a origem for setor defeituoso, o problema volta em poucas semanas. Por isso o roteiro correto é diagnosticar o disco, recuperar os dados quando necessário e só depois reinstalar.",
  },
  {
    question: "O que é o reparo automático em loop?",
    answer:
      "É a tentativa do próprio Windows de se consertar, repetida sem sucesso. Ela aparece quando os arquivos de inicialização estão inconsistentes ou quando o disco responde com erro em algumas leituras e não em outras. O loop em si não danifica nada, mas insistir em reiniciar dezenas de vezes com disco em falha piora o quadro.",
  },
  {
    question: "Pode ser problema de memória RAM?",
    answer:
      "Pode, e é um cenário que testamos em bancada. Memória instável derruba o carregamento sempre em momentos diferentes, sem padrão fixo. Quando a falha ocorre exatamente no mesmo ponto toda vez, a suspeita se volta para disco ou arquivos de sistema.",
  },
  {
    question: "Consigo resolver por atendimento remoto?",
    answer:
      "Não neste caso. O atendimento remoto depende do sistema carregado e com rede ativa. Quando o Windows não inicia, a avaliação precisa ser física, com o equipamento em bancada ou em visita técnica no endereço.",
  },
  {
    question: "Vale a pena consertar um computador antigo com esse problema?",
    answer:
      "Depende do que a avaliação encontrar. Reparo de sistema em máquina antiga costuma compensar. Troca de disco em equipamento com placa já no fim da vida útil nem sempre compensa, e quando esse for o caso dizemos isso abertamente, com os números na mão, antes de você aprovar qualquer serviço.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado.",
  },
];

const WindowsNaoInicia = () => {
  const waHref = whatsappLink(WA_MESSAGE);

  useEffect(() => {
    trackPageView(PATH, TITLE);
  }, []);

  useJsonLdSlot(
    SCHEMA_SLOTS.webPage,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl(PATH)}#webpage`,
      name: "Windows não inicia: sistema, disco ou configuração de boot",
      description: DESCRIPTION,
      url: absoluteUrl(PATH),
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      publisher: { "@id": `${absoluteUrl("/")}#organization` },
    },
    SLOT_PRIORITY.page,
  );

  useJsonLdSlot(
    SCHEMA_SLOTS.faq,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${absoluteUrl(PATH)}#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    SLOT_PRIORITY.page,
  );

  const cta = (location: string) => () =>
    trackCTAClick("whatsapp", `problema-windows-nao-inicia-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Windows não inicia" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Windows não inicia: sistema, disco ou configuração de boot
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:text-lg">
            Computador que liga mas não carrega o sistema quase nunca precisa de formatação imediata. Este roteiro
            mostra o que observar antes de arriscar seus arquivos.
          </p>
          <Button asChild size="lg" variant="secondary" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="problema_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </div>
      </section>

      <TrustStrip />

      <RealImageSection
        imageKey="diagnostico"
        secondaryImageKey="componentesSsd"
        layout="duo"
        caption="Leitura de saúde do disco antes de qualquer tentativa de reparo do sistema"
        secondaryCaption="Unidades de armazenamento testadas em bancada antes da migração de dados"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "ordem", label: "A ordem certa de investigar" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="ordem" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">A ordem certa de investigar um sistema que não carrega</h2>
          <p className="mb-3 text-muted-foreground">
            A primeira pergunta é se o equipamento chega a exibir a marca do fabricante. Se chega, alimentação, memória
            e vídeo já responderam, e a falha está no caminho entre o firmware e o sistema. Se não chega, o problema é
            anterior e nem envolve o Windows.
          </p>
          <p className="mb-3 text-muted-foreground">
            A segunda pergunta é se o erro é sempre igual. Falha idêntica em todas as tentativas aponta para arquivo de
            sistema ou setor específico do disco. Falha que muda de lugar a cada reinício aponta para memória ou
            alimentação instável, e o tratamento é completamente diferente.
          </p>
          <p className="text-muted-foreground">
            Se além de não carregar o equipamento desliga sozinho no meio do processo, vale conferir{" "}
            <Link to="/problemas/computador-desliga-sozinho" className="font-medium text-accent hover:underline">
              computador desliga sozinho
            </Link>
            . Se o sistema carrega mas demora demais, o caso é outro:{" "}
            <Link to="/problemas/computador-lento" className="font-medium text-accent hover:underline">
              computador lento
            </Link>
            .
          </p>
        </section>

        <section id="sintomas" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Sintomas e o que cada um costuma indicar</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SINTOMAS.map((s) => (
              <div key={s.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{s.titulo}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="causas" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Causas mais comuns nos casos que recebemos</h2>
          <p className="mb-4 text-muted-foreground">
            Atualização interrompida e disco com setor defeituoso lideram com folga. Ordem de boot alterada por um pen
            drive esquecido aparece com frequência surpreendente e se resolve em minutos.
          </p>
          <ul className="grid gap-2 md:grid-cols-2">
            {CAUSAS.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <HardDrive className="h-6 w-6 text-accent" /> Verificações seguras antes de reinstalar qualquer sistema
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhum passo abaixo apaga dados nem exige abrir o equipamento. Siga na ordem e pare assim que identificar o
            cenário.
          </p>
          <ol className="space-y-2">
            {VERIFICACOES.map((t, i) => (
              <li key={t} className="flex gap-3 text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            O que não recomendamos: reinstalar o Windows por conta própria antes de saber a saúde do disco, usar
            programas de reparo baixados de fontes desconhecidas e insistir em reiniciar um equipamento que já faz
            ruído de clique.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">O que resolve cada cenário</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {OPCOES.map((o) => (
              <div key={o.titulo} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{o.titulo}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{o.desc}</p>
                <Link
                  to={o.to}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  {o.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-accent/30 bg-accent/5 p-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Critérios objetivos antes de você decidir</h2>
          <p className="mb-5 text-muted-foreground">
            As condições completas de atendimento estão em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Dados antes de sistema</h3>
              <p className="text-sm text-muted-foreground">
                Quando o disco apresenta erro de leitura, a cópia dos arquivos vem antes de qualquer tentativa de
                reparo. Essa ordem não é negociada.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Recusa declarada</h3>
              <p className="text-sm text-muted-foreground">
                Disco com dano físico severo exige sala limpa, procedimento que não executamos. Quando o caso é esse,
                informamos antes de retirar o equipamento.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia do serviço executado</h3>
              <p className="text-sm text-muted-foreground">
                Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo realizado. Sem balcão:
                retirada e devolução no endereço informado.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: recuperação integral de dados em disco com dano físico, prazo fixo antes da avaliação
            e garantia sobre licenças e programas instalados por terceiros.
          </p>
        </section>

        <section id="faq" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Perguntas frequentes</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{f.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Descreva a tela que aparece ao ligar</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Logo travado, reparo automático em loop ou mensagem de disco não encontrado apontam para caminhos
            diferentes. Essa informação encurta o diagnóstico e protege seus arquivos.
          </p>
          <Button asChild size="lg" variant="secondary" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar sobre meu caso
            </a>
          </Button>
        </section>
        <ProximosProblemas path={PATH} />
      </main>

      <Footer />
    </div>
  );
};

export default WindowsNaoInicia;
