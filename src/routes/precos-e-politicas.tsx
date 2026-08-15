import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PrecosEPoliticas from "@/pages/PrecosEPoliticas";

export const Route = createFileRoute("/precos-e-politicas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/precos-e-politicas",
    "title": "Preços e Políticas | Técnico em Curitiba",
    "description": "Preços e políticas do atendimento de informática em Curitiba: mão de obra a partir de R$ 99,99, valor após avaliação e regras claras sobre peças, prazos e dados.",
    "faq": [
      {
        "question": "Quanto custa a visita técnica avulsa em Curitiba e região?",
        "answer": "No atendimento avulso é visita técnica de inspeção sem compromisso, a partir de R$ 99,99 por até (ou a cada) 30 minutos de atendimento. Não inclui peças, componentes, licenças nem abertura de placas. O valor mínimo pode variar conforme a região de deslocamento."
      },
      {
        "question": "Existe pacote de visita técnica mais longo?",
        "answer": "Sim. Existe o pacote pré-acordado de visita técnica de até 2 horas por R$ 279,99, sem promessas de resultado e sem peças inclusas. Ele precisa ser combinado antes do deslocamento."
      },
      {
        "question": "Como funciona o diagnóstico com compromisso e coleta?",
        "answer": "Na maioria dos casos o atendimento é com coleta e entrega: diagnóstico com compromisso e tentativa de reparos compatíveis, com coleta e entrega inclusas, valor mínimo pré-aprovado de R$ 299,99. Peças não estão inclusas e reparos acima do mínimo dependem de autorização por escrito."
      },
      {
        "question": "Posso cancelar depois da coleta?",
        "answer": "O cancelamento é válido somente até 24 horas corridas após a coleta. Após esse prazo não é compatível o cancelamento nem a desistência do diagnóstico."
      },
      {
        "question": "Quando a visita técnica é realmente compatível?",
        "answer": "Quando a máquina está ligando e funcionando e a necessidade é atualização de sistema, configuração, upgrade simples ou instalação de peça que o cliente já possui. Quando o reparo exige bancada ou ferramenta específica, o atendimento é convertido em coleta e entrega."
      },
      {
        "question": "Quais casos não compensa consertar?",
        "answer": "Placas-mãe de desktops antigos ou de entrada e aparelhos de linha básica quase nunca compensam financeiramente. Nestes casos avisamos antes e indicamos substituição. Filosofia: quase tudo tem conserto, mas nem tudo vale a pena."
      },
      {
        "question": "Qual é a garantia dos serviços?",
        "answer": "90 dias de garantia sobre a mão de obra do serviço executado. Peças e componentes seguem a garantia do fornecedor/fabricante."
      },
      {
        "question": "Vocês atendem fora de Curitiba?",
        "answer": "Sim. Atendemos Curitiba e municípios da Região Metropolitana mediante consulta de agenda e deslocamento. Não mantemos loja ou laboratório em outras cidades."
      }
    ]
  }),
  /* seo:auto-end */
  component: PrecosEPoliticas,
});
