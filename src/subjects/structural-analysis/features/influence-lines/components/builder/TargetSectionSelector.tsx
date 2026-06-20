import React from 'react';
import { useInfluenceWorkspace } from '../../context/InfluenceLinesWorkspaceContext';

export const TargetSectionSelector: React.FC = () => {
    const {
        length,
        supports,
        targetSection,
        targetSupportX,
        analysisType,
        setTargetSection,
        setTargetSupportX,
    } = useInfluenceWorkspace();

    // Assign letters A, B, C... to supports sorted by position
    const sortedSupports = [...supports].sort((a, b) => a.position - b.position);
    const supportIdToLetter = new Map<string, string>();
    sortedSupports.forEach((s, idx) => {
        const letter = String.fromCharCode(65 + idx);
        supportIdToLetter.set(s.id, letter);
    });

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-5 backdrop-blur-md">
            <div className="border-b border-border/40 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Target Analysis Selector</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Define the boundary cut section or support reaction to evaluate</p>
            </div>

            {analysisType === 'reaction' ? (
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Target Reaction Support:
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {supports.map((s) => {
                            const letter = supportIdToLetter.get(s.id) || '';
                            const isSelected = targetSupportX !== null && Math.abs(targetSupportX - s.position) < 0.01;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setTargetSupportX(s.position)}
                                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                                        isSelected
                                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_8px_rgba(59,130,246,0.15)]'
                                            : 'border-border bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    Reaction R<sub>{letter}</sub> ({s.position.toFixed(2)} m)
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Target Cut Section (x<sub>c</sub>):
                        </label>
                        <div className="flex items-center gap-1.5 text-xs font-black text-primary">
                            <input
                                type="number"
                                min={0}
                                max={length}
                                step={0.01}
                                value={targetSection.xc}
                                onChange={(e) => {
                                    const val = Math.max(0, Math.min(length, parseFloat(e.target.value) || 0));
                                    setTargetSection({ xc: parseFloat(val.toFixed(2)), label: 'C' });
                                }}
                                className="w-16 rounded border border-border bg-background/50 px-1.5 py-0.5 text-center text-xs font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <span>/ {length.toFixed(2)} m</span>
                        </div>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={length}
                        step={0.1}
                        value={targetSection.xc}
                        onChange={(e) => setTargetSection({ xc: parseFloat(e.target.value), label: 'C' })}
                        className="h-1.5 w-full cursor-ew-resize appearance-none rounded-lg bg-secondary accent-primary"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTargetSection({ xc: length / 4, label: 'C' })}
                            className="flex-1 rounded-md border border-border bg-background/50 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted transition-all"
                        >
                            Quarter Span (L/4)
                        </button>
                        <button
                            onClick={() => setTargetSection({ xc: length / 2, label: 'C' })}
                            className="flex-1 rounded-md border border-border bg-background/50 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted transition-all"
                        >
                            Mid Span (L/2)
                        </button>
                        <button
                            onClick={() => setTargetSection({ xc: (length * 3) / 4, label: 'C' })}
                            className="flex-1 rounded-md border border-border bg-background/50 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted transition-all"
                        >
                            Three Quarters (3L/4)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default TargetSectionSelector;
