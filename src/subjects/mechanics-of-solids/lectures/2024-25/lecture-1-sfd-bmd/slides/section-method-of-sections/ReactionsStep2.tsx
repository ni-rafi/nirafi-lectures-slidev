import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ClickReveal } from '@/features/presentation/components/elements';
import { AnalyticalProblemSolverVisualizer } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/AnalyticalProblemSolverVisualizer';
import { beamConfig } from './beamConfig';

export const ReactionsStep2: React.FC = () => {
  return (
    <FullWidthLayout
      title={<span>Support Reactions - Vertical Force Summation</span>}
    >
      <AnalyticalProblemSolverVisualizer beam={beamConfig} phase="reactions" stepIndex={1} />
      
      {/* 3-step reveals (Reactions/Load -> Equation LHS=RHS -> Solved values summary) */}
      <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>
    </FullWidthLayout>
  );
};
