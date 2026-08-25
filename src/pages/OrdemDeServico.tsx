import { useEffect, useMemo, useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TermosCtaLink } from "@/components/TermosCtaLink";
import { LocalidadeInput } from "@/components/funnel/LocalidadeInput";
import { geoSuggestion, subscribeGeo } from "@/lib/geoContext";
import { trackCTAClick } from "@/lib/analytics";
import { MODALIDADES, REGRA_CANCELAMENTO, NOTA_VISITA_AVULSA } from "@/lib/precosConfig";
import { toast } from "sonner";

interface OsForm {
  nome: string;
  local: string;
  equipamento: string;
  marcaModelo: string;
  sintoma: string;
  acessorios: string;
  modalidadeId: string;
}

const gerarNumero = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `OS-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${rand}`;
};

const OrdemDeServico = () => {
  const [form, setForm] = useState<OsForm>(() => ({
    nome: "",
    local: geoSuggestion(),
    equipamento: "",
    marcaModelo: "",
    sintoma: "",
    acessorios: "",
    modalidadeId: MODALIDADES[0].id,
  }));
  const [numero, setNumero] = useState<string | null>(null);

  // Pré-preenche bairro/cidade assim que a detecção (IP ou precisa) resolver,
  // sem sobrescrever o que o usuário já digitou.
  useEffect(() => {
    const unsubscribe = subscribeGeo(() => {
      const sugestao = geoSuggestion();
      if (!sugestao) return;
      setForm((p) => (p.local.trim() ? p : { ...p, local: sugestao }));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const set = (k: keyof OsForm) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const modalidade = MODALIDADES.find((m) => m.id === form.modalidadeId) ?? MODALIDADES[0];

  const pronta =
    form.nome.trim().length >= 2 && form.equipamento.trim().length >= 2 && form.sintoma.trim().length >= 5;

  const resumo = useMemo(() => {
    const linhas = [
      `Ordem de serviço ${numero ?? ""}`.trim(),
      `Data: ${new Date().toLocaleDateString("pt-BR")}`,
      `Cliente: ${form.nome}`,
      form.local ? `Bairro/cidade: ${form.local}` : "",
      `Equipamento: ${form.equipamento}`,
      form.marcaModelo ? `Marca/modelo: ${form.marcaModelo}` : "",
      form.acessorios ? `Acessórios entregues: ${form.acessorios}` : "",
      `Problema relatado: ${form.sintoma}`,
      "",
      `Modalidade: ${modalidade.titulo}`,
      `Valor: ${modalidade.valorLabel} (${modalidade.unidade})`,
      ...modalidade.detalhes.map((d) => `- ${d}`),
      "",
      `Cancelamento: ${REGRA_CANCELAMENTO}`,
      NOTA_VISITA_AVULSA,
    ].filter(Boolean);
    return linhas.join("\n");
  }, [form, numero, modalidade]);

  const garantirNumero = async (): Promise<string | null> => {
    if (numero) return numero;
    if (!pronta) return null;
    setSalvando(true);
    try {
      const { protocolo } = await criarOs({
        data: {
          tipo,
          nome: form.nome.trim(),
          local: form.local.trim(),
          equipamento: form.equipamento.trim(),
          marcaModelo: form.marcaModelo.trim(),
          acessorios: form.acessorios.trim(),
          sintoma: form.sintoma.trim(),
          modalidadeId: modalidade.id,
          valorLabel: modalidade.valorLabel,
        },
      });
      setNumero(protocolo);
      return protocolo;
    } catch {
      toast.error("Não foi possível registrar a ordem de serviço agora. Tente novamente.");
      return null;
    } finally {
      setSalvando(false);
    }
  };

  const gerar = () => {
    void garantirNumero();
  };

  const mensagemWhatsApp = (n: string) =>
    mensagemWhatsAppOs({
      protocolo: n,
      tipo,
      nome: form.nome,
      local: form.local,
      equipamento: form.equipamento,
      marcaModelo: form.marcaModelo,
      acessorios: form.acessorios,
      sintoma: form.sintoma,
      modalidadeTitulo: modalidade.titulo,
      valorLabel: `${modalidade.valorLabel} (${modalidade.unidade})`,
    });

  const copiar = async () => {
    const n = await garantirNumero();
    if (!n) return;
    try {
      await navigator.clipboard.writeText(mensagemWhatsApp(n));
      toast.success("Conteúdo copiado — cole no WhatsApp.");
    } catch {
      toast.error("Não foi possível copiar automaticamente. Selecione o texto abaixo.");
    }
  };


  const baixarPdf = async () => {
    const n = await garantirNumero();
    if (!n) return;
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const M = 48;
    const W = doc.internal.pageSize.getWidth();
    let y = M;

    doc.setFillColor(15, 42, 56);
    doc.rect(0, 0, W, 84, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Ordem de serviço", M, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Técnico em Curitiba · tecnico.curitiba.br", M, 62);
    doc.setFontSize(11);
    doc.text(n, W - M, 42, { align: "right" });
    y = 116;

    doc.setTextColor(20, 28, 38);
    const linha = (label: string, valor: string) => {
      if (!valor) return;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(label, M, y);
      doc.setFont("helvetica", "normal");
      const partes = doc.splitTextToSize(valor, W - M * 2 - 130);
      doc.text(partes, M + 130, y);
      y += Math.max(16, partes.length * 14) + 4;
    };

    linha("Data", new Date().toLocaleDateString("pt-BR"));
    linha("Cliente", form.nome);
    linha("Bairro/cidade", form.local);
    linha("Equipamento", form.equipamento);
    linha("Marca/modelo", form.marcaModelo);
    linha("Acessórios", form.acessorios);
    linha("Problema relatado", form.sintoma);

    y += 8;
    doc.setDrawColor(210, 216, 222);
    doc.line(M, y, W - M, y);
    y += 24;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Modalidade e condições", M, y);
    y += 18;
    doc.setFontSize(10);
    doc.text(modalidade.titulo, M, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.text(`${modalidade.valorLabel} — ${modalidade.unidade}`, M, y);
    y += 18;
    for (const d of modalidade.detalhes) {
      const partes = doc.splitTextToSize(`• ${d}`, W - M * 2);
      doc.text(partes, M, y);
      y += partes.length * 13 + 2;
    }

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Cancelamento", M, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    const cancel = doc.splitTextToSize(REGRA_CANCELAMENTO, W - M * 2);
    doc.text(cancel, M, y);
    y += cancel.length * 13 + 10;
    const nota = doc.splitTextToSize(NOTA_VISITA_AVULSA, W - M * 2);
    doc.text(nota, M, y);
    y += nota.length * 13 + 18;

    doc.setFontSize(9);
    doc.setTextColor(110, 118, 128);
    const rodape = doc.splitTextToSize(
      "Documento de registro do atendimento. Peças, componentes e licenças não estão inclusos. Condições completas em tecnico.curitiba.br/precos-e-politicas.",
      W - M * 2,
    );
    doc.text(rodape, M, y);

    doc.save(`${n}.pdf`);
    toast.success("PDF da ordem de serviço gerado.");
  };

  const baixar = async () => {
    const n = await garantirNumero();
    if (!n) return;
    const conteudo = resumo.replace(/^Ordem de serviço.*$/m, `Ordem de serviço ${n}`);
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${n}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const enviar = async () => {
    const n = await garantirNumero();
    if (!n) return;
    trackCTAClick("whatsapp", "ordem-de-servico");
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", {
        detail: {
          location: "ordem-de-servico",
          message: mensagemWhatsApp(n),
        },
      }),
    );

  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Ordem de serviço | Técnico em Curitiba"
        description="Registre os dados do equipamento e gere uma ordem de serviço para acompanhar o atendimento técnico."
        path="/ordem-de-servico"
        noindex
      />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ordem de serviço
        </h1>
        <p className="mt-3 text-muted-foreground">
          Preencha os dados do equipamento e do problema. A ordem gerada serve como registro do atendimento,
          traz a modalidade escolhida com as condições aplicáveis e pode ser baixada, impressa ou copiada.
        </p>

        <div className="mt-8 grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="os-nome">Nome do cliente</Label>
            <Input id="os-nome" value={form.nome} onChange={(e) => set("nome")(e.target.value)} placeholder="Como podemos te chamar?" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="os-local">Bairro e cidade</Label>
            <LocalidadeInput
              id="os-local"
              value={form.local}
              onChange={set("local")}
              placeholder="Ex.: Batel, Curitiba"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="os-equip">Equipamento</Label>
              <Input id="os-equip" value={form.equipamento} onChange={(e) => set("equipamento")(e.target.value)} placeholder="Notebook, PC, impressora..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="os-modelo">Marca e modelo</Label>
              <Input id="os-modelo" value={form.marcaModelo} onChange={(e) => set("marcaModelo")(e.target.value)} placeholder="Ex.: Dell Inspiron 15" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="os-modalidade">Modalidade de atendimento</Label>
            <select
              id="os-modalidade"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              value={form.modalidadeId}
              onChange={(e) => set("modalidadeId")(e.target.value)}
            >
              {MODALIDADES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.titulo} — {m.valorLabel}
                </option>
              ))}
            </select>
            <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">
                {modalidade.valorLabel}{" "}
                <span className="text-xs font-normal uppercase tracking-wide">({modalidade.unidade})</span>
              </p>
              <p className="mt-2">{modalidade.resumo}</p>
              <ul className="mt-2 space-y-1">
                {modalidade.detalhes.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-accent" aria-hidden="true">▸</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="os-acess">Acessórios entregues</Label>
            <Input id="os-acess" value={form.acessorios} onChange={(e) => set("acessorios")(e.target.value)} placeholder="Fonte, cabo, mouse..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="os-sintoma">Problema relatado</Label>
            <Textarea id="os-sintoma" rows={4} value={form.sintoma} onChange={(e) => set("sintoma")(e.target.value)} placeholder="Descreva o que acontece, quando começou e o que já foi tentado." />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={gerar} disabled={!pronta} variant="secondary">
              Gerar ordem de serviço
            </Button>
            <Button onClick={enviar} disabled={!pronta} data-cta-location="ordem-de-servico">
              Enviar esta ordem no WhatsApp
            </Button>
            {numero ? (
              <>
                <Button variant="outline" onClick={copiar}>
                  Copiar para o WhatsApp
                </Button>
                <Button variant="outline" onClick={baixarPdf}>
                  Baixar PDF
                </Button>
                <Button variant="outline" onClick={baixar}>
                  Baixar .txt
                </Button>

                <Button variant="outline" onClick={() => window.print()}>
                  Imprimir
                </Button>
              </>
            ) : null}
          </div>
          <TermosCtaLink />
        </div>

        {numero ? (
          <section className="mt-10 rounded-xl border border-border bg-card p-6" data-testid="os-documento">
            <h2 className="font-heading text-xl font-semibold text-foreground">Registro {numero}</h2>
            <pre className="mt-4 whitespace-pre-wrap font-sans text-sm text-muted-foreground">{resumo}</pre>
            <p className="mt-4 text-xs text-muted-foreground">{REGRA_CANCELAMENTO}</p>
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default OrdemDeServico;
