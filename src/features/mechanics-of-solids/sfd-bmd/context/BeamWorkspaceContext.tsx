import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ISupport, IInternalRelease, ILoad, SupportType, ReleaseType, LoadType } from '@/cores/mechanics-of-solids/sfd-bmd/types';
import { IEISegment } from '@/cores/mechanics-of-solids/deflection/types';
import { useSupportsState } from '../hooks/workspace/useSupportsState';
import { useReleasesState } from '../hooks/workspace/useReleasesState';
import { useLoadsState } from '../hooks/workspace/useLoadsState';
import { useEISegmentsState } from '../hooks/workspace/useEISegmentsState';

interface BeamWorkspaceContextProps {
  length: number;
  supports: ISupport[];
  releases: IInternalRelease[];
  loads: ILoad[];
  eiSegments: IEISegment[];
  deflMethod: 'double-integration' | 'moment-area' | 'conjugate-beam';
  customInspectX: number | null;
  selectedId: string | null;
  hoverX: number | null;
  setLength: (len: number) => void;
  addSupport: (type: SupportType, position: number) => void;
  updateSupport: (id: string, updates: Partial<ISupport>) => void;
  deleteSupport: (id: string) => void;
  addRelease: (type: ReleaseType, position: number) => void;
  updateRelease: (id: string, updates: Partial<IInternalRelease>) => void;
  deleteRelease: (id: string) => void;
  addLoad: (type: LoadType, position: number) => void;
  updateLoad: (id: string, updates: Partial<ILoad>) => void;
  deleteLoad: (id: string) => void;
  splitEISegment: (id?: string | null) => void;
  updateEISegment: (id: string, updates: Partial<IEISegment>) => void;
  deleteEISegment: (id: string) => void;
  setDeflMethod: (method: 'double-integration' | 'moment-area' | 'conjugate-beam') => void;
  setCustomInspectX: (x: number | null) => void;
  setSelectedId: (id: string | null) => void;
  setHoverX: (x: number | null) => void;
  inspectY: number;
  setInspectY: (y: number) => void;
  inspectAngle: number;
  setInspectAngle: (angle: number) => void;
  isSectionBuilderOpen: boolean;
  setIsSectionBuilderOpen: (open: boolean) => void;
}

const BeamWorkspaceContext = createContext<BeamWorkspaceContextProps | undefined>(undefined);

export const BeamWorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [length, setLengthState] = useState<number>(6);
  const [deflMethod, setDeflMethod] = useState<'double-integration' | 'moment-area' | 'conjugate-beam'>('double-integration');
  const [customInspectX, setCustomInspectX] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [inspectY, setInspectY] = useState<number>(0);
  const [inspectAngle, setInspectAngle] = useState<number>(0);
  const [isSectionBuilderOpen, setIsSectionBuilderOpen] = useState<boolean>(false);

  const { supports, setSupports, addSupport, updateSupport, deleteSupport } = useSupportsState(length, selectedId, setSelectedId);
  const { releases, setReleases, addRelease, updateRelease, deleteRelease } = useReleasesState(length, selectedId, setSelectedId);
  const { loads, setLoads, addLoad, updateLoad, deleteLoad } = useLoadsState(length, selectedId, setSelectedId);
  const { eiSegments, setEISegments, splitEISegment, updateEISegment, deleteEISegment } = useEISegmentsState(length, selectedId, setSelectedId);

  const setLength = (len: number) => {
    const newLen = Math.max(1, len);
    const scaleFactor = newLen / length;
    setLengthState(newLen);

    setSupports(prev => prev.map(s => ({
      ...s,
      position: parseFloat((s.position * scaleFactor).toFixed(2))
    })));
    
    setReleases(prev => prev.map(r => ({
      ...r,
      position: parseFloat((r.position * scaleFactor).toFixed(2))
    })));

    setLoads(prev => prev.map(l => {
      const updates = { ...l };
      if (l.position !== undefined) {
        updates.position = parseFloat((l.position * scaleFactor).toFixed(2));
      }
      if (l.startPosition !== undefined) {
        updates.startPosition = parseFloat((l.startPosition * scaleFactor).toFixed(2));
      }
      if (l.endPosition !== undefined) {
        updates.endPosition = parseFloat((l.endPosition * scaleFactor).toFixed(2));
      }
      return updates;
    }));

    setEISegments(prev => {
      const scaled = prev.map(s => ({
        ...s,
        startPosition: parseFloat((s.startPosition * scaleFactor).toFixed(2)),
        endPosition: parseFloat((s.endPosition * scaleFactor).toFixed(2))
      }));
      scaled.sort((a, b) => a.startPosition - b.startPosition);
      scaled[0]!.startPosition = 0;
      for (let i = 0; i < scaled.length - 1; i++) {
        scaled[i + 1]!.startPosition = scaled[i]!.endPosition;
      }
      scaled[scaled.length - 1]!.endPosition = newLen;
      return scaled;
    });

    setCustomInspectX(prev => prev !== null ? parseFloat((prev * scaleFactor).toFixed(2)) : null);
  };

  return (
    <BeamWorkspaceContext.Provider
      value={{
        length,
        supports,
        releases,
        loads,
        eiSegments,
        deflMethod,
        customInspectX,
        selectedId,
        hoverX,
        setLength,
        addSupport,
        updateSupport,
        deleteSupport,
        addRelease,
        updateRelease,
        deleteRelease,
        addLoad,
        updateLoad,
        deleteLoad,
        splitEISegment,
        updateEISegment,
        deleteEISegment,
        setDeflMethod,
        setCustomInspectX,
        setSelectedId,
        setHoverX,
        inspectY,
        setInspectY,
        inspectAngle,
        setInspectAngle,
        isSectionBuilderOpen,
        setIsSectionBuilderOpen,
      }}
    >
      {children}
    </BeamWorkspaceContext.Provider>
  );
};

export const useBeamWorkspace = () => {
  const context = useContext(BeamWorkspaceContext);
  if (!context) {
    throw new Error('useBeamWorkspace must be used within a BeamWorkspaceProvider');
  }
  return context;
};
