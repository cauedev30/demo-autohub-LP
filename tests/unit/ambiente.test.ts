import { describe, expect, it } from 'vitest';
import { indexavel, urlSite } from '@/lib/ambiente';

describe('urlSite', () => {
  it('devolve a origem sem a barra final', () => {
    expect(urlSite('https://autohub.exemplo.workers.dev/')).toBe('https://autohub.exemplo.workers.dev');
    expect(urlSite('  https://autohub.com.br  ')).toBe('https://autohub.com.br');
  });

  it('cai no localhost quando a variável falta ou é inválida', () => {
    expect(urlSite('')).toBe('http://localhost:3000');
    expect(urlSite(undefined)).toBe('http://localhost:3000');
    expect(urlSite('isso não é uma url')).toBe('http://localhost:3000');
    expect(urlSite('javascript:alert(1)')).toBe('http://localhost:3000');
  });
});

describe('indexavel', () => {
  it('só com "sim" (sem diferenciar maiúscula) a página fica indexável', () => {
    expect(indexavel('sim')).toBe(true);
    expect(indexavel(' SIM ')).toBe(true);
    expect(indexavel(undefined)).toBe(false);
    expect(indexavel('')).toBe(false);
    expect(indexavel('true')).toBe(false);
    expect(indexavel('nao')).toBe(false);
  });
});
