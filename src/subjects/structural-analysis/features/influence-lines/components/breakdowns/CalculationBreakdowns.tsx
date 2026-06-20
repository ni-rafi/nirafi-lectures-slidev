import React, { useState } from 'react';
import { useInfluenceWorkspace } from '../../context/InfluenceLinesWorkspaceContext';
import { useInfluenceLinesEngine } from '../../hooks/useInfluenceLinesEngine';
import { StepRow } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/StepRow';
import { StepListHeader } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/StepListHeader';
import { MicroKinematicRelease } from './micro-diagrams/MicroKinematicRelease';
import { MicroLoadConvolution } from './micro-diagrams/MicroLoadConvolution';
import { BookOpen, Layers } from 'lucide-react';

type TabType = 'doi' | 'ild' | 'transit' | 'absMax';

export const CalculationBreakdowns: React.FC = () => {
    const { analysisType, activeVehicle, transitPosition } = useInfluenceWorkspace();
    const { solverResult, transitResult } = useInfluenceLinesEngine();
    const [activeTabState, setActiveTabState] = useState<TabType | null>(null);
    const [expandedDiagrams, setExpandedDiagrams] = useState<Record<string, boolean>>({});

    const isSolved = solverResult.success;
    const activeTab = activeTabState ?? (isSolved ? 'ild' : 'doi');

    const doiResult = solverResult.doiResult;

    // Dynamic alert classes for DOI banner
    let alertClass = 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600';
    let alertTitle = 'Statically Determinate';
    if (doiResult) {
        if (doiResult.isUnstable) {
            alertClass = 'border-destructive/20 bg-destructive/5 text-destructive';
            alertTitle = 'Statically Unstable';
        } else if (!doiResult.isDeterminate) {
            alertClass = 'border-amber-500/20 bg-amber-500/5 text-amber-600';
            alertTitle = 'Statically Indeterminate';
        }
    }

    const tabs = [
        { id: 'doi' as TabType, label: 'Indeterminacy (DOI)' },
        { id: 'ild' as TabType, label: 'ILD Equations' },
        ...(activeVehicle ? [
            { id: 'transit' as TabType, label: `Superposition (x = ${transitPosition.toFixed(1)}m)` },
            { id: 'absMax' as TabType, label: 'Absolute Max Envelopes' }
        ] : [])
    ];

    // Find the step result matching current transitPosition
    const activeStepResult = transitResult.transitSteps?.find(
        (step) => Math.abs(step.leadingAxlePosition - transitPosition) < 0.05
    );

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-5 backdrop-blur-md">
            {/* Tabs Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">Step-by-Step Educational Breakdown</span>
                </div>
                <div className="flex gap-1 bg-background/40 p-1 rounded-lg border border-border/50">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const isDisabled = !isSolved && tab.id !== 'doi';
                        return (
                            <button
                                key={tab.id}
                                disabled={isDisabled}
                                onClick={() => setActiveTabState(tab.id)}
                                className={`rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : isDisabled
                                        ? 'opacity-40 cursor-not-allowed text-muted-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Contents */}
            <div className="flex flex-col gap-3 min-h-[160px]">
                {/* DOI TAB */}
                {activeTab === 'doi' && doiResult && (
                    <div className="flex flex-col gap-3">
                        <StepListHeader
                            title="Static Restraints Analysis"
                            steps={doiResult.explanationSteps}
                            tab="doi"
                            expandedDiagrams={expandedDiagrams}
                            setExpandedDiagrams={setExpandedDiagrams}
                            rightElement={
                                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${alertClass}`}>
                                    {alertTitle} (DOI = {doiResult.doi})
                                </span>
                            }
                        />
                        <div className="flex flex-col gap-2.5">
                            {doiResult.explanationSteps.map((step, idx) => (
                                <StepRow
                                    key={idx}
                                    step={step}
                                    tab="doi"
                                    isExpanded={!!expandedDiagrams[`doi-${idx}`]}
                                    onToggle={() =>
                                        setExpandedDiagrams((prev) => ({
                                            ...prev,
                                            [`doi-${idx}`]: !prev[`doi-${idx}`],
                                        }))
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'ild' && isSolved && (
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 flex flex-col gap-3">
                            <StepListHeader
                                title="Equilibrium Mechanics Equations"
                                steps={solverResult.calculationSteps}
                                tab="ild"
                                expandedDiagrams={expandedDiagrams}
                                setExpandedDiagrams={setExpandedDiagrams}
                            />
                            <div className="flex flex-col gap-2.5">
                                {solverResult.calculationSteps.map((step, idx) => (
                                    <StepRow
                                        key={idx}
                                        step={step}
                                        tab="ild"
                                        isExpanded={!!expandedDiagrams[`ild-${idx}`]}
                                        onToggle={() =>
                                            setExpandedDiagrams((prev) => ({
                                                ...prev,
                                                [`ild-${idx}`]: !prev[`ild-${idx}`],
                                            }))
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 border border-border/40 rounded-xl bg-background/20 max-w-[200px] shrink-0 self-center">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground text-center">
                                Müller-Breslau release
                            </span>
                            <MicroKinematicRelease type={analysisType} />
                            <p className="text-[9px] text-muted-foreground text-center mt-1 leading-relaxed">
                                Releases the restraint for <strong>{analysisType}</strong> to deflect the shape.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'transit' && isSolved && activeVehicle && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                                <Layers className="h-3.5 w-3.5" />
                                <span>Axle ordinates product convolution sum</span>
                            </span>
                            <p className="text-[10px] text-muted-foreground">
                                Multiplying active axle forces by their underlying ordinates at transit coordinate <strong>x = {transitPosition.toFixed(2)}m</strong>:
                            </p>
                        </div>

                        {/* Rendering convolution micro-diagram bubbles */}
                        {activeStepResult && activeStepResult.axleSnapshots.length > 0 ? (
                            <div className="flex flex-wrap gap-4 items-center justify-center py-2">
                                {activeStepResult.axleSnapshots.map((axle) => (
                                    <MicroLoadConvolution
                                        key={axle.id}
                                        load={axle.load}
                                        ordinate={axle.ordinate}
                                    />
                                ))}
                                <div className="text-xl font-black text-foreground flex items-center gap-2 select-all pl-2 border-l border-border/45">
                                    <span>=</span>
                                    <span className="text-primary">{activeStepResult.totalResponse.toFixed(3)}</span>
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        {analysisType === 'moment' ? 'kN·m' : 'kN'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-xs text-muted-foreground py-4">
                                No vehicle axles are currently positioned on the beam span.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'absMax' && isSolved && activeVehicle && transitResult.success && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Absolute max shear */}
                        <div className="flex flex-col gap-3 bg-background/25 border border-border/40 p-4 rounded-xl">
                            <StepListHeader
                                title="Absolute Max Shear"
                                steps={transitResult.absoluteMaxShear?.calculationSteps || []}
                                tab="absShear"
                                expandedDiagrams={expandedDiagrams}
                                setExpandedDiagrams={setExpandedDiagrams}
                                rightElement={
                                    <span className="text-xs font-black text-foreground select-all">
                                        {transitResult.absoluteMaxShear?.absoluteMax.toFixed(3)} kN
                                    </span>
                                }
                            />
                            <div className="flex flex-col gap-2.5">
                                {transitResult.absoluteMaxShear?.calculationSteps.map((step, idx) => (
                                    <StepRow
                                        key={idx}
                                        step={step}
                                        tab="absShear"
                                        isExpanded={!!expandedDiagrams[`absShear-${idx}`]}
                                        onToggle={() =>
                                            setExpandedDiagrams((prev) => ({
                                                ...prev,
                                                [`absShear-${idx}`]: !prev[`absShear-${idx}`],
                                            }))
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Absolute max moment */}
                        <div className="flex flex-col gap-3 bg-background/25 border border-border/40 p-4 rounded-xl">
                            <StepListHeader
                                title="Absolute Max Moment"
                                steps={transitResult.absoluteMaxMoment?.calculationSteps || []}
                                tab="absMoment"
                                expandedDiagrams={expandedDiagrams}
                                setExpandedDiagrams={setExpandedDiagrams}
                                rightElement={
                                    <span className="text-xs font-black text-foreground select-all">
                                        {transitResult.absoluteMaxMoment?.absoluteMax.toFixed(3)} kN·m
                                    </span>
                                }
                            />
                            <div className="flex flex-col gap-2.5">
                                {transitResult.absoluteMaxMoment?.calculationSteps.map((step, idx) => (
                                    <StepRow
                                        key={idx}
                                        step={step}
                                        tab="absMoment"
                                        isExpanded={!!expandedDiagrams[`absMoment-${idx}`]}
                                        onToggle={() =>
                                            setExpandedDiagrams((prev) => ({
                                                ...prev,
                                                [`absMoment-${idx}`]: !prev[`absMoment-${idx}`],
                                            }))
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculationBreakdowns;
