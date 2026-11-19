'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import botao from './Botao.module.css';
import styles from './PorQue.module.css';

type Props = {
  comSom: string;
  pausar: string;
  continuar: string;
  legenda: string;
  /** `id` do texto que descreve o vídeo (a nota embaixo dele). */
  descricao: string;
  /** O que fica embaixo do vídeo, depois dos botões dele (a nota e o botão de agendar). */
  children: ReactNode;
};

/**
 * O vídeo do pátio: toca mudo, em loop, enquanto metade dele está na tela, e nada baixa antes disso (preload="none").
 * "Assistir com som" (embaixo, para não cobrir os números do filme) recomeça do início com som e controles;
 * (tocar no vídeo faz o mesmo); "Pausar" para o loop mudo. Com movimento reduzido, só toca pelo botão.
 */
export function VideoDemo({ comSom, pausar, continuar, legenda, descricao, children }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  // o visitante ligou o som ou pausou: a rolagem não toca nem pausa mais o vídeo por ele
  const doVisitante = useRef(false);
  const [comAudio, setComAudio] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // o atributo muted do HTML nem sempre vira propriedade na hidratação, e o navegador só toca sozinho o vídeo mudo
    video.muted = true;
    const observador = new IntersectionObserver(
      ([visto]) => {
        if (doVisitante.current) return;
        if (visto.isIntersecting) video.play().catch(() => {}); // autoplay recusado: ficam a capa e o botão
        else video.pause();
      },
      { threshold: 0.5 },
    );
    observador.observe(video);
    return () => observador.disconnect();
  }, []);

  const ouvir = () => {
    const video = ref.current;
    if (!video) return;
    doVisitante.current = true;
    video.muted = false;
    video.loop = false;
    video.currentTime = 0;
    video.controls = true;
    video.play().catch(() => {});
    video.focus(); // o botão some: o foco segue para os controles que acabaram de aparecer
    setComAudio(true);
  };

  const alternar = () => {
    const video = ref.current;
    if (!video) return;
    doVisitante.current = tocando;
    setPausado(tocando);
    if (tocando) video.pause();
    else video.play().catch(() => {});
  };

  return (
    <>
      <div className={styles.quadro}>
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          poster="/video/autohub-demo.jpg"
          aria-describedby={descricao}
          onPlay={() => setTocando(true)}
          onPause={() => setTocando(false)}
          // no celular a pessoa toca no vídeo esperando o som; depois dele, os controles nativos cuidam do toque
          onClick={comAudio ? undefined : ouvir}
        >
          {/* tela de toque leva o de 720p mesmo larga (tablet deitado): no 4G fraco o de 1080p trava */}
          <source src="/video/autohub-demo-720.mp4" type="video/mp4" media="(max-width: 860px), (pointer: coarse)" />
          <source src="/video/autohub-demo-1080.mp4" type="video/mp4" />
          <track kind="captions" src="/video/autohub-demo.vtt" srcLang="pt-BR" label={legenda} />
        </video>
      </div>
      <div className={styles.pe}>
        {!comAudio && (
          <div className={styles.controles}>
            <button type="button" className={`${botao.botao} ${botao.contorno} ${botao.grande} ${styles.som}`} onClick={ouvir}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
                <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {comSom}
            </button>
            {(tocando || pausado) && (
              <button type="button" className={`${botao.botao} ${botao.contorno} ${botao.grande}`} onClick={alternar}>
                {tocando ? pausar : continuar}
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </>
  );
}
