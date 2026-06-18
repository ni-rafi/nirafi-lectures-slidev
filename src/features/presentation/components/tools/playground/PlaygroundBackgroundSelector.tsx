import React from 'react';
import { Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PlaygroundBackgroundSelectorProps {
  bgType: 'solid' | 'gradient' | 'custom';
  customBgValue: string;
  onBgTypeChange: (type: 'solid' | 'gradient' | 'custom') => void;
  onCustomBgValueChange: (val: string) => void;
  disabled?: boolean;
}

export const PlaygroundBackgroundSelector: React.FC<PlaygroundBackgroundSelectorProps> = ({
  bgType,
  customBgValue,
  onBgTypeChange,
  onCustomBgValueChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
        <Palette className="h-3.5 w-3.5" /> Slide Background Style
      </span>
      <div className="flex flex-col gap-2.5 rounded-lg border p-3 bg-muted/20">
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-accent/40 p-0.5">
          {(['solid', 'gradient', 'custom'] as const).map((type) => (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onBgTypeChange(type)}
              className={`rounded-md py-1 text-center font-medium capitalize transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                bgType === type
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Custom hex/gradient value input */}
        {bgType === 'custom' && (
          <div className="flex flex-col gap-1 bg-background p-2 rounded-md border border-dashed">
            <label className="text-[9px] font-bold text-muted-foreground uppercase">Custom Color / CSS Gradient</label>
            <Input
              type="text"
              placeholder="e.g. #3b82f6 or linear-gradient(...)"
              value={customBgValue}
              disabled={disabled}
              onChange={(e) => onCustomBgValueChange(e.target.value)}
              className="h-7 text-xs bg-background mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaygroundBackgroundSelector;
