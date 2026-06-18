import React from 'react';
import { LatexFormula } from './LatexFormula';
import { ClickReveal } from './ClickReveal';
import { SlideElementProps } from './SlideParagraph';
import { useSlideTheme } from '../../context/SlideThemeContext';

interface SlideEquationProps extends SlideElementProps {
  math: string;
  block?: boolean;
  label?: string;
}

export const SlideEquation: React.FC<SlideEquationProps> = ({
  math,
  block = false,
  label,
  revealAt,
  revealPreset,
  className = '',
}) => {
  let theme;
  try {
    theme = useSlideTheme();
  } catch (e) {
    theme = { resolvedTheme: { equationBg: 'default' as const } };
  }

  const equationBg = theme?.resolvedTheme?.equationBg || 'default';

  let bgClass = 'bg-muted/40 rounded-xl';
  if (equationBg === 'none') {
    bgClass = 'bg-transparent p-2';
  } else if (equationBg === 'tinted') {
    bgClass = 'bg-primary/5 rounded-xl border border-primary/10';
  } else if (equationBg === 'bordered') {
    bgClass = 'border-2 border-primary/20 bg-transparent rounded-xl';
  } else {
    // default
    bgClass = 'bg-card border border-border shadow-sm rounded-xl';
  }

  const content = (
    <div className={`my-3 flex flex-col items-center justify-center p-4 ${bgClass} ${className}`}>
      {label && (
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
          {label}
        </span>
      )}
      <LatexFormula math={math} block={block} />
    </div>
  );

  if (revealAt !== undefined) {
    return <ClickReveal at={revealAt} preset={revealPreset}>{content}</ClickReveal>;
  }

  return content;
};

export default SlideEquation;
