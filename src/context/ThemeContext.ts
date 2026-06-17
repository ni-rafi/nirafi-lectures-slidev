import { createContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = Exclude<Theme, 'system'>;
export type ColorScheme = 'neutral' | 'blue' | 'green' | 'orange';

export interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const themeInitialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'light',
  colorScheme: 'neutral',
  setTheme: () => null,
  setColorScheme: () => null,
};

export const ThemeContext = createContext<ThemeProviderState>(themeInitialState);
