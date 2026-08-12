import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, MonitorCheck } from "lucide-react";
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

const PATH = "/problemas/monitor-sem-sinal";
const TITLE = "Monitor Sem Sinal: Causas e Solução | Curitiba";
const DESCRIPTION =
  "Monitor mostra \"sem sinal\" com o computador ligado? Veja como separar cabo, entrada errada, placa de vídeo e falha do próprio monitor com testes gratuitos antes de orçar, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre monitor sem sinal. Meu computador liga, mas o monitor fica com a mensagem de sem sinal e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Computador liga, ventoinha gira e o monitor diz \"sem sinal\"",
    desc: "É o cenário mais comum e o mais enganoso: o gabinete dá sinal de vida, mas isso não prova que o computador chegou a inicializar. Sem imagem, ainda não se sabe se o problema é vídeo ou inicialização.",
  },
  {
    titulo: "A mensagem aparece e o monitor entra em modo de espera",
    desc: "Monitor que exibe a mensagem, apaga e acende o LED em amarelo está funcionando: ele avisa que a entrada escolhida não recebe sinal nenhum. A falha está no cabo, na entrada selecionada ou na saída de vídeo.",
  },
  {
    titulo: "Funciona na TV mas não no monitor",
    desc: "Quando o mesmo computador gera imagem em outra tela, o monitor ou o cabo daquele conjunto passam a ser os suspeitos principais, e o teste já eliminou a placa de vídeo do caso.",
  },
  {
    titulo: "Imagem some depois de alguns minutos ligada",
    desc: "Perda de imagem com o equipamento aquecido aponta para placa de vídeo em fadiga térmica, capacitor da fonte do monitor ou cabo com contato instável, e não para configuração.",
  },
  {
    titulo: "Só volta a imagem quando mexo no cabo",
    desc: "Sinal que retorna ao encostar no conector indica pino torto, trava quebrada ou cabo rompido internamente — falha barata de resolver e frequente em setup que muda de lugar.",
  },
  {
    titulo: "Sem imagem depois de um upgrade ou limpeza",
    desc: "Memória mal encaixada, placa de vídeo fora do trilho e cabo de energia da GPU esquecido respondem por quase todos os casos que aparecem logo após alguém abrir o gabinete.",
  },
];

const CAUSAS = [
  "Entrada de vídeo do monitor selecionada em outra opção (HDMI 2, DisplayPort, VGA)",
  "Cabo de vídeo rompido internamente ou com pino do conector torto",
  "Monitor ligado na saída da placa-mãe enquanto existe placa de vídeo dedicada instalada",
  "Módulo de memória fora do encaixe após transporte, limpeza ou upgrade",
  "Placa de vídeo sem o cabo de alimentação auxiliar conectado",
  "Fonte do computador entregando tensão insuficiente para a placa de vídeo",
  "Fonte interna do próprio monitor com capacitor estufado",
  "Falha real de inicialização do computador, sem relação com o monitor",
];

const VERIFICACOES = [
  "Percorra manualmente todas as entradas do monitor pelo botão de fonte, sem confiar na detecção automática.",
  "Troque o cabo de vídeo por outro e, se possível, mude o padrão: quem estava em HDMI vai para DisplayPort ou VGA.",
  "Se o gabinete tem placa de vídeo dedicada, ligue o cabo nela e não na saída da placa-mãe.",
  "Teste o monitor em outro equipamento — notebook, console ou receptor servem — para saber se ele exibe imagem.",
  "Teste o computador em outra tela ou televisor para descobrir se a saída de vídeo está gerando sinal.",
  "Desligue da tomada, reencaixe firmemente os módulos de memória e a placa de vídeo até a trava clicar.",
  "Observe se há bips ou LEDs de diagnóstico na placa-mãe: eles indicam falha de memória ou vídeo antes de qualquer imagem.",
  "Não force conectores nem gire parafuso de painel do monitor: fonte interna guarda carga mesmo desligada.",
];

const OPCOES = [
  {
    titulo: "Diagnóstico de vídeo em bancada",
    desc: "Testamos memória, placa de vídeo, fonte e saída de imagem com peças de referência. É assim que se separa monitor defeituoso de computador que não inicializa, em vez de trocar peça por tentativa.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Reparo do monitor em nível de componente",
    desc: "Quando a falha é da fonte interna do monitor ou da placa de sinal, tratamos o componente com estação de retrabalho. Painel trincado ou com mancha não é reparável e informamos isso na avaliação.",
    to: "/servicos/conserto-monitor",
    label: "Conserto de monitor",
  },
  {
    titulo: "Reparo da placa de vídeo ou da placa-mãe",
    desc: "Saída de vídeo morta e placa dedicada sem sinal são avaliadas em nível de componente antes de qualquer indicação de troca completa da peça.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa eletrônica",
  },
  {
    titulo: "Coleta e devolução no endereço",
    desc: "Gabinete e monitor são retirados no endereço informado, avaliados em bancada e devolvidos no mesmo endereço. Nada é executado antes da aprovação do valor apresentado.",
    to: "/coleta-e-entrega",
    label: "Como funciona a coleta",
  },
];

const FAQS = [
  {
    question: "Meu computador liga mas o monitor fica sem sinal. É o monitor ou o PC?",
    answer:
      "Só o teste cruzado responde. Ligue o monitor em outro equipamento: se ele exibe imagem, o monitor está bom e o problema é da saída de vídeo ou da inicialização do computador. Ligue o computador em outra tela: se a imagem aparece, o monitor ou o cabo daquele conjunto é o defeituoso. Ventoinha girando não prova inicialização — muitos casos de \"sem sinal\" são computador que sequer completa o boot por memória fora do encaixe.",
  },
  {
    question: "Troquei o cabo e continua sem imagem. O que testar depois?",
    answer:
      "Confira a entrada selecionada no monitor manualmente, sem depender da detecção automática, e verifique em qual saída o cabo está ligado. Em máquinas com placa de vídeo dedicada, a saída da placa-mãe costuma ficar desativada, e ligar o cabo nela produz exatamente essa mensagem. Depois disso, reencaixe memória e placa de vídeo com o equipamento fora da tomada.",
  },
  {
    question: "A imagem some depois de alguns minutos. Qual a causa provável?",
    answer:
      "Falha que aparece com o equipamento quente aponta para fadiga térmica na placa de vídeo, capacitor da fonte do monitor no fim da vida ou cabo com contato instável. Não é configuração. Esse padrão pede medição em bancada porque o defeito não se manifesta com o aparelho frio, que é justamente o estado em que um teste rápido acontece.",
  },
  {
    question: "Ficou sem imagem logo depois de uma limpeza. Isso é comum?",
    answer:
      "Muito comum e quase sempre reversível. Ao remover poeira, é fácil deslocar um módulo de memória, tirar a placa de vídeo do trilho ou esquecer o cabo de alimentação auxiliar da GPU. Antes de supor peça queimada, reencaixe cada componente com firmeza até a trava fechar, com o cabo de força retirado da tomada.",
  },
  {
    question: "Vale a pena consertar o monitor ou é melhor comprar outro?",
    answer:
      "Depende do bloco defeituoso. Fonte interna e placa de sinal são reparos de componente que costumam compensar com folga. Painel com trinca, mancha ou linhas fixas não tem reparo viável: a peça sozinha se aproxima do valor de um monitor equivalente, e nesses casos orientamos não fazer o serviço em vez de empurrar orçamento.",
  },
  {
    question: "Preciso levar o equipamento até vocês?",
    answer:
      "Não. Não temos balcão de atendimento ao público. O atendimento acontece no seu endereço, por acesso remoto quando cabível, ou por coleta e entrega quando o caso exige bancada — situação normal em falha de vídeo, que depende de peças de referência para ser isolada com segurança.",
  },
  {
    question: "Qual a garantia do serviço?",
    answer:
      "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo na fonte do monitor cobre a fonte do monitor; troca de placa de vídeo cobre aquela placa. Defeito posterior em outro componente é avaliado como caso novo, e dano por descarga elétrica após a entrega não está coberto.",
  },
];

const MonitorSemSinal = () => {
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
      name: "Monitor sem sinal: como isolar cabo, vídeo e monitor",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-monitor-sem-sinal-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Problemas", path: "/problemas" },
          { name: "Monitor sem sinal", path: PATH },
        ]}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Problemas", href: "/problemas" },
          { label: "Monitor sem sinal" },
        ]}
      />

      <section className="bg-[hsl(var(--hero-bg))] px-4 pb-10 pt-8 text-white sm:pb-14 sm:pt-12">
        <div className="container mx-auto max-w-4xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Monitor sem sinal: cabo, entrada errada, placa de vídeo ou falha do monitor
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            A mensagem de sem sinal quase nunca diz onde está o defeito. Esta página mostra a sequência de testes
            cruzados que usamos para separar cabo, saída de vídeo e monitor antes de qualquer orçamento.
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
        imageKey="desktopMontado"
        secondaryImageKey="diagnostico"
        layout="duo"
        caption="Teste cruzado de saída de vídeo com outra tela antes de indicar troca de peça"
        secondaryCaption="Medição na bancada para separar falha de placa de vídeo e falha do monitor"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "onde-falha", label: "Onde o sinal se perde" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="onde-falha" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">O sinal se perde em um de quatro pontos</h2>
          <p className="mb-3 text-muted-foreground">
            A imagem nasce na saída de vídeo, viaja pelo cabo, entra por uma porta específica do monitor e só então
            aparece no painel. A mensagem de sem sinal significa apenas uma coisa: a porta selecionada não está
            recebendo nada. Ela não distingue cabo rompido, saída morta ou computador que nem completou a inicialização.
          </p>
          <p className="mb-3 text-muted-foreground">
            Por isso o diagnóstico começa por teste cruzado, e não por orçamento. Monitor em outro equipamento e
            computador em outra tela dividem o problema ao meio em dois minutos, sem custo e sem abrir nada.
          </p>
          <p className="text-muted-foreground">
            Se além da falta de imagem o computador não dá nenhum sinal de vida, o quadro é outro e está descrito em{" "}
            <Link to="/problemas/computador-nao-liga" className="font-medium text-accent hover:underline">
              computador não liga
            </Link>
            . Em notebook, a tela integrada tem particularidades explicadas em{" "}
            <Link to="/problemas/notebook-com-tela-preta" className="font-medium text-accent hover:underline">
              notebook com tela preta
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
            Entrada selecionada errada, cabo rompido e componente deslocado depois de limpeza ou mudança respondem pela
            maior parte dos chamados. Falha real de placa de vídeo existe, mas é minoria e só se confirma com medição.
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
            <MonitorCheck className="h-6 w-6 text-accent" /> Testes que você pode fazer antes de acionar alguém
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os cinco primeiros itens resolvem sozinhos uma parte real dos casos, sem nenhum custo.
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
            O que não recomendamos em nenhuma hipótese: abrir a carcaça do monitor, forçar conector com pino torto e
            trocar placa de vídeo por palpite antes do teste cruzado.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">O que resolve cada cenário</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {OPCOES.map((o) => (
              <div key={o.titulo} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{o.titulo}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{o.desc}</p>
                <Link to={o.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                  {o.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-accent/30 bg-accent/5 p-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Critérios objetivos antes de você decidir</h2>
          <p className="mb-5 text-muted-foreground">
            Valem para todo atendimento de vídeo e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Limite declarado</h3>
              <p className="text-sm text-muted-foreground">
                Não trocamos painel de monitor com trinca ou mancha: a peça se aproxima do valor de um aparelho
                equivalente e recusamos o serviço em vez de empurrar orçamento.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. Gabinete e monitor são retirados no endereço informado e
                devolvidos no mesmo endereço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia com escopo</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado. Descarga elétrica posterior é
                dano novo e não está coberta.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: fechar diagnóstico apenas pelo relato no WhatsApp, garantir peça de linha
            descontinuada e sustentar reparo em equipamento com dano elétrico generalizado.
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
          <h2 className="mb-3 text-2xl font-bold">Conte o que já testou</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo do monitor, se a imagem aparece em outra tela e se houve limpeza ou upgrade recente. Com
            isso já indicamos se o caso é de ajuste, atendimento no local ou coleta para bancada.
          </p>
          <Button asChild size="lg" variant="secondary" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar sobre meu caso
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MonitorSemSinal;
