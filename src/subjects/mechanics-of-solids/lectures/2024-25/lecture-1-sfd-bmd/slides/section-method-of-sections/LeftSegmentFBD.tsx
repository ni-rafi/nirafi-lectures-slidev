import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { SlideList, ClickReveal, LatexFormula, ClickHighlight } from '@/features/presentation/components/elements';
import { IsometricSectionsBeamDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { beamConfig } from './beamConfig';

export const LeftSegmentFBD: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  const solver = new SFDBmdService();
  const solverResult = solver.solve(beamConfig);

  return (
    <TwoColumnLayout
      title="Left-Segment Static Solution"
      leftWidth="45%"
      leftContent={
        <>
          {/* Implicit click registration */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={4} preset="none"><div className="hidden" /></ClickReveal>

          <SlideList
            title="Isolating the Left FBD"
            description="Exposing positive convention shear and moment vectors."
            revealMode="each-click"
            items={[
              { 
                revealAt: 1, 
                title: "1. Isolate and FBD Sketch", 
                text: (
                  <span>
                    Isolate the left side of the cut beam. Draw the upward reaction <ClickHighlight at={1} variant="paint">R_A = 10 kN</ClickHighlight> at origin.
                  </span>
                ) 
              },
              { 
                revealAt: 2, 
                title: "2. Positive Convention Vectors", 
                text: (
                  <span>
                    Place a downward <ClickHighlight at={2} variant="paint">V</ClickHighlight> and counter-clockwise <ClickHighlight at={2} variant="paint">M</ClickHighlight> at the exposed right-facing cut face.
                  </span>
                ) 
              },
              { revealAt: 3, title: "3. Vertical Equilibrium (ΣFy = 0)", text: (
                <div className="select-none text-left">
                  <ClickHighlight at={3} variant="paint">
                    <LatexFormula math="\Sigma F_y = 0 \implies R_A - V = 0 \implies V = 10\text{ kN}" />
                  </ClickHighlight>
                </div>
              )},
              { revealAt: 4, title: "4. Moment Equilibrium (ΣM = 0)", text: (
                <div className="select-none text-left">
                  <ClickHighlight at={4} variant="paint">
                    <LatexFormula math="\Sigma M_{\text{cut}} = 0 \implies M - R_A \cdot x = 0 \implies M = 10x" />
                  </ClickHighlight>
                </div>
              )}
            ]}
          />
        </>
      }
      rightContent={
        <div className="bg-muted/30 rounded-xl p-4 flex flex-col justify-between h-full min-h-[300px] border border-border/50 text-left">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Left Free-Body Diagram</span>
          <div className="flex-1 flex items-center justify-center">
            {/* Run with cutX=4 to show cut state, showReactionValueA=true, activeStep=0 */}
            <IsometricSectionsBeamDrawing
              beam={beamConfig}
              solverResult={solverResult}
              cutX={4}
              activeStep={step}
              showShear={step >= 2}
              showMoment={step >= 2}
              showReactionValueA={true}
              showReactionValueB={false}
            />
          </div>
        </div>
      }
    />
  );
};
