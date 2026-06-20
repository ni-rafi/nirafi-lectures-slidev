import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexFormulaProps {
  math: string;
  block?: boolean;
}

export const LatexFormula: React.FC<LatexFormulaProps> = ({ math, block = false }) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          output: 'html',
        });
      } catch (err) {
        console.warn('KaTeX rendering error:', err);
      }
    }
  }, [math, block]);

  return (
    <span
      ref={containerRef}
      className={block ? 'block my-4 text-center select-text overflow-x-auto overflow-y-hidden max-w-full py-1' : 'inline-block select-text whitespace-nowrap'}
      data-latex-formula
    />
  );
};

export default LatexFormula;
