import { expect, test, type Page } from '@playwright/test';
import { site } from '../../src/content/site';

// Os arquivos do vídeo da seção "Por que o AutoHub", servidos pelo próprio site (public/video/).
test('capa e legenda: a legenda tem as nove falas e o vídeo responde a Range', async ({ request }) => {
  const legenda = await request.get('/video/autohub-demo.vtt');
  expect(legenda.status()).toBe(200);
  const texto = await legenda.text();
  expect(texto.startsWith('WEBVTT')).toBe(true);
  expect(texto.match(/-->/g)).toHaveLength(9);
  expect(texto).toContain('Mas quanto?');
  expect(texto).toContain('AutoHub.');

  const capa = await request.get('/video/autohub-demo.jpg');
  expect(capa.status()).toBe(200);
  expect(capa.headers()['content-type']).toBe('image/jpeg');

  // O navegador pede o vídeo em pedaços (e volta ao início pedindo de novo): sem Range não dá para recomeçar.
  const pedaco = await request.get('/video/autohub-demo-720.mp4', { headers: { Range: 'bytes=0-99' } });
  expect(pedaco.status()).toBe(206);
  expect(pedaco.headers()['content-range']).toMatch(/^bytes 0-99\/\d+$/);
  expect((await pedaco.body()).length).toBe(100);
  // sem tamanho declarado (resposta em pedaços), o Safari do npm run preview pode recusar o vídeo
  expect(pedaco.headers()['content-length']).toBe('100');
});

const estado = (page: Page) =>
  page.locator('video').evaluate((v: HTMLVideoElement) => ({
    tocando: !v.paused,
    tempo: v.currentTime,
    mudo: v.muted,
    controles: v.controls,
    loop: v.loop,
    fonte: v.currentSrc,
  }));

const rolaAteVideo = (page: Page) => page.locator('video').evaluate((v) => v.scrollIntoView({ block: 'center' }));
const rolaAoTopo = (page: Page) => page.evaluate(() => window.scrollTo(0, 0));

test.describe('seção Por que o AutoHub', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('a seção vem logo depois dos números, com rótulo, título, nota e o botão de agendar', async ({ page }) => {
    await page.goto('/');
    const secao = page.locator('main > section').nth(2);
    await expect(secao.getByRole('heading', { level: 2 })).toHaveText(site.porQue.titulo);
    await expect(secao.getByText(site.secoes.porQue, { exact: true })).toBeVisible();
    await expect(secao.getByText(site.porQue.nota)).toBeVisible();
    await expect(secao.getByRole('link', { name: site.acoes.agendar.rotulo })).toBeVisible();
    await expect(page.getByRole('region', { name: site.porQue.titulo })).toBeVisible();
  });

  test('o vídeo tem capa, toca em linha e traz a legenda em português', async ({ page }) => {
    await page.goto('/');
    const video = page.locator('video');
    await expect(video).toHaveAttribute('poster', '/video/autohub-demo.jpg');
    await expect(video).toHaveAttribute('playsinline', '');
    await expect(video.locator('track')).toHaveAttribute('kind', 'captions');
    await expect(video.locator('track')).toHaveAttribute('srclang', 'pt-BR');
    await expect(video.locator('track')).toHaveAttribute('src', '/video/autohub-demo.vtt');
  });

  test('mudo, toca sozinho ao aparecer e pausa ao sair; no computador vem o de 1080p', async ({ page }) => {
    await page.goto('/');
    await rolaAteVideo(page);
    await expect.poll(async () => (await estado(page)).tempo, { timeout: 10_000 }).toBeGreaterThan(0.5);
    const tocando = await estado(page);
    expect(tocando).toMatchObject({ tocando: true, mudo: true, controles: false, loop: true });
    expect(tocando.fonte).toMatch(/-1080\.mp4$/);
    await rolaAoTopo(page);
    await expect.poll(async () => (await estado(page)).tocando).toBe(false);
  });

  test('"Assistir com som" recomeça do início com som e mostra os controles', async ({ page }) => {
    await page.goto('/');
    await rolaAteVideo(page);
    await expect.poll(async () => (await estado(page)).tempo, { timeout: 10_000 }).toBeGreaterThan(1);
    const botao = page.getByRole('button', { name: site.porQue.comSom });
    await botao.click();
    const logo = await estado(page);
    expect(logo).toMatchObject({ mudo: false, controles: true, loop: false });
    expect(logo.tempo).toBeLessThan(1);
    await expect(botao).toBeHidden();
    await page.waitForTimeout(1000);
    expect((await estado(page)).tocando).toBe(true);
  });

  test('quem pausou com som não vê o vídeo recomeçar ao rolar de volta', async ({ page }) => {
    await page.goto('/');
    await rolaAteVideo(page);
    await page.getByRole('button', { name: site.porQue.comSom }).click();
    await page.locator('video').evaluate((v: HTMLVideoElement) => v.pause());
    await rolaAoTopo(page);
    await rolaAteVideo(page);
    await page.waitForTimeout(1000);
    expect(await estado(page)).toMatchObject({ tocando: false, mudo: false });
  });

  test('quem silencia pelos controles e pausa não vê o vídeo voltar a tocar', async ({ page }) => {
    await page.goto('/');
    await rolaAteVideo(page);
    await page.getByRole('button', { name: site.porQue.comSom }).click();
    await page.locator('video').evaluate((v: HTMLVideoElement) => {
      v.muted = true;
      v.pause();
    });
    await rolaAoTopo(page);
    await rolaAteVideo(page);
    await page.waitForTimeout(1000);
    expect((await estado(page)).tocando).toBe(false);
  });

  test('depois de "Assistir com som" pelo teclado, o foco vai para o vídeo', async ({ page }) => {
    await page.goto('/');
    await rolaAteVideo(page);
    await page.getByRole('button', { name: site.porQue.comSom }).focus();
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('VIDEO');
  });

  test('o loop mudo tem "Pausar": fica parado ao rolar de volta, e "Continuar" volta a tocar mudo', async ({ page }) => {
    await page.goto('/');
    await rolaAteVideo(page);
    await expect.poll(async () => (await estado(page)).tocando, { timeout: 10_000 }).toBe(true);
    await page.getByRole('button', { name: site.porQue.pausar }).click();
    expect((await estado(page)).tocando).toBe(false);
    await rolaAoTopo(page);
    await rolaAteVideo(page);
    await page.waitForTimeout(1000);
    expect((await estado(page)).tocando).toBe(false);
    await page.getByRole('button', { name: site.porQue.continuar }).click();
    await expect.poll(async () => (await estado(page)).tocando).toBe(true);
    expect((await estado(page)).mudo).toBe(true);
  });

  test('autoplay recusado: a capa e o botão ficam, sem erro na página', async ({ page }) => {
    const erros: string[] = [];
    page.on('pageerror', (erro) => erros.push(erro.message));
    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('recusado', 'NotAllowedError'));
    });
    await page.goto('/');
    await rolaAteVideo(page);
    await page.waitForTimeout(1000);
    await expect(page.getByRole('button', { name: site.porQue.comSom })).toBeVisible();
    expect(erros).toEqual([]);
  });
});

test.describe('vídeo com movimento reduzido', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('com movimento reduzido o vídeo espera o botão', async ({ page }) => {
    await page.goto('/');
    await rolaAteVideo(page);
    await page.waitForTimeout(1000);
    expect((await estado(page)).tocando).toBe(false);
    await page.getByRole('button', { name: site.porQue.comSom }).click();
    await expect.poll(async () => (await estado(page)).tempo, { timeout: 10_000 }).toBeGreaterThan(0.3);
    expect((await estado(page)).mudo).toBe(false);
  });
});

test.describe('vídeo no celular', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('nenhum vídeo baixa antes de a seção aparecer; no celular vem o de 720p', async ({ page }) => {
    const videos: string[] = [];
    page.on('request', (pedido) => {
      if (pedido.url().endsWith('.mp4')) videos.push(pedido.url());
    });
    await page.goto('/');
    await page.waitForTimeout(800);
    expect(videos).toEqual([]);
    await rolaAteVideo(page);
    await expect.poll(async () => (await estado(page)).tempo, { timeout: 10_000 }).toBeGreaterThan(0.3);
    expect((await estado(page)).fonte).toMatch(/-720\.mp4$/);
    expect(videos.every((url) => url.endsWith('-720.mp4'))).toBe(true);
  });
});
