import { site } from '@/content/site';
import { linkWhatsapp } from '@/lib/whatsapp';
import { Botao } from './Botao';
import secao from './Secao.module.css';
import styles from './Fundadoras.module.css';

/** Oferta das lojas fundadoras: um painel com borda e o mesmo botão do fechamento, para se destacar das seções lisas. */
export function Fundadoras() {
  return (
    <section className={secao.secao} id="fundadoras">
      <div className="wrap">
        <div className={styles.painel}>
          <div>
            <h2 className={`${secao.titulo} ${styles.titulo}`}>{site.fundadoras.titulo}</h2>
            <p className={styles.texto}>{site.fundadoras.texto}</p>
          </div>
          <Botao variante="cheio" tamanho="grande" href={linkWhatsapp(site.acoes.agendar.mensagem)}>
            {site.acoes.agendar.rotulo}
          </Botao>
        </div>
      </div>
    </section>
  );
}
