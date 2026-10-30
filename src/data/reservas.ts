// Dados de exemplo do histórico (iguais ao HTML). Com o backend, vêm da API.
export type Reserva = {
  id: number;
  destino: string;
  data: string;
  valor: string;
  hotel: string;
  interprete: string;
};

export const reservasExemplo: Reserva[] = [
  { id: 1, destino: 'Paris, França', data: '12 a 18 Set 2027', valor: 'R$ 7.500,00', hotel: 'Ritz Paris', interprete: 'Joaquim Muniz' },
  { id: 2, destino: 'Paris, França', data: '12 a 18 Set 2027', valor: 'R$ 7.500,00', hotel: 'Ritz Paris', interprete: 'Joaquim Muniz' },
];
