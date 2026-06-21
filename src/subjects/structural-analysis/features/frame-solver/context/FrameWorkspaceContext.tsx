import React, { createContext, useContext, useState, ReactNode } from 'react';
import { INode, IMember, IFrameSupport, IFrameLoad, FrameSupportType, FrameLoadDirection } from '../types/frame';

export type WorkspaceMode = 'select' | 'draw-member' | 'add-support' | 'add-load';

interface FrameWorkspaceContextProps {
  nodes: INode[];
  members: IMember[];
  supports: IFrameSupport[];
  loads: IFrameLoad[];
  activeMode: WorkspaceMode;
  selectedSupportType: FrameSupportType;
  selectedLoadType: 'point' | 'moment' | 'udl';
  selectedLoadDirection: FrameLoadDirection;
  selectedElementId: string | null;
  gridSpacing: number;
  snapToGrid: boolean;
  
  setNodes: React.Dispatch<React.SetStateAction<INode[]>>;
  setMembers: React.Dispatch<React.SetStateAction<IMember[]>>;
  setSupports: React.Dispatch<React.SetStateAction<IFrameSupport[]>>;
  setLoads: React.Dispatch<React.SetStateAction<IFrameLoad[]>>;
  setActiveMode: (mode: WorkspaceMode) => void;
  setSelectedSupportType: (type: FrameSupportType) => void;
  setSelectedLoadType: (type: 'point' | 'moment' | 'udl') => void;
  setSelectedLoadDirection: (dir: FrameLoadDirection) => void;
  setSelectedElementId: (id: string | null) => void;
  setGridSpacing: (spacing: number) => void;
  setSnapToGrid: (snap: boolean) => void;
  
  addNode: (x: number, y: number) => INode;
  deleteNode: (id: string) => void;
  addMember: (startNodeId: string, endNodeId: string) => IMember | null;
  deleteMember: (id: string) => void;
  addSupport: (nodeId: string, type: FrameSupportType) => IFrameSupport;
  updateSupport: (id: string, updates: Partial<IFrameSupport>) => void;
  deleteSupport: (id: string) => void;
  addLoad: (load: Omit<IFrameLoad, 'id'>) => IFrameLoad;
  updateLoad: (id: string, updates: Partial<IFrameLoad>) => void;
  deleteLoad: (id: string) => void;
  deleteElement: (id: string) => void;
  clearWorkspace: () => void;
}

export const FrameWorkspaceContext = createContext<FrameWorkspaceContextProps | undefined>(undefined);

export const FrameWorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<INode[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [supports, setSupports] = useState<IFrameSupport[]>([]);
  const [loads, setLoads] = useState<IFrameLoad[]>([]);
  const [activeMode, setActiveMode] = useState<WorkspaceMode>('select');
  const [selectedSupportType, setSelectedSupportType] = useState<FrameSupportType>('hinge');
  const [selectedLoadType, setSelectedLoadType] = useState<'point' | 'moment' | 'udl'>('point');
  const [selectedLoadDirection, setSelectedLoadDirection] = useState<FrameLoadDirection>('global-vertical');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [gridSpacing, setGridSpacing] = useState<number>(0.5);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);

  const addNode = (x: number, y: number): INode => {
    const existing = nodes.find(n => Math.abs(n.x - x) < 0.01 && Math.abs(n.y - y) < 0.01);
    if (existing) return existing;
    
    const newNode: INode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2))
    };
    setNodes(prev => [...prev, newNode]);
    return newNode;
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setMembers(prev => prev.filter(m => m.startNodeId !== id && m.endNodeId !== id));
    setSupports(prev => prev.filter(s => s.nodeId !== id));
    setLoads(prev => prev.filter(l => l.nodeId !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const addMember = (startNodeId: string, endNodeId: string): IMember | null => {
    if (startNodeId === endNodeId) return null;
    
    const existing = members.find(
      m => (m.startNodeId === startNodeId && m.endNodeId === endNodeId) ||
           (m.startNodeId === endNodeId && m.endNodeId === startNodeId)
    );
    if (existing) return existing;

    const newMember: IMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startNodeId,
      endNodeId,
      E: 200,
      I: 100,
      A: 5000,
      releases: { start: false, end: false }
    };
    setMembers(prev => [...prev, newMember]);
    return newMember;
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setLoads(prev => prev.filter(l => l.memberId !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const addSupport = (nodeId: string, type: FrameSupportType): IFrameSupport => {
    // Filter out existing support on this node
    setSupports(prev => prev.filter(s => s.nodeId !== nodeId));
    
    const newSupport: IFrameSupport = {
      id: `support_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nodeId,
      type,
      angle: 0
    };
    setSupports(prev => [...prev, newSupport]);
    return newSupport;
  };

  const updateSupport = (id: string, updates: Partial<IFrameSupport>) => {
    setSupports(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSupport = (id: string) => {
    setSupports(prev => prev.filter(s => s.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const addLoad = (load: Omit<IFrameLoad, 'id'>): IFrameLoad => {
    const newLoad: IFrameLoad = {
      ...load,
      id: `load_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setLoads(prev => [...prev, newLoad]);
    return newLoad;
  };

  const updateLoad = (id: string, updates: Partial<IFrameLoad>) => {
    setLoads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLoad = (id: string) => {
    setLoads(prev => prev.filter(l => l.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const deleteElement = (id: string) => {
    if (id.startsWith('node_')) {
      deleteNode(id);
    } else if (id.startsWith('member_')) {
      deleteMember(id);
    } else if (id.startsWith('support_')) {
      deleteSupport(id);
    } else if (id.startsWith('load_')) {
      deleteLoad(id);
    }
  };

  const clearWorkspace = () => {
    setNodes([]);
    setMembers([]);
    setSupports([]);
    setLoads([]);
    setSelectedElementId(null);
    setActiveMode('select');
  };

  return (
    <FrameWorkspaceContext.Provider
      value={{
        nodes,
        members,
        supports,
        loads,
        activeMode,
        selectedSupportType,
        selectedLoadType,
        selectedLoadDirection,
        selectedElementId,
        gridSpacing,
        snapToGrid,
        
        setNodes,
        setMembers,
        setSupports,
        setLoads,
        setActiveMode,
        setSelectedSupportType,
        setSelectedLoadType,
        setSelectedLoadDirection,
        setSelectedElementId,
        setGridSpacing,
        setSnapToGrid,
        
        addNode,
        deleteNode,
        addMember,
        deleteMember,
        addSupport,
        updateSupport,
        deleteSupport,
        addLoad,
        updateLoad,
        deleteLoad,
        deleteElement,
        clearWorkspace
      }}
    >
      {children}
    </FrameWorkspaceContext.Provider>
  );
};

export const useFrameWorkspace = () => {
  const context = useContext(FrameWorkspaceContext);
  if (!context) {
    throw new Error('useFrameWorkspace must be used within a FrameWorkspaceProvider');
  }
  return context;
};
