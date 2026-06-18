import React from 'react';
import { Input } from '@/components/ui/input';
import { VisualCanvasShape } from '../../../types/schema';

interface ShapeBuilderInspectorGeneralProps {
  selectedEl: VisualCanvasShape;
  onUpdateSelected: (key: keyof VisualCanvasShape, val: any) => void;
}

export const ShapeBuilderInspectorGeneral: React.FC<ShapeBuilderInspectorGeneralProps> = ({
  selectedEl,
  onUpdateSelected,
}) => {
  return (
    <div className="space-y-4">
      {/* Label Text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Label Text
        </label>
        <Input
          type="text"
          value={selectedEl.label || ''}
          onChange={(e) => onUpdateSelected('label', e.target.value)}
          className="h-9 text-xs text-primary bg-background border-input font-medium"
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Enter Step
          </label>
          <Input
            type="number"
            min={1}
            value={selectedEl.enterAt}
            onChange={(e) => onUpdateSelected('enterAt', parseInt(e.target.value) || 1)}
            className="h-9 text-xs text-primary bg-background border-input font-mono font-semibold"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Exit Step
          </label>
          <Input
            type="number"
            value={selectedEl.exitAt || ''}
            onChange={(e) =>
              onUpdateSelected('exitAt', e.target.value ? parseInt(e.target.value) : undefined)
            }
            placeholder="Never"
            className="h-9 text-xs text-primary bg-background border-input font-mono font-semibold"
          />
        </div>
      </div>

      {/* Animation */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Animation Preset
        </label>
        <select
          value={selectedEl.animation || 'none'}
          onChange={(e) => onUpdateSelected('animation', e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs text-primary focus:ring-1 focus:ring-ring outline-none transition-colors"
        >
          <option value="none" className="bg-popover text-foreground">None</option>
          <option value="fade" className="bg-popover text-foreground">Fade In</option>
          <option value="scale" className="bg-popover text-foreground">Scale Up</option>
        </select>
      </div>
    </div>
  );
};

export default ShapeBuilderInspectorGeneral;
