import { createContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = Exclude<Theme, 'system'>;
export type ColorScheme = 'neutral' | 'blue' | 'green' | 'orange';

export interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  colorScheme: ColorScheme;
  borderRadius: number;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setBorderRadius: (radius: number) => void;
}

export const themeInitialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'light',
  colorScheme: 'green',
  borderRadius: 4,
  setTheme: () => null,
  setColorScheme: () => null,
  setBorderRadius: () => null,
};

export const ThemeContext = createContext<ThemeProviderState>(themeInitialState);
