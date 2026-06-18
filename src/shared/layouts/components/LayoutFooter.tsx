import React, { useContext } from 'react';
import { PresentationContext } from '../../../features/presentation/context/PresentationContext';

interface LayoutFooterProps {
  footer?: React.ReactNode;
  variant?: 'default' | 'title';
}

export const LayoutFooter: React.FC<LayoutFooterProps> = ({ footer, variant = 'default' }) => {
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';

  if (!footer) return null;

  if (viewMode === 'scroll') {
    if (variant === 'title') {
      return (
        <div className="text-[10px] font-semibold text-muted-foreground font-mono mt-2 select-text">
          {footer}
        </div>
      );
    }
    return (
      <div className="text-[10px] font-semibold text-muted-foreground font-mono mt-4 text-center border-t pt-2 border-border/40 select-text">
        {footer}
      </div>
    );
  }

  return (
    <div className="relative z-10 text-[10px] font-semibold text-muted-foreground font-mono text-center mt-2 slide-layout-footer select-text">
      {footer}
    </div>
  );
};

export default LayoutFooter;


