import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, MessageCircle, Wifi } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ServicosCorrelatos } from "@/components/informatica/ServicosCorrelatos";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import ProximosProblemas from "@/components/problemas/ProximosProblemas";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const PATH = "/problemas/wifi-caindo-toda-hora";
const TITLE = "Wi-Fi Caindo Toda Hora? Diagnóstico de Rede em Curitiba";
const DESCRIPTION =
  "Wi-Fi que cai toda hora, sinal que some em um cômodo ou internet lenta só à noite: entenda a diferença entre falha do provedor, do roteador e da cobertura, o que testar antes e como é feito o diagnóstico de rede em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre Wi-Fi caindo toda hora. Minha rede está instável e preciso de diagnóstico.";

const SINTOMAS = [
  {
    titulo: "Cai em todos os aparelhos ao mesmo tempo",
    desc: "Queda simultânea em celular, televisor e computador tira o problema do dispositivo e coloca a suspeita no roteador ou no link do provedor. É a primeira separação que a triagem faz.",
  },
  {
    titulo: "Só um cômodo perde o sinal",
    desc: "Quando o restante da casa segue conectado, não há queda de link: há falta de cobertura. Parede de concreto, laje e caixa de medição no caminho explicam boa parte desses casos.",
  },
  {
    titulo: "Conecta, mas fica sem internet",
    desc: "O aparelho mostra sinal cheio e nada carrega. Isso normalmente aponta para atribuição de endereço, resolução de nomes ou para o link do provedor, não para alcance do rádio.",
  },
  {
    titulo: "Piora à noite e nos fins de semana",
    desc: "Horário de pico traz dois fatores juntos: mais dispositivos na sua casa e mais interferência das redes vizinhas nos mesmos canais. Medir o ambiente separa uma coisa da outra.",
  },
  {
    titulo: "Chamada de vídeo trava mesmo com sinal cheio",
    desc: "Barrinha cheia indica intensidade, não qualidade. Canal congestionado e repetidor mal posicionado produzem exatamente esse quadro em home office.",
  },
  {
    titulo: "Cai sempre que alguém liga um aparelho pesado",
    desc: "Quando a queda acompanha micro-ondas, chuveiro ou ar-condicionado, a investigação passa a incluir interferência na faixa de 2,4 GHz e a estabilidade da rede elétrica.",
  },
];

const CAUSAS = [
  "Roteador posicionado dentro de armário, atrás do televisor ou no canto do imóvel",
  "Canal de rádio congestionado por sobreposição com redes vizinhas",
  "Equipamento fornecido pelo provedor operando no limite de dispositivos conectados",
  "Repetidor de sinal instalado longe demais do roteador, replicando um sinal já fraco",
  "Cabeamento interno ou conector de rede com mau contato",
  "Firmware do roteador desatualizado gerando reinícios periódicos",
  "Instabilidade real no link do provedor, visível também no cabo",
  "Rede única para casa e trabalho, com concorrência entre streaming e reunião",
  "Fonte de alimentação do roteador degradada, causando reinício silencioso",
];

const VERIFICACOES = [
  "Verificar se a queda atinge todos os aparelhos ao mesmo tempo ou apenas um deles.",
  "Testar um computador ligado por cabo ao roteador: se o cabo também cai, o problema não é Wi-Fi.",
  "Anotar horários das quedas por dois ou três dias — padrão de horário é uma pista forte.",
  "Observar se o roteador reinicia sozinho, com as luzes apagando e voltando.",
  "Testar a mesma tarefa perto do roteador e no cômodo problemático, comparando o resultado.",
  "Conferir se o aparelho está em armário fechado, atrás de televisor ou junto de caixa metálica.",
  "Registrar quantos dispositivos ficam conectados simultaneamente na casa ou no escritório.",
];

const OPCOES = [
  {
    titulo: "Reposicionamento e ajuste do roteador",
    desc: "Primeira intervenção quando a cobertura é o problema: mudar o ponto de instalação, separar as faixas de rádio, escolher canal com menos concorrência e revisar as configurações que o padrão de fábrica deixa mal ajustadas.",
    to: "/servicos/redes-e-wifi",
    label: "Redes e Wi-Fi",
  },
  {
    titulo: "Rede com pontos adicionais interligados",
    desc: "Indicado em imóvel com laje, dois pavimentos ou edícula. A cobertura passa a vir de nós distribuídos e, sempre que possível, interligados por cabo — evitando o efeito de repetir um sinal que já chega fraco.",
    to: "/servicos/redes-e-wifi",
    label: "Cobertura por nós",
  },
  {
    titulo: "Cabeamento estruturado para pontos fixos",
    desc: "Televisor, console, computador de trabalho e câmeras ganham estabilidade fora do rádio. Também libera a faixa sem fio para os aparelhos que realmente dependem dela.",
    to: "/servicos/redes-e-wifi",
    label: "Cabeamento de rede",
  },
  {
    titulo: "Separação de rede de casa e de trabalho",
    desc: "Para quem trabalha em casa ou tem pequeno negócio no imóvel, separar as redes reduz concorrência de banda e isola o ambiente de trabalho do uso doméstico, com ganho direto em chamada de vídeo.",
    to: "/servicos/suporte-tecnico-empresarial",
    label: "Suporte técnico empresarial",
  },
];

const FAQS = [
  {
    question: "Wi-Fi caindo é sempre culpa do provedor?",
    answer:
      "Não, e existe um teste simples que separa as duas hipóteses: conecte um computador por cabo direto ao roteador e use a internet nessa condição. Se o cabo também cai, a instabilidade está no link ou no equipamento do provedor, e o caminho é abrir chamado com ele. Se o cabo se mantém estável e apenas o sem fio cai, o problema está na rede interna — cobertura, canal, posicionamento ou capacidade do roteador.",
  },
  {
    question: "Repetidor de sinal resolve?",
    answer:
      "Resolve em situações específicas e piora em outras. Repetidor replica o sinal que recebe: se for instalado onde a recepção já é ruim, ele espalha um sinal ruim e ainda reduz a velocidade disponível. Funciona quando o ponto de instalação tem boa recepção e a área a cobrir é pequena. Para casa com laje ou dois pavimentos, o resultado consistente vem de nós interligados por cabo.",
  },
  {
    question: "Por que o sinal aparece cheio e mesmo assim trava?",
    answer:
      "Porque a barra de sinal mede intensidade, não qualidade. É possível receber um sinal forte em um canal disputado por várias redes vizinhas: o aparelho enxerga o roteador, mas passa boa parte do tempo esperando a vez de transmitir. Nesse cenário, mudar de canal ou migrar dispositivos para a faixa de 5 GHz muda mais o resultado do que trocar o roteador.",
  },
  {
    question: "Trocar o roteador da operadora por um melhor adianta?",
    answer:
      "Adianta quando o equipamento é o gargalo real, o que acontece com frequência em imóvel com muitos dispositivos conectados. Mas trocar por dedução é caro e às vezes inútil: se a causa é posicionamento, cobertura ou canal congestionado, o aparelho novo repete o mesmo comportamento. Avaliamos o ambiente antes de indicar compra.",
  },
  {
    question: "Vocês atendem rede em apartamento?",
    answer:
      "Sim, e é um cenário com característica própria: em prédio, a quantidade de redes vizinhas na mesma faixa é o fator dominante, muito mais do que a área a cobrir. O trabalho costuma envolver escolha de canal, separação das faixas de rádio e cabeamento discreto para os pontos fixos, respeitando as regras do condomínio.",
  },
  {
    question: "Preciso comprar equipamento antes do atendimento?",
    answer:
      "Não, e recomendamos que não compre. A definição do que é necessário sai da avaliação do imóvel e do uso real. Comprar antes leva a equipamento incompatível com o cenário ou superdimensionado para a necessidade. Quando há indicação de compra, ela vem com a justificativa técnica do que aquele item resolve.",
  },
  {
    question: "Esse serviço é feito na minha casa ou por coleta?",
    answer:
      "Rede é um dos poucos serviços que só faz sentido no local: cobertura depende do imóvel, das paredes e da posição dos aparelhos. A visita técnica avalia o ambiente e apresenta as opções. Não atendemos em balcão — o contato começa pelo WhatsApp e o atendimento acontece no endereço.",
  },
  {
    question: "Qual a garantia do serviço de rede?",
    answer:
      "90 dias sobre a mão de obra da configuração e da instalação executadas. Equipamentos seguem a garantia do fabricante. A garantia não cobre instabilidade do link do provedor, mudança de layout do imóvel depois do serviço nem alteração de configuração feita por terceiros.",
  },
];

const WifiCaindoTodaHora = () => {
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
      name: "Wi-Fi caindo toda hora: provedor, roteador ou cobertura",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-wifi-caindo-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Wi-Fi caindo toda hora" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Wi-Fi caindo toda hora: provedor, roteador ou cobertura
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            "A internet cai toda hora" descreve pelo menos três problemas diferentes, e o mais comum deles não é
            defeito do provedor nem do roteador: é cobertura mal distribuída dentro do imóvel. Esta página mostra como
            um teste com cabo separa as hipóteses em minutos, por que repetidor às vezes piora o quadro e o que
            realmente muda o resultado em casa com laje, dois pavimentos ou muitas redes vizinhas.
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
        imageKey="redesWifi"
        secondaryImageKey="servidores"
        layout="duo"
        caption="Roteador e cabeamento de rede em avaliação de cobertura no imóvel"
        secondaryCaption="Equipamentos de rede usados em atendimento residencial e de pequenos escritórios"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "tres-cenarios", label: "Os três cenários" },
            { id: "sintomas", label: "Sintomas que separam as causas" },
            { id: "causas", label: "Causas possíveis" },
            { id: "opcoes", label: "O que resolve cada causa" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="tres-cenarios" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Os três cenários por trás de "o Wi-Fi cai"</h2>
          <p className="mb-3 text-muted-foreground">
            O primeiro é queda de link. A conexão do provedor oscila e todos os aparelhos perdem acesso ao mesmo
            tempo, inclusive os ligados por cabo. Nenhum ajuste de rede interna corrige isso — o caminho é registrar
            os horários das quedas e abrir chamado com a operadora com essa evidência em mãos.
          </p>
          <p className="mb-3 text-muted-foreground">
            O segundo é limitação do equipamento. O roteador entregue na instalação atende bem uma casa com poucos
            dispositivos, e passa a falhar quando o número de aparelhos conectados cresce: televisores, celulares,
            câmeras, console e computadores disputando a mesma capacidade. O sintoma típico é a rede que "trava"
            justamente no horário de maior uso.
          </p>
          <p className="text-muted-foreground">
            O terceiro, e mais frequente nos atendimentos, é cobertura. O link está estável e o roteador dá conta, mas
            o sinal não chega com qualidade ao cômodo onde você precisa dele. Esse é o cenário que a página de{" "}
            <Link to="/servicos/redes-e-wifi" className="font-medium text-accent hover:underline">
              redes e Wi-Fi
            </Link>{" "}
            trata em detalhe, e o único em que a solução depende do formato do imóvel.
          </p>
        </section>

        <section id="sintomas" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Sintomas que ajudam a separar as causas</h2>
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
            As origens abaixo respondem pela maior parte dos atendimentos de rede instável. Nenhuma é confirmada por
            descrição: elas orientam o que medir no imóvel antes de propor qualquer mudança.
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
            <Wifi className="h-6 w-6 text-accent" /> O que você pode testar antes do atendimento
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhuma dessas verificações exige conhecimento técnico, e o teste com cabo sozinho já elimina metade das
            hipóteses.
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
            O que não recomendamos: reiniciar o roteador várias vezes ao dia como rotina, restaurar o equipamento para
            padrão de fábrica sem anotar as configurações do provedor e empilhar repetidores comprados por indicação
            genérica — cada camada de repetição reduz a velocidade disponível.
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
            Valem para qualquer atendimento de rede, da primeira conversa à entrega do ambiente configurado, e estão
            publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Avaliação no local</h3>
              <p className="text-sm text-muted-foreground">
                Cobertura depende do imóvel. A visita mede o comportamento nos cômodos que importam e apresenta as
                opções antes de qualquer instalação ou indicação de compra.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Sem venda casada</h3>
              <p className="text-sm text-muted-foreground">
                Equipamento só é indicado quando a avaliação mostra que ele resolve algo. Quando reposicionar e
                ajustar resolve, é isso que recomendamos — mesmo sendo o serviço mais barato.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia declarada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre a mão de obra da configuração e da instalação. Equipamentos seguem a garantia do
                fabricante. Instabilidade do link do provedor não está coberta.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: corrigir oscilação do provedor, garantir velocidade contratada em ponto distante sem
            infraestrutura adequada e cobrir alteração de configuração feita depois por terceiros.
          </p>
        </section>

        <ServicosCorrelatos
          itens={[
            {
              to: "/servicos/redes-e-wifi",
              titulo: "Redes e Wi-Fi",
              desc: "Avaliação de cobertura, ajuste de canal, nós interligados e cabeamento estruturado.",
            },
            {
              to: "/servicos/suporte-tecnico-empresarial",
              titulo: "Suporte técnico empresarial",
              desc: "Separação entre rede doméstica e de trabalho, com prioridade para reunião e sistema.",
            },
            {
              to: "/servicos/suporte-home-office",
              titulo: "Suporte para home office",
              desc: "Rede estável para reunião e sistema de trabalho, com prioridade para quem trabalha de casa.",
            },
            {
              to: "/como-funciona",
              titulo: "Como funciona o atendimento",
              desc: "Da triagem pelo WhatsApp até a visita técnica, com as etapas descritas antes de começar.",
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

        <ProximosProblemas path="/problemas/wifi-caindo-toda-hora" />

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Descreva como a sua rede está caindo</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Conte se a queda atinge todos os aparelhos, se acontece em horário específico, quantos dispositivos ficam
            conectados e como é o imóvel — apartamento, casa térrea, sobrado ou com edícula.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WifiCaindoTodaHora;
