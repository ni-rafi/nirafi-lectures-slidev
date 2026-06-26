import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';
import { SlideTwoColumns } from './SlideTwoColumns';

export type SlideCompareHighlight = 'left' | 'right' | 'none';

export interface SlideCompareProps {
  leftTitle: string;
  leftContent: React.ReactNode;
  rightTitle: string;
  rightContent: React.ReactNode;
  highlight?: SlideCompareHighlight;
  className?: string;
}

export const SlideCompare: React.FC<SlideCompareProps> = ({
  leftTitle,
  leftContent,
  rightTitle,
  rightContent,
  highlight = 'none',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const isLeftHighlighted = highlight === 'left';
  const isRightHighlighted = highlight === 'right';

  const leftClasses = `flex-1 flex flex-col p-5 rounded-2xl border transition-all duration-300 ${
    isBlog
      ? isLeftHighlighted
        ? 'bg-primary/5 border-primary shadow-sm'
        : 'bg-transparent border-border/40'
      : isLeftHighlighted
      ? 'bg-card border-primary shadow-md scale-[1.01] z-10'
      : `bg-muted/40 dark:bg-muted/10 border-border/40 ${highlight !== 'none' ? 'opacity-50' : ''}`
  }`;

  const rightClasses = `flex-1 flex flex-col p-5 rounded-2xl border transition-all duration-300 ${
    isBlog
      ? isRightHighlighted
        ? 'bg-primary/5 border-primary shadow-sm'
        : 'bg-transparent border-border/40'
      : isRightHighlighted
      ? 'bg-card border-primary shadow-md scale-[1.01] z-10'
      : `bg-muted/40 dark:bg-muted/10 border-border/40 ${highlight !== 'none' ? 'opacity-50' : ''}`
  }`;

  return (
    <SlideTwoColumns
      left={
        <div className="flex flex-col flex-1">
          <h4 className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-primary mb-3 select-none">
            {leftTitle}
          </h4>
          <div className="text-xs md:text-sm text-foreground/90 leading-relaxed flex-1 select-text">
            {leftContent}
          </div>
        </div>
      }
      right={
        <div className="flex flex-col flex-1">
          <h4 className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-primary mb-3 select-none">
            {rightTitle}
          </h4>
          <div className="text-xs md:text-sm text-foreground/90 leading-relaxed flex-1 select-text">
            {rightContent}
          </div>
        </div>
      }
      align="stretch"
      gap="md"
      className={className}
      leftClassName={leftClasses}
      rightClassName={rightClasses}
    />
  );
};

export default SlideCompare;
