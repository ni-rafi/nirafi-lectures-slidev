import React, { useState, useRef } from 'react';
import { ISupport, IInternalRelease } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { ITargetSection } from '../../../cores/influence-lines/influence-lines.interface';

interface DragState {
    id: string;
    type: 'support' | 'release' | 'targetSection';
    startX: number;
    startPos: number;
}

interface UseInfluenceDraggingProps {
    length: number;
    beamW: number;
    toMeter: (pixel: number) => number;
    setSelectedId: (id: string | null) => void;
    updateSupport: (id: string, updates: Partial<ISupport>) => void;
    updateRelease: (id: string, updates: Partial<IInternalRelease>) => void;
    updateTargetSection: (sec: ITargetSection) => void;
    setHoverX: (x: number | null) => void;
    svgRef: React.RefObject<SVGSVGElement | null>;
}

export function useInfluenceDragging({
    length,
    beamW,
    toMeter,
    setSelectedId,
    updateSupport,
    updateRelease,
    updateTargetSection,
    setHoverX,
    svgRef,
}: UseInfluenceDraggingProps) {
    const [dragState, setDragState] = useState<DragState | null>(null);
    const wasDraggingRef = useRef<boolean>(false);

    const handleMouseDown = (
        e: React.MouseEvent,
        id: string,
        type: 'support' | 'release' | 'targetSection',
        pos: number
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
        } else if (dragState.type === 'targetSection') {
            updateTargetSection({ xc: newPos, label: 'C' });
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
export default useInfluenceDragging;
