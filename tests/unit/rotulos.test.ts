import { describe, expect, it } from 'vitest';
import { site } from '@/content/site';
import { rotuloGraficoIdade, rotuloPainel } from '@/lib/rotulos';

describe('rótulos de acessibilidade do painel', () => {
  it('o gráfico de idade lista o total e as quatro faixas, na ordem do conteúdo', () => {
    const rotulo = rotuloGraficoIdade(site.painel);
    expect(rotulo.startsWith(`${site.painel.total} ${site.painel.idadeDescricao}: `)).toBe(true);
    const faixas = rotulo.split(': ')[1].split(', ');
    expect(faixas).toEqual(site.painel.idade.map((f) => f.rotulo));
    expect(faixas).toHaveLength(4);
  });

  it('o nome do painel junta prefixo, título e nota', () => {
    expect(rotuloPainel(site.painel, site.acessibilidade)).toBe(
      `${site.acessibilidade.painel} ${site.painel.titulo}, ${site.painel.nota}`,
    );
  });
});
