import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { SlideList, ClickReveal, LatexFormula } from '@/features/presentation/components/elements';
import { MovingCutBeamDiagram } from './drawings/MovingCutBeamDiagram';

export const MomentArmPrinciple: React.FC = () => {
  return (
    <TwoColumnLayout
      title="The Moment Arm Principle"
      leftWidth="45%"
      leftContent={
        <>
          {/* Implicit click registration */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>

          <SlideList
            title="Relative Arm arm calculation"
            description="Deriving moment arms for moving cuts in subsequent zones."
            revealMode="each-click"
            items={[
              { revealAt: 1, title: "1. Variable Cuts with Fixed Loads", text: "When cutting at variable position x, the distance from Support A to the cut plane is x. A point load acts at a fixed offset distance d." },
              { revealAt: 2, title: "2. The Relative Arm (x - d)", text: "The distance from the point load to the moving cut face is the relative distance (x - d)." },
              { revealAt: 3, title: "3. Equation Incorporation", text: (
                <div className="select-none text-left font-mono">
                  <span className="text-[10px] text-slate-500 block mb-1">Moment term at cut face:</span>
                  <LatexFormula math="M_{\text{load}} = P \cdot (x - d)" />
                </div>
              )}
            ]}
          />
        </>
      }
      rightContent={
        <div className="bg-muted/30 rounded-xl p-4 flex flex-col justify-between h-full min-h-[300px] border border-border/50 text-left">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Moment Arm visual check</span>
          <div className="flex-1 flex items-center justify-center">
            <MovingCutBeamDiagram showMomentArm={true} cutPositionX={70} />
          </div>
        </div>
      }
    />
  );
};
