// Dados de exemplo do catálogo. Depois trocamos por fetch na API do backend.
export type PacoteCatalogo = {
  id: number;
  destino: string;
  dias: number; // noites = dias - 1
  preco: number;
  urlImagem?: string;
};

export const catalogo: PacoteCatalogo[] = [
  { id: 1, destino: 'Rio de Janeiro - RJ', dias: 5, preco: 2950 },
  { id: 2, destino: 'São Paulo - SP', dias: 4, preco: 2450 },
  { id: 3, destino: 'Foz do Iguaçu - PR', dias: 4, preco: 2150 },
  { id: 4, destino: 'Salvador - BA', dias: 5, preco: 2650 },
];

// Mesmas opções do <datalist> do site
export const destinos = catalogo.map((p) => p.destino);

export const precoSemCentavos = (v: number) =>
  `R$ ${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

export const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
