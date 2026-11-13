import styles from './IconeCarro.module.css';

/** Contorno de um carro em SVG (o mesmo desenho do <symbol id="carro"> da Noite). Ilustração: fica oculto do leitor de tela. */
export function IconeCarro({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `${styles.carro} ${className}` : styles.carro}
      viewBox="0 0 120 44"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 33v-5q0-4 5-5l17-3 11-10q2-2 5-2h30q4 0 6 2l13 10 14 3q5 1 5 5v5h-19M78 33H42M26 33H7" />
      <path d="M36 20l8-9h16v9zM65 20v-9h11q2 0 3 1l7 8z" />
      <circle cx="34" cy="33" r="8" />
      <circle cx="86" cy="33" r="8" />
      <circle cx="34" cy="33" r="2.5" />
      <circle cx="86" cy="33" r="2.5" />
    </svg>
  );
}
