import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode, useEffect } from 'react';
import { Appearance } from 'react-native';
import { ThemeContextValue } from '../interfaces/ThemeContextValue.interface';

export type ColorScheme = 'light' | 'dark';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  const [scheme, setScheme] = useState<ColorScheme>(system);

  const toggle = useCallback(() => {
    setScheme((s) => (s === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    // Debug log for scheme change
    console.log('[Theme] scheme =>', scheme);
  }, [scheme]);

  const value = useMemo(() => ({ scheme, toggle, setScheme }), [scheme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeScheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeScheme must be used inside ThemeProvider');
  return ctx;
}
