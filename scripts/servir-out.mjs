// Servidor estático mínimo para a pasta out/ (usado por "npm run preview" e pelo Playwright).
// Imita o que o Cloudflare faz: /rota/ -> out/rota/index.html; 404 usa out/404.html.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const raiz = resolve(process.argv[2] ?? 'out');
const porta = Number(process.argv[3] ?? process.env.PORT ?? 3000);

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

async function existe(caminho) {
  try {
    return (await stat(caminho)).isFile();
  } catch {
    return false;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pedido;
  try {
    pedido = normalize(decodeURIComponent(url.pathname));
  } catch {
    // endereço com "%" malformado: sem isso o erro derrubaria o servidor
    res.writeHead(400).end('Endereço inválido');
    return;
  }
  let arquivo = join(raiz, pedido);
  if (arquivo !== raiz && !arquivo.startsWith(raiz + sep)) {
    res.writeHead(403).end('Proibido');
    return;
  }
  if (!(await existe(arquivo))) arquivo = join(arquivo, 'index.html');
  let status = 200;
  if (!(await existe(arquivo))) {
    arquivo = join(raiz, '404.html');
    status = 404;
  }
  try {
    const corpo = await readFile(arquivo);
    res.writeHead(status, { 'Content-Type': tipos[extname(arquivo)] ?? 'application/octet-stream' });
    res.end(corpo);
  } catch {
    res.writeHead(404).end('Não encontrado');
  }
}).listen(porta, () => console.log(`Servindo ${raiz} em http://localhost:${porta}`));
