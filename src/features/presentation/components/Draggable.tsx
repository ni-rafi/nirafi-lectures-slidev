import React, { useState, useEffect, useRef, useId } from 'react';

export interface DragPosition {
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
}

interface DraggableProps {
  children: React.ReactNode;
  initialPos?: DragPosition;
  onPositionChange?: (pos: DragPosition) => void;
  className?: string;
}

/**
 * Draggable wraps content in an absolute box that users can drag across the canvas.
 * Accommodates slide scale transformations and supports keyboard arrow nudges.
 */
export const Draggable: React.FC<DraggableProps> = ({
  children,
  initialPos = { x: 50, y: 50, w: 200, h: 100, rotate: 0 },
  onPositionChange,
  className = '',
}) => {
  const containerId = useId();
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<DragPosition>(initialPos);
  const [isSelected, setIsSelected] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

  // Sync position state if prop changes
  useEffect(() => {
    setPos(initialPos);
  }, [initialPos]);

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click
    if (e.button !== 0) return;
    e.stopPropagation();

    // Select the component
    setIsSelected(true);

    // Compute the scale factor of the slide canvas container
    let scale = 1;
    const canvasElement = ref.current?.closest('[data-slide-canvas]') as HTMLElement;
    if (canvasElement) {
      scale = canvasElement.getBoundingClientRect().width / canvasElement.offsetWidth || 1;
    }

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const deltaX = (moveEvent.clientX - dragStartRef.current.mouseX) / scale;
      const deltaY = (moveEvent.clientY - dragStartRef.current.mouseY) / scale;

      const newPos: DragPosition = {
        ...pos,
        x: Math.round(dragStartRef.current.startX + deltaX),
        y: Math.round(dragStartRef.current.startY + deltaY),
      };

      setPos(newPos);
      onPositionChange?.(newPos);
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Keyboard nudging controls when selected
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 1;
      let moved = false;
      const newPos = { ...pos };

      if (e.key === 'ArrowRight') {
        newPos.x += step;
        moved = true;
      } else if (e.key === 'ArrowLeft') {
        newPos.x -= step;
        moved = true;
      } else if (e.key === 'ArrowDown') {
        newPos.y += step;
        moved = true;
      } else if (e.key === 'ArrowUp') {
        newPos.y -= step;
        moved = true;
      } else if (e.key === 'Escape') {
        setIsSelected(false);
      }

      if (moved) {
        e.preventDefault();
        setPos(newPos);
        onPositionChange?.(newPos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected, pos, onPositionChange]);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${pos.x}px`,
    top: `${pos.y}px`,
    width: pos.w ? `${pos.w}px` : 'auto',
    height: pos.h ? `${pos.h}px` : 'auto',
    transform: pos.rotate ? `rotate(${pos.rotate}deg)` : undefined,
    cursor: 'move',
  };

  return (
    <div
      ref={ref}
      style={style}
      onMouseDown={handleMouseDown}
      className={`group select-none ${
        isSelected ? 'ring-2 ring-primary ring-offset-2 rounded-lg' : ''
      } ${className}`}
      data-draggable={containerId}
    >
      {children}
    </div>
  );
};

export default Draggable;
