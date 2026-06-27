import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { SlideList, ClickReveal, ClickHighlight } from '@/features/presentation/components/elements';
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
              { 
                revealAt: 1, 
                title: "1. Point-by-Point is Too Slow", 
                text: (
                  <span>
                    Solving equations at single fixed locations is <ClickHighlight at={1} variant="paint">inefficient</ClickHighlight> to map out whole beam structures.
                  </span>
                ) 
              },
              { 
                revealAt: 2, 
                title: "2. Introducing the x Coordinate", 
                text: (
                  <span>
                    Define coordinate variable <ClickHighlight at={2} variant="paint">x</ClickHighlight> measured from origin (Support A). Internal forces become continuous functions <ClickHighlight at={2} variant="paint">V(x)</ClickHighlight> and <ClickHighlight at={2} variant="paint">M(x)</ClickHighlight>.
                  </span>
                ) 
              }
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
