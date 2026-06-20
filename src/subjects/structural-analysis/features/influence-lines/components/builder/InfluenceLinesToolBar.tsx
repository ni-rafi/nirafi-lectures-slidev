import React from 'react';
import { useInfluenceWorkspace } from '../../context/InfluenceLinesWorkspaceContext';
import { Trash2, Plus } from 'lucide-react';

export const InfluenceLinesToolBar: React.FC = () => {
    const {
        length,
        analysisType,
        transitMethod,
        selectedId,
        setLength,
        addSupport,
        deleteSupport,
        addRelease,
        deleteRelease,
        setAnalysisType,
        setTransitMethod,
        setSelectedId,
    } = useInfluenceWorkspace();

    // Support templates: hinge, roller, fixed
    const handleAddSupport = (type: 'hinge' | 'roller' | 'fixed') => {
        // Place new support at L/2 by default
        addSupport(type, length / 2);
    };

    // Hinge release templates
    const handleAddHinge = () => {
        addRelease('hinge', length / 2);
    };

    // Delete selected element
    const handleDeleteSelected = () => {
        if (!selectedId) return;
        if (selectedId.startsWith('support_') || selectedId === 's1' || selectedId === 's2') {
            deleteSupport(selectedId);
        } else if (selectedId.startsWith('release_')) {
            deleteRelease(selectedId);
        }
        setSelectedId(null);
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-5 backdrop-blur-md">
            <div className="border-b border-border/40 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Toolbar & Controls</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Manage support boundaries, beam length, and active method</p>
            </div>

            {/* Beam Span Length Input */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Beam Length (meters):
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={1}
                        max={100}
                        value={length}
                        onChange={(e) => setLength(Math.max(1, parseFloat(e.target.value) || 1))}
                        className="w-full rounded-lg border border-border bg-background/50 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground">m</span>
                </div>
            </div>

            {/* Analysis Response Selector */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Active Response Type:
                </label>
                <div className="flex gap-1.5 bg-background/30 p-1 rounded-lg border border-border/55">
                    {(['reaction', 'shear', 'moment'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setAnalysisType(type)}
                            className={`flex-1 rounded-md py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${analysisType === type
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calculation Method Selector */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    ILD Evaluation Method:
                </label>
                <div className="flex gap-1.5 bg-background/30 p-1 rounded-lg border border-border/55">
                    <button
                        onClick={() => setTransitMethod('equilibrium')}
                        className={`flex-1 rounded-md py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${transitMethod === 'equilibrium'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Equilibrium
                    </button>
                    <button
                        onClick={() => setTransitMethod('muller-breslau')}
                        className={`flex-1 rounded-md py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${transitMethod === 'muller-breslau'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Müller-Breslau
                    </button>
                </div>
            </div>

            {/* Add supports & hinge elements */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Boundary Elements:
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleAddSupport('roller')}
                        className="flex items-center justify-center gap-1 rounded-lg border border-border bg-background/50 py-1.5 text-xs text-foreground hover:bg-muted transition-all"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Roller</span>
                    </button>
                    <button
                        onClick={() => handleAddSupport('hinge')}
                        className="flex items-center justify-center gap-1 rounded-lg border border-border bg-background/50 py-1.5 text-xs text-foreground hover:bg-muted transition-all"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Hinge</span>
                    </button>
                    <button
                        onClick={() => handleAddHinge()}
                        className="col-span-2 flex items-center justify-center gap-1 rounded-lg border border-border bg-background/50 py-1.5 text-xs text-foreground hover:bg-muted transition-all"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Internal Hinge</span>
                    </button>
                </div>
            </div>

            {/* Selection Manager Action */}
            {selectedId && (
                <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                    <button
                        onClick={handleDeleteSelected}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/95 shadow-sm transition-all"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Selected Element</span>
                    </button>
                </div>
            )}
        </div>
    );
};
export default InfluenceLinesToolBar;
