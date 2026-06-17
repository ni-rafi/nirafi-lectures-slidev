import React from 'react';
import { ColorSchemeSelector } from './ColorSchemeSelector';
import { ThemeToggle } from './ThemeToggle';

/**
 * AppHeader renders the global header bar, providing theme switches and branding badges.
 */
export const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center justify-between px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <span className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] font-bold rounded">
            CE
          </span>
          <span className="text-sm font-bold tracking-tight">
            Lectures Portal
          </span>
        </div>

        {/* Global Layout Actions */}
        <div className="flex items-center gap-1.5">
          <ColorSchemeSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
