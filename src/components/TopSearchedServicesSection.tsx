import { Link } from "@/lib/router-compat";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight, TrendingUp, MapPin, Monitor, Shield, HardDrive, Wifi, Wrench, Server, Cpu, Tv, Smartphone, Database, Zap, LocateFixed, ChevronDown } from "lucide-react";

interface ServiceLink {
  title: string;
  url: string;
  icon: React.ElementType;
  location: string;
}

const allServices: ServiceLink[] = [
  { title: "Formatação de Computador", url: "/servicos/formatacao", icon: Monitor, location: "Centro de Curitiba" },
  { title: "Manutenção de notebook", url: "/servicos/manutencao-de-computador", icon: Wrench, location: "Batel" },
  { title: "Remoção de Vírus", url: "/servicos/remocao-de-virus", icon: Shield, location: "Água Verde" },
  { title: "Upgrade de SSD e RAM", url: "/servicos/upgrade-ssd-ram", icon: HardDrive, location: "São José dos Pinhais" },
  { title: "Configuração de Redes", url: "/servicos/redes-e-wifi", icon: Wifi, location: "CIC" },
  { title: "Suporte técnico empresarial", url: "/servicos/suporte-tecnico-empresarial", icon: Server, location: "Santa Felicidade" },
  { title: "Montagem de PC", url: "/servicos/montagem-pc", icon: Cpu, location: "Portão" },
  { title: "Conserto de TV", url: "/servicos/conserto-tv", icon: Tv, location: "Pinhais" },
  { title: "Conserto de Celular", url: "/servicos/conserto-celular", icon: Smartphone, location: "Araucária" },
  { title: "Recuperação de dados", url: "/servicos/recuperacao-de-dados", icon: Database, location: "Campo Largo" },
  { title: "Computador Lento", url: "/servicos/computador-lento", icon: Zap, location: "Colombo" },
  { title: "Computador Não Liga", url: "/servicos/computador-nao-liga", icon: Monitor, location: "Xaxim" },
];

const cityLinks = [
  {
    name: "Curitiba", url: "/tecnico-informatica-curitiba", lat: -25.4284, lng: -49.2733,
    bairros: [
      { name: "Centro", slug: "centro" }, { name: "Batel", slug: "batel" }, { name: "Portão", slug: "portao" },
      { name: "CIC", slug: "cic" }, { name: "Santa Felicidade", slug: "santa-felicidade" }, { name: "Água Verde", slug: "agua-verde" },
      { name: "Bigorrilho", slug: "bigorrilho" }, { name: "Mercês", slug: "merces" }, { name: "Boa Vista", slug: "boa-vista" },
      { name: "Juvevê", slug: "juveve" }, { name: "Cabral", slug: "cabral" }, { name: "Cristo Rei", slug: "cristo-rei" },
      { name: "Cajuru", slug: "cajuru" }, { name: "Uberaba", slug: "uberaba" }, { name: "Pinheirinho", slug: "pinheirinho" },
      { name: "Xaxim", slug: "xaxim" }, { name: "Boqueirão", slug: "boqueirao" }, { name: "Bacacheri", slug: "bacacheri" },
      { name: "Tingui", slug: "tingui" }, { name: "Campo Comprido", slug: "campo-comprido" }, { name: "Alto da Glória", slug: "alto-da-gloria" },
      { name: "Rebouças", slug: "reboucas" }, { name: "Vila Izabel", slug: "vila-izabel" }, { name: "Seminário", slug: "seminario" },
      { name: "Hugo Lange", slug: "hugo-lange" }, { name: "Jardim Social", slug: "jardim-social" }, { name: "Tarumã", slug: "taruma" },
      { name: "Hauer", slug: "hauer" }, { name: "Fazendinha", slug: "fazendinha" }, { name: "Novo Mundo", slug: "novo-mundo" },
      { name: "Sítio Cercado", slug: "sitio-cercado" }, { name: "Alto Boqueirão", slug: "alto-boqueirao" },
      { name: "Capão da Imbuia", slug: "capao-da-imbuia" }, { name: "Jardim das Américas", slug: "jardim-das-americas" },
    ],
  },
  {
    name: "São José dos Pinhais", url: "/tecnico-informatica-sao-jose-pinhais", lat: -25.5365, lng: -49.2085,
    bairros: [
      { name: "Centro SJP", slug: "sao-jose-dos-pinhais" }, { name: "Afonso Pena", slug: "afonso-pena" },
      { name: "Cruzeiro", slug: "cruzeiro" }, { name: "Aristocrata", slug: "aristocrata" }, { name: "Braga", slug: "braga" },
      { name: "Costeira", slug: "costeira" }, { name: "Aviação", slug: "aviacao" }, { name: "Guatupê", slug: "guatupe" },
      { name: "São Cristóvão", slug: "sao-cristovao" }, { name: "São Domingos", slug: "sao-domingos" },
      { name: "São Marcos", slug: "sao-marcos" }, { name: "Del Rey", slug: "del-rey" }, { name: "Barro Preto", slug: "barro-preto" },
      { name: "Cidade Jardim", slug: "cidade-jardim-sjp" }, { name: "Pedro Moro", slug: "pedro-moro-sjp" },
      { name: "Ipê", slug: "ipe-sjp" }, { name: "Quississana", slug: "quississana-sjp" }, { name: "Ouro Fino", slug: "ouro-fino-sjp" },
      { name: "Independência", slug: "independencia-sjp" }, { name: "Parque da Fonte", slug: "parque-da-fonte" },
    ],
  },
  {
    name: "Araucária", url: "/tecnico-informatica-araucaria", lat: -25.5926, lng: -49.4103,
    bairros: [
      { name: "Centro", slug: "centro-araucaria" }, { name: "Capela Velha", slug: "capela-velha" },
      { name: "Thomaz Coelho", slug: "thomaz-coelho" }, { name: "Chapada", slug: "chapada" },
      { name: "Iguaçu", slug: "iguacu-araucaria" }, { name: "Campina da Barra", slug: "campina-da-barra" },
      { name: "Guajuvira", slug: "guajuvira" }, { name: "Cachoeira", slug: "cachoeira-araucaria" },
      { name: "Thomaz Coelho II", slug: "thomaz-coelho-ii" }, { name: "Jd. Boa Vista", slug: "jardim-boa-vista-araucaria" },
      { name: "São Miguel", slug: "sao-miguel-araucaria" }, { name: "Califórnia", slug: "california-araucaria" },
      { name: "Vila Nova", slug: "vila-nova-araucaria" }, { name: "Industrial", slug: "industrial-araucaria" },
      { name: "Barigui", slug: "barigui-araucaria" }, { name: "Fazenda Velha", slug: "fazenda-velha-araucaria" },
      { name: "Estação", slug: "estacao-araucaria" }, { name: "Sabiá", slug: "sabia" },
      { name: "Passaúna", slug: "passauna" }, { name: "Tindiquera", slug: "tindiquera" },
    ],
  },
  {
    name: "Campo Largo", url: "/tecnico-informatica-campo-largo", lat: -25.4596, lng: -49.5317,
    bairros: [
      { name: "Centro", slug: "centro-campo-largo" }, { name: "Ferraria", slug: "ferraria" },
      { name: "Jd. Guilhermina", slug: "jardim-guilhermina" }, { name: "Jd. América", slug: "jardim-america-campo-largo" },
      { name: "Botiatuva", slug: "botiatuva" }, { name: "Rondinha", slug: "rondinha" },
      { name: "Ouro Fino", slug: "ouro-fino" }, { name: "Itaqui", slug: "itaqui" },
      { name: "Bateias", slug: "bateias" }, { name: "Três Córregos", slug: "tres-corregos" },
      { name: "São Silvestre", slug: "sao-silvestre" }, { name: "Santa Cruz", slug: "santa-cruz-campo-largo" },
      { name: "Jd. Laranjeiras", slug: "jardim-laranjeiras-cl" }, { name: "São Marcos", slug: "sao-marcos-campo-largo" },
      { name: "São José", slug: "sao-jose-campo-largo" }, { name: "Jd. Esperança", slug: "jardim-esperanca-cl" },
      { name: "Lamenha Grande", slug: "lamenha-grande-cl" }, { name: "Vila Cândida", slug: "vila-candida-cl" },
      { name: "Timbotuva", slug: "timbotuva-cl" }, { name: "Vila Solene", slug: "vila-solene" },
    ],
  },
  {
    name: "Pinhais", url: "/tecnico-informatica-pinhais", lat: -25.4427, lng: -49.1927,
    bairros: [
      { name: "Centro", slug: "centro-pinhais" }, { name: "Weissópolis", slug: "weissopolis" },
      { name: "Pineville", slug: "pineville" }, { name: "Emiliano Perneta", slug: "emiliano-perneta" },
      { name: "Estância", slug: "estancia-pinhais" }, { name: "Alto Tarumã", slug: "alto-taruma" },
      { name: "Palmital", slug: "palmital-pinhais" }, { name: "Jardim Cláudia", slug: "jardim-claudia" },
      { name: "Jd. Pedro Demeterco", slug: "jardim-pedro-demeterco" }, { name: "Jd. Karla", slug: "jardim-karla-pinhais" },
      { name: "Jd. Wissinger", slug: "jardim-wissinger-pinhais" }, { name: "Vila Amélia", slug: "vila-amelia-pinhais" },
      { name: "Jd. Esplanada", slug: "jardim-esplanada-pinhais" }, { name: "Jd. Dona Rosa", slug: "jardim-dona-rosa-pinhais" },
      { name: "Jd. Tropical", slug: "jardim-tropical-pinhais" }, { name: "Vargem Grande", slug: "vargem-grande" },
      { name: "Sete Vilas", slug: "sete-vilas" }, { name: "Maria Antonieta", slug: "maria-antonieta" },
      { name: "Graciosa", slug: "graciosa" }, { name: "Jardim Amélia", slug: "jardim-amelia" },
    ],
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type GeoState = "idle" | "prompting" | "loading" | "granted" | "denied";

export const TopSearchedServicesSection = () => {
  const isMobile = useIsMobile();
  const serviceCount = isMobile ? 3 : 6;
  const randomizedServices = useMemo(() => shuffleArray(allServices).slice(0, serviceCount), [serviceCount]);

  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);

  // Find closest city based on user coords
  const closestCity = useMemo(() => {
    if (!userCoords) return null;
    let minDist = Infinity;
    let closest = cityLinks[0];
    for (const city of cityLinks) {
      const d = getDistance(userCoords.lat, userCoords.lng, city.lat, city.lng);
      if (d < minDist) { minDist = d; closest = city; }
    }
    // Only match if within 30km
    return minDist <= 30 ? closest : null;
  }, [userCoords]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoState("denied");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState("granted");
      },
      () => {
        setGeoState("denied");
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  // Auto-prompt when section comes into view
  useEffect(() => {
    if (geoState !== "idle") return;
    const timer = setTimeout(() => setGeoState("prompting"), 500);
    return () => clearTimeout(timer);
  }, [geoState]);

  // Set detected city name
  useEffect(() => {
    if (closestCity) setDetectedCity(closestCity.name);
  }, [closestCity]);

  // Determine which cities to show
  const citiesToShow = useMemo(() => {
    if (geoState === "granted" && closestCity && !showAll) {
      // Show matched city with more bairros + 1-2 nearby
      const sorted = [...cityLinks].sort((a, b) => {
        if (!userCoords) return 0;
        return getDistance(userCoords.lat, userCoords.lng, a.lat, a.lng) -
               getDistance(userCoords.lat, userCoords.lng, b.lat, b.lng);
      });
      const nearby = sorted.slice(0, 3);
      return nearby.map((city, i) => ({
        ...city,
        bairros: shuffleArray(city.bairros).slice(0, i === 0 ? 6 : 4),
      }));
    }
    // Show all with randomized bairros
    return cityLinks.map(city => ({
      ...city,
      bairros: shuffleArray(city.bairros).slice(0, 4),
    }));
  }, [geoState, closestCity, showAll, userCoords]);

  const gridCols = citiesToShow.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-muted to-background relative overflow-hidden noise-overlay">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/[0.02] blur-[100px] pointer-events-none orb-float" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-accent/[0.03] blur-[100px] pointer-events-none liquid-blob" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4 shimmer-sweep float-badge">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium text-sm">Mais Buscados em Curitiba</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-3 tracking-tight reveal-text">
            Serviços de Informática Mais <span className="gradient-text">Procurados</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
            Encontre o serviço que você precisa com atendimento local especializado em cada região
          </p>
          <div className="glow-separator max-w-xs mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12 stagger-grid">
          {randomizedServices.map((service, index) => (
            <Link
              key={index}
              to={service.url}
              className="group glass-card gradient-border rounded-xl p-5 hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover-streak animated-border slide-up-stagger"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-accent/15 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative">
                  <service.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors duration-300 icon-bounce" />
                  <div className="absolute inset-0 rounded-xl bg-accent/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-accent transition-colors duration-200 mb-1">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Destaque: {service.location}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        <div className="glass-card gradient-border rounded-2xl p-6 md:p-8 hover:shadow-[var(--shadow-lg)] transition-shadow duration-300">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2 reveal-text">
              Atendimento por <span className="gradient-text">Região</span>
            </h3>

            {/* Geo prompt / status */}
            {geoState === "prompting" && (
              <div className="mt-4 animate-fade-in">
                <p className="text-sm text-muted-foreground mb-3">
                  Quer ver os bairros mais próximos de você?
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={requestLocation}
                    className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 hover:scale-105 transition-all duration-200 elastic-click"
                  >
                    <LocateFixed className="h-4 w-4" />
                    Usar minha localização
                  </button>
                  <button
                    onClick={() => setGeoState("denied")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                  >
                    Ver todas as regiões
                  </button>
                </div>
              </div>
            )}

            {geoState === "loading" && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
                <LocateFixed className="h-4 w-4 animate-spin" />
                Detectando sua localização...
              </div>
            )}

            {geoState === "granted" && detectedCity && !showAll && (
              <div className="mt-3 inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium">
                <LocateFixed className="h-3.5 w-3.5" />
                Mostrando resultados perto de <strong>{detectedCity}</strong>
              </div>
            )}
          </div>

          <div className={`grid grid-cols-2 ${gridCols} gap-3 md:gap-4`}>
            {citiesToShow.map((city, index) => (
              <div key={city.name} className="rounded-xl border border-border bg-card p-4 hover:border-accent/30 hover:shadow-md transition-all duration-300 slide-up-stagger" style={{ animationDelay: `${index * 60}ms` }}>
                <Link
                  to={city.url}
                  className="flex items-center gap-2 text-sm md:text-base font-bold text-accent hover:text-accent/80 transition-all mb-2.5 group"
                >
                  <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <MapPin className="h-3 w-3 text-accent" />
                  </div>
                  <span className="truncate">{city.name}</span>
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {city.bairros.map((bairro, idx) => (
                    <Link
                      key={idx}
                      to={`/bairros/${bairro.slug}`}
                      className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full hover:text-accent hover:bg-accent/10 transition-colors duration-200"
                    >
                      {bairro.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Ver mais / Ver todas */}
          {geoState === "granted" && !showAll && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium text-sm transition-all hover:gap-3"
              >
                <ChevronDown className="h-4 w-4" />
                Ver todas as regiões atendidas
              </button>
            </div>
          )}

          {showAll && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAll(false)}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent font-medium text-sm transition-all"
              >
                Mostrar apenas minha região
              </button>
            </div>
          )}
          
          <div className="text-center mt-8 pt-6 border-t border-border">
            <p className="text-muted-foreground mb-4">
              Não encontrou seu bairro? Atendemos <strong className="text-foreground">toda a região metropolitana de Curitiba</strong>.
            </p>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 hover:scale-[1.03] hover:shadow-[var(--shadow-accent)] transition-all duration-300 elastic-click hover-streak"
            >
              Consultar Disponibilidade
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
