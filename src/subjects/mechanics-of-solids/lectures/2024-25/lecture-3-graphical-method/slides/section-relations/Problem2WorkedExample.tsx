import React, { useContext } from 'react';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { LatexFormula, SlideParagraph, ClickReveal, ClickHighlight } from '@/features/presentation/components/elements';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { Beam2DDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';
import { ShearForceChart } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/diagrams/ShearForceChart';
import { BendingMomentChart } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/diagrams/BendingMomentChart';
import { beamConfig } from '../../beamConfig';

export const Problem2WorkedExample: React.FC = () => {
  const clickContext = useClickStepsContext();
  const { currentClick } = clickContext;
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';

  const isScrollOrBlog = viewMode === 'scroll' || viewMode === 'blog';

  const solver = React.useMemo(() => new SFDBmdService(), []);
  const solverResult = React.useMemo(() => solver.solve(beamConfig), [solver]);

  // If solved successfully, extract reactions
  const rxnA = solverResult.success ? solverResult.reactions.find(r => r.supportId === 'A' && r.type === 'R_y')?.value ?? 14.325 : 14.325;
  const rxnB = solverResult.success ? solverResult.reactions.find(r => r.supportId === 'B' && r.type === 'R_y')?.value ?? 21.675 : 21.675;

  // Determine active step
  const activeStep = isScrollOrBlog ? 4 : currentClick; // show all in scroll/blog mode

  return (
    <TwoColumnLayout
      title="Problem 2 Worked Example: Section-Cut Calculations"
      leftWidth="48%"
      leftContent={
        <div className="flex flex-col gap-3">
          {/* Registry clicks to control presentation sequence */}
          {!isScrollOrBlog && (
            <>
              <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
              <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
              <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
              <ClickReveal at={4} className="hidden">{' '}</ClickReveal>
            </>
          )}
          <div className="flex flex-col justify-center border border-border/40 bg-muted/10 rounded-xl p-2 min-h-[120px]">
            <Beam2DDrawing
              beam={beamConfig}
              showReactions={true}
              resolvedReactions={true}
              reactionAVal={`${rxnA.toFixed(3)} kN`}
              reactionBVal={`${rxnB.toFixed(3)} kN`}
              showDiscontinuities={true}
              showZones={true}
              showSections={true}
              activeStep={activeStep}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 h-[120px] border border-border/40 bg-muted/10 rounded-xl p-3">
            <div className="h-full flex flex-col">
              <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest text-center block mb-1">Shear Force Diagram (SFD)</span>
              <div className="flex-1 min-h-0">
                <ShearForceChart
                  length={beamConfig.length}
                  supports={beamConfig.supports}
                  releases={beamConfig.releases}
                  solverResult={solverResult}
                  activeStep={activeStep}
                />
              </div>
            </div>
            <div className="h-full flex flex-col">
              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest text-center block mb-1">Bending Moment Diagram (BMD)</span>
              <div className="flex-1 min-h-0">
                <BendingMomentChart
                  length={beamConfig.length}
                  supports={beamConfig.supports}
                  releases={beamConfig.releases}
                  solverResult={solverResult}
                  activeStep={activeStep}
                />
              </div>
            </div>
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-3 select-text text-left">
          <div>
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block mb-0.5">Section Cut Calculations</span>
            <h4 className="text-sm font-bold text-foreground">Equilibrium Equations by Interval</h4>
            <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-normal mt-1">
              Verify how internal shear <LatexFormula math="V(x)" /> and moment <LatexFormula math="M(x)" /> vary across the beam intervals.
            </SlideParagraph>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[220px] pr-1">
            {/* Step 0/Default: Setup */}
            {(activeStep === 0 || isScrollOrBlog) && (
              <div className="p-2 border border-border/30 rounded-lg bg-background/40 text-[11px] animate-in fade-in duration-200">
                <span className="font-bold text-indigo-500 block mb-0.5">Boundary Reactions & Load Layout:</span>
                <p className="text-muted-foreground leading-relaxed">
                  {"The beam spans 20m with a UDL (\\(w = 3\\text{ kN/m}\\)) from 5m to 12m, and a concentrated load (\\(P = 15\\text{ kN}\\)) at 17m."}
                  <br />
                  {"Reactions solved at hinges: \\(R_A = 14.325\\text{ kN}\\) and \\(R_B = 21.675\\text{ kN}\\)."}
                </p>
              </div>
            )}

            {/* Step 1: Interval 1 */}
            {(activeStep >= 1 || isScrollOrBlog) && (
              <div className="p-2 border border-border/30 rounded-lg bg-background/40 text-[11px] animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-0.5 border-b border-border/10 pb-1">
                  <span className="font-bold text-emerald-500">Interval 1: 0m ≤ x &lt; 5m</span>
                  <span className="text-[8.5px] text-muted-foreground font-mono">No Load</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-muted-foreground block">Shear Force:</span>
                    <ClickHighlight variant="paint" at={1}>
                      <LatexFormula math="V_1(x) = R_A = 14.325\text{ kN}" />
                    </ClickHighlight>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-muted-foreground block">Bending Moment:</span>
                    <ClickHighlight variant="paint" at={1}>
                      <LatexFormula math="M_1(x) = 14.325x" />
                    </ClickHighlight>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Interval 2 */}
            {(activeStep >= 2 || isScrollOrBlog) && (
              <div className="p-2 border border-border/30 rounded-lg bg-background/40 text-[11px] animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-0.5 border-b border-border/10 pb-1">
                  <span className="font-bold text-blue-500">Interval 2: 5m ≤ x &lt; 12m</span>
                  <span className="text-[8.5px] text-muted-foreground font-mono">UDL (3 kN/m)</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[8.5px] text-muted-foreground">Shear Force:</span>
                    <ClickHighlight variant="paint" at={2}>
                      <LatexFormula math="V_2(x) = 14.325 - 3(x - 5)" />
                    </ClickHighlight>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/5 pt-1">
                    <span className="text-[8.5px] text-muted-foreground">Bending Moment:</span>
                    <ClickHighlight variant="paint" at={2}>
                      <LatexFormula math="M_2(x) = 14.325x - 1.5(x - 5)^2" />
                    </ClickHighlight>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Interval 3 */}
            {(activeStep >= 3 || isScrollOrBlog) && (
              <div className="p-2 border border-border/30 rounded-lg bg-background/40 text-[11px] animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-0.5 border-b border-border/10 pb-1">
                  <span className="font-bold text-indigo-500">Interval 3: 12m ≤ x &lt; 17m</span>
                  <span className="text-[8.5px] text-muted-foreground font-mono">No Load</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-muted-foreground block">Shear Force:</span>
                    <ClickHighlight variant="paint" at={3}>
                      <LatexFormula math="V_3(x) = -6.675\text{ kN}" />
                    </ClickHighlight>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-muted-foreground block">Bending Moment:</span>
                    <ClickHighlight variant="paint" at={3}>
                      <LatexFormula math="M_3(x) = 14.325x - 21(x - 8.5)" />
                    </ClickHighlight>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Interval 4 */}
            {(activeStep >= 4 || isScrollOrBlog) && (
              <div className="p-2 border border-border/30 rounded-lg bg-background/40 text-[11px] animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-0.5 border-b border-border/10 pb-1">
                  <span className="font-bold text-rose-500">Interval 4: 17m ≤ x ≤ 20m</span>
                  <span className="text-[8.5px] text-muted-foreground font-mono">After Point Load</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[8.5px] text-muted-foreground">Shear Force:</span>
                    <ClickHighlight variant="paint" at={4}>
                      <LatexFormula math="V_4(x) = -21.675\text{ kN}" />
                    </ClickHighlight>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/5 pt-1">
                    <span className="text-[8.5px] text-muted-foreground">Bending Moment:</span>
                    <ClickHighlight variant="paint" at={4}>
                      <LatexFormula math="M_4(x) = 21.675(20 - x)" />
                    </ClickHighlight>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
};

export default Problem2WorkedExample;
