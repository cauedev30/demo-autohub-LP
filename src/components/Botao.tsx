import type { ReactNode } from 'react';
import { site } from '@/content/site';
import styles from './Botao.module.css';

type Props = {
  variante: 'cheio' | 'contorno';
  tamanho?: 'normal' | 'grande';
  href: string;
  children: ReactNode;
};

/**
 * Botão da landing. Link externo (http...) abre em nova aba; âncora (#...) é um link comum.
 * Quem chama passa o texto (vem de `site.ts`).
 */
export function Botao({ variante, tamanho = 'normal', href, children }: Props) {
  const classe = [
    styles.botao,
    variante === 'contorno' ? styles.contorno : '',
    tamanho === 'grande' ? styles.grande : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (href.startsWith('http')) {
    return (
      <a className={classe} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr"> ({site.acessibilidade.novaAba})</span>
      </a>
    );
  }
  return (
    <a className={classe} href={href}>
      {children}
    </a>
  );
}
