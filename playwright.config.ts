import { defineConfig } from '@playwright/test';

const PORTA = Number(process.env.PORTA_E2E ?? 4173);

// Usa o Chrome já instalado na máquina (channel 'chrome'); nenhum navegador é baixado.
// O servidor estático sobe a pasta out/ (rode "npm run build" antes).
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    channel: 'chrome',
  },
  webServer: {
    command: `node scripts/servir-out.mjs out ${PORTA}`,
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
