import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { SlideList, ClickReveal, ClickHighlight, SlideBullet } from '@/features/presentation/components/elements';
import { IsometricSectionsBeamDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { beamConfig } from './beamConfig';

export const SixStepProtocol: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  const solver = new SFDBmdService();
  const solverResult = solver.solve(beamConfig);

  // Map step to drawing parameters
  const cutX = step >= 2 ? 6 : null;
  const showReactions = step >= 1;
  const opacitySide = step >= 3 ? 'right' : undefined;
  const showShear = step >= 5;
  const showMoment = step >= 5;

  return (
    <TwoColumnLayout
      title="The Method of Sections Protocol"
      leftWidth="52%"
      leftContent={
        <>
          {/* Implicit click registration */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={4} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={5} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={6} preset="none"><div className="hidden" /></ClickReveal>

          <SlideList
            title="The 6-Step Protocol"
            description="Framework for determining internal actions at any target point."
            revealMode="each-click"
            items={[
              { 
                revealAt: 1, 
                title: "1. Solve Reactions", 
                text: (
                  <span>
                    Treat the whole beam as a single rigid body to find <ClickHighlight at={1} variant="paint">external support reactions</ClickHighlight>.
                  </span>
                ) 
              },
              { 
                revealAt: 2, 
                title: "2. The Slice", 
                text: (
                  <span>
                    Pass an imaginary cutting plane directly through the <ClickHighlight at={2} variant="paint">target cross-section</ClickHighlight>.
                  </span>
                ) 
              },
              { 
                revealAt: 3, 
                title: "3. Segment Isolation", 
                text: (
                  <span>
                    Choose one segment (left or right) and sketch its <ClickHighlight at={3} variant="paint">isolated FBD</ClickHighlight>.
                  </span>
                ) 
              },
              { 
                revealAt: 4, 
                title: "4. Load Transfer", 
                text: (
                  <span>
                    Transfer all <ClickHighlight at={4} variant="paint">external loads</ClickHighlight> and reactions that lie within that segment.
                  </span>
                ) 
              }
            ]}
          />
        </>
      }
      rightContent={
        <div className="bg-muted/30 rounded-xl p-4 flex flex-col justify-between h-full min-h-[300px] border border-border/50 text-left">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Physical Cut Isolation</span>
            <div className="flex items-center justify-center py-2">
              <IsometricSectionsBeamDrawing
                beam={beamConfig}
                solverResult={solverResult}
                cutX={cutX}
                activeStep={step}
                showReactions={showReactions}
                opacitySide={opacitySide}
                cutVisible={step >= 2}
                showShear={showShear}
                showMoment={showMoment}
                showReactionValueA={step >= 4}
                showReactionValueB={step >= 4}
              />
            </div>
          </div>
          
          <div className="mt-2 border-t border-border/40 pt-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Equilibrium Solution</span>
            <ul className="space-y-2">
              <SlideBullet
                revealAt={5}
                title="5. Expose Internal Forces:"
                text={
                  <span>
                    Draw unknown actions (<ClickHighlight at={5} variant="paint">V, M</ClickHighlight>) at the cut face using positive conventions.
                  </span>
                }
              />
              <SlideBullet
                revealAt={6}
                title="6. Solve Equilibrium:"
                text={
                  <span>
                    Apply static balance (<ClickHighlight at={6} variant="paint">ΣFy = 0, ΣM = 0</ClickHighlight>) to calculate the unknown internal values.
                  </span>
                }
              />
            </ul>
          </div>
        </div>
      }
    />
  );
};
