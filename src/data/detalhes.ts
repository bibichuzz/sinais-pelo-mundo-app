// Dados de exemplo da tela de detalhes (iguais aos do HTML).
// Quando houver backend, a tela usa o parâmetro "id" para buscar o pacote certo.
export const detalhesExemplo = {
  titulo: 'Paris, França',
  descricao: 'Pacote completo com hotel, passagem aérea e intérprete durante toda a viagem.',
  urlImagem: undefined as string | undefined,
  hotel: { nome: 'Ritz Paris', endereco: '15 Place Vendôme, 75001 Paris, França' },
  passagem: {
    rota: 'São Paulo (GRU) ➔ Paris (CDG)',
    ida: '12/09/2027',
    volta: '18/09/2027',
    classe: 'Classe Econômica',
  },
  interprete: { nome: 'Joaquim Muniz', telefone: '+55 (11) 98765-4321' },
  preco: 'R$ 7.500,00',
  inclusos: [
    'Hotel',
    'Passagem aérea ida e volta',
    'Intérprete durante todo o período',
    'Suporte 24h',
    'Seguro viagem',
  ],
};

export type DetalhesPacote = typeof detalhesExemplo;
