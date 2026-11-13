import { expect, test } from '@playwright/test';

// Colisão e alvo de toque medidos no navegador, sem o checador da Taste Skill (o `check.mjs` dela só olha o
// layout; colisão e tamanho de toque ficam no `consistency.mjs`, que não roda aqui).
const larguras = [320, 390, 768, 1024, 1440];

for (const largura of larguras) {
  test.describe(`colisão e toque em ${largura}px`, () => {
    test.use({ viewport: { width: largura, height: 900 } });

    test('nenhuma linha de texto se sobrepõe a outra linha de texto nem a um botão que não a contém', async ({
      page,
    }) => {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)).then(() => undefined));

      const achados = await page.evaluate(() => {
        type Caixa = { x: number; y: number; w: number; h: number; rotulo: string; no: Node };
        const visivel = (el: Element) => {
          const css = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return css.visibility !== 'hidden' && css.display !== 'none' && r.width > 1 && r.height > 1;
        };
        const textos: Caixa[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const pai = n.parentElement;
          if (!pai || !(n.textContent ?? '').trim()) continue;
          if (pai.closest('.sr, script, style, noscript, [hidden]') || !visivel(pai)) continue;
          const range = document.createRange();
          range.selectNodeContents(n);
          for (const r of range.getClientRects()) {
            if (r.width < 2 || r.height < 2) continue;
            textos.push({ x: r.x, y: r.y, w: r.width, h: r.height, rotulo: (n.textContent ?? '').trim().slice(0, 28), no: n });
          }
        }
        const botoes: Caixa[] = [...document.querySelectorAll('a[href], button')]
          .filter((el) => visivel(el) && el.getBoundingClientRect().bottom > 0)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height, rotulo: (el.textContent ?? '').trim().slice(0, 28), no: el };
          });

        // margem de 1px: o encosto de caixas vizinhas não é colisão; o corte é só o miolo da linha (altura útil 70%)
        const cruza = (a: Caixa, b: Caixa) => {
          const aY = a.y + a.h * 0.15;
          const aH = a.h * 0.7;
          const bY = b.y + b.h * 0.15;
          const bH = b.h * 0.7;
          return a.x + 1 < b.x + b.w && b.x + 1 < a.x + a.w && aY + 1 < bY + bH && bY + 1 < aY + aH;
        };
        const achados: string[] = [];
        for (let i = 0; i < textos.length; i++) {
          for (let j = i + 1; j < textos.length; j++) {
            if (textos[i].no !== textos[j].no && cruza(textos[i], textos[j])) {
              achados.push(`texto "${textos[i].rotulo}" x texto "${textos[j].rotulo}"`);
            }
          }
          for (const botao of botoes) {
            if (botao.no.contains(textos[i].no)) continue;
            if (cruza(textos[i], botao)) achados.push(`texto "${textos[i].rotulo}" x botão "${botao.rotulo}"`);
          }
        }
        return achados;
      });
      expect(achados).toEqual([]);
    });

    test('todo alvo de toque visível tem 44x44px ou mais e nenhum se sobrepõe a outro', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const alvos = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('a[href], button, [tabindex="0"]')]
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          // o skip link fica acima da janela até receber o foco
          .filter(({ r }) => r.width > 1 && r.height > 1 && r.bottom > 0)
          .map(({ el, r }) => ({
            rotulo: (el.textContent ?? '').trim().slice(0, 28) || el.getAttribute('aria-label') || el.tagName,
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height,
          })),
      );
      expect(alvos.length).toBeGreaterThanOrEqual(7);
      const pequenos = alvos.filter((a) => a.w < 44 || a.h < 44).map((a) => `${a.rotulo} ${Math.round(a.w)}x${Math.round(a.h)}`);
      expect(pequenos).toEqual([]);
      for (let i = 0; i < alvos.length; i++) {
        for (let j = i + 1; j < alvos.length; j++) {
          const a = alvos[i];
          const b = alvos[j];
          const sobrepoe = a.x + 1 < b.x + b.w && b.x + 1 < a.x + a.w && a.y + 1 < b.y + b.h && b.y + 1 < a.y + a.h;
          expect(sobrepoe, `${a.rotulo} e ${b.rotulo} se sobrepõem`).toBe(false);
        }
      }
    });
  });
}
