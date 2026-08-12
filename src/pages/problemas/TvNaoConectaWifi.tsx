import { useEffect } from "react";
import { Link } from "react-router-dom";
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

const PATH = "/problemas/tv-nao-conecta-no-wifi";
const TITLE = "TV Não Conecta no Wi-Fi: O Que Fazer | Curitiba";
const DESCRIPTION =
  "Smart TV não conecta no Wi-Fi, some da lista de redes ou cai no meio do filme? Veja como separar cobertura do roteador, faixa de 5 GHz, sistema da TV e módulo sem fio em falha antes de trocar o aparelho, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre TV que não conecta no Wi-Fi. Minha smart TV não está entrando na rede e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "A TV não encontra nenhuma rede",
    desc: "Lista vazia com outros aparelhos conectados normalmente aponta para o módulo sem fio da televisão, não para o roteador.",
  },
  {
    titulo: "Encontra a rede mas dá senha incorreta",
    desc: "Comum quando a senha tem caracteres especiais ou quando a rede mudou de padrão de segurança no roteador.",
  },
  {
    titulo: "Conecta e cai depois de alguns minutos",
    desc: "Sinal no limite, canal congestionado ou economia de energia da TV desligando o rádio em pausa.",
  },
  {
    titulo: "Só enxerga a rede de 2,4 GHz",
    desc: "Muitos modelos não suportam 5 GHz. Isso não é defeito, é limitação de hardware da televisão.",
  },
  {
    titulo: "Conecta mas os aplicativos não abrem",
    desc: "A rede está ok e o problema é de data, hora ou DNS da TV. Costuma se resolver sem visita técnica.",
  },
  {
    titulo: "Parou depois de uma atualização do sistema",
    desc: "Atualização interrompida deixa o perfil de rede inconsistente. Reset de rede resolve boa parte desses casos.",
  },
];

const CAUSAS = [
  "Distância e paredes entre roteador e televisão, com sinal chegando no limite",
  "Rede de 5 GHz não suportada pelo modelo da TV",
  "Canal do Wi-Fi congestionado em prédio com muitas redes vizinhas",
  "Senha alterada no roteador sem atualização no perfil salvo da televisão",
  "Data e hora erradas na TV, bloqueando a validação dos aplicativos",
  "Economia de energia da televisão desligando o módulo sem fio",
  "Atualização de sistema interrompida, deixando o perfil de rede inconsistente",
  "Módulo Wi-Fi da TV em falha após oscilação de energia ou descarga elétrica",
];

const VERIFICACOES = [
  "Confira se outros aparelhos conectam na mesma rede e no mesmo cômodo: isso separa TV de roteador em um minuto.",
  "Reinicie o roteador tirando da tomada por trinta segundos e ligue novamente antes de mexer na televisão.",
  "Na TV, esqueça a rede salva e conecte de novo digitando a senha com atenção a maiúsculas.",
  "Se o roteador tem duas faixas, teste a rede de 2,4 GHz: muitos modelos simplesmente não enxergam 5 GHz.",
  "Verifique data e hora da televisão. Valores errados bloqueiam a abertura dos aplicativos mesmo com rede ativa.",
  "Faça o teste do cabo de rede quando houver entrada: funcionando por cabo, o defeito está no módulo sem fio.",
  "Use a opção de reset de rede da TV antes de qualquer restauração de fábrica.",
  "Não faça restauração de fábrica com atualização pela metade: isso pode deixar o aparelho sem sistema.",
];

const OPCOES = [
  {
    titulo: "Cobertura e configuração da rede",
    desc: "Quando o sinal chega fraco no cômodo da TV, o trabalho é sobre posicionamento, canal e reforço de cobertura, não sobre o aparelho.",
    to: "/servicos/redes-e-wifi",
    label: "Redes e Wi-Fi",
  },
  {
    titulo: "Reparo do módulo sem fio da TV",
    desc: "Televisão que funciona por cabo e não enxerga rede alguma precisa de avaliação de bancada do módulo e da placa principal.",
    to: "/servicos/conserto-tv",
    label: "Conserto de TV",
  },
  {
    titulo: "Ajustes de sistema e aplicativos",
    desc: "Data, hora, DNS e perfil de rede inconsistente são correções de configuração, resolvidas sem retirar o aparelho do lugar.",
    to: "/atendimento-remoto",
    label: "Atendimento remoto",
  },
  {
    titulo: "Quando a TV está lenta, e não offline",
    desc: "Aplicativo travando com rede conectada tem outro roteiro de investigação e outras causas prováveis.",
    to: "/problemas/tv-travando",
    label: "TV travando",
  },
];

const FAQS = [
  {
    question: "Minha TV não acha a rede, mas o celular conecta no mesmo lugar. É defeito da televisão?",
    answer:
      "É a hipótese mais provável, com uma ressalva importante: celulares enxergam 5 GHz e muitas televisões não. Antes de concluir que o módulo está em falha, confirme se a sua rede é de 2,4 GHz ou se o roteador está com as duas faixas no mesmo nome. Se a TV não enxerga nem a rede de 2,4 GHz, aí sim a suspeita vai para o módulo sem fio.",
  },
  {
    question: "A TV conecta e cai sozinha no meio do filme. O que costuma ser?",
    answer:
      "Sinal chegando no limite é a causa mais comum, e o padrão típico é cair sempre nos mesmos horários, quando a vizinhança satura o canal. Economia de energia da própria televisão também derruba o rádio em pausas longas. Testar com o roteador mais próximo, mesmo que provisoriamente, confirma o cenário sem gastar nada.",
  },
  {
    question: "Aparece senha incorreta mesmo eu digitando certo. Por quê?",
    answer:
      "Na maioria das vezes o perfil salvo na televisão está desatualizado depois de uma troca de senha ou de padrão de segurança no roteador. Esquecer a rede na TV e conectar de novo resolve. Vale também revisar caracteres especiais: alguns teclados de controle remoto trocam símbolos parecidos sem aviso.",
  },
  {
    question: "A TV conecta mas os aplicativos não abrem. É problema de internet?",
    answer:
      "Normalmente não. Quando o aparelho conecta e os apps ficam carregando ou dão erro de servidor, os suspeitos são data e hora erradas e DNS travado. São ajustes de configuração e costumam ser resolvidos por orientação remota, sem visita e sem retirar o aparelho.",
  },
  {
    question: "Vale a pena usar um adaptador ou aparelho externo em vez de consertar?",
    answer:
      "Em televisões antigas, sim, e falamos isso abertamente: um dispositivo externo de streaming custa menos que a troca de placa e ainda moderniza os aplicativos. Em televisões recentes, avaliar o módulo faz mais sentido. Damos essa leitura antes de qualquer coleta, para você escolher com o custo na mão.",
  },
  {
    question: "Restauração de fábrica resolve ou piora?",
    answer:
      "Resolve alguns casos de perfil de rede inconsistente, mas não é o primeiro passo. Tente antes a opção de reset apenas de rede. E nunca faça restauração com uma atualização de sistema pela metade: essa combinação é uma das formas mais rápidas de deixar a televisão sem sistema e transformar um ajuste simples em serviço de bancada.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Fazemos retirada e devolução no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Problemas de cobertura e configuração de rede costumam ser tratados sem retirar a televisão.",
  },
];

const TvNaoConectaWifi = () => {
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
      name: "TV não conecta no Wi-Fi: cobertura, faixa, sistema ou módulo",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-tv-nao-conecta-no-wifi-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas" }, { label: "TV não conecta no Wi-Fi" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            TV não conecta no Wi-Fi: cobertura, faixa, sistema ou módulo
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Antes de aposentar a televisão, três testes gratuitos separam problema de rede de falha do aparelho.
            Esta página mostra a ordem que usamos nos atendimentos.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="problema_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar com um técnico
            </a>
          </Button>
        </div>
      </section>

      <TrustStrip />

      <RealImageSection
        imageKey="smartTv"
        secondaryImageKey="redesWifi"
        layout="duo"
        caption="Teste de conexão da smart TV no cômodo onde o aparelho fica instalado"
        secondaryCaption="Avaliação de cobertura e canal do roteador antes de suspeitar do módulo da televisão"
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">A ordem certa de investigar uma TV sem conexão</h2>
          <p className="mb-3 text-muted-foreground">
            A primeira pergunta é se outros aparelhos conectam bem no mesmo cômodo. Se conectam, o roteador está
            entregando sinal ali e a investigação passa para a televisão. Se todos sofrem, o assunto é cobertura.
          </p>
          <p className="mb-3 text-muted-foreground">
            A segunda pergunta é se a TV enxerga a rede na lista. Rede visível com falha de senha é perfil salvo
            desatualizado. Lista vazia com vizinhos aparecendo aponta para faixa incompatível ou módulo em falha.
          </p>
          <p className="text-muted-foreground">
            Se o sinal cai em toda a casa, comece por{" "}
            <Link to="/problemas/wifi-caindo-toda-hora" className="font-medium text-accent hover:underline">
              Wi-Fi caindo toda hora
            </Link>
            . Para reforço de cobertura, veja{" "}
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
            Cobertura insuficiente no cômodo da televisão e incompatibilidade com a faixa de 5 GHz explicam a maior
            parte dos chamados. Falha real do módulo sem fio é minoria, e tem um teste que a confirma.
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
            <Wifi className="h-6 w-6 text-accent" /> Verificações seguras antes de trocar o aparelho
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhum passo abaixo abre a televisão nem apaga aplicativos instalados. Siga na ordem e pare assim que
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
            O que não recomendamos: restaurar a televisão de fábrica como primeira tentativa, instalar arquivos de
            atualização baixados de sites não oficiais e trocar o roteador antes de medir a cobertura no cômodo.
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
              <h3 className="mb-2 font-semibold text-foreground">Testes gratuitos primeiro</h3>
              <p className="text-sm text-muted-foreground">
                Orientamos reset de rede, teste de faixa e cabo antes de qualquer coleta. Resolvendo assim, você
                não gasta com serviço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Custo comparado antes da coleta</h3>
              <p className="text-sm text-muted-foreground">
                Quando um dispositivo externo custa menos que o reparo da placa, dizemos isso com clareza em vez de
                empurrar bancada.
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
            O que não prometemos: suporte a 5 GHz em televisão que não tem esse hardware, velocidade contratada
            além do que o provedor entrega e prazo fixo antes da avaliação.
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

        <ProximosProblemas path="/problemas/tv-nao-conecta-no-wifi" />

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Conte o que já foi testado</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Se outros aparelhos conectam no mesmo cômodo, se a TV enxerga a rede na lista e se ela funciona por
            cabo, isso encurta bastante o diagnóstico.
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

export default TvNaoConectaWifi;
