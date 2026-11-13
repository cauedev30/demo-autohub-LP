import { site } from '@/content/site';
import type { CelulaVersao } from '@/content/tipos';
import secao from './Secao.module.css';
import styles from './Versoes.module.css';

const { versoes } = site;

/** Célula de recurso: ✓ ou – (caractere, com o texto para leitor de tela) ou o valor próprio da versão. */
function Celula({ valor }: { valor: CelulaVersao }) {
  if (valor === true) {
    return (
      <td className={styles.sim}>
        <span aria-hidden="true">✓</span>
        <span className="sr">{versoes.incluido}</span>
      </td>
    );
  }
  if (valor === false) {
    return (
      <td className={styles.nao}>
        <span aria-hidden="true">–</span>
        <span className="sr">{versoes.naoIncluido}</span>
      </td>
    );
  }
  return <td>{valor}</td>;
}

/** "Versões": tabela Loja x Loja+ (rola dentro do contêiner em tela estreita), linha de preço e nota das lojas fundadoras. */
export function Versoes() {
  return (
    <section className={secao.secao} id="versoes">
      <div className="wrap">
        <h2 className={secao.titulo}>{site.secoes.versoes}</h2>
        <div className={styles.rolagem} tabIndex={0} role="region" aria-label={versoes.descricao}>
          <table className={styles.tabela}>
            <caption className="sr">{versoes.descricao}</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr">{versoes.colunaRecurso}</span>
                </th>
                {versoes.colunas.map((coluna) => (
                  <th key={coluna} scope="col">
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {versoes.linhas.map((linha) => (
                <tr key={linha.rotulo}>
                  <th scope="row">{linha.rotulo}</th>
                  <Celula valor={linha.loja} />
                  <Celula valor={linha.lojaPlus} />
                </tr>
              ))}
              <tr className={styles.preco}>
                <th scope="row">{versoes.preco.rotulo}</th>
                {[versoes.preco.loja, versoes.preco.lojaPlus].map((preco, i) => (
                  // chave pela coluna, não pelo valor: os preços são provisórios e podem ficar iguais
                  <td key={versoes.colunas[i]}>
                    {preco.valor}
                    <small>{preco.detalhe}</small>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.nota}>{versoes.nota}</p>
      </div>
    </section>
  );
}
