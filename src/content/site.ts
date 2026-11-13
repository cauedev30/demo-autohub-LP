import type { Site } from './tipos';

/**
 * Todo o texto, os números e os preços da landing. Nenhum componente escreve texto próprio:
 * o nome do produto muda aqui, em um só lugar.
 */
export const site: Site = {
  nome: 'AutoHub',
  tagline: 'Sistema de gestão para revendas de seminovos',
  apoio:
    'Estoque, clientes, vendas, comissão e metas num só sistema. O dono vê quanto o pátio vale e quanto vai lucrar.',

  nav: [
    { rotulo: 'Itens de série', href: '#itens' },
    { rotulo: 'Versões', href: '#versoes' },
  ],

  acoes: {
    agendar: {
      rotulo: 'Agendar test-drive',
      ancora: '#agendar',
      mensagem: 'Oi! Quero agendar um test-drive do AutoHub.',
    },
    whatsapp: {
      rotulo: 'Falar no WhatsApp',
      ancora: '#agendar',
      mensagem: 'Oi! Quero conhecer o AutoHub.',
    },
  },

  painel: {
    titulo: 'Loja agora',
    nota: 'Loja de demonstração, 30 carros',
    total: 30,
    idadeDescricao: 'carros por tempo no pátio',
    metricas: [
      { rotulo: 'Investido no pátio', valor: 'R$ 1.184.500' },
      { rotulo: 'Vale na venda', valor: 'R$ 1.372.900' },
      { rotulo: 'Lucro esperado', valor: 'R$ 188.400' },
    ],
    idade: [
      { n: 20, rotulo: '20 carros até 30 dias', tom: 'novo' },
      { n: 6, rotulo: '6 de 31 a 60', tom: 'medio' },
      { n: 3, rotulo: '3 de 61 a 90', tom: 'velho' },
      { n: 1, rotulo: '1 há mais de 90', tom: 'parado' },
    ],
  },

  celular: {
    marca: 'Brisa',
    sufixo: 'Seminovos',
    titulo: 'Seminovos em João Pessoa',
    apoio: '30 carros no pátio',
    filtros: ['Todos', 'SUV', 'Sedã'],
    carros: [
      { nome: 'Sedã 2.0', preco: 'R$ 98.900' },
      { nome: 'SUV 1.6', preco: 'R$ 119.900' },
    ],
  },

  secoes: {
    numeros: 'Em números',
    itens: 'Itens de série',
    versoes: 'Versões',
    semLetraMiuda: 'Sem letra miúda',
  },

  numeros: [
    { valor: '1 dia', rotulo: 'para implantar, dentro da sua loja' },
    { valor: 'Zero', rotulo: 'adesão e fidelidade' },
    { valor: 'Ilimitados', rotulo: 'usuários por loja' },
    { valor: 'R$ 299', rotulo: 'por mês, até 30 carros' },
  ],

  itens: [
    {
      titulo: 'Dinheiro no pátio',
      texto:
        'Valor investido, quanto o pátio vale na venda, lucro esperado e os carros parados há mais de 60 dias.',
    },
    {
      titulo: 'Nenhum cliente sem resposta',
      texto:
        'Quem chama pelo site entra na hora na lista da loja, e o vendedor certo recebe o aviso no celular.',
    },
    {
      titulo: 'Quem vendeu e quanto ganhou',
      texto:
        'Cada venda guarda o vendedor. A comissão sai calculada, e cada um acompanha a própria meta.',
    },
    {
      titulo: 'Qual portal traz venda',
      texto:
        'Na versão Loja+, todo cliente entra com a origem marcada. No fim do mês você vê o custo por venda de cada portal.',
    },
  ],

  versoes: {
    colunas: ['Loja', 'Loja+'],
    colunaRecurso: 'Recurso',
    descricao: 'Comparação entre as versões Loja e Loja+',
    incluido: 'incluído',
    naoIncluido: 'não incluído',
    linhas: [
      { rotulo: 'Site da loja', loja: true, lojaPlus: true },
      { rotulo: 'Estoque com fotos', loja: true, lojaPlus: true },
      { rotulo: 'Clientes e funil de vendas', loja: true, lojaPlus: true },
      { rotulo: 'Vendas, comissão e metas por vendedor', loja: true, lojaPlus: true },
      { rotulo: 'Painel do dono', loja: true, lojaPlus: true },
      { rotulo: 'Origem de cada cliente', loja: false, lojaPlus: true },
      { rotulo: 'Custo por venda de cada portal', loja: false, lojaPlus: true },
      { rotulo: 'Relatório mensal para o dono', loja: false, lojaPlus: true },
      { rotulo: 'Tamanho do pátio', loja: 'Até 30 carros', lojaPlus: 'Até 80 carros' },
    ],
    preco: {
      rotulo: 'Preço',
      loja: { valor: 'R$ 299', detalhe: 'por mês, ou R$ 249 no anual' },
      lojaPlus: { valor: 'R$ 449', detalhe: 'por mês, ou R$ 374 no anual' },
    },
    nota: 'Usuários ilimitados e implantação presencial nas duas versões. As 10 primeiras lojas entram como fundadoras: R$ 199 por mês, travado por 12 meses, em troca de uma conversa a cada 15 dias, um depoimento e uma indicação.',
  },

  semLetraMiuda: [
    { titulo: 'Cancela por mensagem', texto: 'Não tem adesão nem fidelidade.' },
    { titulo: 'Os dados são seus', texto: 'Você exporta tudo em planilha quando quiser.' },
    {
      titulo: 'Quem atende é quem fez',
      texto: 'Implantação na sua loja em um dia e suporte pelo WhatsApp.',
    },
  ],

  fechamento: {
    titulo: 'Agende o seu test-drive.',
    texto: 'São 15 minutos, na sua loja ou por vídeo, em João Pessoa, Cabedelo e Campina Grande.',
  },

  rodape: 'AutoHub. Feito em João Pessoa, Paraíba.',

  seo: {
    titulo: 'AutoHub: sistema de gestão para revendas de seminovos',
    descricao:
      'Estoque, clientes, vendas, comissão e metas num só sistema. O dono vê quanto o pátio vale e quanto vai lucrar.',
    nomeSite: 'AutoHub',
    imagemAlt:
      'AutoHub, sistema de gestão para revendas de seminovos, e o painel Loja agora com o dinheiro investido no pátio.',
  },

  acessibilidade: {
    navPrincipal: 'Principal',
    novaAba: 'abre em nova aba',
    painel: 'Painel',
    pularConteudo: 'Pular para o conteúdo',
  },

  naoEncontrada: {
    titulo: 'Página não encontrada',
    texto: 'O endereço que você abriu não existe aqui.',
    voltar: 'Voltar para o início',
  },
};
