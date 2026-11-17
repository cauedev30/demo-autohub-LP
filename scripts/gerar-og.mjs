// Gera public/og.png (1200x630) a partir do hero da página construída em out/.
// Uso: npm run build && npm run gerar-og && npm run build   (o segundo build copia a imagem nova para out/)
// Usa o Chrome já instalado (channel 'chrome'); nenhum navegador é baixado.
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const aqui = dirname(fileURLToPath(import.meta.url));
const projeto = resolve(aqui, '..');
const porta = Number(process.env.OG_PORTA ?? 4181);
const destino = resolve(projeto, 'public', 'og.png');
const base = `http://localhost:${porta}`;

const servidor = spawn(process.execPath, [resolve(aqui, 'servir-out.mjs'), resolve(projeto, 'out'), String(porta)], {
  stdio: 'ignore',
});

async function esperarServidor() {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {
      // ainda subindo
    }
    await new Promise((ok) => setTimeout(ok, 200));
  }
  throw new Error(`O servidor de out/ não respondeu em ${base}. Rode "npm run build" antes.`);
}

let navegador;
try {
  await esperarServidor();
  navegador = await chromium.launch({ channel: 'chrome' });
  // A página é montada em 1440x756 (a proporção 1200x630 do cartão) e reduzida por deviceScaleFactor para 1200x630:
  // assim o hero aparece como na tela grande, e não espremido em 1200px de largura.
  const pagina = await navegador.newPage({
    viewport: { width: 1440, height: 756 },
    deviceScaleFactor: 1200 / 1440,
    // Movimento reduzido: a página já nasce no estado final (sem entrada, brilho nem fio acendendo).
    reducedMotion: 'reduce',
  });
  await pagina.goto(base);
  // A barra do topo (com a marca, que saiu do h1 do hero) e o hero, centrado no resto da altura do cartão;
  // sem as seções seguintes.
  const alturaTopo = await pagina.locator('header').evaluate((el) => el.offsetHeight);
  await pagina.addStyleTag({
    content: `
      main > section:not(:first-child), footer { display: none !important; }
      main > section:first-child { min-height: ${756 - alturaTopo}px; display: flex; flex-direction: column; justify-content: center; }
      main > section:first-child > div:nth-child(2) { width: 100%; }`,
  });
  await pagina.evaluate(() => document.fonts.ready);
  await mkdir(dirname(destino), { recursive: true });
  await pagina.screenshot({ path: destino, clip: { x: 0, y: 0, width: 1440, height: 756 } });
  console.log(`Imagem gerada: ${destino}`);
} finally {
  await navegador?.close();
  servidor.kill();
}
