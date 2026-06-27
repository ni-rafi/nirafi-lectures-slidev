import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { AnalyticalProblemSolverVisualizer } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/AnalyticalProblemSolverVisualizer';
import { beamConfig } from './beamConfig';

export const DiagramOutput: React.FC = () => {
  return (
    <FullWidthLayout
      title={<span>Shear Force & Bending Moment Diagrams</span>}
    >
      <AnalyticalProblemSolverVisualizer beam={beamConfig} phase="diagrams" />
    </FullWidthLayout>
  );
};
