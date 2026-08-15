import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, Wifi, MessageCircle } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import ProximosProblemas from "@/components/problemas/ProximosProblemas";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const PATH = "/problemas/notebook-nao-conecta-no-wifi";
const TITLE = "Notebook Não Conecta no Wi-Fi: Como Resolver | Curitiba";
const DESCRIPTION =
  "Notebook não conecta no Wi-Fi, não encontra a rede ou conecta sem internet? Veja como separar driver, placa de rede desativada, antena solta e falha do roteador antes de trocar peça, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre notebook que não conecta no Wi-Fi. Meu notebook não está conectando e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Nenhuma rede aparece na lista",
    desc: "Lista vazia com outros aparelhos conectados aponta para placa de rede desativada, driver ausente ou adaptador não reconhecido.",
  },
  {
    titulo: "Encontra a rede mas não conecta",
    desc: "Erro ao conectar em rede que aparece normalmente costuma ser perfil salvo corrompido ou incompatibilidade de banda e segurança.",
  },
  {
    titulo: "Conecta, mas fica sem internet",
    desc: "Conexão estabelecida sem navegação indica DNS, endereço IP em conflito ou o próprio link do provedor fora do ar.",
  },
  {
    titulo: "Só conecta perto do roteador",
    desc: "Alcance muito curto é o sintoma clássico de antena interna desconectada, comum depois de manutenção ou troca de tela.",
  },
  {
    titulo: "Cai sozinho depois de alguns minutos",
    desc: "Queda periódica aparece em economia de energia do adaptador, driver instável ou interferência em canal congestionado.",
  },
  {
    titulo: "Funciona por cabo, mas não por Wi-Fi",
    desc: "Esse contraste isola o problema no adaptador sem fio e descarta placa-mãe e sistema como origem principal.",
  },
];

const CAUSAS = [
  "Adaptador Wi-Fi desativado por atalho de teclado ou pelo modo avião do sistema",
  "Driver de rede removido ou substituído por versão genérica em atualização do Windows",
  "Perfil de rede salvo com senha antiga após troca do roteador",
  "Antena interna desconectada da placa Wi-Fi depois de manutenção anterior",
  "Placa Wi-Fi mal encaixada no slot M.2 ou mini PCIe",
  "Economia de energia desligando o adaptador para poupar bateria",
  "Rede em 5 GHz com o notebook suportando apenas 2,4 GHz",
  "Roteador com canal congestionado ou firmware travado, afetando todos os aparelhos",
];

const VERIFICACOES = [
  "Confira se outro aparelho conecta na mesma rede: se todos falham, o problema está no roteador ou no provedor.",
  "Verifique o modo avião e o atalho de rede sem fio do teclado, geralmente na fileira de teclas de função.",
  "Esqueça a rede salva e conecte novamente digitando a senha, principalmente após troca de roteador.",
  "Reinicie o roteador tirando da tomada por trinta segundos antes de concluir qualquer coisa sobre o notebook.",
  "Teste conectar no roteamento do celular: se conecta ali, o adaptador do notebook está funcional.",
  "Veja no gerenciador de dispositivos se o adaptador sem fio aparece listado e sem alerta.",
  "Observe o alcance: se só funciona a um metro do roteador, informe isso, porque aponta para antena.",
  "Não instale programas que prometem 'turbinar' o sinal: eles trocam o driver correto e atrapalham o diagnóstico.",
];

const OPCOES = [
  {
    titulo: "Correção de driver e configuração de rede",
    desc: "Quando o adaptador responde e o problema é perfil, driver ou economia de energia, o ajuste é feito sem retirar o equipamento na maior parte dos casos.",
    to: "/atendimento-remoto",
    label: "Atendimento remoto",
  },
  {
    titulo: "Reparo do adaptador e da antena",
    desc: "Antena desconectada, placa Wi-Fi mal encaixada ou módulo em falha são serviços de bancada, com teste de alcance após o reparo.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Rede e roteador",
    desc: "Se o sinal falha em todos os aparelhos da casa ou do escritório, o trabalho é sobre a rede: posicionamento, canal e cobertura.",
    to: "/servicos/redes-e-wifi",
    label: "Redes e Wi-Fi",
  },
  {
    titulo: "Quando a queda atinge tudo",
    desc: "Se o Wi-Fi cai o tempo todo em vários dispositivos, o roteiro de verificação começa pela rede, não pelo notebook.",
    to: "/problemas/wifi-caindo-toda-hora",
    label: "Wi-Fi caindo toda hora",
  },
];

const FAQS = [
  {
    question: "Meu notebook não encontra nenhuma rede Wi-Fi. O que pode ser?",
    answer:
      "Lista completamente vazia, com outros aparelhos conectando normalmente, aponta para três frentes: adaptador desativado por atalho ou modo avião, driver ausente após atualização, ou placa sem fio não reconhecida pelo sistema. As duas primeiras se resolvem por configuração e a terceira exige avaliação física.",
  },
  {
    question: "Só conecto quando estou muito perto do roteador. Isso tem conserto?",
    answer:
      "Tem, e o cenário mais comum é antena interna desconectada. Isso acontece com frequência depois de uma manutenção anterior, porque os cabos de antena passam pela dobradiça e são fáceis de esquecer na remontagem. Recolocada a antena, o alcance volta ao normal.",
  },
  {
    question: "Conecta no Wi-Fi mas não abre nenhum site. Por quê?",
    answer:
      "Conexão sem navegação separa dois mundos: o notebook falou com o roteador, mas algo entre o roteador e a internet não está resolvendo. Costuma ser DNS, conflito de endereço IP ou o próprio link do provedor. Testar outro aparelho na mesma rede resolve a dúvida rapidamente.",
  },
  {
    question: "Vale trocar a placa Wi-Fi ou usar um adaptador USB?",
    answer:
      "Depende do diagnóstico. Quando o módulo interno realmente falhou, o adaptador USB é uma alternativa econômica e dizemos isso quando é o caso. Quando o problema é antena ou encaixe, trocar a placa não resolve nada e o custo seria desperdiçado.",
  },
  {
    question: "O Wi-Fi cai sozinho depois de alguns minutos. É defeito?",
    answer:
      "Nem sempre. A economia de energia do adaptador desliga o rádio para poupar bateria e derruba a conexão em uso leve. Desativar essa opção resolve boa parte dos casos. Se a queda persistir com a economia desligada, entra driver instável ou interferência de canal.",
  },
  {
    question: "Dá para resolver sem levar o notebook?",
    answer:
      "Na maioria dos casos de driver, perfil de rede e configuração, sim, e é o que indicamos por ser mais rápido. Quando o sintoma é alcance curto ou o adaptador nem aparece no sistema, a avaliação precisa ser física e o equipamento é retirado no endereço informado.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado.",
  },
];

const NotebookNaoConectaWifi = () => {
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
      name: "Notebook não conecta no Wi-Fi: driver, adaptador, antena ou roteador",
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
    trackCTAClick("whatsapp", `problema-notebook-nao-conecta-no-wifi-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Notebook não conecta no Wi-Fi" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Notebook não conecta no Wi-Fi: driver, adaptador, antena ou roteador
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:text-lg">
            Antes de trocar placa ou comprar adaptador, vale descobrir se a falha está no notebook ou na rede. São
            testes rápidos e a diferença muda completamente o custo do reparo.
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
        secondaryImageKey="notebookReparo"
        layout="duo"
        caption="Teste de cobertura e canal da rede antes de qualquer intervenção no equipamento"
        secondaryCaption="Revisão do módulo sem fio e dos cabos de antena internos do notebook"
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">A ordem certa de investigar conexão sem fio</h2>
          <p className="mb-3 text-muted-foreground">
            A primeira pergunta não é sobre o notebook, e sim sobre a rede: outros aparelhos estão conectando? Se
            todos falham, o trabalho é sobre roteador, cabeamento ou provedor, e mexer no notebook não muda nada.
          </p>
          <p className="mb-3 text-muted-foreground">
            Confirmado que só o notebook falha, a segunda pergunta é se o adaptador aparece no sistema. Adaptador
            visível empurra a suspeita para perfil de rede, driver e economia de energia. Adaptador ausente indica
            módulo desativado, driver removido ou placa sem contato.
          </p>
          <p className="text-muted-foreground">
            Se além da conexão o equipamento está lento, vale conferir{" "}
            <Link to="/problemas/notebook-lento" className="font-medium text-accent hover:underline">
              notebook lento
            </Link>
            . Para cobertura de sinal em casa ou no escritório, veja{" "}
            <Link to="/servicos/redes-e-wifi" className="font-medium text-accent hover:underline">
              redes e Wi-Fi
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
            Driver substituído em atualização e perfil de rede com senha antiga somam a maior parte dos atendimentos.
            Antena desconectada aparece quase sempre em notebooks que já passaram por manutenção.
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
            <Wifi className="h-6 w-6 text-accent" /> Verificações seguras antes de trocar qualquer peça
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhum passo abaixo exige abrir o notebook nem instalar programa. Siga na ordem e pare assim que
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
            O que não recomendamos: instalar otimizadores de sinal, resetar o roteador sem ter a senha do provedor em
            mãos e abrir o notebook para "reencaixar" a placa sem experiência.
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
              <h3 className="mb-2 font-semibold text-foreground">Rede antes de equipamento</h3>
              <p className="text-sm text-muted-foreground">
                Se a falha atinge todos os aparelhos, mexer no notebook não resolve. A investigação começa pela rede e
                isso evita coleta desnecessária.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Remoto quando cabe</h3>
              <p className="text-sm text-muted-foreground">
                Driver, perfil salvo e economia de energia se resolvem sem retirar o equipamento. Quando o remoto
                resolve, é o que indicamos.
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
            O que não prometemos: velocidade de internet contratada, cobertura em toda a residência com o roteador
            atual e garantia sobre roteadores e repetidores que não fornecemos.
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

        <ProximosProblemas path="/problemas/notebook-nao-conecta-no-wifi" />

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Conte como o Wi-Fi falha no seu notebook</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Se nenhuma rede aparece, se conecta sem internet ou se só funciona perto do roteador, isso muda a suspeita
            e encurta o diagnóstico.
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

export default NotebookNaoConectaWifi;
