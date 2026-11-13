/**
 * Variáveis públicas de build que decidem a URL do site e se ele pode aparecer na busca.
 * Acesso literal a process.env.NEXT_PUBLIC_*: o Next só troca o nome pelo valor quando ele está escrito inteiro.
 */
const URL_PADRAO = 'http://localhost:3000';

/** URL pública do site, sem barra no fim. Sem variável (ou inválida), usa localhost: o build não quebra. */
export function urlSite(valor: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): string {
  const texto = (valor ?? '').trim();
  if (!texto) return URL_PADRAO;
  try {
    const url = new URL(texto);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return URL_PADRAO;
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
  } catch {
    return URL_PADRAO;
  }
}

/** A página só vira indexável com NEXT_PUBLIC_INDEXAR=sim (preços e textos ainda são provisórios). */
export function indexavel(valor: string | undefined = process.env.NEXT_PUBLIC_INDEXAR): boolean {
  return (valor ?? '').trim().toLowerCase() === 'sim';
}
