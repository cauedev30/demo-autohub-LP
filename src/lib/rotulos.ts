import type { Painel, Site } from '@/content/tipos';

/**
 * Texto do gráfico de idade para leitor de tela, montado do conteúdo:
 * "22 carros por tempo no pátio: 10 carros até 30 dias, 6 de 31 a 60, 4 de 61 a 90, 2 há mais de 90".
 */
export function rotuloGraficoIdade(painel: Pick<Painel, 'total' | 'idadeDescricao' | 'idade'>): string {
  const faixas = painel.idade.map((faixa) => faixa.rotulo).join(', ');
  return `${painel.total} ${painel.idadeDescricao}: ${faixas}`;
}

/** Nome do painel de demonstração: "Painel Sua loja agora, Maré Veículos, loja de demonstração, 22 carros". */
export function rotuloPainel(
  painel: Pick<Painel, 'titulo' | 'nota'>,
  acessibilidade: Pick<Site['acessibilidade'], 'painel'>,
): string {
  return `${acessibilidade.painel} ${painel.titulo}, ${painel.nota}`;
}
