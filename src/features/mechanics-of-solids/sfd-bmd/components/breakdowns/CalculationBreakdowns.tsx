import React, { useState } from 'react';
import { useBeamWorkspace } from '../../context/BeamWorkspaceContext';
import { useBeamEngine } from '../../hooks/useBeamEngine';
import { StepRow } from './StepRow';
import { StepListHeader } from './StepListHeader';
import { StressBreakdownPanel } from './StressBreakdownPanel';

type TabType = 
  | 'doi' 
  | 'reactions' 
  | 'section' 
  | 'graphical' 
  | 'double-integration' 
  | 'moment-area' 
  | 'conjugate-beam'
  | 'stress';

export const CalculationBreakdowns: React.FC = () => {
  const { setDeflMethod, customInspectX, setCustomInspectX, length } = useBeamWorkspace();
  const { solverResult, deflectionResult } = useBeamEngine();
  const [activeTab, setActiveTab] = useState<TabType>('doi');
  const [expandedDiagrams, setExpandedDiagrams] = useState<Record<string, boolean>>({});

  const { doiResult } = solverResult;
  const isSolved = solverResult.success;

  const handleTabClick = (tab: TabType) => {
    if (!isSolved && tab !== 'doi') return; // Disable other tabs if beam is unstable/indeterminate
    setActiveTab(tab);
    if (tab === 'double-integration' || tab === 'moment-area' || tab === 'conjugate-beam') {
      setDeflMethod(tab);
    }
  };

  // Dynamic alert classes for DOI banner
  let alertClass = 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600';
  let alertTitle = 'Statically Determinate';
  if (doiResult.isUnstable) {
    alertClass = 'border-destructive/20 bg-destructive/5 text-destructive';
    alertTitle = 'Statically Unstable';
  } else if (!doiResult.isDeterminate) {
    alertClass = 'border-amber-500/20 bg-amber-500/5 text-amber-600';
    alertTitle = 'Statically Indeterminate';
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'doi', label: 'Indeterminacy (DOI)' },
    { id: 'reactions', label: 'Support Reactions' },
    { id: 'section', label: 'Section Method' },
    { id: 'graphical', label: 'Graphical Method' },
    { id: 'double-integration', label: 'Double Integration' },
    { id: 'moment-area', label: 'Moment-Area' },
    { id: 'conjugate-beam', label: 'Conjugate Beam' },
    { id: 'stress', label: 'Stress Analysis' },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card/30 p-5 backdrop-blur-md">
      {/* Title block */}
      <div>
        <h3 className="text-sm font-semibold text-primary font-bold">Calculation Derivations</h3>
        <p className="text-[10px] text-muted-foreground">Select a method tab to inspect step-by-step structural formulas</p>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-muted/20 p-1 border border-border/40">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const isDisabled = !isSolved && tab.id !== 'doi';
          return (
            <button
              key={tab.id}
              disabled={isDisabled}
              onClick={() => handleTabClick(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-background text-primary shadow-sm'
                  : isDisabled
                  ? 'opacity-40 cursor-not-allowed text-muted-foreground'
                  : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="flex flex-col gap-4 text-xs text-foreground/80 min-h-[180px]">
        
        {/* DOI TAB */}
        {activeTab === 'doi' && (
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
                    setExpandedDiagrams(prev => ({
                      ...prev,
                      [`doi-${idx}`]: !prev[`doi-${idx}`],
                    }))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* REACTIONS TAB */}
        {activeTab === 'reactions' && isSolved && (
          <div className="flex flex-col gap-3">
            <StepListHeader
              title="Equilibrium Equations solver"
              steps={solverResult.reactionSteps}
              tab="reactions"
              expandedDiagrams={expandedDiagrams}
              setExpandedDiagrams={setExpandedDiagrams}
            />
            <div className="flex flex-col gap-2.5">
              {solverResult.reactionSteps.map((step, idx) => (
                <StepRow
                  key={idx}
                  step={step}
                  tab="reactions"
                  isExpanded={!!expandedDiagrams[`reactions-${idx}`]}
                  onToggle={() =>
                    setExpandedDiagrams(prev => ({
                      ...prev,
                      [`reactions-${idx}`]: !prev[`reactions-${idx}`],
                    }))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION METHOD TAB */}
        {activeTab === 'section' && isSolved && (
          <div className="flex flex-col gap-3">
            <StepListHeader
              title="Interval Equations cut segments"
              steps={solverResult.sectionSteps}
              tab="section"
              expandedDiagrams={expandedDiagrams}
              setExpandedDiagrams={setExpandedDiagrams}
            />
            <div className="flex flex-col gap-2.5">
              {solverResult.sectionSteps.map((step, idx) => (
                <StepRow
                  key={idx}
                  step={step}
                  tab="section"
                  isExpanded={!!expandedDiagrams[`section-${idx}`]}
                  onToggle={() =>
                    setExpandedDiagrams(prev => ({
                      ...prev,
                      [`section-${idx}`]: !prev[`section-${idx}`],
                    }))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* GRAPHICAL METHOD TAB */}
        {activeTab === 'graphical' && isSolved && (
          <div className="flex flex-col gap-3">
            <StepListHeader
              title="Curvatures integration & shear jumps"
              steps={solverResult.graphicalSteps}
              tab="graphical"
              expandedDiagrams={expandedDiagrams}
              setExpandedDiagrams={setExpandedDiagrams}
            />
            <div className="flex flex-col gap-2.5">
              {solverResult.graphicalSteps.map((step, idx) => (
                <StepRow
                  key={idx}
                  step={step}
                  tab="graphical"
                  isExpanded={!!expandedDiagrams[`graphical-${idx}`]}
                  onToggle={() =>
                    setExpandedDiagrams(prev => ({
                      ...prev,
                      [`graphical-${idx}`]: !prev[`graphical-${idx}`],
                    }))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* DEFLECTION METHODS TABS (DI, MA, CB) */}
        {(activeTab === 'double-integration' || activeTab === 'moment-area' || activeTab === 'conjugate-beam') && isSolved && (
          <div className="flex flex-col gap-4">
            {/* Deflection Header Controls */}
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Elastic Deformations solver</span>
              
              {/* Inspection Point Input */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">Inspect coordinate:</span>
                <input
                  type="number"
                  min={0}
                  max={length}
                  step={0.1}
                  value={customInspectX !== null ? customInspectX : ''}
                  placeholder="x (m)"
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) {
                      setCustomInspectX(null);
                    } else {
                      setCustomInspectX(Math.max(0, Math.min(length, val)));
                    }
                  }}
                  className="w-16 rounded-md border border-border bg-background px-2 py-0.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                {customInspectX !== null && (
                  <button
                    onClick={() => setCustomInspectX(null)}
                    className="text-[10px] font-semibold text-destructive hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Critical Deflection Values Grid */}
            <div className="flex flex-col gap-1.5">
              <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Stiffness & Slope/Deflections coordinates</div>
              <div className="overflow-x-auto rounded-lg border border-border bg-muted/10 p-2.5">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground">
                      <th className="pb-1.5 font-semibold">Coordinate x</th>
                      <th className="pb-1.5 font-semibold">Location Type</th>
                      <th className="pb-1.5 font-semibold">Slope (rad)</th>
                      <th className="pb-1.5 font-semibold">Deflection (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deflectionResult.criticalPoints.map((pt, idx) => (
                      <tr key={idx} className="border-b border-border/20 last:border-0 hover:bg-muted/10">
                        <td className="py-1.5 font-mono">{pt.x.toFixed(2)}m</td>
                        <td className="py-1.5 font-medium text-primary">{pt.label}</td>
                        <td className="py-1.5 font-mono">{pt.slope.toFixed(6)}</td>
                        <td className="py-1.5 font-mono font-semibold text-emerald-500">{pt.deflection >= 0 ? '+' : ''}{pt.deflection.toFixed(3)} mm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Method derivation steps */}
            <div className="flex flex-col gap-2.5 mt-2">
              <StepListHeader
                title="Mathematical Derivation steps"
                steps={deflectionResult.steps}
                tab={activeTab}
                expandedDiagrams={expandedDiagrams}
                setExpandedDiagrams={setExpandedDiagrams}
              />
              <div className="flex flex-col gap-3">
                {deflectionResult.steps.map((step, idx) => (
                  <StepRow
                    key={idx}
                    step={step}
                    tab={activeTab}
                    isExpanded={!!expandedDiagrams[`${activeTab}-${idx}`]}
                    onToggle={() =>
                      setExpandedDiagrams(prev => ({
                        ...prev,
                        [`${activeTab}-${idx}`]: !prev[`${activeTab}-${idx}`],
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STRESS TAB */}
        {activeTab === 'stress' && isSolved && (
          <StressBreakdownPanel />
        )}

      </div>
    </div>
  );
};
export default CalculationBreakdowns;
