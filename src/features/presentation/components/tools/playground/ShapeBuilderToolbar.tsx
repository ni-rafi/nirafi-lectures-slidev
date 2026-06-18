import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Square, Circle, Type } from 'lucide-react';
import { VisualCanvasShape } from '../../../types/schema';

interface ShapeBuilderToolbarProps {
  onAddElement: (type: VisualCanvasShape['type']) => void;
}

const TOOLBAR_TYPES = [
  'rect',
  'circle',
  'triangle',
  'rhombus',
  'star',
  'hexagon',
  'arrow',
  'text',
  'polygon',
] as const;

export const ShapeBuilderToolbar: React.FC<ShapeBuilderToolbarProps> = ({ onAddElement }) => {
  return (
    <div className="w-48 border-r border-border bg-card p-4 space-y-4 select-none flex flex-col justify-start shrink-0">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
        <Layers className="h-3 w-3 text-primary" /> Shapes
      </div>
      <div className="grid grid-cols-2 gap-2">
        {TOOLBAR_TYPES.map((t) => (
          <Button
            key={t}
            variant="outline"
            size="xs"
            onClick={() => onAddElement(t)}
            className="h-10 text-[10px] flex flex-col justify-center items-center gap-1 border-border/60 hover:border-primary/50 hover:bg-primary/5 capitalize text-foreground font-medium"
          >
            {t === 'rect' ? (
              <Square className="h-3 w-3 text-primary" />
            ) : t === 'circle' ? (
              <Circle className="h-3 w-3 text-primary" />
            ) : t === 'polygon' ? (
              <Layers className="h-3 w-3 text-primary" />
            ) : (
              <Type className="h-3 w-3 text-primary" />
            )}
            {t}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ShapeBuilderToolbar;
