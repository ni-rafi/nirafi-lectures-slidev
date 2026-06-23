import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';

interface InteractiveCardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'plain';
  className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  children,
  variant = 'default',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  let cardClasses = '';
  if (isBlog) {
    cardClasses = 'w-full border border-border/50 rounded-xl p-4 bg-transparent';
  } else if (variant === 'plain') {
    const hasBorderOverride = className.includes('border-0') || className.includes('border-none');
    cardClasses = `w-full p-4 ${hasBorderOverride ? '' : 'border border-border/40'} rounded-xl bg-transparent`;
  } else {
    // default premium PowerPoint ash card with border accents
    cardClasses = 'relative p-5 md:p-6 bg-muted/60 dark:bg-muted/20 border-l-[6px] border-primary rounded-r-xl text-foreground font-medium before:absolute before:top-0 before:left-[-6px] before:w-10 before:h-[6px] before:bg-primary after:absolute after:bottom-0 after:left-[-6px] after:w-10 after:h-[6px] after:bg-primary';
  }

  return (
    <div className={`${cardClasses} ${className}`}>
      {title && (
        <div className={`font-extrabold text-xs md:text-sm text-primary tracking-wide mb-3 select-none ${
          (!isBlog && variant !== 'plain') ? 'border-b border-border/40 pb-1.5 uppercase' : ''
        }`}>
          {title}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default InteractiveCard;
