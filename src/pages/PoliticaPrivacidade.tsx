import { Helmet } from "react-helmet";
import { useCanonical } from "@/lib/canonicalUrl";
import { Link } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ShieldCheck, Cookie, Database, Mail, MessageCircle, FileText } from "lucide-react";

const CANONICAL = "https://tecnico.curitiba.br/politica-de-privacidade";
const COMPANY = "Técnico Curitiba — Assistência Técnica em Informática";
const WHATSAPP = "5541997086380";
const UPDATED = "08/08/2026";

const sections: { id: string; title: string; icon: typeof ShieldCheck; body: React.ReactNode }[] = [
  {
    id: "controlador",
    title: "1. Quem somos (Controlador dos dados)",
    icon: FileText,
    body: (
      <>
        <p>
          Esta Política de Privacidade aplica-se ao site{" "}
          <strong>tecnico.curitiba.br</strong>, operado por <strong>{COMPANY}</strong>,
          com atendimento em Curitiba e Região Metropolitana – PR.
        </p>
        <p className="mt-2">
          Contato do encarregado (DPO): exclusivamente pelo WhatsApp oficial, pelo botão de
          atendimento disponível em todas as páginas deste site.
        </p>
      </>
    ),
  },
  {
    id: "dados",
    title: "2. Dados que coletamos",
    icon: Database,
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li><strong>Dados de contato:</strong> nome, telefone/WhatsApp e endereço/bairro — informados por você ao solicitar atendimento.</li>
        <li><strong>Descrição do problema:</strong> texto, fotos ou vídeos enviados para diagnóstico.</li>
        <li><strong>Dados de navegação:</strong> páginas visitadas, dispositivo, origem do tráfego e cookies (ver seção 5).</li>
        <li><strong>Dados de cobrança:</strong> apenas quando há serviço executado (nota fiscal/recibo).</li>
      </ul>
    ),
  },
  {
    id: "finalidades",
    title: "3. Para que usamos seus dados",
    icon: ShieldCheck,
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Responder solicitações de valor do atendimento e suporte pelo WhatsApp/telefone.</li>
        <li>Executar e dar garantia ao serviço técnico contratado.</li>
        <li>Emitir nota fiscal e cumprir obrigações legais/fiscais.</li>
        <li>Melhorar o site, medir desempenho de campanhas e prevenir fraude.</li>
      </ul>
    ),
  },
  {
    id: "base-legal",
    title: "4. Base legal (LGPD — Lei 13.709/2018)",
    icon: FileText,
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li><strong>Execução de contrato</strong> (art. 7º, V) — para atender o pedido de serviço.</li>
        <li><strong>Cumprimento de obrigação legal</strong> (art. 7º, II) — nota fiscal, fiscalização.</li>
        <li><strong>Legítimo interesse</strong> (art. 7º, IX) — segurança, prevenção de fraude e melhoria do serviço.</li>
        <li><strong>Consentimento</strong> (art. 7º, I) — cookies de marketing/analytics, conforme o banner.</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies e tecnologias semelhantes",
    icon: Cookie,
    body: (
      <>
        <p>
          Usamos cookies essenciais (funcionamento do site) e <strong>cookies opcionais</strong> de
          análise (Google Analytics 4) e de marketing (Google Ads), sempre respeitando sua escolha
          no banner. Por padrão, análise e publicidade ficam <strong>negadas</strong> até você
          aceitar (Google Consent Mode v2).
        </p>
        <p className="mt-2">
          Recusar os cookies opcionais mantém essas ferramentas externas sem autorização para
          armazenamento não essencial. Isso <strong>não</strong> significa ausência absoluta de
          qualquer registro técnico: o registro próprio descrito na seção 5.2 funciona de forma
          separada dos cookies opcionais.
        </p>
        <p className="mt-2">
          Você pode revogar o consentimento a qualquer momento limpando os cookies do site no seu
          navegador.
        </p>
      </>
    ),
  },
  {
    id: "telemetria-funil",
    title: "5.2. Telemetria técnica do funil de atendimento",
    icon: Database,
    body: (
      <>
        <p>
          Além das ferramentas externas, o próprio site pode registrar informações técnicas
          associadas às suas interações com o funil de atendimento (abrir o formulário, avançar
          etapas, clicar no botão de WhatsApp).
        </p>
        <p className="mt-2 font-semibold text-foreground">O que pode ser registrado</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-1">
          <li>tipo de evento e etapa do atendimento;</li>
          <li>página em que a interação aconteceu e posição do botão;</li>
          <li>categoria de serviço ou equipamento;</li>
          <li>faixa de tamanho de tela (viewport);</li>
          <li>parâmetros de campanha e origem da visita;</li>
          <li>identificador técnico da sessão.</li>
        </ul>
        <p className="mt-3 font-semibold text-foreground">Identificador de sessão</p>
        <p className="mt-1">
          Para relacionar as etapas de uma mesma visita, usamos um identificador técnico aleatório
          armazenado no <strong>sessionStorage</strong> do navegador. Ele é limitado à sessão/aba,
          é pseudônimo e não foi projetado para identificar diretamente uma pessoa entre visitas.
        </p>
        <p className="mt-3 font-semibold text-foreground">O que essa telemetria não registra</p>
        <p className="mt-1">
          A telemetria descrita nesta seção não registra endereço IP, nome, telefone, e-mail,
          endereço, CEP, coordenadas de GPS, fotos, texto livre digitado por você, user-agent nem
          técnicas de fingerprinting. Outros fluxos do site (por exemplo, o que você envia
          voluntariamente no WhatsApp) seguem as demais seções desta política.
        </p>
        <p className="mt-3 font-semibold text-foreground">Para que serve</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-1">
          <li>medir a abertura do funil de atendimento;</li>
          <li>analisar avanço e abandono por etapa;</li>
          <li>medir conversões nos canais de atendimento;</li>
          <li>identificar a origem da visita ou campanha;</li>
          <li>avaliar diferenças de experiência por contexto técnico (ex.: tamanho de tela).</li>
        </ul>
        <p className="mt-3 font-semibold text-foreground">Acesso e compartilhamento</p>
        <p className="mt-1">
          Esses registros ficam armazenados na infraestrutura utilizada pelo site e a leitura é
          restrita a usuários administrativos autorizados. Eles <strong>não</strong> são enviados
          automaticamente ao Google Analytics ou ao Google Ads — essas ferramentas têm fluxo
          próprio e seguem o mecanismo de consentimento aplicável.
        </p>
        <p className="mt-3">
          O prazo de retenção desses registros técnicos ainda está em definição pela governança
          interna e será publicado nesta política quando definido. Até lá, aplicamos o princípio da
          minimização descrito acima (sem IP e sem dados pessoais nesse fluxo).
        </p>
      </>
    ),
  },
  {
    id: "publicidade",
    title: "5.1. Publicidade de terceiros (Google AdSense)",
    icon: Cookie,
    body: (
      <>
        <p>
          Este site pode exibir anúncios fornecidos por terceiros. O <strong>Google</strong>, como
          fornecedor terceirizado, utiliza cookies para exibir anúncios neste site. O uso do cookie
          DART pelo Google permite veicular anúncios com base em visitas anteriores a este e a
          outros sites da internet.
        </p>
        <p className="mt-2">
          Você pode desativar a publicidade personalizada nas{" "}
          <a
            className="text-accent underline"
            href="https://www.google.com/settings/ads"
            rel="noopener nofollow"
            target="_blank"
          >
            Configurações de anúncios do Google
          </a>{" "}
          ou optar por sair do uso de cookies de fornecedores terceirizados em{" "}
          <a
            className="text-accent underline"
            href="https://www.aboutads.info/choices/"
            rel="noopener nofollow"
            target="_blank"
          >
            aboutads.info/choices
          </a>
          . Fornecedores terceirizados e redes de anúncios que veiculam anúncios neste site também
          podem usar cookies próprios, sobre os quais não temos controle direto.
        </p>
        <p className="mt-2">
          O arquivo <strong>ads.txt</strong> deste domínio declara os vendedores autorizados a
          comercializar o inventário publicitário de tecnico.curitiba.br.
        </p>
      </>
    ),
  },
  {
    id: "compartilhamento",
    title: "6. Com quem compartilhamos",
    icon: Database,
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li><strong>WhatsApp/Meta</strong> — para a conversa de atendimento.</li>
        <li><strong>Google (Analytics, Ads e AdSense)</strong> — métricas, otimização e exibição de anúncios.</li>
        <li><strong>Provedor de hospedagem</strong> — armazenamento técnico do site.</li>
        <li>Não vendemos seus dados a terceiros.</li>
      </ul>
    ),
  },
  {
    id: "retencao",
    title: "7. Por quanto tempo guardamos",
    icon: Database,
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Conversas de WhatsApp e fotos: até 12 meses após o último contato.</li>
        <li>Dados fiscais (NF): pelo prazo legal (mínimo 5 anos).</li>
        <li>Dados de navegação anonimizados (GA4): conforme política do Google, padrão 14 meses.</li>
        <li>
          Telemetria técnica do funil (seção 5.2): prazo em definição pela governança interna —
          nenhum período foi fixado até esta atualização.
        </li>
      </ul>
    ),
  },
  {
    id: "direitos",
    title: "8. Seus direitos (LGPD)",
    icon: ShieldCheck,
    body: (
      <>
        <p>Você pode, a qualquer momento, solicitar:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Confirmação da existência de tratamento.</li>
          <li>Acesso, correção ou exclusão dos seus dados.</li>
          <li>Portabilidade e revogação do consentimento.</li>
          <li>Informações sobre compartilhamento.</li>
        </ul>
        <p className="mt-2">
          Para exercer, envie o pedido pelo WhatsApp oficial, no botão de atendimento deste site.
          Respondemos em até 15 dias.
        </p>
      </>
    ),
  },
  {
    id: "seguranca",
    title: "9. Segurança",
    icon: ShieldCheck,
    body: (
      <p>
        Aplicamos medidas técnicas e administrativas razoáveis para proteger seus dados
        (HTTPS, controle de acesso, backups). Nenhum sistema é 100% imune; comunique imediatamente
        qualquer suspeita pelo WhatsApp oficial.
      </p>
    ),
  },
  {
    id: "contato",
    title: "10. Como falar com a gente",
    icon: Mail,
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>WhatsApp: <a className="text-accent underline" href={`https://wa.me/${WHATSAPP}`} data-cta-location="privacy_contact_whatsapp">Solicitar atendimento pelo WhatsApp</a></li>
        <li>Endereço: Curitiba e Região Metropolitana – PR</li>
      </ul>
    ),
  },
];

const faqs = [
  {
    q: "Quais dados pessoais o site coleta?",
    a: "Nome, telefone/WhatsApp, bairro e a descrição do problema — sempre informados por você ao solicitar atendimento. Dados de navegação são tratados conforme a Política de Cookies e Anúncios.",
  },
  {
    q: "Preciso aceitar cookies para ser atendido?",
    a: "Não. Recusar cookies de análise e anúncios não impede o atendimento nem o uso do site.",
  },
  {
    q: "Se eu recusar os cookies opcionais, o site deixa de registrar qualquer coisa?",
    a: "Não. As ferramentas externas (Google Analytics e Google Ads) ficam sem autorização para armazenamento não essencial, mas o site continua registrando dados técnicos mínimos das etapas do funil de atendimento — sem IP, nome, telefone ou texto livre. Veja a seção 5.2 desta política.",
  },
  {
    q: "Como solicito exclusão dos meus dados?",
    a: "Envie o pedido pelo WhatsApp oficial do site. Respondemos em até 15 dias, conforme a LGPD.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://tecnico.curitiba.br/" },
    { "@type": "ListItem", position: 2, name: "Política de Privacidade", item: CANONICAL },
  ],
};

const PoliticaPrivacidade = () => {
  useCanonical(CANONICAL);

  return (
    <>
      <Helmet>
        <title>Política de Privacidade | Técnico Curitiba</title>
        <meta
          name="description"
          content="Política de Privacidade e LGPD do Técnico Curitiba: como coletamos, usamos e protegemos seus dados, cookies, GA4, Google Ads e seus direitos."
        />
        <meta property="og:title" content="Política de Privacidade | Técnico Curitiba" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      <main className="bg-background">
        <PageHero
          title="Política de Privacidade"
          subtitle={`LGPD · Como tratamos seus dados pessoais. Atualizada em ${UPDATED}.`}
        />

        <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
          <nav aria-label="Sumário" className="mb-10 rounded-2xl border border-border bg-muted/30 p-5">
            <p className="text-sm font-bold text-foreground mb-3">Sumário</p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 text-sm text-muted-foreground list-decimal pl-5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-accent underline-offset-2 hover:underline">
                    {s.title.replace(/^\d+\.\s*/, "")}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map(({ id, title, icon: Icon, body }) => (
            <section key={id} id={id} className="mb-10 scroll-mt-24">
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
                <Icon className="h-5 w-5 text-accent" />
                {title}
              </h2>
              <div className="text-foreground/85 leading-relaxed text-[15px]">{body}</div>
            </section>
          ))}

          <section id="faq" className="mb-10 scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              11. Perguntas frequentes
            </h2>
            <div className="space-y-4 text-foreground/85 leading-relaxed text-[15px]">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-bold text-foreground">{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-foreground/85 text-[15px]">
              Detalhes sobre cookies, Consent Mode e anúncios estão na{" "}
              <Link to="/politica-de-cookies-e-anuncios" className="text-accent underline">
                Política de Cookies e Anúncios
              </Link>
              .
            </p>
          </section>

          <div className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
            <p className="text-foreground font-semibold mb-3">
              Tem dúvida sobre seus dados ou quer falar com a gente?
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre a Política de Privacidade do site.")}`}
              target="_blank"
              rel="noopener nofollow"
              data-cta-location="privacidade_footer"
              data-wa-medium="privacidade"
              className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--whatsapp))] px-5 py-3 font-bold text-primary-foreground shadow-md hover:bg-[hsl(var(--whatsapp-hover))] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              Veja também os <Link to="/termos-e-condicoes" className="text-accent underline">Termos e Condições</Link>.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default PoliticaPrivacidade;
