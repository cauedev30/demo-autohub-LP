import { site } from '@/content/site';
import styles from './Rodape.module.css';

/** Rodapé: uma linha, "AutoHub. Feito em João Pessoa, Paraíba." */
export function Rodape() {
  return <footer className={`${styles.rodape} wrap`}>{site.rodape}</footer>;
}
