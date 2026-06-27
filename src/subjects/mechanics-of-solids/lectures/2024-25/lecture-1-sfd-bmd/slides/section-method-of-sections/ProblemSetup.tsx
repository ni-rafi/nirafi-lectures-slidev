import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { AnalyticalProblemSolverVisualizer } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/AnalyticalProblemSolverVisualizer';
import { beamConfig } from './beamConfig';

export const ProblemSetup: React.FC = () => {
  return (
    <FullWidthLayout
      title={<span>Method of Sections - Problem Setup</span>}
    >
      <AnalyticalProblemSolverVisualizer beam={beamConfig} phase="setup" />
    </FullWidthLayout>
  );
};
