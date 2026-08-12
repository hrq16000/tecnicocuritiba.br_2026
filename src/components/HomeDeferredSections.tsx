import { lazy, Suspense } from "react";
import { BrowserRouter, useInRouterContext } from "react-router-dom";
import { PageSEO } from "@/components/PageSEO";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { LazyOnVisible } from "@/components/LazyOnVisible";

const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));
const PainSection = lazy(() => import("@/components/PainSection").then(m => ({ default: m.PainSection })));
const ServicesSection = lazy(() => import("@/components/ServicesSection").then(m => ({ default: m.ServicesSection })));
const TrustSection = lazy(() => import("@/components/TrustSection").then(m => ({ default: m.TrustSection })));
const NeighborhoodsSection = lazy(() => import("@/components/NeighborhoodsSection").then(m => ({ default: m.NeighborhoodsSection })));
const CTASection = lazy(() => import("@/components/CTASection").then(m => ({ default: m.CTASection })));
const FAQSection = lazy(() => import("@/components/FAQSection").then(m => ({ default: m.FAQSection })));
const CitiesSection = lazy(() => import("@/components/CitiesSection").then(m => ({ default: m.CitiesSection })));
const TopSearchedServicesSection = lazy(() => import("@/components/TopSearchedServicesSection").then(m => ({ default: m.TopSearchedServicesSection })));
const ReviewsGrid = lazy(() => import("@/components/ReviewsGrid").then(m => ({ default: m.ReviewsGrid })));
const TestimonialsPlaceholder = lazy(() => import("@/components/TestimonialsPlaceholder").then(m => ({ default: m.TestimonialsPlaceholder })));
const ComoFuncionaFluxo = lazy(() => import("@/components/ComoFuncionaFluxo").then(m => ({ default: m.ComoFuncionaFluxo })));

const CoverageMapSection = lazy(() => import("@/components/CoverageMapSection").then(m => ({ default: m.CoverageMapSection })));
const SchedulingSection = lazy(() => import("@/components/scheduling").then(m => ({ default: m.SchedulingSection })));
const TrustBadges = lazy(() => import("@/components/social-proof").then(m => ({ default: m.TrustBadges })));
const SecurityBadge = lazy(() => import("@/components/social-proof").then(m => ({ default: m.SecurityBadge })));
const SocialProofAdminPanel = lazy(() => import("@/components/social-proof/AdminPanel").then(m => ({ default: m.SocialProofAdminPanel })));
const HomePricingBlock = lazy(() => import("@/components/HomePricingBlock").then(m => ({ default: m.HomePricingBlock })));
const HomeDiagnosticoBlock = lazy(() => import("@/components/HomeDiagnosticoBlock").then(m => ({ default: m.HomeDiagnosticoBlock })));
const HomeEquipamentosBlock = lazy(() => import("@/components/HomeEquipamentosBlock").then(m => ({ default: m.HomeEquipamentosBlock })));
const HomeParaQuemBlock = lazy(() => import("@/components/HomeParaQuemBlock").then(m => ({ default: m.HomeParaQuemBlock })));
const InterlinkingBlock = lazy(() => import("@/components/InterlinkingBlock").then(m => ({ default: m.InterlinkingBlock })));
const ProblemasDestaque = lazy(() => import("@/components/ProblemasDestaque").then(m => ({ default: m.ProblemasDestaque })));
const TechBrandsMarquee = lazy(() => import("@/components/TechBrandsMarquee").then(m => ({ default: m.TechBrandsMarquee })));
const GeolocationTrigger = lazy(() => import("@/components/GeolocationTrigger").then(m => ({ default: m.GeolocationTrigger })));
const OQueEstaAcontecendoSection = lazy(() => import("@/components/home/OQueEstaAcontecendoSection").then(m => ({ default: m.OQueEstaAcontecendoSection })));

const SectionFallback = ({ height = "400px" }: { height?: string }) => (
  <div style={{ minHeight: height }} className="w-full" aria-hidden="true" />
);

const DeferredContent = () => (
  <>
    <PageSEO title="Técnico de Informática Curitiba | Hoje R$ 99,99" description="Técnico de informática em Curitiba hoje. Conserto de PC/notebook, formatação, vírus e SSD a partir de R$ 99,99. Chame no WhatsApp." path="/" />
    <JsonLdSchema />

    <LazyOnVisible minHeight="120px" rootMargin="-240px 0px"><Suspense fallback={<SectionFallback height="120px" />}><TechBrandsMarquee /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><OQueEstaAcontecendoSection /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><PainSection /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><SchedulingSection /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><ServicesSection /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><TopSearchedServicesSection /></Suspense></LazyOnVisible>
    <LazyOnVisible minHeight="1px" rootMargin="-240px 0px"><Suspense fallback={null}><GeolocationTrigger /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><CoverageMapSection /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><CitiesSection /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><NeighborhoodsSection /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><ReviewsGrid title="Avaliações de clientes reais em Curitiba" /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback height="300px" />}><TestimonialsPlaceholder /></Suspense></LazyOnVisible>


    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><ComoFuncionaFluxo /></Suspense></LazyOnVisible>


    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><HomePricingBlock /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><HomeDiagnosticoBlock /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><HomeEquipamentosBlock /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><HomeParaQuemBlock /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><ProblemasDestaque /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><InterlinkingBlock /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><FAQSection /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><TrustSection /></Suspense></LazyOnVisible>
    <LazyOnVisible rootMargin="-240px 0px"><Suspense fallback={<SectionFallback />}><CTASection /></Suspense></LazyOnVisible>

    <LazyOnVisible minHeight="200px" rootMargin="-240px 0px">
      <section className="py-8 bg-muted/30"><div className="container mx-auto"><div className="text-center mb-6"><Suspense fallback={null}><SecurityBadge /></Suspense></div><Suspense fallback={<SectionFallback height="100px" />}><TrustBadges variant="card" /></Suspense></div></section>
    </LazyOnVisible>
    <LazyOnVisible minHeight="280px"><Suspense fallback={<SectionFallback height="280px" />}><Footer /></Suspense></LazyOnVisible>
    <LazyOnVisible minHeight="1px" rootMargin="0px"><Suspense fallback={null}><SocialProofAdminPanel /></Suspense></LazyOnVisible>
  </>
);

export const HomeDeferredSections = () => {
  const inRouter = useInRouterContext();
  return inRouter ? <DeferredContent /> : <BrowserRouter><DeferredContent /></BrowserRouter>;
};

export default HomeDeferredSections;