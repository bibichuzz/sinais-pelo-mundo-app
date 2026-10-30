import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, darkColors, lightColors } from './colors';

type Modo = 'light' | 'dark';

const MIN = 0.8; // mesmos limites do text-size.js
const MAX = 1.4;
const STEP = 0.1;

type ThemeCtx = {
  colors: Colors;
  isDark: boolean;
  toggleTheme: () => void;
  fontScale: number;
  increaseFont: () => void;
  decreaseFont: () => void;
  fs: (tamanho: number) => number; // aplica a escala de fonte: fs(16) -> 16 * escala
};

const Ctx = createContext<ThemeCtx | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [modo, setModo] = useState<Modo>('light');
  const [fontScale, setFontScale] = useState(1);

  // Carrega o que estava salvo (equivalente ao localStorage do site)
  useEffect(() => {
    (async () => {
      try {
        const [m, e] = await Promise.all([
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('fontScale'),
        ]);
        if (m === 'dark') setModo('dark');
        const n = parseFloat(e ?? '');
        if (!isNaN(n)) setFontScale(Math.min(MAX, Math.max(MIN, n)));
      } catch {}
    })();
  }, []);

  const toggleTheme = () => {
    const novo: Modo = modo === 'dark' ? 'light' : 'dark';
    setModo(novo);
    AsyncStorage.setItem('theme', novo).catch(() => {});
  };

  const mudarFonte = (delta: number) => {
    const novo = Math.round(Math.min(MAX, Math.max(MIN, fontScale + delta)) * 10) / 10;
    setFontScale(novo);
    AsyncStorage.setItem('fontScale', String(novo)).catch(() => {});
  };

  const value: ThemeCtx = {
    colors: modo === 'dark' ? darkColors : lightColors,
    isDark: modo === 'dark',
    toggleTheme,
    fontScale,
    increaseFont: () => mudarFonte(STEP),
    decreaseFont: () => mudarFonte(-STEP),
    fs: (tamanho) => tamanho * fontScale,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppTheme precisa estar dentro de <AppThemeProvider>');
  return ctx;
}
