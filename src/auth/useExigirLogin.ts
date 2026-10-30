import { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { useAuth } from './AuthContext';

export function useExigirLogin() {
  const { logado, iniciando } = useAuth();
  const router = useRouter();
  const caminho = usePathname();

  useEffect(() => {
    if (!iniciando && !logado) {
      router.replace({ pathname: '/login', params: { proximo: caminho } } as any);
    }
  }, [iniciando, logado]);
}