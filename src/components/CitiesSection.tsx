import { Link } from "@/lib/router-compat";
import { MapPin, ArrowRight, Building2, Home, Sparkles, ShieldCheck, Clock, MessageCircle } from "lucide-react";


interface CityData {
  name: string;
  slug: string;
  neighborhoods: string[];
  hasPage: boolean;
}

const cities: CityData[] = [
  {
    name: "Curitiba",
    slug: "curitiba",
    neighborhoods: ["Centro", "Batel", "Portão", "CIC", "Santa Felicidade", "Campo Comprido"],
    hasPage: true
  },
  {
    name: "São José dos Pinhais",
    slug: "sao-jose-dos-pinhais",
    neighborhoods: ["Centro", "Afonso Pena", "Aviação", "Costeira", "São Cristóvão", "Del Rey"],
    hasPage: true
  },
  {
    name: "Araucária",
    slug: "araucaria",
    neighborhoods: ["Centro", "Chapada", "Costeira", "Iguaçu", "Thomaz Coelho"],
    hasPage: true
  },
  {
    name: "Campo Largo",
    slug: "campo-largo",
    neighborhoods: ["Centro", "Jardim Guilhermina", "Jardim América", "Ferraria"],
    hasPage: true
  },
  {
    name: "Pinhais",
    slug: "pinhais",
    neighborhoods: ["Centro", "Emiliano Perneta", "Maria Antonieta", "Weissópolis"],
    hasPage: true
  }
];

export const CitiesSection = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-secondary relative overflow-hidden ambient-glow noise-overlay" aria-labelledby="cities-heading">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[100px] pointer-events-none orb-float" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-[80px] pointer-events-none liquid-blob" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4 shimmer-sweep float-badge">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium text-sm">Área de Atendimento</span>
          </div>
          <h2 id="cities-heading" className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 reveal-text">
            Técnico de Informática em Curitiba e <span className="gradient-text">Região</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto reveal-text" data-reveal-delay="100">
            Oferecemos <strong>assistência técnica de informática a domicílio</strong> em toda a região metropolitana de Curitiba. 
            Atendimento conforme a agenda para residências e empresas.
          </p>
          <div className="glow-separator max-w-xs mx-auto mt-5" />
          
          {/* Diferenciais reais — sem números inventados */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground/80">
              <MapPin className="h-3.5 w-3.5 text-accent" /> Curitiba e região metropolitana
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground/80">
              <Clock className="h-3.5 w-3.5 text-accent" /> Atendimento conforme a agenda 
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground/80">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Valor aprovado antes do serviço
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground/80">
              <MessageCircle className="h-3.5 w-3.5 text-accent" /> Contato direto pelo WhatsApp
            </span>
          </div>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-grid">
          {cities.map((city, index) => (
            <article 
              key={city.slug} 
              className="glass-card gradient-border rounded-xl p-6 hover:shadow-[var(--shadow-lg)] hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 group hover-streak animated-border slide-up-stagger"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-accent/15 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative">
                  <Building2 className="h-5 w-5 text-primary group-hover:text-accent transition-colors duration-300 icon-bounce" />
                  <div className="absolute inset-0 rounded-xl bg-accent/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-accent transition-colors duration-200">
                  {city.name}
                </h3>
              </div>

              <p className="text-muted-foreground text-sm mb-4">
                Técnico de informática em <strong>{city.name}</strong> com atendimento a domicílio. 
                Conserto de PC, notebook, formatação e mais.
              </p>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Bairros atendidos:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {city.neighborhoods.map((neighborhood) => (
                    <span 
                      key={neighborhood}
                      className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full border border-border/50 group-hover:border-accent/20 group-hover:bg-accent/5 transition-all duration-300"
                    >
                      {neighborhood}
                    </span>
                  ))}
                  <span className="text-xs text-accent font-medium flex items-center gap-0.5">
                    <Sparkles className="h-3 w-3" />
                    + outros
                  </span>
                </div>
              </div>

              {city.hasPage ? (
                <Link 
                  to={`/tecnico-informatica-${city.slug}`}
                  className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:text-accent hover:gap-2.5 transition-all duration-200 underline-grow"
                >
                  Ver todos os bairros em {city.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <a 
                  href={`https://wa.me/5541997086380?text=Olá! Preciso de técnico em ${city.name}`}
                  data-cta-location={`cities_${city.slug || city.name.toLowerCase().replace(/\s+/g, "-")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:text-accent hover:gap-2.5 transition-all duration-200 underline-grow"
                >
                  Falar com técnico em {city.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </article>
          ))}
        </div>

        {/* SEO content */}
        <div className="mt-12 glass-card gradient-border rounded-2xl p-6 md:p-8 hover:shadow-[var(--shadow-lg)] transition-shadow duration-300 hover-streak">
          <h3 className="text-xl font-heading font-bold text-foreground mb-4">
            Por que escolher nosso serviço de <span className="gradient-text">assistência técnica</span>?
          </h3>
          <div className="prose prose-sm text-muted-foreground max-w-none">
            <p>
              Prestamos <strong>manutenção de computadores e notebooks</strong> em <strong>Curitiba</strong> e
              região metropolitana, incluindo <strong>São José dos Pinhais</strong>, <strong>Araucária</strong>,
              <strong> Campo Largo</strong>, <strong>Pinhais</strong>, <strong>Colombo</strong> e
              <strong> Almirante Tamandaré</strong>. Atendimento <strong>a domicílio</strong> e remoto,
              com diagnóstico explicado e valor aprovado antes do serviço.
            </p>

            <p className="mt-3">
              Diferente de grandes empresas que usam call centers, aqui você fala diretamente com o técnico 
              que vai realizar o serviço. Isso garante <strong>atendimento personalizado</strong>, 
              <strong> Valor transparente</strong> e <strong>resolução rápida</strong> do seu problema.
              Todos os serviços têm garantia e você só paga se aprovar o valor do atendimento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
