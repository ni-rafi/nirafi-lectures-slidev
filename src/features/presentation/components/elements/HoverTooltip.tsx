import React, { useState } from 'react';

interface HoverTooltipProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  className?: string;
  tooltipClassName?: string;
}

export const HoverTooltip: React.FC<HoverTooltipProps> = ({
  trigger,
  content,
  title,
  className = '',
  tooltipClassName = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <span className="cursor-pointer">{trigger}</span>
      {isVisible && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 bg-card border border-border/80 text-[10px] text-muted-foreground leading-normal p-2.5 rounded-lg shadow-lg select-none pointer-events-none animate-in fade-in zoom-in-95 duration-150 break-words whitespace-normal ${tooltipClassName}`}
        >
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-card" />
          {title && (
            <strong className="block text-primary font-mono text-[9px] mb-0.5 uppercase tracking-wider">
              {title}
            </strong>
          )}
          <span className="block text-[10px] text-foreground/90 font-medium leading-relaxed">
            {content}
          </span>
        </div>
      )}
    </div>
  );
};

export default HoverTooltip;
