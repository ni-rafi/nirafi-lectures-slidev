import React, { useEffect, useMemo, useState } from 'react';
import { ThemeContext, type Theme, type ResolvedTheme, type ColorScheme } from './ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  defaultColorScheme = 'neutral',
}) => {
  const [theme, _setTheme] = useState<Theme>(
    () => (localStorage.getItem('vite-ui-theme') as Theme) || defaultTheme
  );

  const [colorScheme, _setColorScheme] = useState<ColorScheme>(
    () => (localStorage.getItem('vite-ui-color-scheme') as ColorScheme) || defaultColorScheme
  );

  const resolvedTheme = useMemo((): ResolvedTheme => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme as ResolvedTheme;
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
      root.classList.remove('light', 'dark');
      root.classList.add(currentResolvedTheme);
    };

    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
      }
    };

    applyTheme(resolvedTheme);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, resolvedTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(
      'theme-neutral',
      'theme-blue',
      'theme-green',
      'theme-orange'
    );
    root.classList.add(`theme-${colorScheme}`);
  }, [colorScheme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('vite-ui-theme', newTheme);
    _setTheme(newTheme);
  };

  const setColorScheme = (scheme: ColorScheme) => {
    localStorage.setItem('vite-ui-color-scheme', scheme);
    _setColorScheme(scheme);
  };

  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    colorScheme,
    setTheme,
    setColorScheme,
  }), [theme, resolvedTheme, colorScheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
