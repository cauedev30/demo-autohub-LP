import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Botao } from '@/components/Botao';
import { site } from '@/content/site';

describe('Botao', () => {
  it('link http abre em nova aba com rel seguro e avisa o leitor de tela', () => {
    const html = renderToStaticMarkup(
      <Botao variante="cheio" href="https://wa.me/5583999999999?text=oi">
        Agendar
      </Botao>,
    );
    expect(html).toContain('href="https://wa.me/5583999999999?text=oi"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain(site.acessibilidade.novaAba);
  });

  it('âncora é um link comum, sem nova aba', () => {
    const html = renderToStaticMarkup(
      <Botao variante="contorno" href="#agendar">
        Agendar
      </Botao>,
    );
    expect(html).toContain('href="#agendar"');
    expect(html).not.toContain('target=');
    expect(html).not.toContain('rel=');
    expect(html).not.toContain(site.acessibilidade.novaAba);
  });

  it('o tamanho grande e a variante contorno mudam as classes', () => {
    const normal = renderToStaticMarkup(
      <Botao variante="cheio" href="#a">
        x
      </Botao>,
    );
    const grande = renderToStaticMarkup(
      <Botao variante="contorno" tamanho="grande" href="#a">
        x
      </Botao>,
    );
    expect(grande).not.toBe(normal);
    expect(grande).toContain('grande');
    expect(grande).toContain('contorno');
    expect(normal).not.toContain('grande');
  });
});
