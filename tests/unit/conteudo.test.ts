import { describe, expect, it } from 'vitest';
import { site } from '@/content/site';

const naoVazio = (texto: string) => texto.trim().length > 0;

describe('conteúdo da landing', () => {
  it('a soma das faixas de idade é igual ao total de carros do painel', () => {
    const soma = site.painel.idade.reduce((total, faixa) => total + faixa.n, 0);
    expect(soma).toBe(site.painel.total);
    expect(site.painel.nota).toContain(String(site.painel.total));
  });

  it('as faixas de idade usam os quatro tons, e só a última é "parado"', () => {
    expect(site.painel.idade.map((f) => f.tom)).toEqual(['novo', 'medio', 'velho', 'parado']);
  });

  it('todo rotulo e titulo é não vazio', () => {
    const textos: string[] = [
      site.nome,
      site.tagline,
      site.apoio,
      site.painel.titulo,
      site.painel.nota,
      ...site.nav.map((l) => l.rotulo),
      site.acoes.agendar.rotulo,
      site.acoes.agendar.mensagem,
      site.titulo,
      ...site.painel.metricas.flatMap((m) => [m.rotulo, m.valor]),
      ...site.painel.idade.map((f) => f.rotulo),
      ...Object.values(site.secoes),
      ...site.numeros.flatMap((n) => [n.valor, n.rotulo]),
      ...site.itens.flatMap((i) => [i.titulo, i.texto]),
      ...site.emBreve.flatMap((i) => [i.titulo, i.texto]),
      ...site.versoes.colunas,
      site.versoes.descricao,
      site.versoes.incluido,
      site.versoes.naoIncluido,
      ...site.versoes.linhas.map((l) => l.rotulo),
      site.versoes.preco.rotulo,
      site.versoes.preco.loja.valor,
      site.versoes.preco.lojaPlus.valor,
      site.versoes.nota,
      ...site.semLetraMiuda.flatMap((i) => [i.titulo, i.texto]),
      site.fundadoras.titulo,
      site.fundadoras.texto,
      ...site.perguntas.flatMap((p) => [p.pergunta, p.resposta]),
      site.fechamento.titulo,
      site.fechamento.texto,
      site.rodape,
    ];
    for (const texto of textos) expect(naoVazio(texto), `texto vazio: ${JSON.stringify(texto)}`).toBe(true);
  });

  it('as listas têm o tamanho do desenho da Noite', () => {
    expect(site.nav).toHaveLength(2);
    expect(site.painel.metricas).toHaveLength(3);
    expect(site.painel.idade).toHaveLength(4);
    expect(site.numeros).toHaveLength(4);
    expect(site.itens).toHaveLength(6);
    expect(site.emBreve).toHaveLength(4);
    expect(site.semLetraMiuda).toHaveLength(3);
    expect(site.perguntas.length).toBeGreaterThanOrEqual(6);
  });

  it('cada linha da tabela de versões tem os dois valores', () => {
    expect(site.versoes.linhas.length).toBeGreaterThan(0);
    for (const linha of site.versoes.linhas) {
      expect(linha.loja).not.toBe('');
      expect(linha.lojaPlus).not.toBe('');
      expect(['boolean', 'string']).toContain(typeof linha.loja);
      expect(['boolean', 'string']).toContain(typeof linha.lojaPlus);
    }
    expect(naoVazio(site.versoes.preco.loja.detalhe)).toBe(true);
    expect(naoVazio(site.versoes.preco.lojaPlus.detalhe)).toBe(true);
  });

  it('o preço da vitrine bate com o da tabela', () => {
    expect(site.numeros.at(-1)?.valor).toBe(site.versoes.preco.loja.valor);
  });

  it('o rodapé traz o nome do produto e a cidade', () => {
    expect(site.rodape.toLowerCase()).toContain(site.nome.toLowerCase());
    expect(site.rodape).toContain('João Pessoa');
  });

  it('o SEO tem título descritivo, descrição de uma frase com até 155 caracteres e texto da imagem', () => {
    const { seo } = site;
    expect(seo.titulo.toLowerCase()).toContain('revendas de seminovos');
    expect(seo.titulo.length).toBeLessThanOrEqual(70);
    expect(seo.descricao.length).toBeGreaterThan(50);
    expect(seo.descricao.length).toBeLessThanOrEqual(155);
    expect(naoVazio(seo.nomeSite)).toBe(true);
    expect(naoVazio(seo.imagemAlt)).toBe(true);
    expect(naoVazio(site.acessibilidade.pularConteudo)).toBe(true);
  });
});
