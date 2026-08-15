import { useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowLeft, ArrowRight, Check, Download, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { trackCTAClick } from "@/lib/analytics";
import { downloadMontagemChecklistPdf } from "@/lib/montagemChecklistPdf";
import { downloadMontagemOsPdf, gerarProtocoloMontagem } from "@/lib/montagemOsPdf";
import { trackOsPdfDownload } from "@/lib/funnelAnalytics";
import { TERMOS_URL } from "@/lib/precosConfig";
import { saveOsRecord } from "@/lib/osRegistry";

/**
 * Mini-wizard de montagem: coleta configuração pretendida, origem das peças e
 * uso, exige aceite das condições e abre o funil de WhatsApp com a mensagem
 * pronta. Não expõe número nem link direto — dispara `wa-funnel:open`.
 */

const USOS = [
  "Trabalho e escritório",
  "Estudos e uso doméstico",
  "Jogos",
  "Edição de vídeo, foto ou 3D",
  "Desenvolvimento / programação",
  "Ainda não sei — preciso de orientação",
];

const ORIGEM_PECAS = [
  { id: "cliente", label: "Já tenho todas as peças" },
  { id: "parcial", label: "Tenho algumas peças" },
  { id: "consultoria", label: "Não tenho peças — quero orientação" },
];

const MODALIDADES_WIZARD = ["Bancada (coleta e entrega)", "No local", "Ainda não sei"];

const PERIODOS = ["Manhã (8h–12h)", "Tarde (13h–18h)", "Qualquer período"];

const STEPS = ["Configuração", "Peças", "Aceite"] as const;

export const MontagemWizard = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [modelo, setModelo] = useState("");
  const [uso, setUso] = useState("");
  const [origem, setOrigem] = useState("");
  const [pecas, setPecas] = useState("");
  const [identificacao, setIdentificacao] = useState("");
  const [enviaFotos, setEnviaFotos] = useState(false);
  const [cidade, setCidade] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [diaPreferido, setDiaPreferido] = useState("");
  const [aceite, setAceite] = useState(false);
  const [lgpd, setLgpd] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [gerandoOs, setGerandoOs] = useState(false);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [tentou, setTentou] = useState(false);

  const origemLabel = ORIGEM_PECAS.find((o) => o.id === origem)?.label || "";

  const janela = useMemo(() => {
    const dia = diaPreferido
      ? new Date(`${diaPreferido}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" })
      : "";
    return [dia, periodo].filter(Boolean).join(" · ");
  }, [diaPreferido, periodo]);

  const mensagem = useMemo(() => {
    return [
      "Olá! Quero montar/configurar um computador.",
      protocolo ? `• Ordem de serviço aberta: ${protocolo}` : "",
      modelo ? `• Configuração pretendida: ${modelo}` : "",
      uso ? `• Uso pretendido: ${uso}` : "",
      origemLabel ? `• Peças: ${origemLabel}` : "",
      pecas.trim() ? `• Peças que já tenho: ${pecas.trim()}` : "",
      identificacao.trim() ? `• Identificação (série/nota): ${identificacao.trim()}` : "",
      enviaFotos ? "• Vou enviar fotos das peças aqui pelo atendimento." : "",
      cidade.trim() ? `• Cidade/bairro: ${cidade.trim()}` : "",
      modalidade ? `• Modalidade preferida: ${modalidade}` : "",
      janela ? `• Janela preferida: ${janela}` : "",
      "• Li e aceito as condições, os valores e a política de peças do cliente.",
      lgpd ? "• Autorizo o uso dos dados e arquivos enviados apenas para este atendimento (LGPD)." : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [modelo, uso, origemLabel, pecas, identificacao, enviaFotos, cidade, modalidade, janela, protocolo, lgpd]);

  // Campos obrigatórios pendentes no passo atual — usados para o destaque pulsante.
  const pendentes: string[] =
    step === 0
      ? [...(modelo.trim().length < 3 ? ["modelo"] : []), ...(!uso ? ["uso"] : [])]
      : step === 1
        ? !origem
          ? ["origem"]
          : []
        : [...(!aceite ? ["aceite"] : []), ...(!lgpd ? ["lgpd"] : [])];

  const invalido = (campo: string) => tentou && pendentes.includes(campo);
  const alerta = (campo: string) => (invalido(campo) ? " field-alert" : "");

  const focarPendente = () => {
    setTentou(true);
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(".field-alert");
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      (el?.querySelector("input,textarea,button") as HTMLElement | null)?.focus?.();
    });
  };

  const avancar = () => {
    if (pendentes.length > 0) {
      focarPendente();
      return;
    }
    setTentou(false);
    setStep((s) => s + 1);
  };

  const enviar = () => {
    if (pendentes.length > 0) {
      focarPendente();
      return;
    }
    trackCTAClick("whatsapp", "wizard_montagem");
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", {
        detail: { location: "wizard_montagem", message: mensagem },
      }),
    );
  };

  const baixarChecklist = async () => {
    setGerando(true);
    try {
      await downloadMontagemChecklistPdf();
      toast({ title: "Checklist gerado", description: "O PDF do checklist final de entrega foi baixado." });
    } catch {
      toast({ title: "Não foi possível gerar o PDF", description: "Tente novamente em instantes.", variant: "destructive" });
    } finally {
      setGerando(false);
    }
  };

  const baixarOs = async () => {
    if (pendentes.length > 0) {
      focarPendente();
      return;
    }
    setGerandoOs(true);
    const numero = protocolo ?? gerarProtocoloMontagem();
    if (!protocolo) setProtocolo(numero);
    try {
      await downloadMontagemOsPdf({
        protocolo: numero,
        modelo,
        uso,
        origemPecas: origemLabel,
        pecas: pecas.trim() || undefined,
        identificacaoPecas: identificacao.trim() || undefined,
        enviaFotos,
        cidade: cidade.trim() || undefined,
        modalidade: modalidade || undefined,
        janela: janela || undefined,
        consentimentoLgpd: lgpd,
      });
      saveOsRecord({
        protocolo: numero,
        criadoEm: Date.now(),
        servico: "Montagem e configuração de computador",
        modelo: modelo.trim() || undefined,
        cidade: cidade.trim() || undefined,
        modalidade: modalidade || undefined,
        janela: janela || undefined,
      });
      trackOsPdfDownload({ protocolo: numero, origem: "wizard_montagem", servico: "montagem-de-pc" });
      toast({
        title: `Ordem de serviço ${numero}`,
        description: "PDF baixado — acompanhe o andamento em /status-da-ordem-de-servico.",
      });

    } catch {
      toast({ title: "Não foi possível gerar o PDF", description: "Tente novamente em instantes.", variant: "destructive" });
    } finally {
      setGerandoOs(false);
    }
  };

  return (
    <section className="border-t border-border/60 py-14" id="wizard-montagem">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-2xl font-bold md:text-3xl">Monte sua solicitação em 3 passos</h2>
        <p className="mt-3 text-muted-foreground">
          Responda o essencial e a mensagem sai pronta para a triagem: configuração, origem das peças e
          modalidade. Sem preço fechado antes da verificação de compatibilidade.
        </p>

        <ol className="mt-6 flex gap-2" aria-label="Etapas do wizard">
          {STEPS.map((label, i) => (
            <li
              key={label}
              aria-current={i === step ? "step" : undefined}
              className={`flex-1 rounded-lg border px-3 py-2 text-center text-xs font-medium ${
                i === step
                  ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 text-foreground"
                  : i < step
                    ? "border-border bg-muted/40 text-muted-foreground"
                    : "border-border/60 text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="mx-auto h-4 w-4" aria-hidden="true" /> : `${i + 1}.`} {label}
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-xl border border-border bg-card p-5 space-y-5">
          {step === 0 && (
            <>
              <div className={`space-y-2 rounded-lg${alerta("modelo")}`}>
                <Label htmlFor="wz-modelo">
                  Configuração ou modelo pretendido <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="wz-modelo"
                  maxLength={160}
                  required
                  aria-invalid={invalido("modelo")}
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  placeholder="Ex.: desktop novo com Ryzen 5, 16 GB e SSD 1 TB"
                />
                {(invalido("modelo") || (modelo.trim().length > 0 && modelo.trim().length < 3)) && (
                  <p className="text-xs font-medium text-destructive">
                    Preencha este campo com pelo menos 3 caracteres.
                  </p>
                )}
              </div>
              <div className={`space-y-2 p-1${alerta("uso")}`}>
                <span className="text-sm font-medium">
                  Uso pretendido <span className="text-destructive">*</span>
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {USOS.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUso(u)}
                      aria-pressed={uso === u}
                      className={`min-h-11 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        uso === u ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
                {invalido("uso") && (
                  <p className="text-xs font-medium text-destructive">Selecione uma opção de uso.</p>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className={`space-y-2 p-1${alerta("origem")}`}>
                <span className="text-sm font-medium">
                  Quem fornece as peças? <span className="text-destructive">*</span>
                </span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {ORIGEM_PECAS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setOrigem(o.id)}
                      aria-pressed={origem === o.id}
                      className={`min-h-11 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        origem === o.id ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {invalido("origem") && (
                  <p className="text-xs font-medium text-destructive">Escolha quem fornece as peças.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="wz-pecas">Peças que você já tem (opcional)</Label>
                <Textarea
                  id="wz-pecas"
                  maxLength={600}
                  rows={3}
                  value={pecas}
                  onChange={(e) => setPecas(e.target.value)}
                  placeholder="Placa-mãe, processador, memória, fonte, gabinete, SSD..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wz-identificacao">Identificação das peças (opcional)</Label>
                <Textarea
                  id="wz-identificacao"
                  maxLength={400}
                  rows={2}
                  value={identificacao}
                  onChange={(e) => setIdentificacao(e.target.value)}
                  placeholder="Número de série, nota fiscal, se está lacrada, se é usada..."
                />
                <p className="text-xs text-muted-foreground">
                  Quanto mais identificada a peça, menos retrabalho na conferência.
                </p>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/20 p-4 text-sm">
                <Checkbox
                  checked={enviaFotos}
                  onCheckedChange={(v) => setEnviaFotos(v === true)}
                  aria-label="Vou enviar fotos das peças"
                />
                <span className="text-muted-foreground">
                  Vou enviar <strong className="text-foreground">fotos das peças</strong> no atendimento (placa-mãe,
                  fonte, memória e etiquetas). As imagens são enviadas direto na conversa — o site não armazena
                  arquivos.
                </span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wz-cidade">Cidade e bairro</Label>
                  <Input
                    id="wz-cidade"
                    maxLength={80}
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Ex.: Curitiba – Portão"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Modalidade</span>
                  <div className="flex flex-wrap gap-2">
                    {MODALIDADES_WIZARD.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModalidade(m)}
                        aria-pressed={modalidade === m}
                        className={`rounded-full border px-3 py-1.5 text-xs transition ${
                          modalidade === m ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10" : "border-border hover:bg-muted/50"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-4 rounded-lg border border-border bg-muted/20 p-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wz-dia">Dia preferido (opcional)</Label>
                  <Input
                    id="wz-dia"
                    type="date"
                    value={diaPreferido}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDiaPreferido(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Período preferido</span>
                  <div className="flex flex-wrap gap-2">
                    {PERIODOS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPeriodo(periodo === p ? "" : p)}
                        aria-pressed={periodo === p}
                        className={`min-h-9 rounded-full border px-3 py-1.5 text-xs transition ${
                          periodo === p ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10" : "border-border hover:bg-muted/50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A preferência vai junto na mensagem e na ordem de serviço. A confirmação da agenda é feita no
                    atendimento.
                  </p>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
                  Resumo que será enviado
                </p>
                <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">{mensagem}</pre>
              </div>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 text-sm${alerta("aceite")}`}
              >
                <Checkbox checked={aceite} onCheckedChange={(v) => setAceite(v === true)} aria-label="Aceite das condições" />
                <span className="text-muted-foreground">
                  Li e aceito os{" "}
                  <Link to={TERMOS_URL} className="font-medium text-[hsl(var(--accent))] underline">
                    termos e condições
                  </Link>
                  , os{" "}
                  <Link to="/precos-e-politicas" className="font-medium text-[hsl(var(--accent))] underline">
                    preços e políticas
                  </Link>{" "}
                  e a{" "}
                  <Link to="/politica-de-pecas-do-cliente" className="font-medium text-[hsl(var(--accent))] underline">
                    política de peças do cliente
                  </Link>
                  , incluindo a regra de valor declarado e depreciação do equipamento.{" "}
                  <span className="text-destructive">*</span>
                </span>
              </label>
              {invalido("aceite") && (
                <p className="text-xs font-medium text-destructive">Marque o aceite das condições para continuar.</p>
              )}

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/20 p-4 text-sm${alerta("lgpd")}`}
              >
                <Checkbox checked={lgpd} onCheckedChange={(v) => setLgpd(v === true)} aria-label="Consentimento LGPD" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Consentimento (LGPD):</strong> autorizo o uso dos dados desta
                  solicitação (configuração, peças, cidade/bairro) e das fotos que eu enviar no atendimento{" "}
                  <strong className="text-foreground">exclusivamente</strong> para triagem, definição de valor e execução deste
                  serviço. Os dados ficam no histórico da conversa de WhatsApp e na ordem de serviço; o site não
                  armazena arquivos. Posso pedir a exclusão a qualquer momento pelo próprio atendimento.{" "}
                  <span className="text-destructive">*</span>
                </span>
              </label>
              {invalido("lgpd") && (
                <p className="text-xs font-medium text-destructive">
                  É preciso autorizar o uso dos dados para abrir o atendimento.
                </p>
              )}
            </>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => {
                setTentou(false);
                setStep((s) => Math.max(0, s - 1));
              }}
              disabled={step === 0}
            >
              <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" /> Voltar
            </Button>

            {step < 2 ? (
              <Button type="button" className="w-full sm:w-auto" onClick={avancar}>
                Continuar <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={baixarOs}
                  disabled={pendentes.length > 0 || gerandoOs}
                >
                  <FileText className="mr-1 h-4 w-4" aria-hidden="true" />
                  {gerandoOs ? "Gerando OS..." : "Gerar ordem de serviço (PDF)"}
                </Button>
                <Button type="button" className="w-full sm:w-auto" onClick={enviar} data-cta-location="wizard_montagem">
                  <MessageCircle className="mr-1 h-4 w-4" aria-hidden="true" /> Enviar para o técnico
                </Button>
              </div>
            )}
          </div>
          {protocolo && (
            <p className="pt-1 text-xs text-muted-foreground">
              Ordem de serviço <strong className="text-foreground">{protocolo}</strong> gerada. O número vai junto na
              mensagem enviada ao técnico como prova de abertura.
            </p>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-border bg-muted/20 p-5">
          <h3 className="font-semibold">Checklist final de entrega em PDF</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Baixe a lista de verificações executadas antes da entrega (BIOS/UEFI, drivers oficiais, memória,
            temperatura e estabilidade). O mesmo checklist é enviado no atendimento após a montagem.
          </p>
          <Button type="button" variant="outline" className="mt-4" onClick={baixarChecklist} disabled={gerando}>
            <Download className="mr-1 h-4 w-4" aria-hidden="true" /> {gerando ? "Gerando PDF..." : "Baixar checklist (PDF)"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MontagemWizard;
