import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { listarMeusPedidos } from '@/services/pedidoService';
import { Pedido } from '@/types/pedido';

export function usePedidos(ativo: boolean) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(() => {
    if (!ativo) return;
    setCarregando(true);
    setErro(null);
    listarMeusPedidos()
      .then(setPedidos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [ativo]);

  // Recarrega toda vez que a tela volta ao foco
  useFocusEffect(carregar);

  return { pedidos, carregando, erro, recarregar: carregar };
}