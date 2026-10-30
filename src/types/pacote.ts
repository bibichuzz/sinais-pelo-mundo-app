export type PacoteResumo = {
  pacoteId: number;
  destino: string;
  preco: number;
  urlImagem: string;
  nomeHotel: string | null;
  dataCheckin: string | null;
  dataCheckout: string | null;
};

export type PassagemInfo = {
  transporte: string;
  tipoPassagem: string;
  preco: number;
  localPartida: string;
  horarioPartida: string;
  localChegada: string;
  horarioChegada: string;
};

export type HotelInfo = {
  nomeHotel: string;
  enderecoHotel: string;
  dataCheckin: string;
  dataCheckout: string;
  preco: number;
};

export type InterpreteInfo = {
  nomeInterprete: string;
};

export type PacoteDetalhe = {
  pacoteId: number;
  destino: string;
  preco: number;
  urlImagem: string;
  passagem: PassagemInfo | null;
  hotel: HotelInfo | null;
  interprete: InterpreteInfo | null;
};