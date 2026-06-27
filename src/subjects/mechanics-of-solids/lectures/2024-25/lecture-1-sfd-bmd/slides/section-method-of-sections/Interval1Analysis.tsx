import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ClickReveal } from '@/features/presentation/components/elements';
import { AnalyticalProblemSolverVisualizer } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/AnalyticalProblemSolverVisualizer';
import { beamConfig } from './beamConfig';

export const Interval1Analysis: React.FC = () => {
  return (
    <FullWidthLayout title={<span>Section Method - Interval 1 (0 &le; x &le; 8 m)</span>}>
      <AnalyticalProblemSolverVisualizer beam={beamConfig} phase="sections" stepIndex={1} />
      
      {/* 5-step click reveals (Cut -> Shear Arm/Label -> Shear Card -> Moment Arc/Label -> Moment Card) */}
      <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={4} preset="none"><div className="hidden" /></ClickReveal>
      <ClickReveal at={5} preset="none"><div className="hidden" /></ClickReveal>
    </FullWidthLayout>
  );
};
