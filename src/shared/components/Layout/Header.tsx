import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ColorSchemeSelector } from '../ColorSchemeSelector';
import { ThemeToggle } from '../ThemeToggle';

/**
 * Header renders the top navbar including breadcrumbs, sidebar trigger, and theme adjusters.
 */
export const Header: React.FC = () => {
  const { subjectId, lectureId, slideNo } = useParams<{
    subjectId?: string;
    lectureId?: string;
    slideNo?: string;
  }>();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Workspace
          </Link>
          {subjectId && (
            <>
              <span className="mx-2 font-mono text-[10px]">&gt;</span>
              <span className="uppercase text-foreground font-semibold">
                {subjectId.replace('-', ' ')}
              </span>
            </>
          )}
          {lectureId && (
            <>
              <span className="mx-2 font-mono text-[10px]">&gt;</span>
              <span className="truncate max-w-[120px] sm:max-w-[200px] text-foreground">
                {lectureId.replace('-', ' ')}
              </span>
            </>
          )}
          {slideNo && (
            <>
              <span className="mx-2 font-mono text-[10px]">&gt;</span>
              <span className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                Slide {slideNo}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-1.5">
        <ColorSchemeSelector />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
