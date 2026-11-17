import type { Site } from './tipos';

/**
 * Todo o texto, os números e os preços da landing. Nenhum componente escreve texto próprio:
 * o nome do produto muda aqui, em um só lugar.
 */
export const site: Site = {
  nome: 'AutoHub',
  tagline: 'Sistema de gestão para revendas de seminovos',
  titulo: 'Veja quanto o seu pátio vale e quanto vai sobrar de lucro.',
  apoio:
    'Estoque, clientes, agenda, vendas e metas ficam no mesmo sistema, e o site da sua loja vem junto.',

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
    perguntas: 'Perguntas frequentes',
  },

  numeros: [
    { valor: '1 dia', rotulo: 'de implantação, feita na sua loja' },
    { valor: 'R$ 0', rotulo: 'de adesão, e sem fidelidade' },
    { valor: 'Ilimitados', rotulo: 'usuários: a equipe toda entra, sem custo a mais' },
    { valor: 'R$ 299', rotulo: 'por mês, até 30 carros' },
  ],

  itens: [
    {
      titulo: 'Dinheiro no pátio',
      texto:
        'Você vê quanto investiu, quanto o pátio vale na venda e quanto deve sobrar de lucro. Cada carro mostra há quantos dias está parado.',
    },
    {
      titulo: 'Desconto com limite',
      texto: 'Você define a margem de cada carro, e o vendedor só dá desconto até o mínimo à vista que você liberou.',
    },
    {
      titulo: 'Custo só para o dono',
      texto:
        'O vendedor vê o preço e o desconto liberado. Custo, margem e lucro só aparecem para você e para o gerente.',
    },
    {
      titulo: 'Funil de clientes',
      texto:
        'Cada cliente vira um cartão no quadro, do primeiro contato até a negociação. Arrastou para "Vendeu", a venda fica registrada com o valor e a forma de pagamento.',
    },
    {
      titulo: 'Nenhum retorno esquecido',
      texto: 'A agenda reúne as visitas e os retornos do dia e destaca os retornos atrasados.',
    },
    {
      titulo: 'Meta do mês',
      texto:
        'Faturamento, lucro, margem e ticket médio do mês num lugar só. A meta diz quantas vendas faltam e em que ritmo, por exemplo uma venda a cada 3 dias.',
    },
    {
      titulo: 'Comissão por vendedor',
      texto:
        'Você escolhe a regra: valor fixo por carro, % da venda ou % do lucro. A comissão de cada venda sai calculada na hora, e o vendedor vê só as dele.',
    },
    {
      titulo: 'Site com a cara da sua loja',
      texto: 'O site mostra o seu estoque com fotos e a ficha de cada carro, e cada anúncio leva o WhatsApp dos vendedores.',
    },
  ],

  emBreve: [
    {
      titulo: 'Cliente do site direto no funil',
      texto: 'Quem chama pelo site entra no funil na hora, e o vendedor recebe o aviso no celular.',
    },
    {
      titulo: 'Qual portal traz venda',
      texto: 'Cada cliente fica marcado com o portal de onde veio, e você vê quanto cada portal custou por carro vendido.',
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
      { rotulo: 'Comissão por vendedor', loja: true, lojaPlus: true },
      { rotulo: 'Origem de cada cliente', loja: false, lojaPlus: 'Em breve' },
      { rotulo: 'Custo por venda de cada portal', loja: false, lojaPlus: 'Em breve' },
      { rotulo: 'Relatório mensal para o dono', loja: false, lojaPlus: true },
      { rotulo: 'Tamanho do pátio', loja: 'Até 30 carros', lojaPlus: 'Até 80 carros' },
    ],
    preco: {
      rotulo: 'Preço',
      loja: { valor: 'R$ 299', detalhe: 'por mês, ou R$ 249 por mês no plano anual' },
      lojaPlus: { valor: 'R$ 449', detalhe: 'por mês, ou R$ 374 por mês no plano anual' },
    },
    nota: 'As duas versões têm usuários ilimitados e implantação na sua loja. Com mais de 80 carros, fale com a gente para montar o plano.',
  },

  semLetraMiuda: [
    { titulo: 'Cancela por mensagem', texto: 'Sem adesão e sem fidelidade. Para sair, basta mandar uma mensagem.' },
    { titulo: 'Os dados são seus', texto: 'Se um dia sair, você leva tudo em planilha.' },
    {
      titulo: 'Quem atende é quem fez',
      texto: 'Os fundadores vão até a sua loja fazer a implantação e são eles que respondem o suporte no WhatsApp.',
    },
  ],

  fundadoras: {
    titulo: '10 vagas de loja fundadora',
    texto:
      'As 10 primeiras lojas pagam R$ 199 por mês, com o preço travado por 12 meses. Em troca, pedimos uma conversa a cada 15 dias, um depoimento e uma indicação.',
  },

  perguntas: [
    {
      pergunta: 'Tem fidelidade ou taxa de adesão?',
      resposta:
        'Nenhuma das duas. Para cancelar, basta mandar uma mensagem.',
    },
    {
      pergunta: 'Quanto custa?',
      resposta:
        'No Loja, são R$ 299 por mês até 30 carros (R$ 249 por mês no plano anual), e no Loja+, R$ 449 por mês até 80 carros (R$ 374 por mês no plano anual), com usuários ilimitados nos dois. Acima de 80 carros, a gente conversa. As 10 primeiras lojas pagam R$ 199 por mês, travado por 12 meses, em troca de uma conversa a cada 15 dias, um depoimento e uma indicação.',
    },
    {
      pergunta: 'Ele publica meus carros na OLX, na Webmotors ou na Mobiauto?',
      resposta:
        'Hoje não. O AutoHub não publica anúncio em portal, então você continua anunciando como já faz. Em breve, no Loja+, ele vai mostrar de qual portal veio cada cliente e quanto custou cada venda.',
    },
    {
      pergunta: 'Depois que eu assinar, quem me atende?',
      resposta:
        'Os próprios fundadores, pelo WhatsApp. São as mesmas pessoas que fazem a implantação dentro da sua loja.',
    },
    {
      pergunta: 'Hoje eu controlo tudo no caderno, na planilha ou em outro sistema. Como faço para começar?',
      resposta:
        'A gente vai até a sua loja e, em um dia, deixa o sistema rodando com você e a sua equipe. Se você usa outro sistema, só cancele o antigo depois que o AutoHub estiver rodando.',
    },
    {
      pergunta: 'Funciona no celular? Preciso instalar alguma coisa?',
      resposta:
        'Funciona no navegador do computador e do celular, sem instalar nada. Basta ter internet, do wi-fi da loja ou do 4G do celular.',
    },
    {
      pergunta: 'Os dados da minha loja ficam seguros? E se eu quiser sair?',
      resposta:
        'Os dados são seus. Cada pessoa da equipe entra com o próprio acesso, e uma loja não vê os dados de outra. Se um dia sair, a gente entrega os seus dados para você.',
    },
    {
      pergunta: 'Ele emite nota fiscal e faz o RENAVE?',
      resposta:
        'Não. Nota fiscal e RENAVE continuam com o despachante ou a integradora que você já usa, e o AutoHub cuida do estoque, dos clientes, das vendas e da meta do mês.',
    },
  ],

  fechamento: {
    titulo: 'Agende o seu test-drive.',
    texto: 'São 15 minutos. Vamos até a sua loja em João Pessoa, Cabedelo ou Campina Grande, ou mostramos por vídeo.',
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
