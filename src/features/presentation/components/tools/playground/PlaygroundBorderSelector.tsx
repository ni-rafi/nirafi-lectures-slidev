import React from 'react';
import { Sliders } from 'lucide-react';

interface PlaygroundBorderSelectorProps {
  value: 'all' | 'left' | 'top';
  onChange: (side: 'all' | 'left' | 'top') => void;
  disabled?: boolean;
}

export const PlaygroundBorderSelector: React.FC<PlaygroundBorderSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
        <Sliders className="h-3.5 w-3.5" /> Slide Canvas Borders
      </span>
      <div className="flex flex-col gap-2.5 rounded-lg border p-3 bg-muted/20">
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-accent/40 p-0.5">
          {(['all', 'left', 'top'] as const).map((side) => (
            <button
              key={side}
              type="button"
              disabled={disabled}
              onClick={() => onChange(side)}
              className={`rounded-md py-1 text-[10px] text-center font-medium capitalize transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                value === side
                  ? 'bg-background shadow-sm text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {side === 'all' ? 'All Sides' : side === 'left' ? 'Left Edge' : 'Top Edge'}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-muted-foreground leading-normal mt-0.5">
          Selecting Left or Top edges displays a thicker corporate border on that side and removes standard frame rounding.
        </p>
      </div>
    </div>
  );
};

export default PlaygroundBorderSelector;
