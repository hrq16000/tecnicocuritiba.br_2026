/**
 * Deep links contextuais de WhatsApp.
 *
 * Regra de marca: o número oficial nunca aparece como texto visível — apenas
 * dentro do href wa.me. A mensagem é pré-preenchida com a localidade que o
 * usuário está navegando e, quando houver, o serviço/problema escolhido.
 */
const WHATSAPP_NUMBER = "5541997086380";

export interface WhatsAppContexto {
  /** Bairro ou cidade da página atual (ex.: "Água Verde", "Pinhais"). */
  local?: string;
  /** Serviço ou problema selecionado (ex.: "Formatação com backup"). */
  servico?: string;
  /** Sufixo opcional para orientar o atendimento. */
  extra?: string;
}

/** Monta a mensagem pré-preenchida, sem placeholders artificiais. */
export function mensagemWhatsApp({ local, servico, extra }: WhatsAppContexto = {}): string {
  const alvo = servico ? `ajuda com ${servico}` : "ajuda de um técnico de informática";
  const onde = local ? ` no ${local}` : "";
  const base = `Olá, preciso de ${alvo}${onde}.`;
  return extra ? `${base} ${extra}` : base;
}

/** URL wa.me pronta para uso em href, com o texto já codificado. */
export function whatsappDeepLink(contexto: WhatsAppContexto = {}): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagemWhatsApp(contexto))}`;
}
