import React from 'react';
import { hasDiagram } from './StepDiagramRenderer';
import { Eye, EyeOff } from 'lucide-react';
import { ICalculationStep } from '../../types/stepTypes';

interface StepListHeaderProps {
  title: string;
  steps: (ICalculationStep | string)[];
  tab: string;
  expandedDiagrams: Record<string, boolean>;
  setExpandedDiagrams: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  rightElement?: React.ReactNode;
}

export const StepListHeader: React.FC<StepListHeaderProps> = ({
  title,
  steps,
  tab,
  expandedDiagrams,
  setExpandedDiagrams,
  rightElement,
}) => {
  const normalizedSteps = steps.map((s, idx) => {
    if (typeof s === 'string') {
      return { id: `${tab}-step-${idx}`, type: 'raw-step', text: s };
    }
    return s;
  });

  const diagramStepsKeys = normalizedSteps
    .map((step, idx) => ({ key: `${tab}-${idx}`, step }))
    .filter(({ step }) => hasDiagram(step, tab));

  if (diagramStepsKeys.length === 0) {
    return (
      <div className="flex items-center justify-between border-b border-border/40 pb-2.5 w-full">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">{title}</span>
          {rightElement}
        </div>
      </div>
    );
  }

  const allExpanded = diagramStepsKeys.every(({ key }) => expandedDiagrams[key]);

  const handleToggleAll = () => {
    setExpandedDiagrams(prev => {
      const next = { ...prev };
      diagramStepsKeys.forEach(({ key }) => {
        next[key] = !allExpanded;
      });
      return next;
    });
  };

  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2.5 w-full">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">{title}</span>
        {rightElement}
      </div>
      <button
        onClick={handleToggleAll}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors bg-primary/5 px-2.5 py-1 rounded border border-primary/10"
      >
        {allExpanded ? (
          <>
            <EyeOff className="h-3 w-3" />
            Hide Diagrams
          </>
        ) : (
          <>
            <Eye className="h-3 w-3" />
            Show Diagrams
          </>
        )}
      </button>
    </div>
  );
};

