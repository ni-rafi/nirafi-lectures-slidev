import React from 'react';
import { useInfluenceWorkspace } from '../../context/InfluenceLinesWorkspaceContext';
import { Trash2, Plus, Eye, EyeOff } from 'lucide-react';

export const ILManager: React.FC = () => {
    const {
        supports,
        targets,
        activeTargetId,
        setActiveTargetId,
        addTarget,
        deleteTarget,
        toggleTargetVisibility,
    } = useInfluenceWorkspace();

    // Assign letters A, B, C... to supports sorted by position for labeling reactions
    const sortedSupports = [...supports].sort((a, b) => a.position - b.position);
    const supportIdToLetter = new Map<string, string>();
    const supportPosToLetter = new Map<number, string>();

    sortedSupports.forEach((s, idx) => {
        const letter = String.fromCharCode(65 + idx);
        supportIdToLetter.set(s.id, letter);
        supportPosToLetter.set(s.position, letter);
    });

    const renderTargetName = (t: typeof targets[0]) => {
        if (t.type === 'reaction') {
            const pos = t.targetSupportX ?? 0;
            const letter = supportPosToLetter.get(pos) || '?';
            return (
                <span>
                    Reaction R<sub>{letter}</sub> ({pos.toFixed(2)}m)
                </span>
            );
        }
        const xc = t.targetSection.xc;
        if (t.type === 'shear') {
            return (
                <span>
                    Shear V<sub>c</sub> ({xc.toFixed(2)}m)
                </span>
            );
        }
        return (
            <span>
                Moment M<sub>c</sub> ({xc.toFixed(2)}m)
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-5 backdrop-blur-md">
            <div className="border-b border-border/40 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Influence Line Manager</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Select a diagram to edit in detail; toggle visibility to stack them</p>
            </div>

            {/* List of Added Targets */}
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {targets.map((t) => {
                    const isActive = t.id === activeTargetId;

                    return (
                        <div
                            key={t.id}
                            onClick={() => setActiveTargetId(t.id)}
                            className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all ${
                                isActive
                                    ? 'border-primary bg-primary/10 shadow-[0_0_8px_rgba(59,130,246,0.15)]'
                                    : 'border-border/70 bg-background/40 hover:bg-muted/50'
                            }`}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTargetVisibility(t.id);
                                    }}
                                    className={`p-1 rounded hover:bg-muted transition-colors ${
                                        t.isVisible ? 'text-primary' : 'text-muted-foreground/50'
                                    }`}
                                    title={t.isVisible ? 'Hide diagram' : 'Show diagram'}
                                >
                                    {t.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                                </button>
                                <span className={`text-xs font-semibold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                    {renderTargetName(t)}
                                </span>
                            </div>

                            {targets.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTarget(t.id);
                                    }}
                                    className="p-1 rounded text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors shrink-0"
                                    title="Delete diagram"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Buttons */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Add New Influence Line:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                    {(['reaction', 'shear', 'moment'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => addTarget(type)}
                            className="flex items-center justify-center gap-1 rounded-lg border border-border bg-background/50 py-1.5 text-[10px] font-semibold text-foreground hover:bg-muted transition-all"
                        >
                            <Plus className="h-3 w-3" />
                            <span className="capitalize">{type === 'reaction' ? 'Rxn' : type}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ILManager;
