import { useState } from 'react';
import { IInternalRelease, ReleaseType } from '@/cores/mechanics-of-solids/sfd-bmd/types';

export const useReleasesState = (
  length: number,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void
) => {
  const [releases, setReleases] = useState<IInternalRelease[]>([]);

  const addRelease = (type: ReleaseType, position: number) => {
    const id = `release-${Date.now()}`;
    setReleases(prev => [...prev, { id, type, position: Math.min(Math.max(0, position), length) }]);
    setSelectedId(id);
  };

  const updateRelease = (id: string, updates: Partial<IInternalRelease>) => {
    setReleases(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...updates };
      if (updated.position !== undefined) {
        updated.position = Math.min(Math.max(0, updated.position), length);
      }
      return updated;
    }));
  };

  const deleteRelease = (id: string) => {
    setReleases(prev => prev.filter(r => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return { releases, setReleases, addRelease, updateRelease, deleteRelease };
};
