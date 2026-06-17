import React from 'react';
import {
  MousePointer,
  Pencil,
  Eraser,
  Minus,
  ArrowUpRight,
  Square,
  Circle as CircleIcon,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ToolType = 'select' | 'pencil' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle';

interface DrawingDrawerProps {
  penColor: string;
  onPenColorChange: (color: string) => void;
  penWidth: number;
  onPenWidthChange: (width: number) => void;
  activeTool: ToolType;
  onActiveToolChange: (tool: ToolType) => void;
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
 * DrawingDrawer renders a floating tool tray for vector annotations and shapes.
 */
export const DrawingDrawer: React.FC<DrawingDrawerProps> = ({
  penColor,
  onPenColorChange,
  penWidth,
  onPenWidthChange,
  activeTool,
  onActiveToolChange,
  onClearDrawing,
}) => {

  return (
    <div className="flex items-center gap-2 rounded-full border bg-background/90 px-3.5 py-1.5 shadow-md backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200 select-none">
      {/* Interaction Mode Tools */}
      <div className="flex items-center gap-0.5">
        {/* Select Tool */}
        <Button
          variant={activeTool === 'select' ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => onActiveToolChange('select')}
          title="Select & Move (V)"
        >
          <MousePointer className="h-3.5 w-3.5" />
        </Button>

        {/* Freehand Pencil Tool */}
        <Button
          variant={activeTool === 'pencil' ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => onActiveToolChange('pencil')}
          title="Pencil Draw (P)"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>

        {/* Eraser Tool */}
        <Button
          variant={activeTool === 'eraser' ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => onActiveToolChange('eraser')}
          title="Stroke Eraser (E)"
        >
          <Eraser className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Vector Shape Tools */}
      <div className="flex items-center gap-0.5">
        {/* Straight Line */}
        <Button
          variant={activeTool === 'line' ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => onActiveToolChange('line')}
          title="Line Shape (L)"
        >
          <Minus className="h-3.5 w-3.5 rotate-45" />
        </Button>

        {/* Arrow pointer */}
        <Button
          variant={activeTool === 'arrow' ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => onActiveToolChange('arrow')}
          title="Arrow Indicator (A)"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>

        {/* Rectangle */}
        <Button
          variant={activeTool === 'rect' ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => onActiveToolChange('rect')}
          title="Rectangle Shape (R)"
        >
          <Square className="h-3.5 w-3.5" />
        </Button>

        {/* Circle */}
        <Button
          variant={activeTool === 'circle' ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => onActiveToolChange('circle')}
          title="Circle Shape (C)"
        >
          <CircleIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Color Selectors */}
      <div className="flex items-center gap-1.5 px-1">
        {COLORS.map((col) => {
          const isSelected = penColor === col.value && activeTool !== 'eraser' && activeTool !== 'select';
          return (
            <button
              key={col.value}
              type="button"
              style={{ backgroundColor: col.value.includes('rgba') ? '#eab308' : col.value }}
              onClick={() => {
                if (activeTool === 'eraser' || activeTool === 'select') {
                  onActiveToolChange('pencil');
                }
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

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Brush sizes selector */}
      <div className="flex items-center gap-0.5">
        {BRUSH_SIZES.map((sz) => {
          const isSelected = penWidth === sz.value;
          return (
            <Button
              key={sz.value}
              variant={isSelected ? 'secondary' : 'ghost'}
              className="h-6 w-6 rounded-full text-[9px] p-0 font-bold text-muted-foreground hover:text-foreground"
              onClick={() => onPenWidthChange(sz.value)}
              title={`Brush Size: ${sz.name}`}
            >
              {sz.name}
            </Button>
          );
        })}
      </div>

      <div className="h-4 w-px bg-border mx-0.5" />

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
