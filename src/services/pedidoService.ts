import { apiGet, apiPost } from './api';
import { NotaFiscal, Pedido, StatusPagamento } from '@/types/pedido';

export type FormaApi = 'Debito' | 'Credito' | 'Pix';

export function listarMeusPedidos() {
  return apiGet<Pedido[]>('/pedidos', true);
}

export function criarPedido(pacoteId: number, formaPagamento: FormaApi, parcelas: number) {
  return apiPost<Pedido>('/pedidos', { pacoteId, formaPagamento, parcelas }, true);
}

export function buscarPedido(id: number) {
  return apiGet<Pedido>(`/pedidos/${id}`, true);
}

export function qrDoPedido(id: number) {
  return apiGet<{ url: string }>(`/pedidos/${id}/qr`, true);
}

export function statusPagamento(id: number) {
  return apiGet<StatusPagamento>(`/pedidos/${id}/pago`, true);
}

export function pagarPedido(id: number) {
  return apiPost<Pedido>(`/pedidos/${id}/pagar`, {}, true);
}

export function cancelarPedido(id: number) {
  return apiPost<{ mensagem: string }>(`/pedidos/${id}/cancelar`, {}, true);
}

export function notaFiscal(id: number) {
  return apiGet<NotaFiscal>(`/pedidos/${id}/nota-fiscal`, true);
}