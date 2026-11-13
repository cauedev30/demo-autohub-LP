'use client';

import { useEffect } from 'react';

/**
 * Rola até a seção dos links âncora (#itens, #versoes, #agendar) sem trocar o hash da URL.
 * Sem JavaScript, o link nativo continua funcionando (com a rolagem suave do CSS). Não renderiza nada.
 * Com prefers-reduced-motion a rolagem é imediata; o foco vai para a seção, para o teclado seguir dali.
 */
export function RolagemSuave() {
  useEffect(() => {
    const aoClicar = (evento: MouseEvent) => {
      if (evento.defaultPrevented || evento.button !== 0) return;
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      const alvoDoClique = evento.target instanceof Element ? evento.target : null;
      const link = alvoDoClique?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      if (!link || !id) return;
      const secao = document.getElementById(id);
      if (!secao) return;

      evento.preventDefault();
      const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      secao.scrollIntoView({ behavior: calmo ? 'instant' : 'smooth', block: 'start' });
      if (!secao.hasAttribute('tabindex')) secao.setAttribute('tabindex', '-1');
      secao.focus({ preventScroll: true });
    };
    document.addEventListener('click', aoClicar);
    return () => document.removeEventListener('click', aoClicar);
  }, []);

  return null;
}
