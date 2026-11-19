import { expect, test, type Page } from '@playwright/test';
import { site } from '../../src/content/site';

const larguras = [390, 768, 1440];

const coletaErros = (page: Page) => {
  const erros: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') erros.push(msg.text());
  });
  page.on('pageerror', (erro) => erros.push(erro.message));
  return erros;
};

const rolagemDaPagina = (page: Page) =>
  page.evaluate(() => ({
    pagina: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    corpo: document.body.scrollWidth - document.documentElement.clientWidth,
  }));

/** Espera a rolagem suave terminar (a posição do topo da seção para de mudar). */
const esperaRolagemParar = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let anterior = -1;
        let iguais = 0;
        const confere = () => {
          const atual = window.scrollY;
          iguais = atual === anterior ? iguais + 1 : 0;
          anterior = atual;
          if (iguais >= 5) resolve();
          else requestAnimationFrame(confere);
        };
        requestAnimationFrame(confere);
      }),
  );

for (const largura of larguras) {
  test.describe(`seções em ${largura}px`, () => {
    test.use({ viewport: { width: largura, height: 900 } });

    test('sem rolagem horizontal da página e sem erro no console', async ({ page }) => {
      const erros = coletaErros(page);
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const rolagem = await rolagemDaPagina(page);
      expect(rolagem.pagina).toBeLessThanOrEqual(0);
      expect(rolagem.corpo).toBeLessThanOrEqual(0);
      await page.getByRole('region', { name: site.versoes.descricao }).evaluate((el) => (el.scrollLeft = el.scrollWidth));
      const depois = await rolagemDaPagina(page);
      expect(depois.pagina).toBeLessThanOrEqual(0);
      expect(depois.corpo).toBeLessThanOrEqual(0);
      expect(erros).toEqual([]);
    });

    test('todo link e botão visível tem pelo menos 44px de altura', async ({ page }) => {
      await page.goto('/');
      let medidos = 0;
      for (const controle of await page.locator('a, button, summary').all()) {
        if (!(await controle.isVisible())) continue;
        const caixa = await controle.boundingBox();
        const nome = (await controle.textContent())?.trim();
        expect(caixa?.height ?? 0, `altura de "${nome}"`).toBeGreaterThanOrEqual(44);
        medidos++;
      }
      // marca, botão do topo, hero, fundadoras, fechamento e as perguntas aparecem em todas as larguras
      expect(medidos).toBeGreaterThanOrEqual(6 + site.perguntas.length);
    });

    test('os títulos seguem h1, h2 e h3 sem pular nível', async ({ page }) => {
      await page.goto('/');
      const titulos = await page
        .locator('h1, h2, h3, h4, h5, h6')
        .evaluateAll((els) => els.map((el) => ({ nivel: Number(el.tagName[1]), texto: el.textContent?.trim() ?? '' })));

      expect(titulos[0]).toEqual({ nivel: 1, texto: site.titulo });
      for (let i = 1; i < titulos.length; i++) {
        expect(titulos[i].nivel, `"${titulos[i].texto}" depois de "${titulos[i - 1].texto}"`).toBeLessThanOrEqual(
          titulos[i - 1].nivel + 1,
        );
      }
      const h2 = titulos.filter((t) => t.nivel === 2).map((t) => t.texto);
      expect(h2).toEqual([
        site.porQue.titulo,
        site.secoes.itens,
        site.secoes.versoes,
        site.fundadoras.titulo,
        site.secoes.semLetraMiuda,
        site.secoes.emBreve,
        site.secoes.perguntas,
        site.fechamento.titulo,
      ]);
      const h3 = titulos.filter((t) => t.nivel === 3).map((t) => t.texto);
      expect(h3).toEqual([
        ...site.itens.map((i) => i.titulo),
        ...site.semLetraMiuda.map((i) => i.titulo),
        ...site.emBreve.map((i) => i.titulo),
      ]);
    });

    test('os itens e os quatro números aparecem na ordem do conteúdo', async ({ page }) => {
      await page.goto('/');
      const itens = page.locator('#itens li');
      await expect(itens).toHaveCount(site.itens.length);
      for (const [i, item] of site.itens.entries()) {
        await expect(itens.nth(i).getByRole('heading', { level: 3 })).toHaveText(item.titulo);
        await expect(itens.nth(i)).toContainText(item.texto);
      }

      const numeros = page.getByRole('region', { name: site.secoes.numeros }).locator('li');
      await expect(numeros).toHaveCount(site.numeros.length);
      for (const [i, numero] of site.numeros.entries()) {
        await expect(numeros.nth(i)).toContainText(numero.valor);
        await expect(numeros.nth(i)).toContainText(numero.rotulo);
      }
    });

    test('os números ficam em 4 colunas acima de 860px e em 2 abaixo', async ({ page }) => {
      await page.goto('/');
      const esquerdas = await page
        .getByRole('region', { name: site.secoes.numeros })
        .locator('li')
        .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().left)));
      const colunas = new Set(esquerdas).size;
      expect(colunas).toBe(largura > 860 ? 4 : 2);
    });

    test('tabela: cada linha tem os dois valores e as marcas têm texto acessível', async ({ page }) => {
      await page.goto('/');
      const tabela = page.getByRole('table', { name: site.versoes.descricao });
      await expect(tabela).toHaveCount(1);
      await expect(tabela.locator('thead th')).toHaveText([site.versoes.colunaRecurso, ...site.versoes.colunas]);

      const linhas = tabela.locator('tbody tr');
      await expect(linhas).toHaveCount(site.versoes.linhas.length + 1);
      for (const [i, linha] of site.versoes.linhas.entries()) {
        const tr = linhas.nth(i);
        await expect(tr.locator('th[scope="row"]')).toHaveText(linha.rotulo);
        const celulas = tr.locator('td');
        await expect(celulas).toHaveCount(2);
        for (const [j, valor] of [linha.loja, linha.lojaPlus].entries()) {
          const celula = celulas.nth(j);
          if (valor === true) {
            await expect(celula).toContainText('✓');
            await expect(celula.locator('.sr')).toHaveText(site.versoes.incluido);
          } else if (valor === false) {
            await expect(celula).toContainText('–');
            await expect(celula.locator('.sr')).toHaveText(site.versoes.naoIncluido);
          } else {
            await expect(celula).toHaveText(valor);
          }
        }
      }
      // nenhuma marca ficou sem texto acessível
      const marcas = await tabela.locator('td').evaluateAll((tds) =>
        tds
          .filter((td) => /[✓–]/.test(td.textContent ?? ''))
          .map((td) => ({ marca: td.textContent?.[0], sr: td.querySelector('.sr')?.textContent ?? '' })),
      );
      const esperadas = site.versoes.linhas.flatMap((l) => [l.loja, l.lojaPlus]).filter((v) => typeof v === 'boolean');
      expect(marcas).toHaveLength(esperadas.length);
      for (const marca of marcas) {
        expect(marca.sr).toBe(marca.marca === '✓' ? site.versoes.incluido : site.versoes.naoIncluido);
      }

      // linha de preço, destacada
      const preco = linhas.last();
      await expect(preco.locator('th')).toHaveText(site.versoes.preco.rotulo);
      await expect(preco.locator('td').nth(0)).toContainText(site.versoes.preco.loja.valor);
      await expect(preco.locator('td').nth(0)).toContainText(site.versoes.preco.loja.detalhe);
      await expect(preco.locator('td').nth(1)).toContainText(site.versoes.preco.lojaPlus.valor);
      await expect(preco.locator('td').nth(1)).toContainText(site.versoes.preco.lojaPlus.detalhe);
      const destaque = await preco.locator('td').first().evaluate((el) => ({
        tamanho: parseFloat(getComputedStyle(el).fontSize),
        borda: parseFloat(getComputedStyle(el).borderTopWidth),
      }));
      // no celular (<= 560px) o preço encolhe para a tabela caber inteira, mas segue maior que o texto da tabela (13px)
      expect(destaque.tamanho).toBeGreaterThanOrEqual(largura <= 560 ? 17 : 22);
      expect(destaque.borda).toBe(2);

      await expect(page.getByText(site.versoes.nota)).toBeVisible();
    });

    test('a coluna Loja+ tem o fundo --faixa', async ({ page }) => {
      await page.goto('/');
      const cores = await page.evaluate(() => {
        const teste = document.createElement('i');
        teste.style.color = 'var(--faixa)';
        document.body.appendChild(teste);
        const faixa = getComputedStyle(teste).color;
        teste.remove();
        const fundos = (seletor: string) =>
          [...document.querySelectorAll(seletor)].map((el) => getComputedStyle(el).backgroundColor);
        return {
          faixa,
          lojaPlus: fundos('#versoes tr > :nth-child(3)'),
          loja: fundos('#versoes tr > :nth-child(2)'),
        };
      });
      expect(cores.lojaPlus.length).toBeGreaterThan(0);
      for (const fundo of cores.lojaPlus) expect(fundo).toBe(cores.faixa);
      for (const fundo of cores.loja) expect(fundo).not.toBe(cores.faixa);
    });

    test('a tabela cabe inteira, sem rolagem lateral: as três colunas aparecem na janela', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const regiao = page.getByRole('region', { name: site.versoes.descricao });
      await expect(regiao).toHaveAttribute('tabindex', '0');
      await regiao.scrollIntoViewIfNeeded();

      const medidas = await regiao.evaluate((el) => ({
        rola: el.scrollWidth > el.clientWidth + 1,
        pagina: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      expect(medidas.pagina).toBeLessThanOrEqual(0);
      expect(medidas.rola).toBe(false);
      // a primeira coluna (rótulos) e a última (Loja+) estão inteiras dentro da janela
      const rotulo = page.getByRole('rowheader', { name: site.versoes.linhas[0].rotulo });
      const ultima = page.getByRole('columnheader', { name: site.versoes.colunas[site.versoes.colunas.length - 1] });
      for (const celula of [rotulo, ultima]) {
        await expect(celula).toBeVisible();
        const caixa = await celula.boundingBox();
        expect(caixa!.x).toBeGreaterThanOrEqual(0);
        expect(caixa!.x + caixa!.width).toBeLessThanOrEqual(largura);
      }
    });

    test('os botões do fechamento e do topo usam o link do WhatsApp com a mensagem certa (ou #agendar sem número)', async ({
      page,
    }) => {
      await page.goto('/');
      const confere = async (rotulo: string, mensagem: string, esperados: number) => {
        const links = page.getByRole('link', { name: rotulo });
        await expect(links).toHaveCount(esperados);
        for (let i = 0; i < esperados; i++) {
          const link = links.nth(i);
          const href = (await link.getAttribute('href')) ?? '';
          if (href.startsWith('https://wa.me/')) {
            expect(href).toContain(`text=${encodeURIComponent(mensagem)}`);
            await expect(link).toHaveAttribute('target', '_blank');
          } else {
            expect(href).toBe('#agendar');
            expect(await link.getAttribute('target')).toBeNull();
          }
        }
      };
      // "Agendar test-drive": topo, hero, vídeo, fundadoras e fechamento (um botão só por lugar)
      await confere(site.acoes.agendar.rotulo, site.acoes.agendar.mensagem, 5);

      const fechamento = page.locator('#agendar');
      await expect(fechamento.getByRole('heading', { level: 2 })).toHaveText(site.fechamento.titulo);
      await expect(fechamento).toContainText(site.fechamento.texto);
      await expect(fechamento.getByRole('link')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toHaveText(site.rodape);
    });

    test('fundadoras: título, texto e o botão de agendar, num bloco destacado', async ({ page }) => {
      await page.goto('/');
      const bloco = page.locator('#fundadoras');
      await expect(bloco.getByRole('heading', { level: 2 })).toHaveText(site.fundadoras.titulo);
      await expect(bloco).toContainText(site.fundadoras.texto);
      const link = bloco.getByRole('link', { name: site.acoes.agendar.rotulo });
      await expect(link).toHaveCount(1);
      const href = (await link.getAttribute('href')) ?? '';
      if (href.startsWith('https://wa.me/')) {
        expect(href).toContain(`text=${encodeURIComponent(site.acoes.agendar.mensagem)}`);
      } else {
        expect(href).toBe('#agendar');
      }
      // o destaque é um painel com borda, diferente das seções lisas
      const borda = await bloco.getByRole('heading', { level: 2 }).evaluate((h) => {
        for (let el = h.parentElement; el && el.id !== 'fundadoras'; el = el.parentElement) {
          const css = getComputedStyle(el);
          if (css.borderTopStyle !== 'none' && parseFloat(css.borderTopWidth) > 0 && css.borderLeftStyle !== 'none') return true;
        }
        return false;
      });
      expect(borda).toBe(true);
    });

    test('perguntas: todas aparecem e cada resposta abre pelo clique e pelo Enter', async ({ page }) => {
      await page.goto('/');
      const secao = page.locator('#perguntas');
      await expect(secao.getByRole('heading', { level: 2 })).toHaveText(site.secoes.perguntas);
      const itens = secao.locator('details');
      await expect(itens).toHaveCount(site.perguntas.length);
      for (const [i, item] of site.perguntas.entries()) {
        await expect(itens.nth(i).locator('summary')).toHaveText(item.pergunta);
        await expect(itens.nth(i).getByText(item.resposta)).toBeHidden();
      }

      const primeira = itens.first();
      await primeira.locator('summary').click();
      await expect(primeira.getByText(site.perguntas[0].resposta)).toBeVisible();

      const segunda = itens.nth(1);
      await segunda.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(segunda.getByText(site.perguntas[1].resposta)).toBeVisible();
      await page.keyboard.press('Enter');
      await expect(segunda.getByText(site.perguntas[1].resposta)).toBeHidden();
    });

    test('o vermelho aparece só na faixa "parado", no fio do hero e na linha do fechamento', async ({ page }) => {
      await page.goto('/');
      const usos = await page.evaluate(() => {
        const teste = document.createElement('i');
        teste.style.color = 'var(--vermelho)';
        document.body.appendChild(teste);
        const vermelho = getComputedStyle(teste).color;
        teste.remove();
        const lados = ['Top', 'Right', 'Bottom', 'Left'] as const;
        const achados: { onde: string; dentroDoHero: boolean }[] = [];
        const hero = document.querySelector('main > section');
        for (const el of document.querySelectorAll('body, body *')) {
          for (const pseudo of [null, '::before', '::after'] as const) {
            const e = getComputedStyle(el, pseudo);
            if (pseudo && e.content === 'none') continue;
            const usa =
              e.backgroundColor === vermelho ||
              e.color === vermelho ||
              e.boxShadow.includes('211, 38, 28') ||
              (e.outlineStyle !== 'none' && e.outlineColor === vermelho) ||
              lados.some((l) => e[`border${l}Style`] !== 'none' && e[`border${l}Color`] === vermelho);
            if (usa) {
              achados.push({
                onde: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className)}${pseudo ?? ''}`,
                dentroDoHero: hero?.contains(el) ?? false,
              });
            }
          }
        }
        return achados;
      });

      const abaixoDoHero = usos.filter((u) => !u.dentroDoHero);
      expect(abaixoDoHero, JSON.stringify(abaixoDoHero)).toHaveLength(1);
      expect(abaixoDoHero[0].onde).toMatch(/^section#agendar\..*::before$/);

      const noHero = usos.filter((u) => u.dentroDoHero);
      // faixa "parado" (barra e marca da legenda) e o fio do hero
      expect(noHero, JSON.stringify(noHero)).toHaveLength(3);
      expect(noHero.filter((u) => /freio/.test(u.onde))).toHaveLength(1);
    });

    test('rolar até a seção: clicar em "Versões" leva a seção ao topo da janela, sem trocar o hash', async ({ page }) => {
      test.skip(largura <= 560, 'os links de texto do topo só existem a partir de 561px');
      const erros = coletaErros(page);
      await page.goto('/');
      const urlAntes = page.url();
      await page.getByRole('link', { name: site.nav[1].rotulo }).click();
      await esperaRolagemParar(page);
      const topo = await page.locator('#versoes').evaluate((el) => el.getBoundingClientRect().top);
      expect(Math.abs(topo)).toBeLessThanOrEqual(2);
      expect(page.url()).toBe(urlAntes);
      expect(await page.evaluate(() => location.hash)).toBe('');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('versoes');

      await page.getByRole('link', { name: site.nav[0].rotulo }).click();
      await esperaRolagemParar(page);
      const topoItens = await page.locator('#itens').evaluate((el) => el.getBoundingClientRect().top);
      expect(Math.abs(topoItens)).toBeLessThanOrEqual(2);
      expect(page.url()).toBe(urlAntes);
      expect(erros).toEqual([]);
    });
  });
}

test.describe('"Ilimitados" ao lado do número vizinho', () => {
  for (const largura of [1024, 861, 1440]) {
    test(`não encosta em ${largura}px`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 900 });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const caixas = await page.getByRole('region', { name: site.secoes.numeros }).locator('li > p:first-child').evaluateAll(
        (els) =>
          els.map((el) => {
            const intervalo = document.createRange();
            intervalo.selectNodeContents(el);
            const texto = intervalo.getBoundingClientRect();
            const coluna = el.getBoundingClientRect();
            return { texto: el.textContent, esquerda: texto.left, direita: texto.right, colunaDireita: coluna.right };
          }),
      );
      const i = caixas.findIndex((c) => c.texto === 'Ilimitados');
      expect(i).toBeGreaterThan(-1);
      const proximo = caixas[i + 1];
      // o texto cabe na própria coluna e deixa um vão visível até o número vizinho
      expect(caixas[i].direita).toBeLessThanOrEqual(caixas[i].colunaDireita + 0.5);
      expect(proximo.esquerda - caixas[i].direita).toBeGreaterThanOrEqual(12);
    });
  }
});

test.describe('clique no botão com o destino #agendar (sem número configurado)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('rola até o fechamento sem trocar o hash', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('link', { name: site.acoes.agendar.rotulo }).nth(1);
    test.skip((await botao.getAttribute('href')) !== '#agendar', 'build com número de WhatsApp: o botão abre o WhatsApp');
    await botao.click();
    await esperaRolagemParar(page);
    const topo = await page.locator('#agendar').evaluate((el) => el.getBoundingClientRect().top);
    // é a última seção: o fim da página pode impedir o alinhamento exato, mas ela sobe até a janela
    expect(topo).toBeLessThan(450);
    expect(await page.evaluate(() => location.hash)).toBe('');
  });
});

test.describe('prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });

  test('nada das seções fica escondido, sem animação, e a rolagem é imediata', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);

    const escondidos = await page.evaluate(() =>
      [...document.querySelectorAll('main > section:not(:first-child), main > section:not(:first-child) *')]
        // source e track ficam dentro do <video> e não são desenhados: o navegador não calcula estilo para eles
        .filter((el) => !el.matches('video *'))
        .filter((el) => {
          const e = getComputedStyle(el);
          return parseFloat(e.opacity) < 1 || e.visibility === 'hidden' || e.transform !== 'none';
        })
        .map((el) => `${el.tagName}.${el.className}`),
    );
    expect(escondidos).toEqual([]);
    for (const titulo of [
      site.porQue.titulo,
      site.secoes.itens,
      site.secoes.versoes,
      site.fundadoras.titulo,
      site.secoes.semLetraMiuda,
      site.secoes.emBreve,
      site.secoes.perguntas,
      site.fechamento.titulo,
    ]) {
      await expect(page.getByRole('heading', { level: 2, name: titulo })).toBeVisible();
    }

    await page.getByRole('link', { name: site.nav[1].rotulo }).click();
    // imediata: sem esperar a rolagem suave terminar
    await expect
      .poll(() => page.locator('#versoes').evaluate((el) => Math.abs(el.getBoundingClientRect().top)), { timeout: 500 })
      .toBeLessThanOrEqual(2);
    expect(await page.evaluate(() => location.hash)).toBe('');
  });
});
