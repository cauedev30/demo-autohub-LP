/** Tipos do conteúdo da landing. Todo texto do site vive em `site.ts`, tipado por aqui. */

export type TomIdade = 'novo' | 'medio' | 'velho' | 'parado';

export type LinkNav = { rotulo: string; href: string };

export type Acao = {
  rotulo: string;
  /** Âncora da seção para onde o botão rola (sem trocar o hash da URL). */
  ancora: string;
  /** Mensagem pré-preenchida quando o botão abre o WhatsApp. */
  mensagem: string;
};

export type Metrica = { rotulo: string; valor: string };

export type FaixaIdade = {
  /** Quantidade de carros na faixa; a largura da barra é proporcional a ela. */
  n: number;
  rotulo: string;
  tom: TomIdade;
};

export type Painel = {
  titulo: string;
  nota: string;
  /** Total de carros do painel; a soma de `idade[].n` tem de bater com ele. */
  total: number;
  /** Descrição do gráfico de idade para leitor de tela, depois do total: "<total> <idadeDescricao>: <faixas>". */
  idadeDescricao: string;
  metricas: Metrica[];
  idade: FaixaIdade[];
};

export type Numero = { valor: string; rotulo: string };

export type ItemDeSerie = { titulo: string; texto: string };

/** `true` = incluído, `false` = não incluído, texto = valor próprio da versão. */
export type CelulaVersao = boolean | string;

export type LinhaVersao = {
  rotulo: string;
  loja: CelulaVersao;
  lojaPlus: CelulaVersao;
};

export type PrecoVersao = { valor: string; detalhe: string };

export type Versoes = {
  /** Cabeçalhos das colunas de versão, na ordem: Loja, Loja+. */
  colunas: [string, string];
  /** Cabeçalho (só para leitor de tela) da primeira coluna. */
  colunaRecurso: string;
  /** Nome acessível do contêiner da tabela. */
  descricao: string;
  /** Texto para leitor de tela nas marcas ✓ e –. */
  incluido: string;
  naoIncluido: string;
  linhas: LinhaVersao[];
  preco: { rotulo: string; loja: PrecoVersao; lojaPlus: PrecoVersao };
  nota: string;
};

export type ItemSemLetraMiuda = { titulo: string; texto: string };

export type Fechamento = { titulo: string; texto: string };

export type Secoes = {
  numeros: string;
  itens: string;
  emBreve: string;
  versoes: string;
  semLetraMiuda: string;
};

export type Celular = {
  marca: string;
  sufixo: string;
  titulo: string;
  apoio: string;
  filtros: string[];
  carros: { nome: string; preco: string }[];
};

/** Rótulos só para leitor de tela (nada disso aparece na tela). */
export type Acessibilidade = {
  /** Nome da navegação do topo. */
  navPrincipal: string;
  /** Acrescentado ao nome dos links que abrem em nova aba. */
  novaAba: string;
  /** Prefixo do nome do painel de demonstração: "<painel> <titulo>, <nota>". */
  painel: string;
  /** Texto do link "pular para o conteúdo" (visível só no foco do teclado). */
  pularConteudo: string;
};

/** Título, descrição e nome para busca e para o link colado em redes e no WhatsApp. */
export type Seo = {
  /** Título da página (aba, busca, compartilhamento). */
  titulo: string;
  /** Uma frase, até cerca de 155 caracteres. */
  descricao: string;
  /** Nome do site no cartão de compartilhamento (`og:site_name`). */
  nomeSite: string;
  /** Texto alternativo da imagem de compartilhamento (`/og.png`). */
  imagemAlt: string;
};

export type NaoEncontrada = { titulo: string; texto: string; voltar: string };

export type Site = {
  nome: string;
  tagline: string;
  apoio: string;
  nav: LinkNav[];
  acoes: { agendar: Acao; whatsapp: Acao };
  painel: Painel;
  celular: Celular;
  secoes: Secoes;
  numeros: Numero[];
  itens: ItemDeSerie[];
  /** O que ainda está sendo construído: aparece depois dos itens de série, sem data prometida. */
  emBreve: ItemDeSerie[];
  versoes: Versoes;
  semLetraMiuda: ItemSemLetraMiuda[];
  fechamento: Fechamento;
  rodape: string;
  seo: Seo;
  acessibilidade: Acessibilidade;
  naoEncontrada: NaoEncontrada;
};
