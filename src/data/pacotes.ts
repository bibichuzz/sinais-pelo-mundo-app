// Dados de exemplo. No site eles vêm do backend (@Model). Depois trocamos por fetch na API.
export type Pacote = {
  pacoteId: number;
  destino: string;
  checkin: string;  // AAAA-MM-DD
  checkout: string; // AAAA-MM-DD
  preco: number;
  urlImagem?: string;
};

export const pacotes: Pacote[] = [
  { pacoteId: 1, destino: 'Rio de Janeiro - RJ', checkin: '2026-12-10', checkout: '2026-12-17', preco: 4890 },
  { pacoteId: 2, destino: 'Gramado - RS', checkin: '2027-01-05', checkout: '2027-01-10', preco: 3650.5 },
  { pacoteId: 3, destino: 'Salvador - BA', checkin: '2027-02-12', checkout: '2027-02-19', preco: 5120 },
];

export const formatarData = (iso: string) => iso.split('-').reverse().join('/');

export const formatarPreco = (valor: number) => {
  const [inteiro, centavos] = valor.toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
};
