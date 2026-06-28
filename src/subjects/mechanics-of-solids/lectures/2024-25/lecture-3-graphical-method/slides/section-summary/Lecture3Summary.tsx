import React from 'react';
import { LectureSummaryLayout, type SummaryItem, type SummaryOutcome } from '@/shared/layouts/LectureSummaryLayout';
import { Award, Layers, BarChart2 } from 'lucide-react';

export const Lecture3Summary: React.FC = () => {
  const summaryItems: SummaryItem[] = [
    {
      title: 'Calculus Transformations',
      description: 'Differentiating shapes lowers their polynomial order, while integrating raises it (Constant ↔ Linear ↔ Parabolic).',
      icon: <Layers className="h-4.5 w-4.5" />
    },
    {
      title: 'Differential Connections',
      description: 'The slope of shear equals negative load (dV/dx = -w), and the slope of moment equals shear (dM/dx = V).',
      icon: <BarChart2 className="h-4.5 w-4.5" />
    },
    {
      title: 'Graphical Method Foundation',
      description: 'Diagram changes are computed using areas under the preceding curves (ΔV = -∫w dx and ΔM = ∫V dx).',
      icon: <Award className="h-4.5 w-4.5" />
    }
  ];

  const outcome: SummaryOutcome = {
    coCode: 'CO4 MAPPED',
    title: 'Graphical Method Analysis',
    description: 'Determine internal load profiles using graphical area-moment relationships.',
    assessmentMetric: 'Your ability to inspect diagram slopes and calculate changes in shear force and bending moment using graph areas.'
  };

  return (
    <LectureSummaryLayout
      title="Summary & Outcomes"
      summaryTitle="LECTURE SUMMARY"
      summaryItems={summaryItems}
      outcome={outcome}
    />
  );
};

export default Lecture3Summary;
