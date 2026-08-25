import { useEffect, useState } from "react";
import { useParams, Link } from "@tanstack/react-router";

import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { TermosOsView } from "@/components/os/TermosOsView";
import { consultarOs, OS_ERRO_LIMITE, type OsPublica } from "@/lib/os/os.functions";
import { mensagemWhatsAppOs } from "@/lib/os/termosOs";
import { trackCTAClick } from "@/lib/analytics";
import { MODALIDADES } from "@/lib/precosConfig";

const Linha = ({ label, valor }: { label: string; valor?: string | null }) =>
  valor ? (
    <div className="grid gap-1 border-b border-border/60 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm leading-relaxed text-foreground">{valor}</dd>
    </div>
  ) : null;

const OrdemDeServicoConsulta = () => {
  const { protocolo: protocoloParam } = useParams({ from: "/ordem-de-servico/$protocolo" });
  const protocolo = protocoloParam.toUpperCase();
  const [estado, setEstado] = useState<
    "carregando" | "ok" | "nao-encontrada" | "erro" | "limite" | "invalido"
  >("carregando");
  const [os, setOs] = useState<OsPublica | null>(null);

  useEffect(() => {
    let ativo = true;
    setEstado("carregando");

    // Validação local antes de gastar requisição: formato OS-AAAAMMDD-XXXX.
    if (!/^OS-\d{8}-[A-Z0-9]{4}$/.test(protocolo)) {
      setEstado("invalido");
      return () => {
        ativo = false;
      };
    }

    // Debounce curto: evita disparo duplicado em remontagem/StrictMode.
    const timer = setTimeout(() => {
      consultarOs({ data: { protocolo } })
        .then((resultado) => {
          if (!ativo) return;
          if (!resultado) {
            setEstado("nao-encontrada");
            return;
          }
          setOs(resultado);
          setEstado("ok");
        })
        .catch((e: unknown) => {
          if (!ativo) return;
          const msg = e instanceof Error ? e.message : "";
          setEstado(msg.includes(OS_ERRO_LIMITE) ? "limite" : "erro");
        });
    }, 250);

    return () => {
      ativo = false;
      clearTimeout(timer);
    };
  }, [protocolo]);

  const modalidade = MODALIDADES.find((m) => m.id === os?.modalidadeId);

  const enviar = () => {
    if (!os) return;
    trackCTAClick("whatsapp", "ordem-de-servico-consulta");
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", {
        detail: {
          location: "ordem-de-servico-consulta",
          message: mensagemWhatsAppOs({
            protocolo: os.protocolo,
            tipo: os.tipo,
            nome: os.nome,
            local: os.local ?? undefined,
            equipamento: os.equipamento,
            marcaModelo: os.marcaModelo ?? undefined,
            acessorios: os.acessorios ?? undefined,
            sintoma: os.sintoma,
            modalidadeTitulo: modalidade?.titulo ?? os.modalidadeId,
            valorLabel: os.valorLabel,
          }),
        },
      }),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={`Ordem de serviço ${protocolo} | Técnico em Curitiba`}
        description="Consulta da ordem de serviço: dados do equipamento, modalidade de atendimento e termos aplicáveis."
        path={`/ordem-de-servico/${protocolo}`}
        noindex
      />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <Link to="/ordem-de-servico" className="text-sm text-muted-foreground underline underline-offset-4">
          ← Abrir outra ordem de serviço
        </Link>

        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ordem de serviço {protocolo}
        </h1>

        {estado === "carregando" ? (
          <div className="mt-8 space-y-3" aria-live="polite">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        ) : null}

        {estado === "nao-encontrada" ? (
          <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            Não encontramos nenhuma ordem de serviço com este código. Confira o protocolo recebido ou abra uma
            nova ordem.
          </p>
        ) : null}

        {estado === "invalido" ? (
          <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            Este código não está no formato de protocolo. Ele começa com <strong>OS-</strong>, seguido da data
            e de quatro caracteres — por exemplo, <code>OS-20260808-K7QD</code>.
          </p>
        ) : null}

        {estado === "limite" ? (
          <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            Recebemos muitas consultas deste dispositivo em pouco tempo. Aguarde alguns minutos e tente
            novamente — ou fale com a gente pelo WhatsApp que localizamos a sua ordem.
          </p>
        ) : null}

        {estado === "erro" ? (
          <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            Não foi possível consultar agora. Tente novamente em instantes.
          </p>
        ) : null}

        {estado === "ok" && os ? (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              Aberta em {new Date(os.criadoEm).toLocaleDateString("pt-BR")} · Status: {os.status}
            </p>

            <dl className="mt-8 rounded-xl border border-border bg-card px-5 py-2 sm:px-6">
              <Linha label="Cliente" valor={os.nome} />
              <Linha label="Bairro/cidade" valor={os.local} />
              <Linha label="Equipamento" valor={os.equipamento} />
              <Linha label="Marca/modelo" valor={os.marcaModelo} />
              <Linha label="Acessórios" valor={os.acessorios} />
              <Linha label="Problema relatado" valor={os.sintoma} />
              <Linha label="Atendimento" valor={modalidade?.titulo ?? os.modalidadeId} />
              <Linha label="Valor" valor={os.valorLabel} />
            </dl>

            <TermosOsView tipo={os.tipo} protocolo={os.protocolo} />

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={enviar} data-cta-location="ordem-de-servico-consulta">
                Falar sobre esta ordem no WhatsApp
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                Imprimir
              </Button>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default OrdemDeServicoConsulta;
