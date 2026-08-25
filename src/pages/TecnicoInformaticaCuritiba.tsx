import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import {
  MapPin,
  MessageCircle,
  Laptop,
  Wrench,
  Home,
  Truck,
  MonitorSmartphone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { FastHeader } from "@/components/FastHeader";
import { Footer } from "@/components/Footer";
import { PilarEditorialLinks } from "@/components/editorial/PilarEditorialLinks";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ServicosCorrelatos } from "@/components/informatica/ServicosCorrelatos";

import { EeatProofsSection } from "@/components/EeatProofsSection";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { siteConfig, whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { REGIOES_COBERTURA } from "@/lib/bairrosBaseline";

/**
 * Página dominante para a intenção "técnico de informática em Curitiba".
 * Conteúdo editorial PRÓPRIO — não reutiliza o template genérico de cidade
 * (CidadeLandingLayout), que continua servindo as demais cidades da RMC.
 */

const PATH = "/tecnico-informatica-curitiba";
const TITLE = "Técnico de Informática em Curitiba | PC e Notebook";
const DESCRIPTION =
  "Técnico de informática em Curitiba para computador e notebook: diagnóstico, manutenção, formatação, SSD, recuperação de dados, redes e suporte remoto ou no endereço.";

const CTA_CLASS =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-bold text-accent-foreground shadow-[0_14px_34px_-10px_hsl(var(--accent)/0.6)] transition-transform hover:scale-[1.02]";

const WA_MESSAGE =
  "Olá! Preciso de um técnico de informática em Curitiba. Posso descrever o problema do meu equipamento?";

const PROBLEMAS = [
  {
    titulo: "Computador lento ou travando",
    texto:
      "Lentidão costuma somar disco saturado, programas iniciando junto com o sistema, pouca memória e, em máquinas antigas, desgaste térmico. O diagnóstico separa o que é software do que é limitação de hardware antes de qualquer serviço.",
    href: "/servicos/manutencao-de-computador",
    anchor: "manutenção de computador",
  },
  {
    titulo: "Notebook que não liga ou fica sem vídeo",
    texto:
      "Equipamento que não dá sinal, liga e apaga ou acende sem imagem exige teste de fonte, bateria, memória e placa. Esse tipo de verificação normalmente não termina em uma visita: costuma seguir para bancada.",
    href: "/servicos/manutencao-de-notebook",
    anchor: "manutenção de notebook",
  },
  {
    titulo: "Aquecimento e desligamento repentino",
    texto:
      "Superaquecimento aparece como ventoinha acelerada, queda de desempenho em jogos ou vídeo e desligamentos sem aviso. A limpeza interna e a troca de pasta térmica resolvem parte dos casos; outros indicam falha elétrica.",
    href: "/servicos/manutencao-de-computador",
    anchor: "limpeza e revisão interna",
  },
  {
    titulo: "Tela azul e erros do sistema",
    texto:
      "Telas azuis recorrentes apontam driver incompatível, memória com defeito ou disco em degradação. Antes de formatar, vale testar os componentes — formatar um disco que já está falhando só adia o problema.",
    href: "/servicos/formatacao",
    anchor: "formatação com backup",
  },
  {
    titulo: "Vírus, sequestro de navegador e anúncios",
    texto:
      "Extensões maliciosas, mineradores e adwares consomem processamento e expõem dados. A remoção inclui checagem de inicialização, navegadores e tarefas agendadas, não apenas um antivírus rodando uma vez.",
    href: "/servicos/remocao-de-virus",
    anchor: "remoção de vírus",
  },
  {
    titulo: "Arquivos sumidos ou disco não reconhecido",
    texto:
      "Quando o disco some da BIOS, faz ruído ou some com as pastas, cada nova tentativa de uso pode reduzir a chance de leitura. Nesses casos o equipamento deve ser desligado e avaliado, sem improviso.",
    href: "/servicos/recuperacao-de-dados",
    anchor: "recuperação de dados",
  },
];

const EQUIPAMENTOS = [
  "Desktops de uso doméstico e de escritório",
  "Notebooks e ultrabooks de uso pessoal ou profissional",
  "Computadores usados em home office e pequenos negócios",
  "Máquinas com disco mecânico que serão migradas para SSD",
  "Estações usadas para estudo, edição, planilhas e sistemas de gestão",
  "Roteadores e pontos de rede ligados ao computador atendido",
];

const SERVICOS_PRIORITARIOS = [
  { nome: "Manutenção de computador", href: "/servicos/manutencao-de-computador" },
  { nome: "Formatação com backup", href: "/servicos/formatacao" },
  { nome: "Upgrade de SSD e memória RAM", href: "/servicos/upgrade-ssd-ram" },
  { nome: "Recuperação de dados", href: "/servicos/recuperacao-de-dados" },
  { nome: "Remoção de vírus", href: "/servicos/remocao-de-virus" },
  { nome: "Redes e Wi-Fi", href: "/servicos/redes-e-wifi" },
];

const MODALIDADES = [
  {
    icon: Home,
    titulo: "Atendimento no seu endereço",
    texto:
      "Indicado quando o problema pode ser avaliado com o equipamento no lugar: configuração, rede, impressora, sistema e ajustes de uso.",
    href: "/atendimento-domicilio",
    linkLabel: "Ver como funciona o atendimento em domicílio",
  },
  {
    icon: MonitorSmartphone,
    titulo: "Suporte remoto",
    texto:
      "Para o que depende de acesso ao sistema e não de intervenção física — programas, contas, configurações e orientação de uso.",
    href: "/atendimento-remoto",
    linkLabel: "Ver suporte remoto",
  },
  {
    icon: Truck,
    titulo: "Coleta e bancada",
    texto:
      "Quando o caso exige desmontagem, teste prolongado, troca de peça ou laboratório, o equipamento é retirado e avaliado fora do endereço.",
    href: "/coleta-e-entrega",
    linkLabel: "Ver coleta e entrega",
  },
];

const PASSOS = [
  "Você descreve o equipamento e o sintoma pela triagem, sem precisar de termos técnicos.",
  "A triagem indica a modalidade compatível: no endereço, remoto ou coleta.",
  "O diagnóstico identifica a causa provável e o que precisa ser feito.",
  "O valor do atendimento é apresentado antes da execução; peças só entram com aprovação.",
  "Depois do serviço, você recebe a orientação do que foi alterado e do que observar.",
];

const NO_ENDERECO_SIM = [
  "Configuração de sistema, contas, programas e impressora",
  "Ajustes de rede local, roteador e sinal de Wi-Fi no ambiente",
  "Verificação inicial de lentidão e comportamento do equipamento",
  "Orientação de uso, organização de arquivos e rotina de backup",
];

const NO_ENDERECO_NAO = [
  "Equipamento que não liga ou não apresenta vídeo",
  "Reparo em placa, conector de energia ou dano por líquido",
  "Troca de tela, dobradiça e desmontagem completa de notebook",
  "Leitura de disco com falha, que exige tempo e ambiente controlado",
];

const VALORES = [
  "Tipo de equipamento e facilidade de acesso interno",
  "Se o problema é de software, de hardware ou os dois somados",
  "Necessidade de peça e disponibilidade dela no mercado",
  "Volume de dados envolvido em backup ou migração",
  "Modalidade escolhida — no endereço, remoto ou bancada",
  "Tempo de teste necessário para confirmar a causa",
];

const PERFIS = [
  {
    titulo: "Uso residencial",
    texto:
      "Máquinas de estudo, entretenimento e tarefas do dia a dia, normalmente com lentidão acumulada, falta de espaço em disco e ausência de backup.",
  },
  {
    titulo: "Home office",
    texto:
      "Quem depende do equipamento para trabalhar precisa de previsibilidade: o foco é reduzir o tempo parado e planejar o serviço junto com a agenda.",
  },
  {
    titulo: "Pequenos negócios",
    texto:
      "Comércios e escritórios com poucas máquinas, uma impressora compartilhada e rede improvisada. O atendimento é pontual e pode evoluir para avaliação empresarial em /empresa-de-ti-curitiba.",
  },
];

const FAQS = [
  {
    question: "Que tipos de equipamento são atendidos em Curitiba?",
    answer:
      "Desktops e notebooks de uso residencial, home office e pequenos negócios, além dos itens de rede ligados a eles, como roteador e pontos de Wi-Fi. Equipamentos muito antigos são avaliados, mas nem sempre o reparo compensa diante do custo da peça.",
  },
  {
    question: "O atendimento acontece na minha casa ou o equipamento precisa sair?",
    answer:
      "Depende do sintoma. Configuração, rede, sistema e verificações iniciais costumam ser feitas no endereço. Casos que exigem desmontagem, teste longo ou troca de peça normalmente seguem para bancada, com coleta agendada.",
  },
  {
    question: "Como é feito o diagnóstico?",
    answer:
      "A triagem por WhatsApp levanta equipamento, sintoma e contexto de uso. O diagnóstico técnico confirma a causa provável testando os componentes envolvidos. Só depois disso o valor do atendimento é apresentado, com o que pode e o que não pode ser resolvido.",
  },
  {
    question: "As peças estão incluídas no valor do atendimento?",
    answer:
      "Não. Peças e materiais são informados à parte e só são adquiridos após sua aprovação. O atendimento inicial cobre o deslocamento e a avaliação técnica conforme a política vigente.",
  },
  {
    question: "É possível recuperar arquivos de um disco com problema?",
    answer:
      "Em parte dos casos sim, mas não existe garantia prévia. A chance depende do tipo de falha e do quanto o disco foi usado depois do problema aparecer. O procedimento correto é desligar o equipamento e encaminhar para avaliação.",
  },
  {
    question: "O atendimento cobre empresas?",
    answer:
      "Atendimentos pontuais de pequenos negócios são feitos por esta página. Necessidades mais amplas — vários usuários, rede estruturada ou avaliação de suporte recorrente — são tratadas na página empresarial.",
  },
];

const TecnicoInformaticaCuritiba = () => {
  const waHref = whatsappLink(WA_MESSAGE);

  useEffect(() => {
    trackPageView(PATH, "Técnico de Informática em Curitiba");
  }, []);

  const handleCta = (location: string) => trackCTAClick("whatsapp", location);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(PATH)}#service`,
    name: "Técnico de informática em Curitiba",
    serviceType: "Assistência técnica de computadores e notebooks",
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    provider: { "@id": `${siteConfig.baseUrl}/#organization` },
    areaServed: { "@type": "City", name: "Curitiba" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(PATH)}#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  useJsonLdSlot(SCHEMA_SLOTS.service, serviceSchema, SLOT_PRIORITY.page);
  useJsonLdSlot(SCHEMA_SLOTS.faq, faqSchema, SLOT_PRIORITY.page);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Técnico de Informática em Curitiba", path: PATH },
        ]}
      />
      <LocalBusinessJsonLd path={PATH} description={DESCRIPTION} />

      <FastHeader />
      <main className="pt-[var(--site-header-height)]">
        <Breadcrumbs items={[{ label: "Técnico de Informática em Curitiba" }]} />

        {/* 1. Hero local próprio */}
        <section className="border-b border-border/60 bg-secondary/40">
          <div className="container mx-auto py-12 md:py-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                <MapPin className="h-4 w-4" />
                Curitiba e região metropolitana
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">
                Técnico de informática em Curitiba para{" "}
                <span className="text-accent">computador e notebook</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                Diagnóstico técnico, manutenção, formatação, upgrade de SSD, recuperação de dados,
                redes e suporte — com atendimento no seu endereço, remoto ou em bancada, conforme o
                que o problema realmente exige.
              </p>
              <div className="mt-8">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-location="tecnico_curitiba_hero"
                  data-wa-source="whatsapp_cta"
                  onClick={() => handleCta("tecnico_curitiba_hero")}
                  className={CTA_CLASS}
                >
                  <MessageCircle className="h-5 w-5" />
                  Descrever meu problema
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Introdução específica */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-3xl space-y-4 text-muted-foreground">
            <p>
              Chamar um técnico de informática em Curitiba costuma começar com um sintoma vago: a
              máquina ficou lenta, o notebook não liga, a internet cai só naquele cômodo ou os
              arquivos sumiram. Antes de falar em preço, o passo útil é separar o que é software, o
              que é hardware e o que é limitação de um equipamento que já cumpriu seu ciclo.
            </p>
            <p>
              É isso que esta página organiza: os problemas mais atendidos na cidade, o que dá para
              resolver no seu endereço, o que exige bancada, o que influencia o valor do atendimento e quando
              o reparo deixa de fazer sentido. Cada serviço tem uma página própria, com escopo e
              limites detalhados — os links aparecem ao longo do texto.
            </p>
          </div>
        </section>

        {/* 3. Problemas mais atendidos */}
        <section className="border-t border-border/60 bg-secondary/20 py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Problemas mais atendidos em Curitiba
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {PROBLEMAS.map((p) => (
                <article key={p.titulo} className="rounded-xl border border-border/60 bg-card p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{p.titulo}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{p.texto}</p>
                  <Link
                    to={p.href}
                    className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                  >
                    Ver {p.anchor}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4 + 5. Equipamentos e serviços prioritários */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Equipamentos atendidos
              </h2>
              <ul className="mt-5 space-y-3">
                {EQUIPAMENTOS.map((e) => (
                  <li key={e} className="flex gap-3 text-sm text-muted-foreground">
                    <Laptop className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/equipamentos-atendidos"
                className="mt-5 inline-block text-sm font-semibold text-accent hover:underline"
              >
                Lista completa de equipamentos
              </Link>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Serviços prioritários
              </h2>
              <ul className="mt-5 space-y-3">
                {SERVICOS_PRIORITARIOS.map((s) => (
                  <li key={s.href} className="flex gap-3 text-sm">
                    <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <Link to={s.href} className="text-muted-foreground hover:text-accent">
                      {s.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Modalidades */}
        <section className="border-t border-border/60 bg-secondary/20 py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Modalidades de atendimento
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {MODALIDADES.map((m) => (
                <article key={m.titulo} className="rounded-xl border border-border/60 bg-card p-6">
                  <m.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {m.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{m.texto}</p>
                  <Link
                    to={m.href}
                    className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                  >
                    {m.linkLabel}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Como funciona */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Como funciona o atendimento
            </h2>
            <ol className="mt-6 space-y-4">
              {PASSOS.map((p, i) => (
                <li key={p} className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 font-bold text-accent">
                    {i + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
            <Link
              to="/como-funciona"
              className="mt-6 inline-block text-sm font-semibold text-accent hover:underline"
            >
              Detalhes do processo de atendimento
            </Link>
          </div>
        </section>

        {/* 8 + 9. Endereço x bancada */}
        <section className="border-t border-border/60 bg-secondary/20 py-12 md:py-16">
          <div className="container mx-auto grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Quando o atendimento no endereço é adequado
              </h2>
              <ul className="mt-4 space-y-3">
                {NO_ENDERECO_SIM.map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/atendimento-domicilio"
                className="mt-5 inline-block text-sm font-semibold text-accent hover:underline"
              >
                Regras do atendimento no endereço
              </Link>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Quando coleta ou bancada pode ser necessária
              </h2>
              <ul className="mt-4 space-y-3">
                {NO_ENDERECO_NAO.map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/coleta-e-entrega"
                className="mt-5 inline-block text-sm font-semibold text-accent hover:underline"
              >
                Como funciona a coleta
              </Link>
            </div>
          </div>
        </section>

        {/* 10. Valor do atendimento */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              O que influencia o valor do atendimento
            </h2>
            <p className="mt-4 text-muted-foreground">
              O valor não depende só do sintoma relatado: depende do que o diagnóstico encontra e do
              caminho necessário para resolver. Os fatores mais comuns são:
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {VALORES.map((o) => (
                <li key={o} className="flex gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/precos-e-politicas"
              className="mt-6 inline-block text-sm font-semibold text-accent hover:underline"
            >
              Ver preços e políticas vigentes
            </Link>
          </div>
        </section>

        {/* 11. Regiões */}
        <section className="border-t border-border/60 bg-secondary/20 py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Principais regiões de Curitiba atendidas
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {REGIOES_COBERTURA.map((r) => (
                <li key={r.id} className="flex gap-3 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <span className="block font-semibold text-foreground">{r.titulo}</span>
                    <span className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                      {r.itens.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          preload="intent"
                          className="underline underline-offset-4 hover:text-accent"
                          aria-label={`Assistência técnica em ${item.nome}`}
                        >
                          {item.nome}
                        </Link>
                      ))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/areas-atendidas"
              preload="intent"
              className="mt-6 inline-block text-sm font-semibold text-accent hover:underline"
            >
              Ver todas as regiões e bairros atendidos
            </Link>
          </div>
        </section>

        {/* 12. Perfis atendidos */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Residências, home office e pequenos negócios
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {PERFIS.map((p) => (
                <article key={p.titulo} className="rounded-xl border border-border/60 bg-card p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{p.titulo}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{p.texto}</p>
                </article>
              ))}
            </div>
            <Link
              to="/empresa-de-ti-curitiba"
              className="mt-6 inline-block text-sm font-semibold text-accent hover:underline"
            >
              Necessidade empresarial mais ampla
            </Link>
          </div>
        </section>

        {/* 13. Quando não compensa */}
        <section className="border-t border-border/60 bg-secondary/20 py-12 md:py-16">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Situações em que o reparo pode não compensar
            </h2>
            <p className="mt-4 text-muted-foreground">
              Há casos em que o custo da peça se aproxima do valor de mercado do equipamento, em que
              a placa tem dano extenso ou em que o modelo não tem mais reposição disponível. Quando
              isso aparece no diagnóstico, a informação é apresentada antes de qualquer execução —
              inclusive quando a conclusão é não seguir com o serviço.
            </p>
            <Link
              to="/quando-nao-compensa"
              className="mt-5 inline-block text-sm font-semibold text-accent hover:underline"
            >
              Guia: quando não compensa reparar
            </Link>
          </div>
        </section>

        {/* 13B. Cobertura local — distribuição de autoridade para bairros e cidades */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Atendimento por bairro e nas cidades vizinhas
            </h2>
            <p className="mt-4 text-muted-foreground">
              Esta página responde pela busca geral por técnico de informática em Curitiba. Quando a
              dúvida é sobre um bairro específico ou sobre uma cidade da região metropolitana, as
              páginas abaixo trazem a logística e os serviços mais pedidos em cada lugar.
            </p>

            <div className="mt-7 grid gap-7 md:grid-cols-2">
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Bairros de Curitiba
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {[
                    { to: "/bairros/batel", label: "Atendimento técnico no Batel" },
                    { to: "/bairros/agua-verde", label: "Suporte de informática no Água Verde" },
                    { to: "/bairros/centro", label: "Técnico para computador no Centro" },
                    { to: "/bairros/portao", label: "Assistência em informática no Portão" },
                    { to: "/bairros/cic", label: "Atendimento na CIC (Cidade Industrial)" },
                  ].map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="font-medium text-foreground hover:text-accent hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Cidades da região metropolitana
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {[
                    { to: "/tecnico-informatica-sao-jose-pinhais", label: "Suporte técnico em São José dos Pinhais" },
                    { to: "/tecnico-informatica-pinhais", label: "Manutenção de computador em Pinhais" },
                    { to: "/tecnico-informatica-colombo", label: "Atendimento de informática em Colombo" },
                    { to: "/tecnico-informatica-araucaria", label: "Assistência técnica em Araucária" },
                    { to: "/tecnico-informatica-campo-largo", label: "Técnico para notebook em Campo Largo" },
                  ].map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="font-medium text-foreground hover:text-accent hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  A cobertura fora de Curitiba depende da agenda e do tipo de reparo; a confirmação
                  vem na triagem, sem promessa de prazo antes do diagnóstico.
                </p>
              </div>
            </div>
          </div>
        </section>



        {/* 14. FAQ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Dúvidas sobre atendimento técnico em Curitiba
            </h2>
            <div className="mt-8 space-y-5">
              {FAQS.map((f) => (
                <details
                  key={f.question}
                  className="rounded-xl border border-border/60 bg-card p-5"
                  open
                >
                  <summary className="cursor-pointer font-heading text-base font-semibold text-foreground">
                    {f.question}
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 14b. Serviços correlatos do cluster de informática */}
        <section className="border-t border-border/60 py-12 md:py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <ServicosCorrelatos
              titulo="Serviços prioritários para computador e notebook"
              intro="Cada frente abaixo detalha escopo, processo e o que influencia o valor antes de qualquer agendamento."
              itens={[
                {
                  to: "/servicos/manutencao-de-computador",
                  titulo: "Manutenção de computador",
                  desc: "Limpeza, pasta térmica, revisão de disco e memória e correção de lentidão em PC e notebook.",
                },
                {
                  to: "/servicos/conserto-monitor",
                  titulo: "Conserto de monitor",
                  desc: "Triagem de imagem, energia e placa do monitor, com recusa declarada de troca de painel.",
                },
                {
                  to: "/servicos/formatacao",
                  titulo: "Formatação com backup",
                  desc: "Reinstalação do sistema com preservação de dados verificada antes da formatação.",
                },
                {
                  to: "/servicos/recuperacao-de-dados",
                  titulo: "Recuperação de dados",
                  desc: "Prioridade em preservar arquivos antes de qualquer tentativa de conserto do disco.",
                },
              ]}
            />
          </div>
        </section>

        {/* 15 + 16. Relacionados e CTA final */}

        <section className="border-t border-border/60 bg-secondary/30 py-12 md:py-16">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Descreva o problema e receba a orientação técnica
            </h2>
            <p className="mt-4 text-muted-foreground">
              A triagem identifica equipamento, sintoma e modalidade compatível antes de qualquer
              agendamento. Peças e serviços adicionais dependem de diagnóstico e aprovação.
            </p>
            <div className="mt-8">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-location="tecnico_curitiba_final"
                data-wa-source="whatsapp_cta"
                onClick={() => handleCta("tecnico_curitiba_final")}
                className={CTA_CLASS}
              >
                <MessageCircle className="h-5 w-5" />
                Iniciar triagem
              </a>
            </div>
            <nav className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              <Link to="/servicos" className="text-accent hover:underline">
                Todos os serviços
              </Link>
              <Link to="/atendimento-remoto" className="text-accent hover:underline">
                Suporte remoto
              </Link>
              <Link to="/diagnostico-tecnico" className="text-accent hover:underline">
                Diagnóstico técnico
              </Link>
              <Link to="/faq" className="text-accent hover:underline">
                Dúvidas frequentes
              </Link>
            </nav>
          </div>
        </section>

        <EeatProofsSection
          titulo="Quem responde tecnicamente pelo atendimento em Curitiba"
          descricao="Antes de mandar mensagem, confira com quem você vai falar: identificação da empresa, canal oficial e as regras que valem para todo atendimento em Curitiba."
          className="bg-secondary/40"
        />
        <PilarEditorialLinks pilar="/servicos/manutencao-de-computador" />
      </main>
      <Footer />
    </div>
  );
};

export default TecnicoInformaticaCuritiba;
