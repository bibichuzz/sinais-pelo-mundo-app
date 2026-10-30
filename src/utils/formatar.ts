import { PacoteDetalhe } from '../types/pacote';

// Aceita "2026-12-01" e "2026-12-01T00:00:00Z"
export const formatarData = (iso: string) =>
  iso.slice(0, 10).split('-').reverse().join('/');

export const formatarPreco = (valor: number) => {
  const [inteiro, centavos] = valor.toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
};

export const precoSemCentavos = (valor: number) =>
  `R$ ${Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

export const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// dias = noites + 1 (mesma regra que o app já usava)
export function diasEntre(inicio: string, fim: string) {
  const a = Date.parse(inicio.slice(0, 10));
  const b = Date.parse(fim.slice(0, 10));
  return Math.round((b - a) / 86400000) + 1;
}

const NOMES_TRANSPORTE: Record<string, string> = { Aviao: 'Avião', Onibus: 'Ônibus' };

const NOMES_TIPO: Record<string, string> = {
  Convencional: 'Convencional',
  Executivo: 'Executivo',
  SemiLeito: 'Semi-leito',
  Leito: 'Leito',
  LeitoCama: 'Leito cama',
  Economica: 'Classe econômica',
  Executiva: 'Classe executiva',
  PrimeiraClasse: 'Primeira classe',
};

export const nomeTransporte = (t: string) => NOMES_TRANSPORTE[t] ?? t;
export const nomeTipoPassagem = (t: string) => NOMES_TIPO[t] ?? t;

export const descricaoDoPacote = (p: PacoteDetalhe) =>
  `Pacote completo para ${p.destino} com hotel, passagem e intérprete.`;

export function inclusosDoPacote(p: PacoteDetalhe): string[] {
  const itens: string[] = [];
  if (p.hotel) itens.push('Hotel');
  if (p.passagem) {
    itens.push(p.passagem.transporte === 'Aviao' ? 'Passagem aérea' : 'Passagem de ônibus');
  }
  if (p.interprete) itens.push('Intérprete durante todo o período');
  return itens;
}