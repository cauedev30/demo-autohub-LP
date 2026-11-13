import type { CSSProperties } from 'react';
import { site } from '@/content/site';
import { IconeCarro } from './IconeCarro';
import styles from './CelularLoja.module.css';

/** Celular da loja fictícia (ilustração). Lê `site.celular`; fica oculto do leitor de tela e some abaixo de 860px. */
export function CelularLoja() {
  const { celular } = site;
  return (
    <div className={`${styles.celular} entra`} style={{ '--i': 5 } as CSSProperties} aria-hidden="true">
      <div className={styles.tela}>
        <div className={styles.topo}>
          <b>{celular.marca}</b> {celular.sufixo}
        </div>
        <p className={styles.titulo}>{celular.titulo}</p>
        <p className={styles.apoio}>{celular.apoio}</p>
        <div className={styles.chips}>
          {celular.filtros.map((filtro, i) => (
            <span key={filtro} className={i === 0 ? styles.ligado : undefined}>
              {filtro}
            </span>
          ))}
        </div>
        {celular.carros.map((carro) => (
          <div key={carro.nome} className={styles.carro}>
            <div className={styles.foto}>
              <IconeCarro className={styles.icone} />
            </div>
            <div className={styles.linha}>
              <b>{carro.nome}</b>
              <em>{carro.preco}</em>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
