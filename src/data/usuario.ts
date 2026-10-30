// Dados de exemplo do usuário logado. Com o backend, vêm da API.
export const usuarioExemplo = {
  nome: 'Maria Souza',
  email: 'maria.souza@email.com',
  senha: '********',
  cpf: '123.456.789-09',
  nascimento: '15/03/1995',
  telefone: '(11) 98765-4321',
  endereco: 'Rua das Flores, 123 - São Paulo - SP',
};

export type Usuario = typeof usuarioExemplo;
