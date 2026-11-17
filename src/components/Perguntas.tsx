import { site } from '@/content/site';
import secao from './Secao.module.css';
import styles from './Perguntas.module.css';

/** Perguntas frequentes: cada uma é um <details> nativo (abre com clique, Enter ou espaço, sem JavaScript). */
export function Perguntas() {
  return (
    <section className={secao.secao} id="perguntas">
      <div className="wrap">
        <h2 className={secao.titulo}>{site.secoes.perguntas}</h2>
        <div className={styles.lista}>
          {site.perguntas.map((item) => (
            <details key={item.pergunta} className={styles.item}>
              <summary className={styles.pergunta}>{item.pergunta}</summary>
              <p className={styles.resposta}>{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
