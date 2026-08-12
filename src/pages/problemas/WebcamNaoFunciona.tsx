import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Video, MessageCircle } from "lucide-react";
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

const PATH = "/problemas/webcam-nao-funciona";
const TITLE = "Webcam Não Funciona: Causas e Solução | Curitiba";
const DESCRIPTION =
  "Webcam do notebook sem imagem, tela preta na reunião ou câmera não encontrada pelo sistema? Veja como separar permissão do sistema, driver, cabo flat e falha do módulo antes de comprar câmera externa, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre webcam não funciona. Minha câmera não está sendo reconhecida e preciso de avaliação técnica.";

const SINTOMAS = [
  {
    titulo: "A imagem fica preta em todos os programas",
    desc: "Quando nenhum aplicativo enxerga a câmera, a suspeita sai do programa e vai para permissão do sistema, driver ou módulo.",
  },
  {
    titulo: "Funciona em um aplicativo e falha em outro",
    desc: "Comportamento típico de permissão por aplicativo ou de outro programa segurando a câmera aberta em segundo plano.",
  },
  {
    titulo: "O sistema diz que nenhuma câmera foi encontrada",
    desc: "O dispositivo sumiu da lista de hardware. Isso acontece por driver removido em atualização ou por cabo flat sem contato.",
  },
  {
    titulo: "A imagem aparece esverdeada, tremida ou muito escura",
    desc: "O módulo responde, mas o sensor ou o conector está com falha parcial. É avaliação de bancada, não configuração.",
  },
  {
    titulo: "A câmera some ao abrir e fechar a tampa",
    desc: "Sinal clássico de cabo flat prensado na dobradiça, comum em notebook que já teve a tampa forçada.",
  },
  {
    titulo: "Parou depois de uma atualização do sistema",
    desc: "Driver substituído por versão genérica. Costuma se resolver remotamente, sem retirar o equipamento.",
  },
];

const CAUSAS = [
  "Permissão de câmera desativada no sistema ou apenas para um aplicativo",
  "Obturador físico ou tampa deslizante fechada sobre a lente",
  "Driver removido ou trocado por versão genérica em atualização recente",
  "Outro programa mantendo a câmera aberta e bloqueando o acesso",
  "Cabo flat da câmera prensado ou rompido na região da dobradiça",
  "Módulo de câmera com sensor em falha após queda ou infiltração",
  "Porta USB sem contato, no caso de câmera externa",
  "Antivírus ou política de privacidade bloqueando o acesso à câmera",
];

const VERIFICACOES = [
  "Verifique se há obturador físico ou etiqueta cobrindo a lente: esse é o motivo mais frequente e não custa nada.",
  "Abra o aplicativo de câmera nativo do sistema. Se funcionar ali, o problema é permissão do programa, não hardware.",
  "Revise as permissões de câmera do sistema e do aplicativo que você usa nas reuniões.",
  "Feche todos os programas de vídeo abertos e teste um por vez: dois aplicativos disputando a câmera geram tela preta.",
  "Reinicie o computador uma vez antes de qualquer conclusão: serviço de captura travado volta com o reinício.",
  "Em notebook, observe se a câmera some ao mover a tampa. Se sim, informe isso — aponta para o cabo flat.",
  "Em câmera externa, teste em outra porta USB e, se possível, em outro computador.",
  "Não desmonte a moldura da tela por conta própria: o cabo flat da câmera rompe com muita facilidade.",
];

const OPCOES = [
  {
    titulo: "Ajuste de permissão e driver",
    desc: "Quando o hardware aparece na lista mas nenhum programa consegue usar, a correção é de sistema e se resolve sem retirar o equipamento.",
    to: "/atendimento-remoto",
    label: "Atendimento remoto",
  },
  {
    titulo: "Troca do módulo ou do cabo flat",
    desc: "Câmera que some ao mexer na tampa exige abertura da moldura, revisão do cabo e teste de imagem antes da devolução.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Revisão geral do notebook",
    desc: "Quando a câmera falha junto com teclado, som ou Wi-Fi, a avaliação completa evita trocar peça por peça sem critério.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Quando o problema é o som na chamada",
    desc: "Reunião sem áudio tem outro roteiro de verificação e outras causas prováveis, mesmo quando a imagem está boa.",
    to: "/problemas/computador-sem-som",
    label: "Computador sem som",
  },
];

const FAQS = [
  {
    question: "Minha webcam parou depois de uma atualização. É defeito de hardware?",
    answer:
      "Quase nunca. Atualização que troca o driver por uma versão genérica é a causa mais comum desse cenário, e o sintoma característico é a câmera aparecer na lista de dispositivos com aviso de erro. A correção é de sistema e costuma ser feita por acesso remoto, sem retirar o equipamento do lugar.",
  },
  {
    question: "A imagem fica preta só na reunião, mas o aplicativo de câmera funciona. O que é?",
    answer:
      "Se o aplicativo nativo mostra a imagem, o hardware está bom. Nesse caso, o bloqueio está na permissão daquele programa específico ou em outro software segurando a câmera aberta em segundo plano. Fechar todos os programas de vídeo e testar um por vez identifica o responsável em poucos minutos.",
  },
  {
    question: "A câmera do notebook some quando eu mexo na tampa. Tem conserto?",
    answer:
      "Tem, e é um reparo de bancada. Esse comportamento indica cabo flat prensado ou com trilha rompida na passagem pela dobradiça. O serviço envolve abrir a moldura da tela com cuidado, avaliar o cabo e o módulo e testar a imagem antes da devolução. Não recomendamos abrir por conta própria porque o flat rasga com pouquíssima força.",
  },
  {
    question: "Vale mais a pena comprar uma webcam externa?",
    answer:
      "Depende do uso. Se você precisa de imagem hoje para trabalhar, uma câmera externa resolve de imediato e é uma solução legítima. Mas se o notebook é novo ou se a falha veio junto com outros sintomas, avaliar antes evita conviver com um defeito que pode ser de cabo e que tende a piorar com o tempo.",
  },
  {
    question: "Câmera esverdeada ou com imagem tremida é sujeira na lente?",
    answer:
      "Sujeira deixa a imagem embaçada, não esverdeada nem tremida. Cor alterada e imagem instável apontam para o sensor ou para o conector do módulo com contato parcial. Limpar a lente com pano seco é seguro e vale o teste, mas se a distorção continuar, o caminho é avaliação técnica.",
  },
  {
    question: "Pode ser vírus acessando ou bloqueando minha câmera?",
    answer:
      "Bloqueio por antivírus ou por política de privacidade é bem mais comum que vírus. Vários pacotes de segurança trazem proteção de câmera ativada por padrão e barram programas legítimos. Verificamos essa camada antes de qualquer suspeita de hardware, e explicamos o que foi encontrado em vez de sugerir formatação por precaução.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Fazemos retirada e devolução no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Casos de permissão e driver costumam ser resolvidos remotamente, e avisamos quando esse é o caminho.",
  },
];

const WebcamNaoFunciona = () => {
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
      name: "Webcam não funciona: permissão, driver, cabo flat ou módulo",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-webcam-nao-funciona-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas" }, { label: "Webcam não funciona" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Webcam não funciona: permissão, driver, cabo flat ou módulo
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Tela preta na reunião raramente é câmera queimada. Esta página mostra a ordem que separa bloqueio de
            sistema de falha física, sem gastar antes da hora.
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
        imageKey="notebookReparo"
        secondaryImageKey="diagnostico"
        layout="duo"
        caption="Revisão do módulo de câmera e do cabo flat que passa pela dobradiça da tela"
        secondaryCaption="Teste de captura em aplicativo nativo antes de qualquer conclusão sobre hardware"
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">A ordem certa de investigar uma câmera sem imagem</h2>
          <p className="mb-3 text-muted-foreground">
            O primeiro divisor é gratuito: abrir o aplicativo de câmera nativo do sistema. Se a imagem aparece ali, o
            módulo está saudável e a falha está na permissão ou no programa que você usa nas reuniões.
          </p>
          <p className="mb-3 text-muted-foreground">
            O segundo divisor é a estabilidade. Câmera que some e volta ao mexer na tampa aponta para cabo flat.
            Câmera que nunca mais apareceu na lista de dispositivos aponta para driver ou para o módulo em falha.
          </p>
          <p className="text-muted-foreground">
            Se além da câmera o notebook está lento ou instável, vale conferir{" "}
            <Link to="/problemas/notebook-lento" className="font-medium text-accent hover:underline">
              notebook lento
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
            Permissão desativada e obturador fechado respondem por boa parte dos chamados. Entre as falhas físicas,
            cabo flat prensado na dobradiça é disparado o campeão em notebook.
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
            <Video className="h-6 w-6 text-accent" /> Verificações seguras antes de comprar câmera externa
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhum passo abaixo exige abrir equipamento nem instalar programa. Siga na ordem e pare assim que
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
            O que não recomendamos: instalar programas que prometem recuperar drivers automaticamente, forçar a
            moldura da tela para chegar ao módulo e desativar o antivírus inteiro para testar a câmera.
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
              <h3 className="mb-2 font-semibold text-foreground">Teste gratuito antes de gastar</h3>
              <p className="text-sm text-muted-foreground">
                Orientamos o teste no aplicativo nativo antes de qualquer atendimento pago. Se for permissão,
                dizemos e você resolve sozinho.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Remoto quando cabe</h3>
              <p className="text-sm text-muted-foreground">
                Driver, permissão do sistema e bloqueio de antivírus se resolvem sem retirar o equipamento do
                lugar.
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
            O que não prometemos: módulo original para todo modelo antigo, garantia sobre câmeras externas que não
            fornecemos e prazo fixo antes da avaliação.
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
          <h2 className="mb-3 text-2xl font-bold">Conte o que já foi testado</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Se a câmera aparece no aplicativo nativo, se some ao mexer na tampa e se a falha começou depois de uma
            atualização, isso encurta bastante o diagnóstico.
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

export default WebcamNaoFunciona;
