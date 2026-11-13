import { afterEach, describe, expect, it, vi } from 'vitest';
import { linkWhatsapp } from '@/lib/whatsapp';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('linkWhatsapp', () => {
  it('deixa só os dígitos do número', () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '+55 (83) 99999-0000');
    expect(linkWhatsapp('Oi')).toBe('https://wa.me/5583999990000?text=Oi');
  });

  it('codifica mensagem com acento, espaço e pontuação', () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '5500000000000');
    const link = linkWhatsapp('Oi! Quero conhecer o AutoHub, é rápido?');
    expect(link).toBe(
      'https://wa.me/5500000000000?text=Oi!%20Quero%20conhecer%20o%20AutoHub%2C%20%C3%A9%20r%C3%A1pido%3F',
    );
    expect(link).not.toContain(' ');
  });

  it('devolve #agendar quando o número está ausente', () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '');
    expect(linkWhatsapp('Oi')).toBe('#agendar');
  });

  it('devolve #agendar quando a variável nem existe', () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', undefined);
    expect(linkWhatsapp('Oi')).toBe('#agendar');
  });

  it('devolve #agendar quando o número não tem dígitos suficientes', () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', 'abc-123');
    expect(linkWhatsapp('Oi')).toBe('#agendar');
  });

  it('devolve #agendar quando o número passa de 15 dígitos', () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '1234567890123456');
    expect(linkWhatsapp('Oi')).toBe('#agendar');
  });
});
