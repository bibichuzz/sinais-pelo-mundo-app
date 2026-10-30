export type Pedido = {
  pedidoId: number;
  pacoteId: number;
  destino: string;
  preco: number;
  formaPagamento: string;
  parcelas: number;
  cancelado: boolean;
  dataEfetivacao: string;
  dataPagamento: string | null;
  nomeHotel: string | null;
  dataCheckin: string | null;
  dataCheckout: string | null;
  nomeInterprete: string | null;
};