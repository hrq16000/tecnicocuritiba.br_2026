import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, Usb, MessageCircle } from "lucide-react";
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

const PATH = "/problemas/pen-drive-nao-reconhecido";
const TITLE = "Pen Drive Não Reconhecido: O Que Fazer | Curitiba";
const DESCRIPTION =
  "Pen drive não aparece no computador, pede formatação ou some do nada? Veja como separar porta USB, letra de unidade, tabela de partição corrompida e falha física antes de perder os arquivos, com avaliação em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre pen drive não reconhecido. Meu pen drive não aparece no computador e preciso dos arquivos.";

const SINTOMAS = [
  {
    titulo: "Não aparece em nenhum computador",
    desc: "Quando nenhum equipamento reconhece a unidade, o problema está no próprio dispositivo: controlador, solda do conector ou memória interna.",
  },
  {
    titulo: "Aparece em um computador e no outro não",
    desc: "Isso desloca a suspeita para o computador: porta USB sem energia, driver com conflito ou letra de unidade já ocupada pelo sistema.",
  },
  {
    titulo: "O sistema pede para formatar",
    desc: "Pedido de formatação significa tabela de partição ilegível, não arquivos perdidos. Formatar nesse momento é o erro mais caro que existe.",
  },
  {
    titulo: "Reconhece, mas mostra pasta vazia",
    desc: "Estrutura de diretórios corrompida ou arquivos ocultos por praga digital. Os dados costumam continuar gravados na memória.",
  },
  {
    titulo: "Conecta e desconecta sozinho",
    desc: "O som repetido de conexão indica conector com mau contato, alimentação insuficiente na porta ou solda rompida no dispositivo.",
  },
  {
    titulo: "Esquenta muito ao conectar",
    desc: "Aquecimento anormal aponta para curto no controlador. Nesse caso, insistir em conectar reduz a chance de recuperação dos dados.",
  },
];

const CAUSAS = [
  "Solda do conector USB rompida por esforço mecânico ou queda com a unidade conectada",
  "Controlador de memória em falha, o componente que traduz o conteúdo para o computador",
  "Tabela de partição corrompida por remoção sem ejeção segura",
  "Setores de memória flash esgotados após muitos ciclos de gravação",
  "Porta USB do computador sem energia suficiente ou danificada",
  "Conflito de letra de unidade já ocupada por outro dispositivo",
  "Praga digital que oculta arquivos e cria atalhos falsos",
  "Sistema de arquivos incompatível com o computador utilizado",
];

const VERIFICACOES = [
  "Teste a unidade em outro computador antes de qualquer coisa: isso separa em um minuto problema do pen drive de problema da máquina.",
  "Troque de porta USB e prefira as portas traseiras em desktops, que costumam fornecer energia mais estável.",
  "Abra o gerenciamento de disco do Windows e verifique se a unidade aparece sem letra atribuída — se aparecer, o dispositivo está vivo.",
  "Se o sistema pedir formatação, recuse. Formatar sobrescreve a estrutura e reduz drasticamente a chance de recuperar arquivos.",
  "Verifique se há arquivos ocultos exibindo os itens ocultos do sistema antes de concluir que a pasta está vazia.",
  "Examine o conector: folga, entortamento ou marca de esforço indicam solda rompida.",
  "Evite ferramentas automáticas de reparo baixadas por conta própria: várias reescrevem a partição e destroem o que ainda era recuperável.",
  "Se os arquivos são insubstituíveis, pare de conectar e peça avaliação. Cada tentativa gasta a chance restante.",
];

const OPCOES = [
  {
    titulo: "Recuperação lógica dos arquivos",
    desc: "Quando a memória está íntegra e o problema é tabela de partição ou estrutura corrompida, a leitura é feita em bancada com ferramenta de recuperação, sem gravar nada na unidade original.",
    to: "/servicos/recuperacao-de-dados",
    label: "Recuperação de dados",
  },
  {
    titulo: "Ressolda do conector USB",
    desc: "Conector solto por esforço mecânico é reparo de microssolda. Recuperado o contato, os arquivos costumam ser lidos normalmente.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Verificação de praga digital",
    desc: "Pen drive que exibe atalhos falsos ou some com arquivos costuma ter passado por máquina infectada. Nesse caso o computador também precisa ser tratado.",
    to: "/servicos/remocao-de-virus",
    label: "Remoção de vírus",
  },
  {
    titulo: "Quando o problema é o computador",
    desc: "Se outros dispositivos também não são reconhecidos, a investigação sai do pen drive e vai para as portas e o sistema da máquina.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
];

const FAQS = [
  {
    question: "O Windows pede para formatar o pen drive. Posso aceitar?",
    answer:
      "Não, se os arquivos importam. O pedido de formatação significa que o sistema não consegue ler a tabela de partição, e não que os dados sumiram. Formatar reescreve exatamente a área que a recuperação usaria como mapa, então a chance de resgate cai muito depois desse passo. Desconecte a unidade e traga para avaliação antes de aceitar.",
  },
  {
    question: "O pen drive não aparece em computador nenhum. Tem solução?",
    answer:
      "Depende de qual parte falhou. Se o problema é a solda do conector, a ressolda restabelece o contato e os arquivos voltam a ser lidos. Se o controlador de memória entrou em falha, a leitura exige procedimento de bancada mais complexo e o resultado não é garantido. Avaliamos e informamos a chance real antes de qualquer tentativa.",
  },
  {
    question: "Aparece a pasta vazia, mas o espaço usado está lá. O que houve?",
    answer:
      "Esse é o quadro clássico de arquivos ocultos por praga digital ou de estrutura de diretórios corrompida. Como o espaço ocupado continua contabilizado, os dados seguem gravados na memória e costumam ser recuperáveis. Vale checar a exibição de itens ocultos antes de concluir qualquer coisa.",
  },
  {
    question: "Recuperação de dados em pen drive tem garantia de sucesso?",
    answer:
      "Não, e desconfie de quem garante. O resultado depende do que falhou, de quantas tentativas já foram feitas e do desgaste da memória flash. O que garantimos é o método: nada é gravado na unidade original e o diagnóstico informa a chance real antes de você aprovar a continuidade.",
  },
  {
    question: "Usei um programa de reparo baixado da internet. Piorou?",
    answer:
      "Pode ter piorado, sim. Vários utilitários gratuitos reconstroem a tabela de partição gravando por cima da área original, e isso apaga justamente a referência que a recuperação profissional utilizaria. Não é sentença definitiva, mas reduz a chance. Pare de usar a unidade e informe quais ferramentas foram executadas.",
  },
  {
    question: "Vale mais consertar o pen drive ou só recuperar os arquivos?",
    answer:
      "Na prática, quase sempre o objetivo é o conteúdo. Pen drive é um item de custo baixo, e insistir em devolvê-lo ao uso depois de uma falha de memória não é recomendável, porque a reincidência é alta. Nossa orientação padrão é recuperar os arquivos, entregar em outra mídia e aposentar a unidade.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. As condições completas estão em preços e políticas.",
  },
];

const PenDriveNaoReconhecido = () => {
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
      name: "Pen drive não reconhecido: porta USB, partição corrompida ou falha física",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-pen-drive-nao-reconhecido-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Pen drive não reconhecido" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Pen drive não reconhecido: porta USB, partição corrompida ou falha física
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            A prioridade aqui não é o dispositivo, é o conteúdo. Esta página mostra o que fazer — e principalmente o
            que não fazer — para preservar a chance de recuperar os arquivos.
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
        imageKey="bancadaTecnica"
        secondaryImageKey="ferramentas"
        layout="duo"
        caption="Bancada usada na leitura de mídias, sempre sem gravar na unidade original"
        secondaryCaption="Ferramental de microssolda aplicado em conector USB com solda rompida"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "prioridade", label: "A prioridade é o conteúdo" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="prioridade" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">A prioridade é o conteúdo, não o dispositivo</h2>
          <p className="mb-3 text-muted-foreground">
            Pen drive é mídia de custo baixo e vida útil limitada. Quando ele para de ser reconhecido, o valor em jogo
            está nos arquivos, e cada tentativa desnecessária consome parte da chance de recuperá-los.
          </p>
          <p className="mb-3 text-muted-foreground">
            Existem dois erros que encerram muitos casos antes mesmo do diagnóstico: aceitar a formatação sugerida pelo
            sistema e rodar utilitários de reparo automáticos. Ambos gravam na unidade e sobrescrevem a estrutura que
            seria usada para localizar os dados.
          </p>
          <p className="text-muted-foreground">
            Se o problema é com HD ou SSD em vez de pen drive, o roteiro está em{" "}
            <Link to="/problemas/hd-nao-reconhecido" className="font-medium text-accent hover:underline">
              HD não reconhecido
            </Link>
            . Para entender o procedimento completo de resgate, veja{" "}
            <Link to="/servicos/recuperacao-de-dados" className="font-medium text-accent hover:underline">
              recuperação de dados
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
            Remoção sem ejeção segura e conector danificado por esforço mecânico respondem pela maior parte dos
            atendimentos. Desgaste de memória flash aparece em unidades usadas como disco de trabalho, função para a
            qual elas nunca foram feitas.
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
            <Usb className="h-6 w-6 text-accent" /> Verificações seguras antes de qualquer tentativa
          </h2>
          <p className="mb-4 text-muted-foreground">
            Todos os passos abaixo são de leitura, nenhum grava na unidade. Siga na ordem e pare assim que identificar
            o cenário.
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
            O que não recomendamos: formatar, executar reparadores automáticos, abrir a carcaça com alicate e conectar
            repetidamente uma unidade que esquenta.
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
              <h3 className="mb-2 font-semibold text-foreground">Nada é gravado na origem</h3>
              <p className="text-sm text-muted-foreground">
                A leitura é feita sobre imagem da mídia sempre que possível. A unidade original não recebe escrita
                durante o processo.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Chance informada antes</h3>
              <p className="text-sm text-muted-foreground">
                O diagnóstico diz qual é a probabilidade real de resgate no seu caso. Você decide se autoriza a
                continuidade com essa informação em mãos.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e sigilo</h3>
              <p className="text-sm text-muted-foreground">
                Sem balcão: retirada e devolução no endereço informado. O conteúdo recuperado é entregue em mídia nova
                e não é retido após a entrega.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: recuperação garantida, prazo fixo antes da avaliação e reaproveitamento seguro de uma
            unidade que já apresentou falha de memória.
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
          <h2 className="mb-3 text-2xl font-bold">Não formate antes de falar com a gente</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Conte o que aparece na tela e quais tentativas já foram feitas. Isso muda diretamente a chance de recuperar
            os seus arquivos.
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

export default PenDriveNaoReconhecido;
