import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { LatexFormula, ClickReveal, SlideParagraph } from '@/features/presentation/components/elements';
import { BendingMomentConventionDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

export const BendingMomentSignConvention: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  return (
    <TwoColumnLayout
      title="Bending Sign Convention"
      leftWidth="50%"
      leftContent={
        <div className="bg-emerald-50/40 dark:bg-emerald-950/5 border border-emerald-200/50 rounded-xl p-5 flex flex-col justify-between h-full min-h-[280px] text-left">
          <div>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-0.5">Positive Bending Moment</span>
            <h4 className="text-xs font-bold text-foreground">Sagging (+ve Moment)</h4>
            <ClickReveal at={1} preset="none">
              <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground mt-1 leading-normal">
                Concave curvature (smiley shape). Top fibers are compressed, bottom fibers are in tension.
              </SlideParagraph>
            </ClickReveal>
          </div>
          <div className="my-4 flex justify-center">
            <BendingMomentConventionDrawing variant="sagging" isBent={(currentClick ?? 0) >= 1} />
          </div>
          <ClickReveal at={1} preset="none">
            <div className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1.5 rounded text-center flex items-center justify-center gap-1 select-none">
              <LatexFormula math="\Sigma M_{\text{cut}} \implies \text{smiley profile } \smile" />
            </div>
          </ClickReveal>
        </div>
      }
      rightContent={
        <div className="bg-rose-50/40 dark:bg-rose-950/5 border border-rose-200/50 rounded-xl p-5 flex flex-col justify-between h-full min-h-[280px] text-left">
          <div>
            <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block mb-0.5">Negative Bending Moment</span>
            <h4 className="text-xs font-bold text-foreground">Hogging (-ve Moment)</h4>
            <ClickReveal at={2} preset="none">
              <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground mt-1 leading-normal">
                Convex curvature (frown shape). Top fibers are in tension, bottom fibers are compressed.
              </SlideParagraph>
            </ClickReveal>
          </div>
          <div className="my-4 flex justify-center">
            <BendingMomentConventionDrawing variant="hogging" isBent={(currentClick ?? 0) >= 2} />
          </div>
          <ClickReveal at={2} preset="none">
            <div className="text-[9px] font-mono text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2 py-1.5 rounded text-center flex items-center justify-center gap-1 select-none">
              <LatexFormula math="\Sigma M_{\text{cut}} \implies \text{frowning profile } \frown" />
            </div>
          </ClickReveal>
        </div>
      }
    />
  );
};
