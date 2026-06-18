import React, { useContext } from 'react';
import { PresentationContext } from '../../features/presentation/context/PresentationContext';
import LayoutHeader from './components/LayoutHeader';
import LayoutFooter from './components/LayoutFooter';

interface GridLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
  cols?: number; // e.g. 2, 3, 4
  bgVariant?: 'default' | 'calculation' | 'gallery';
  footer?: React.ReactNode;
}

/**
 * GridLayout arranges slides in a multi-column flex/grid container,
 * supporting 2, 3, or 4 columns dynamically.
 */
export const GridLayout: React.FC<GridLayoutProps> = ({
  title,
  children,
  cols = 3,
  footer,
}) => {
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';

  const getColClass = () => {
    switch (cols) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (viewMode === 'scroll') {
    return (
      <div className="relative flex flex-col w-full p-6 md:p-8 bg-card border border-border/60 rounded-2xl shadow-xs select-text text-foreground min-h-[300px] justify-between">
        <div>
          <LayoutHeader title={title} />
          <main className="w-full">
            <div className={`grid gap-6 w-full ${getColClass()}`}>
              {children}
            </div>
          </main>
        </div>
        <LayoutFooter footer={footer} />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-between h-full w-full px-2.5 py-1.5 bg-transparent text-foreground overflow-hidden select-text">
      <div className="relative z-10 flex flex-col h-full w-full min-h-0 flex-1">
        <LayoutHeader title={title} />
        
        <main className="flex-1 w-full min-h-0 overflow-y-auto">
          <div className={`grid gap-6 w-full ${getColClass()}`}>
            {children}
          </div>
        </main>
      </div>

      <LayoutFooter footer={footer} />
    </div>
  );
};

export default GridLayout;
