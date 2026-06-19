import React, { useContext } from 'react';
import { PresentationContext } from '../../features/presentation/context/PresentationContext';
import LayoutHeader from './components/LayoutHeader';
import LayoutFooter from './components/LayoutFooter';

interface TwoColumnLayoutProps {
  title: React.ReactNode;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftWidth?: string; // e.g. "40%" or "60%"
  bgVariant?: 'default' | 'calculation' | 'gallery';
  footer?: React.ReactNode;
}

/**
 * TwoColumnLayout handles side-by-side structures, dividing screen width
 * into resizable left and right content panels.
 */
export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  title,
  leftContent,
  rightContent,
  leftWidth = '50%',
  footer,
}) => {
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';
  const rightWidth = `calc(100% - ${leftWidth})`;

  if (viewMode === 'blog') {
    return (
      <div className="w-full flex flex-col gap-6 text-left">
        <section className="left-column w-full">
          {leftContent}
        </section>
        <section className="right-column w-full border-t pt-6 border-border/40">
          {rightContent}
        </section>
      </div>
    );
  }

  if (viewMode === 'scroll') {
    return (
      <div className="relative flex flex-col w-full bg-transparent select-text text-foreground min-h-[200px] justify-between">
        <div>
          <LayoutHeader title={title} />
          <main className="flex flex-col md:flex-row gap-6 w-full items-start">
            <section className="left-column w-full text-left">
              {leftContent}
            </section>
            <section className="right-column w-full text-left border-t pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-border/40">
              {rightContent}
            </section>
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
        
        <main className="flex flex-1 gap-6 w-full min-h-0 items-start">
          <section 
            style={{ width: leftWidth }} 
            className="left-column h-full flex flex-col justify-start text-left overflow-y-auto pl-1 pr-2 transition-all duration-500"
          >
            {leftContent}
          </section>
          <section 
            style={{ width: rightWidth }} 
            className="right-column h-full flex flex-col justify-start text-left overflow-y-auto pl-4 pr-1 border-l border-border/40 transition-all duration-500"
          >
            {rightContent}
          </section>
        </main>
      </div>

      <LayoutFooter footer={footer} />
    </div>
  );
};

export default TwoColumnLayout;
