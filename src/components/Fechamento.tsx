import { site } from '@/content/site';
import { linkWhatsapp } from '@/lib/whatsapp';
import { Botao } from './Botao';
import secao from './Secao.module.css';
import styles from './Fechamento.module.css';

/** Fechamento (`#agendar`): linha vermelha curta, título, texto e os dois botões, tudo centralizado. */
export function Fechamento() {
  return (
    <section className={`${secao.secao} ${styles.fechamento}`} id="agendar">
      <div className="wrap">
        <h2 className={styles.titulo}>{site.fechamento.titulo}</h2>
        <p className={styles.texto}>{site.fechamento.texto}</p>
        <div className={styles.acoes}>
          <Botao variante="cheio" tamanho="grande" href={linkWhatsapp(site.acoes.agendar.mensagem)}>
            {site.acoes.agendar.rotulo}
          </Botao>
          <Botao variante="contorno" tamanho="grande" href={linkWhatsapp(site.acoes.whatsapp.mensagem)}>
            {site.acoes.whatsapp.rotulo}
          </Botao>
        </div>
      </div>
    </section>
  );
}
