import React from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SlideNavigationProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * SlideNavigation renders the slide switching group and current index indicator.
 */
export const SlideNavigation: React.FC<SlideNavigationProps> = ({
  current,
  total,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex items-center gap-1 select-none">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
        title="Return to Portal"
      >
        <Link to="/">
          <Home className="h-4 w-4" />
        </Link>
      </Button>

      <div className="h-4 w-px bg-border mx-0.5" />

      <Button
        variant="ghost"
        size="icon"
        disabled={current <= 1}
        onClick={onPrev}
        className="h-8 w-8 rounded-full disabled:opacity-30"
        title="Previous Slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="min-w-[45px] text-center font-mono text-xs font-semibold text-foreground/80">
        {current} / {total}
      </span>

      <Button
        variant="ghost"
        size="icon"
        disabled={current >= total}
        onClick={onNext}
        className="h-8 w-8 rounded-full disabled:opacity-30"
        title="Next Slide"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SlideNavigation;
