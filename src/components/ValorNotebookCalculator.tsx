import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, Calculator } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

/**
 * Calculadora de valor — Conserto de Notebook em Curitiba.
 * Mobile-first, acessível (labels + radiogroup), plug-and-play.
 * Estima faixa de preço com base em problema + marca + cidade
 * e gera mensagem pré-preenchida no WhatsApp.
 *
 * Política de preço:
 * - Mínimo: R$ 99,99 (diagnóstico/formatação rápida — até 30 min).
 * - Faixa é estimativa, sempre fechada após diagnóstico real.
 */

const WHATSAPP_NUMBER = "5541997086380";

type Problema = {
  id: string;
  label: string;
  min: number;
  max: number;
  tempo: string;
};

const PROBLEMAS: Problema[] = [
  { id: "formatacao", label: "Formatação / lentidão", min: 99.99, max: 180, tempo: "30 min – 2h" },
  { id: "tela", label: "Tela trincada ou sem imagem", min: 350, max: 900, tempo: "24h após peça" },
  { id: "teclado", label: "Teclado / líquido derramado", min: 220, max: 550, tempo: "24h" },
  { id: "bateria", label: "Bateria não segura carga", min: 250, max: 600, tempo: "Conforme agenda" },
  { id: "carga", label: "Não carrega / conector solto", min: 180, max: 420, tempo: "24h" },
  { id: "naoliga", label: "Não liga / sem vídeo", min: 199, max: 1200, tempo: "2 – 7 dias" },
  { id: "esquenta", label: "Esquenta / desliga sozinho", min: 149, max: 320, tempo: "24h" },
  { id: "placa", label: "Reparo de placa-mãe / BGA", min: 450, max: 1800, tempo: "3 – 7 dias" },
  { id: "ssd", label: "Upgrade SSD / Memória", min: 199, max: 750, tempo: "Conforme agenda" },
];

const MARCAS = [
  "Dell", "HP", "Lenovo", "Acer", "Asus", "Samsung",
  "Apple / MacBook", "Positivo", "Vaio", "LG", "Microsoft Surface", "Outra",
];

const CIDADES = [
  "Curitiba", "Pinhais", "São José dos Pinhais", "Colombo", "Araucária",
  "Campo Largo", "Almirante Tamandaré", "Fazenda Rio Grande", "Piraquara", "Quatro Barras",
];

const MARCA_MULTIPLIER: Record<string, number> = {
  "Apple / MacBook": 1.6,
  "Microsoft Surface": 1.45,
  Vaio: 1.2,
};

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ValorNotebookCalculator = ({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) => {
  const [problemaId, setProblemaId] = useState<string>(PROBLEMAS[0].id);
  const [marca, setMarca] = useState<string>("Dell");
  const [cidade, setCidade] = useState<string>("Curitiba");

  const problema = useMemo(
    () => PROBLEMAS.find((p) => p.id === problemaId) ?? PROBLEMAS[0],
    [problemaId],
  );

  const mult = MARCA_MULTIPLIER[marca] ?? 1;
  const min = Math.max(99.99, Math.round(problema.min * mult * 100) / 100);
  const max = Math.round(problema.max * mult);

  const handleWhats = () => {
    trackCTAClick("whatsapp", "calculadora-valor-notebook");
    const msg = encodeURIComponent(
      `Olá! Usei a calculadora do site e gostaria de um valor:\n\n` +
        `• Problema: ${problema.label}\n` +
        `• Marca: ${marca}\n` +
        `• Cidade: ${cidade}\n` +
        `• Estimativa do site: ${fmt(min)} – ${fmt(max)}\n` +
        `• Prazo estimado: ${problema.tempo}\n\n` +
        `Podem confirmar o valor fechado?`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div
      className={`bg-background border border-accent/20 rounded-2xl shadow-lg p-5 md:p-7 ${
        variant === "compact" ? "max-w-xl" : "max-w-2xl"
      } mx-auto`}
      data-funnel-skip="1"
      aria-label="Calculadora de valor de conserto de notebook em Curitiba"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-accent" aria-hidden />
        <h3 className="text-lg md:text-xl font-heading font-bold text-foreground">
          Calculadora de valor — Conserto de Notebook
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Em 3 cliques você vê a faixa estimada. A partir de{" "}
        <strong>R$ 99,99 — formatação em até 30 minutos</strong>. Valor fechado sempre após diagnóstico.
      </p>

      <fieldset className="mb-5">
        <legend className="block mb-2">
          <Label className="text-sm font-semibold">1. Qual o problema?</Label>
        </legend>
        <RadioGroup
          value={problemaId}
          onValueChange={setProblemaId}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          {PROBLEMAS.map((p) => (
            <label
              key={p.id}
              htmlFor={`prob-${p.id}`}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-sm transition-colors ${
                problemaId === p.id
                  ? "border-accent bg-accent/10"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <RadioGroupItem value={p.id} id={`prob-${p.id}`} />
              <span className="text-foreground">{p.label}</span>
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <Label htmlFor="marca-select" className="text-sm font-semibold">
            2. Marca do notebook
          </Label>
          <select
            id="marca-select"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {MARCAS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cidade-select" className="text-sm font-semibold">
            3. Cidade / região
          </Label>
          <select
            id="cidade-select"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {CIDADES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="rounded-xl bg-secondary p-4 mb-5 text-center"
        aria-live="polite"
        role="status"
      >
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
          Estimativa para {problema.label.toLowerCase()} • {marca}
        </p>
        <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          {fmt(min)} <span className="text-muted-foreground text-lg">–</span> {fmt(max)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Prazo estimado: <strong>{problema.tempo}</strong> • {cidade} e região
        </p>
      </div>

      <Button
        size="lg"
        onClick={handleWhats}
        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-[0_0_24px_rgba(37,211,102,0.3)] hover:shadow-[0_0_32px_rgba(37,211,102,0.5)] transition-all duration-300"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Confirmar valor do atendimento no WhatsApp
      </Button>

      <p className="text-[11px] text-muted-foreground mt-3 text-center">
        Valores estimados com base em casos atendidos em Curitiba. Valor final é
        sempre fechado após diagnóstico — você só paga se aprovar.
      </p>
      {/* Hidden input para acessibilidade de leitores de tela com a faixa atual */}
      <Input type="hidden" value={`${min}-${max}`} readOnly aria-hidden />
    </div>
  );
};

export default ValorNotebookCalculator;
