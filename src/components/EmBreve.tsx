import { site } from '@/content/site';
import secao from './Secao.module.css';
import styles from './SemLetraMiuda.module.css';

/**
 * "Em breve": o que ainda está sendo construído no painel, em blocos curtos lado a lado.
 * Usa o mesmo desenho do "Sem letra miúda" (`.tres`), para a página não ganhar um estilo novo.
 */
export function EmBreve() {
  return (
    <section className={secao.secao} id="em-breve">
      <div className="wrap">
        <h2 className={secao.titulo}>{site.secoes.emBreve}</h2>
        <ul className={styles.tres}>
          {site.emBreve.map((item) => (
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
