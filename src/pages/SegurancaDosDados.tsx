import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { AlertTriangle, ArrowRight, CheckCircle2, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialContentLinks } from "@/components/editorial/EditorialContentLinks";
import { Button } from "@/components/ui/button";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { Blocos3U } from "@/components/servico/Blocos3U";
import { blocos3U } from "@/lib/blocos3u";
import { TrustStrip } from "@/components/TrustStrip";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const PATH = "/seguranca-dos-dados";
const TITLE = "Segurança dos Dados na Assistência Técnica | Curitiba";
const DESCRIPTION =
  "Como arquivos, senhas e acessos são tratados durante a assistência técnica em Curitiba: autorização, acesso mínimo, backup prévio, cópias temporárias, limites e responsabilidades.";

const WA_MESSAGE =
  "Olá! Vim da página de segurança dos dados e quero tirar uma dúvida antes do atendimento.";

const PRINCIPIOS = [
  {
    titulo: "Acesso mínimo necessário",
    desc: "O técnico acessa apenas o que o serviço exige. Uma formatação precisa localizar as pastas de dados para copiar; um ajuste de rede não precisa abrir documento nenhum. O escopo do acesso segue o escopo do serviço.",
  },
  {
    titulo: "Autorização antes de qualquer intervenção",
    desc: "Nada é executado sem a sua aprovação: nem formatação, nem exclusão, nem instalação, nem acesso remoto. Quando a etapa envolve risco para os arquivos, esse risco é dito antes, não depois.",
  },
  {
    titulo: "Transparência sobre o risco",
    desc: "Nenhuma intervenção em equipamento ou armazenamento é totalmente livre de risco para os dados. Discos já em falha podem piorar durante a leitura, e sistemas corrompidos podem impedir a cópia de parte do conteúdo.",
  },
  {
    titulo: "Backup é responsabilidade compartilhada",
    desc: "Sempre que possível, o cliente deve manter uma cópia atualizada dos arquivos antes do atendimento. Fazemos a cópia prévia quando o armazenamento permite leitura, mas ela não substitui o seu backup próprio.",
  },
];

const REMOTO = [
  "O acesso remoto só acontece com a sua autorização explícita e enquanto você acompanha a tela.",
  "O programa de acesso deve vir sempre de fonte legítima, indicada no momento do atendimento.",
  "A sessão é encerrada ao final do serviço; se o programa não for mais necessário, orientamos a remoção.",
  "Durante a sessão, arquivos e configurações podem precisar ser abertos para executar o serviço — não afirmamos que nada será visualizado quando o próprio trabalho exige acesso.",
  "Nenhuma solicitação financeira é feita dentro de uma sessão remota.",
];

const FAQS = [
  {
    question: "O técnico precisa acessar meus arquivos?",
    answer:
      "Depende do serviço. Backup, formatação e recuperação de dados exigem localizar e manipular pastas de arquivos. Ajuste de rede, instalação de programa ou configuração de impressora normalmente não exigem. O acesso é sempre limitado ao necessário para executar o que foi combinado.",
  },
  {
    question: "Preciso informar minhas senhas?",
    answer:
      "Apenas a senha do próprio equipamento ou da conta local, quando o serviço não puder ser executado sem ela. Senhas de banco, códigos de autenticação em duas etapas e credenciais sensíveis não devem ser enviados por mensagem nem informados durante o atendimento.",
  },
  {
    question: "Meus arquivos podem ser apagados?",
    answer:
      "Procedimentos como formatação apagam o conteúdo do disco por definição, e por isso a cópia prévia é feita antes, com a sua autorização. Em discos já com falha, parte do conteúdo pode não ser legível. Nenhuma intervenção é totalmente livre de risco para os dados.",
  },
  {
    question: "É obrigatório fazer backup antes do atendimento?",
    answer:
      "Não é uma exigência formal, mas é a recomendação técnica. Sempre que possível, mantenha uma cópia atualizada dos arquivos importantes antes de entregar ou liberar o equipamento. A cópia que fazemos durante o serviço depende do estado do armazenamento.",
  },
  {
    question: "Como funciona o acesso remoto?",
    answer:
      "Com programa de fonte legítima, autorização explícita e você acompanhando a sessão na tela do próprio computador. O acesso é encerrado ao final do atendimento e nenhuma solicitação financeira é feita durante a sessão.",
  },
  {
    question: "Arquivos recuperados ficam armazenados com vocês?",
    answer:
      "Cópias temporárias criadas durante o serviço existem apenas pelo tempo necessário para a entrega e a conferência do resultado. Depois da validação com você, essas cópias são descartadas, salvo combinação diferente registrada no atendimento.",
  },
  {
    question: "O serviço garante que não haverá perda de dados?",
    answer:
      "Não. Nenhum serviço técnico honesto pode prometer proteção absoluta ou ausência total de risco. O que garantimos é o cuidado no procedimento, a informação antecipada sobre o risco de cada etapa e a decisão sempre nas suas mãos.",
  },
  {
    question: "O técnico precisa conhecer minha senha?",
    answer:
      "Somente quando o serviço não pode ser executado sem a senha do próprio equipamento ou da conta local, informada no momento do atendimento e alterável depois. Senhas bancárias, códigos de autenticação e credenciais de sistemas de terceiros não devem ser enviados por mensagem. Solicitamos apenas o acesso necessário, explicamos o procedimento, encerramos a sessão ao final e não guardamos credenciais depois do atendimento.",
  },
  {
    question: "Quem deve resolver problemas em sistemas de terceiros?",
    answer:
      "O fornecedor que mantém a plataforma. O acesso ao computador não garante acesso ou correção de sistemas mantidos por terceiros: licença, disponibilidade, servidor, correção de erro interno, atualização, recuperação de conta e regras de autenticação pertencem a quem opera o sistema. Verificamos a máquina, validamos a conectividade, registramos o erro por escrito e orientamos o contato com o fornecedor responsável.",
  },
  {
    question: "Como são tratados dados de empresas?",
    answer:
      "Com o mesmo princípio de acesso mínimo, acrescido da definição de quem autoriza o quê. Em ambiente corporativo, alterações em contas, políticas e sistemas dependem da autorização de quem responde pela empresa, e não do usuário do equipamento.",
  },
];

const RELACIONADOS = [
  { label: "Preços, garantia e políticas", to: "/precos-e-politicas", desc: "Regras comerciais, garantia e responsabilidades formais do atendimento." },
  { label: "Formatação de computador", to: "/servicos/formatacao", desc: "Como a cópia prévia e a restauração dos arquivos acontecem na prática." },
  { label: "Recuperação de dados", to: "/servicos/recuperacao-de-dados", desc: "Tentativa após a perda: avaliação primeiro, sem resultado assegurado." },
  { label: "Backup para empresas", to: "/servicos/backup-para-empresas", desc: "Prevenção estruturada: cópia local, cópia externa e restauração testada." },
  { label: "Atendimento remoto", to: "/atendimento-remoto", desc: "Como a sessão remota começa, é acompanhada e é encerrada." },
  { label: "Suporte técnico empresarial", to: "/servicos/suporte-tecnico-empresarial", desc: "Escopo do suporte na empresa e limites de sistemas de terceiros." },
  { label: "Empresa de TI em Curitiba", to: "/empresa-de-ti-curitiba", desc: "Diagnóstico do ambiente, contextos atendidos e organização do suporte." },
  { label: "Montagem de PC e workstation", to: "/servicos/montagem-de-pc", desc: "Dimensionamento de estação profissional e política de peças." },
];


const SegurancaDosDados = () => {
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
      name: "Segurança dos dados durante a assistência técnica",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `seguranca-dos-dados-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Segurança dos dados", path: PATH },
        ]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Segurança dos dados" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark md:mb-3 md:text-sm">
            Confiança · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.6rem] font-bold leading-tight md:mb-4 md:text-4xl">
            Segurança dos dados durante a assistência técnica
          </h1>
          <p className="mb-5 text-sm leading-relaxed opacity-95 md:mb-6 md:text-base">
            Entregar um computador para manutenção significa entregar também o que existe dentro dele: documentos,
            fotos, contratos, e-mails e acessos. Esta página explica, sem promessa mágica, como tratamos arquivos,
            senhas e credenciais em cada tipo de serviço, o que depende de autorização sua, o que é feito para reduzir
            risco e — principalmente — quais são os limites técnicos que ninguém honesto pode ignorar.
          </p>
          <Button asChild size="lg" className="min-h-14 w-full sm:w-auto">
            <a href={waHref} onClick={cta("hero")} data-cta-location="seguranca_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Tirar dúvida antes do atendimento
            </a>
          </Button>
        </div>
      </section>

      <TrustStrip variant="compact" />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-10"
          items={[
            ...(blocos3U(PATH)?.tocExtra ?? []),
            { id: "acesso-minimo", label: "Compromisso de acesso mínimo" },
            { id: "autorizacao", label: "Autorização do cliente" },
            { id: "acesso-remoto", label: "Acesso remoto" },
            { id: "limites", label: "Risco de perda e limites técnicos" },
            { id: "terceiros", label: "Sistemas de terceiros" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        {/* Rodada 3U — pilares, matriz de responsabilidades, credenciais e
            diferenciação entre backup, sincronização, nuvem e recuperação. */}
        <Blocos3U path={PATH} />
        <section id="acesso-minimo" className="mb-12 scroll-mt-24">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Compromisso de acesso mínimo</h2>
          <p className="mb-3 text-muted-foreground">
            O princípio que organiza tudo aqui é simples: o acesso acompanha o serviço, nunca o contrário. Se o
            atendimento é uma configuração de rede, não há motivo para abrir pastas pessoais. Se o serviço é uma
            formatação com cópia dos arquivos, a manipulação das pastas de dados é parte inevitável do trabalho — e é
            explicada antes de começar.
          </p>
          <p className="mb-6 text-muted-foreground">
            Essa distinção importa porque promessas absolutas costumam ser falsas. Dizer que "nenhum arquivo será
            visualizado" em um serviço que exige localizar e copiar arquivos seria conveniente, mas não seria verdade.
            Preferimos descrever o que realmente acontece e deixar a decisão com você.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {PRINCIPIOS.map((p) => (
              <div key={p.titulo} className="rounded-xl border border-border bg-card p-5">
                <ShieldCheck className="mb-3 h-6 w-6 text-accent" />
                <h3 className="mb-2 font-semibold text-foreground">{p.titulo}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="autorizacao" className="mb-12 scroll-mt-24">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Autorização: nada acontece por conta própria</h2>
          <p className="mb-3 text-muted-foreground">
            Todo atendimento segue a mesma ordem: diagnóstico, explicação do que foi encontrado, valor do serviço e
            somente então execução. Etapas que alteram o conteúdo do equipamento — formatar, reinstalar sistema, apagar
            partição, trocar armazenamento, remover programas — dependem da sua autorização registrada na conversa da
            triagem.
          </p>
          <p className="text-muted-foreground">
            Em equipamentos de empresa, a autorização vem de quem responde pela organização. O usuário da máquina pode
            solicitar o atendimento, mas alterações em contas, políticas internas e sistemas corporativos exigem o aval
            de quem administra o ambiente. As condições formais estão descritas em{" "}
            <Link to="/precos-e-politicas" className="font-semibold text-accent hover:underline">
              preços e políticas
            </Link>
            .
          </p>
        </section>

        <section id="backup" className="mb-12 scroll-mt-24">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Backup antes do atendimento</h2>
          <p className="mb-3 text-muted-foreground">
            Sempre que possível, mantenha uma cópia atualizada dos seus arquivos antes de qualquer serviço técnico.
            Essa recomendação vale mesmo quando a cópia prévia faz parte do procedimento: se o armazenamento já estiver
            em falha, parte do conteúdo pode não ser legível no momento da cópia, e não há técnica que devolva o que o
            disco não consegue mais entregar.
          </p>
          <p className="mb-3 text-muted-foreground">
            Uma cópia útil segue três regras práticas: estar fora do computador de origem, ter sido feita recentemente
            e já ter sido aberta ao menos uma vez para conferir que os arquivos abrem de verdade. Backup que ninguém
            testou é apenas uma expectativa.
          </p>
          <p className="text-muted-foreground">
            Para empresas, a estruturação dessa rotina é tratada em{" "}
            <Link to="/servicos/backup-para-empresas" className="font-semibold text-accent hover:underline">
              backup para empresas
            </Link>
            . Quando o arquivo já foi perdido, o caminho é a{" "}
            <Link to="/servicos/recuperacao-de-dados" className="font-semibold text-accent hover:underline">
              recuperação de dados
            </Link>
            , que é sempre uma tentativa dependente do estado da mídia.
          </p>
        </section>

        {/* Passo a passo: antes, durante e depois */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Passo a passo: antes, durante e depois do atendimento
          </h2>
          <p className="mb-6 text-muted-foreground">
            A sequência abaixo vale para qualquer modalidade — remoto, domicílio ou coleta. Ela existe para que
            você saiba, em cada etapa, o que está sendo acessado, o que depende da sua autorização e o que
            acontece com as cópias feitas durante o serviço.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                fase: "Antes",
                itens: [
                  "Triagem descreve o problema e define a modalidade adequada",
                  "Orientação para separar e copiar arquivos importantes, quando houver tempo hábil",
                  "Você informa se existe conteúdo sensível no equipamento",
                  "Diagnóstico e valor do serviço apresentados antes da execução",
                  "Autorização registrada na conversa para etapas que alteram o conteúdo",
                ],
              },
              {
                fase: "Durante",
                itens: [
                  "Acesso limitado ao necessário para executar o que foi combinado",
                  "Sessão remota só com sua liberação e acompanhamento na tela",
                  "Nenhum pedido de senha bancária, código de autenticação ou dado de pagamento",
                  "Mudança de escopo é comunicada e reautorizada antes de continuar",
                  "Cópias temporárias apenas quando o serviço exige, nunca por padrão",
                ],
              },
              {
                fase: "Depois",
                itens: [
                  "Conferência do resultado com você antes de encerrar",
                  "Acesso remoto encerrado e orientação para remover o programa se não for mais usado",
                  "Cópias temporárias descartadas após a validação da entrega",
                  "Orientação de rotina de cópia para reduzir risco em serviços futuros",
                  "Registro do que foi executado permanece na conversa da triagem",
                ],
              },
            ].map((etapa, i) => (
              <div key={etapa.fase} className="rounded-xl border border-border bg-secondary p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{etapa.fase}</h3>
                </div>
                <ul className="space-y-2">
                  {etapa.itens.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="acesso-remoto" className="mb-12 scroll-mt-24">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <Lock className="h-6 w-6 text-accent" /> Atendimento remoto e privacidade
          </h2>
          <ul className="mb-4 space-y-2">
            {REMOTO.map((s) => (
              <li key={s} className="flex gap-2 text-muted-foreground">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/atendimento-remoto"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Ver como funciona o atendimento remoto <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Formatação, recuperação e cópias temporárias</h2>
          <p className="mb-3 text-muted-foreground">
            Na{" "}
            <Link to="/servicos/formatacao" className="font-semibold text-accent hover:underline">
              formatação
            </Link>
            , a sequência é sempre a mesma: localizar os dados, copiar o que for possível, confirmar com você o que foi
            copiado, reinstalar o sistema e devolver os arquivos. O que estiver fora das pastas indicadas por você pode
            passar despercebido — por isso a conferência da lista antes de formatar é uma etapa, não uma formalidade.
          </p>
          <p className="mb-3 text-muted-foreground">
            Na recuperação de dados, o material lido é gravado em uma área temporária até a entrega. Essa cópia
            temporária existe pelo tempo necessário para você conferir o resultado e recebê-la; depois da validação,
            ela é descartada, salvo combinação diferente registrada no atendimento.
          </p>
          <p className="text-muted-foreground">
            Em equipamentos empresariais, o mesmo cuidado se aplica com um detalhe a mais: a entrega dos arquivos é
            feita para a pessoa autorizada pela empresa, e não necessariamente para quem usava a máquina.
          </p>
        </section>

        <section id="limites" className="mb-12 scroll-mt-24 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <AlertTriangle className="h-6 w-6 text-destructive" /> Limites técnicos que precisam ser ditos
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Nenhuma intervenção em equipamento ou armazenamento é totalmente livre de risco para os dados.</li>
            <li>• Disco com falha mecânica ou eletrônica pode piorar durante a própria tentativa de leitura.</li>
            <li>• Conteúdo criptografado sem a chave correta não é acessível por caminho legítimo.</li>
            <li>• Equipamento bloqueado por conta do fabricante depende do titular da conta, não do técnico.</li>
            <li>• Não somos empresa de cibersegurança, perícia digital ou auditoria de conformidade.</li>
            <li>• Não existe garantia contra vazamento, invasão ou perda causada por fatores fora do atendimento.</li>
          </ul>
        </section>

        <section id="terceiros" className="mb-12 scroll-mt-24">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Sistemas, credenciais e acessos de terceiros</h2>
          <p className="mb-3 text-muted-foreground">
            Boa parte dos incidentes de empresa envolve algo que não está dentro do computador:
            um sistema contratado, um certificado, um e-mail corporativo, um provedor ou um
            fornecedor de software. Nesses casos, a responsabilidade se divide em três — e a
            divisão precisa estar clara antes do atendimento começar.
          </p>
          <p className="mb-3 text-muted-foreground">
            <strong className="text-foreground">
              O acesso ao computador não garante acesso ou correção de sistemas mantidos por
              terceiros.
            </strong>{" "}
            Quando o problema pertence ao sistema externo, pode ser necessário acionar o fornecedor
            responsável.
          </p>
          <p className="text-sm text-muted-foreground">
            O que o suporte pode executar dentro do ambiente da empresa — e o que depende do
            fornecedor — está descrito em{" "}
            <Link
              to="/servicos/suporte-tecnico-empresarial"
              className="font-semibold text-accent hover:underline"
            >
              suporte técnico empresarial
            </Link>
            .
          </p>
        </section>

        <section id="faq" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Perguntas frequentes sobre segurança dos dados</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{f.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Políticas e serviços relacionados</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {RELACIONADOS.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
              >
                <span className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
                  {r.label} <ArrowRight className="h-4 w-4 text-accent" />
                </span>
                <span className="text-sm text-muted-foreground">{r.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        <EditorialContentLinks path={PATH} />

        <section className="rounded-xl bg-secondary p-6 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground">Ficou com alguma dúvida antes de entregar o equipamento?</h2>
          <p className="mx-auto mb-5 max-w-2xl text-muted-foreground">
            Descreva o caso pela triagem no WhatsApp. Explicamos o que o serviço exige em termos de acesso, o que
            precisa de autorização e o que você pode preparar antes do atendimento.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="seguranca_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar com o técnico
            </a>
          </Button>
        </section>
      </main>

      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default SegurancaDosDados;
