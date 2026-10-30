export type Cliente = {
  clienteId: number;
  nome: string;
  email: string;
  cpf: string;
  dtNascimento: string;
  telefone: string;
  cep: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
};

export type LoginResposta = {
  token: string;
  cliente: Cliente;
};