import { useMemo, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { whatsappLink } from "@/lib/siteConfig";
import { trackCTAClick } from "@/lib/analytics";

/**
 * Formulário rápido de solicitação de proposta comercial (/anuncie).
 * Não persiste dados: monta a mensagem e continua no WhatsApp comercial,
 * mantendo o contato exclusivo por WhatsApp e sem coletar dados sensíveis.
 */

const SEGMENTOS = [
  "Assistência técnica / eletrônicos",
  "Varejo e e-commerce",
  "Serviços para casa e reforma",
  "Serviços profissionais (contábil, jurídico, saúde)",
  "Tecnologia, software e telecom",
  "Educação e cursos",
  "Outro segmento",
];

const FORMATOS = [
  "Banner de topo (above the fold)",
  "Bloco no meio do conteúdo",
  "Patrocínio de vertical técnica",
  "Destaque local por cidade ou bairro",
  "Ainda não sei — quero recomendação",
];

const PERIODOS = ["Teste de 15 dias", "1 mês", "3 meses", "6 meses ou mais", "A definir"];

const FIELD_CLASS =
  "mt-2 w-full min-h-12 rounded-lg border border-border bg-background px-3 text-base text-foreground outline-hidden transition-colors focus:border-accent";

const LABEL_CLASS = "block text-sm font-semibold text-foreground";
const HINT_CLASS = "mt-1 text-xs text-muted-foreground";

const clean = (value: string, max: number) => value.replace(/\s+/g, " ").trim().slice(0, max);

export const PropostaMidiaForm = () => {
  const [empresa, setEmpresa] = useState("");
  const [segmento, setSegmento] = useState(SEGMENTOS[0]);
  const [regiao, setRegiao] = useState("");
  const [formato, setFormato] = useState(FORMATOS[0]);
  const [periodo, setPeriodo] = useState(PERIODOS[1]);
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const mensagem = useMemo(() => {
    const linhas = [
      "Solicitação de proposta de mídia — Técnico em Curitiba",
      `Empresa/marca: ${clean(empresa, 80) || "(não informado)"}`,
      `Segmento: ${segmento}`,
      `Cidade/bairro de interesse: ${clean(regiao, 80) || "(a definir)"}`,
      `Formato: ${formato}`,
      `Período: ${periodo}`,
    ];
    const obs = clean(observacao, 400);
    if (obs) linhas.push(`Observações: ${obs}`);
    linhas.push("Pode confirmar disponibilidade de posição e período?");
    return linhas.join("\n");
  }, [empresa, segmento, regiao, formato, periodo, observacao]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (clean(empresa, 80).length < 2) {
      setErro("Informe o nome da empresa ou marca para montarmos a proposta.");
      return;
    }
    setErro(null);
    trackCTAClick("whatsapp", "anuncie_form_proposta");
    window.open(whatsappLink(mensagem), "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 md:p-8"
      aria-labelledby="proposta-midia-titulo"
    >
      <h3 id="proposta-midia-titulo" className="text-xl font-heading font-bold text-foreground">
        Solicitar proposta de mídia
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Preencha em menos de um minuto. A mensagem é montada automaticamente e a conversa continua no
        WhatsApp comercial — nada é salvo neste formulário.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className={LABEL_CLASS} htmlFor="proposta-empresa">
            Empresa ou marca
          </label>
          <input
            id="proposta-empresa"
            className={FIELD_CLASS}
            value={empresa}
            maxLength={80}
            onChange={(e) => setEmpresa(e.target.value)}
            placeholder="Ex.: Eletricista Nota 10"
            autoComplete="organization"
          />
          <p className={HINT_CLASS}>Texto curto, até 80 caracteres. Exemplo: “Eletricista - Nota 10”.</p>
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="proposta-segmento">
            Segmento
          </label>
          <select
            id="proposta-segmento"
            className={FIELD_CLASS}
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
          >
            {SEGMENTOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <p className={HINT_CLASS}>Ajuda a evitar conflito de exclusividade com outra marca do mesmo setor.</p>
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="proposta-regiao">
            Cidade e bairro de interesse
          </label>
          <input
            id="proposta-regiao"
            className={FIELD_CLASS}
            value={regiao}
            maxLength={80}
            onChange={(e) => setRegiao(e.target.value)}
            placeholder="Ex.: Curitiba - Batel"
          />
          <p className={HINT_CLASS}>
            Formato “Cidade - Bairro”. Exemplos: “Curitiba - Água Verde”, “São José dos Pinhais - Centro”.
          </p>
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="proposta-formato">
            Tipo de anúncio
          </label>
          <select
            id="proposta-formato"
            className={FIELD_CLASS}
            value={formato}
            onChange={(e) => setFormato(e.target.value)}
          >
            {FORMATOS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <p className={HINT_CLASS}>Se ainda estiver em dúvida, escolha a última opção e recomendamos o formato.</p>
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="proposta-periodo">
            Período pretendido
          </label>
          <select
            id="proposta-periodo"
            className={FIELD_CLASS}
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          >
            {PERIODOS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <p className={HINT_CLASS}>A reserva só vale depois de confirmada por escrito com data e posição.</p>
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="proposta-observacao">
            Observações (opcional)
          </label>
          <input
            id="proposta-observacao"
            className={FIELD_CLASS}
            value={observacao}
            maxLength={400}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex.: campanha de inverno, preciso da peça no ar em 10 dias"
          />
          <p className={HINT_CLASS}>Não envie dados pessoais de clientes nem informações sigilosas.</p>
        </div>
      </div>

      {erro && (
        <p role="alert" className="mt-5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {erro}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          data-cta-location="anuncie_form_proposta"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-bold text-accent-foreground transition-transform hover:scale-[1.02]"
        >
          <MessageCircle className="h-5 w-5" />
          Enviar solicitação pelo WhatsApp
        </button>
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Send className="h-4 w-4" aria-hidden="true" />
          Resposta com formatos livres, posições e período disponível.
        </span>
      </div>
    </form>
  );
};

export default PropostaMidiaForm;
