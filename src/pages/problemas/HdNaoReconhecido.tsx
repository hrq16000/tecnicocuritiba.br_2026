import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, MessageCircle, HardDrive } from "lucide-react";
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

const PATH = "/problemas/hd-nao-reconhecido";
const TITLE = "HD ou SSD Não é Reconhecido: O Que Fazer | Curitiba";
const DESCRIPTION =
  "O computador não reconhece o HD ou SSD? Entenda a diferença entre falha de cabo, de partição e de mecânica, por que insistir reduz a chance de recuperar arquivos e como funciona a coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre HD não reconhecido. Meu computador parou de reconhecer o disco e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "O disco some da BIOS",
    desc: "Se o equipamento não enxerga a unidade antes mesmo do sistema carregar, o problema é físico ou de conexão. Nenhum programa de recuperação instalado no Windows resolve esse cenário.",
  },
  {
    titulo: "Aparece na BIOS, mas o Windows não abre",
    desc: "Costuma ser tabela de partição corrompida ou setor de inicialização danificado. Os arquivos normalmente ainda existem e a leitura em outro equipamento confirma isso.",
  },
  {
    titulo: "Pede formatação ao conectar",
    desc: "A mensagem assusta, mas raramente significa perda. O sistema apenas não conseguiu ler a estrutura do disco. Aceitar a formatação nesse momento é o erro que mais destrói dados recuperáveis.",
  },
  {
    titulo: "Clique ritmado ou zumbido no HD",
    desc: "Barulho repetitivo indica falha mecânica em disco rígido. Cada nova tentativa de ligar arrasta a cabeça de leitura sobre a superfície e reduz a chance de recuperação.",
  },
  {
    titulo: "Conecta, desconecta e reconecta sozinho",
    desc: "Típico de alimentação insuficiente ou cabo com mau contato, muito comum em gaveta externa. Também aparece em fonte de PC já no limite de carga.",
  },
  {
    titulo: "SSD desapareceu de uma vez, sem aviso",
    desc: "Unidades sólidas falham de forma abrupta, sem ruído nem lentidão prévia. Por isso backup em SSD é ainda mais importante do que era em disco mecânico.",
  },
];

const CAUSAS = [
  "Cabo de dados ou de energia com mau contato, solto ou defeituoso",
  "Porta SATA ou slot M.2 com falha na placa-mãe",
  "Tabela de partição corrompida após desligamento abrupto",
  "Setores defeituosos que travam a leitura do início do disco",
  "Falha mecânica em disco rígido, com cabeça de leitura comprometida",
  "Controladora do SSD queimada por pico de energia",
  "Alimentação insuficiente em gaveta externa sem fonte própria",
  "Desgaste natural de disco com muitos anos de uso contínuo",
];

const VERIFICACOES = [
  "Entre na BIOS/Setup e confira se o disco aparece listado — essa é a informação mais importante de todas.",
  "Se houver barulho de clique, desligue e não volte a ligar: o dano é progressivo a cada tentativa.",
  "Nunca aceite a oferta de formatar quando o sistema pedir; isso reescreve estruturas que ainda serviriam à recuperação.",
  "Troque o cabo SATA e a porta na placa antes de concluir que o disco morreu.",
  "Em gaveta externa, teste com fonte própria ou em porta USB traseira, que costuma entregar mais corrente.",
  "Não instale programas de recuperação no mesmo disco que você quer recuperar.",
  "Não abra o HD para 'ver por dentro': partícula de poeira na superfície inutiliza o prato.",
  "Anote quando parou de funcionar e o que aconteceu antes — queda, queda de energia ou atualização mudam a hipótese.",
];

const OPCOES = [
  {
    titulo: "Verificação de conexão e porta",
    desc: "Primeiro passo em bancada: teste do disco em outra controladora, com cabo e alimentação conhecidos. Uma parte real dos casos termina aqui, sem troca de peça nenhuma.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Recuperação lógica de dados",
    desc: "Para partição corrompida ou sistema que não inicia. Trabalhamos sobre cópia da unidade, nunca sobre o disco original, para que nenhuma tentativa reduza a chance das seguintes.",
    to: "/servicos/recuperacao-de-dados",
    label: "Recuperação de dados",
  },
  {
    titulo: "Avaliação de falha física",
    desc: "Quando há ruído mecânico ou o disco nem energiza. Avaliamos a viabilidade e informamos com honestidade a chance real antes de qualquer procedimento — sem cobrar tentativa improvável.",
    to: "/servicos/recuperacao-de-dados",
    label: "Avaliar disco com defeito",
  },
  {
    titulo: "Substituição por SSD e rotina de backup",
    desc: "Depois de resolver a urgência, o passo que evita a repetição: unidade nova, migração dos dados e uma rotina de cópia que funcione sem depender de você lembrar dela.",
    to: "/servicos/upgrade-ssd-ram",
    label: "Upgrade de SSD",
  },
];

const FAQS = [
  {
    question: "O computador pede para formatar o disco. Posso aceitar?",
    answer:
      "Não aceite. Essa mensagem aparece quando o sistema não consegue interpretar a estrutura da unidade, o que na maioria das vezes não significa que os arquivos sumiram. Formatar reescreve justamente as tabelas que um trabalho de recuperação usaria para remontar as pastas. O procedimento correto é desconectar o disco, não usá-lo mais e encaminhar para leitura em bancada, sobre uma cópia.",
  },
  {
    question: "Como saber se o problema é o disco ou o computador?",
    answer:
      "O primeiro teste é a BIOS. Se a unidade aparece lá e o sistema não inicia, o disco está vivo eletricamente e a falha é de estrutura lógica. Se não aparece nem na BIOS, o passo seguinte é trocar cabo e porta antes de qualquer conclusão — mau contato e porta SATA defeituosa produzem exatamente o mesmo sintoma de disco morto e custam muito menos para resolver.",
  },
  {
    question: "Meu HD está fazendo barulho de clique. Isso tem conserto?",
    answer:
      "O clique ritmado indica que a cabeça de leitura não consegue se posicionar, e o desfecho depende muito da rapidez. Cada nova tentativa de ligar aumenta o risco de riscar a superfície, então a orientação é desligar imediatamente e não testar mais. Recuperação nesse cenário é procedimento especializado, com chance variável — informamos a expectativa real antes, e não iniciamos tentativa quando ela é improvável.",
  },
  {
    question: "Programas de recuperação que eu baixo funcionam?",
    answer:
      "Funcionam em casos leves, como arquivo apagado por engano em disco saudável. Em disco que não é reconhecido, costumam piorar a situação por dois motivos: são instalados no mesmo equipamento afetado, sobrescrevendo áreas úteis, e trabalham diretamente sobre a unidade com defeito, forçando leituras que aceleram a degradação. O caminho seguro é sempre clonar primeiro e trabalhar sobre a cópia.",
  },
  {
    question: "Quanto custa recuperar os dados?",
    answer:
      "Depende do tipo de falha, e por isso o valor não sai antes da avaliação. Casos lógicos, com o disco íntegro, são bem mais acessíveis que casos com dano mecânico. Damos a faixa provável a partir da sua descrição e o valor fechado depois da inspeção, sempre com sua aprovação antes de qualquer execução. Se a chance for baixa, dizemos isso em vez de vender uma tentativa.",
  },
  {
    question: "Como o disco chega até vocês?",
    answer:
      "Por coleta no endereço informado — não temos balcão de atendimento ao público. Você aciona pelo WhatsApp, combinamos a retirada do computador ou apenas da unidade, a avaliação é feita em bancada e a devolução acontece no mesmo endereço. Para HD com ruído mecânico, orientamos transporte sem energizar o aparelho.",
  },
  {
    question: "Os arquivos recuperados vêm de que forma?",
    answer:
      "Entregamos em mídia separada — outro disco ou pen drive, conforme o volume — e nunca de volta na unidade que falhou. Você confere o conteúdo antes de encerrarmos o atendimento. Nada dos seus arquivos permanece conosco depois da entrega, e não abrimos documentos além do necessário para verificar a integridade da recuperação.",
  },
  {
    question: "Existe garantia em recuperação de dados?",
    answer:
      "Garantimos o serviço executado e a mídia de entrega por 90 dias, mas não existe garantia de resultado em recuperação: nenhuma bancada honesta promete trazer 100% dos arquivos de um disco com defeito. O que garantimos é transparência sobre a chance antes de começar, procedimento sobre cópia e devolução do equipamento com laudo quando o resultado não for possível.",
  },
];

const HdNaoReconhecido = () => {
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
      name: "HD ou SSD não reconhecido: diagnóstico e recuperação",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-hd-nao-reconhecido-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "HD não reconhecido" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            HD ou SSD não reconhecido: o que fazer antes de perder os arquivos
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Quando o disco some, a diferença entre recuperar tudo e perder tudo costuma estar nas duas horas
            seguintes. Insistir em ligar, aceitar a formatação sugerida pelo sistema e rodar programas de recuperação
            sobre a unidade com defeito são as três atitudes que destroem dados que ainda estavam lá. Esta página
            explica o que verificar e em que ordem.
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
        imageKey="componentesSsd"
        secondaryImageKey="bancadaTecnica"
        layout="duo"
        caption="Unidades de armazenamento preparadas para teste em controladora conhecida"
        secondaryCaption="Leitura feita sobre cópia da unidade, nunca sobre o disco original"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "ordem-certa", label: "A ordem certa de agir" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="ordem-certa" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Por que a ordem importa mais que a ferramenta</h2>
          <p className="mb-3 text-muted-foreground">
            Falha de armazenamento tem uma característica cruel: quase toda tentativa de resolver por conta própria
            consome parte da chance de recuperação. Ligar repetidamente um disco com problema mecânico desgasta a
            superfície. Aceitar a formatação sugerida reescreve a estrutura de pastas. Instalar um programa de
            recuperação no mesmo computador grava dados por cima da área que se queria salvar.
          </p>
          <p className="mb-3 text-muted-foreground">
            Por isso o primeiro passo em bancada nunca é recuperar: é preservar. Fazemos a leitura setor a setor para
            uma cópia e todo o trabalho acontece sobre essa cópia. Se a primeira abordagem não der resultado, a
            segunda começa com exatamente as mesmas chances — o que não aconteceria trabalhando sobre o disco vivo.
          </p>
          <p className="text-muted-foreground">
            O procedimento completo está descrito em{" "}
            <Link to="/servicos/recuperacao-de-dados" className="font-medium text-accent hover:underline">
              recuperação de dados
            </Link>
            , e casos em que o disco está saudável e o problema é do equipamento seguem para{" "}
            <Link to="/servicos/manutencao-de-computador" className="font-medium text-accent hover:underline">
              manutenção de computador
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
            Uma parte relevante dos atendimentos termina sem troca de peça, em cabo, porta ou alimentação. Só a
            inspeção define em qual grupo o seu caso está — descrição por mensagem serve para orientar a urgência, não
            para fechar diagnóstico.
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
            <HardDrive className="h-6 w-6 text-accent" /> Sequência segura antes de qualquer tentativa
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os três primeiros itens são os que mais preservam a chance de recuperar seus arquivos.
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
            O que não recomendamos em nenhuma hipótese: congelar o HD, bater no aparelho para "destravar a cabeça",
            abrir a unidade fora de ambiente controlado e rodar verificação de erros do sistema em disco que já
            apresenta falha física.
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
            Valem para todo atendimento envolvendo armazenamento e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Trabalho sobre cópia</h3>
              <p className="text-sm text-muted-foreground">
                A unidade original é preservada. Toda tentativa acontece sobre imagem do disco, para não consumir a
                chance das abordagens seguintes.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. Retiramos o equipamento ou apenas a unidade no endereço
                informado e devolvemos no mesmo endereço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Sigilo dos seus dados</h3>
              <p className="text-sm text-muted-foreground">
                Arquivos entregues em mídia separada e nada retido depois da conferência. Abrimos apenas o necessário
                para verificar integridade.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: recuperação garantida de disco com dano mecânico, prazo fixo antes da leitura
            inicial e percentual de arquivos recuperados estimado por telefone.
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
          <h2 className="mb-3 text-2xl font-bold">Conte o que aconteceu com o seu disco</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe se a unidade aparece na BIOS, se há barulho, o que você já tentou e quando parou de funcionar.
            Esses dados definem a urgência da coleta e a chance real de recuperação.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </section>
        <ProximosProblemas path={PATH} />
      </main>

      <Footer />
    </div>
  );
};

export default HdNaoReconhecido;
