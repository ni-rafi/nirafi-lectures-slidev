import { useState } from 'react';
import { IEISegment } from '@/cores/mechanics-of-solids/deflection/types';

export const useEISegmentsState = (
  length: number,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void
) => {
  const [eiSegments, setEISegments] = useState<IEISegment[]>([
    { id: 'ei-default', startPosition: 0, endPosition: length, E: 200, I: 100 }
  ]);

  const splitEISegment = (id?: string | null) => {
    let target: IEISegment | undefined;
    if (id) {
      target = eiSegments.find(s => s.id === id);
    } else if (selectedId) {
      target = eiSegments.find(s => s.id === selectedId);
    }

    if (!target) {
      const midPoint = length / 2;
      target = eiSegments.find(s => midPoint >= s.startPosition && midPoint <= s.endPosition);
    }

    if (!target) return;

    const currentWidth = target.endPosition - target.startPosition;
    if (currentWidth < 0.15) {
      alert("This segment is too small to split (minimum width is 0.15m).");
      return;
    }

    const mid = (target.startPosition + target.endPosition) / 2;
    const newId = `ei-${Date.now()}`;

    setEISegments(prev => {
      const idx = prev.findIndex(s => s.id === target!.id);
      if (idx === -1) return prev;

      const targetSeg = prev[idx]!;
      const s1: IEISegment = { ...targetSeg, endPosition: mid };
      const s2: IEISegment = {
        id: newId,
        startPosition: mid,
        endPosition: targetSeg.endPosition,
        E: targetSeg.E,
        I: targetSeg.I,
        shape: targetSeg.shape ? { ...targetSeg.shape } : undefined,
      };

      const next = [...prev];
      next.splice(idx, 1, s1, s2);
      return next;
    });

    setSelectedId(newId);
  };

  const updateEISegment = (id: string, updates: Partial<IEISegment>) => {
    setEISegments(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : { ...s });

      if (updates.startPosition !== undefined && idx > 0) {
        const prevSeg = next[idx - 1];
        if (prevSeg) prevSeg.endPosition = updates.startPosition;
      }

      if (updates.endPosition !== undefined && idx < next.length - 1) {
        const nextSeg = next[idx + 1];
        if (nextSeg) nextSeg.startPosition = updates.endPosition;
      }

      next.sort((a, b) => a.startPosition - b.startPosition);
      next[0]!.startPosition = 0;
      
      for (let i = 0; i < next.length - 1; i++) {
        next[i + 1]!.startPosition = next[i]!.endPosition;
      }
      next[next.length - 1]!.endPosition = length;
      
      return next;
    });
  };

  const deleteEISegment = (id: string) => {
    setEISegments(prev => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      
      const next = prev.filter(s => s.id !== id);
      next.sort((a, b) => a.startPosition - b.startPosition);
      next[0]!.startPosition = 0;
      
      for (let i = 0; i < next.length - 1; i++) {
        next[i + 1]!.startPosition = next[i]!.endPosition;
      }
      next[next.length - 1]!.endPosition = length;
      
      if (selectedId === id) setSelectedId(null);
      return next;
    });
  };

  return { eiSegments, setEISegments, splitEISegment, updateEISegment, deleteEISegment };
};
