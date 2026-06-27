import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ClickReveal } from '@/features/presentation/components/elements';
import { AnalyticalProblemSolverVisualizer } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/AnalyticalProblemSolverVisualizer';
import { beamConfig } from './beamConfig';

export const ReactionsStep1: React.FC = () => {
  return (
    <FullWidthLayout
      title={<span>Support Reactions - Moment about Support A</span>}
    >
      <AnalyticalProblemSolverVisualizer beam={beamConfig} phase="reactions" stepIndex={0} />
      
      {/* 5-step reveals (Pivot/Reactions -> Load Arm -> Load Moment -> Reaction Arm/Eq -> Solved Value) */}
      <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={4} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={5} preset="none"><div className="hidden" /></ClickReveal>
    </FullWidthLayout>
  );
};
