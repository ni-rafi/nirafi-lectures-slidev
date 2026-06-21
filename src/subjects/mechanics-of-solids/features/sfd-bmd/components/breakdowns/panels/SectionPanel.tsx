import React from 'react';
import { StepListHeader } from '../StepListHeader';
import { StepRow } from '../StepRow';
import { IIntervalEquation } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { generateSectionStepsUI } from '../../../helpers/stepFormatters';

interface SectionPanelProps {
  intervals: IIntervalEquation[];
  expandedDiagrams: Record<string, boolean>;
  setExpandedDiagrams: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const SectionPanel: React.FC<SectionPanelProps> = ({
  intervals,
  expandedDiagrams,
  setExpandedDiagrams,
}) => {
  const steps = generateSectionStepsUI(intervals);

  return (
    <div id="breakdown-section" className="flex flex-col gap-3">
      <StepListHeader
        title="Interval Equations cut segments"
        steps={steps}
        tab="section"
        expandedDiagrams={expandedDiagrams}
        setExpandedDiagrams={setExpandedDiagrams}
      />
      <div className="flex flex-col gap-2.5">
        {steps.map((step, idx) => (
          <StepRow
            key={step.id}
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
  );
};

