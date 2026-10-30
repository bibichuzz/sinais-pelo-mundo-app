export type Endereco = {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
};

// Retorna o endereço, ou null se o CEP não existir.
// Lança erro só se não for possível consultar (sem internet, por exemplo).
export async function buscarCep(cep: string): Promise<Endereco | null> {
  const numeros = cep.replace(/\D/g, '');
  if (numeros.length !== 8) return null;

  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), 10000);

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${numeros}/json/`, {
      signal: controle.signal,
    });
    if (!resposta.ok) throw new Error('Falha ao consultar o CEP.');

    const json = await resposta.json();
    if (json.erro) return null;

    return {
      logradouro: json.logradouro ?? '',
      bairro: json.bairro ?? '',
      cidade: json.localidade ?? '',
      uf: json.uf ?? '',
    };
  } finally {
    clearTimeout(timer);
  }
}