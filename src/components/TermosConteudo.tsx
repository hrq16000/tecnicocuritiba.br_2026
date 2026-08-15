import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { Link } from "@/lib/router-compat";
import { PrecoModalidades } from "@/components/PrecoModalidades";
import { REGRA_CANCELAMENTO } from "@/lib/precosConfig";
import {
  MessageCircle,
  Home,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

/**
 * Conteúdo canônico de TERMOS, CONDIÇÕES, VALORES E PRAZOS.
 * Fonte única — usado na página fundida /precos-e-politicas e no alias
 * /termos-e-condicoes. Nenhuma outra página deve republicar valores.
 */

export const TERMOS_FAQ = [
  {
    q: "Quanto custa a visita técnica avulsa em Curitiba e região?",
    a: "No atendimento avulso é visita técnica de inspeção sem compromisso, a partir de R$ 99,99 por até (ou a cada) 30 minutos de atendimento. Não inclui peças, componentes, licenças nem abertura de placas. O valor mínimo pode variar conforme a região de deslocamento.",
  },
  {
    q: "Existe pacote de visita técnica mais longo?",
    a: "Sim. Existe o pacote pré-acordado de visita técnica de até 2 horas por R$ 279,99, sem promessas de resultado e sem peças inclusas. Ele precisa ser combinado antes do deslocamento.",
  },
  {
    q: "Como funciona o diagnóstico com compromisso e coleta?",
    a: "Na maioria dos casos o atendimento é com coleta e entrega: diagnóstico com compromisso e tentativa de reparos compatíveis, com coleta e entrega inclusas, valor mínimo pré-aprovado de R$ 299,99. Peças não estão inclusas e reparos acima do mínimo dependem de autorização por escrito.",
  },
  {
    q: "Posso cancelar depois da coleta?",
    a: "O cancelamento é válido somente até 24 horas corridas após a coleta. Após esse prazo não é compatível o cancelamento nem a desistência do diagnóstico.",
  },
  {
    q: "Quando a visita técnica é realmente compatível?",
    a: "Quando a máquina está ligando e funcionando e a necessidade é atualização de sistema, configuração, upgrade simples ou instalação de peça que o cliente já possui. Quando o reparo exige bancada ou ferramenta específica, o atendimento é convertido em coleta e entrega.",
  },
  {
    q: "Quais casos não compensa consertar?",
    a: "Placas-mãe de desktops antigos ou de entrada e aparelhos de linha básica quase nunca compensam financeiramente. Nestes casos avisamos antes e indicamos substituição. Filosofia: quase tudo tem conserto, mas nem tudo vale a pena.",
  },
  {
    q: "Qual é a garantia dos serviços?",
    a: "90 dias de garantia sobre a mão de obra do serviço executado. Peças e componentes seguem a garantia do fornecedor/fabricante.",
  },
  {
    q: "Vocês atendem fora de Curitiba?",
    a: "Sim. Atendemos Curitiba e municípios da Região Metropolitana mediante consulta de agenda e deslocamento. Não mantemos loja ou laboratório em outras cidades.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://tecnico.curitiba.br/precos-e-politicas#faq",
  mainEntity: TERMOS_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/** Registra o FAQPage no slot único `faq` (evita duplicidade com o global). */
const TermosFaqJsonLd = () => {
  useJsonLdSlot(SCHEMA_SLOTS.faq, faqJsonLd, SLOT_PRIORITY.page);
  return null;
};

interface Props {
  /** Renderiza também o JSON-LD de FAQPage (default: true). */
  withJsonLd?: boolean;
  /**
   * Renderiza o bloco de modalidades (default: true).
   * Em /precos-e-politicas a página já renderiza `PrecoModalidades` acima;
   * repetir aqui duplicaria o id `modalidades-atendimento`.
   */
  withModalidades?: boolean;
  className?: string;
}

export const TermosConteudo = ({
  withJsonLd = true,
  withModalidades = true,
  className = "",
}: Props) => (
  <div className={`container mx-auto px-4 max-w-4xl ${className}`}>
    {withJsonLd && (
      <TermosFaqJsonLd />
    )}

    {withModalidades && <PrecoModalidades className="mb-12" />}

    <section className="mb-12" aria-labelledby="como-funciona-termos">
      <h2 id="como-funciona-termos" className="text-2xl font-bold mb-6 text-foreground">
        Como funciona o atendimento
      </h2>
      <ol className="space-y-3">
        {[
          { icon: MessageCircle, title: "1. Triagem pelo WhatsApp", desc: "Você descreve o problema e envia fotos. A triagem define a modalidade adequada ao caso." },
          { icon: Home, title: "2. Visita técnica de inspeção (avulsa)", desc: "A partir de R$ 99,99 por até (ou a cada) 30 minutos. Sem compromisso de solução no local e sem peças inclusas." },
          { icon: Clock, title: "3. Pacote de até 2 horas (opcional)", desc: "R$ 279,99 pré-acordado antes do deslocamento, sem promessas de resultado e sem peças inclusas." },
          { icon: Wrench, title: "4. Diagnóstico com compromisso + coleta", desc: "Caminho da maioria dos casos: coleta e entrega inclusas, valor mínimo pré-aprovado de R$ 299,99. Peças não inclusas." },
          { icon: AlertTriangle, title: "5. Cancelamento", desc: REGRA_CANCELAMENTO },
          { icon: CheckCircle2, title: "6. Garantia de 90 dias", desc: "Sobre a mão de obra do serviço executado. Peças seguem a garantia do fornecedor/fabricante." },
        ].map((s) => (
          <li key={s.title} className="flex gap-4 p-4 rounded-lg border border-border bg-card">
            <s.icon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    <section className="mb-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Quando não compensa consertar</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Avisamos antes de iniciar qualquer serviço. Casos típicos: placas-mãe de desktops antigos ou
            de entrada e aparelhos de linha básica. Nestes equipamentos, indicamos substituição em vez de reparo.
          </p>
        </div>
      </div>
    </section>

    <section className="mb-12" aria-labelledby="detalhamento-termos">
      <h2 id="detalhamento-termos" className="text-2xl font-bold mb-6 text-foreground">
        Como o valor do atendimento é definido
      </h2>
      <div className="space-y-4 text-muted-foreground">
        <p>
          Não existe preço fechado por telefone para reparo, e isso não é falta de transparência: é o
          contrário. O que temos publicado é o ponto de partida de cada modalidade — visita técnica de
          inspeção a partir de R$ 99,99 por até (ou a cada) 30 minutos, pacote pré-acordado de até 2 horas por
          R$ 279,99 e diagnóstico com compromisso, coleta e entrega inclusas, com mínimo pré-aprovado de
          R$ 299,99. O valor final depende do que a avaliação confirmar.
        </p>
        <p>
          Quatro fatores pesam no resultado: a causa real confirmada no diagnóstico, o modelo e o estado do
          equipamento, a necessidade de bancada e ferramenta específica, e a disponibilidade de peça compatível.
          Um mesmo sintoma — o computador que não liga, por exemplo — pode terminar em uma verificação simples
          de alimentação ou em um reparo de placa, e cobrar o mesmo pelos dois seria injusto com quem tem o
          caso mais leve.
        </p>
        <p>
          Peças, componentes, licenças e materiais são sempre tratados à parte da mão de obra e só são
          adquiridos após a sua autorização. Nada além do que foi combinado é executado sem aprovação. Se o
          caminho técnico mudar durante o serviço, você é avisado antes, não depois.
        </p>
      </div>
    </section>

    <section className="mb-12" aria-labelledby="incluso-termos">
      <h2 id="incluso-termos" className="text-2xl font-bold mb-6 text-foreground">
        O que está incluído e o que não está
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-2">Incluído na modalidade contratada</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• Avaliação técnica do equipamento e identificação da causa provável.</li>
            <li>• Explicação em linguagem clara do que foi encontrado e das opções.</li>
            <li>• Execução dos procedimentos autorizados dentro do escopo combinado.</li>
            <li>• Coleta e entrega, na modalidade de diagnóstico com compromisso.</li>
            <li>• Garantia de 90 dias sobre a mão de obra do serviço executado.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-2">Não incluído</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• Peças, componentes, licenças de software e materiais.</li>
            <li>• Abertura e reparo de placas na modalidade de visita avulsa.</li>
            <li>• Garantia de recuperação de dados — é sempre uma tentativa.</li>
            <li>• Promessa de prazo fixo de chegada ou de conclusão sem avaliação.</li>
            <li>• Serviços fora do escopo de informática e redes.</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="mb-12" aria-labelledby="limites-tecnicos-termos">
      <h2 id="limites-tecnicos-termos" className="text-2xl font-bold mb-6 text-foreground">
        Limites técnicos declarados antes de começar
      </h2>
      <div className="space-y-4 text-muted-foreground">
        <p>
          Transparência também é dizer o que o serviço não alcança. Nem todo equipamento tem reparo viável e
          nem todo sintoma tem solução definitiva na primeira intervenção. Declaramos esses limites antes de
          iniciar, para que a decisão de seguir seja sua e informada — nunca uma surpresa depois da conta.
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <strong className="text-foreground">Peça descontinuada ou sem fornecedor confiável:</strong> em
            modelos antigos, a peça compatível pode não existir no mercado ou vir apenas de origem incerta.
            Nesses casos informamos e não aplicamos componente sem procedência.
          </li>
          <li>
            <strong className="text-foreground">Reparo em nível de placa:</strong> depende de bancada e do
            estado da placa. Placa com corrosão avançada, trilha rompida em várias camadas ou reparo anterior
            malfeito pode não ter recuperação estável — e dizemos isso antes de cobrar tentativa.
          </li>
          <li>
            <strong className="text-foreground">Dano por líquido e por surto elétrico:</strong> o efeito é
            progressivo. Mesmo com limpeza bem-sucedida, pode haver falha posterior em outro componente. Não
            prometemos estabilidade permanente nesses casos.
          </li>
          <li>
            <strong className="text-foreground">Recuperação de dados:</strong> é tentativa técnica, não
            resultado contratado. Mídia com dano físico severo, gravação por cima do conteúdo ou criptografia
            sem chave podem inviabilizar a leitura.
          </li>
          <li>
            <strong className="text-foreground">Falha intermitente:</strong> quando o defeito não se
            reproduz em teste, o diagnóstico exige observação por período maior. Informamos o que já foi
            descartado em vez de trocar peças por tentativa.
          </li>
          <li>
            <strong className="text-foreground">Escopo:</strong> atuamos em informática, redes e Wi-Fi.
            Fora disso — obra elétrica, eletrodoméstico, celular — indicamos que não é o nosso serviço.
          </li>
        </ul>
        <p>
          Quando um desses limites aparece durante a avaliação, você recebe o cenário completo: o que foi
          confirmado, o que ainda é incerto, o custo de seguir e a alternativa de parar. O critério de
          viabilidade está detalhado em{" "}
          <Link to="/quando-nao-compensa" className="underline hover:text-foreground">quando não compensa reparar</Link>.
        </p>
      </div>
    </section>



    <section className="mb-12" aria-labelledby="prazos-garantia-termos">
      <h2 id="prazos-garantia-termos" className="text-2xl font-bold mb-6 text-foreground">
        Prazos, garantia e cuidado com seus dados
      </h2>
      <div className="space-y-4 text-muted-foreground">
        <p>
          O prazo depende da complexidade e da peça. Serviços de software, como reinstalação de sistema e
          limpeza, costumam ser mais rápidos do que reparos que dependem de componente específico. Trabalhamos
          com prazo estimado informado após a avaliação, e avisamos quando ele muda — em vez de prometer
          antes de olhar o equipamento. O passo a passo completo está em{" "}
          <Link to="/como-funciona" className="underline hover:text-foreground">como funciona o atendimento</Link>{" "}
          e a logística em{" "}
          <Link to="/coleta-e-entrega" className="underline hover:text-foreground">coleta e entrega</Link>.
        </p>
        <p>
          A garantia de 90 dias cobre a mão de obra do serviço que foi executado, no mesmo defeito tratado.
          Peças e componentes seguem a garantia do fornecedor ou fabricante. Ficam de fora da garantia:
          falha de causa diferente da tratada, dano por queda, líquido, surto elétrico ou mau uso, intervenção
          de terceiros após o atendimento, e desgaste natural de bateria e de armazenamento.
        </p>
        <p>
          Sobre dados: recomendamos backup antes de qualquer intervenção que envolva armazenamento, e quando
          possível fazemos cópia preventiva. O acesso a arquivos se limita ao necessário para o serviço
          autorizado. Tentativa de recuperação de conteúdo já perdido é outro serviço, descrito em{" "}
          <Link to="/servicos/recuperacao-de-dados" className="underline hover:text-foreground">recuperação de dados</Link>,
          e não tem resultado garantido. Quando o reparo deixa de fazer sentido diante do valor do equipamento,
          dizemos isso — o critério está em{" "}
          <Link to="/quando-nao-compensa" className="underline hover:text-foreground">quando não compensa reparar</Link>.
        </p>
      </div>
    </section>

    <section className="mb-12" aria-labelledby="eletronicos-valor-termos">
      <h2 id="eletronicos-valor-termos" className="text-2xl font-bold mb-6 text-foreground">
        Eletrônicos, placas, componentes e equipamentos de som: valor declarado, sinistro e depreciação
      </h2>
      <div className="space-y-4 text-muted-foreground">
        <p>
          Equipamentos de informática, placas eletrônicas, fontes, periféricos e aparelhos de som têm
          desvalorização rápida e comportamento diferente de outros bens. Por isso, o valor que você atribui ao
          equipamento (valor declarado) serve como referência de cuidado no manuseio e na logística — não como
          preço de reposição por novo, nem como promessa de indenização.
        </p>
        <p>
          Ao declarar um valor para o seu equipamento, você reconhece e concorda que, em caso de eventual
          sinistro, dano, perda ou venda do aparelho no estado em que se encontra, o valor apurado por avaliação
          técnica, por terceiro ou por seguradora pode ser inferior a um terço (1/3) do valor declarado. A
          avaliação considera idade do equipamento, geração da plataforma, estado das placas e conectores,
          histórico de intervenções, ausência de nota fiscal e disponibilidade de peças no mercado.
        </p>
        <p>
          Placas e componentes eletrônicos abertos anteriormente, com reparo prévio, oxidação, trilhas
          danificadas, sinais de líquido ou solda de terceiros são recebidos apenas com aceite expresso do risco:
          um componente nessas condições pode falhar durante o teste ou o reparo sem que exista nexo com o
          serviço executado. O mesmo vale para aparelhos de som e placas de áudio, que atendemos na parte
          eletrônica e de conectividade — não fazemos reparo mecânico de estrutura, caixa acústica ou peças de
          desgaste.
        </p>
        <p>
          Equipamento entregue em regime de sucata, doação ou aproveitamento de peças não gera direito a
          devolução de componentes retirados após o aceite registrado. As regras de peças fornecidas por você,
          procedência, integridade no recebimento e prazo de troca estão detalhadas na{" "}
          <Link to="/politica-de-pecas-do-cliente" className="underline hover:text-foreground">
            política de peças do cliente
          </Link>{" "}
          e os valores por modalidade em{" "}
          <Link to="/precos-e-politicas" className="underline hover:text-foreground">preços e políticas</Link>.
        </p>
        <p>
          Nenhum serviço substitui apólice de seguro. Não somos seguradora e não realizamos laudo pericial para
          fins de indenização; o que emitimos é o registro técnico do atendimento, com o que foi verificado,
          executado e substituído.
        </p>
      </div>
    </section>


    <section className="mb-12" aria-labelledby="faq-termos">
      <h2 id="faq-termos" className="text-2xl font-bold mb-6 text-foreground">
        Perguntas frequentes sobre termos, valores e prazos
      </h2>
      <div className="space-y-3">
        {TERMOS_FAQ.map((f) => (
          <details key={f.q} className="group rounded-lg border border-border bg-card p-4">
            <summary className="cursor-pointer font-semibold text-foreground flex items-center justify-between gap-2">
              {f.q}
              <Clock className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground text-center">
        <Link to="/como-funciona" className="underline hover:text-foreground">Ver como funciona</Link>
        {" · "}
        <Link to="/ordem-de-servico" className="underline hover:text-foreground">Gerar ordem de serviço</Link>
      </p>
    </section>
  </div>
);

export default TermosConteudo;
