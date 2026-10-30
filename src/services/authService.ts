import { apiDelete, apiGet, apiPost, apiPut } from './api';
import { Cliente, LoginResposta } from '@/types/cliente';

export type DadosCadastro = {
  nome: string;
  dtNascimento: string; // AAAA-MM-DD
  telefone: string;     // só números (11)
  cpf: string;          // só números (11)
  cep: string;          // só números (8)
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  email: string;
  senha: string;
};

export function login(email: string, senha: string) {
  return apiPost<LoginResposta>('/auth/login', { email, senha });
}

export function cadastrar(dados: DadosCadastro) {
  return apiPost<{ mensagem: string }>('/clientes', dados);
}

export function meusDados() {
  return apiGet<Cliente>('/clientes/me', true);
}

export type DadosAtualizacao = Omit<DadosCadastro, 'senha'> & {
  senhaAtual: string | null;
  novaSenha: string | null;
};

export function atualizarMeusDados(dados: DadosAtualizacao) {
  return apiPut<Cliente>('/clientes/me', dados, true);
}

export function excluirMinhaConta() {
  return apiDelete<{ mensagem: string }>('/clientes/me', true);
}