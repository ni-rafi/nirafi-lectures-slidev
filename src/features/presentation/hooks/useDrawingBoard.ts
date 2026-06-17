import { useRef, useState, useEffect } from 'react';
import type { Point, VectorElement, VectorElementType } from '../types';
import { getStrokePolygon, PointWithPressure } from '../utils/stroke';

interface UseDrawingBoardProps {
  isActive: boolean;
  color: string;
  brushWidth: number;
  activeTool: VectorElementType | 'select' | 'eraser';
  lectureId: string;
  slideNo: number;
  clearTrigger: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

const WIDTH = 980;
const HEIGHT = 551.25;

export const useDrawingBoard = ({
  isActive,
  color,
  brushWidth,
  activeTool,
  lectureId,
  slideNo,
  clearTrigger,
  svgRef,
}: UseDrawingBoardProps) => {
  const [elements, setElements] = useState<VectorElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<VectorElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [dragStart, setDragStart] = useState<{
    elementId: string;
    startTranslate: Point;
    pointerStart: Point;
  } | null>(null);

  const rawPointsRef = useRef<PointWithPressure[]>([]);
  const lastTimeRef = useRef<number>(0);
  const lastPressureRef = useRef<number>(0.5);

  const storageKey = `cee_drawings_${lectureId}_${slideNo}`;

  // Sync elements with localStorage on mount / slide changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setElements(JSON.parse(saved) as VectorElement[]);
      } catch {
        setElements([]);
      }
    } else {
      setElements([]);
    }
    setSelectedId(null);
  }, [storageKey]);

  // Sync with other windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        setElements(e.newValue ? (JSON.parse(e.newValue) as VectorElement[]) : []);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [storageKey]);

  // Handle Clear trigger
  useEffect(() => {
    if (clearTrigger > 0) {
      localStorage.removeItem(storageKey);
      setElements([]);
      setSelectedId(null);
    }
  }, [clearTrigger, storageKey]);

  // Key listeners to delete elements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTool === 'select' && selectedId && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        setElements((prev) => {
          const next = prev.filter((el) => el.id !== selectedId);
          localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool, selectedId, storageKey]);

  const getCoordinates = (e: React.PointerEvent): Point | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * HEIGHT,
    };
  };

  const eraseAtPointer = (clientX: number, clientY: number) => {
    const target = document.elementFromPoint(clientX, clientY);
    if (target) {
      const elId = target.getAttribute('data-element-id') || target.closest('[data-element-id]')?.getAttribute('data-element-id');
      if (elId) {
        setElements((prev) => {
          const next = prev.filter((el) => el.id !== elId);
          localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
        if (selectedId === elId) setSelectedId(null);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isActive || e.buttons !== 1) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    if (activeTool === 'eraser') {
      setIsDrawing(true);
      eraseAtPointer(e.clientX, e.clientY);
    } else if (activeTool !== 'select') {
      setIsDrawing(true);
      e.currentTarget.setPointerCapture(e.pointerId);

      if (activeTool === 'pencil') {
        const firstPoint: PointWithPressure = { ...coords, pressure: 0.5 };
        rawPointsRef.current = [firstPoint];
        lastTimeRef.current = Date.now();
        lastPressureRef.current = 0.5;

        setCurrentElement({
          id: crypto.randomUUID(),
          type: 'pencil',
          points: [firstPoint],
          color,
          strokeWidth: brushWidth,
          translate: { x: 0, y: 0 },
        });
      } else {
        setCurrentElement({
          id: crypto.randomUUID(),
          type: activeTool as VectorElementType,
          points: [coords, coords],
          color,
          strokeWidth: brushWidth,
          translate: { x: 0, y: 0 },
        });
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const coords = getCoordinates(e);
    if (!coords) return;

    if (activeTool === 'select' && dragStart) {
      const dx = coords.x - dragStart.pointerStart.x;
      const dy = coords.y - dragStart.pointerStart.y;
      setElements((prev) =>
        prev.map((el) =>
          el.id === dragStart.elementId
            ? { ...el, translate: { x: dragStart.startTranslate.x + dx, y: dragStart.startTranslate.y + dy } }
            : el
        )
      );
    } else if (isDrawing && activeTool === 'eraser') {
      eraseAtPointer(e.clientX, e.clientY);
    } else if (isDrawing && currentElement) {
      if (activeTool === 'pencil') {
        const now = Date.now();
        const dt = now - lastTimeRef.current;
        const prevPt = rawPointsRef.current[rawPointsRef.current.length - 1]!;
        const dist = Math.sqrt((coords.x - prevPt.x) ** 2 + (coords.y - prevPt.y) ** 2);
        
        let pressure = 0.5;
        if (e.pointerType === 'pen') {
          pressure = e.pressure || 0.5;
        } else {
          const speed = dist / Math.max(1, dt);
          const targetPressure = Math.max(0.1, 1.0 - Math.min(0.9, speed / 2.0));
          pressure = lastPressureRef.current * 0.7 + targetPressure * 0.3;
        }

        lastTimeRef.current = now;
        lastPressureRef.current = pressure;

        const nextPoint: PointWithPressure = { ...coords, pressure };
        rawPointsRef.current.push(nextPoint);
        const outline = getStrokePolygon(rawPointsRef.current, brushWidth);

        setCurrentElement((prev) => prev ? { ...prev, points: outline } : null);
      } else {
        setCurrentElement((prev) => prev ? { ...prev, points: [prev.points[0]!, coords] } : null);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragStart) {
      setDragStart(null);
      localStorage.setItem(storageKey, JSON.stringify(elements));
    } else if (isDrawing) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDrawing(false);
      if (currentElement && currentElement.points.length >= 2) {
        const updated = [...elements, currentElement];
        setElements(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      setCurrentElement(null);
    }
  };

  const handleElementDown = (e: React.PointerEvent, el: VectorElement) => {
    if (activeTool === 'select') {
      e.stopPropagation();
      setSelectedId(el.id);
      const startPt = getCoordinates(e);
      if (startPt) {
        setDragStart({ elementId: el.id, startTranslate: { ...el.translate }, pointerStart: startPt });
      }
    } else if (activeTool === 'eraser') {
      e.stopPropagation();
      setElements((prev) => {
        const next = prev.filter((item) => item.id !== el.id);
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
      if (selectedId === el.id) setSelectedId(null);
    }
  };

  return {
    elements,
    setElements,
    isDrawing,
    currentElement,
    selectedId,
    setSelectedId,
    getCoordinates,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleElementDown,
  };
};
