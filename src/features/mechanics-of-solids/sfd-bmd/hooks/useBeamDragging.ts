import React, { useState, useRef } from 'react';
import { ISupport, IInternalRelease, ILoad } from '@/cores/mechanics-of-solids/sfd-bmd/types';

interface DragState {
  id: string;
  type: 'support' | 'release' | 'load';
  startX: number;
  startPos: number;
  startEndPos?: number;
}

interface UseBeamDraggingProps {
  length: number;
  loads: ILoad[];
  beamW: number;
  toMeter: (pixel: number) => number;
  setSelectedId: (id: string | null) => void;
  updateSupport: (id: string, updates: Partial<ISupport>) => void;
  updateRelease: (id: string, updates: Partial<IInternalRelease>) => void;
  updateLoad: (id: string, updates: Partial<ILoad>) => void;
  setHoverX: (x: number | null) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function useBeamDragging({
  length,
  loads,
  beamW,
  toMeter,
  setSelectedId,
  updateSupport,
  updateRelease,
  updateLoad,
  setHoverX,
  svgRef,
}: UseBeamDraggingProps) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const wasDraggingRef = useRef<boolean>(false);

  const handleMouseDown = (
    e: React.MouseEvent,
    id: string,
    type: 'support' | 'release' | 'load',
    pos: number,
    endPos?: number
  ) => {
    e.stopPropagation();
    wasDraggingRef.current = false;
    setSelectedId(id);
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    setDragState({
      id,
      type,
      startX: clickX,
      startPos: pos,
      startEndPos: endPos,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const xMeter = Math.max(0, Math.min(length, toMeter(currentX)));

    if (!dragState) {
      setHoverX(xMeter);
      return;
    }

    wasDraggingRef.current = true;
    const deltaX = currentX - dragState.startX;
    const deltaM = (deltaX / beamW) * length;
    const newPos = Math.max(0, Math.min(length, parseFloat((dragState.startPos + deltaM).toFixed(2))));
    setHoverX(newPos);

    if (dragState.type === 'support') {
      updateSupport(dragState.id, { position: newPos });
    } else if (dragState.type === 'release') {
      updateRelease(dragState.id, { position: newPos });
    } else if (dragState.type === 'load') {
      const load = loads.find(l => l.id === dragState.id);
      if (!load) return;

      if (load.type === 'point' || load.type === 'moment') {
        updateLoad(dragState.id, { position: newPos });
      } else if (load.type === 'udl' || load.type === 'uvl') {
        const span = (dragState.startEndPos ?? 0) - dragState.startPos;
        let sPos = newPos;
        let ePos = sPos + span;
        if (ePos > length) {
          ePos = length;
          sPos = ePos - span;
        }
        updateLoad(dragState.id, {
          startPosition: parseFloat(sPos.toFixed(2)),
          endPosition: parseFloat(ePos.toFixed(2)),
        });
      }
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
    setHoverX(null);
  };

  const handleMouseLeave = () => {
    setDragState(null);
    setHoverX(null);
  };

  return {
    dragState,
    wasDraggingRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
}
