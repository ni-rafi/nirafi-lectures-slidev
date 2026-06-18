import React, { useContext } from 'react';
import { PresentationContext } from '../../features/presentation/context/PresentationContext';

interface ThankYouLayoutProps {
  title?: string;
  subtitle?: string;
}

export const ThankYouLayout: React.FC<ThankYouLayoutProps> = ({
  title = 'Thank You',
  subtitle = 'Do you have any question?',
}) => {
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';

  const renderContent = () => {
    return (
      <div className="relative w-full flex items-center justify-center min-h-[160px] select-text">
        {/* Horizontal background line */}
        <div className="absolute left-0 right-0 h-[2px] bg-border/80 top-1/2 -translate-y-1/2 z-0" />

        {/* Content wrapper masking the line */}
        <div className="relative z-10 flex items-center bg-background px-6 py-4 gap-6">
          {/* Circle Icon */}
          <div className="h-14 w-14 rounded-full bg-primary flex-shrink-0" />

          {/* Text block */}
          <div className="text-left flex flex-col items-start justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-none mb-2 font-sans">
              {title}
            </h1>
            <span className="inline-block text-xs md:text-sm font-semibold text-primary-foreground bg-primary px-2.5 py-1 rounded-xs">
              {subtitle}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (viewMode === 'scroll') {
    return (
      <div className="relative flex flex-col items-center justify-center py-6 bg-transparent text-foreground w-full overflow-hidden min-h-[200px]">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center items-center h-full w-full px-6 py-8 bg-transparent text-foreground overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default ThankYouLayout;
