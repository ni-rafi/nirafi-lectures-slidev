import React, { useContext } from 'react';
import { PresentationContext } from '../../features/presentation/context/PresentationContext';
import LayoutHeader from './components/LayoutHeader';
import LayoutFooter from './components/LayoutFooter';

interface FullWidthLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
  bgVariant?: 'default' | 'calculation' | 'gallery';
  footer?: React.ReactNode;
}

/**
 * FullWidthLayout gives 90% of screen width to content, making it perfect
 * for displaying large code compilers, spreadsheets, or charts.
 */
export const FullWidthLayout: React.FC<FullWidthLayoutProps> = ({
  title,
  children,
  footer,
}) => {
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';

  if (viewMode === 'scroll') {
    return (
      <div className="relative flex flex-col w-full bg-transparent select-text text-foreground animate-in fade-in duration-200 min-h-[200px] justify-between">
        <div>
          <LayoutHeader title={title} />
          <main className="w-full">
            {children}
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
          {children}
        </main>
      </div>
      
      <LayoutFooter footer={footer} />
    </div>
  );
};

export default FullWidthLayout;
