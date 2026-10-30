import { apiGet, apiPost } from './api';
import { Pedido } from '@/types/pedido';

export function listarMeusPedidos() {
  return apiGet<Pedido[]>('/pedidos', true);
}

export function cancelarPedido(id: number) {
  return apiPost<{ mensagem: string }>(`/pedidos/${id}/cancelar`, {}, true);
}