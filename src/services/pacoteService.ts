import { PacoteDetalhe, PacoteResumo } from '@/types/pacote';
import { apiGet } from './api';

export function listarDestaques() {
  return apiGet<PacoteResumo[]>('/pacotes/destaques');
}

export function listarPacotes() {
  return apiGet<PacoteResumo[]>('/pacotes');
}

export function buscarPacote(id: number) {
  return apiGet<PacoteDetalhe>(`/pacotes/${id}`);
}