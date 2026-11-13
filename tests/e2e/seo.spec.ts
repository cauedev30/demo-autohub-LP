import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { site } from '../../src/content/site';

// Lê os arquivos que o build deixou em out/ (rode "npm run build" antes). Sem NEXT_PUBLIC_INDEXAR=sim no
// ambiente do teste, a página tem de sair com noindex; com ele, indexável e listada no sitemap.
const indexar = process.env.NEXT_PUBLIC_INDEXAR === 'sim';
const out = (arquivo: string) => readFileSync(resolve(process.cwd(), 'out', arquivo), 'utf-8');

const html = out('index.html');
const meta = (atributo: 'name' | 'property', nome: string) =>
  html.match(new RegExp(`<meta ${atributo}="${nome}" content="([^"]*)"`))?.[1];
const decodifica = (texto: string | undefined) => texto?.replaceAll('&amp;', '&').replaceAll('&#x27;', "'");

test.describe('SEO e compartilhamento em out/', () => {
  test('título, descrição e canônica', () => {
    expect(html).toContain(`<title>${site.seo.titulo}</title>`);
    expect(meta('name', 'description')).toBe(site.seo.descricao);
    const canonica = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    expect(canonica).toMatch(/^https?:\/\/[^/]+(\/.*)?\/$/);
    const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');
    if (base) expect(canonica).toBe(`${base}/`);
  });

  test('Open Graph e Twitter, com imagem em URL absoluta do mesmo site', () => {
    const canonica = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
    const origem = new URL(canonica).origin;
    expect(meta('property', 'og:type')).toBe('website');
    expect(meta('property', 'og:locale')).toBe('pt_BR');
    expect(meta('property', 'og:site_name')).toBe(site.seo.nomeSite);
    expect(meta('property', 'og:title')).toBe(site.seo.titulo);
    expect(meta('property', 'og:description')).toBe(site.seo.descricao);
    expect(meta('property', 'og:url')).toBe(canonica);
    expect(meta('property', 'og:image')).toBe(`${origem}/og.png`);
    expect(meta('property', 'og:image:width')).toBe('1200');
    expect(meta('property', 'og:image:height')).toBe('630');
    expect(decodifica(meta('property', 'og:image:alt'))).toBe(site.seo.imagemAlt);
    expect(meta('name', 'twitter:card')).toBe('summary_large_image');
    expect(meta('name', 'twitter:image')).toBe(`${origem}/og.png`);
    expect(meta('name', 'twitter:title')).toBe(site.seo.titulo);
  });

  test('a imagem de compartilhamento existe em out/ com 1200x630', () => {
    const png = readFileSync(resolve(process.cwd(), 'out', 'og.png'));
    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  test('robots da página, robots.txt e sitemap.xml seguem NEXT_PUBLIC_INDEXAR', () => {
    const origem = new URL(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '').origin;
    const robotsTxt = out('robots.txt');
    const sitemap = out('sitemap.xml');
    expect(sitemap).toContain('<urlset');
    if (indexar) {
      expect(meta('name', 'robots')).toBe('index, follow');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).not.toMatch(/Disallow: \/\s*$/m);
      expect(robotsTxt).toContain(`Sitemap: ${origem}/sitemap.xml`);
      expect(sitemap).toContain(`<loc>${origem}/</loc>`);
    } else {
      expect(meta('name', 'robots')).toBe('noindex, nofollow');
      expect(robotsTxt).toMatch(/^Disallow: \/\s*$/m);
      expect(robotsTxt).not.toContain('Allow:');
      expect(sitemap).not.toContain('<loc>');
    }
  });

  test('theme-color e ícone', () => {
    expect(meta('name', 'theme-color')).toBe('#0B0C0E');
    expect(html).toMatch(/<link rel="icon" href="\/icon\.svg/);
  });
});
