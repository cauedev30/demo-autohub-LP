import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { site } from '../../src/content/site';

const larguras = [390, 768, 1440];

/** Espera as animações de entrada terminarem: o axe mede contraste com a opacidade do momento. */
const esperaAnimacoes = (page: Page) =>
  page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)).then(() => undefined));

const abre = async (page: Page, caminho = '/') => {
  await page.goto(caminho);
  await page.evaluate(() => document.fonts.ready);
  await esperaAnimacoes(page);
};

for (const largura of larguras) {
  test.describe(`acessibilidade em ${largura}px`, () => {
    test.use({ viewport: { width: largura, height: 900 } });

    test('axe: nenhuma violação séria ou crítica (WCAG 2.1 A/AA e boas práticas)', async ({ page }) => {
      await abre(page);
      const resultado = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();
      const graves = resultado.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(
        graves.map((v) => ({ regra: v.id, impacto: v.impact, alvos: v.nodes.map((n) => n.target.join(' ')) })),
      ).toEqual([]);
    });

    test('contraste: o que o axe não consegue medir (gradiente, sobreposição) fica acima do mínimo WCAG AA', async ({
      page,
    }) => {
      await abre(page);
      // O axe marca como "incompleto" o texto sobre o spot de luz (gradiente) e sobre camadas translúcidas.
      // Aqui cada nó incompleto é medido por conta própria: cor do texto com a opacidade acumulada sobre o
      // fundo opaco mais próximo; no hero, o fundo é clareado pelo máximo do spot (13% de branco), o pior caso.
      const resultado = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
      const alvos = resultado.incomplete.flatMap((i) => i.nodes.map((n) => n.target.join(' ')));
      const medidas = await page.evaluate((seletores) => {
        const analisa = (css: string) => {
          const m = css.match(/rgba?\(([^)]+)\)/);
          if (!m) return [0, 0, 0, 1];
          const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
          return [p[0], p[1], p[2], p[3] ?? 1];
        };
        const sobre = (topo: number[], base: number[]) => {
          const a = topo[3];
          return [0, 1, 2].map((i) => topo[i] * a + base[i] * (1 - a)).concat(1);
        };
        const lum = (c: number[]) => {
          const [r, g, b] = c.slice(0, 3).map((v) => {
            const x = v / 255;
            return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        return seletores.map((seletor) => {
          const el = document.querySelector<HTMLElement>(seletor);
          if (!el) return { seletor, razao: Infinity, limite: 4.5, achou: false };
          // fundo: camadas translúcidas empilhadas até achar uma opaca (ou o body)
          const camadas: number[][] = [];
          let opacidade = 1;
          for (let n: HTMLElement | null = el; n; n = n.parentElement) {
            opacidade *= Number(getComputedStyle(n).opacity);
            const fundo = analisa(getComputedStyle(n).backgroundColor);
            if (n !== el || fundo[3] > 0) if (fundo[3] > 0) camadas.push(fundo);
            if (fundo[3] === 1) break;
          }
          let fundo = camadas.length && camadas[camadas.length - 1][3] === 1 ? camadas.pop()! : analisa(getComputedStyle(document.body).backgroundColor);
          while (camadas.length) fundo = sobre(camadas.pop()!, fundo);
          if (el.closest('section') === document.querySelector('main > section')) fundo = sobre([255, 255, 255, 0.13], fundo);
          const css = getComputedStyle(el);
          const cor = analisa(css.color);
          cor[3] *= opacidade;
          const texto = sobre(cor, fundo);
          const [l1, l2] = [lum(texto), lum(fundo)].sort((a, b) => b - a);
          const px = parseFloat(css.fontSize);
          const grande = px >= 24 || (px >= 18.66 && Number(css.fontWeight) >= 700);
          return { seletor, razao: (l1 + 0.05) / (l2 + 0.05), limite: grande ? 3 : 4.5, achou: true };
        });
      }, alvos);
      const reprovados = medidas.filter((m) => !m.achou || m.razao < m.limite);
      expect(reprovados).toEqual([]);
    });

    test('contraste dos tokens: texto cinza (--mudo) sobre o preto e legendas do painel', async ({ page }) => {
      await abre(page);
      const razoes = await page.evaluate(() => {
        const css = getComputedStyle(document.documentElement);
        const hex = (v: string) => {
          const h = v.trim().replace('#', '');
          return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
        };
        const lum = (c: number[]) => {
          const [r, g, b] = c.map((v) => {
            const x = v / 255;
            return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const razao = (a: number[], b: number[]) => {
          const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
          return (x + 0.05) / (y + 0.05);
        };
        const mistura = (topo: number[], base: number[], a: number) => topo.map((v, i) => v * a + base[i] * (1 - a));
        const bg = hex(css.getPropertyValue('--bg'));
        const mudo = hex(css.getPropertyValue('--mudo'));
        const painel = hex(css.getPropertyValue('--painel'));
        const painelFg = hex(css.getPropertyValue('--painel-fg'));
        return {
          mudoSobrePreto: razao(mudo, bg),
          mudoSobreSpot: razao(mudo, mistura([255, 255, 255], bg, 0.13)),
          rotuloPainel: razao(mistura(painelFg, painel, 0.62), painel),
          legendaPainel: razao(mistura(painelFg, painel, 0.85), painel),
        };
      });
      expect(razoes.mudoSobrePreto).toBeGreaterThanOrEqual(4.5);
      expect(razoes.mudoSobreSpot).toBeGreaterThanOrEqual(4.5);
      expect(razoes.rotuloPainel).toBeGreaterThanOrEqual(4.5);
      expect(razoes.legendaPainel).toBeGreaterThanOrEqual(4.5);
    });

    test('axe: com movimento reduzido também não há violação séria ou crítica', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await abre(page);
      const resultado = await new AxeBuilder({ page }).analyze();
      expect(resultado.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
    });

    test('a ordem dos títulos é h1, h2, h3, sem pular nível e com um h1 só', async ({ page }) => {
      await abre(page);
      const niveis = await page.evaluate(() =>
        [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => Number(h.tagName[1])),
      );
      expect(niveis.filter((n) => n === 1)).toHaveLength(1);
      expect(niveis[0]).toBe(1);
      for (let i = 1; i < niveis.length; i++) {
        expect(niveis[i], `título ${i + 1} (h${niveis[i]}) depois de h${niveis[i - 1]}`).toBeLessThanOrEqual(
          niveis[i - 1] + 1,
        );
      }
      expect(niveis.length).toBeGreaterThan(5);
    });

    test('o skip link: fora da tela, é o primeiro Tab, aparece no foco e leva ao <main>', async ({ page }) => {
      await abre(page);
      const link = page.getByRole('link', { name: site.acessibilidade.pularConteudo });
      await expect(link).toHaveAttribute('href', '#conteudo');
      // Antes do foco: totalmente acima da janela.
      const antes = await link.boundingBox();
      expect((antes?.y ?? 0) + (antes?.height ?? 0)).toBeLessThanOrEqual(0);

      await page.keyboard.press('Tab');
      await expect(link).toBeFocused();
      const depois = await link.boundingBox();
      expect(depois?.y ?? -1).toBeGreaterThanOrEqual(0);
      expect(depois?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect((depois?.x ?? 0) + (depois?.width ?? 0)).toBeLessThanOrEqual(largura);

      await page.keyboard.press('Enter');
      await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('MAIN');
      await expect(page.locator('main')).toHaveAttribute('id', 'conteudo');
      // O próximo Tab cai dentro do conteúdo, não de volta no topo.
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.closest('main') !== null)).toBe(true);
    });

    test('todo controle focável por Tab mostra um contorno de foco visível', async ({ page }) => {
      await abre(page);
      const total = await page.evaluate(
        () =>
          [...document.querySelectorAll<HTMLElement>('a[href], button, [tabindex]')].filter(
            (el) => el.tabIndex >= 0 && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden',
          ).length,
      );
      expect(total).toBeGreaterThanOrEqual(8);

      const semFoco: string[] = [];
      let vistos = 0;
      for (let i = 0; i < total; i++) {
        await page.keyboard.press('Tab');
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const css = getComputedStyle(el);
          const rotulo = `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 30)}" ${el.className}`;
          const contorno =
            css.outlineStyle !== 'none' &&
            parseFloat(css.outlineWidth) >= 2 &&
            css.outlineColor !== 'rgba(0, 0, 0, 0)' &&
            css.outlineColor !== 'transparent';
          return { rotulo, contorno };
        });
        expect(info, `o Tab ${i + 1} caiu fora de um controle`).not.toBeNull();
        if (!info) continue;
        vistos++;
        if (!info.contorno) semFoco.push(info.rotulo);
      }
      expect(semFoco).toEqual([]);
      expect(vistos).toBe(total);
    });
  });
}

test.describe('página 404', () => {
  for (const largura of [390, 1440]) {
    test(`axe sem violação séria ou crítica em ${largura}px`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 900 });
      const resposta = await page.goto('/nao-existe/');
      expect(resposta?.status()).toBe(404);
      await page.evaluate(() => document.fonts.ready);
      await esperaAnimacoes(page);
      const resultado = await new AxeBuilder({ page }).analyze();
      expect(resultado.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
    });
  }
});
