import { ServicoLandingLayout } from "@/components/servico/ServicoLandingLayout";
import { VISUAL_3S_SERVICO_SLUGS } from "@/lib/visualEmpresarial3s";
import { visual3T } from "@/lib/visualEmpresarial3t";
import { blocos3T, cta3T } from "@/lib/blocos3t";
import { blocos3U, cta3U } from "@/lib/blocos3u";
import { Blocos3U } from "@/components/servico/Blocos3U";
import { blocos4A, cta4A } from "@/lib/blocos4a";
import { Blocos4A } from "@/components/servico/Blocos4A";
import { modulosEditoriais } from "@/lib/modulosEditoriais";
import { ModulosEditoriais } from "@/components/servico/ModulosEditoriais";
import { ClarezaVariacao } from "@/components/servico/ClarezaVariacao";
import { Blocos3T } from "@/components/servico/Blocos3T";
import { FichaComercialServico } from "@/components/servico/FichaComercialServico";

import { MontagemWizard } from "@/components/servico/MontagemWizard";
import { ProvasVisuaisMonitor } from "@/components/servico/ProvasVisuaisMonitor";
import { WorkstationSection } from "@/components/servico/WorkstationSection";
import { SuporteModalidadesSection } from "@/components/servico/SuporteModalidadesSection";
import { SuporteEmpresarialBlocos } from "@/components/servico/SuporteEmpresarialBlocos";
import { RespostasConversacionais } from "@/components/servico/RespostasConversacionais";
import { faqsConversacionais } from "@/lib/conversacional";
import { SERVICOS_CORE } from "@/lib/servicosCore";
import { SERVICOS_LOCAL } from "@/lib/servicosLocal";
import { visualDoServico } from "@/lib/servicoVisual3q";
import { visualEmpresarial } from "@/lib/servicoVisual3r";
import { siteConfig } from "@/lib/siteConfig";


/**
 * Página de serviço essencial (data-driven). Recebe o slug canônico e
 * renderiza a partir de SERVICOS_CORE com a identidade nova. A camada
 * SERVICOS_LOCAL adiciona conteúdo local, FAQ de intenção local e
 * links internos contextuais para reforço de SEO local em Curitiba.
 */
const ServicoCore = ({ slug }: { slug: keyof typeof SERVICOS_CORE }) => {
  const base = SERVICOS_CORE[slug];
  if (!base) return null;

  const local = SERVICOS_LOCAL[slug];
  const data = local
    ? {
        ...base,
        faqs: [...base.faqs, ...local.faqsLocais],
        blocoLocal: local.blocoLocal,
        linksLocais: local.linksLocais,
      }
    : base;

  // Blocos de política/checklist + wizard de solicitação (Rodada 3L / wizard).
  const extra =
    slug === "suporte-tecnico-empresarial" ? (
      <>
        <SuporteEmpresarialBlocos />
        <SuporteModalidadesSection />
      </>
    ) : slug === "montagem-de-pc" ? (
      <>
        <WorkstationSection />
        <MontagemWizard />
      </>
    ) : slug === "conserto-monitor" ? (
      <ProvasVisuaisMonitor />
    ) : undefined;

  // Rodada 3P — piloto visual de serviço (manutenção de notebook).
  const piloto =
    slug === "manutencao-de-notebook"
      ? {
          resumo: [
            { label: "Atendimento", value: "Domicílio, coleta e entrega ou remoto" },
            { label: "Região", value: "Curitiba e Região Metropolitana" },
            { label: "Diagnóstico", value: `A partir de ${siteConfig.minPriceLabel}` },
            { label: "Aprovação", value: "Valor informado antes de qualquer reparo" },
          ],
          toc: [
            { id: "incluso", label: "O que está incluso" },
            { id: "quando-chamar", label: "Quando chamar o técnico" },
            { id: "como-funciona", label: "Como funciona o atendimento" },
            { id: "fatores-valor", label: "O que influencia o valor" },
            { id: "faq", label: "Perguntas frequentes" },
          ],
        }
      : {};

  // Rodada 3Q — propagação controlada do padrão visual para as seis
  // páginas comerciais do escopo. Cada slug tem resumo, sumário, caixas
  // e CTA intermediário próprios (nenhum conteúdo editorial alterado).
  const visual = visualDoServico(slug as string);
  const visual3q = visual
    ? {
        resumo: visual.resumo,
        toc: visual.toc,
        confianca: true,
        caixas: visual.caixas,
        caixasTitulo: visual.caixasTitulo,
        caixasPosicao: visual.caixasPosicao,
        ctaIntermediario: visual.ctaIntermediario,
      }
    : {};

  // Rodada 3R — propagação de apresentação (resumo + sumário + faixa de
  // confiança) para as páginas de serviço empresariais. Só se aplica
  // quando o slug não pertence ao escopo fechado da 3Q.
  const empresarial = visual ? undefined : visualEmpresarial(slug as string);
  const visual3r = empresarial
    ? { resumo: empresarial.resumo, toc: empresarial.toc, confianca: true }
    : {};

  // Rodada 3S — variante visual empresarial (escopo fechado, só apresentação).
  const variante3s = VISUAL_3S_SERVICO_SLUGS.includes(slug as never)
    ? ({ variante: "empresarial" } as const)
    : {};

  // Rodada 3T — propagação do padrão empresarial com hero e contexto próprios
  // (preventiva e backup). Redes/Wi-Fi permanece de público misto.
  const cfg3t = visual3T(slug as string);
  const variante3t = cfg3t
    ? ({
        variante: "empresarial",
        heroEmpresarial: cfg3t.hero,
        contextoEmpresarial: cfg3t.contexto,
      } as const)
    : {};

  // Rodada 3T — blocos editoriais próprios das três páginas do escopo,
  // sumário estendido com as âncoras reais e CTA intermediário próprio.
  const cfgBlocos = blocos3T(slug as string);
  const baseToc = visual?.toc ?? empresarial?.toc ?? (piloto as { toc?: { id: string; label: string }[] }).toc;
  const blocos3t = cfgBlocos
    ? {
        toc: [...(baseToc ?? []).slice(0, -1), ...cfgBlocos.tocExtra, { id: "faq", label: "Perguntas frequentes" }],
        confianca: true,
        ctaIntermediario: cta3T(slug as string),
      }
    : {};

  // Rodada 3U — blocos próprios da montagem de PC (escopo, fluxo, contextos,
  // compatibilidade, peças do cliente, BIOS, testes e garantias distintas).
  const path3u = `/servicos/${slug}`;
  const cfg3u = blocos3U(path3u);
  const blocos3u = cfg3u
    ? {
        resumo: cfg3u.resumo,
        toc: [...cfg3u.tocExtra, { id: "faq", label: "Perguntas frequentes" }],
        confianca: true,
        ctaIntermediario: cta3U(path3u),
      }
    : {};

  // Rodada 4A — TV/Smart TV e reparo de placas: eyebrow técnico, indicadores
  // do hero (máximo quatro), sumário próprio e CTA intermediário da vertical.
  const cfg4a = blocos4A(path3u);
  const blocos4a = cfg4a
    ? {
        eyebrow: cfg4a.eyebrow,
        resumo: cfg4a.resumo,
        toc: [...cfg4a.tocExtra, { id: "faq", label: "Perguntas frequentes" }],
        confianca: true,
        ctaIntermediario: cta4A(path3u),
        clarezaHero: <ClarezaVariacao path={path3u} />,
      }
    : {};

  // Fase de Operação — módulos editoriais variáveis do serviço prioritário.
  // Só entram nas páginas destino das URLs consolidadas e apenas quando o
  // conteúdo do módulo é realmente diferente do que a página já entrega.
  const textoExistente = [
    data.intro,
    ...(data.sinais ?? []),
    ...(data.incluso ?? []).flatMap((i) => [i.title, i.desc]),
    ...(data.processo ?? []).flatMap((i) => [i.title, i.desc]),
    ...(data.fatoresValor ?? []).flatMap((i) => [i.title, i.desc]),
    ...(data.blocoLocal ?? []).flatMap((b) => [b.titulo, ...b.paragrafos]),
    ...(data.faqs ?? []).flatMap((f) => [f.question, f.answer]),
  ].join(" ");
  const cfgModulos = modulosEditoriais(`/servicos/${slug}`, textoExistente);
  const modulos = cfgModulos
    ? {
        toc: [
          ...((visual?.toc ?? empresarial?.toc ?? (piloto as { toc?: { id: string; label: string }[] }).toc ?? []).filter(
            (t) => t.id !== "faq",
          )),
          ...cfgModulos.tocExtra,
          { id: "faq", label: "Perguntas frequentes" },
        ],
      }
    : {};

  // Rodada 4C — ficha comercial padronizada (mesmos campos obrigatórios em
  // todas as páginas de serviço). Aditiva: entra depois dos blocos da rodada.
  const ficha = <FichaComercialServico slug={slug as string} nome={base.serviceName} />;

  const modulosNode = cfgModulos ? <ModulosEditoriais cfg={cfgModulos} /> : null;

  // Intenção conversacional (buscas estilo IA): H2 por intenção + H3 com a
  // pergunta exata. As respostas curtas alimentam o FAQPage único da página.
  const conversacional = <RespostasConversacionais slug={slug as string} />;
  const faqsExtra = faqsConversacionais(slug as string);

  const extraFinal = cfgBlocos ? (
    <>
      {extra}
      <Blocos3T slug={slug as string} />
      {ficha}
      {conversacional}
    </>
  ) : cfg3u ? (
    <>
      <Blocos3U path={path3u} />
      {extra}
      {ficha}
      {conversacional}
    </>
  ) : cfg4a ? (
    <>
      <Blocos4A path={path3u} />
      {extra}
      {ficha}
      {conversacional}
    </>
  ) : (
    <>
      {extra}
      {modulosNode}
      {ficha}
      {conversacional}
    </>
  );


  return (
    <ServicoLandingLayout
      data={{
        ...data,
        ...piloto,
        ...visual3q,
        ...visual3r,
        ...variante3s,
        ...variante3t,
        ...blocos3t,
        ...blocos3u,
        ...blocos4a,
        ...modulos,
        faqsSchemaExtra: faqsExtra,
        extra: extraFinal,
      }}
    />
  );

};



export default ServicoCore;
