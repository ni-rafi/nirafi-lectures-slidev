import { Eraser, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrawingToolbarProps {
  isActive: boolean;
  onActiveChange: (active: boolean) => void;
  color: string;
  onColorChange: (color: string) => void;
  brushWidth: number;
  onBrushWidthChange: (width: number) => void;
  isEraser: boolean;
  onEraserChange: (eraser: boolean) => void;
  onClear: () => void;
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
 * DrawingToolbar renders a floating panel overlay to toggle pen tools,
 * color options, line thicknesses, eraser modes, and clearing actions.
 */
export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  isActive,
  onActiveChange,
  color,
  onColorChange,
  brushWidth,
  onBrushWidthChange,
  isEraser,
  onEraserChange,
  onClear,
}) => {
  return (
    <div
      className="absolute bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-background/80 px-4 py-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-background/95 select-none"
      data-drawing-toolbar
    >
      {/* Toggle Pen Mode Active state */}
      <Button
        variant={isActive && !isEraser ? 'default' : 'ghost'}
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => {
          onEraserChange(false);
          onActiveChange(!isActive);
        }}
        title="Toggle Draw Pen"
      >
        {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>

      {isActive && (
        <>
          <div className="h-4 w-px bg-border mx-1" />

          {/* Color Selection Buttons */}
          <div className="flex items-center gap-1.5">
            {COLORS.map((col) => {
              const isSelected = color === col.value && !isEraser;
              return (
                <button
                  key={col.value}
                  type="button"
                  style={{ backgroundColor: col.value.includes('rgba') ? '#eab308' : col.value }}
                  onClick={() => {
                    onEraserChange(false);
                    onColorChange(col.value);
                  }}
                  className={`h-5 w-5 rounded-full border transition-all duration-200 hover:scale-110 ${
                    isSelected ? 'ring-2 ring-primary ring-offset-1 scale-105' : 'border-muted'
                  }`}
                  title={col.name}
                />
              );
            })}
          </div>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Brush Sizes */}
          <div className="flex items-center gap-1">
            {BRUSH_SIZES.map((sz) => {
              const isSelected = brushWidth === sz.value;
              return (
                <Button
                  key={sz.value}
                  variant={isSelected ? 'secondary' : 'ghost'}
                  className="h-7 w-7 rounded-full text-[10px] p-0 font-bold"
                  onClick={() => onBrushWidthChange(sz.value)}
                  title={`Brush size: ${sz.name}`}
                >
                  {sz.name}
                </Button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Toggle Eraser Mode */}
          <Button
            variant={isEraser ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onEraserChange(!isEraser)}
            title="Toggle Eraser"
          >
            <Eraser className="h-4 w-4" />
          </Button>

          {/* Clear board button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onClear}
            title="Clear Drawing Board"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default DrawingToolbar;
