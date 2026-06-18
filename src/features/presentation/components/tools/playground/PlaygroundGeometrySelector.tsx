import React from 'react';
import { Sliders } from 'lucide-react';

interface PlaygroundGeometrySelectorProps {
  value: number;
  onChange: (radius: number) => void;
  disabled?: boolean;
}

export const PlaygroundGeometrySelector: React.FC<PlaygroundGeometrySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
        <Sliders className="h-3.5 w-3.5" /> Geometry Card Radius
      </span>
      <div className="flex flex-col gap-1.5 rounded-lg border p-3 bg-muted/20">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Border Radius</span>
          <span className="font-mono">{value}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="24"
          step="4"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="h-1 w-full bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-[8px] text-muted-foreground px-0.5">
          <span>Sharp (0px)</span>
          <span>Subtle (8px)</span>
          <span>Rounded (16px)</span>
          <span>Pill (24px)</span>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundGeometrySelector;
