import React from 'react';
import { StepListHeader } from '../StepListHeader';
import { StepRow } from '../StepRow';
import { IGraphicalStepData } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { generateGraphicalStepsUI } from '../../../helpers/stepFormatters';

interface GraphicalPanelProps {
  graphicalStepsData: IGraphicalStepData[];
  expandedDiagrams: Record<string, boolean>;
  setExpandedDiagrams: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const GraphicalPanel: React.FC<GraphicalPanelProps> = ({
  graphicalStepsData,
  expandedDiagrams,
  setExpandedDiagrams,
}) => {
  const steps = generateGraphicalStepsUI(graphicalStepsData);

  return (
    <div id="breakdown-graphical" className="flex flex-col gap-3">
      <StepListHeader
        title="Curvatures integration & shear jumps"
        steps={steps}
        tab="graphical"
        expandedDiagrams={expandedDiagrams}
        setExpandedDiagrams={setExpandedDiagrams}
      />
      <div className="flex flex-col gap-2.5">
        {steps.map((step, idx) => (
          <StepRow
            key={step.id}
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
  );
};

