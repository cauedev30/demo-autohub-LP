import Link from 'next/link';
import { site } from '@/content/site';

// Vira out/404.html no export; o Cloudflare serve este arquivo nas rotas que não existem.
export default function NotFound() {
  const { titulo, texto, voltar } = site.naoEncontrada;
  return (
    <main id="conteudo" className="wrap" style={{ paddingBlock: '16vh' }}>
      <h1 style={{ fontStretch: '125%', fontWeight: 800, fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1.05 }}>
        {titulo}
      </h1>
      <p style={{ color: 'var(--mudo)', margin: '16px 0 28px' }}>{texto}</p>
      <Link href="/">{voltar}</Link>
    </main>
  );
}
