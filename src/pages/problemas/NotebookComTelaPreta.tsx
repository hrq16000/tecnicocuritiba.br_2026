import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, MessageCircle, MonitorSmartphone } from "lucide-react";
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

const PATH = "/problemas/notebook-com-tela-preta";
const TITLE = "Notebook com Tela Preta mas Ligado: O Que Fazer | Curitiba";
const DESCRIPTION =
  "Notebook liga, ventoinha gira e teclado acende, mas a tela fica preta? Entenda como separar backlight, cabo flat, vídeo da placa e sistema travado antes de trocar peça, com avaliação por coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre notebook com tela preta. Meu notebook liga mas a tela não mostra imagem e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Liga, faz barulho, mas a tela permanece totalmente escura",
    desc: "Ventoinha girando e LEDs acesos indicam que a placa recebeu energia. O ponto de parada está entre a geração da imagem e a tela — não na alimentação do aparelho.",
  },
  {
    titulo: "Imagem fraquíssima, visível só com lanterna encostada",
    desc: "O teste da lanterna em ângulo revela silhueta de ícones e janelas. Quando a imagem existe mas não é iluminada, a suspeita recai sobre iluminação da tela, não sobre o vídeo.",
  },
  {
    titulo: "Tela preta no notebook, mas imagem normal no monitor externo",
    desc: "Se a saída HDMI mostra a área de trabalho, o computador está funcionando. O defeito está no conjunto de tela, no cabo interno ou no circuito que alimenta esse conjunto.",
  },
  {
    titulo: "Tela preta também no monitor externo",
    desc: "Sem imagem em nenhuma saída, a investigação muda de lado: passa para memória, vídeo integrado e circuitos da placa. É o cenário mais próximo de reparo em nível de componente.",
  },
  {
    titulo: "Preta ao abrir a tampa, volta depois de fechar e abrir de novo",
    desc: "Comportamento típico de sensor de tampa ou de cabo interno com contato intermitente na dobradiça. Costuma piorar com o tempo até a imagem parar de voltar.",
  },
  {
    titulo: "Preta depois de uma atualização ou de um driver novo",
    desc: "Aqui o hardware pode estar íntegro e o sistema, não. Modo de segurança e reversão de driver resolvem parte desses casos sem abrir o aparelho.",
  },
];

const CAUSAS = [
  "Circuito de iluminação da tela sem alimentação (falha no conversor de backlight)",
  "Cabo interno de vídeo com trilha rompida na passagem pela dobradiça",
  "Conector do cabo de tela solto após queda ou abertura forçada da tampa",
  "Sensor de tampa travado, mantendo o notebook em estado de tela desligada",
  "Memória RAM com mau contato, impedindo a inicialização do vídeo",
  "Vídeo integrado ou circuito de alimentação do vídeo comprometido na placa",
  "Atualização de sistema ou driver de vídeo incompatível",
  "Tela com dano interno após impacto, pressão na tampa ou infiltração",
];

const VERIFICACOES = [
  "Ligue o notebook em ambiente escuro e ilumine a tela em ângulo com uma lanterna: se aparecer silhueta de imagem, o vídeo existe.",
  "Conecte um monitor ou televisor pela saída de vídeo e alterne a projeção pelo atalho do teclado.",
  "Observe se há som de inicialização, LED de disco piscando ou resposta do teclado — sinais de que o sistema subiu.",
  "Remova a fonte, desligue por completo e mantenha o botão de energia pressionado por trinta segundos antes de religar.",
  "Retire acessórios externos, cartão de memória e pen drives: periférico com defeito trava a inicialização.",
  "Abra e feche a tampa devagar observando se a imagem pisca em algum ângulo.",
  "Não force a tampa além do curso normal nem apoie peso sobre a tela fechada.",
  "Não insista em ligar e desligar repetidamente quando houver cheiro de queimado ou aquecimento anormal.",
];

const OPCOES = [
  {
    titulo: "Avaliação do conjunto de tela e do cabo interno",
    desc: "Quando a imagem aparece no monitor externo, o trabalho concentra-se no conjunto de tela: cabo, conector e circuito de iluminação. É o grupo com maior taxa de reparo bem-sucedido.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Reparo em nível de componente na placa",
    desc: "Sem imagem em nenhuma saída, medimos as tensões dos circuitos de vídeo em bancada. O caminho é reparo pontual com estação de retrabalho, não substituição automática da placa inteira.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Correção de sistema, driver ou inicialização",
    desc: "Quando o hardware responde e o problema é de software, a solução costuma ser reversão de driver, reparo da inicialização ou reinstalação limpa preservando os arquivos existentes.",
    to: "/servicos/formatacao",
    label: "Formatação e reinstalação",
  },
  {
    titulo: "Coleta e devolução no endereço",
    desc: "O aparelho é retirado no endereço informado, avaliado em bancada e devolvido no mesmo lugar. Você recebe o resultado da avaliação antes de qualquer execução ou compra de peça.",
    to: "/coleta-e-entrega",
    label: "Como funciona a coleta",
  },
];

const FAQS = [
  {
    question: "Meu notebook liga mas a tela fica preta. É a tela ou a placa?",
    answer:
      "O teste do monitor externo responde isso em menos de um minuto. Se a imagem aparece no monitor conectado, o computador está processando normalmente e o defeito está no conjunto de tela, no cabo interno ou no circuito que ilumina o painel. Se nem o monitor externo mostra imagem, a investigação se desloca para memória, vídeo e circuitos de alimentação da placa. São dois caminhos com custo e prazo bem diferentes, por isso esse teste vem antes de qualquer orçamento.",
  },
  {
    question: "Consigo ver a imagem bem fraquinha com a lanterna. O que isso significa?",
    answer:
      "Significa que o vídeo está sendo gerado e enviado à tela, mas a iluminação do painel não está acendendo. Na prática, é uma boa notícia: o circuito de iluminação e seu cabo são a parte reparável da história, e o painel costuma estar íntegro. A avaliação em bancada confirma se falta alimentação, se o problema está no conversor ou se o cabo interno rompeu na dobradiça.",
  },
  {
    question: "A tela ficou preta depois de uma atualização do Windows. Tem conserto sem trocar peça?",
    answer:
      "Na maior parte desses casos, sim. Atualização que instala driver de vídeo incompatível deixa o sistema rodando sem exibir imagem, e a correção é feita por inicialização em modo de segurança com reversão do driver. Nenhuma peça é envolvida. Como o sintoma é idêntico ao de uma falha física, verificamos o hardware antes de concluir que a origem era só de software.",
  },
  {
    question: "Vale a pena consertar ou é melhor trocar o notebook?",
    answer:
      "Usamos um critério objetivo: quando o custo do reparo se aproxima do valor de um aparelho equivalente, não indicamos o serviço. Cabo interno, conector e circuito de iluminação costumam ficar bem abaixo desse limite. Painel danificado por impacto e placa com dano extenso são os cenários que mais se aproximam dele. Damos a orientação com o número na mão, mesmo quando ela significa não fazer o serviço.",
  },
  {
    question: "A imagem volta quando eu mexo na tampa. Posso continuar usando assim?",
    answer:
      "Pode, mas o quadro tende a piorar. Imagem que aparece e some conforme o ângulo indica cabo interno com trilha em processo de rompimento na passagem pela dobradiça. Cada abertura acelera o desgaste, e o estágio final é a tela que não volta mais. Avaliar enquanto o defeito ainda é intermitente costuma resultar em serviço mais simples e mais barato.",
  },
  {
    question: "Preciso levar o notebook até vocês?",
    answer:
      "Não. Não temos balcão de atendimento ao público. O atendimento começa pelo WhatsApp, com a descrição do sintoma e o resultado do teste do monitor externo. Se o caso seguir para bancada, retiramos o aparelho no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado por você.",
  },
  {
    question: "Vocês conseguem preservar meus arquivos?",
    answer:
      "O procedimento padrão é trabalhar preservando o conteúdo do disco, e qualquer intervenção que exija formatação é comunicada e aprovada antes. Quando o disco também apresenta falha, o trabalho é feito sobre cópia, sem gravar no dispositivo original. Não prometemos recuperação integral em mídia com dano físico — informamos o que é possível depois da avaliação.",
  },
  {
    question: "Qual a garantia desse tipo de reparo?",
    answer:
      "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco em que atuamos. Reparo no conjunto de tela cobre o conjunto de tela; reparo na placa cobre o circuito tratado. Falha posterior em outro ponto é avaliada como caso novo. Queda, líquido e pressão sobre a tampa depois da entrega caracterizam dano novo e não estão cobertos.",
  },
];

const NotebookComTelaPreta = () => {
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
      name: "Notebook com tela preta: causas, testes e reparo",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-notebook-com-tela-preta-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Notebook com tela preta" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Notebook com tela preta: como descobrir se é a tela, o cabo ou a placa
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            O aparelho liga, a ventoinha gira e o teclado acende, mas a tela continua escura. Dois testes caseiros —
            lanterna em ângulo e monitor externo — já separam três causas com custos completamente diferentes. Esta
            página mostra como fazê-los e o que acontece depois.
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
        imageKey="notebookReparo"
        secondaryImageKey="diagnostico"
        layout="duo"
        caption="Notebook aberto em bancada para avaliação do conjunto de tela e do cabo interno"
        secondaryCaption="Medição das tensões do circuito de vídeo antes de qualquer substituição de peça"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "dois-testes", label: "Os dois testes que decidem" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="dois-testes" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Dois testes decidem o rumo do atendimento</h2>
          <p className="mb-3 text-muted-foreground">
            O primeiro é a lanterna: em ambiente escuro, iluminando a tela em ângulo, procure a silhueta dos ícones. Se
            a imagem existe mas não é iluminada, o problema está na iluminação do painel — um grupo com boa taxa de
            reparo, sem envolver o vídeo da placa.
          </p>
          <p className="mb-3 text-muted-foreground">
            O segundo é o monitor externo. Imagem normal na saída de vídeo confirma que processador, memória e vídeo
            estão trabalhando, e restringe o defeito ao conjunto de tela e ao cabo interno. Sem imagem em nenhuma saída,
            a avaliação passa a ser de placa, com medição de tensões em bancada.
          </p>
          <p className="text-muted-foreground">
            Se o aparelho sequer acende LED nem faz barulho, o quadro é outro e está descrito em{" "}
            <Link to="/problemas/notebook-nao-liga" className="font-medium text-accent hover:underline">
              notebook não liga
            </Link>
            . Se a tela está trincada ou manchada, veja{" "}
            <Link to="/problemas/tela-de-notebook-quebrada" className="font-medium text-accent hover:underline">
              tela de notebook quebrada
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
            Aparelho com muitos ciclos de abertura da tampa, queda recente e atualização de sistema mal concluída são os
            três contextos mais frequentes. A inspeção em bancada é o que separa contato, cabo, circuito de iluminação e
            vídeo da placa — o relato do sintoma orienta a expectativa, mas não fecha diagnóstico.
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
            <MonitorSmartphone className="h-6 w-6 text-accent" /> Verificações que você pode fazer antes de acionar alguém
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os dois primeiros itens sozinhos já eliminam metade das hipóteses.
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
            O que não recomendamos em nenhuma hipótese: apertar a tela para "reativar" a imagem, aquecer a moldura,
            desmontar a tampa sem ferramenta adequada e ligar o aparelho repetidamente quando houver cheiro de
            queimado.
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
            Valem para todo atendimento de notebook e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Diagnóstico antes do orçamento</h3>
              <p className="text-sm text-muted-foreground">
                Nenhuma peça é comprada ou trocada antes da avaliação em bancada e da sua aprovação explícita do valor.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. O notebook é retirado no endereço informado e devolvido no
                mesmo endereço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia com escopo</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado. Queda ou líquido posterior é dano
                novo e não está coberto.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: fechar diagnóstico apenas pelo relato no WhatsApp, garantir disponibilidade de tela de
            modelo descontinuado e recuperar painel com dano interno.
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
          <h2 className="mb-3 text-2xl font-bold">Conte o resultado do teste do monitor externo</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo, se a imagem aparece na saída de vídeo e se houve queda ou atualização recente. Com essas
            três informações já conseguimos orientar a expectativa antes da coleta.
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

export default NotebookComTelaPreta;
