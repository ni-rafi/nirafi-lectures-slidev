import React, { useContext } from 'react';
import { PresentationContext } from '../../features/presentation/context/PresentationContext';
import presenter from '@/config/presenter.json';
import sustLogoUrl from '@/assets/Logos/SUST Logo.svg';

interface TitleLayoutProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * TitleLayout renders cover pages, session openers, or major dividers.
 */
export const TitleLayout: React.FC<TitleLayoutProps> = ({
  title,
  subtitle,
  footer,
}) => {
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';

  const presenterName = footer && typeof footer === 'string' && !footer.includes('Department')
    ? footer
    : presenter.name;

  if (viewMode === 'scroll') {
    return (
      <div className="relative flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-4 gap-6 bg-transparent text-foreground w-full overflow-hidden">
        {/* Top logo in scroll card */}
        <div className="flex items-center justify-center w-full px-2 opacity-85 select-none">
          <img src={sustLogoUrl} className="h-10 w-10 object-contain sust-logo-transition" alt="SUST Logo" />
        </div>

        <div className="space-y-2 mt-2">
          {subtitle && (
            <span className="text-sm tracking-wider text-primary font-mono font-bold block">
              {subtitle}
            </span>
          )}
          <h2 className="text-xl font-extrabold tracking-tight text-primary sm:text-2xl leading-tight slide-header-title">
            {title}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center gap-0.5 mt-2 border-t pt-4 w-full border-border/40">
          <span className="text-xs font-bold text-primary presenter-name-transition">{presenterName}</span>
          <span className="text-[8px] font-semibold text-muted-foreground/80 uppercase">{presenter.title}</span>
          <span className="text-[8px] font-medium text-muted-foreground/75 uppercase">{presenter.department}</span>
          <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">{presenter.institution}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-between h-full w-full px-4 py-6 bg-transparent text-foreground overflow-hidden select-none">
      {/* Top logo in presentation mode */}
      <div className="absolute top-6 left-8">
        <img src={sustLogoUrl} className="h-14 w-14 drop-shadow-xs object-contain sust-logo-transition" alt="SUST Logo" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center max-w-3xl mx-auto gap-8 mt-12">
        <div className="space-y-2">
          {subtitle && (
            <span className="text-lg md:text-xl font-bold tracking-wider text-primary font-mono block">
              {subtitle}
            </span>
          )}
          <h1 className="text-3xl md:text-4.5xl font-extrabold tracking-tight text-primary leading-tight slide-header-title">
            {title}
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 mt-6">
          <span className="text-sm md:text-base font-bold text-primary presenter-name-transition">{presenterName}</span>
          <span className="text-[9px] font-semibold text-muted-foreground/80 uppercase tracking-wider">{presenter.title}</span>
          <span className="text-[9px] font-semibold text-muted-foreground/75 uppercase tracking-wider">{presenter.department}</span>
          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">{presenter.institution}</span>
        </div>
      </div>
    </div>
  );
};

export default TitleLayout;

