import { site } from '@/content/site';
import { linkWhatsapp } from '@/lib/whatsapp';
import { Botao } from './Botao';
import { VideoDemo } from './VideoDemo';
import secao from './Secao.module.css';
import styles from './PorQue.module.css';

/** "Por que o AutoHub": o vídeo do pátio entre os números e os itens de série, com o botão de agendar embaixo. */
export function PorQue() {
  return (
    <section className={secao.secao} aria-labelledby="por-que-titulo">
      <div className="wrap">
        <p className={styles.rotulo}>{site.secoes.porQue}</p>
        <h2 className={`${secao.titulo} ${styles.titulo}`} id="por-que-titulo">
          {site.porQue.titulo}
        </h2>
        <VideoDemo comSom={site.porQue.comSom} legenda={site.porQue.legenda} descricao="por-que-nota">
          <p className={styles.nota} id="por-que-nota">
            {site.porQue.nota}
          </p>
          <Botao variante="cheio" tamanho="grande" href={linkWhatsapp(site.acoes.agendar.mensagem)}>
            {site.acoes.agendar.rotulo}
          </Botao>
        </VideoDemo>
      </div>
    </section>
  );
}
