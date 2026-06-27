import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { SlideList, ClickReveal } from '@/features/presentation/components/elements';
import { MovingCutBeamDiagram } from './drawings/MovingCutBeamDiagram';

export const WhyFunctionsNotNumbers: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;
  
  // Cut position moves on steps: step 0: 30%, step 1: 50%, step 2: 70%
  const cutPositionX = step === 0 ? 30 : step === 1 ? 55 : 75;

  return (
    <TwoColumnLayout
      title="Continuous Diagrams & Functions"
      leftWidth="45%"
      leftContent={
        <>
          {/* Implicit click registration */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>

          <SlideList
            title="Moving from Points to Functions"
            description="Scaling the method of sections for full beam profiles."
            revealMode="each-click"
            items={[
              { revealAt: 1, title: "1. Point-by-Point is Too Slow", text: "Solving equations at single fixed locations is inefficient to map out whole beam structures." },
              { revealAt: 2, title: "2. Introducing the x Coordinate", text: "Define coordinate variable x measured from origin (Support A). Internal forces become continuous functions V(x) and M(x)." }
            ]}
          />
        </>
      }
      rightContent={
        <div className="bg-muted/30 rounded-xl p-4 flex flex-col justify-between h-full min-h-[300px] border border-border/50 text-left">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Moving Cut Reference Plane</span>
          <div className="flex-1 flex items-center justify-center">
            <MovingCutBeamDiagram showMomentArm={false} cutPositionX={cutPositionX} />
          </div>
        </div>
      }
    />
  );
};
