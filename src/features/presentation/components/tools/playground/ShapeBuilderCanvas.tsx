import React, { useRef } from 'react';
import { SlideVisualCanvas } from '../../elements/SlideVisualCanvas';
import { Draggable } from '../../interactive/Draggable';
import { ClickStepsProvider } from '../../../context/ClickStepsContext';
import { Input } from '@/components/ui/input';
import { VisualCanvasShape, PhysicalUnit } from '../../../types/schema';
import { useSlideScale } from '../../../hooks/useSlideScale';

interface PlaygroundCanvasContainerProps {
  children: React.ReactNode;
}

const PlaygroundCanvasContainer: React.FC<PlaygroundCanvasContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scale = useSlideScale(containerRef, { width: 980, aspectRatio: 16 / 9 }, 1);

  const canvasStyle: React.CSSProperties = {
    width: '980px',
    height: '551.25px',
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    flexShrink: 0,
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent p-0"
    >
      <div
        style={canvasStyle}
        data-playground-canvas
        className="relative bg-background text-foreground overflow-hidden flex flex-col justify-between select-none"
      >
        {children}
      </div>
    </div>
  );
};

interface ShapeBuilderCanvasProps {
  elements: VisualCanvasShape[];
  scaleFactor: { pixelsPerUnit: number; unit: PhysicalUnit };
  selectedId: string | null;
  simulatedClick: number;
  activePopover: {
    elementId: string;
    key: 'length' | 'height' | 'diameter' | 'diagonal1' | 'diagonal2';
    val: number;
    clientX: number;
    clientY: number;
  } | null;
  onElementsChange: (els: VisualCanvasShape[]) => void;
  onSelectedIdChange: (id: string | null) => void;
  onLabelClick: (
    elId: string,
    key: 'length' | 'height' | 'diameter' | 'diagonal1' | 'diagonal2',
    val: number,
    clientX: number,
    clientY: number
  ) => void;
  onSubmitPopoverValue: (val: number) => void;
  onClosePopover: () => void;
}

export const ShapeBuilderCanvas: React.FC<ShapeBuilderCanvasProps> = ({
  elements,
  scaleFactor,
  selectedId,
  simulatedClick,
  activePopover,
  onElementsChange,
  onSelectedIdChange,
  onLabelClick,
  onSubmitPopoverValue,
  onClosePopover,
}) => {
  const handleCornerDragStart = (
    e: React.MouseEvent,
    el: VisualCanvasShape,
    ptIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = el.points ? el.points[ptIndex]?.x ?? 0 : 0;
    const startY = el.points ? el.points[ptIndex]?.y ?? 0 : 0;
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    let scale = 1;
    const canvasElement = e.currentTarget.closest('[data-playground-canvas]') as HTMLElement;
    if (canvasElement) {
      scale = canvasElement.getBoundingClientRect().width / canvasElement.offsetWidth || 1;
    } else {
      const containerElement = document.querySelector('[data-slide-viewer]') || document.querySelector('.relative.bg-background.text-foreground');
      if (containerElement) {
        scale = containerElement.getBoundingClientRect().width / 980 || 1;
      }
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startMouseX) / scale;
      const deltaY = (moveEvent.clientY - startMouseY) / scale;

      const newX = Math.round(startX + deltaX);
      const newY = Math.round(startY + deltaY);

      if (!el.points) return;
      const updatedPoints = el.points.map((p, idx) =>
        idx === ptIndex ? { x: newX, y: newY } : p
      );

      // Normalize points to maintain positive bounding box coordinates
      const minX = Math.min(...updatedPoints.map((p) => p.x));
      const minY = Math.min(...updatedPoints.map((p) => p.y));
      const maxX = Math.max(...updatedPoints.map((p) => p.x));
      const maxY = Math.max(...updatedPoints.map((p) => p.y));

      const normalizedPoints = updatedPoints.map((p) => ({
        x: p.x - minX,
        y: p.y - minY,
      }));

      onElementsChange(
        elements.map((item) => {
          if (item.id !== el.id) return item;
          
          const newW = Math.max(10, maxX - minX);
          const newH = Math.max(10, maxY - minY);
          const pxPerUnit = scaleFactor.pixelsPerUnit;
          
          const physicalLength = parseFloat((newW / pxPerUnit).toFixed(3));
          const physicalHeight = parseFloat((newH / pxPerUnit).toFixed(3));
          
          return {
            ...item,
            x: item.x + minX,
            y: item.y + minY,
            w: newW,
            h: newH,
            points: normalizedPoints,
            dimensions: item.dimensions ? {
              ...item.dimensions,
              length: physicalLength,
              height: physicalHeight,
            } : {
              length: physicalLength,
              height: physicalHeight,
            }
          };
        })
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex-1 bg-background p-6 flex items-center justify-center relative overflow-hidden">
      <div className="relative w-full h-full border border-border rounded-2xl bg-card/50 shadow-2xl overflow-hidden flex items-center justify-center">
        <ClickStepsProvider currentClickOverride={simulatedClick}>
          <PlaygroundCanvasContainer>
            {/* Shapes & Dimensions rendering */}
            <SlideVisualCanvas
              elements={elements}
              scaleFactor={scaleFactor}
              editable={true}
              onLabelClick={onLabelClick}
              showLayoutBodyBorder={true}
            />

            {/* Draggable overlays layer */}
            <div className="absolute inset-0 z-40 pointer-events-auto">
              {elements.map((el) => (
                <Draggable
                  key={el.id}
                  initialPos={{ x: el.x, y: el.y, w: el.w, h: el.h, rotate: el.rotate }}
                  onPositionChange={(pos) => {
                    onElementsChange(
                      elements.map((item) =>
                        item.id === el.id
                          ? {
                              ...item,
                              x: pos.x,
                              y: pos.y,
                              w: pos.w || item.w,
                              h: pos.h || item.h,
                              rotate: pos.rotate,
                              // If polygon has points, dragging as a whole doesn't change relative points coordinates
                            }
                          : item
                      )
                    );
                  }}
                  className={`${
                    selectedId === el.id
                      ? 'ring-2 ring-primary ring-offset-1 ring-offset-background'
                      : 'hover:ring-1 hover:ring-foreground/20'
                  }`}
                >
                  <div
                    onMouseDown={() => onSelectedIdChange(el.id)}
                    style={{ width: el.w, height: el.h }}
                    className="w-full h-full cursor-move"
                  />
                </Draggable>
              ))}
            </div>

            {/* Corner handle controls overlay for selected polygon */}
            {(() => {
              const selectedEl = elements.find((el) => el.id === selectedId);
              if (!selectedEl || selectedEl.type !== 'polygon' || !selectedEl.points) return null;
              
              return (
                <div className="absolute inset-0 z-50 pointer-events-none">
                  {selectedEl.points.map((pt, idx) => {
                    const px = selectedEl.x + pt.x;
                    const py = selectedEl.y + pt.y;
                    
                    return (
                      <div
                        key={idx}
                        style={{
                          position: 'absolute',
                          left: `${px}px`,
                          top: `${py}px`,
                          transform: 'translate(-50%, -50%)',
                          width: '12px',
                          height: '12px',
                        }}
                        className="pointer-events-auto cursor-crosshair rounded-full border-2 border-primary bg-background shadow-lg hover:scale-125 transition-transform"
                        onMouseDown={(e) => handleCornerDragStart(e, selectedEl, idx)}
                        title={`Drag corner ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              );
            })()}
          </PlaygroundCanvasContainer>
        </ClickStepsProvider>
      </div>

      {/* Dimension Value Edit popover */}
      {activePopover && (
        <div
          style={{
            position: 'fixed',
            left: activePopover.clientX,
            top: activePopover.clientY - 40,
            transform: 'translateX(-50%)',
          }}
          className="z-50 bg-popover border border-border p-2 rounded-lg shadow-2xl backdrop-blur flex gap-1.5 items-center animate-in zoom-in-95 duration-100 text-popover-foreground"
        >
          <Input
            type="number"
            step="0.05"
            defaultValue={activePopover.val}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSubmitPopoverValue(parseFloat(e.currentTarget.value) || 0);
              } else if (e.key === 'Escape') {
                onClosePopover();
              }
            }}
            className="w-16 h-8 text-center text-primary font-mono bg-background border-input font-bold"
          />
          <span className="text-[10px] text-muted-foreground font-mono">{scaleFactor.unit}</span>
        </div>
      )}
    </div>
  );
};

export default ShapeBuilderCanvas;
