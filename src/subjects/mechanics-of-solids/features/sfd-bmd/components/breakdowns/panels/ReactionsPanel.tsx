import React from 'react';
import { StepListHeader } from '../StepListHeader';
import { StepRow } from '../StepRow';
import { IReactionEquationDetails } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { generateReactionStepsUI } from '../../../helpers/stepFormatters';

interface ReactionsPanelProps {
  reactionEquations: IReactionEquationDetails;
  expandedDiagrams: Record<string, boolean>;
  setExpandedDiagrams: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const ReactionsPanel: React.FC<ReactionsPanelProps> = ({
  reactionEquations,
  expandedDiagrams,
  setExpandedDiagrams,
}) => {
  const steps = generateReactionStepsUI(reactionEquations);

  return (
    <div id="breakdown-reactions" className="flex flex-col gap-3">
      <StepListHeader
        title="Equilibrium Equations solver"
        steps={steps}
        tab="reactions"
        expandedDiagrams={expandedDiagrams}
        setExpandedDiagrams={setExpandedDiagrams}
      />
      <div className="flex flex-col gap-2.5">
        {steps.map((step, idx) => (
          <StepRow
            key={step.id}
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
  );
};

