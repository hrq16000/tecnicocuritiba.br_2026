import { useEffect } from "react";
import { upsertCanonical } from "@/lib/canonicalUrl";
import { FastHeader } from "@/components/FastHeader";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { HeroPremium } from "@/components/home/HeroPremium";
import { TrustStrip } from "@/components/TrustStrip";

import { siteConfig } from "@/lib/siteConfig";

// SSR-first: as seções da home (serviços, processo, regiões, FAQ) e o rodapé
// são renderizados no servidor. Antes ficavam atrás de LazyOnVisible + lazy(),
// e o HTML entregue ao crawler tinha ~200 palavras e nenhum H2.
import { HomeSections } from "@/components/home/HomeSections";
import { Footer } from "@/components/Footer";


const Index = () => {
  useEffect(() => {
    document.title = siteConfig.homeTitle;
    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el) el.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', "content", siteConfig.homeDescription);
    upsertCanonical(`${siteConfig.baseUrl}/`);
    setMeta('meta[property="og:url"]', "content", `${siteConfig.baseUrl}/`);
    setMeta('meta[property="og:title"]', "content", siteConfig.homeTitle);
    setMeta('meta[property="og:description"]', "content", siteConfig.homeDescription);

    const id = window.setTimeout(() => {
      import("@/lib/analytics").then(({ trackPageView }) => trackPageView("/", "Home"));
    }, 1800);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <JsonLdSchema />
      <FastHeader />
      <div aria-hidden="true" className="h-[var(--site-header-height)]" />
      <main>
        <HeroPremium />
        <TrustStrip />
        <HomeSections />
      </main>

      <Footer />

    </div>
  );
};

export default Index;
