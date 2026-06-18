import React from 'react';
import { Type } from 'lucide-react';

interface PlaygroundHeaderSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
  disabled?: boolean;
}

export const PlaygroundHeaderSizeSelector: React.FC<PlaygroundHeaderSizeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
        <Type className="h-3.5 w-3.5" /> Slide Header Font Size
      </span>
      <div className="flex flex-col gap-1.5 rounded-lg border p-3 bg-muted/20">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Header Font Size</span>
          <span className="font-mono">{value}px</span>
        </div>
        <input
          type="range"
          min="12"
          max="32"
          step="2"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="h-1 w-full bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-[8px] text-muted-foreground px-0.5">
          <span>Small (12px)</span>
          <span>Medium (20px)</span>
          <span>Large (32px)</span>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundHeaderSizeSelector;
