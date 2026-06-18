import React, { useContext } from 'react';
import { PresentationContext } from '../../../features/presentation/context/PresentationContext';
import { useSlideTheme } from '../../../features/presentation/context/SlideThemeContext';

interface LayoutHeaderProps {
  title: React.ReactNode;
  variant?: 'default' | 'title';
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({ title, variant = 'default' }) => {
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';

  let borderSide = 'all';
  try {
    const themeContext = useSlideTheme();
    borderSide = themeContext.resolvedTheme.borderSide;
  } catch (e) {
    // Context fallback if consumed outside SlideThemeProvider
  }

  let borderClasses = '';
  if (borderSide === 'left') {
    borderClasses = 'border-l-[6px] border-primary pl-3.5 text-left w-full';
  } else if (borderSide === 'top') {
    borderClasses = 'border-t-[6px] border-primary pt-2 text-left w-full';
  }

  if (viewMode === 'scroll') {
    if (variant === 'title') {
      return (
        <h1 className={`text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl leading-tight ${borderClasses}`}>
          {title}
        </h1>
      );
    }
    return (
      <header className={`slide-header text-lg font-bold tracking-tight text-foreground mb-6 ${borderClasses}`}>
        {title}
      </header>
    );
  }

  if (variant === 'title') {
    return (
      <h1 className={`text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-tight slide-header-title ${borderClasses}`}>
        {title}
      </h1>
    );
  }

  return (
    <header className={`slide-header text-xl font-bold tracking-tight text-foreground mb-4 slide-header-title ${borderClasses}`}>
      {title}
    </header>
  );
};

export default LayoutHeader;
