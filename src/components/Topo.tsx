import Link from 'next/link';
import { site } from '@/content/site';
import { linkWhatsapp } from '@/lib/whatsapp';
import { Botao } from './Botao';
import { Logo } from './Logo';
import styles from './Topo.module.css';

/** Barra do topo: marca, links de seção e o botão de agendar (abaixo de 560px, só a marca e o botão). */
export function Topo() {
  return (
    <header className={`${styles.topo} wrap`}>
      <Link className={styles.marca} href="/">
        <span className="sr">{site.nome}</span>
        <Logo className={styles.marcaSvg} />
      </Link>
      <nav className={styles.nav} aria-label={site.acessibilidade.navPrincipal}>
        {site.nav.map((link) => (
          <a key={link.href} className={styles.link} href={link.href}>
            {link.rotulo}
          </a>
        ))}
        <Botao variante="cheio" href={linkWhatsapp(site.acoes.agendar.mensagem)}>
          {site.acoes.agendar.rotulo}
        </Botao>
      </nav>
    </header>
  );
}
