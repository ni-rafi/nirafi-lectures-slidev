import React from 'react';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { SlideParagraph, ClickReveal } from '@/features/presentation/components/elements';
import { SectionIsolationDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

export const SectioningInternalForces: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  return (
    <FullWidthLayout
      title={<span>Sectioning & Internal Force Vectors</span>}
    >
      <div className="w-full flex flex-col h-full min-h-[400px] gap-2 pt-3 pb-0 px-4 text-left select-text">
        <div>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-0.5">Continuous Beam cut</span>
          <h2 className="text-lg font-bold text-foreground">Exposing Internal Action Vectors</h2>
          <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-normal">
            Take a virtual slice through the beam to expose the internal forces holding both sides in equilibrium.
          </SlideParagraph>
        </div>

        {/* 3D Beam Drawing and integrated texts */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-muted/5 border border-border/40 rounded-xl px-4 relative">
          <SectionIsolationDrawing activeStep={step} />
          
          {/* Register clicks implicitly in the presentation click-steps */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={4} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={5} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={6} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={7} preset="none"><div className="hidden" /></ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};
