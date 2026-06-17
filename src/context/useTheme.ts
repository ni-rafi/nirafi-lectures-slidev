import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

/**
 * Custom hook to access theme, resolvedTheme, and colorScheme variables/methods.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
