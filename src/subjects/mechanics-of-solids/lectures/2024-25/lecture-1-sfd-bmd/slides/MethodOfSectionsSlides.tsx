import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { LectureThankYou } from '@/shared/layouts/LectureThankYou';
import { ClickSyncedTabs, ClickHighlight, LatexFormula } from '@/features/presentation/components/elements';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { VirtualCutDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';
import { type ClickSyncedTabItem } from '@/features/presentation/components/elements';

/**
 * Slide 17: Section Divider - Internal Equations Method
 */
export const Slide17: React.FC<SlideProps> = (props) => (
  <TopicDividerLayout
    {...props}
    topicNumber="Topic 04"
    title="Analytical Calculations: The Method of Sections"
    subtitle="Surfacing internal equations V(x) and M(x) by executing virtual cuts"
  />
);

/**
 * Slide 18: Executing The Virtual Cut (Sectioning at distance x)
 */
export const Slide18: React.FC = () => {
  const beam: IBeam = {
    length: 8,
    supports: [
      { id: 'A', type: 'hinge' as const, position: 0 },
      { id: 'B', type: 'roller' as const, position: 8 }
    ],
    releases: [],
    loads: [
      { id: 'load-1', type: 'point' as const, position: 4, magnitude: 20 }
    ]
  };

  const solver = new SFDBmdService();
  const solvedBeam = solver.solve(beam);
  const reactionA = solvedBeam.reactions.find(r => r.supportId === 'A' && r.type === 'R_y')?.value ?? 10;

  const items: ClickSyncedTabItem[] = [
    {
      title: '1. Cut the Span',
      description: (
        <span>
          Slice the beam virtually at a{' '}
          <ClickHighlight variant="paint" at={0}>
            coordinate distance <LatexFormula math="x" />
          </ClickHighlight>{' '}
          from the support origin.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Sectioning Free Body Diagram (FBD)</span>
          <div className="flex-1 flex items-center justify-center">
            <VirtualCutDrawing
              activeStep={1}
              reactionForceValue={`R_A = ${reactionA} kN`}
              shearForceLabel="V(x)"
              bendingMomentLabel="M(x)"
              distanceLabel="Distance x"
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2.5 rounded-lg border border-border/50 text-[10px] text-center font-mono flex items-center justify-center gap-2 mt-2">
            <span>Equations:</span>
            <LatexFormula math={`V(x) = R_A = ${reactionA}\text{ kN}`} />
            <span>,</span>
            <LatexFormula math={`M(x) = R_A \cdot x = ${reactionA}x\text{ kNm}`} />
          </div>
        </div>
      )
    },
    {
      title: '2. Expose Actions',
      description: (
        <span>
          Expose the internal{' '}
          <ClickHighlight variant="paint" at={1}>
            shear force <LatexFormula math="V(x)" />
          </ClickHighlight>{' '}
          and internal{' '}
          <ClickHighlight variant="paint" at={1}>
            bending moment <LatexFormula math="M(x)" />
          </ClickHighlight>{' '}
          vectors on the cut face.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Sectioning Free Body Diagram (FBD)</span>
          <div className="flex-1 flex items-center justify-center">
            <VirtualCutDrawing
              activeStep={2}
              reactionForceValue={`R_A = ${reactionA} kN`}
              shearForceLabel="V(x)"
              bendingMomentLabel="M(x)"
              distanceLabel="Distance x"
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2.5 rounded-lg border border-border/50 text-[10px] text-center font-mono flex items-center justify-center gap-2 mt-2">
            <span>Equations:</span>
            <LatexFormula math={`V(x) = R_A = ${reactionA}\text{ kN}`} />
            <span>,</span>
            <LatexFormula math={`M(x) = R_A \cdot x = ${reactionA}x\text{ kNm}`} />
          </div>
        </div>
      )
    },
    {
      title: '3. Apply Equilibrium',
      description: (
        <span>
          <ClickHighlight variant="paint" at={2}>
            Sum vertical forces
          </ClickHighlight>{' '}
          and{' '}
          <ClickHighlight variant="paint" at={2}>
            take moments
          </ClickHighlight>{' '}
          at the cut section to solve for <LatexFormula math="V(x)" /> and <LatexFormula math="M(x)" />.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Sectioning Free Body Diagram (FBD)</span>
          <div className="flex-1 flex items-center justify-center">
            <VirtualCutDrawing
              activeStep={3}
              reactionForceValue={`R_A = ${reactionA} kN`}
              shearForceLabel="V(x)"
              bendingMomentLabel="M(x)"
              distanceLabel="Distance x"
            />
          </div>
          <div className="bg-emerald-500/10 dark:bg-emerald-950/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs p-2.5 rounded-lg border text-[10px] text-center font-mono flex items-center justify-center gap-2 mt-2 animate-in fade-in zoom-in-95 duration-250">
            <span>Equations:</span>
            <LatexFormula math={`V(x) = R_A = ${reactionA}\text{ kN}`} />
            <span>,</span>
            <LatexFormula math={`M(x) = R_A \cdot x = ${reactionA}x\text{ kNm}`} />
          </div>
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Executing the Virtual Cut"
      leftTitle="Sectioning Sequence"
      items={items}
      leftWidth="45%"
    />
  );
};

/**
 * Slide 19: Concluding Slide
 */
export const Slide19: React.FC<SlideProps> = (props) => (
  <LectureThankYou
    {...props}
    subtitle="Questions on Course Syllabus & Loading Matrix?"
  />
);
