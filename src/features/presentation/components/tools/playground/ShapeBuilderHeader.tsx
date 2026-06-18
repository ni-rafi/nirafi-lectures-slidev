import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Copy } from 'lucide-react';
import { PhysicalUnit } from '../../../types/schema';

interface ShapeBuilderHeaderProps {
  scaleFactor: { pixelsPerUnit: number; unit: PhysicalUnit };
  onScaleFactorChange: (sf: { pixelsPerUnit: number; unit: PhysicalUnit }) => void;
  simulatedClick: number;
  onSimulatedClickChange: (click: number) => void;
  onCopy: () => void;
}

export const ShapeBuilderHeader: React.FC<ShapeBuilderHeaderProps> = ({
  scaleFactor,
  onScaleFactorChange,
  simulatedClick,
  onSimulatedClickChange,
  onCopy,
}) => {
  return (
    <div className="border-b border-border px-6 py-3 bg-card flex justify-between items-center select-none shrink-0">
      <span className="flex items-center gap-2 font-bold text-sm text-foreground">
        <Sparkles className="h-4 w-4 text-primary" /> Slide Visual Designer
      </span>

      <div className="flex gap-6 items-center">
        {/* Scale & Units */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold uppercase">Scale:</span>
          <Input
            type="number"
            value={scaleFactor.pixelsPerUnit}
            onChange={(e) =>
              onScaleFactorChange({
                ...scaleFactor,
                pixelsPerUnit: Math.max(1, parseInt(e.target.value) || 100),
              })
            }
            className="w-16 h-8 text-center text-primary font-mono bg-background border-input"
          />
          <select
            value={scaleFactor.unit}
            onChange={(e) =>
              onScaleFactorChange({
                ...scaleFactor,
                unit: e.target.value as PhysicalUnit,
              })
            }
            className="h-8 rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-primary transition-colors focus:ring-1 focus:ring-ring outline-none"
          >
            <option value="m">meters (m)</option>
            <option value="cm">centimeters (cm)</option>
            <option value="mm">millimeters (mm)</option>
          </select>
        </div>

        {/* Step Slider */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold uppercase">Step Preview:</span>
          <input
            type="range"
            min={0}
            max={6}
            value={simulatedClick}
            onChange={(e) => onSimulatedClickChange(parseInt(e.target.value))}
            className="w-24 accent-primary cursor-pointer"
          />
          <span className="font-bold bg-background border border-border px-2 py-0.5 rounded text-primary font-mono">
            {simulatedClick}
          </span>
        </div>
      </div>

      <Button
        size="sm"
        onClick={onCopy}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs flex gap-1 items-center"
      >
        <Copy className="h-3.5 w-3.5" /> Copy Config Schema
      </Button>
    </div>
  );
};

export default ShapeBuilderHeader;
