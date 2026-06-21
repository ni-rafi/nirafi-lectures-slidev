import React from 'react';
import { MathTextRenderer } from './MathTextRenderer';
import { StepDiagramRenderer, hasDiagram } from './StepDiagramRenderer';
import { Eye, EyeOff } from 'lucide-react';
import { ICalculationStep } from '../../types/stepTypes';

interface StepRowProps {
  step: ICalculationStep | string;
  tab: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const StepRow: React.FC<StepRowProps> = ({ step: rawStep, tab, isExpanded, onToggle }) => {
  const step: ICalculationStep = typeof rawStep === 'string'
    ? { id: `raw-step-${rawStep.substring(0, 15)}`, type: 'raw-step', text: rawStep }
    : rawStep;

  const showToggle = hasDiagram(step, tab);

  return (
    <div className="flex flex-col gap-2 border-l-2 border-primary/25 pl-4 py-1.5 text-sm text-foreground/85">
      <div className="flex items-start justify-between gap-3 group">
        <div className="flex-1 flex flex-col">
          <MathTextRenderer text={step.text} />
          {step.latex && (
            <div className="mt-1.5 overflow-x-auto">
              <MathTextRenderer text={`$$${step.latex}$$`} />
            </div>
          )}
        </div>
        {showToggle && (
          <button
            onClick={onToggle}
            className="mt-0.5 rounded-md p-1 text-muted-foreground hover:bg-muted/15 hover:text-primary transition-all flex items-center justify-center"
            title={isExpanded ? 'Hide Diagram' : 'Show Diagram'}
          >
            {isExpanded ? (
              <EyeOff className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Eye className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        )}
      </div>

      {showToggle && isExpanded && (
        <div className="mt-1 transition-all duration-200 ease-in-out">
          <StepDiagramRenderer step={step} tab={tab} />
        </div>
      )}
    </div>
  );
};

