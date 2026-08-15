import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { AlertTriangle, CheckCircle2, MessageCircle, PackageCheck, ShieldCheck, Wrench } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import {
  PECAS_DO_CLIENTE,
  PECAS_ADQUIRIDAS,
  GARANTIA_MONTAGEM,
  TESTES_MONTAGEM,
} from "@/lib/politicaMontagem";

const PATH = "/politica-de-pecas-do-cliente";
const TITLE = "Política de Peças do Cliente | Montagem em Curitiba";
const DESCRIPTION =
  "Regras claras para peças fornecidas pelo cliente em Curitiba: compatibilidade, procedência, integridade no recebimento, prazo de troca, garantia da peça x garantia da mão de obra e valor declarado do equipamento.";

const WA_MESSAGE =
  "Olá! Li a política de peças do cliente e quero confirmar se as peças que tenho são compatíveis.";

const COMPATIBILIDADE = [
  "Modelo exato de cada componente (placa-mãe, processador, memória, armazenamento, placa de vídeo, fonte e gabinete) precisa ser informado antes do agendamento — a conferência é feita sobre o que o fabricante publica, não sobre suposição.",
  "Memória depende de duas coisas: suporte da placa e suporte do processador. Perfil de desempenho (XMP/EXPO) só é ativado quando oficialmente suportado pela combinação.",
  "Placa de vídeo e refrigeração dependem das medidas internas reais do gabinete. Quando a medida publicada pelo fabricante do gabinete conflita com a da peça, a montagem é interrompida antes de forçar encaixe.",
  "Fonte é avaliada pelo consumo estimado dos componentes declarados. Potência nominal alta não substitui qualidade de fabricação, e não afirmamos que uma fonte específica é segura sem avaliar o conjunto.",
  "Processador novo em placa antiga pode exigir atualização de firmware. Nesse caso a regra de BIOS se aplica: só com motivo técnico e autorização registrada.",
];

const PROCEDENCIA = [
  "Pedimos a nota fiscal ou o comprovante de compra de cada peça. Isso não é burocracia: sem comprovante você não consegue acionar a garantia do fabricante depois.",
  "Sem comprovante, a montagem pode ser feita mesmo assim, mas o componente entra como item sem garantia rastreável e isso fica registrado no atendimento.",
  "Peça usada, recondicionada ou vinda de marketplace é aceita, com o mesmo registro de estado e o seu aceite do risco de falha.",
  "Não avaliamos autenticidade de marca nem emitimos laudo de falsificação. O que fazemos é registrar divergências visíveis entre o que está na embalagem e o que está no componente.",
];

const INTEGRIDADE = [
  "Todo componente é conferido no recebimento: lacre, embalagem, acessórios, parafusos e cabos que deveriam acompanhar.",
  "Dano prévio visível — pino torto no soquete, conector quebrado, trilha marcada, oxidação, dissipador solto — é fotografado e comunicado antes de qualquer instalação.",
  "Peça com dano prévio só é instalada com o seu aceite explícito. Se o dano inviabilizar a montagem com segurança, a instalação não é executada.",
  "O registro de recebimento existe para proteger os dois lados: evita discussão posterior sobre quando o dano apareceu.",
];

const TROCA = [
  "Quando uma peça sua falha nos testes, a montagem para e o resultado é comunicado na hora, com a descrição do que foi testado e como a falha se manifestou.",
  "O conjunto fica aguardando a sua substituição por até 5 dias úteis sem custo de permanência.",
  "Passado esse prazo, combinamos a devolução do conjunto no estado ou a continuidade do atendimento conforme a sua decisão.",
  "O prazo de troca junto ao vendedor ou fabricante é dele, e não temos controle sobre esse tempo. Também não intermediamos a devolução.",
  "Se a incompatibilidade inviabilizar a montagem, cobramos apenas o que já foi executado e explicamos exatamente qual troca resolve.",
];

const VALOR_ITENS = [
  "Componentes eletrônicos e de informática (placas, processadores, memórias, armazenamento, fontes) perdem valor de mercado com rapidez, mesmo funcionando perfeitamente.",
  "Equipamento de som, periféricos e placas específicas seguem a mesma lógica: o valor pago na compra não é o valor de reposição no estado atual.",
  "A avaliação técnica considera idade do componente, estado físico, presença de nota, existência de garantia ativa, sinais de reparo anterior e demanda real do modelo no mercado.",
  "Em caso de sinistro, seguro, indenização ou venda do equipamento no estado, é comum que o valor apurado por avaliação técnica ou por seguradora seja substancialmente inferior ao valor declarado — em muitos casos abaixo de um terço dele.",
  "Não emitimos laudo pericial, não somos avaliadores de seguro e nenhum número informado aqui vincula terceiros. O que fornecemos é o registro descritivo do estado do equipamento no atendimento.",
];

const FAQS = [
  {
    question: "Posso levar minhas próprias peças para a montagem?",
    answer:
      "Sim. Peças do cliente são aceitas, desde que os modelos exatos sejam informados antes para a conferência de compatibilidade. No recebimento registramos estado, acessórios e qualquer dano visível, e a montagem segue somente com esse registro combinado.",
  },
  {
    question: "Preciso apresentar nota fiscal das peças?",
    answer:
      "Pedimos a nota ou o comprovante de compra porque é ele que permite acionar a garantia do fabricante depois. Sem comprovante a montagem pode acontecer, mas o componente passa a constar como item sem garantia rastreável no registro do atendimento.",
  },
  {
    question: "E se uma peça minha falhar durante os testes?",
    answer:
      "A montagem é interrompida e o resultado é comunicado com a descrição do teste. O conjunto aguarda a sua substituição por até 5 dias úteis sem custo de permanência. Depois desse prazo combinamos a devolução no estado ou a continuidade do atendimento.",
  },
  {
    question: "Quem responde pela garantia: a peça ou o serviço?",
    answer:
      "São garantias separadas. A garantia da peça é do fabricante ou do fornecedor, com prazo e canal definidos por ele e acionada com a nota correspondente. A garantia da mão de obra cobre a instalação, a fixação, as conexões e a configuração que executamos.",
  },
  {
    question: "Peça usada ou sem garantia é aceita?",
    answer:
      "É aceita, com o seu aceite registrado do risco de falha. Componente usado pode apresentar defeito a qualquer momento e isso não é coberto pela garantia do serviço, que cobre a execução da montagem e da configuração.",
  },
  {
    question: "Vocês avaliam quanto vale o meu equipamento?",
    answer:
      "Registramos o estado técnico observado: componentes, funcionamento, sinais de reparo e limitações encontradas. Não emitimos laudo pericial nem avaliação para seguradora. Para sinistro, indenização ou venda no estado, o valor apurado por terceiros costuma ficar bem abaixo do valor declarado pelo proprietário.",
  },
  {
    question: "A montagem inclui overclock ou ajuste de desempenho?",
    answer:
      "Não. Não realizamos overclock, modificação de BIOS não oficial nem alteração fora do que o fabricante suporta, e não prometemos resultado de desempenho em jogos ou aplicativos.",
  },
];

const Lista = ({ itens }: { itens: string[] }) => (
  <ul className="mt-4 space-y-3">
    {itens.map((item) => (
      <li key={item} className="flex gap-3 text-muted-foreground">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const PoliticaPecasCliente = () => {
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
      name: "Política de peças fornecidas pelo cliente",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `politica-pecas-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Política de peças do cliente", path: PATH },
        ]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Política de peças do cliente" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
            Montagem e upgrade · Curitiba e região
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
            Política de peças fornecidas pelo cliente
          </h1>
          <p className="mb-6 text-base leading-relaxed opacity-95">
            Quando você compra os componentes e traz para montagem, upgrade ou substituição, três perguntas
            precisam de resposta antes de qualquer parafuso ser apertado: a peça é compatível, de onde ela veio e
            em que estado ela chegou. Esta página reúne as regras que aplicamos em todo atendimento com peça do
            cliente — compatibilidade, procedência, integridade no recebimento, prazo de troca quando algo falha e
            a separação entre garantia da peça e garantia da mão de obra.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="politica_pecas_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Conferir compatibilidade das minhas peças
            </a>
          </Button>
        </div>
      </section>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-12">
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-foreground">
            <PackageCheck className="h-6 w-6 text-[hsl(var(--accent))]" aria-hidden="true" />
            Compatibilidade: conferida antes, nunca no meio da montagem
          </h2>
          <p className="text-muted-foreground">
            A maior parte dos problemas em montagem com peça do cliente não aparece na bancada: aparece na compra.
            Memória que a placa não suporta, cooler que não cabe no gabinete, fonte com conector diferente do que a
            placa de vídeo exige. Por isso a conferência acontece antes do agendamento, com base nos modelos exatos
            informados por você e no que o fabricante publica sobre cada componente.
          </p>
          <Lista itens={COMPATIBILIDADE} />
        </section>

        <section className="mb-12">
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-foreground">
            <ShieldCheck className="h-6 w-6 text-[hsl(var(--accent))]" aria-hidden="true" />
            Procedência: o comprovante é o que garante a sua peça
          </h2>
          <p className="text-muted-foreground">
            Procedência conta. Uma peça sem nota funciona igual no dia da montagem, mas deixa você sem caminho no
            dia em que ela falhar — porque quem responde por defeito de fábrica é o fabricante ou o vendedor, e eles
            exigem o comprovante. O registro que fazemos aqui apenas documenta essa condição de forma honesta.
          </p>
          <Lista itens={PROCEDENCIA} />
        </section>

        <section className="mb-12">
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-foreground">
            <AlertTriangle className="h-6 w-6 text-[hsl(var(--accent))]" aria-hidden="true" />
            Integridade no recebimento
          </h2>
          <p className="text-muted-foreground">
            Componente eletrônico é sensível a transporte, armazenamento e manuseio. Um soquete com pino torto, um
            conector de alimentação danificado ou um dissipador solto podem inviabilizar a montagem inteira — e a hora
            de identificar isso é no recebimento, com registro fotográfico, não depois que o sistema não liga.
          </p>
          <Lista itens={INTEGRIDADE} />
        </section>

        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-bold text-foreground">Prazo de troca quando uma peça falha</h2>
          <p className="text-muted-foreground">
            Peça nova também falha. Quando isso acontece durante os testes, a regra é objetiva e não depende de
            negociação no momento da tensão:
          </p>
          <Lista itens={TROCA} />
          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-5">
            <h3 className="font-semibold text-foreground">Testes que revelam esse tipo de falha</h3>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {TESTES_MONTAGEM.map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-foreground">
            <Wrench className="h-6 w-6 text-[hsl(var(--accent))]" aria-hidden="true" />
            Garantia da peça x garantia da mão de obra
          </h2>
          <p className="text-muted-foreground">
            São duas coberturas diferentes, com responsáveis diferentes. Confundir as duas é a origem da maior parte
            das frustrações em montagem — por isso elas ficam separadas por escrito desde o primeiro contato.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {GARANTIA_MONTAGEM.map((g) => (
              <div key={g.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">{g.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-foreground">Regras para peças que você fornece</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {PECAS_DO_CLIENTE.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Regras para peças adquiridas a pedido</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {PECAS_ADQUIRIDAS.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-bold text-foreground">
            Valor declarado do equipamento: entenda antes de declarar
          </h2>
          <p className="text-muted-foreground">
            Muita gente precisa informar um valor do equipamento — para seguro residencial, para transporte, para
            registro interno de empresa ou para venda no estado. Esse valor é sempre declarado pelo proprietário, e
            é importante entender o que ele significa na prática quando alguém precisa apurar o valor de verdade.
          </p>
          <Lista itens={VALOR_ITENS} />
          <div className="mt-6 rounded-xl border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/5 p-5">
            <h3 className="font-semibold text-foreground">Ciência sobre valor declarado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ao informar um valor para o seu equipamento (por exemplo, "meu equipamento vale R$ 5.000"), você está
              declarando uma estimativa própria. Fica registrado o entendimento de que, em caso de sinistro, dano,
              indenização ou venda no estado, o valor apurado por avaliação técnica, perícia ou seguradora pode ser
              significativamente inferior ao declarado — inclusive abaixo de um terço dele — porque componentes
              eletrônicos e de informática se desvalorizam rapidamente e a apuração considera idade, estado,
              comprovação de origem e demanda real do modelo.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Esse registro não substitui laudo pericial, não vincula seguradora e não constitui avaliação de
              mercado. As regras comerciais completas estão em{" "}
              <Link to="/termos-e-condicoes" className="font-medium text-[hsl(var(--accent))] underline">
                termos e condições
              </Link>{" "}
              e em{" "}
              <Link to="/precos-e-politicas" className="font-medium text-[hsl(var(--accent))] underline">
                preços e políticas
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-bold text-foreground">Perguntas frequentes sobre peças do cliente</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">{f.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 rounded-2xl border border-border bg-muted/30 p-6">
          <h2 className="text-xl font-bold text-foreground">Páginas relacionadas</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            <li>
              <Link to="/servicos/montagem-de-pc" className="font-medium text-[hsl(var(--accent))] underline">
                Montagem de PC e desktops
              </Link>
              <p className="text-sm text-muted-foreground">Escopo do serviço, checklist de testes e limites publicados.</p>
            </li>
            <li>
              <Link to="/servicos/upgrade-ssd-ram" className="font-medium text-[hsl(var(--accent))] underline">
                Upgrade de SSD e memória
              </Link>
              <p className="text-sm text-muted-foreground">Quando trocar, o que muda de fato e como a compatibilidade é conferida.</p>
            </li>
            <li>
              <Link to="/precos-e-politicas" className="font-medium text-[hsl(var(--accent))] underline">
                Preços, garantia e políticas
              </Link>
              <p className="text-sm text-muted-foreground">Garantia da mão de obra, pagamento e nota fiscal.</p>
            </li>
            <li>
              <Link to="/seguranca-dos-dados" className="font-medium text-[hsl(var(--accent))] underline">
                Segurança dos dados
              </Link>
              <p className="text-sm text-muted-foreground">Como arquivos e acessos são tratados durante o atendimento.</p>
            </li>
          </ul>
          <Button asChild size="lg" className="mt-6 min-h-14">
            <a href={waHref} onClick={cta("rodape")} data-cta-location="politica_pecas_rodape">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar sobre as minhas peças
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaPecasCliente;
