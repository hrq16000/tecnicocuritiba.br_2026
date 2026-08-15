import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, MessageCircle, Printer } from "lucide-react";
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

const PATH = "/problemas/impressora-nao-imprime";
const TITLE = "Impressora Não Imprime: Causas e Solução | Curitiba";
const DESCRIPTION =
  "Impressora aparece como offline, aceita o trabalho e não imprime ou sai página em branco? Veja como separar fila travada, driver, rede Wi-Fi e falha mecânica antes de gastar com cartucho ou aparelho novo em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre impressora que não imprime. Minha impressora não está imprimindo e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Aparece como offline mesmo ligada",
    desc: "Quadro típico de rede: a impressora trocou de endereço no Wi-Fi ou o computador guardou uma porta antiga. Nada foi danificado, e o conserto é de configuração.",
  },
  {
    titulo: "O documento entra na fila e fica parado",
    desc: "Trabalho preso trava todos os seguintes. Um único arquivo com erro pode paralisar a impressora da casa inteira sem que exista qualquer defeito de hardware.",
  },
  {
    titulo: "Imprime página em branco",
    desc: "Em jato de tinta, quase sempre é cabeça de impressão entupida por falta de uso. Em laser, aponta para toner mal encaixado, cilindro no fim ou sensor sujo.",
  },
  {
    titulo: "Puxa o papel e atola sempre no mesmo ponto",
    desc: "Repetição no mesmo lugar indica desgaste de roletes, sujeira no caminho do papel ou um pedaço de folha esquecido lá dentro numa remoção anterior.",
  },
  {
    titulo: "Imprime do celular, mas não do computador",
    desc: "Prova que a impressora e a rede estão bem. O que falhou é o driver ou a fila daquele computador específico, e o reparo é de software.",
  },
  {
    titulo: "Faz barulho de engrenagem e não movimenta o carro",
    desc: "Ruído seco com movimento travado é o sintoma que mais exige avaliação em bancada: pode ser correia, engrenagem partida ou obstrução interna.",
  },
];

const CAUSAS = [
  "Fila de impressão travada por um trabalho com erro anterior",
  "Impressora com endereço novo na rede após queda ou troca do roteador",
  "Driver desatualizado ou incompatível depois de atualização do Windows",
  "Impressora padrão apontando para dispositivo virtual (PDF, OneNote, fax)",
  "Cabeça de impressão entupida por longos períodos sem uso, em jato de tinta",
  "Toner mal encaixado, cilindro no fim da vida ou sensor sujo, em laser",
  "Roletes desgastados ou resto de papel preso no caminho da folha",
  "Cabo USB com mau contato ou porta do computador oscilando",
];

const VERIFICACOES = [
  "Cancele todos os trabalhos da fila, desligue a impressora da tomada por trinta segundos e ligue de novo.",
  "Confira nas configurações se a impressora padrão é o aparelho físico, e não um dispositivo virtual de PDF.",
  "Imprima a página de teste pelo painel da própria impressora: se ela sai, o problema está no computador ou na rede.",
  "Tente imprimir pelo celular na mesma rede — isso separa falha da impressora de falha do driver.",
  "Verifique se a impressora está na mesma rede Wi-Fi do computador, e não numa rede de convidados.",
  "Em jato de tinta parada há semanas, rode a limpeza de cabeçote pelo painel antes de comprar cartucho.",
  "Abra as tampas e procure resto de papel preso; puxe sempre no sentido do caminho da folha, nunca contra.",
  "Não force o carro de impressão com a mão nem lave cabeçote com produtos improvisados.",
];

const OPCOES = [
  {
    titulo: "Ajuste de driver, fila e rede",
    desc: "Boa parte dos chamados de impressora termina sem peça: reinstalação limpa do driver, correção da porta e fixação do endereço na rede para o problema não voltar na próxima queda de energia.",
    to: "/conserto-impressora-curitiba",
    label: "Conserto de impressora",
  },
  {
    titulo: "Configuração da rede e do Wi-Fi",
    desc: "Impressora que some da rede toda semana costuma estar num ponto de sinal fraco ou pegando endereço novo a cada reinício. Isso se resolve na configuração da rede, não trocando o aparelho.",
    to: "/servicos/redes-e-wifi",
    label: "Redes e Wi-Fi",
  },
  {
    titulo: "Avaliação mecânica em bancada",
    desc: "Atolamento repetido, ruído de engrenagem e carro travado exigem abrir o equipamento com calma. A avaliação diz o que precisa de peça e o que é limpeza, antes de qualquer aprovação.",
    to: "/quando-nao-compensa",
    label: "Quando não compensa reparar",
  },
  {
    titulo: "Coleta e devolução no endereço",
    desc: "Quando o caso não se resolve no local nem remotamente, o equipamento é retirado no endereço informado, avaliado em bancada e devolvido no mesmo endereço, sempre com valor aprovado antes.",
    to: "/coleta-e-entrega",
    label: "Como funciona a coleta",
  },
];

const FAQS = [
  {
    question: "Minha impressora aparece como offline mesmo estando ligada. O que é isso?",
    answer:
      "Na quase totalidade dos casos é rede, não defeito. A impressora recebe um endereço novo depois de uma queda de energia ou de uma troca de roteador, enquanto o computador continua procurando pelo endereço antigo. O resultado é o status offline com o aparelho perfeitamente funcional. A correção é fixar o endereço da impressora na rede e recriar a porta no computador, algo que costuma ser feito remotamente.",
  },
  {
    question: "A impressora imprime pelo celular, mas não pelo computador. Por quê?",
    answer:
      "Esse teste é a melhor notícia possível: ele prova que a impressora, a rede e a parte mecânica estão em ordem. O que falhou é a camada de software daquele computador — driver corrompido, fila travada ou impressora padrão apontando para um dispositivo virtual de PDF. Reinstalação limpa do driver resolve a maioria desses casos sem qualquer peça.",
  },
  {
    question: "Sai página em branco. Preciso trocar o cartucho?",
    answer:
      "Nem sempre, e essa é uma das trocas mais desperdiçadas que vemos. Em impressora a jato parada por semanas, o mais comum é cabeça de impressão entupida por tinta seca, e a limpeza pelo painel costuma devolver a impressão com o mesmo cartucho. Em laser, página em branco aponta para toner mal encaixado, cilindro no fim ou sensor sujo. Vale rodar a limpeza e a página de teste antes de comprar suprimento.",
  },
  {
    question: "A impressora atola papel toda vez. Isso tem conserto?",
    answer:
      "Tem, e geralmente é mecânico simples. Atolamento sempre no mesmo ponto indica rolete desgastado, sujeira acumulada no caminho da folha ou um pedaço de papel esquecido dentro do equipamento numa remoção anterior. Limpeza do trajeto e troca de rolete resolvem a maior parte. O que agrava o quadro é puxar a folha contra o sentido do mecanismo, o que costuma quebrar dentes de engrenagem.",
  },
  {
    question: "Vale a pena consertar ou é melhor comprar outra?",
    answer:
      "O critério é objetivo e mudamos a recomendação conforme o caso. Ajuste de driver, rede e limpeza compensam quase sempre, porque o custo fica muito abaixo de um aparelho novo. Já troca de cabeçote em impressora de entrada, ou peça descontinuada em modelo antigo, com frequência se aproxima do valor de uma impressora nova — e nesse cenário dizemos para não fazer, mesmo perdendo o serviço.",
  },
  {
    question: "Preciso levar a impressora até vocês?",
    answer:
      "Não. Não temos balcão de atendimento ao público. Boa parte dos casos de impressora se resolve no próprio local ou remotamente, porque a origem é driver, fila ou rede. Quando a avaliação precisa de bancada, retiramos o equipamento no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado.",
  },
  {
    question: "Qual a garantia do serviço em impressora?",
    answer:
      "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Serviço de rolete cobre rolete; ajuste de rede e driver cobre a configuração entregue. Suprimento, cartucho e toner seguem a garantia do fabricante. Atolamento causado por papel fora da gramatura recomendada ou por umidade caracteriza situação nova e é avaliado à parte.",
  },
];

const ImpressoraNaoImprime = () => {
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
      name: "Impressora não imprime: diagnóstico por camadas",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-impressora-nao-imprime-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Impressora não imprime" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Impressora não imprime: fila travada, driver, rede ou falha mecânica
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            A maior parte das impressoras que "pararam de funcionar" está intacta: o que falhou foi a fila, o driver ou o
            endereço na rede. Esta página mostra a ordem de testes que evita comprar cartucho, peça ou aparelho novo sem
            necessidade.
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
        imageKey="tecnicoTrabalhando"
        secondaryImageKey="redesWifi"
        layout="duo"
        caption="Reinstalação limpa de driver e correção da porta de impressão no computador do cliente"
        secondaryCaption="Fixação do endereço da impressora na rede para o aparelho não sumir a cada reinício"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "camadas", label: "As quatro camadas do problema" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="camadas" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Impressora falha em quatro camadas diferentes</h2>
          <p className="mb-3 text-muted-foreground">
            Documento, fila, comunicação e mecânica. O documento sai do programa, entra na fila do sistema, viaja por
            cabo ou rede até o aparelho e só então vira papel impresso. Quando alguém diz que a impressora parou, o
            trabalho técnico é descobrir em qual dessas quatro camadas o caminho se interrompeu — e três delas não têm
            nada de hardware.
          </p>
          <p className="mb-3 text-muted-foreground">
            É por isso que trocar cartucho costuma ser a primeira reação e quase nunca a solução. Página de teste pelo
            painel da própria impressora e tentativa de impressão pelo celular são dois testes gratuitos que dividem o
            problema ao meio em menos de dois minutos.
          </p>
          <p className="text-muted-foreground">
            Quando a impressora some da rede toda semana, o assunto real é o Wi-Fi da casa ou do escritório, tratado em{" "}
            <Link to="/servicos/redes-e-wifi" className="font-medium text-accent hover:underline">
              redes e Wi-Fi
            </Link>
            . Para o histórico completo de reparo do equipamento, veja{" "}
            <Link to="/conserto-impressora-curitiba" className="font-medium text-accent hover:underline">
              conserto de impressora em Curitiba
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
            Impressora doméstica usada poucas vezes por mês, rede com roteador reiniciado com frequência e computador
            recém-atualizado são os três contextos que mais aparecem nos chamados de impressão.
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
            <Printer className="h-6 w-6 text-accent" /> Testes que você pode fazer antes de acionar alguém
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os quatro primeiros itens resolvem sozinhos uma parte real dos casos, sem nenhum custo e sem
            comprar suprimento.
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
            O que não recomendamos em nenhuma hipótese: forçar o carro de impressão com a mão, lavar cabeçote com
            produtos improvisados e puxar papel preso contra o sentido do mecanismo.
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
            Valem para todo atendimento de impressora e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Limite declarado</h3>
              <p className="text-sm text-muted-foreground">
                Não indicamos troca de cabeçote quando o custo se aproxima do valor de uma impressora equivalente.
                Nesses casos dizemos para não fazer, mesmo perdendo o serviço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. Quando a avaliação exige bancada, o equipamento é retirado no
                endereço informado e devolvido no mesmo endereço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia com escopo</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado. Cartucho e toner seguem a
                garantia do fabricante.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: fechar diagnóstico apenas pelo relato no WhatsApp, garantir peça de linha
            descontinuada e sustentar resultado de recarga de suprimento feita por terceiros.
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
          <h2 className="mb-3 text-2xl font-bold">Conte o que a impressora faz ao receber o documento</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo, se ela imprime a página de teste pelo painel e se o celular consegue imprimir. Com essas
            três informações já conseguimos orientar a expectativa antes de qualquer deslocamento.
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

export default ImpressoraNaoImprime;
