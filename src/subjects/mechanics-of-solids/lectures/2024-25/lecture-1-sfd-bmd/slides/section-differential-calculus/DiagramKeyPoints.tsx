import React from 'react';
import {
  LatexFormula,
  ClickHighlight,
  ClickSyncedTabs,
  type ClickSyncedTabItem
} from '@/features/presentation/components/elements';
import { DiagramCoincidenceDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

export const DiagramKeyPoints: React.FC = () => {
  const items: ClickSyncedTabItem[] = [
    {
      title: 'Shear Crosses Zero',
      badge: 'V = 0',
      badgeColor: 'border-rose-500/20 text-rose-500 bg-rose-500/5 dark:bg-rose-500/10',
      description: (
        <span>
          Bending moment curve has flat slope (<ClickHighlight variant="paint" at={0}><LatexFormula math="\frac{dM}{dx} = 0" /></ClickHighlight>), indicating local maximum bending stress.
        </span>
      ),
      rightContent: <DiagramCoincidenceDrawing activeStep={1} />,
    },
    {
      title: 'Positive Shear',
      badge: 'V > 0',
      badgeColor: 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10',
      description: (
        <span>
          Bending moment curve goes up (<ClickHighlight variant="paint" at={1}>positive slope</ClickHighlight>).
        </span>
      ),
      rightContent: <DiagramCoincidenceDrawing activeStep={2} />,
    },
    {
      title: 'Negative Shear',
      badge: 'V < 0',
      badgeColor: 'border-rose-500/20 text-rose-500 bg-rose-500/5 dark:bg-rose-500/10',
      description: (
        <span>
          Bending moment curve goes down (<ClickHighlight variant="paint" at={2}>negative slope</ClickHighlight>).
        </span>
      ),
      rightContent: <DiagramCoincidenceDrawing activeStep={3} />,
    },
  ];

  return (
    <ClickSyncedTabs
      title="Visualizing Diagram Key Points"
      leftTitle="Diagram Slope Rules"
      items={items}
      leftWidth="45%"
    />
  );
};
