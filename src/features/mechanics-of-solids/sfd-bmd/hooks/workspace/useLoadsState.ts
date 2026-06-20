import { useState } from 'react';
import { ILoad, LoadType } from '@/cores/mechanics-of-solids/sfd-bmd/types';

export const useLoadsState = (
  length: number,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void
) => {
  const [loads, setLoads] = useState<ILoad[]>([
    { id: 'l-point', type: 'point', position: 3, magnitude: 10 },
  ]);

  const addLoad = (type: LoadType, position: number) => {
    const id = `load-${Date.now()}`;
    const p = Math.min(Math.max(0, position), length);
    const newLoad: ILoad = { id, type };
    if (type === 'point' || type === 'moment') {
      newLoad.position = p;
      newLoad.magnitude = type === 'point' ? 10 : 5;
    } else {
      newLoad.startPosition = p;
      newLoad.endPosition = Math.min(p + 2, length);
      if (type === 'udl') {
        newLoad.magnitude = 4;
      } else {
        newLoad.startMagnitude = 0;
        newLoad.endMagnitude = 6;
      }
    }
    setLoads(prev => [...prev, newLoad]);
    setSelectedId(id);
  };

  const updateLoad = (id: string, updates: Partial<ILoad>) => {
    setLoads(prev => prev.map(l => {
      if (l.id !== id) return l;
      const updated = { ...l, ...updates };
      if (updated.position !== undefined) {
        updated.position = Math.min(Math.max(0, updated.position), length);
      }
      if (updated.startPosition !== undefined) {
        updated.startPosition = Math.min(Math.max(0, updated.startPosition), length);
      }
      if (updated.endPosition !== undefined) {
        updated.endPosition = Math.min(Math.max(0, updated.endPosition), length);
      }
      return updated;
    }));
  };

  const deleteLoad = (id: string) => {
    setLoads(prev => prev.filter(l => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return { loads, setLoads, addLoad, updateLoad, deleteLoad };
};
