import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, Keyboard } from "lucide-react";
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

const PATH = "/problemas/teclado-de-notebook-nao-funciona";
const TITLE = "Teclado do Notebook Não Funciona: Causas e Troca | Curitiba";
const DESCRIPTION =
  "Teclas que não respondem, teclado morto ou digitando sozinho? Entenda quando é software, cabo flat, líquido ou placa, o que a troca resolve e como funciona a coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre teclado de notebook que não funciona. Quero avaliação do meu equipamento.";

const SINTOMAS = [
  {
    titulo: "Teclado inteiro parou de uma vez",
    desc: "Quando nenhuma tecla responde, a suspeita principal é o cabo flat solto no conector da placa ou o próprio conector danificado. Um teclado USB que funciona normalmente confirma que a placa e o sistema estão bem.",
  },
  {
    titulo: "Algumas teclas específicas falham",
    desc: "Falha localizada aponta membrana rompida ou sujeira sob a tecla. Se as teclas afetadas estão na mesma linha ou coluna, a trilha da membrana se rompeu — o teclado é substituído inteiro, não tecla por tecla.",
  },
  {
    titulo: "Digita caracteres errados ou repetidos",
    desc: "Pode ser resíduo entre as camadas da membrana mantendo contato permanente, mas também aparece após derramamento leve, quando o açúcar da bebida seca e passa a fechar circuito sozinho.",
  },
  {
    titulo: "Teclas grudando ou com toque duro",
    desc: "Típico de líquido que secou sob o mecanismo. Nesses casos o problema não é elétrico, é mecânico, e limpar por cima raramente resolve porque o resíduo está entre as camadas.",
  },
  {
    titulo: "Funciona intermitente, conforme o ângulo da tela",
    desc: "Sinal clássico de cabo flat prensado ou parcialmente rompido na região da dobradiça. Continuar usando assim tende a romper o restante das vias.",
  },
  {
    titulo: "Teclado e touchpad pararam juntos",
    desc: "Quando os dois falham ao mesmo tempo, o cenário muda: costuma ser o controlador na placa-mãe ou o barramento que atende os dois, e não o teclado em si.",
  },
];

const CAUSAS = [
  "Cabo flat solto, oxidado ou rompido no conector da placa-mãe",
  "Membrana do teclado rompida por desgaste de uso contínuo",
  "Líquido derramado que secou entre as camadas do teclado",
  "Resíduo de poeira e migalhas sob teclas específicas",
  "Conector ZIF da placa com trava quebrada por montagem anterior malfeita",
  "Driver de teclado corrompido ou conflito após atualização do sistema",
  "Configuração de idioma trocada, fazendo o teclado digitar caracteres errados",
  "Controlador de entrada na placa-mãe com falha, afetando teclado e touchpad",
];

const VERIFICACOES = [
  "Ligue um teclado USB: se ele funciona, o sistema está bem e o problema é do teclado interno ou do cabo.",
  "Teste o teclado dentro da BIOS/Setup, que roda antes do Windows — se falha lá, a causa é física, não de software.",
  "Confira o idioma do teclado nas configurações antes de concluir defeito: ABNT2 configurado como US troca acentos e símbolos.",
  "Observe se a falha muda ao mover a tela: isso aponta cabo flat na dobradiça.",
  "Se houve derramamento, desligue e não ligue mais — o resíduo continua agindo mesmo depois de secar por fora.",
  "Não retire teclas à força para limpar: as travas plásticas quebram e não são vendidas separadamente.",
  "Evite jogar ar comprimido em excesso, que empurra resíduo para dentro da membrana e para a placa.",
  "Anote quando começou e o que aconteceu antes — atualização de sistema, queda ou líquido mudam totalmente a hipótese.",
];

const OPCOES = [
  {
    titulo: "Reencaixe e reparo do cabo flat",
    desc: "Abertura, limpeza dos contatos e reassentamento no conector ZIF. Quando o conector está com a trava quebrada, o reparo é feito no próprio conector — bem mais barato que trocar o teclado sem necessidade.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Substituição do teclado",
    desc: "Peça de mesmo layout e conector, testada tecla a tecla antes de fechar. Em modelos com teclado integrado à carcaça superior, explicamos a diferença de custo antes de você aprovar.",
    to: "/servicos/manutencao-de-notebook",
    label: "Avaliar troca de teclado",
  },
  {
    titulo: "Limpeza técnica após líquido",
    desc: "Desmontagem completa, remoção de resíduo e secagem controlada. Quanto mais cedo, maior a chance de o teclado e a placa saírem sem sequela — o tempo é o fator decisivo aqui.",
    to: "/problemas/notebook-molhado",
    label: "Notebook molhado",
  },
  {
    titulo: "Reparo no controlador da placa",
    desc: "Cenário em que teclado e touchpad falham juntos. Avaliação em nível de componente, com viabilidade informada antes: quando não compensa, dizemos e sugerimos alternativa.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
];

const FAQS = [
  {
    question: "Como saber se é o teclado ou o sistema?",
    answer:
      "Dois testes resolvem quase sempre. O primeiro é ligar um teclado USB: se ele digita normalmente, o sistema está saudável e a falha está no teclado interno, no cabo flat ou no conector. O segundo é entrar na BIOS/Setup ao ligar o aparelho, um ambiente que roda antes do Windows — se o teclado também falha ali, está descartada qualquer hipótese de driver ou configuração.",
  },
  {
    question: "Dá para trocar só a tecla que parou?",
    answer:
      "A tampa da tecla e o mecanismo de borracha podem ser recolocados quando apenas se soltaram. Mas se a falha é elétrica, o contato acontece em uma membrana de várias camadas que percorre o teclado inteiro: não existe reparo por tecla nessa camada, e a substituição é da peça completa. Por isso o diagnóstico separa antes o que é mecânico do que é de membrana.",
  },
  {
    question: "Derramei café no teclado e ele ainda funciona. Preciso levar?",
    answer:
      "Sim, e quanto antes melhor. Bebidas com açúcar deixam resíduo condutivo que continua agindo depois de secar, causando teclas que grudam, caracteres repetidos e, no pior cenário, corrosão que atravessa o teclado e alcança a placa-mãe. Funcionar hoje não indica que passou: a oxidação é progressiva e o custo do reparo cresce junto com ela.",
  },
  {
    question: "Meu teclado digita letras trocadas. É defeito?",
    answer:
      "Nem sempre. Layout configurado como US em teclado ABNT2 troca acentos, cedilha e símbolos, e isso se resolve na configuração de idioma em poucos minutos, sem nenhum reparo. Se a troca de caracteres for aleatória, com repetição de teclas que você não pressionou, aí sim o quadro aponta membrana com contato permanente, geralmente por resíduo.",
  },
  {
    question: "Quanto custa trocar o teclado de um notebook?",
    answer:
      "Depende do modelo e da construção. Notebooks com teclado como peça independente têm troca mais simples e barata; modelos em que o teclado vem rebitado à carcaça superior exigem substituição do conjunto, com custo maior. Como a diferença é grande, informamos a faixa provável a partir do modelo e o valor fechado depois da inspeção, sempre com sua aprovação antes da execução.",
  },
  {
    question: "O teclado externo resolve por definitivo?",
    answer:
      "Resolve como solução de contorno e é uma escolha legítima quando o notebook fica sempre na mesma mesa. Não recomendamos como definitivo em dois casos: quando houve líquido, porque o resíduo segue avançando por dentro, e quando a falha é do cabo flat na dobradiça, porque o rompimento pode alcançar outras vias que passam pelo mesmo caminho.",
  },
  {
    question: "Como o notebook chega até vocês?",
    answer:
      "Por coleta no endereço informado — não temos balcão de atendimento ao público. Você aciona pelo WhatsApp descrevendo o sintoma, combinamos a retirada, a avaliação é feita em bancada e a devolução acontece no mesmo endereço, com o teclado testado tecla a tecla na sua frente no ato da entrega.",
  },
  {
    question: "Existe garantia?",
    answer:
      "Sim, 90 dias sobre a mão de obra e sobre o teclado aplicado, limitados ao bloco reparado. Novo derramamento de líquido, queda ou pressão sobre a carcaça são danos novos e não estão cobertos. Em casos que envolveram líquido anterior, informamos antes que a oxidação já existente pode voltar a se manifestar, e isso fica registrado no laudo.",
  },
];

const TecladoNotebookNaoFunciona = () => {
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
      name: "Teclado de notebook não funciona: diagnóstico e troca",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-teclado-notebook-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Teclado de notebook não funciona" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Teclado de notebook não funciona: quando é ajuste, quando é peça
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Parte dos casos que chegam aqui não precisa de teclado novo: é layout de idioma trocado, cabo flat solto ou
            resíduo sob a tecla. A outra parte precisa de substituição, e o custo muda bastante conforme o teclado seja
            peça independente ou venha rebitado à carcaça. Esta página mostra como separar os dois grupos.
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
        secondaryImageKey="ferramentas"
        layout="duo"
        caption="Notebook aberto para inspeção do conector do cabo flat do teclado"
        secondaryCaption="Ferramental de desmontagem usado para não danificar travas plásticas"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "dois-grupos", label: "Dois grupos de causa" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="dois-grupos" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Dois grupos de causa, custos muito diferentes</h2>
          <p className="mb-3 text-muted-foreground">
            No primeiro grupo estão as falhas que não exigem peça: idioma do teclado configurado errado, driver
            corrompido depois de uma atualização, cabo flat que se soltou do conector e sujeira sob teclas específicas.
            São casos de ajuste ou limpeza, com prazo curto e valor baixo.
          </p>
          <p className="mb-3 text-muted-foreground">
            No segundo grupo estão as falhas de peça: membrana rompida por desgaste, resíduo de líquido entre as
            camadas e cabo flat partido na dobradiça. Aqui a substituição é inevitável, e o custo depende da construção
            do modelo. Testar antes é o que evita comprar teclado para um problema que era de configuração.
          </p>
          <p className="text-muted-foreground">
            O procedimento completo está descrito em{" "}
            <Link to="/servicos/manutencao-de-notebook" className="font-medium text-accent hover:underline">
              manutenção de notebook
            </Link>
            , e casos que envolveram líquido têm uma janela de tempo própria, explicada em{" "}
            <Link to="/problemas/notebook-molhado" className="font-medium text-accent hover:underline">
              notebook molhado
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
            Uma parte relevante dos atendimentos termina sem troca de peça. Só a inspeção define em qual grupo o seu
            caso está — a descrição por mensagem serve para orientar a urgência, não para fechar diagnóstico.
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
            <Keyboard className="h-6 w-6 text-accent" /> Verificações que você mesmo pode fazer
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os três primeiros itens separam software de hardware sem abrir o aparelho.
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
            O que não recomendamos em nenhuma hipótese: lavar o teclado com água, secar com secador quente, arrancar
            teclas com objeto metálico e continuar digitando em teclado que recebeu líquido açucarado.
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
              <h3 className="mb-2 font-semibold text-foreground">Teste antes da peça</h3>
              <p className="text-sm text-muted-foreground">
                O teclado só é substituído depois que o teste na BIOS e a inspeção do cabo flat descartam ajuste e
                reencaixe.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. Retiramos o notebook no endereço informado e devolvemos no
                mesmo endereço, testado.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia delimitada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e teclado aplicado. Novo derramamento, queda ou pressão sobre a carcaça são
                danos novos.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: valor fechado antes da inspeção, disponibilidade imediata de teclado para qualquer
            modelo e ausência de sequela em aparelho que já teve contato com líquido.
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
          <h2 className="mb-3 text-2xl font-bold">Conte quais teclas falham e desde quando</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo, se teclas específicas ou todas pararam, se houve líquido e se um teclado USB funciona.
            Com esses dados já indicamos se o caminho provável é ajuste ou substituição.
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

export default TecladoNotebookNaoFunciona;
