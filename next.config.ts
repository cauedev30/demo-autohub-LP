import type { NextConfig } from 'next';

// Exportação estática: gera a pasta out/, servida pelo Cloudflare Workers Static Assets
// (e, depois, por qualquer servidor de arquivos). Nada aqui pode exigir servidor Node.
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
