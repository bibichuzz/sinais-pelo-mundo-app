export const API_URL = 'https://sinais-pelo-mundo.onrender.com/api';

// O plano grátis do Render "dorme": a primeira chamada pode levar até ~1 minuto.
const TEMPO_LIMITE_MS = 60000;

export async function apiGet<T>(caminho: string): Promise<T> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  try {
    const resposta = await fetch(`${API_URL}${caminho}`, {
      headers: { Accept: 'application/json' },
      signal: controle.signal,
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status} ao acessar o servidor.`);
    }

    return (await resposta.json()) as T;
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      throw new Error('O servidor demorou para responder. Tente novamente.');
    }
    throw new Error(e?.message ?? 'Não foi possível conectar ao servidor.');
  } finally {
    clearTimeout(timer);
  }
}