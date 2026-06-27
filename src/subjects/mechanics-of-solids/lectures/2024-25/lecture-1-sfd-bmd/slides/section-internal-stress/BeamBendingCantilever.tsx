import React from 'react';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { SlideParagraph, ClickReveal, SlideBullet, LatexFormula } from '@/features/presentation/components/elements';
import { CantileverBendingDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

export const BeamBendingCantilever: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  return (
    <FullWidthLayout
      title={<span>Bending Mechanics - Cantilever Bending</span>}
    >
      <div className="w-full h-full flex flex-col justify-between gap-2 p-2 px-3 text-left select-text">
        {/* Top: Full-Width 3D Drawing with Integrated Description */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-muted/5 border border-border/40 rounded-xl p-2 py-3 min-h-[180px]">
          <CantileverBendingDrawing 
            activeStep={step} 
            descriptionCard={
              <>
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block mb-0.5">Cantilever Flexion</span>
                <h4 className="text-xs font-bold text-foreground mb-1">Fixed-End Deflection Profile</h4>
                <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                  A cantilever beam fixed at one end and loaded at the tip deflects into a convex curve (hogging), inverting all stress zones compared to simple spans.
                </SlideParagraph>
              </>
            }
          />
          
          {/* Register clicks implicitly in the presentation click-steps */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
        </div>

        {/* Bottom Section: Three-Column Step-by-Step System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1 items-stretch">
          <ClickReveal at={1}>
            <div className="bg-emerald-500/[0.015] border border-emerald-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-emerald-500 font-bold font-mono">1</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Top Fibers (Tension):</strong> Undergo longitudinal elongation. Tension crack vulnerabilities form at the top surface.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={1}>
            <div className="bg-red-500/[0.015] border border-red-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-red-500 font-bold font-mono">2</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Bottom Fibers (Compression):</strong> Undergo longitudinal shortening.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-indigo-500/[0.015] border border-indigo-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-indigo-500 font-bold font-mono">3</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Fixed Wall Reactions:</strong> Develops reaction force (<LatexFormula math="R_A = P" />) and resisting moment (<LatexFormula math="M_A = P \cdot L" />) to maintain equilibrium.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};
