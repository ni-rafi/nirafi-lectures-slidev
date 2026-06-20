import { useState } from 'react';
import { ISupport, SupportType } from '@/cores/mechanics-of-solids/sfd-bmd/types';

export const useSupportsState = (
  length: number,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void
) => {
  const [supports, setSupports] = useState<ISupport[]>([
    { id: 's-hinge', type: 'hinge', position: 0 },
    { id: 's-roller', type: 'roller', position: length },
  ]);

  const addSupport = (type: SupportType, position: number) => {
    const id = `support-${Date.now()}`;
    setSupports(prev => [...prev, { id, type, position: Math.min(Math.max(0, position), length) }]);
    setSelectedId(id);
  };

  const updateSupport = (id: string, updates: Partial<ISupport>) => {
    setSupports(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, ...updates };
      if (updated.position !== undefined) {
        updated.position = Math.min(Math.max(0, updated.position), length);
      }
      return updated;
    }));
  };

  const deleteSupport = (id: string) => {
    setSupports(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return { supports, setSupports, addSupport, updateSupport, deleteSupport };
};
