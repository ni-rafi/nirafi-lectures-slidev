import React from 'react';
import { Eraser, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrawingDrawerProps {
  penColor: string;
  onPenColorChange: (color: string) => void;
  penWidth: number;
  onPenWidthChange: (width: number) => void;
  isEraser: boolean;
  onEraserChange: (eraser: boolean) => void;
  onClearDrawing: () => void;
}

const COLORS = [
  { value: '#ef4444', name: 'Red' },
  { value: '#22c55e', name: 'Green' },
  { value: '#3b82f6', name: 'Blue' },
  { value: 'rgba(234, 179, 8, 0.4)', name: 'Highlight' },
];

const BRUSH_SIZES = [
  { value: 3, name: 'S' },
  { value: 6, name: 'M' },
  { value: 12, name: 'L' },
];

/**
 * DrawingDrawer renders a floating color and brush tray for annotation tools.
 */
export const DrawingDrawer: React.FC<DrawingDrawerProps> = ({
  penColor,
  onPenColorChange,
  penWidth,
  onPenWidthChange,
  isEraser,
  onEraserChange,
  onClearDrawing,
}) => {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-background/90 px-3.5 py-1.5 shadow-md backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200 select-none">
      {/* Color select buttons */}
      <div className="flex items-center gap-1.5">
        {COLORS.map((col) => {
          const isSelected = penColor === col.value && !isEraser;
          return (
            <button
              key={col.value}
              type="button"
              style={{ backgroundColor: col.value.includes('rgba') ? '#eab308' : col.value }}
              onClick={() => {
                onEraserChange(false);
                onPenColorChange(col.value);
              }}
              className={`h-4 w-4 rounded-full border transition-all hover:scale-110 ${
                isSelected ? 'ring-2 ring-primary ring-offset-1 scale-105' : 'border-muted'
              }`}
              title={col.name}
            />
          );
        })}
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Brush sizes selector */}
      <div className="flex items-center gap-1">
        {BRUSH_SIZES.map((sz) => {
          const isSelected = penWidth === sz.value;
          return (
            <Button
              key={sz.value}
              variant={isSelected ? 'secondary' : 'ghost'}
              className="h-6 w-6 rounded-full text-[9px] p-0 font-bold"
              onClick={() => onPenWidthChange(sz.value)}
              title={`Size: ${sz.name}`}
            >
              {sz.name}
            </Button>
          );
        })}
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Eraser */}
      <Button
        variant={isEraser ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
        onClick={() => onEraserChange(!isEraser)}
        title="Toggle Eraser"
      >
        <Eraser className="h-3.5 w-3.5" />
      </Button>

      {/* Clear Board */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={onClearDrawing}
        title="Clear Drawing Board"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default DrawingDrawer;
