import { site } from '@/content/site';
import styles from './Numeros.module.css';

/** Faixa de números logo abaixo do hero: "1 dia", "Zero", "Ilimitados", "R$ 299". Sem título visível. */
export function Numeros() {
  return (
    <section className={`${styles.numeros} wrap`} aria-label={site.secoes.numeros}>
      <ul className={styles.grade}>
        {site.numeros.map((numero) => (
          <li key={numero.valor}>
            <p className={styles.valor}>{numero.valor}</p>
            <p className={styles.rotulo}>{numero.rotulo}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
