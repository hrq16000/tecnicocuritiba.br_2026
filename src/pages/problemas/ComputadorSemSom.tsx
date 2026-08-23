import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, Volume2, MessageCircle } from "lucide-react";
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

const PATH = "/problemas/computador-sem-som";
const TITLE = "Computador Sem Som: Como Resolver | Curitiba";
const DESCRIPTION =
  "Computador sem som, som só no fone ou saída de áudio sumida do Windows? Veja como separar dispositivo de saída errado, driver, conector danificado e falha no chip de áudio antes de trocar peça, com avaliação em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre computador sem som. Meu computador parou de reproduzir áudio e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Nenhum som em nenhum programa",
    desc: "Aponta para dispositivo de saída selecionado errado, serviço de áudio parado ou driver ausente — quase sempre software.",
  },
  {
    titulo: "Som só no fone, nunca na caixa",
    desc: "A saída frontal ou traseira pode estar com conector oxidado, ou o sistema fixou o fone como dispositivo padrão.",
  },
  {
    titulo: "A saída de áudio sumiu da lista do Windows",
    desc: "Driver desinstalado em atualização ou chip de áudio não reconhecido pela placa-mãe. A lista vazia é o indício-chave.",
  },
  {
    titulo: "Som falha só em um programa",
    desc: "Configuração de saída por aplicativo ou mixer com volume zerado. O hardware está intacto nesse cenário.",
  },
  {
    titulo: "Chiado, estalos e som picotado",
    desc: "Interferência elétrica, cabo mal blindado ou driver conflitante. Também aparece em fonte com aterramento ruim.",
  },
  {
    titulo: "Som some depois de um tempo ligado",
    desc: "Quando o áudio desaparece com o uso, entra na conta aquecimento do chip e falha intermitente na placa.",
  },
];

const CAUSAS = [
  "Dispositivo de saída padrão apontando para monitor HDMI sem alto-falantes",
  "Driver de áudio removido ou substituído por versão genérica em atualização do sistema",
  "Serviço de áudio do Windows parado após desligamento incorreto",
  "Conector P2 frontal solto ou desconectado da placa-mãe no gabinete",
  "Oxidação no jack de áudio por umidade ou uso intenso",
  "Cabo da caixa de som rompido internamente, comum perto do plugue",
  "Chip de áudio integrado em falha, geralmente após descarga elétrica",
  "Mixer com volume zerado para aplicativos específicos",
];

const VERIFICACOES = [
  "Confira o dispositivo de saída no ícone de volume: com monitor HDMI conectado, o sistema costuma mandar o áudio para lá.",
  "Abra o mixer de volume e verifique se algum aplicativo está zerado ou mudo individualmente.",
  "Teste um fone conhecido na saída frontal e depois na traseira: se um funciona e o outro não, o problema é o conector.",
  "Teste a caixa de som em outro equipamento, inclusive celular, para descartar cabo rompido.",
  "Veja no gerenciador de dispositivos se a placa de áudio aparece listada e sem alerta.",
  "Reinicie o computador uma vez antes de concluir qualquer coisa: serviço de áudio parado volta com o reinício.",
  "Não instale pacotes de driver baixados de sites genéricos: eles substituem o driver correto e complicam o diagnóstico.",
  "Se o som sumiu depois de raio ou queda de energia, informe isso — muda a suspeita para o chip de áudio.",
];

const OPCOES = [
  {
    titulo: "Correção de driver e configuração",
    desc: "Quando a lista de dispositivos está correta e o hardware responde, a solução é reinstalar o driver adequado ao modelo e restaurar as saídas padrão.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Reparo do conector de áudio",
    desc: "Jack solto, oxidado ou desconectado da placa-mãe é serviço de bancada. Recuperado o contato, a saída volta a funcionar normalmente.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Reinstalação limpa do sistema",
    desc: "Quando o áudio some junto de outras falhas de sistema, a reinstalação com backup antes costuma sair mais barata que caçar conflito por conflito.",
    to: "/servicos/formatacao",
    label: "Formatação com backup",
  },
  {
    titulo: "Quando o som é de TV, não de PC",
    desc: "Se o equipamento sem áudio é a televisão e não o computador, o roteiro de verificação é outro.",
    to: "/problemas/tv-sem-som",
    label: "TV sem som",
  },
];

const FAQS = [
  {
    question: "Meu computador ficou sem som do nada. É defeito de hardware?",
    answer:
      "Na maioria dos casos, não. Som que some sem queda, sem raio e sem pancada costuma ser driver substituído em atualização, serviço de áudio parado ou dispositivo de saída trocado para o monitor HDMI. Vale checar essas três frentes antes de considerar defeito físico, porque nenhuma delas exige peça.",
  },
  {
    question: "O som funciona no fone mas não na caixa. O que é?",
    answer:
      "Duas possibilidades dominam esse quadro. A primeira é o sistema ter fixado o fone como saída padrão e não voltar sozinho. A segunda é o cabo ou o plugue da caixa estar rompido internamente, algo comum perto da dobra do conector. Testar a caixa em um celular resolve a dúvida em um minuto.",
  },
  {
    question: "A placa de áudio sumiu do gerenciador de dispositivos. Isso é grave?",
    answer:
      "Não necessariamente. Sumir da lista acontece quando o driver foi removido ou quando o dispositivo está desativado. Também pode indicar que o chip de áudio da placa-mãe deixou de responder, o que é mais sério. A diferença entre os dois cenários aparece no diagnóstico em bancada, e não em qualquer ajuste feito por fora.",
  },
  {
    question: "Vale a pena instalar uma placa de som em vez de consertar?",
    answer:
      "Em desktop, quando o chip de áudio integrado realmente falhou, uma placa dedicada ou um adaptador USB costuma ser a saída mais econômica, e dizemos isso quando é o caso. Em notebook, essa alternativa é limitada e a avaliação precisa considerar o conector e a placa. A recomendação sai depois do diagnóstico, não antes.",
  },
  {
    question: "O som está chiando e picotando. Também é falta de driver?",
    answer:
      "Pode ser, mas não só. Chiado e picotes aparecem em conflito de driver, em interferência elétrica e em cabo sem blindagem passando junto de fonte. Trocar o cabo de posição e testar outra saída ajuda a isolar. Se o ruído acompanha o computador em qualquer saída, o caminho é o diagnóstico técnico.",
  },
  {
    question: "Formatar resolve problema de áudio?",
    answer:
      "Resolve quando a origem é software, mas é a última opção e não a primeira. Antes disso vale conferir saída padrão, mixer, serviço de áudio e driver. Se optarmos por reinstalação, o backup é feito antes e os dados são devolvidos depois, sem improviso.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Parte dos casos de áudio se resolve por atendimento remoto, e nesse caso avisamos antes.",
  },
];

const ComputadorSemSom = () => {
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
      name: "Computador sem som: saída errada, driver, conector ou chip de áudio",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-computador-sem-som-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Computador sem som" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Computador sem som: saída errada, driver, conector ou chip de áudio
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            A maior parte dos computadores sem áudio não tem peça queimada. Esta página separa, na ordem certa, o que
            é configuração, o que é driver e o que é falha física.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="problema_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </div>
      </section>

      <TrustStrip />

      <RealImageSection
        imageKey="diagnostico"
        secondaryImageKey="bancadaTecnica"
        layout="duo"
        caption="Verificação das saídas de áudio e do dispositivo padrão antes de qualquer intervenção física"
        secondaryCaption="Bancada usada no teste do conector frontal e do chip de áudio integrado"
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">A ordem certa de investigar áudio</h2>
          <p className="mb-3 text-muted-foreground">
            Falta de som é o sintoma em que mais se troca peça sem necessidade. Antes de qualquer compra, a
            investigação correta segue quatro camadas: saída selecionada, mixer por aplicativo, driver do sistema e só
            então hardware.
          </p>
          <p className="mb-3 text-muted-foreground">
            Um detalhe explica boa parte dos atendimentos: monitores conectados por HDMI aparecem como dispositivo de
            áudio, mesmo quando não têm alto-falante. O sistema passa a enviar o som para lá e o usuário conclui que a
            placa queimou, quando na prática nada quebrou.
          </p>
          <p className="text-muted-foreground">
            Se além do áudio o computador também está instável, vale conferir{" "}
            <Link to="/problemas/computador-travando" className="font-medium text-accent hover:underline">
              computador travando
            </Link>
            . Para ajustes que não exigem coleta, veja{" "}
            <Link to="/atendimento-remoto" className="font-medium text-accent hover:underline">
              atendimento remoto
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
            Saída padrão apontando para o monitor e driver substituído em atualização somam a maioria dos casos.
            Conector frontal solto aparece bastante em gabinetes que já foram abertos para upgrade.
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
            <Volume2 className="h-6 w-6 text-accent" /> Verificações seguras antes de trocar qualquer peça
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhum passo abaixo exige abrir o gabinete nem instalar programa. Siga na ordem e pare assim que
            identificar o cenário.
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
            O que não recomendamos: instalar pacotes automáticos de driver, comprar caixa de som antes de testar a
            saída e forçar o plugue em jack que já está com folga.
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
              <h3 className="mb-2 font-semibold text-foreground">Software antes de peça</h3>
              <p className="text-sm text-muted-foreground">
                A investigação começa por configuração e driver. Só depois de esgotar essa camada o diagnóstico avança
                para conector e chip de áudio.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Remoto quando cabe</h3>
              <p className="text-sm text-muted-foreground">
                Boa parte dos casos de áudio se resolve sem retirar o equipamento. Quando o remoto resolve, é o que
                indicamos.
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
            O que não prometemos: recuperação de chip de áudio em qualquer placa, prazo fixo antes da avaliação e
            garantia sobre caixas de som e cabos que não fornecemos.
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
          <h2 className="mb-3 text-2xl font-bold">Conte em que situação o som sumiu</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Se foi depois de atualização, de queda de energia ou do nada, isso muda a suspeita e encurta o
            diagnóstico.
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

export default ComputadorSemSom;
