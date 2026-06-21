import React from 'react';
import { StepListHeader } from '../StepListHeader';
import { StepRow } from '../StepRow';
import { IDeflectionResult } from '@/subjects/mechanics-of-solids/cores/deflection/types';
import { generateDoubleIntegrationStepsUI, generateMomentAreaStepsUI, generateConjugateBeamStepsUI } from '../../../helpers/stepFormatters';
import { useBeamWorkspace } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { ICalculationStep } from '../../../types/stepTypes';

interface DeflectionPanelProps {
  currentTab: 'double-integration' | 'moment-area' | 'conjugate-beam';
  length: number;
  customInspectX: number | null;
  setCustomInspectX: (x: number | null) => void;
  deflectionResult: IDeflectionResult;
  expandedDiagrams: Record<string, boolean>;
  setExpandedDiagrams: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const DeflectionPanel: React.FC<DeflectionPanelProps> = ({
  currentTab,
  length,
  customInspectX,
  setCustomInspectX,
  deflectionResult,
  expandedDiagrams,
  setExpandedDiagrams,
}) => {
  const { supports, releases, loads } = useBeamWorkspace();

  let steps: ICalculationStep[] = [];
  if (currentTab === 'double-integration' && deflectionResult.doubleIntegration) {
    steps = generateDoubleIntegrationStepsUI(deflectionResult.doubleIntegration);
  } else if (currentTab === 'moment-area' && deflectionResult.momentArea) {
    // If Moment-Area solver fell back to Double Integration (due to hinges)
    if (releases.length > 0) {
      steps = [
        {
          id: 'ma-gerber-fallback',
          type: 'ma-fallback-message',
          text: `### Moment-Area Method Calculation Steps\n\nThe Moment-Area Method utilizes Mohr's Theorems to compute slopes and deflections.\n\n**Note:** This structure is a Gerber Beam with internal hinges ($H > 0$).\n\nBecause internal hinges introduce slope discontinuities (angles/hinge rotations), the moment-area theorems cannot be applied as a single continuous integration across the entire beam.\n\nInstead, the slope and deflection curves are solved segment-by-segment using the Double Integration method (refer to the Double Integration tab).`,
        }
      ];
    } else if (deflectionResult.momentArea) {
      steps = generateMomentAreaStepsUI(deflectionResult.momentArea);
    }
  } else if (currentTab === 'conjugate-beam' && deflectionResult.conjugateBeam) {
    steps = generateConjugateBeamStepsUI(deflectionResult.conjugateBeam, { length, supports, releases, loads });
  }

  return (
    <div id="breakdown-deflection" className="flex flex-col gap-4">
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
          steps={steps}
          tab={currentTab}
          expandedDiagrams={expandedDiagrams}
          setExpandedDiagrams={setExpandedDiagrams}
        />
        <div className="flex flex-col gap-3">
          {steps.map((step, idx) => (
            <StepRow
              key={step.id}
              step={step}
              tab={currentTab}
              isExpanded={!!expandedDiagrams[`${currentTab}-${idx}`]}
              onToggle={() =>
                setExpandedDiagrams(prev => ({
                  ...prev,
                  [`${currentTab}-${idx}`]: !prev[`${currentTab}-${idx}`],
                }))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

