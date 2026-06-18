import React from 'react';
import { useSlideTheme } from '../../context/SlideThemeContext';
import presenter from '@/config/presenter.json';
import sustLogoUrl from '@/assets/Logos/SUST Logo.svg';

interface GlobalBottomProps {
  current: number;
  total: number;
  hide?: boolean;
}

/**
 * GlobalBottom renders a persistent footer layer inside the slide canvas sheet,
 * including a thin progress bar at the bottom, presenter branding, and active slide indices.
 */
export const GlobalBottom: React.FC<GlobalBottomProps> = ({
  current,
  total,
  hide = false,
}) => {
  let theme;
  try {
    theme = useSlideTheme();
  } catch (e) {
    theme = { resolvedTheme: { footerStyle: 'fraction' as const } };
  }

  const footerStyle = theme?.resolvedTheme?.footerStyle || 'fraction';

  if (hide) {
    return null;
  }

  // Calculate slide percentage progress
  const progressPercent = Math.max(0, Math.min(100, (current / total) * 100));

  const renderCounter = () => {
    if (footerStyle === 'hidden' || footerStyle === 'progress-bar') {
      return null;
    }
    if (footerStyle === 'prefixed') {
      return `Slide ${current} of ${total}`;
    }
    return `${current} / ${total}`;
  };

  const counterContent = renderCounter();

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 select-none pointer-events-none animate-in fade-in duration-200"
      data-global-bottom
    >
      {/* Footer Branding Text & Slide Counter */}
      <div className="flex items-center justify-between px-5 pt-1 pb-1.5 text-[9px] font-semibold text-muted-foreground/75 tracking-wide uppercase">
        <div className="flex items-center gap-1.5 select-none pointer-events-auto">
          <img src={sustLogoUrl} className="h-4.5 w-4.5 object-contain sust-logo-transition" alt="SUST Logo" />
          <span className="font-bold text-primary font-sans normal-case presenter-name-transition">{presenter.name}</span>
          <span className="text-muted-foreground/45 font-sans select-none">•</span>
          <span className="font-sans text-[8px] tracking-wide text-muted-foreground/90 uppercase">{presenter.title}, {presenter.department}</span>
        </div>
        {counterContent && (
          <span className="font-mono text-primary/95 font-bold">
            {counterContent}
          </span>
        )}
      </div>

      {/* Progress Bar Indicator at the absolute bottom edge */}
      <div className="h-0.5 w-full bg-muted/60 overflow-hidden">
        <div
          style={{ width: `${progressPercent}%` }}
          className="h-full bg-primary transition-all duration-300 ease-out"
        />
      </div>
    </div>
  );
};

export default GlobalBottom;

