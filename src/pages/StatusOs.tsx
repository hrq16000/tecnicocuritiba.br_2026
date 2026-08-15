import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/lib/router-compat";
import QRCode from "qrcode";
import {
  Search,
  Clock,
  FileText,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Star,
  History,
} from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addOsEvento,
  findOsRecord,
  isValidOsNumero,
  listOsRecords,
  normalizeOsNumero,
  osTimeline,
  OS_ETAPAS,
  type OsRecord,
} from "@/lib/osRegistry";
import { buildOnsiteReviewUrl } from "@/lib/reviewRequest";
import { readUtms } from "@/lib/utmCapture";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { trackCTAClick } from "@/lib/analytics";
import { ConsultaOsPorCelular } from "@/components/os/ConsultaOsPorCelular";

const PATH = "/status-da-ordem-de-servico";
const BASE_URL = "https://tecnico.curitiba.br";

type Estado = "idle" | "vazio" | "invalido" | "nao-encontrado" | "encontrado";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Onde encontro o número da minha ordem de serviço?",
    a: "O número aparece no PDF da ordem de serviço enviado no atendimento e na confirmação do wizard. O formato é OS-MTG-AAAAMMDD-0000, onde AAAAMMDD é a data de abertura.",
  },
  {
    q: "Por que a consulta não encontra a minha OS?",
    a: "O site não guarda dados pessoais em servidor: o histórico fica salvo apenas no navegador em que a ordem foi aberta. Se você abriu em outro celular, computador ou aba anônima, a consulta não localiza o registro — nesse caso confirme a etapa pelo atendimento no WhatsApp com o número em mãos.",
  },
  {
    q: "Quanto tempo leva cada etapa do atendimento?",
    a: "Triagem em até 1 dia útil, conferência de peças em até 1 dia útil após a triagem, aprovação do escopo em até 1 dia útil e execução entre 1 e 3 dias úteis conforme o serviço. Prazos são estimados para escopo padrão.",
  },
  {
    q: "O prazo pode mudar depois de aberto?",
    a: "Pode, quando aparece defeito adicional na conferência, quando há dependência de peça do cliente ou atraso de fornecedor. Toda alteração de prazo é avisada antes e fica registrada na linha do tempo da OS.",
  },
  {
    q: "Como recebo de novo o link de avaliação?",
    a: "Na consulta da OS existe o botão para reenviar o link de avaliação. Ele mantém a mesma origem de campanha do acesso e abre o atendimento com o link pronto para envio.",
  },
];

const fmt = (ms: number) =>
  new Date(ms).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const StatusOs = () => {
  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [resultado, setResultado] = useState<OsRecord | undefined>();
  const [copiado, setCopiado] = useState<"link" | "avaliacao" | null>(null);
  const historico = useMemo(() => listOsRecords(), []);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${BASE_URL}${PATH}#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
    [],
  );
  useJsonLdSlot(SCHEMA_SLOTS.faq, faqSchema, SLOT_PRIORITY.page);

  const consultar = useCallback((valor: string) => {
    const limpo = normalizeOsNumero(valor);
    setNumero(limpo);
    if (!limpo) {
      setResultado(undefined);
      setEstado("vazio");
      return;
    }
    if (!isValidOsNumero(limpo)) {
      setResultado(undefined);
      setEstado("invalido");
      return;
    }
    const found = findOsRecord(limpo);
    setResultado(found);
    setEstado(found ? "encontrado" : "nao-encontrado");
    if (found) {
      addOsEvento(found.protocolo, { titulo: "Consulta de status pelo site", tipo: "sistema" });
    }
  }, []);

  useEffect(() => {
    const os = new URL(window.location.href).searchParams.get("os");
    if (os) consultar(os);
  }, [consultar]);

  const shareUrl = resultado ? `${BASE_URL}${PATH}?os=${encodeURIComponent(resultado.protocolo)}` : "";

  useEffect(() => {
    if (!shareUrl || !qrRef.current) return;
    void QRCode.toCanvas(qrRef.current, shareUrl, {
      width: 148,
      margin: 1,
      color: { dark: "#0b1320", light: "#ffffff" },
    });
  }, [shareUrl]);

  const timeline = useMemo(() => (resultado ? osTimeline(resultado) : []), [resultado, estado]);

  const reviewUrl = useMemo(() => {
    if (!resultado) return "";
    const utms = readUtms();
    const url = new URL(
      buildOnsiteReviewUrl({ protocolo: resultado.protocolo, servico: resultado.servico, bairro: resultado.cidade }),
    );
    // Preserva a origem real do usuário quando existir (UTMs capturados na sessão).
    Object.entries(utms).forEach(([k, v]) => v && url.searchParams.set(k, v));
    return url.toString();
  }, [resultado]);

  const copiar = async (texto: string, tipo: "link" | "avaliacao") => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(tipo);
      window.setTimeout(() => setCopiado(null), 2200);
    } catch {
      /* clipboard bloqueado — o link segue visível para cópia manual */
    }
  };

  const abrirWhatsApp = (contexto: "consulta" | "avaliacao" = "consulta") => {
    trackCTAClick("whatsapp", `status_os_${contexto}`);
    const mensagem =
      contexto === "avaliacao"
        ? [
            "Olá! Quero receber novamente o link para avaliar o atendimento.",
            resultado ? `• Número da OS: ${resultado.protocolo}` : "• Número da OS: (não tenho em mãos)",
            reviewUrl ? `• Link de avaliação: ${reviewUrl}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        : [
            "Olá! Quero consultar o andamento da minha ordem de serviço.",
            numero.trim() ? `• Número da OS: ${numero.trim()}` : "• Número da OS: (não tenho em mãos)",
            "• Quero saber a etapa atual e o prazo estimado de entrega.",
          ].join("\n");
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", { detail: { location: `status_os_${contexto}`, message: mensagem } }),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Status da ordem de serviço | Técnico em Curitiba"
        description="Consulte o andamento do seu atendimento pelo número da ordem de serviço: linha do tempo com data e hora, etapas, prazos estimados e como falar com o técnico responsável."
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Status da ordem de serviço", path: PATH },
        ]}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-4xl">
            Status da ordem de serviço
          </h1>
          <p className="mt-4 text-muted-foreground">
            Informe o número da OS gerada no atendimento (formato <strong>OS-MTG-AAAAMMDD-0000</strong>) para ver o
            registro salvo neste dispositivo, a linha do tempo com data e hora e as etapas previstas. A confirmação da
            etapa atual é sempre feita pelo técnico no atendimento.
          </p>

          <div className="mt-6">
            <ConsultaOsPorCelular />
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <Label htmlFor="os-numero">Número da ordem de serviço</Label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Input
                id="os-numero"
                value={numero}
                maxLength={40}
                inputMode="text"
                autoComplete="off"
                aria-invalid={estado === "invalido" || estado === "vazio"}
                aria-describedby="os-ajuda"
                onChange={(e) => setNumero(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && consultar(numero)}
                placeholder="OS-MTG-20260806-1234"
                className="flex-1"
              />
              <Button type="button" onClick={() => consultar(numero)} className="w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" aria-hidden="true" /> Consultar
              </Button>
            </div>
            <p id="os-ajuda" className="mt-2 text-xs text-muted-foreground">
              Formato aceito: <strong>OS</strong> + sigla do serviço + data (AAAAMMDD) + sequência. Exemplo:
              OS-MTG-20260806-1234.
            </p>

            {estado === "vazio" && (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" aria-hidden="true" />
                Digite o número da OS para consultar. Ele está no PDF enviado no atendimento.
              </p>
            )}

            {estado === "invalido" && (
              <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
                <p className="flex items-start gap-2 font-semibold text-foreground">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" aria-hidden="true" />
                  Número em formato inválido
                </p>
                <p className="mt-2 text-muted-foreground">
                  Confira se digitou no formato <strong>OS-MTG-AAAAMMDD-0000</strong> (com os traços). Se o número que
                  você tem for diferente, é só enviar como está no atendimento que localizamos para você.
                </p>
              </div>
            )}

            {estado === "nao-encontrado" && (
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 text-sm">
                <p className="font-semibold text-foreground">Não encontramos essa OS neste dispositivo</p>
                <p className="mt-2 text-muted-foreground">
                  Isso é normal se a ordem foi aberta em outro celular, navegador ou aba anônima — o site não guarda
                  seus dados em servidor. Consulte a etapa atual pelo atendimento, com o número em mãos.
                </p>
              </div>
            )}

            {estado === "encontrado" && resultado && (
              <div className="mt-5 rounded-lg border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 p-4 text-sm">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
                  OS {resultado.protocolo} localizada
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>Aberta em: {fmt(resultado.criadoEm)}</li>
                  <li>Serviço: {resultado.servico}</li>
                  {resultado.modelo && <li>Configuração: {resultado.modelo}</li>}
                  {resultado.cidade && <li>Cidade/bairro: {resultado.cidade}</li>}
                  {resultado.modalidade && <li>Modalidade: {resultado.modalidade}</li>}
                  {resultado.janela && <li>Janela preferida: {resultado.janela}</li>}
                </ul>
              </div>
            )}

            <Button type="button" variant="outline" className="mt-4 w-full sm:w-auto" onClick={() => abrirWhatsApp()}>
              <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" /> Consultar andamento no atendimento
            </Button>
          </div>

          {estado === "encontrado" && resultado && (
            <>
              <section className="mt-8 rounded-xl border border-border bg-card p-5">
                <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
                  <History className="h-5 w-5 text-[hsl(var(--accent))]" aria-hidden="true" />
                  Linha do tempo desta OS
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Última atualização registrada neste dispositivo em{" "}
                  <strong>{fmt(timeline[timeline.length - 1]?.em ?? resultado.criadoEm)}</strong>.
                </p>
                <ol className="mt-4 space-y-3 border-l border-border pl-4">
                  {timeline.map((evento, i) => (
                    <li key={`${evento.em}-${i}`} className="relative">
                      <span
                        className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--accent))]"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-foreground">{evento.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {fmt(evento.em)}
                        {evento.tipo === "prazo" && " · alteração de prazo"}
                      </p>
                      {evento.detalhe && <p className="mt-1 text-sm text-muted-foreground">{evento.detalhe}</p>}
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mt-6 rounded-xl border border-border bg-card p-5">
                <h2 className="font-heading text-xl font-bold text-foreground">Acompanhar e compartilhar</h2>
                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="shrink-0 rounded-xl bg-white p-3">
                    <canvas ref={qrRef} aria-label="QR Code para abrir a consulta desta OS no celular" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Aponte a câmera do celular para abrir esta consulta, ou copie o link direto da OS.
                    </p>
                    <p className="mt-2 break-all rounded-lg border border-border bg-muted/30 p-2 text-xs text-muted-foreground">
                      {shareUrl}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Button type="button" variant="outline" onClick={() => copiar(shareUrl, "link")}>
                        {copiado === "link" ? (
                          <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                        )}
                        {copiado === "link" ? "Link copiado" : "Copiar link da OS"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => copiar(reviewUrl, "avaliacao")}>
                        {copiado === "avaliacao" ? (
                          <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Star className="mr-2 h-4 w-4" aria-hidden="true" />
                        )}
                        {copiado === "avaliacao" ? "Link copiado" : "Copiar link de avaliação"}
                      </Button>
                      <Button type="button" onClick={() => abrirWhatsApp("avaliacao")}>
                        <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" /> Reenviar link de avaliação
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      O link de avaliação mantém a mesma origem de campanha do seu acesso, então a medição continua
                      correta mesmo depois do prazo inicial.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {historico.length > 0 && (
            <section className="mt-8">
              <h2 className="font-heading text-xl font-bold text-foreground">Ordens abertas neste dispositivo</h2>
              <ul className="mt-3 space-y-2">
                {historico.map((r) => (
                  <li key={r.protocolo}>
                    <button
                      type="button"
                      onClick={() => consultar(r.protocolo)}
                      className="w-full rounded-lg border border-border px-4 py-3 text-left text-sm transition hover:bg-muted/50"
                    >
                      <span className="font-medium text-foreground">{r.protocolo}</span>
                      <span className="block text-muted-foreground">
                        {fmt(r.criadoEm)} · {r.servico}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">
              Etapas e prazos estimados do atendimento
            </h2>
            <ol className="mt-4 space-y-3">
              {OS_ETAPAS.map((etapa) => (
                <li key={etapa.titulo} className="rounded-lg border border-border bg-card p-4">
                  <p className="font-semibold text-foreground">{etapa.titulo}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {etapa.prazo}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{etapa.descricao}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              Prazos estimados para escopo padrão. Dependência de peça do cliente, atraso de fornecedor ou defeito
              adicional identificado na conferência podem alterar a previsão — sempre com aviso antes, registrado na
              linha do tempo.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">
              Dúvidas frequentes sobre o acompanhamento da OS
            </h2>
            <dl className="mt-4 space-y-3">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-lg border border-border bg-card p-4">
                  <dt className="font-semibold text-foreground">{f.q}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link to="/ordem-de-servico" className="font-medium text-[hsl(var(--accent))] underline">
              <FileText className="mr-1 inline h-4 w-4" aria-hidden="true" />
              Como funciona a ordem de serviço
            </Link>
            <Link to="/politica-de-pecas-do-cliente" className="font-medium text-[hsl(var(--accent))] underline">
              Política de peças do cliente
            </Link>
            <Link to="/precos-e-politicas" className="font-medium text-[hsl(var(--accent))] underline">
              Preços e políticas
            </Link>
            <Link to="/como-avaliar" className="font-medium text-[hsl(var(--accent))] underline">
              Como avaliar o atendimento
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StatusOs;
