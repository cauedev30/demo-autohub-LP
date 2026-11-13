// Confere o modo indexável: faz o build com NEXT_PUBLIC_INDEXAR=sim, roda tests/e2e/seo.spec.ts contra ele
// e, no fim (mesmo com falha), refaz o build padrão (noindex) para out/ não ficar no modo indexável.
// Uso: npm run verificar:indexar
import { spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const executa = (comando, args, env = {}) =>
  spawnSync(comando, args, { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, ...env } }).status === 0;

// Sem a variável de indexação (e com a mesma URL do build que o chamador usa, se houver).
const padrao = { ...process.env };
delete padrao.NEXT_PUBLIC_INDEXAR;

const modoSim = { NEXT_PUBLIC_INDEXAR: 'sim', NEXT_PUBLIC_SITE_URL: 'https://autohub-teste.exemplo.invalid' };

let ok = false;
try {
  console.log('\n== Build indexável (NEXT_PUBLIC_INDEXAR=sim) ==');
  ok = executa(npm, ['run', 'build'], modoSim) && executa(npx, ['playwright', 'test', 'tests/e2e/seo.spec.ts'], modoSim);
} finally {
  console.log('\n== Refazendo o build padrão (noindex) ==');
  const refez = spawnSync(npm, ['run', 'build'], { stdio: 'inherit', shell: process.platform === 'win32', env: padrao }).status === 0;
  ok = ok && refez;
}
console.log(ok ? '\nModo indexável verificado; build padrão refeito.' : '\nFALHOU: veja a saída acima.');
process.exit(ok ? 0 : 1);
