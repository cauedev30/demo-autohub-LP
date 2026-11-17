import type { CSSProperties } from 'react';
import { site } from '@/content/site';
import { linkWhatsapp } from '@/lib/whatsapp';
import { Botao } from './Botao';
import { CelularLoja } from './CelularLoja';
import { PainelLoja } from './PainelLoja';
import styles from './Hero.module.css';

/** Posição na entrada escalonada (ver .entra em globals.css): 90ms de atraso por posição. */
const posicao = (i: number) => ({ '--i': i }) as CSSProperties;

/** Abertura: texto à esquerda, painel e celular à direita (uma coluna abaixo de 860px). */
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.spot} aria-hidden="true" />
      <div className={styles.dentro}>
        <div className={styles.texto}>
          <p className={`${styles.tagline} entra`} style={posicao(0)}>
            {site.tagline}
          </p>
          <h1 className={`${styles.titulo} entra`} style={posicao(1)}>
            {site.titulo}
          </h1>
          <p className={`${styles.apoio} entra`} style={posicao(2)}>
            {site.apoio}
          </p>
          <div className={`${styles.acoes} entra`} style={posicao(3)}>
            <Botao variante="cheio" tamanho="grande" href={linkWhatsapp(site.acoes.agendar.mensagem)}>
              {site.acoes.agendar.rotulo}
            </Botao>
          </div>
        </div>

        <div className={styles.palco}>
          <div className={styles.cena}>
            <PainelLoja />
            <CelularLoja />
          </div>
        </div>
      </div>
      <div className={styles.freio} aria-hidden="true" />
    </section>
  );
}
