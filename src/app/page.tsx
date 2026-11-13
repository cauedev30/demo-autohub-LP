import { EmBreve } from '@/components/EmBreve';
import { Fechamento } from '@/components/Fechamento';
import { Hero } from '@/components/Hero';
import { ItensDeSerie } from '@/components/ItensDeSerie';
import { Numeros } from '@/components/Numeros';
import { Rodape } from '@/components/Rodape';
import { RolagemSuave } from '@/components/RolagemSuave';
import { SemLetraMiuda } from '@/components/SemLetraMiuda';
import { Topo } from '@/components/Topo';
import { Versoes } from '@/components/Versoes';

export default function Home() {
  return (
    <>
      <Topo />
      <main id="conteudo">
        <Hero />
        <Numeros />
        <ItensDeSerie />
        <EmBreve />
        <Versoes />
        <SemLetraMiuda />
        <Fechamento />
      </main>
      <Rodape />
      <RolagemSuave />
    </>
  );
}
