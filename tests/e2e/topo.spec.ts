import { expect, test, type Page } from '@playwright/test';
import { site } from '../../src/content/site';
import { rotuloGraficoIdade } from '../../src/lib/rotulos';

const larguras = [390, 768, 1440];

const coletaErros = (page: Page) => {
  const erros: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') erros.push(msg.text());
  });
  page.on('pageerror', (erro) => erros.push(erro.message));
  return erros;
};

for (const largura of larguras) {
  test.describe(`topo em ${largura}px`, () => {
    test.use({ viewport: { width: largura, height: 900 } });

    test('sem rolagem horizontal, sem erro no console e com o h1 do conteúdo', async ({ page }) => {
      const erros = coletaErros(page);
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.titulo);
      const rolagem = await page.evaluate(() => ({
        pagina: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        corpo: document.body.scrollWidth - document.documentElement.clientWidth,
      }));
      expect(rolagem.pagina).toBeLessThanOrEqual(0);
      expect(rolagem.corpo).toBeLessThanOrEqual(0);
      expect(erros).toEqual([]);
    });

    test('todo link e botão visível tem pelo menos 44px de altura', async ({ page }) => {
      await page.goto('/');
      const controles = await page.locator('a, button').all();
      expect(controles.length).toBeGreaterThanOrEqual(3);
      let medidos = 0;
      for (const controle of controles) {
        if (!(await controle.isVisible())) continue;
        const caixa = await controle.boundingBox();
        const nome = (await controle.textContent())?.trim();
        expect(caixa?.height ?? 0, `altura de "${nome}"`).toBeGreaterThanOrEqual(44);
        medidos++;
      }
      // marca, botão do topo e os dois botões do hero aparecem em todas as larguras
      expect(medidos).toBeGreaterThanOrEqual(4);
    });

    test('o botão do topo e os do hero usam o link do WhatsApp com a mensagem certa (ou #agendar sem número)', async ({
      page,
    }) => {
      await page.goto('/');
      const confere = async (rotulo: string, mensagem: string, indice: number) => {
        const link = page.getByRole('link', { name: rotulo }).nth(indice);
        const href = (await link.getAttribute('href')) ?? '';
        if (href.startsWith('https://wa.me/')) {
          expect(href).toContain(`text=${encodeURIComponent(mensagem)}`);
          await expect(link).toHaveAttribute('target', '_blank');
          await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        } else {
          expect(href).toBe('#agendar');
          expect(await link.getAttribute('target')).toBeNull();
        }
      };
      // "Agendar test-drive": topo (0) e hero (1)
      await confere(site.acoes.agendar.rotulo, site.acoes.agendar.mensagem, 0);
      await confere(site.acoes.agendar.rotulo, site.acoes.agendar.mensagem, 1);
    });

    test('os links de texto do topo só aparecem a partir de 561px', async ({ page }) => {
      await page.goto('/');
      for (const link of site.nav) {
        const alvo = page.getByRole('link', { name: link.rotulo });
        if (largura > 560) {
          await expect(alvo).toBeVisible();
          await expect(alvo).toHaveAttribute('href', link.href);
        } else {
          await expect(alvo).toBeHidden();
        }
      }
    });

    test('o gráfico de idade lista as quatro faixas e só a parada usa o vermelho', async ({ page }) => {
      await page.goto('/');
      const grafico = page.getByRole('img', { name: new RegExp(site.painel.idadeDescricao) });
      await expect(grafico).toHaveCount(1);
      const rotulo = await grafico.getAttribute('aria-label');
      expect(rotulo).toBe(rotuloGraficoIdade(site.painel));
      for (const faixa of site.painel.idade) expect(rotulo).toContain(faixa.rotulo);
      expect(rotulo).toContain(String(site.painel.total));

      const cores = await page.evaluate(() => {
        const teste = document.createElement('i');
        teste.style.color = 'var(--vermelho)';
        document.body.appendChild(teste);
        const vermelho = getComputedStyle(teste).color;
        teste.remove();

        const painel = document.querySelector('[role="group"]');
        if (!painel) throw new Error('painel não encontrado');
        const usaVermelho = (el: Element) => {
          const e = getComputedStyle(el);
          return [e.backgroundColor, e.color, e.borderTopColor, e.borderBottomColor].includes(vermelho);
        };
        return {
          vermelho,
          faixas: [...painel.querySelectorAll('[data-tom]')].map((el) => ({
            tom: el.getAttribute('data-tom'),
            fundo: getComputedStyle(el).backgroundColor,
          })),
          // qualquer elemento do painel (fora as faixas) que use o vermelho
          intrusos: [...painel.querySelectorAll('*')].filter((el) => !el.hasAttribute('data-tom') && usaVermelho(el)).length,
        };
      });

      // duas marcas por faixa: a barra e a legenda
      expect(cores.faixas).toHaveLength(site.painel.idade.length * 2);
      for (const faixa of cores.faixas) {
        if (faixa.tom === 'parado') expect(faixa.fundo).toBe(cores.vermelho);
        else expect(faixa.fundo, `faixa ${faixa.tom}`).not.toBe(cores.vermelho);
      }
      expect(cores.faixas.filter((f) => f.fundo === cores.vermelho)).toHaveLength(2);
      expect(cores.intrusos).toBe(0);
    });

    test('a barra de idade é proporcional a n', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
      const larguras = await page
        .locator('[role="img"] > [data-tom]')
        .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
      expect(larguras).toHaveLength(site.painel.idade.length);
      const total = larguras.reduce((a, b) => a + b, 0);
      const soma = site.painel.idade.reduce((a, f) => a + f.n, 0);
      larguras.forEach((l, i) => {
        // o vão de 2px entre as faixas tira um pouco de cada uma
        expect(l / total).toBeCloseTo(site.painel.idade[i].n / soma, 1);
      });
    });

    test('o painel não corta o texto', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const cortados = await page.evaluate(() => {
        const painel = document.querySelector('[role="group"]');
        if (!painel) throw new Error('painel não encontrado');
        const caixa = painel.getBoundingClientRect();
        return [...painel.querySelectorAll('dt, dd, li, strong, span:not([data-tom])')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.left < caixa.left - 0.5 || r.right > caixa.right + 0.5 || el.scrollWidth > el.clientWidth + 1;
          })
          .map((el) => el.textContent);
      });
      expect(cortados).toEqual([]);
    });

    test('o celular existe só acima de 860px e não passa da margem direita do .wrap', async ({ page }) => {
      await page.goto('/');
      const celular = page.locator('[aria-hidden="true"]', { has: page.getByText(site.celular.titulo) });
      await expect(celular).toHaveCount(1);
      if (largura <= 860) {
        await expect(celular).toBeHidden();
        return;
      }
      await expect(celular).toBeVisible();
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
      const caixa = await celular.boundingBox();
      const limite = await page.evaluate(() => {
        const wrap = document.querySelector('.wrap');
        if (!wrap) throw new Error('.wrap não encontrado');
        const r = wrap.getBoundingClientRect();
        return { direita: r.right - parseFloat(getComputedStyle(wrap).paddingRight) };
      });
      const hero = await page.locator('section').first().boundingBox();
      expect(caixa).not.toBeNull();
      expect(caixa!.x + caixa!.width).toBeLessThanOrEqual(limite.direita + 0.5);
      // dentro do hero, sem corte no topo e no pé
      expect(caixa!.y).toBeGreaterThanOrEqual(hero!.y);
      expect(caixa!.y + caixa!.height).toBeLessThanOrEqual(hero!.y + hero!.height + 0.5);
    });

    test('o primeiro Tab é o link "pular para o conteúdo"; o segundo chega a um controle do topo e o foco aparece', async ({
      page,
    }) => {
      await page.goto('/');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: site.acessibilidade.pularConteudo })).toBeFocused();
      await page.keyboard.press('Tab');
      const primeiro = await page.evaluate(() => ({
        noTopo: document.activeElement?.closest('header') !== null,
        contorno: getComputedStyle(document.activeElement as Element).outlineStyle,
      }));
      expect(primeiro.noTopo).toBe(true);
      expect(primeiro.contorno).not.toBe('none');

      // segue até o botão "Agendar test-drive" do topo: o contorno dele tem de ser claro (visível no preto)
      for (let i = 0; i < 5; i++) {
        const ehOBotao = await page.evaluate(
          (rotulo) => document.activeElement?.closest('header') !== null && document.activeElement?.textContent?.includes(rotulo),
          site.acoes.agendar.rotulo,
        );
        if (ehOBotao) break;
        await page.keyboard.press('Tab');
      }
      const botao = await page.evaluate(() => {
        const el = document.activeElement as Element;
        const e = getComputedStyle(el);
        const teste = document.createElement('i');
        teste.style.color = 'var(--fg)';
        document.body.appendChild(teste);
        const claro = getComputedStyle(teste).color;
        teste.remove();
        return { noTopo: el.closest('header') !== null, cor: e.outlineColor, estilo: e.outlineStyle, claro };
      });
      expect(botao.noTopo).toBe(true);
      expect(botao.estilo).not.toBe('none');
      expect(botao.cor).toBe(botao.claro);
    });

    test('a entrada roda e termina com tudo visível', async ({ page }) => {
      await page.goto('/');
      expect(await page.evaluate(() => document.getAnimations().length)).toBeGreaterThan(0);
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
      const invisiveis = await page.evaluate(() =>
        [...document.querySelectorAll('section, section *')]
          .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.5)
          .map((el) => el.className),
      );
      expect(invisiveis).toEqual([]);
    });
  });
}

test.describe('prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });

  test('nenhuma animação roda e nada do hero fica com opacidade menor que 1', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);

    // Única opacidade fixa permitida: o esmaecido de design do painel (rótulos .62 e legenda .85, como na Noite).
    // Qualquer outro valor abaixo de 1 seria resto de animação.
    const menores = await page.evaluate(() =>
      [...document.querySelectorAll('section, section *')]
        .map((el) => ({ el, opacidade: parseFloat(getComputedStyle(el).opacity) }))
        .filter(({ el, opacidade }) => {
          if (opacidade >= 1) return false;
          const deDesign = el.closest('[role="group"]') !== null && (opacidade === 0.62 || opacidade === 0.85);
          return !deDesign;
        })
        .map(({ el, opacidade }) => `${el.tagName}.${el.className} ${opacidade}`),
    );
    expect(menores).toEqual([]);

    // o que entra com .entra fica na posição final, sem deslocamento
    const deslocados = await page.evaluate(() =>
      [...document.querySelectorAll('section *')]
        // dentro de um SVG, o transform é geometria do desenho (a logo), não animação
        .filter((el) => getComputedStyle(el).transform !== 'none' && !el.matches('[class*="freio"]') && !el.closest('svg'))
        .map((el) => el.className),
    );
    expect(deslocados).toEqual([]);
  });

  test('o painel inteiro aparece, e o brilho e a barra de idade ficam parados e completos', async ({ page }) => {
    await page.goto('/');
    // as perguntas frequentes usam <details>, que também é group: filtra pelo nome do painel
    const painel = page.getByRole('group', { name: site.acessibilidade.painel });
    await expect(painel).toBeVisible();
    expect(await painel.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
    const faixas = await page
      .locator('[role="img"] > [data-tom]')
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
    expect(faixas).toHaveLength(site.painel.idade.length);
    for (const t of faixas) expect(t).toBe('none');
  });
});

test('em 320px a barra do topo cabe na tela, sem rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
