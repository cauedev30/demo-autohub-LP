import { expect, test } from '@playwright/test';
import { site } from '../../src/content/site';

const larguras = [390, 768, 1440];

for (const largura of larguras) {
  test.describe(`largura ${largura}`, () => {
    test.use({ viewport: { width: largura, height: 900 } });

    test('abre, sem rolagem horizontal e sem erro no console', async ({ page }) => {
      const erros: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') erros.push(msg.text());
      });
      page.on('pageerror', (erro) => erros.push(erro.message));
      const googleFonts: string[] = [];
      page.on('request', (req) => {
        if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) googleFonts.push(req.url());
      });

      const resposta = await page.goto('/');
      expect(resposta?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      await page.evaluate(() => document.fonts.ready);
      const rolagem = await page.evaluate(() => ({
        pagina: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        corpo: document.body.scrollWidth - document.documentElement.clientWidth,
      }));
      expect(rolagem.pagina).toBeLessThanOrEqual(0);
      expect(rolagem.corpo).toBeLessThanOrEqual(0);

      expect(googleFonts).toEqual([]);
      expect(erros).toEqual([]);
    });
  });
}

test('a Archivo carrega do próprio site e o h1 do hero é a promessa, na Archivo', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const carregada = await page.evaluate(() =>
    [...document.fonts].some((f) => f.family.includes('Archivo') && f.status === 'loaded'),
  );
  expect(carregada).toBe(true);

  // O h1 é a frase da promessa (a marca fica na barra do topo), desenhada com a Archivo.
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveText(site.titulo);
  const fonte = await h1.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(fonte).toContain('Archivo');
});
