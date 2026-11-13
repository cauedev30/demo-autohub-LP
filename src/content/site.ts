import type { Site } from './tipos';

/**
 * Todo o texto, os números e os preços da landing. Nenhum componente escreve texto próprio:
 * o nome do produto muda aqui, em um só lugar.
 */
export const site: Site = {
  nome: 'AutoHub',
  tagline: 'Sistema de gestão para revendas de seminovos',
  apoio:
    'Estoque, clientes, agenda, vendas e metas num só sistema, com o site da sua loja. O dono vê quanto o pátio vale e quanto vai lucrar.',

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
    emBreve: 'Em breve',
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
        'Quanto você investiu, quanto o pátio vale na venda, o lucro esperado e há quantos dias cada carro está parado.',
    },
    {
      titulo: 'Desconto com limite',
      texto: 'Você define a margem de cada carro. O vendedor só dá desconto até o mínimo à vista que você liberou.',
    },
    {
      titulo: 'Funil de clientes',
      texto:
        'Cada cliente num quadro, de lead novo a negociando. Arrastou para "Vendeu", a venda fica com o valor e a forma de pagamento.',
    },
    {
      titulo: 'Nenhum retorno esquecido',
      texto: 'A agenda junta as visitas e os retornos do dia e mostra quem ficou atrasado.',
    },
    {
      titulo: 'A meta do mês, em ritmo',
      texto:
        'Faturamento, lucro, margem e ticket médio do mês. A meta mostra quantas vendas faltam e o ritmo para chegar lá.',
    },
    {
      titulo: 'Site com a cara da sua loja',
      texto: 'O seu estoque na vitrine, com fotos e ficha de cada carro, e o WhatsApp dos vendedores em cada anúncio.',
    },
  ],

  emBreve: [
    {
      titulo: 'Comissão por vendedor',
      texto: 'Cada venda guarda quem vendeu, e a comissão sai calculada no fim do mês.',
    },
    {
      titulo: 'Custo só para o dono',
      texto: 'O vendedor vê o preço e o desconto liberado. Custo e lucro ficam com você.',
    },
    {
      titulo: 'Cliente do site direto no funil',
      texto: 'Quem chama pelo site entra na hora na lista, e o vendedor recebe o aviso no celular.',
    },
    {
      titulo: 'Qual portal traz venda',
      texto: 'A origem de cada cliente ligada à venda e o custo por venda de cada portal.',
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
      { rotulo: 'Estoque com fotos e margem por carro', loja: true, lojaPlus: true },
      { rotulo: 'Clientes, funil e agenda', loja: true, lojaPlus: true },
      { rotulo: 'Vendas, relatórios e meta do mês', loja: true, lojaPlus: true },
      { rotulo: 'Painel do dono', loja: true, lojaPlus: true },
      { rotulo: 'Equipe com dono, gerente e vendedor', loja: true, lojaPlus: true },
      { rotulo: 'Comissão por vendedor', loja: 'Em breve', lojaPlus: 'Em breve' },
      { rotulo: 'Origem de cada cliente', loja: false, lojaPlus: 'Em breve' },
      { rotulo: 'Custo por venda de cada portal', loja: false, lojaPlus: 'Em breve' },
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
    { titulo: 'Os dados são seus', texto: 'Se um dia sair, você leva tudo em planilha.' },
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
      'Estoque, clientes, agenda, vendas e metas num só sistema, com o site da sua loja. O dono vê quanto o pátio vale e quanto vai lucrar.',
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
