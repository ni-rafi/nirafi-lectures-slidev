import React from 'react';
import { InfluenceLinesWorkspaceProvider, useInfluenceWorkspace } from '@/subjects/structural-analysis/features/influence-lines/context/InfluenceLinesWorkspaceContext';
import { useInfluenceLinesEngine } from '@/subjects/structural-analysis/features/influence-lines/hooks/useInfluenceLinesEngine';
import { InfluenceLineBeamCanvas } from '@/subjects/structural-analysis/features/influence-lines/components/builder/InfluenceLineBeamCanvas';
import { ILManager } from '@/subjects/structural-analysis/features/influence-lines/components/builder/ILManager';
import { TargetSectionSelector } from '@/subjects/structural-analysis/features/influence-lines/components/builder/TargetSectionSelector';
import { MovingVehicleConfigurator } from '@/subjects/structural-analysis/features/influence-lines/components/builder/MovingVehicleConfigurator';
import { InfluenceLinesToolBar } from '@/subjects/structural-analysis/features/influence-lines/components/builder/InfluenceLinesToolBar';
import { InfluenceLineChart } from '@/subjects/structural-analysis/features/influence-lines/components/diagrams/InfluenceLineChart';
import { MullerBreslauAnimator } from '@/subjects/structural-analysis/features/influence-lines/components/diagrams/MullerBreslauAnimator';
import { CalculationBreakdowns } from '@/subjects/structural-analysis/features/influence-lines/components/breakdowns/CalculationBreakdowns';
import { MathTextRenderer } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/MathTextRenderer';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InfluenceLinesPageInternal: React.FC = () => {
    const { solverResult } = useInfluenceLinesEngine();
    const { transitMethod, targets } = useInfluenceWorkspace();
    const navigate = useNavigate();

    const visibleTargets = targets.filter(t => t.isVisible);

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                            Influence Lines & Moving Loads Solver
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Analyze support reactions, shear force cuts, and bending moments under unit loads and multi-axle vehicle transits
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-all"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reset Workspace</span>
                </button>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Visual Canvas & Diagrams Area */}
                <div className="flex flex-col gap-6 lg:col-span-3">
                    <InfluenceLineBeamCanvas />

                    {solverResult.success ? (
                        <div className="flex flex-col gap-6">
                            {visibleTargets.map((t) => (
                                <React.Fragment key={t.id}>
                                    {transitMethod === 'muller-breslau' ? (
                                        <MullerBreslauAnimator target={t} />
                                    ) : (
                                        <InfluenceLineChart target={t} />
                                    )}
                                </React.Fragment>
                            ))}
                            {visibleTargets.length === 0 && (
                                <div className="flex items-center justify-center p-8 border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                                    No diagrams selected. Enable visibility toggles in the Manager to display diagrams.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Solving Suspended</p>
                                <div className="mt-1 text-destructive/80">
                                    <MathTextRenderer text={solverResult.error || 'The beam support configuration is unstable or statically redundant. Please adjust supports to evaluate the influence lines.'} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6 lg:col-span-1">
                    <ILManager />
                    <InfluenceLinesToolBar />
                    <TargetSectionSelector />
                    <MovingVehicleConfigurator />
                </div>
            </div>

            {/* Step-by-Step Educational Mathematics Breakdowns */}
            <div className="mt-2">
                <CalculationBreakdowns />
            </div>
        </div>
    );
};

export const InfluenceLinesPage: React.FC = () => {
    return (
        <InfluenceLinesWorkspaceProvider>
            <InfluenceLinesPageInternal />
        </InfluenceLinesWorkspaceProvider>
    );
};
export default InfluenceLinesPage;
