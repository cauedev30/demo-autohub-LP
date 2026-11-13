/**
 * Monta o link do WhatsApp com a mensagem pronta.
 * Lê NEXT_PUBLIC_WHATSAPP_NUMBER (definida no build), deixa só os dígitos e codifica a mensagem.
 * Sem número válido devolve "#agendar", e a página continua funcionando.
 */
const SEM_NUMERO = '#agendar';

export function linkWhatsapp(mensagem: string): string {
  // Acesso literal: o Next só troca process.env.NEXT_PUBLIC_* por valor no build quando o nome está escrito inteiro.
  const numero = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
  // E.164: de 8 a 15 dígitos, contando o código do país.
  if (numero.length < 8 || numero.length > 15) return SEM_NUMERO;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
