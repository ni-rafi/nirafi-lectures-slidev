import React from 'react';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { SlideParagraph, ClickReveal, SlideBullet, LatexFormula } from '@/features/presentation/components/elements';
import { BeamShearDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

export const ShearMechanicsSimplySupported: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  return (
    <FullWidthLayout
      title={<span>Shear Mechanics - Simply Supported Shear</span>}
    >
      <div className="w-full h-full flex flex-col justify-between gap-4 p-4 text-left select-text">
        {/* Top: Full-Width 3D Drawing with Absolute Floating Description */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-muted/5 border border-border/40 rounded-xl relative min-h-[220px]">
          {/* Floating Overview Card */}
          <div className="absolute top-4 left-4 w-[210px] h-[calc(100%-32px)] flex flex-col justify-center bg-background/95 dark:bg-slate-900/95 border border-border/50 p-4 rounded-lg shadow-sm z-20 animate-in fade-in slide-in-from-left-4 duration-300">
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block mb-0.5">Shear Deformation</span>
            <h4 className="text-xs font-bold text-foreground mb-1">Simply Supported Shear</h4>
            <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-relaxed mt-1">
              Transverse loads create sliding forces along internal vertical plane interfaces, deforming fibers and creating shear stress distributions.
            </SlideParagraph>
          </div>

          <BeamShearDrawing activeStep={step} />
          
          {/* Register clicks implicitly in the presentation click-steps */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
        </div>

        {/* Bottom Section: Three-Column Step-by-Step System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1 items-stretch">
          <ClickReveal at={1}>
            <div className="bg-rose-500/[0.015] border border-rose-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-rose-500 font-bold font-mono">1</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Transverse Shear:</strong> Vertical loading pushes adjacent slices down, creating relative sliding actions.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-amber-500/[0.015] border border-amber-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-amber-500 font-bold font-mono">2</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Shear Strain (<LatexFormula math="\gamma" />):</strong> Angle change of element corners showing rectangular cells distorted to rhombuses.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-indigo-500/[0.015] border border-indigo-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-indigo-500 font-bold font-mono">3</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Internal Shear Force (<LatexFormula math="V_{int}" />):</strong> Upward and downward resisting vectors exposed on cut faces to prevent failure.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};
