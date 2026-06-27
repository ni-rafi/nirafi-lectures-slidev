import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { AnalyticalProblemSolverVisualizer } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/AnalyticalProblemSolverVisualizer';
import { beamConfig } from './beamConfig';

export const Consolidation: React.FC = () => {
  return (
    <FullWidthLayout
      title={<span>Differential Relationships - Consolidation</span>}
    >
      <AnalyticalProblemSolverVisualizer beam={beamConfig} phase="consolidation" />
    </FullWidthLayout>
  );
};
