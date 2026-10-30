import { obterToken } from './tokenStorage';

export const API_URL = 'https://sinais-pelo-mundo.onrender.com/api';

// O plano grátis do Render "dorme": a primeira chamada pode levar até ~1 minuto.
const TEMPO_LIMITE_MS = 60000;

export class ApiError extends Error {
  status: number;
  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.status = status;
  }
}

// Chamado quando uma rota protegida responde 401 (token vencido ou inválido)
let aoExpirar: (() => void) | null = null;
export function definirAoExpirar(fn: () => void) {
  aoExpirar = fn;
}

function extrairMensagem(json: any, status: number): string {
  // Erros de validação do ASP.NET: { errors: { Campo: ["mensagem"] } }
  if (json?.errors && typeof json.errors === 'object') {
    const msgs = (Object.values(json.errors) as string[][]).flat();
    if (msgs.length) return msgs.join('\n');
  }
  if (json?.mensagem) return json.mensagem;
  if (status === 401) return 'Sessão expirada. Entre novamente.';
  return `Erro ${status} ao acessar o servidor.`;
}

async function requisitar<T>(
  metodo: 'GET' | 'POST',
  caminho: string,
  corpo?: unknown,
  autenticado = false,
): Promise<T> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (corpo !== undefined) headers['Content-Type'] = 'application/json';
  if (autenticado) {
    const token = await obterToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal: controle.signal,
    });
    } catch (e: any) {
    console.log('ERRO FETCH:', e);
    if (e?.name === 'AbortError') {
      throw new ApiError('O servidor demorou para responder. Tente novamente.', 0);
    }
    throw new ApiError(`Não foi possível conectar ao servidor. (${e?.message})`, 0);
  }

  const texto = await resposta.text();
  let json: any = null;
  try {
    json = texto ? JSON.parse(texto) : null;
  } catch {}

  if (!resposta.ok) {
    if (resposta.status === 401 && autenticado) aoExpirar?.();
    throw new ApiError(extrairMensagem(json, resposta.status), resposta.status);
  }

  return json as T;
}

export function apiGet<T>(caminho: string, autenticado = false) {
  return requisitar<T>('GET', caminho, undefined, autenticado);
}

export function apiPost<T>(caminho: string, corpo: unknown, autenticado = false) {
  return requisitar<T>('POST', caminho, corpo, autenticado);
}