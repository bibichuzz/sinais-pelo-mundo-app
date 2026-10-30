import { buscarPacote, listarDestaques, listarPacotes } from '@/services/pacoteService';
import { PacoteDetalhe } from '@/types/pacote';
import { useCallback, useEffect, useState } from 'react';

function useCarregar<T>(buscar: () => Promise<T>, dependencias: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    setErro(null);
    buscar()
      .then(setDados)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { dados, carregando, erro, recarregar: carregar };
}

export function useDestaques() {
  const { dados, ...resto } = useCarregar(listarDestaques);
  return { pacotes: dados ?? [], ...resto };
}

export function usePacotes() {
  const { dados, ...resto } = useCarregar(listarPacotes);
  return { pacotes: dados ?? [], ...resto };
}

export function usePacote(id: number) {
  return useCarregar<PacoteDetalhe>(() => buscarPacote(id), [id]);
}