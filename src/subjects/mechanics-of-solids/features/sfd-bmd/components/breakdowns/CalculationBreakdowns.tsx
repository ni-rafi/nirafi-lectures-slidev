import React, { useState } from 'react';
import { useBeamWorkspace } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '../../hooks/useBeamEngine';
import { StressBreakdownPanel } from './StressBreakdownPanel';
import { DoiPanel } from './panels/DoiPanel';
import { ReactionsPanel } from './panels/ReactionsPanel';
import { SectionPanel } from './panels/SectionPanel';
import { GraphicalPanel } from './panels/GraphicalPanel';
import { DeflectionPanel } from './panels/DeflectionPanel';

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
  const { setDeflMethod, customInspectX, setCustomInspectX, length, activeTab, setActiveTab } = useBeamWorkspace();
  const { solverResult, deflectionResult } = useBeamEngine();
  const [expandedDiagrams, setExpandedDiagrams] = useState<Record<string, boolean>>({});

  const currentTab = activeTab as TabType;

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
        <h3 className="text-base sm:text-lg font-extrabold text-primary">Calculation Derivations</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Select a method tab to inspect step-by-step structural formulas</p>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-background/40 p-1 border border-border/50">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const isDisabled = !isSolved && tab.id !== 'doi';
          return (
            <button
              key={tab.id}
              disabled={isDisabled}
              onClick={() => handleTabClick(tab.id)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${isActive
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

      {/* Tab Content Panels */}
      <div className="flex flex-col gap-4 text-sm text-foreground/80 min-h-[180px]">

        {/* DOI TAB */}
        {currentTab === 'doi' && (
          <DoiPanel
            doiResult={doiResult}
            expandedDiagrams={expandedDiagrams}
            setExpandedDiagrams={setExpandedDiagrams}
            alertClass={alertClass}
            alertTitle={alertTitle}
          />
        )}

        {/* REACTIONS TAB */}
        {currentTab === 'reactions' && isSolved && solverResult.reactionEquations && (
          <ReactionsPanel
            reactionEquations={solverResult.reactionEquations}
            expandedDiagrams={expandedDiagrams}
            setExpandedDiagrams={setExpandedDiagrams}
          />
        )}

        {/* SECTION METHOD TAB */}
        {currentTab === 'section' && isSolved && (
          <SectionPanel
            intervals={solverResult.intervals}
            expandedDiagrams={expandedDiagrams}
            setExpandedDiagrams={setExpandedDiagrams}
          />
        )}

        {/* GRAPHICAL METHOD TAB */}
        {currentTab === 'graphical' && isSolved && solverResult.graphicalStepsData && (
          <GraphicalPanel
            graphicalStepsData={solverResult.graphicalStepsData}
            expandedDiagrams={expandedDiagrams}
            setExpandedDiagrams={setExpandedDiagrams}
          />
        )}


        {(currentTab === 'double-integration' || currentTab === 'moment-area' || currentTab === 'conjugate-beam') && isSolved && (
          <DeflectionPanel
            currentTab={currentTab}
            length={length}
            customInspectX={customInspectX}
            setCustomInspectX={setCustomInspectX}
            deflectionResult={deflectionResult}
            expandedDiagrams={expandedDiagrams}
            setExpandedDiagrams={setExpandedDiagrams}
          />
        )}

        {/* STRESS TAB */}
        {currentTab === 'stress' && isSolved && (
          <div id="breakdown-stress">
            <StressBreakdownPanel />
          </div>
        )}

      </div>
    </div>
  );
};

export default CalculationBreakdowns;
