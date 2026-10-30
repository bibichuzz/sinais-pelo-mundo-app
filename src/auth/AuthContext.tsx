import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ApiError, definirAoExpirar } from '@/services/api';
import { login, meusDados } from '@/services/authService';
import { obterToken, removerToken, salvarToken } from '@/services/tokenStorage';
import { Cliente } from '@/types/cliente';

type AuthCtx = {
  logado: boolean;
  iniciando: boolean;
  cliente: Cliente | null;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
  atualizarCliente: (c: Cliente) => void;
  recarregarCliente: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [iniciando, setIniciando] = useState(true);

  const sair = useCallback(async () => {
    await removerToken();
    setToken(null);
    setCliente(null);
  }, []);

  useEffect(() => {
    definirAoExpirar(() => {
      sair();
    });
  }, [sair]);

  useEffect(() => {
    (async () => {
      const salvo = await obterToken();
      setToken(salvo);
      setIniciando(false);

      if (salvo) {
        try {
          setCliente(await meusDados());
        } catch (e) {
          if (!(e instanceof ApiError)) return;
        }
      }
    })();
  }, []);

  const entrar = async (email: string, senha: string) => {
    const resposta = await login(email, senha);
    await salvarToken(resposta.token);
    setToken(resposta.token);
    setCliente(resposta.cliente);
  };

  const recarregarCliente = async () => {
    setCliente(await meusDados());
  };

  return (
    <Ctx.Provider
      value={{
        logado: !!token,
        iniciando,
        cliente,
        entrar,
        sair,
        atualizarCliente: setCliente,
        recarregarCliente,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}