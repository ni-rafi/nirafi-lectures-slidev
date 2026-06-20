import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ISupport, IInternalRelease, SupportType, ReleaseType } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { ITargetSection, IMovingVehicle, IInfluenceTarget } from '../../../cores/influence-lines/influence-lines.interface';

export type ILDAnalysisType = 'reaction' | 'shear' | 'moment';
export type ILDMethod = 'equilibrium' | 'muller-breslau';

interface InfluenceLinesWorkspaceContextProps {
    length: number;
    supports: ISupport[];
    releases: IInternalRelease[];
    targetSection: ITargetSection;
    targetSupportX: number | null;
    analysisType: ILDAnalysisType;
    transitMethod: ILDMethod;
    activeVehicle: IMovingVehicle | null;
    transitPosition: number;
    selectedId: string | null;
    hoverX: number | null;
    targets: IInfluenceTarget[];
    activeTargetId: string;

    setLength: (len: number) => void;
    addSupport: (type: SupportType, position: number) => void;
    updateSupport: (id: string, updates: Partial<ISupport>) => void;
    deleteSupport: (id: string) => void;
    addRelease: (type: ReleaseType, position: number) => void;
    updateRelease: (id: string, updates: Partial<IInternalRelease>) => void;
    deleteRelease: (id: string) => void;
    setTargetSection: (sec: ITargetSection) => void;
    setTargetSupportX: (x: number | null) => void;
    setAnalysisType: (type: ILDAnalysisType) => void;
    setTransitMethod: (method: ILDMethod) => void;
    setActiveVehicle: (v: IMovingVehicle | null) => void;
    setTransitPosition: (pos: number) => void;
    setSelectedId: (id: string | null) => void;
    setHoverX: (x: number | null) => void;
    addTarget: (type: ILDAnalysisType) => void;
    deleteTarget: (id: string) => void;
    toggleTargetVisibility: (id: string) => void;
    setActiveTargetId: (id: string) => void;
}

export const InfluenceLinesWorkspaceContext = createContext<InfluenceLinesWorkspaceContextProps | undefined>(undefined);

export const InfluenceLinesWorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [length, setLengthState] = useState<number>(10);
    const [supports, setSupports] = useState<ISupport[]>([
        { id: 's1', type: 'hinge', position: 0 },
        { id: 's2', type: 'roller', position: 10 },
    ]);
    const [releases, setReleases] = useState<IInternalRelease[]>([]);
    const [transitMethod, setTransitMethod] = useState<ILDMethod>('equilibrium');
    const [activeVehicle, setActiveVehicle] = useState<IMovingVehicle | null>(null);
    const [transitPosition, setTransitPosition] = useState<number>(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [hoverX, setHoverX] = useState<number | null>(null);

    // Multiple targets management
    const [targets, setTargets] = useState<IInfluenceTarget[]>([
        { id: 'target_default', type: 'moment', targetSupportX: null, targetSection: { xc: 4, label: 'C' }, isVisible: true }
    ]);
    const [activeTargetId, setActiveTargetId] = useState<string>('target_default');

    const activeTarget = targets.find(t => t.id === activeTargetId) || targets[0] || {
        id: 'target_default',
        type: 'moment',
        targetSupportX: null,
        targetSection: { xc: 4, label: 'C' },
        isVisible: true
    };

    const analysisType = activeTarget.type;
    const targetSupportX = activeTarget.targetSupportX;
    const targetSection = activeTarget.targetSection;

    const setAnalysisType = (type: ILDAnalysisType) => {
        setTargets((prev) =>
            prev.map((t) => {
                if (t.id === activeTarget.id) {
                    const defaultSupportX = type === 'reaction' ? (supports.length > 0 ? supports[0]!.position : 0) : null;
                    const defaultSection = type !== 'reaction' ? { xc: length / 2, label: 'C' } : { xc: 0, label: 'C' };
                    return { ...t, type, targetSupportX: defaultSupportX, targetSection: defaultSection };
                }
                return t;
            })
        );
    };

    const setTargetSupportX = (x: number | null) => {
        setTargets((prev) =>
            prev.map((t) => (t.id === activeTarget.id ? { ...t, targetSupportX: x } : t))
        );
    };

    const setTargetSection = (sec: ITargetSection) => {
        setTargets((prev) =>
            prev.map((t) => (t.id === activeTarget.id ? { ...t, targetSection: sec } : t))
        );
    };

    const addTarget = (type: ILDAnalysisType) => {
        const defaultSupportX = type === 'reaction' ? (supports.length > 0 ? supports[0]!.position : 0) : null;
        const defaultSection = { xc: length / 2, label: 'C' };
        const newTarget: IInfluenceTarget = {
            id: `target_${Date.now()}`,
            type,
            targetSupportX: defaultSupportX,
            targetSection: defaultSection,
            isVisible: true,
        };
        setTargets((prev) => [...prev, newTarget]);
        setActiveTargetId(newTarget.id);
    };

    const deleteTarget = (id: string) => {
        setTargets((prev) => {
            const next = prev.filter((t) => t.id !== id);
            if (next.length === 0) {
                return [
                    { id: 'target_default', type: 'moment', targetSupportX: null, targetSection: { xc: length / 2, label: 'C' }, isVisible: true }
                ];
            }
            return next;
        });
        setActiveTargetId((prevActive) => {
            if (prevActive === id) {
                const remaining = targets.filter((t) => t.id !== id);
                return remaining.length > 0 ? remaining[0]!.id : 'target_default';
            }
            return prevActive;
        });
    };

    const toggleTargetVisibility = (id: string) => {
        setTargets((prev) =>
            prev.map((t) => (t.id === id ? { ...t, isVisible: !t.isVisible } : t))
        );
    };

    const setLength = (len: number) => {
        const newLen = Math.max(1, len);
        const scaleFactor = newLen / length;
        setLengthState(newLen);

        setSupports((prev) => prev.map((s) => ({
            ...s,
            position: parseFloat((s.position * scaleFactor).toFixed(2)),
        })));

        setReleases((prev) => prev.map((r) => ({
            ...r,
            position: parseFloat((r.position * scaleFactor).toFixed(2)),
        })));

        setTargets((prev) => prev.map((t) => ({
            ...t,
            targetSupportX: t.targetSupportX !== null ? parseFloat((t.targetSupportX * scaleFactor).toFixed(2)) : null,
            targetSection: {
                ...t.targetSection,
                xc: parseFloat((t.targetSection.xc * scaleFactor).toFixed(2))
            }
        })));
    };

    const addSupport = (type: SupportType, position: number) => {
        const newSupport: ISupport = {
            id: `support_${Date.now()}`,
            type,
            position: Math.max(0, Math.min(length, parseFloat(position.toFixed(2)))),
        };
        setSupports((prev) => [...prev, newSupport]);
    };

    const updateSupport = (id: string, updates: Partial<ISupport>) => {
        setSupports((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    };

    const deleteSupport = (id: string) => {
        setSupports((prev) => prev.filter((s) => s.id !== id));
    };

    const addRelease = (type: ReleaseType, position: number) => {
        const newRelease: IInternalRelease = {
            id: `release_${Date.now()}`,
            type,
            position: Math.max(0, Math.min(length, parseFloat(position.toFixed(2)))),
        };
        setReleases((prev) => [...prev, newRelease]);
    };

    const updateRelease = (id: string, updates: Partial<IInternalRelease>) => {
        setReleases((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    };

    const deleteRelease = (id: string) => {
        setReleases((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <InfluenceLinesWorkspaceContext.Provider
            value={{
                length,
                supports,
                releases,
                targetSection,
                targetSupportX,
                analysisType,
                transitMethod,
                activeVehicle,
                transitPosition,
                selectedId,
                hoverX,
                targets,
                activeTargetId,
                setLength,
                addSupport,
                updateSupport,
                deleteSupport,
                addRelease,
                updateRelease,
                deleteRelease,
                setTargetSection,
                setTargetSupportX,
                setAnalysisType,
                setTransitMethod,
                setActiveVehicle,
                setTransitPosition,
                setSelectedId,
                setHoverX,
                addTarget,
                deleteTarget,
                toggleTargetVisibility,
                setActiveTargetId,
            }}
        >
            {children}
        </InfluenceLinesWorkspaceContext.Provider>
    );
};

export const useInfluenceWorkspace = () => {
    const context = useContext(InfluenceLinesWorkspaceContext);
    if (!context) {
        throw new Error('useInfluenceWorkspace must be used within an InfluenceLinesWorkspaceProvider');
    }
    return context;
};
export default InfluenceLinesWorkspaceContext;
