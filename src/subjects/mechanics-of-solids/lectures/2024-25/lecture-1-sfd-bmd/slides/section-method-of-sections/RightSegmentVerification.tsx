import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { SlideList, ClickReveal, LatexFormula, ClickHighlight } from '@/features/presentation/components/elements';
import { IsometricSectionsBeamDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { beamConfig } from './beamConfig';

export const RightSegmentVerification: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  const solver = new SFDBmdService();
  const solverResult = solver.solve(beamConfig);

  return (
    <TwoColumnLayout
      title="Right-Segment Verification"
      leftWidth="45%"
      leftContent={
        <>
          {/* Implicit click registration */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>

          <SlideList
            title="Isolating the Right FBD"
            description="Proving segment selection yields identical answers."
            revealMode="each-click"
            items={[
              { 
                revealAt: 1, 
                title: "1. Complementary Conventions", 
                text: (
                  <span>
                    Isolate the right side. Place an upward <ClickHighlight at={1} variant="paint">V</ClickHighlight> and a clockwise <ClickHighlight at={1} variant="paint">M</ClickHighlight> on the left-facing cut face.
                  </span>
                ) 
              },
              { revealAt: 2, title: "2. Equilibrium Verification", text: (
                <div className="select-none text-left space-y-1 font-mono text-[10px]">
                  <ClickHighlight at={2} variant="paint">
                    <LatexFormula math="\Sigma F_y = 0 \implies V + R_B - P = 0 \implies V = 20 - 10 = 10\text{ kN}" />
                  </ClickHighlight>
                  <br />
                  <ClickHighlight at={2} variant="paint">
                    <LatexFormula math="\Sigma M_{\text{cut}} = 0 \implies -M + R_B \cdot (16-x) - P \cdot (8-x) = 0" />
                  </ClickHighlight>
                </div>
              )},
              { 
                revealAt: 3, 
                title: "3. Choice is Mathematical Convenience", 
                text: (
                  <span>
                    Both left and right FBDs yield the exact same internal forces. Pick the <ClickHighlight at={3} variant="paint">simpler FBD</ClickHighlight> with fewer loads.
                  </span>
                ) 
              }
            ]}
          />
        </>
      }
      rightContent={
        <div className="bg-muted/30 rounded-xl p-4 flex flex-col justify-between h-full min-h-[300px] border border-border/50 text-left">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Right Free-Body Diagram</span>
          <div className="flex-1 flex items-center justify-center">
            <IsometricSectionsBeamDrawing
              beam={beamConfig}
              solverResult={solverResult}
              cutX={4}
              activeStep={step}
              opacitySide="left"
              showShear={step >= 2}
              showMoment={step >= 2}
              showReactionValueA={false}
              showReactionValueB={true}
            />
          </div>
        </div>
      }
    />
  );
};

