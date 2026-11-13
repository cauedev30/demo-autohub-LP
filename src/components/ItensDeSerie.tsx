import { site } from '@/content/site';
import secao from './Secao.module.css';
import styles from './ItensDeSerie.module.css';

/** "Itens de série": os quatro itens como linhas grandes com divisória (uma coluna no celular). */
export function ItensDeSerie() {
  return (
    <section className={secao.secao} id="itens">
      <div className="wrap">
        <h2 className={secao.titulo}>{site.secoes.itens}</h2>
        <ul className={styles.itens}>
          {site.itens.map((item) => (
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
