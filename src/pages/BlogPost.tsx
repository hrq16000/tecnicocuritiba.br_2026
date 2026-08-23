import { useEffect } from "react";
import { useParams, Link, Navigate } from "@/lib/router-compat";
import { useCanonical } from "@/lib/canonicalUrl";
import { Header } from "@/components/Header";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { FloatingParticles } from "@/components/FloatingParticles";
import { AnimatedSection } from "@/components/AnimatedSection";
import { trackPageView } from "@/lib/analytics";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getUniqueImage } from "@/lib/blogImages";
import { getEditorialCover } from "@/lib/blogEditorialCovers";
import { getCategoryCover } from "@/lib/categoryCovers";
import { withOgVersion } from "@/lib/ogCacheBust";
import { programmaticPosts } from "@/data/blogProgrammaticPosts";
import { blogPostsContentBase, type BlogPostContent } from "@/data/blogPostsContent";
import { BlogPostFAQ } from "@/components/BlogPostFAQ";
import { EditorialCta, EditorialRelatedLinks } from "@/components/editorial/EditorialCta";
import {
  isEditorialApproved,
  getEditorialApproval,
  INSTITUTIONAL_AUTHOR,
  EDITORIAL_PUBLISHER,
} from "@/lib/blogEditorialRegistry";


// O conteúdo é importado estaticamente (e não mais por `import()` tardio):
// sem isso o HTML servido ao crawler ficava vazio — o artigo só existia após
// a hidratação. O custo fica isolado no chunk da rota /blog/$slug.
type PostsMap = Record<string, BlogPostContent>;

const posts: PostsMap = {
  ...blogPostsContentBase,
  ...programmaticPosts,
} as PostsMap;

// Indexabilidade é decidida EXCLUSIVAMENTE pelo registro editorial
// fail-closed (src/lib/blogEditorialRegistry.ts). Categoria, data,
// slug, imagem ou tema NÃO controlam indexabilidade. Sem aprovação
// explícita, o artigo é noindex, follow e fica fora do sitemap.

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  useCanonical(`https://tecnico.curitiba.br/blog/${slug}`);

  const post = slug ? posts[slug] ?? null : null;




  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog | Técnico em Curitiba`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", post.excerpt);
      }
      trackPageView(`/blog/${slug}`, `Blog - ${post.title}`);
    }
  }, [post, slug]);

  // Fail-closed: a meta robots reflete APENAS o registro editorial.
  // Artigo sem aprovação válida => noindex, follow. Aprovado => index, follow.
  useEffect(() => {
    if (!post || !slug) return;
    const approved = isEditorialApproved(slug);
    const robots = document.querySelector('meta[name="robots"]');
    const googlebot = document.querySelector('meta[name="googlebot"]');
    const prevRobots = robots?.getAttribute("content") ?? null;
    const prevGoogle = googlebot?.getAttribute("content") ?? null;
    const indexVal = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    const indexGoogle = "index, follow, max-image-preview:large, max-snippet:-1";
    robots?.setAttribute("content", approved ? indexVal : "noindex, follow");
    googlebot?.setAttribute("content", approved ? indexGoogle : "noindex, follow");
    return () => {
      if (robots && prevRobots) robots.setAttribute("content", prevRobots);
      if (googlebot && prevGoogle) googlebot.setAttribute("content", prevGoogle);
    };
  }, [post, slug]);

  // Capa exclusiva da onda editorial tem prioridade (mesma imagem do HTML estático).
  const editorialCover = slug ? getEditorialCover(slug) : null;
  const categoryCover = slug ? getCategoryCover(slug) : null;
  const heroImage = editorialCover
    ? `https://tecnico.curitiba.br${editorialCover.src}`
    : categoryCover
    ? `https://tecnico.curitiba.br${categoryCover.src}`

    : post?.image
    ? (typeof post.image === 'string' && post.image.startsWith('http')
        ? post.image
        : `https://tecnico.curitiba.br${post.image}`)
    : (slug ? getUniqueImage(slug).replace(/w=\d+/, 'w=1600').replace(/q=\d+/, 'q=80') + '&w=1600&h=900' : '');
  const heroImageOg = withOgVersion(heroImage);

  // Compute word count from content (rough estimate via readTime)
  const wordCount = post ? Math.round(parseInt(post.readTime) * 220) : 1500;

  // Structured data governado pelo registro editorial fail-closed.
  // - Artigo NÃO aprovado: emite apenas WebPage + BreadcrumbList (sem
  //   BlogPosting/Article/TechArticle, sem autor pessoal, sem prova de
  //   revisão). Não é tratado como conteúdo publicado.
  // - Artigo aprovado (futuro): emite BlogPosting completo com autoria
  //   institucional/verificada e data real registrada.
  useEffect(() => {
    if (!post || !slug) return;
    const existingSchemas = document.querySelectorAll('script[data-blog-schema="true"]');
    existingSchemas.forEach(s => s.remove());

    const canonicalUrl = `https://tecnico.curitiba.br/blog/${slug}`;
    const approval = getEditorialApproval(slug);
    const approved = isEditorialApproved(slug);

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://tecnico.curitiba.br/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://tecnico.curitiba.br/blog" },
        { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
      ]
    };

    const schemas: Record<string, unknown>[] = [breadcrumbSchema];

    if (approved && approval) {
      // Autoria institucional oficial (sem Person fictício / cargo inventado).
      const author = {
        "@type": "Organization",
        "name": INSTITUTIONAL_AUTHOR.name,
        "url": INSTITUTIONAL_AUTHOR.url,
      };
      schemas.push({
        "@context": "https://schema.org",
        "@type": ["BlogPosting", "Article", "TechArticle"],
        "headline": post.title.length > 110 ? post.title.substring(0, 107) + '...' : post.title,
        "name": post.title,
        "description": post.excerpt,
        "datePublished": `${post.date}T08:00:00-03:00`,
        // dateModified reflete a revisão material registrada; nunca gerada no build.
        "dateModified": `${(approval.reviewedAt ?? post.date).slice(0, 10)}T08:00:00-03:00`,
        "image": [
          { "@type": "ImageObject", "url": heroImage, "width": 1600, "height": 900 },
          { "@type": "ImageObject", "url": heroImage, "width": 1200, "height": 1200 },
          { "@type": "ImageObject", "url": heroImage, "width": 1200, "height": 675 }
        ],
        "thumbnailUrl": heroImage,
        "author": author,
        "publisher": {
          "@type": "Organization",
          "name": EDITORIAL_PUBLISHER.name,
          "url": EDITORIAL_PUBLISHER.url,
          "logo": {
            "@type": "ImageObject",
            "url": EDITORIAL_PUBLISHER.logo,
            "width": 600,
            "height": 60
          }
        },
        "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
        "url": canonicalUrl,
        "inLanguage": "pt-BR",
        "isAccessibleForFree": true,
        "isPartOf": {
          "@type": "Blog",
          "name": "Blog Técnico em Curitiba",
          "url": "https://tecnico.curitiba.br/blog"
        },
        "about": { "@type": "Thing", "name": post.category },
        "wordCount": wordCount,
        "timeRequired": `PT${parseInt(post.readTime) || 10}M`,
        "articleSection": post.category,
      });
    } else {
      // Rascunho / em preparação: somente WebPage institucional mínimo.
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": post.title,
        "description": post.excerpt,
        "url": canonicalUrl,
        "inLanguage": "pt-BR",
        "isPartOf": {
          "@type": "WebSite",
          "name": EDITORIAL_PUBLISHER.name,
          "url": EDITORIAL_PUBLISHER.url,
        },
        "publisher": {
          "@type": "Organization",
          "name": EDITORIAL_PUBLISHER.name,
          "url": EDITORIAL_PUBLISHER.url,
        },
      });
    }

    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-blog-schema', 'true');
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-blog-schema="true"]').forEach(s => s.remove());
    };
  }, [post, slug, heroImage, wordCount]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }


  const approved = slug ? isEditorialApproved(slug) : false;

  return (
    <div className="min-h-screen bg-background">
      {/* title/description/canonical/OG base vêm do head() SSR da rota
          (src/routes/blog.$slug.tsx). Aqui só a capa e os campos article:*,
          aplicados via efeito — react-helmet quebrava o SSR. */}

      <JsonLdSchema />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 premium-gradient" />
          <FloatingParticles count={20} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.07] blur-[120px] animate-breathe" />
            <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[100px] animate-breathe" style={{ animationDelay: "2.5s" }} />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
          <div className="container mx-auto relative z-10 pt-14 pb-20 md:pt-20 md:pb-24">
            <div className="max-w-3xl mx-auto">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-white/85 hover:text-white mb-6 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Blog
              </Link>
              
              <AnimatedSection animation="fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium bg-white/15 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20 shimmer">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-white/85 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/85 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime} de leitura</span>
                  </div>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
                  {post.title}
                </h1>
                <div className="glow-separator max-w-[160px] mt-6" />
              </AnimatedSection>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/[0.02] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto relative z-10">
            {/* Discover-ready hero image: always show large featured image */}
            <div className="max-w-4xl mx-auto mb-10">
              <AspectRatio ratio={16 / 9} className="bg-muted rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  srcSet={
                    editorialCover
                      ? undefined
                      : categoryCover
                      ? categoryCover.srcSet
                      : heroImage.includes("images.unsplash.com")
                      ? [400, 800, 1200, 1600]
                          .map((w) => `${heroImage.replace(/[?&]w=\d+/g, "")}${heroImage.includes("?") ? "&" : "?"}w=${w} ${w}w`)
                          .join(", ")
                      : undefined
                  }
                  sizes="(max-width: 768px) 100vw, 1200px"
                  alt={editorialCover ? editorialCover.alt : post.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={editorialCover ? 1200 : 1600}
                  height={editorialCover ? 630 : 900}
                />
              </AspectRatio>
            </div>
            <article className="max-w-3xl mx-auto prose prose-lg prose-headings:text-primary prose-headings:font-heading prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-accent">
              {post.content}

              {post.category === "CFTV" && (
                <div className="not-prose mt-12 bg-primary/5 rounded-xl p-6 border border-primary/10">
                  <h3 className="font-heading font-bold text-primary text-lg mb-3">Instalação de Câmeras na Sua Cidade</h3>
                  <p className="text-muted-foreground text-sm mb-4">Veja informações específicas de instalação para a sua região:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Curitiba", path: "/cftv/curitiba" },
                      { name: "São José dos Pinhais", path: "/cftv/sao-jose-dos-pinhais" },
                      { name: "Araucária", path: "/cftv/araucaria" },
                      { name: "Campo Largo", path: "/cftv/campo-largo" },
                      { name: "Pinhais", path: "/cftv/pinhais" },
                      { name: "Litoral do PR", path: "/cftv/litoral" },
                      { name: "Guaratuba", path: "/cftv/guaratuba" },
                    ].map((city) => (
                      <Link key={city.path} to={city.path} className="inline-flex items-center gap-1.5 bg-background border border-primary/10 rounded-full px-4 py-2 text-sm text-foreground hover:border-accent/30 hover:text-accent transition-all">
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Cluster editorial (Rodada 4F): conteúdos relacionados + CTA de triagem */}
              <EditorialRelatedLinks
                slug={slug ?? ""}
                titles={Object.fromEntries(Object.entries(posts).map(([k, v]) => [k, v.title]))}
              />
              <EditorialCta slug={slug ?? ""} titulo={post.title} />


              <BlogPostFAQ category={post.category} slug={slug ?? ""} />
            </article>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
