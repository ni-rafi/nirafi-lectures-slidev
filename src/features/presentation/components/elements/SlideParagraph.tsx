import React from 'react';
import { ClickReveal } from './ClickReveal';

export interface SlideElementProps {
  revealAt?: number | string;
  revealPreset?: 'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none';
  className?: string;
}

interface SlideParagraphProps extends SlideElementProps {
  title?: string;
  text?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'info' | 'warning' | 'error' | 'success' | 'callout' | 'plain' | 'default';
}

export const SlideParagraph: React.FC<SlideParagraphProps> = ({
  title,
  text,
  children,
  revealAt,
  revealPreset,
  variant = 'default',
  className = '',
}) => {
  let variantClasses = '';
  if (variant === 'info') {
    variantClasses = 'p-3 bg-blue-500/5 border-l-2 border-blue-500 rounded text-blue-700 dark:text-blue-300';
  } else if (variant === 'warning') {
    variantClasses = 'p-3 bg-amber-500/5 border-l-2 border-amber-500 rounded text-amber-700 dark:text-amber-300';
  } else if (variant === 'error') {
    variantClasses = 'p-3 bg-red-500/5 border-l-2 border-red-500 rounded text-red-700 dark:text-red-300';
  } else if (variant === 'success') {
    variantClasses = 'p-3 bg-emerald-500/5 border-l-2 border-emerald-500 rounded text-emerald-700 dark:text-emerald-300';
  } else if (variant === 'callout') {
    variantClasses = 'p-3 bg-primary/5 border-l-2 border-primary rounded text-foreground';
  } else if (variant === 'plain') {
    variantClasses = 'text-muted-foreground';
  } else {
    // default premium PowerPoint ash card with blue hooks
    variantClasses = 'relative p-5 md:p-6 bg-muted/60 dark:bg-muted/20 border-l-[6px] border-primary rounded-r-xl text-foreground font-medium before:absolute before:top-0 before:left-[-6px] before:w-10 before:h-[6px] before:bg-primary after:absolute after:bottom-0 after:left-[-6px] after:w-10 after:h-[6px] after:bg-primary';
  }

  const isCard = variant !== 'plain' && variant !== 'info' && variant !== 'warning' && variant !== 'error' && variant !== 'success';

  const content = (
    <div className={`text-xs md:text-sm leading-relaxed select-text ${variantClasses} ${className}`}>
      {title && (
        <div className={`font-extrabold text-xs md:text-sm text-primary tracking-wide mb-3 select-none ${
          isCard ? 'border-b border-border/40 pb-1.5 uppercase' : ''
        }`}>
          {title}
        </div>
      )}
      <div className={title ? 'mt-1 text-foreground/90 font-medium' : ''}>
        {text || children}
      </div>
    </div>
  );

  if (revealAt !== undefined) {
    return <ClickReveal at={revealAt} preset={revealPreset}>{content}</ClickReveal>;
  }

  return content;
};

export default SlideParagraph;
