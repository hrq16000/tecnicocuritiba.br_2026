import { MapPin, Clock, Navigation, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MouseGlow } from "@/components/MouseGlow";
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from "@/hooks/useGeolocation";

interface RegionData {
  name: string;
  baseMin: number;
  baseMax: number;
  neighborhoods: string[];
  lat: number;
  lng: number;
}

const regions: RegionData[] = [
  { name: "Curitiba - Centro", baseMin: 20, baseMax: 30, neighborhoods: ["Centro", "Batel", "Água Verde", "Rebouças", "Alto da XV"], lat: -25.4284, lng: -49.2733 },
  { name: "Curitiba - Norte", baseMin: 25, baseMax: 40, neighborhoods: ["Santa Felicidade", "Boa Vista", "Bacacheri", "Cabral"], lat: -25.3800, lng: -49.2700 },
  { name: "Curitiba - Sul", baseMin: 25, baseMax: 40, neighborhoods: ["Portão", "Novo Mundo", "Xaxim", "Pinheirinho"], lat: -25.4800, lng: -49.2800 },
  { name: "Curitiba - Oeste", baseMin: 30, baseMax: 45, neighborhoods: ["CIC", "Campo Comprido", "Mossunguê", "Fazendinha"], lat: -25.4500, lng: -49.3400 },
  { name: "São José dos Pinhais", baseMin: 35, baseMax: 50, neighborhoods: ["Centro SJP", "Afonso Pena", "Costeira", "Aviação"], lat: -25.5313, lng: -49.2060 },
  { name: "Araucária", baseMin: 40, baseMax: 55, neighborhoods: ["Centro", "Capela Velha", "Thomaz Coelho"], lat: -25.5926, lng: -49.4103 },
  { name: "Campo Largo", baseMin: 45, baseMax: 60, neighborhoods: ["Centro", "Ferraria", "Jardim Guilhermina"], lat: -25.4596, lng: -49.5299 },
  { name: "Pinhais", baseMin: 30, baseMax: 45, neighborhoods: ["Centro", "Weissópolis", "Pineville"], lat: -25.4428, lng: -49.1927 },
];

// Map detected city names to region indices
const cityToRegionMap: Record<string, number[]> = {
  "curitiba": [0, 1, 2, 3],
  "são josé dos pinhais": [4],
  "araucária": [5],
  "campo largo": [6],
  "pinhais": [7],
  "colombo": [1], // closest to north
  "almirante tamandaré": [1],
  "fazenda rio grande": [2],
  "piraquara": [4],
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface RouteResult {
  id: string;
  durationSeconds: number;
  distanceKm: number;
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m > 0 ? m : ''}`;
  }
  return `${minutes} min`;
}

function getTimeMultiplier(): { multiplier: number; label: string } {
  const hour = new Date().getHours();
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return { multiplier: 1.8, label: "Horário de pico – trânsito intenso" };
  }
  if ((hour >= 10 && hour <= 12) || (hour >= 14 && hour <= 16)) {
    return { multiplier: 1.2, label: "Trânsito moderado" };
  }
  if (hour >= 12 && hour <= 14) {
    return { multiplier: 1.0, label: "Trânsito leve" };
  }
  if (hour < 7 || hour >= 20) {
    return { multiplier: 1.0, label: "Trânsito livre" };
  }
  return { multiplier: 1.0, label: "Trânsito normal" };
}

function calcFallbackTime(baseMin: number, baseMax: number, multiplier: number): string {
  const min = Math.round(baseMin * multiplier);
  const max = Math.round(baseMax * multiplier);
  if (max >= 60) {
    const minH = Math.floor(min / 60);
    const minM = min % 60;
    const maxH = Math.floor(max / 60);
    const maxM = max % 60;
    if (minH >= 1 && maxH >= 1) {
      return `${minH}h${minM > 0 ? minM : ''} - ${maxH}h${maxM > 0 ? maxM : ''}`;
    }
    return `${min} - ${maxH}h${maxM > 0 ? maxM : ''}`;
  }
  return `${min}-${max} min`;
}

const MAX_VISIBLE = 4;

export const CoverageMapSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [trafficInfo, setTrafficInfo] = useState(getTimeMultiplier);
  const [routeData, setRouteData] = useState<RouteResult[] | null>(null);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const { city } = useGeolocation();

  // Pick which regions to show based on detected city
  const visibleIndices = useMemo(() => {
    const cityKey = city.toLowerCase();
    const matched = cityToRegionMap[cityKey] || [];

    if (matched.length > 0) {
      const remaining = Array.from({ length: regions.length }, (_, i) => i)
        .filter(i => !matched.includes(i));
      const shuffled = shuffleArray(remaining);
      const needed = MAX_VISIBLE - matched.length;
      return [...matched, ...shuffled.slice(0, Math.max(0, needed))];
    }

    // No match — pick 4 random, always include one Curitiba
    const curitibaIdx = Math.floor(Math.random() * 4); // 0-3
    const others = shuffleArray([4, 5, 6, 7]).slice(0, MAX_VISIBLE - 1);
    return shuffleArray([curitibaIdx, ...others]);
  }, [city]);

  const fetchRoutes = useCallback(async () => {
    try {
      const destinations = regions.map((r, i) => ({
        id: String(i),
        lng: r.lng,
        lat: r.lat,
      }));

      const { data, error } = await supabase.functions.invoke('ors-route', {
        body: { destinations },
      });

      if (error) throw error;

      if (data?.results) {
        setRouteData(data.results);
      }
    } catch (err) {
      console.warn('ORS route fetch failed, using estimates:', err);
    } finally {
      setIsLoadingRoutes(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficInfo(getTimeMultiplier());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle through visible regions only
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % visibleIndices.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [visibleIndices.length]);

  const computedRegions = useMemo(() =>
    visibleIndices.map(i => {
      const r = regions[i];
      const route = routeData?.find(rd => rd.id === String(i));
      if (route) {
        const adjustedSeconds = route.durationSeconds + 25 * 60;
        return {
          ...r,
          time: formatDuration(adjustedSeconds),
          distance: `${route.distanceKm} km`,
          isReal: true,
          originalIndex: i,
        };
      }
      return {
        ...r,
        time: calcFallbackTime(r.baseMin, r.baseMax, trafficInfo.multiplier),
        distance: null,
        isReal: false,
        originalIndex: i,
      };
    }),
  [visibleIndices, routeData, trafficInfo.multiplier]);

  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 8 && currentHour < 20;
  const hasRealData = routeData !== null && routeData.length > 0;

  return (
    <section className="py-12 md:py-16 bg-secondary relative overflow-hidden mesh-gradient-warm noise-overlay">
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none orb-float" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none orb-float-reverse" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4 shimmer-sweep float-badge">
            <Navigation className="h-4 w-4" />
            Atendimento Rápido em Toda Região
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 reveal-text">
            Área de Cobertura e Tempo de Chegada
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 reveal-text" data-reveal-delay="100">
            Atendemos Curitiba e região metropolitana com agilidade. Tempos calculados com base em rotas reais de trânsito.
          </p>
          <div className="glow-separator max-w-xs mx-auto mb-6" />
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="text-center slide-up-stagger" style={{ animationDelay: '0ms' }}>
              <p className="text-2xl md:text-3xl font-bold text-accent glow-pulse-text"><AnimatedCounter end={8} /> </p>
              <p className="text-xs text-muted-foreground">Cidades atendidas</p>
            </div>
            <div className="text-center slide-up-stagger" style={{ animationDelay: '100ms' }}>
              <p className="text-2xl md:text-3xl font-bold text-foreground"><AnimatedCounter end={30} suffix="+" /></p>
              <p className="text-xs text-muted-foreground">Bairros cobertos</p>
            </div>
            <div className="text-center slide-up-stagger" style={{ animationDelay: '200ms' }}>
              <p className="text-2xl md:text-3xl font-bold text-foreground"><AnimatedCounter end={30} suffix=" min" /></p>
              <p className="text-xs text-muted-foreground">Tempo médio de chegada</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Mapa Interativo */}
          <MouseGlow className="rounded-xl">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-border bg-background hover:shadow-[var(--shadow-xl)] transition-shadow duration-500">
              <div className="aspect-[4/3] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115063.98825866027!2d-49.35951754843749!3d-25.494912899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce35351c67f2f%3A0xf9e5a1e1d08a0c6a!2sCuritiba%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v1705000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Área de cobertura - Técnico de Informática Curitiba"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-xs rounded-lg p-3 shadow-md border border-border">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 pulse-dot" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
                    </span>
                    <span className="font-medium text-foreground">
                      {isBusinessHours ? "Atendimento conforme a agenda" : "Próximo atendimento às 8h"}
                    </span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {hasRealData ? "Rotas reais via ORS" : trafficInfo.label}
                  </span>
                </div>
              </div>
            </div>
          </MouseGlow>

          {/* Lista de Regiões com Tempos */}
          <div className="space-y-3">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4 hover-streak">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {hasRealData
                      ? "Tempo real de deslocamento (rota calculada)"
                      : "Tempo médio de chegada após confirmação"}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {hasRealData ? (
                      <>⏱ Tempo estimado inclui preparo e deslocamento</>
                    ) : (
                      <>⏱ Agora: <span className="font-medium text-foreground">{trafficInfo.label}</span> — tempos ajustados em tempo real</>
                    )}
                  </p>
                  {isLoadingRoutes && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Calculando rotas reais...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              {computedRegions.map((region, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={region.originalIndex}
                    onClick={() => setActiveIndex(index)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-500 hover:-translate-y-0.5 ${
                      isActive
                        ? "glass-card border-accent/40 shadow-md bg-accent/5"
                        : "glass-card hover:border-accent/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-500 ${
                          isActive ? "bg-accent scale-125 shadow-[0_0_8px_hsl(var(--accent)/0.5)]" : "bg-muted-foreground/30"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className={`font-semibold text-sm transition-colors duration-300 ${isActive ? "text-accent" : "text-foreground"}`}>
                          {region.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {region.neighborhoods.slice(0, 3).join(" · ")}
                          {region.neighborhoods.length > 3 && " …"}
                          {region.distance && (
                            <span className="ml-1.5 text-accent font-medium">({region.distance})</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-500 ${
                          isActive
                            ? "bg-accent text-accent-foreground shadow-xs"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {region.time}
                      </div>
                      {region.isReal && (
                        <span className="text-[9px] text-accent font-medium bg-accent/10 px-1.5 py-0.5 rounded">real</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors duration-300">
              <p className="text-sm text-center text-foreground">
                <span className="font-semibold">Não encontrou sua região?</span>{" "}
                <a
                  href="https://wa.me/5541997086380?text=Olá! Gostaria de saber se vocês atendem na minha região."
                  data-cta-location="coverage_region_check"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-medium underline-grow"
                >
                  Consulte pelo WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
