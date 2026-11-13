import { site } from '@/content/site';
import secao from './Secao.module.css';
import styles from './SemLetraMiuda.module.css';

/** "Sem letra miúda": três promessas curtas, lado a lado (empilham em tela estreita). */
export function SemLetraMiuda() {
  return (
    <section className={secao.secao}>
      <div className="wrap">
        <h2 className={secao.titulo}>{site.secoes.semLetraMiuda}</h2>
        <ul className={styles.tres}>
          {site.semLetraMiuda.map((item) => (
            <li key={item.titulo}>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
