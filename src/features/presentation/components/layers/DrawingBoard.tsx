import React, { useRef, useState, useEffect } from 'react';
import type { Point, DrawingStroke } from '../../types';

interface DrawingBoardProps {
  isActive: boolean;
  color: string;
  brushWidth: number;
  isEraser: boolean;
  lectureId: string;
  slideNo: number;
  clearTrigger: number;
}

const WIDTH = 980;
const ASPECT_RATIO = 16 / 9;
const HEIGHT = WIDTH / ASPECT_RATIO;

/**
 * DrawingBoard overlays a transparent drawing layer inside the slide canvas box.
 * Compulsively tracks stylus coordinates and saves drawings history per slide.
 */
export const DrawingBoard: React.FC<DrawingBoardProps> = ({
  isActive,
  color,
  brushWidth,
  isEraser,
  lectureId,
  slideNo,
  clearTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const currentPointsRef = useRef<Point[]>([]);

  const storageKey = `cee_drawings_${lectureId}_${slideNo}`;

  // Redraw all strokes on canvas
  const redraw = (canvas: HTMLCanvasElement, strokeList: DrawingStroke[]) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    strokeList.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.globalCompositeOperation = stroke.isEraser ? 'destination-out' : 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const start = stroke.points[0];
      if (start) {
        ctx.moveTo(start.x, start.y);
      }

      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        if (pt) {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.stroke();
    });
  };

  // Load and redraw strokes on slide changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const canvas = canvasRef.current;
    
    if (saved && canvas) {
      try {
        const parsedStrokes = JSON.parse(saved) as DrawingStroke[];
        setStrokes(parsedStrokes);
        redraw(canvas, parsedStrokes);
      } catch (err) {
        console.warn('Failed to parse saved drawings:', err);
      }
    } else if (canvas) {
      setStrokes([]);
      redraw(canvas, []);
    }
  }, [storageKey]);

  // Handle Clear trigger
  useEffect(() => {
    if (clearTrigger > 0) {
      localStorage.removeItem(storageKey);
      setStrokes([]);
      const canvas = canvasRef.current;
      if (canvas) {
        redraw(canvas, []);
      }
    }
  }, [clearTrigger, storageKey]);

  // Calculate adjusted drawing coordinates
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    // Scale factor compensation for responsive sizes
    const scale = rect.width / WIDTH || 1;

    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isActive || e.buttons !== 1) return;
    
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    currentPointsRef.current = [coords];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.beginPath();
      ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isActive) return;

    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (coords && canvas && ctx) {
      currentPointsRef.current.push(coords);
      
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const points = currentPointsRef.current;
    if (points.length >= 2) {
      const newStroke: DrawingStroke = {
        points,
        color,
        width: brushWidth,
        isEraser,
      };

      const updatedStrokes = [...strokes, newStroke];
      setStrokes(updatedStrokes);
      localStorage.setItem(storageKey, JSON.stringify(updatedStrokes));
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 25,
        width: '100%',
        height: '100%',
        pointerEvents: isActive ? 'auto' : 'none',
        touchAction: 'none',
      }}
      data-drawing-board
    />
  );
};

export default DrawingBoard;
