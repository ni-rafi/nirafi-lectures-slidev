import React from 'react';
import { Button } from '@/components/ui/button';
import { Sliders, Trash2 } from 'lucide-react';
import { VisualCanvasShape, PhysicalUnit } from '../../../types/schema';

// Import subcomponents
import ShapeBuilderInspectorGeneral from './ShapeBuilderInspectorGeneral';
import ShapeBuilderInspectorDimensions from './ShapeBuilderInspectorDimensions';
import ShapeBuilderInspectorColors from './ShapeBuilderInspectorColors';

interface ShapeBuilderInspectorProps {
  selectedEl: VisualCanvasShape | null;
  scaleFactor: { pixelsPerUnit: number; unit: PhysicalUnit };
  exportSchema: string;
  onUpdateSelected: (key: keyof VisualCanvasShape, val: any) => void;
  onUpdateSelectedDimensions: (dimKey: string, val: number) => void;
  onDeleteSelected: () => void;
}

export const ShapeBuilderInspector: React.FC<ShapeBuilderInspectorProps> = ({
  selectedEl,
  scaleFactor,
  exportSchema,
  onUpdateSelected,
  onUpdateSelectedDimensions,
  onDeleteSelected,
}) => {
  return (
    <div className="w-80 border-l border-border bg-card flex flex-col select-none shrink-0 text-foreground">
      <div className="border-b border-border px-5 py-3 font-bold text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 shrink-0">
        <Sliders className="h-3 w-3 text-primary" /> Properties
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {selectedEl ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">
                {selectedEl.type} Element
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={onDeleteSelected}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <ShapeBuilderInspectorGeneral
              selectedEl={selectedEl}
              onUpdateSelected={onUpdateSelected}
            />

            <ShapeBuilderInspectorDimensions
              selectedEl={selectedEl}
              scaleFactor={scaleFactor}
              onUpdateSelected={onUpdateSelected}
              onUpdateSelectedDimensions={onUpdateSelectedDimensions}
            />

            <ShapeBuilderInspectorColors
              selectedEl={selectedEl}
              onUpdateSelected={onUpdateSelected}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground italic select-none">
            Select a shape on the canvas to inspect and edit its properties.
          </div>
        )}
      </div>

      {/* JSON Console View */}
      <div className="h-52 border-t border-border bg-background flex flex-col p-4 shrink-0">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
          JSON Output
        </span>
        <textarea
          readOnly
          value={exportSchema}
          className="flex-1 w-full bg-card border border-border rounded text-[9px] font-mono text-primary p-2.5 resize-none focus:outline-none"
        />
      </div>
    </div>
  );
};

export default ShapeBuilderInspector;
