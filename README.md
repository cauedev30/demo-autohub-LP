# AutoHub: site (landing)

Landing do AutoHub em Next 16 + React 19 + Tailwind 4, exportada como arquivos estáticos (`out/`). Publica na Vercel
(ver "Publicar na Vercel") ou no Cloudflare Workers Static Assets.

## Rodar

Requer Node 24 (`.nvmrc`) e npm.

```bash
npm install
cp .env.example .env.local   # número do WhatsApp e URL do site (o valor de exemplo é falso)
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | gera a pasta `out/` (exportação estática) |
| `npm run preview` | serve `out/` em http://localhost:3000 (`scripts/servir-out.mjs`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir arquivos |
| `npm test` | testes unitários (Vitest) |
| `npm run test:e2e` | Playwright com o Chrome instalado; rode `npm run build` antes |
| `npm run gerar-og` | gera `public/og.png` a partir do hero de `out/` (ver "Imagem de compartilhamento") |
| `npm run verificar:indexar` | builda com `NEXT_PUBLIC_INDEXAR=sim`, confere SEO/robots/sitemap e refaz o build padrão |
| `npm run deploy` | `wrangler deploy` (publica `out/`; rode `npm run build` antes) |

## Onde mora cada coisa

- Todo texto, número e preço: `src/content/site.ts` (tipos em `src/content/tipos.ts`). Nenhum componente escreve texto.
  Inclui `seo` (título, descrição, nome do site e texto da imagem de compartilhamento) e os rótulos de leitor de tela
  em `acessibilidade` (como o do link "Pular para o conteúdo").
- Componentes em `src/components/`, cada um com o seu `Componente.module.css` (CSS Modules, portado da direção Noite);
  só os tokens, o `.wrap`, o `.sr`, o `.pular` e a entrada `.entra` ficam em `globals.css`. `Secao.module.css` é a base compartilhada das seções com título;
  `RolagemSuave` (cliente, sem markup) rola até as âncoras sem trocar o hash.
- Link do WhatsApp: `src/lib/whatsapp.ts`. Sem `NEXT_PUBLIC_WHATSAPP_NUMBER` válido, o link vira `#agendar`.
- URL do site e modo de indexação: `src/lib/ambiente.ts` (usado por `layout.tsx`, `robots.ts` e `sitemap.ts`).
- Tokens da direção "Noite" e a fonte (Archivo variável com eixo de largura, do pacote
  `@fontsource-variable/archivo`, sem chamada ao Google): `src/app/globals.css`.

## Variáveis de build

Todas são `NEXT_PUBLIC_*`: lidas no build e gravadas no HTML. **Não são segredo.** Mudou uma, rode `npm run build` de novo.
O modelo está em `.env.example`.

| Variável | Para que serve | Sem ela |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | número dos botões (código do país + DDD, só dígitos) | os botões apontam para `#agendar` |
| `NEXT_PUBLIC_SITE_URL` | URL pública, sem barra no fim: canônica, `og:image`, `og:url`, sitemap | `http://localhost:3000` |
| `NEXT_PUBLIC_INDEXAR` | só o valor `sim` deixa a página indexável | a página sai com `noindex, nofollow`, `robots.txt` com `Disallow: /` e sitemap vazio |

**Indexação.** Enquanto os preços e textos forem provisórios, deixe `NEXT_PUBLIC_INDEXAR` sem valor. Para abrir a página
para a busca, faça o build com `NEXT_PUBLIC_INDEXAR=sim`: o `<meta name="robots">` vira `index, follow`, o `robots.txt`
passa a permitir e o `sitemap.xml` lista a página. `npm run verificar:indexar` confere os dois modos e deixa `out/` no
build padrão.

## SEO e imagem de compartilhamento

- `layout.tsx` monta título, descrição, `openGraph`, `twitter` (`summary_large_image`), canônica e `robots` a partir de
  `site.seo` e das variáveis acima. `app/robots.ts` e `app/sitemap.ts` são estáticos (`force-static`) e saem como
  `out/robots.txt` e `out/sitemap.xml`.
- `public/og.png` (1200x630) é uma foto do hero da própria página. Para **regenerar** (depois de mudar o hero, o texto
  ou a identidade):

  ```bash
  npm run build        # out/ com o hero novo
  npm run gerar-og     # grava public/og.png (Chrome instalado, via Playwright, channel 'chrome')
  npm run build        # copia a imagem nova para out/
  ```

  `scripts/gerar-og.mjs` sobe um servidor local de `out/` na porta 4181 (`OG_PORTA` muda), abre o hero em 1440x756 com
  movimento reduzido, mantém a barra do topo (com a marca), esconde as outras seções e reduz para 1200x630.
- Para ver como o link aparece colado: publique e use o depurador de link do próprio WhatsApp/Facebook/LinkedIn (eles
  guardam cache; se mudar a imagem depois, use o botão de "raspar de novo").

## Acessibilidade e desempenho

- `tests/e2e/a11y.spec.ts`: axe (WCAG 2.1 A/AA e boas práticas) em 390, 768 e 1440, sem violações sérias ou críticas;
  medida própria de contraste onde o axe não consegue (texto sobre o gradiente do hero); ordem dos títulos; link
  "Pular para o conteúdo"; contorno de foco em todo controle.
- `tests/e2e/colisao.spec.ts`: nenhuma linha de texto sobre outra e todo alvo de toque com 44x44px ou mais, de 320 a 1440.
- Lighthouse (móvel), contra a pasta `out/` servida localmente. Ajuste o caminho do Chrome ao seu sistema:

  ```bash
  npm run build
  node scripts/servir-out.mjs out 4180 &    # em outro terminal, se preferir
  npx lighthouse http://localhost:4180/ \
    --chrome-path="C:/Program Files/Google/Chrome/Application/chrome.exe" \
    --chrome-flags="--headless=new" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=html --output-path=./lighthouse-movel.html
  ```

  Com `noindex` (o padrão), a auditoria "is-crawlable" de SEO reprova de propósito: a nota de SEO fica em 66. Com o
  build `NEXT_PUBLIC_INDEXAR=sim` ela vai a 100. O desempenho varia entre execuções neste computador: rode algumas vezes e use a mediana.

## Publicar na Vercel

1. Em vercel.com, "Add New" > "Project", importe este repositório. A Vercel reconhece o Next sozinha (`vercel.json`
   fixa `framework: nextjs`); não mude o comando de build nem a pasta de saída.
2. Em Settings > Environment Variables, defina `NEXT_PUBLIC_SITE_URL` com a URL do projeto (por exemplo
   `https://demo-autohub-lp.vercel.app`, sem barra no fim) e, quando houver, `NEXT_PUBLIC_WHATSAPP_NUMBER`. Sem a URL,
   a canônica e o `og:image` apontam para `localhost`. Mudou uma variável: "Redeploy".
3. Cada push na `main` publica sozinho; cada branch ganha uma URL de prévia.

Os cabeçalhos de segurança na Vercel vêm do `vercel.json` (o `public/_headers` só vale no Cloudflare). O cache do
`/_next/static/*` a Vercel já faz sozinha.

## Publicar no Cloudflare

O site é um Worker só de arquivos estáticos (`wrangler.jsonc`: nome `autohub-site`, `assets.directory = ./out`,
`not_found_handling = 404-page`, que usa o `out/404.html`).

**Primeira vez:**

```bash
npx wrangler login            # abre o navegador; uma vez por computador
npx wrangler whoami           # confirma a conta
```

**Cada publicação:**

```bash
# 1. defina as variáveis de build (ver a tabela acima) e gere out/
NEXT_PUBLIC_WHATSAPP_NUMBER=55DDDNUMERO NEXT_PUBLIC_SITE_URL=https://autohub-site.SUA-CONTA.workers.dev npm run build
# 2. confira sem publicar
npx wrangler deploy --dry-run
# 3. publique
npm run deploy
```

No PowerShell, defina as variáveis antes: `$env:NEXT_PUBLIC_SITE_URL = "https://..."` e depois `npm run build`.
Para ler os valores de um arquivo, `npm run build` já lê o `.env.local` (o `.env.example` mostra os nomes).

**Como descobrir a URL `*.workers.dev`.** O `npm run deploy` imprime a URL no fim (`https://autohub-site.<subdomínio>.workers.dev`).
O `<subdomínio>` é o da conta; também aparece no painel do Cloudflare, em Workers & Pages, no Worker `autohub-site`.

**`NEXT_PUBLIC_SITE_URL` precisa ser a URL final, e isso exige dois builds.** A URL só é conhecida depois do primeiro
deploy, mas ela entra no HTML (canônica, `og:image`, sitemap). Então: (1) build e deploy com qualquer valor; (2) leia a
URL impressa; (3) `NEXT_PUBLIC_SITE_URL=<essa URL> npm run build` e `npm run deploy` de novo. Faça o mesmo sempre que o
endereço mudar (domínio próprio, VPS).

**Conferir o publicado.** `curl -I <URL>/` mostra os cabeçalhos do `public/_headers`; confira também `<URL>/robots.txt`,
`<URL>/og.png` e uma página que não existe (`<URL>/xyz/`, deve voltar 404 com a página própria).
O `public/_headers` é lido pelo `wrangler dev` e mostra "Parsed 4 valid header rules"; rodar `npx wrangler dev` e
`curl -I http://127.0.0.1:8787/` valida os cabeçalhos antes de publicar (o `--dry-run` não os valida).

**Ligar um domínio depois.** (1) Coloque o domínio no Cloudflare (DNS gerenciado por eles); (2) no painel, Workers &
Pages, `autohub-site`, Settings, Domains & Routes, "Add" e escolha "Custom domain"; ou acrescente ao `wrangler.jsonc`
`"routes": [{ "pattern": "www.exemplo.com.br", "custom_domain": true }]`; (3) faça o build com
`NEXT_PUBLIC_SITE_URL=https://www.exemplo.com.br` e publique de novo; (4) quando os preços estiverem definitivos, o build com
`NEXT_PUBLIC_INDEXAR=sim`; (5) só então pense em `includeSubDomains` no HSTS do `public/_headers` (hoje fora de propósito).

### Instalação do `workerd`

O npm 11 não roda scripts de instalação de pacotes sem aprovação. O `wrangler` traz o `workerd` (o motor do Worker, usado
no `wrangler dev`), cujo script troca um atalho em JavaScript pelo binário nativo. Ele foi aprovado com
`npm approve-scripts workerd` (fica em `allowScripts` no `package.json`); o `esbuild` foi recusado com `npm deny-scripts esbuild`
(o script dele é só uma otimização e o projeto não precisa). Depois de um `npm install` limpo, rode `npm rebuild workerd`
se o `wrangler dev` reclamar.

## Migrar para a VPS

A pasta `out/` é HTML, CSS, JS, fonte e imagens: qualquer servidor de arquivos serve. Passos:

1. **Build com a URL final:** `NEXT_PUBLIC_SITE_URL=https://www.seudominio.com.br NEXT_PUBLIC_WHATSAPP_NUMBER=... npm run build`
   (mais `NEXT_PUBLIC_INDEXAR=sim` se for para aparecer na busca).
2. **Copie `out/` para a VPS** (por exemplo, `rsync -az --delete out/ usuario@vps:/var/www/autohub/out/`).
3. **Caddy (o mais simples, faz o HTTPS sozinho):** use `deploy/Caddyfile.exemplo` (troque o domínio e a pasta), com o
   DNS do domínio já apontando para a VPS e as portas 80 e 443 abertas. Ele já traz os cabeçalhos do `_headers`, o cache
   (`/_next/static/*` com `immutable` por 1 ano, o resto sempre revalidando), compressão e a página 404.
4. **nginx (alternativa):** o equivalente, com certificado do `certbot --nginx`:

   ```nginx
   server {
     server_name www.seudominio.com.br;
     root /var/www/autohub/out;
     index index.html;
     error_page 404 /404.html;
     gzip on;
     gzip_types text/css application/javascript text/javascript image/svg+xml application/xml text/plain;

     add_header X-Content-Type-Options "nosniff" always;
     add_header X-Frame-Options "DENY" always;
     add_header Referrer-Policy "strict-origin-when-cross-origin" always;
     add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
     add_header Strict-Transport-Security "max-age=31536000" always;

     location = /_headers { return 404; }
     location /_next/static/ {
       add_header Cache-Control "public, max-age=31536000, immutable";
       # o add_header de um location apaga os do server: repita os de segurança aqui
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-Frame-Options "DENY" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;
       add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
       add_header Strict-Transport-Security "max-age=31536000" always;
     }
     location / {
       add_header Cache-Control "public, max-age=0, must-revalidate";
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-Frame-Options "DENY" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;
       add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
       add_header Strict-Transport-Security "max-age=31536000" always;
       try_files $uri $uri/index.html =404;
     }
   }
   ```

   (Este bloco do nginx é um ponto de partida e **não foi testado aqui**; o Caddyfile foi validado e testado com o Caddy 2.11.)
5. **Regra de manutenção:** o `public/_headers`, o `vercel.json` e o `deploy/Caddyfile.exemplo` precisam dizer a mesma
   coisa. Mudou um, mude os outros.
6. **Novas versões:** `npm run build` e `rsync` de novo; como os arquivos com hash mudam de nome e o HTML sempre
   revalida, não precisa limpar cache.

## Restrições do projeto

Para a migração para a VPS ser só servir a pasta `out/`, não usar nada que exija servidor Node: Route
Handler, middleware, `next/image` com otimização, ISR, `next/font/google`.
