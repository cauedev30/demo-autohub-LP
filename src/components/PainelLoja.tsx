import type { CSSProperties } from 'react';
import { site } from '@/content/site';
import type { TomIdade } from '@/content/tipos';
import { rotuloGraficoIdade, rotuloPainel } from '@/lib/rotulos';
import styles from './PainelLoja.module.css';

const classeDoTom: Record<TomIdade, string> = {
  novo: styles.novo,
  medio: styles.medio,
  velho: styles.velho,
  parado: styles.parado,
};

/** Painel "Loja agora": três métricas, a barra de idade do estoque e a legenda. Tudo vem de `site.painel`. */
export function PainelLoja() {
  const { painel, acessibilidade } = site;
  return (
    <div
      className={`${styles.painel} entra`}
      style={{ '--i': 4 } as CSSProperties}
      role="group"
      aria-label={rotuloPainel(painel, acessibilidade)}
    >
      <div className={styles.cab}>
        <strong>{painel.titulo}</strong>
        <span>{painel.nota}</span>
      </div>

      <dl className={styles.metricas}>
        {painel.metricas.map((metrica) => (
          <div key={metrica.rotulo}>
            <dt>{metrica.rotulo}</dt>
            <dd>{metrica.valor}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.idade} role="img" aria-label={rotuloGraficoIdade(painel)}>
        {painel.idade.map((faixa) => (
          <span
            key={faixa.rotulo}
            className={`${styles.faixa} ${classeDoTom[faixa.tom]}`}
            data-tom={faixa.tom}
            style={{ '--n': faixa.n } as CSSProperties}
          />
        ))}
      </div>

      <ul className={styles.legenda}>
        {painel.idade.map((faixa) => (
          <li key={faixa.rotulo}>
            <span className={`${styles.marca} ${classeDoTom[faixa.tom]}`} data-tom={faixa.tom} />
            {faixa.rotulo}
          </li>
        ))}
      </ul>
    </div>
  );
}
