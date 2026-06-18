import React from 'react';
import { Input } from '@/components/ui/input';
import { VisualCanvasShape } from '../../../types/schema';

interface ShapeBuilderInspectorColorsProps {
  selectedEl: VisualCanvasShape;
  onUpdateSelected: (key: keyof VisualCanvasShape, val: any) => void;
}

export const ShapeBuilderInspectorColors: React.FC<ShapeBuilderInspectorColorsProps> = ({
  selectedEl,
  onUpdateSelected,
}) => {
  return (
    <div className="border-t border-border pt-3 space-y-2">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        Colors & Stroke
      </span>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-semibold text-muted-foreground uppercase">Fill</span>
          <Input
            type="text"
            value={selectedEl.fill || ''}
            onChange={(e) => onUpdateSelected('fill', e.target.value)}
            className="h-8 text-[10px] text-primary bg-background border-input font-mono font-semibold"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-semibold text-muted-foreground uppercase">Stroke</span>
          <Input
            type="text"
            value={selectedEl.stroke || ''}
            onChange={(e) => onUpdateSelected('stroke', e.target.value)}
            className="h-8 text-[10px] text-primary bg-background border-input font-mono font-semibold"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[8px] font-semibold text-muted-foreground uppercase">
          Stroke Width ({selectedEl.strokeWidth}px)
        </span>
        <input
          type="range"
          min={0.5}
          max={8}
          step={0.5}
          value={selectedEl.strokeWidth || 1.5}
          onChange={(e) => onUpdateSelected('strokeWidth', parseFloat(e.target.value))}
          className="w-full accent-primary cursor-pointer animate-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[8px] font-semibold text-muted-foreground uppercase">
          Rotation ({selectedEl.rotate || 0}°)
        </span>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={selectedEl.rotate || 0}
          onChange={(e) => onUpdateSelected('rotate', parseInt(e.target.value))}
          className="w-full accent-primary cursor-pointer animate-none"
        />
      </div>
    </div>
  );
};

export default ShapeBuilderInspectorColors;
