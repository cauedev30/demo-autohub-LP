import type { Metadata, Viewport } from 'next';
import { site } from '@/content/site';
import { indexavel, urlSite } from '@/lib/ambiente';
import './globals.css';

const { seo } = site;
const imagem = { url: '/og.png', width: 1200, height: 630, alt: seo.imagemAlt };

export const metadata: Metadata = {
  metadataBase: new URL(urlSite()),
  title: seo.titulo,
  description: seo.descricao,
  alternates: { canonical: '/' },
  // Preços e textos ainda são provisórios: fica fora da busca até o build ter NEXT_PUBLIC_INDEXAR=sim.
  robots: indexavel() ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: seo.nomeSite,
    url: '/',
    title: seo.titulo,
    description: seo.descricao,
    images: [imagem],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.titulo,
    description: seo.descricao,
    images: [{ url: imagem.url, alt: imagem.alt }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0C0E',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="pular" href="#conteudo">
          {site.acessibilidade.pularConteudo}
        </a>
        {children}
      </body>
    </html>
  );
}
