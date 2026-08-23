import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, Cpu, MessageCircle } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ServicosCorrelatos } from "@/components/informatica/ServicosCorrelatos";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import ProximosProblemas from "@/components/problemas/ProximosProblemas";

const PATH = "/problemas/computador-desliga-sozinho";
const TITLE = "Computador Desliga Sozinho? Diagnóstico em Curitiba";
const DESCRIPTION =
  "Computador ou notebook que desliga sozinho, reinicia do nada ou apaga durante jogos: entenda a diferença entre temperatura, fonte, energia e software, o que observar antes do atendimento e como é feito o diagnóstico.";

const WA_MESSAGE =
  "Olá! Vim da página sobre computador que desliga sozinho. Meu equipamento está apagando do nada e preciso de diagnóstico.";

const SINTOMAS = [
  {
    titulo: "Apaga instantaneamente, como se tirassem da tomada",
    desc: "Corte seco, sem tela de erro e sem aviso do sistema. Esse comportamento aponta para proteção elétrica atuando ou para interrupção de alimentação — raramente é causado por software.",
  },
  {
    titulo: "Reinicia sozinho e volta com aviso de erro",
    desc: "Quando o sistema retorna informando desligamento inesperado, houve uma falha registrada. Aqui existe rastro para analisar, e o caminho passa por memória, armazenamento e driver antes do hardware de potência.",
  },
  {
    titulo: "Só desliga em jogo, render ou tarefa pesada",
    desc: "A falha aparece exatamente quando o consumo sobe. É o padrão mais associado a dissipação insuficiente ou a fonte que não sustenta o pico de carga exigido pelo conjunto.",
  },
  {
    titulo: "Desliga depois de alguns minutos ligado",
    desc: "Tempo previsível até apagar costuma acompanhar aquecimento progressivo: a temperatura sobe até o limite de proteção e o equipamento se desliga para não danificar componentes.",
  },
  {
    titulo: "Apaga ao mexer no cabo ou encostar no gabinete",
    desc: "Comportamento ligado a mau contato: conector de energia, cabo interno, memória mal encaixada ou parafuso solto tocando a placa. Muda de figura em relação a falha térmica.",
  },
  {
    titulo: "Desliga em horários de pico ou quando outro aparelho liga",
    desc: "Quando o desligamento acompanha chuveiro, ar-condicionado ou micro-ondas, a suspeita sai do computador e vai para a instalação elétrica do imóvel.",
  },
];

const CAUSAS = [
  "Dissipador obstruído por poeira e pasta térmica ressecada elevando a temperatura de trabalho",
  "Ventoinha do processador com rotação reduzida ou travando de forma intermitente",
  "Fonte de alimentação com capacidade real abaixo do exigido pelo conjunto",
  "Fonte com componentes degradados que não sustentam pico de consumo",
  "Memória RAM instável ou mal encaixada gerando falha crítica",
  "Armazenamento no fim da vida útil provocando travamento e reinício",
  "Bateria interna com falha em notebook, cortando a alimentação sem aviso",
  "Instalação elétrica com queda de tensão, aterramento ausente ou tomada com mau contato",
  "Driver incompatível ou atualização interrompida gerando reinício em cadeia",
  "Curto pontual na placa após oscilação elétrica — o cenário mais grave da lista",
];

const VERIFICACOES = [
  "Anotar se o desligamento é seco (sem tela) ou se o sistema volta avisando erro — essa é a informação mais valiosa da triagem.",
  "Registrar em quanto tempo de uso a falha acontece e se ela depende da tarefa executada.",
  "Testar em outra tomada, sem extensão nem filtro de linha, de preferência em outro cômodo do imóvel.",
  "Observar se o ventilador acelera muito antes de apagar e se a saída de ar está quente ou fraca.",
  "Desconectar periféricos externos e verificar se o comportamento muda sem eles.",
  "Verificar se o gabinete ou o notebook está sobre superfície que bloqueia as entradas de ar.",
  "Em notebook, testar com a bateria carregada e depois só na tomada, anotando a diferença.",
];

const OPCOES = [
  {
    titulo: "Limpeza técnica e recuperação da dissipação",
    desc: "Indicada quando a falha acompanha aquecimento: remoção da poeira do dissipador, verificação da ventoinha e troca da pasta térmica com medição de temperatura antes e depois. Não é aplicada por suposição — depende do que a leitura mostra.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Avaliação e troca de fonte",
    desc: "Quando o desligamento aparece só sob carga e a temperatura está dentro do esperado, a fonte entra em teste. Avaliamos a capacidade real diante do consumo do conjunto antes de indicar substituição.",
    to: "/servicos/manutencao-de-computador",
    label: "Avaliação de fonte",
  },
  {
    titulo: "Teste de memória e armazenamento",
    desc: "Cobre os casos com reinício e registro de erro. Memória é validada módulo a módulo e o disco tem a saúde lida antes de qualquer decisão sobre reinstalação ou substituição.",
    to: "/servicos/upgrade-ssd-ram",
    label: "Upgrade de SSD e RAM",
  },
  {
    titulo: "Reparo em nível de componente na placa",
    desc: "Reservado aos casos em que a alimentação da placa é interrompida internamente. Envolve medição ponto a ponto em bancada e só segue depois de a viabilidade ser confirmada e autorizada.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
];

const FAQS = [
  {
    question: "Computador que desliga sozinho é sempre superaquecimento?",
    answer:
      "Não. Superaquecimento é a causa mais conhecida, mas responde por parte dos casos. Fonte sem capacidade para o pico de consumo, memória instável, armazenamento no fim da vida, mau contato interno e problema na rede elétrica do imóvel produzem exatamente o mesmo sintoma. Por isso a triagem começa perguntando como o equipamento apaga, e não presumindo temperatura.",
  },
  {
    question: "Qual a diferença entre desligar seco e reiniciar com aviso de erro?",
    answer:
      "Desligamento seco significa que a alimentação foi cortada antes de o sistema conseguir registrar qualquer coisa — proteção térmica, fonte ou energia. Reinício com aviso indica que o sistema estava vivo e encontrou uma falha crítica, o que aponta para memória, driver ou armazenamento. São dois caminhos de investigação diferentes, e confundir os dois leva a troca de peça desnecessária.",
  },
  {
    question: "Trocar a fonte resolve?",
    answer:
      "Resolve quando a fonte é comprovadamente a causa, e nesse cenário o resultado é imediato. O erro comum é trocar a fonte por dedução: se o problema era térmico ou de memória, o desligamento volta em poucos dias e você pagou por uma peça que não era necessária. Testamos o comportamento sob carga antes de indicar substituição.",
  },
  {
    question: "Meu notebook desliga sozinho. É a bateria?",
    answer:
      "Pode ser, e há um teste que ajuda: se o equipamento se mantém estável ligado apenas na tomada e apaga quando depende da bateria, a suspeita é do conjunto de energia. Se apaga nas duas condições, a bateria deixa de ser a explicação principal e a investigação vai para temperatura, alimentação da placa e memória.",
  },
  {
    question: "Perco meus arquivos nesse tipo de reparo?",
    answer:
      "O procedimento padrão não envolve apagar dados. Ainda assim, desligamento abrupto repetido é uma das situações que mais castigam o armazenamento, então tratamos o disco como item sensível desde o recebimento. Quando a leitura de saúde indica risco, avisamos antes de qualquer intervenção para você decidir sobre cópia de segurança.",
  },
  {
    question: "Continuar usando assim causa dano maior?",
    answer:
      "Sim, e é um risco concreto. Cada corte abrupto interrompe escrita em andamento e aumenta a chance de corrupção do sistema e de setores defeituosos. Em falhas de alimentação, o uso insistente pode transformar um reparo pontual em dano espalhado pela placa. O mais barato quase sempre é diagnosticar cedo.",
  },
  {
    question: "Quanto tempo leva o diagnóstico?",
    answer:
      "Falha intermitente exige tempo de observação: o equipamento precisa ser mantido em teste sob carga até o comportamento se repetir. Isso normalmente acontece dentro de alguns dias úteis, e o prazo é informado no recebimento. Não fechamos prazo por descrição de sintoma.",
  },
  {
    question: "Preciso levar o computador em algum endereço?",
    answer:
      "Não atendemos em balcão. A triagem começa pelo WhatsApp, e o equipamento é retirado e devolvido no endereço combinado, nas condições publicadas na página de coleta e entrega. Casos que se resolvem sem bancada podem ser tratados na visita técnica.",
  },
  {
    question: "Qual a garantia do serviço?",
    answer:
      "90 dias sobre a mão de obra do serviço executado, limitada ao defeito efetivamente tratado. Peças seguem a garantia do fornecedor. A cobertura não se estende a outra falha que apareça em etapa distinta do equipamento nem a dano por nova oscilação elétrica.",
  },
];

const ComputadorDesligaSozinho = () => {
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
      name: "Computador desliga sozinho: temperatura, fonte, energia ou software",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-computador-desliga-sozinho-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Computador desliga sozinho" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Computador desliga sozinho: temperatura, fonte, energia ou software
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Um equipamento que apaga do nada quase sempre é tratado como "problema de superaquecimento", e essa
            conclusão apressada é responsável por boa parte das trocas de peça desnecessárias. Esta página mostra como
            o jeito de desligar já separa quatro grupos de causa, o que você consegue observar sem abrir nada e em que
            ponto insistir no uso passa a custar mais caro do que diagnosticar.
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
        caption="Computador de mesa aberto para verificação de dissipação e alimentação"
        secondaryCaption="Medição em bancada para confirmar a origem do desligamento antes de trocar peça"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "quatro-grupos", label: "Os quatro grupos de causa" },
            { id: "sintomas", label: "Como o equipamento apaga" },
            { id: "causas", label: "Causas possíveis" },
            { id: "opcoes", label: "O que resolve cada causa" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="quatro-grupos" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Os quatro grupos por trás de "desliga do nada"</h2>
          <p className="mb-3 text-muted-foreground">
            O primeiro grupo é térmico. A temperatura sobe além do limite tolerado e o próprio equipamento corta a
            alimentação para se proteger. Esse desligamento é seco, costuma acontecer em tempo previsível de uso e
            piora em tarefa pesada. É o cenário com a melhor relação entre custo e resultado, porque a intervenção é
            de manutenção e não de reparo eletrônico.
          </p>
          <p className="mb-3 text-muted-foreground">
            O segundo é de alimentação. A fonte entrega tensão instável ou não sustenta o pico de consumo, e o
            conjunto apaga exatamente quando a exigência aumenta. Em notebook, o mesmo papel cabe ao conjunto de
            carregador, conector e bateria — tema tratado em detalhe na página sobre{" "}
            <Link to="/problemas/notebook-nao-carrega-bateria" className="font-medium text-accent hover:underline">
              notebook que não carrega a bateria
            </Link>
            .
          </p>
          <p className="mb-3 text-muted-foreground">
            O terceiro é de sistema e componente lógico: memória instável, armazenamento no fim da vida, driver
            incompatível. Aqui o equipamento normalmente reinicia e registra o erro, o que deixa rastro para análise.
            Quando o quadro vem acompanhado de tela azul, o caminho está descrito em{" "}
            <Link to="/problemas/tela-azul-windows" className="font-medium text-accent hover:underline">
              tela azul no Windows
            </Link>
            .
          </p>
          <p className="text-muted-foreground">
            O quarto é externo ao equipamento: instalação elétrica com queda de tensão, tomada com mau contato,
            extensão sobrecarregada, ausência de aterramento. É o grupo mais ignorado e o único em que trocar peça
            nunca resolve — em Curitiba, aparece com frequência nos meses de tempestade.
          </p>
        </section>

        <section id="sintomas" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Como o equipamento apaga já orienta a investigação</h2>
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">Causas possíveis, sem afirmar diagnóstico</h2>
          <p className="mb-4 text-muted-foreground">
            As origens abaixo concentram a maior parte dos atendimentos com esse sintoma. Nenhuma é confirmada por
            descrição: elas definem por onde a medição começa e o que precisa ser reproduzido em teste.
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
            <Cpu className="h-6 w-6 text-accent" /> O que você pode observar antes do atendimento
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhuma dessas verificações exige abrir o equipamento, e duas delas — o tipo de desligamento e o tempo até
            a falha — encurtam bastante o diagnóstico.
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
            O que não recomendamos: insistir em ligar repetidamente depois de cheiro de queimado ou estalo, aplicar
            pasta térmica sem limpar o dissipador, e manter o equipamento em uso normal quando o desligamento já
            acontece várias vezes ao dia — cada corte abrupto castiga o armazenamento.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">O que resolve cada tipo de causa</h2>
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
            Valem para qualquer atendimento com esse sintoma, do primeiro contato até a devolução, e estão publicados
            na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Processo em etapas</h3>
              <p className="text-sm text-muted-foreground">
                Triagem pelo WhatsApp com o tipo de desligamento, teste sob carga até reproduzir a falha, medição em
                bancada e execução apenas depois da sua autorização expressa.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Falha intermitente</h3>
              <p className="text-sm text-muted-foreground">
                Sintoma que não aparece o tempo todo exige observação prolongada. O prazo é informado no recebimento e
                nunca é fechado por telefone antes de o comportamento se repetir em teste.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia declarada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre a mão de obra do serviço executado, restrita ao defeito tratado. Peças seguem a garantia
                do fornecedor. Nova oscilação elétrica e dano físico posterior não estão cobertos.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: eliminar sintoma intermitente sem conseguir reproduzi-lo em teste, garantir
            recuperação de dados de disco já castigado por cortes abruptos e fechar valor antes da medição.
          </p>
        </section>

        <ServicosCorrelatos
          itens={[
            {
              to: "/servicos/manutencao-de-computador",
              titulo: "Manutenção de computador",
              desc: "Limpeza técnica, revisão de dissipação e avaliação de fonte com medição antes e depois.",
            },
            {
              to: "/servicos/upgrade-ssd-ram",
              titulo: "Upgrade de SSD e RAM",
              desc: "Validação de memória módulo a módulo e leitura de saúde do armazenamento.",
            },
            {
              to: "/servicos/conserto-placa",
              titulo: "Conserto de placa eletrônica",
              desc: "Medição ponto a ponto quando a alimentação é interrompida dentro da placa.",
            },
            {
              to: "/quando-nao-compensa",
              titulo: "Quando não compensa reparar",
              desc: "O critério objetivo usado para recomendar substituição em vez de conserto.",
            },
          ]}
        />

        <section id="faq" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Perguntas frequentes</h2>
          <div className="space-y-5">
            {FAQS.map((f) => (
              <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{f.question}</h3>
                <p className="text-sm text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Descreva como o seu equipamento apaga</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe se o desligamento é seco ou com aviso de erro, quanto tempo de uso até acontecer e se depende de
            jogo, edição ou outra tarefa pesada.
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

export default ComputadorDesligaSozinho;
