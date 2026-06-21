import React from 'react';
import { StepListHeader } from '../StepListHeader';
import { StepRow } from '../StepRow';
import { useBeamWorkspace } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { IDOIResult } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { generateDoiStepsUI } from '../../../helpers/stepFormatters';

interface DoiPanelProps {
  doiResult: IDOIResult;
  expandedDiagrams: Record<string, boolean>;
  setExpandedDiagrams: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  alertClass: string;
  alertTitle: string;
}

export const DoiPanel: React.FC<DoiPanelProps> = ({
  doiResult,
  expandedDiagrams,
  setExpandedDiagrams,
  alertClass,
  alertTitle,
}) => {
  const { supports, releases, length } = useBeamWorkspace();
  const steps = generateDoiStepsUI(doiResult, { length, supports, releases, loads: [] });

  return (
    <div id="breakdown-doi" className="flex flex-col gap-3">
      <StepListHeader
        title="Static Restraints Analysis"
        steps={steps}
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
        {steps.map((step, idx) => (
          <StepRow
            key={step.id}
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
  );
};

