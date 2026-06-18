import { useEffect } from 'react';

const SYSTEM_FONTS = new Set([
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'sans-serif',
  'serif',
  'monospace',
  'inherit',
  'initial',
  'geist',
  'geist variable'
]);

const loadedFonts = new Set<string>();

/**
 * useGoogleFontLoader dynamically appends link tags to the document head
 * to load Google Fonts at runtime for slide customize selectors.
 */
export const useGoogleFontLoader = (fontSans: string, fontHeader: string) => {
  useEffect(() => {
    const loadFont = (fontFamily: string) => {
      if (!fontFamily) return;
      const normalized = fontFamily.trim().toLowerCase();
      if (SYSTEM_FONTS.has(normalized) || loadedFonts.has(normalized)) {
        return;
      }

      try {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@300;400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
        loadedFonts.add(normalized);
      } catch (err) {
        console.warn('Failed to load Google Font:', fontFamily, err);
      }
    };

    loadFont(fontSans);
    loadFont(fontHeader);
  }, [fontSans, fontHeader]);
};

export default useGoogleFontLoader;
