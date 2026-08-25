import { PageSEO } from "@/components/PageSEO";
import { FastHeader } from "@/components/FastHeader";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GestorResponsavelSection } from "@/components/GestorResponsavelSection";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { useValidatedJsonLd } from "@/lib/schemaValidation";
import { GESTOR, hasPersonAuthority } from "@/lib/gestorResponsavel";
import { siteConfig, absoluteUrl } from "@/lib/siteConfig";
import { ClusterLinks } from "@/components/ClusterLinks";

const PATH = "/gestor-responsavel";

const GestorResponsavelPage = () => {
  const pessoal = hasPersonAuthority();

  const schema = pessoal
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${siteConfig.baseUrl}${PATH}#person`,
        name: GESTOR.nome,
        jobTitle: GESTOR.cargo,
        description: GESTOR.bio[0],
        url: absoluteUrl(PATH),
        worksFor: { "@id": `${siteConfig.baseUrl}/#organization` },
        areaServed: GESTOR.areaAtuacao.map((name) => ({ "@type": "City", name })),
        knowsAbout: GESTOR.escopoTecnico,
        ...(GESTOR.certificacoes.length
          ? {
              hasCredential: GESTOR.certificacoes.map((c) => ({
                "@type": "EducationalOccupationalCredential",
                name: c.nome,
                credentialCategory: "certification",
                recognizedBy: { "@type": "Organization", name: c.emissor },
                ...(c.url ? { url: c.url } : {}),
              })),
            }
          : {}),
        ...(GESTOR.sameAs.length ? { sameAs: GESTOR.sameAs } : {}),
      }
    : null;

  useValidatedJsonLd("ld-gestor-person", schema);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Responsável técnico | Técnico em Curitiba"
        description={`Quem responde tecnicamente pelos atendimentos: ${siteConfig.brandName}, atuação em informática desde ${siteConfig.foundedYear} em Curitiba e região. Escopo, área de atuação e critérios de diagnóstico.`}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Responsável técnico", path: PATH },
        ]}
      />
      <LocalBusinessJsonLd
        scriptId="ld-localbusiness-gestor"
        path={PATH}
        description={`Responsabilidade técnica do ${siteConfig.brandName} em Curitiba e região metropolitana desde ${siteConfig.foundedYear}.`}
      />
      <FastHeader />
      <div aria-hidden="true" className="h-[var(--site-header-height)]" />

      <main>
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs items={[{ label: "Responsável técnico" }]} />
          <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">
            Responsável técnico pelos atendimentos em Curitiba
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Transparência sobre quem executa e responde pelos serviços: entidade legal,
            tempo de atuação, escopo técnico coberto e a região efetivamente atendida.
            Nada aqui é estimativa de marketing — é o critério real usado na triagem.
          </p>
        </div>

        <GestorResponsavelSection />

        {/*
          Desalinhamento de intenção corrigido: esta página institucional vinha
          captando consultas comerciais B2B ("suporte técnico para empresas
          curitiba", "manutenção informática empresa curitiba") em posições
          ruins, no lugar das páginas donas dessa intenção. O bloco abaixo
          entrega o encaminhamento explícito com âncoras de intenção exata.
        */}
        <section aria-labelledby="atendimento-empresas" className="mt-12 rounded-xl border border-border bg-card/60 p-6">
          <h2 id="atendimento-empresas" className="text-xl font-semibold">
            Procura contrato de suporte para empresa em Curitiba?
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Esta página trata apenas da responsabilidade técnica pelos atendimentos.
            As condições comerciais, o escopo contratado e os prazos de atendimento
            para pessoa jurídica ficam nas páginas específicas:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/empresa-de-ti-curitiba" className="text-primary underline underline-offset-4">
                Empresa de TI em Curitiba: manutenção de informática para empresas
              </Link>{" "}
              — escopo, modalidades de atendimento e critérios de contrato.
            </li>
            <li>
              <Link to="/servicos/suporte-tecnico-empresarial" className="text-primary underline underline-offset-4">
                Suporte técnico empresarial em Curitiba
              </Link>{" "}
              — atendimento recorrente, prioridade e registro de chamados.
            </li>
            <li>
              <Link to="/servicos/manutencao-preventiva-empresas" className="text-primary underline underline-offset-4">
                Manutenção preventiva para empresas
              </Link>{" "}
              — rotina programada para reduzir paradas não planejadas.
            </li>
          </ul>
        </section>

        <ClusterLinks
          titulo="Explore o atendimento por modalidade, serviço e região"
          categoria="Suporte técnico"
        />

      </main>

      <Footer />
    </div>
  );
};

export default GestorResponsavelPage;
