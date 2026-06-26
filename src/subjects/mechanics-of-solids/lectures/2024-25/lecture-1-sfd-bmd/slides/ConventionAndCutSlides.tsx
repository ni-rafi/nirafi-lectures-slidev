import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { LectureThankYou } from '@/shared/layouts/LectureThankYou';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import {
  LatexFormula,
  SlideList,
  ClickHighlight,
  ClickReveal,
  SlideParagraph,
  ClickSyncedTabs,
  type ClickSyncedTabItem
} from '@/features/presentation/components/elements';
import { Compass } from 'lucide-react';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import {
  ShearConventionDrawing,
  BendingMomentConventionDrawing,
  BeamLoadingSandboxDrawing,
  DiagramCoincidenceDrawing,
  VirtualCutDrawing
} from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

/**
 * Slide 7: Section Divider - Mapping Sign Conventions
 */
export const Slide7: React.FC<SlideProps> = (props) => (
  <TopicDividerLayout
    {...props}
    topicNumber="Topic 03"
    title="Sign Conventions & Loading Scenarios"
    subtitle="Mathematical conventions for shear and bending moment across isolated segments"
  />
);

/**
 * Slide 8: The Shear Force Sign Convention
 */
export const Slide8: React.FC = () => {
  const clickContext = useClickStepsContext();
  const { currentClick, setClick } = clickContext;
  const [activeSide, setActiveSide] = useUrlSyncedState<'left' | 'right'>('sfd_bmd_l1_shear_side', 'left');

  React.useEffect(() => {
    if (currentClick !== undefined) {
      setActiveSide(currentClick <= 1 ? 'left' : 'right');
    }
  }, [currentClick, setActiveSide]);

  const toggleSide = (side: 'left' | 'right') => {
    setActiveSide(side);
    setClick(side === 'left' ? 1 : 2);
  };

  const activeStep = Math.min(currentClick, 2);

  return (
    <TwoColumnLayout
      title="Shear Sign Convention"
      leftWidth="55%"
      leftContent={
        <div className="bg-muted/30 rounded-xl p-5 flex flex-col justify-between h-full min-h-[280px] border border-border/50">
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Physical Segment Isolation</span>
            <h4 className="text-xs font-bold text-foreground">Reference Frame: Cut Face Action</h4>
            <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground mt-1 leading-normal">
              Internal shear force direction is defined relative to the side of the cut we choose to inspect. Use next/prev stepping to view:
            </SlideParagraph>
          </div>
          <div className="my-4 flex justify-center">
            <ShearConventionDrawing activeStep={activeStep} activeSegment={activeSide} onSegmentClick={toggleSide} />
          </div>
          <div className="p-3 bg-indigo-500/[0.03] border border-indigo-500/20 rounded-xl text-[10px] text-indigo-600 dark:text-indigo-400 leading-normal">
            <strong>Rule of Thumb:</strong> If the shearing action rotates the segment in a **clockwise** direction, it is positive.
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full gap-4 text-left">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Compass className="h-4.5 w-4.5 text-indigo-500" />
              <span>Shear Sign Criteria</span>
            </h4>
            <div className="space-y-2">
              <ClickReveal at={1} preset="none">
                <div className={`p-3 rounded-xl border transition-all ${activeSide === 'left' ? 'bg-indigo-50/40 border-indigo-200 dark:bg-indigo-950/10' : 'opacity-55 bg-slate-50 dark:bg-slate-900/40'}`}>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block mb-0.5">Left-Hand Segment</span>
                  <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-normal">
                    A shear force pointing <strong>downward</strong> on the right-hand cut face of a left segment is positive (+ve).
                  </SlideParagraph>
                </div>
              </ClickReveal>
              <ClickReveal at={2} preset="none">
                <div className={`p-3 rounded-xl border transition-all ${activeSide === 'right' ? 'bg-indigo-50/40 border-indigo-200 dark:bg-indigo-950/10' : 'opacity-55 bg-slate-50 dark:bg-slate-900/40'}`}>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block mb-0.5">Right-Hand Segment</span>
                  <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-normal">
                    A shear force pointing <strong>upward</strong> on the left-hand cut face of a right segment is positive (+ve).
                  </SlideParagraph>
                </div>
              </ClickReveal>
            </div>
          </div>
          <div className="p-3 bg-indigo-500/[0.03] border border-indigo-500/20 rounded-xl text-[10px] text-indigo-600 dark:text-indigo-400 leading-normal">
            <strong>Rule of Thumb:</strong> If the shearing action rotates the segment in a **clockwise** direction, it is positive.
          </div>
        </div>
      }
    />
  );
};

/**
 * Slide 9: Sagging vs. Hogging (Bending Moment Sign Convention)
 */
export const Slide9: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  return (
    <TwoColumnLayout
      title="Bending Sign Convention"
      leftWidth="50%"
      leftContent={
        <div className="bg-emerald-50/40 dark:bg-emerald-950/5 border border-emerald-200/50 rounded-xl p-5 flex flex-col justify-between h-full min-h-[280px]">
          <div>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-0.5">Positive Bending Moment</span>
            <h4 className="text-xs font-bold text-foreground">Sagging (+ve Moment)</h4>
            <ClickReveal at={1} preset="none">
              <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground mt-1 leading-normal">
                Concave curvature (smiley shape). Top fibers are compressed, bottom fibers are in tension.
              </SlideParagraph>
            </ClickReveal>
          </div>
          <div className="my-4 flex justify-center">
            <BendingMomentConventionDrawing variant="sagging" isBent={currentClick >= 1} />
          </div>
          <ClickReveal at={1} preset="none">
            <div className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1.5 rounded text-center flex items-center justify-center gap-1">
              <LatexFormula math="\Sigma M_{\text{cut}} \implies \text{smiley profile } \smile" />
            </div>
          </ClickReveal>
        </div>
      }
      rightContent={
        <div className="bg-rose-50/40 dark:bg-rose-950/5 border border-rose-200/50 rounded-xl p-5 flex flex-col justify-between h-full min-h-[280px]">
          <div>
            <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block mb-0.5">Negative Bending Moment</span>
            <h4 className="text-xs font-bold text-foreground">Hogging (-ve Moment)</h4>
            <ClickReveal at={2} preset="none">
              <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground mt-1 leading-normal">
                Convex curvature (frown shape). Top fibers are in tension, bottom fibers are compressed.
              </SlideParagraph>
            </ClickReveal>
          </div>
          <div className="my-4 flex justify-center">
            <BendingMomentConventionDrawing variant="hogging" isBent={currentClick >= 2} />
          </div>
          <ClickReveal at={2} preset="none">
            <div className="text-[9px] font-mono text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2 py-1.5 rounded text-center flex items-center justify-center gap-1">
              <LatexFormula math="\Sigma M_{\text{cut}} \implies \text{frowning profile } \frown" />
            </div>
          </ClickReveal>
        </div>
      }
    />
  );
};

/**
 * Slide 10: Multi-Load Beam Scenario Sandbox
 */
export const Slide10: React.FC = () => {
  const solver = new SFDBmdService();
  const getSolvedReactions = (showPoint: boolean, showUdl: boolean) => {
    const supports = [
      { id: 'A', type: 'hinge' as const, position: 0 },
      { id: 'B', type: 'roller' as const, position: 8 }
    ];
    const loads = [];
    if (showPoint) {
      loads.push({ id: 'P', type: 'point' as const, position: 8 / 3, magnitude: 20 });
    }
    if (showUdl) {
      loads.push({ id: 'w', type: 'udl' as const, startPosition: 0, endPosition: 8, magnitude: 5 });
    }
    const beam: IBeam = { length: 8, supports, releases: [], loads };
    const solved = solver.solve(beam);
    const rxnA = solved.reactions.find(r => r.supportId === 'A' && r.type === 'R_y')?.value;
    const rxnB = solved.reactions.find(r => r.supportId === 'B' && r.type === 'R_y')?.value;
    return {
      rxnA: rxnA !== undefined && rxnA !== 0 ? `${rxnA.toFixed(1)} kN` : undefined,
      rxnB: rxnB !== undefined && rxnB !== 0 ? `${rxnB.toFixed(1)} kN` : undefined,
    };
  };

  const sc0 = getSolvedReactions(false, false);
  const sc1 = getSolvedReactions(true, false);
  const sc2 = getSolvedReactions(true, true);

  const items: ClickSyncedTabItem[] = [
    {
      title: 'Unloaded Beam',
      badge: 'Unloaded',
      badgeColor: 'border-border/60 text-muted-foreground bg-muted/10',
      description: (
        <span>
          Inspect the baseline simply supported beam without external loads.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Preview Loaded State</span>
          <div className="flex-1 flex items-center justify-center">
            <BeamLoadingSandboxDrawing
              showPointLoad={false}
              showUdl={false}
              reactionA={sc0.rxnA}
              reactionB={sc0.rxnB}
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2 rounded text-[10px] text-muted-foreground text-center font-mono mt-2">
            Active Loading: None (Unloaded)
          </div>
        </div>
      )
    },
    {
      title: 'Concentrated Point Load',
      badge: 'P = 20 kN',
      badgeColor: 'border-amber-500/20 text-amber-500 bg-amber-500/5 dark:bg-amber-500/10',
      description: (
        <span>
          Renders high-intensity vertical force at a single coordinate.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Preview Loaded State</span>
          <div className="flex-1 flex items-center justify-center">
            <BeamLoadingSandboxDrawing
              showPointLoad={true}
              showUdl={false}
              reactionA={sc1.rxnA}
              reactionB={sc1.rxnB}
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2 rounded text-[10px] text-muted-foreground text-center font-mono mt-2">
            Active Loading: Point Load (P)
          </div>
        </div>
      )
    },
    {
      title: 'Point Load + UDL',
      badge: 'P + w',
      badgeColor: 'border-rose-500/20 text-rose-500 bg-rose-500/5 dark:bg-rose-500/10',
      description: (
        <span>
          Renders standard pressure load distributed evenly along the span.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Preview Loaded State</span>
          <div className="flex-1 flex items-center justify-center">
            <BeamLoadingSandboxDrawing
              showPointLoad={true}
              showUdl={true}
              reactionA={sc2.rxnA}
              reactionB={sc2.rxnB}
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2 rounded text-[10px] text-muted-foreground text-center font-mono mt-2">
            Active Loading: Point Load (P) + UDL (w)
          </div>
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Beam Loading Sandbox"
      leftTitle="Load Configuration Panel"
      items={items}
      leftWidth="45%"
    />
  );
};

/**
 * Slide 11: Load-Shear-Moment Differential Relationships
 */
export const Slide11: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  const isLeftActive = currentClick === 1 || currentClick === 2;
  const isRightActive = currentClick === 3 || currentClick === 4;
  const hasActiveHighlight = isLeftActive || isRightActive;

  const leftClasses = `transition-all duration-300 ${
    isLeftActive ? 'scale-[1.01] z-10 shadow-sm' : hasActiveHighlight ? 'opacity-40' : ''
  }`;

  const rightClasses = `transition-all duration-300 ${
    isRightActive ? 'scale-[1.01] z-10 shadow-sm' : hasActiveHighlight ? 'opacity-40' : ''
  }`;

  return (
    <TwoColumnLayout
      title="Differential Calculus Relationships"
      leftWidth="50%"
      leftContent={
        <>
          {/* Register clicks implicitly in the presentation click-steps */}
          <ClickHighlight at={1} className="hidden">{' '}</ClickHighlight>
          <ClickHighlight at={2} className="hidden">{' '}</ClickHighlight>
          <ClickHighlight at={3} className="hidden">{' '}</ClickHighlight>
          <ClickHighlight at={4} className="hidden">{' '}</ClickHighlight>

          <SlideList
            title="Calculus Connections"
            description="Mathematical differentials linking Load (w), Shear (V), and Moment (M)."
            className={leftClasses}
            revealMode="each-click"
            items={[
              {
                revealAt: 1,
                title: "1. Shear Slope & Load",
                text: (
                  <div className="flex flex-col gap-1 mt-0.5">
                    <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-snug">
                      The rate of change of shear is negative load intensity.
                    </SlideParagraph>
                    <div className="pt-0.5 select-none">
                      <ClickHighlight variant="paint" at={1}>
                        <LatexFormula math="\frac{dV}{dx} = -w" />
                      </ClickHighlight>
                    </div>
                  </div>
                )
              },
              {
                revealAt: 2,
                title: "2. Moment Slope & Shear",
                text: (
                  <div className="flex flex-col gap-1 mt-0.5">
                    <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-snug">
                      The rate of change of bending moment is the shear force.
                    </SlideParagraph>
                    <div className="pt-0.5 select-none">
                      <ClickHighlight variant="paint" at={2}>
                        <LatexFormula math="\frac{dM}{dx} = V" />
                      </ClickHighlight>
                    </div>
                  </div>
                )
              }
            ]}
          />
        </>
      }
      rightContent={
        <SlideList
          title="Impact on Diagram Geometry"
          description="How calculus relationships define the shapes of SFD and BMD."
          className={rightClasses}
          revealMode="each-click"
          items={[
            {
              revealAt: 3,
              title: "3. Point Load Geometry",
              text: (
                <div className="flex flex-col gap-1 mt-0.5">
                  <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-relaxed">
                    Shear diagram is constant (horizontal line), while the Bending Moment curve is linear (sloped straight line).
                  </SlideParagraph>
                  <div className="text-[10px] text-indigo-500 font-bold font-mono select-none pt-0.5">
                    <ClickHighlight variant="paint" at={3}>
                      V = constant, M = linear
                    </ClickHighlight>
                  </div>
                </div>
              )
            },
            {
              revealAt: 4,
              title: "4. UDL Geometry",
              text: (
                <div className="flex flex-col gap-1 mt-0.5">
                  <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-relaxed">
                    Shear diagram is linear (sloped line), while the Bending Moment curve is quadratic (parabola curve).
                  </SlideParagraph>
                  <div className="text-[10px] text-indigo-500 font-bold font-mono select-none pt-0.5">
                    <ClickHighlight variant="paint" at={4}>
                      V = linear, M = quadratic
                    </ClickHighlight>
                  </div>
                </div>
              )
            }
          ]}
        />
      }
    />
  );
};

/**
 * Slide 12: Visualizing SFD/BMD Curve Slopes & Key Points
 */
export const Slide12: React.FC = () => {
  const items: ClickSyncedTabItem[] = [
    {
      title: 'Shear Crosses Zero',
      badge: 'V = 0',
      badgeColor: 'border-rose-500/20 text-rose-500 bg-rose-500/5 dark:bg-rose-500/10',
      description: (
        <span>
          Bending moment curve has flat slope (<ClickHighlight variant="paint" at={0}><LatexFormula math="\frac{dM}{dx} = 0" /></ClickHighlight>), indicating local maximum bending stress.
        </span>
      ),
      rightContent: <DiagramCoincidenceDrawing activeStep={1} />,
    },
    {
      title: 'Positive Shear',
      badge: 'V > 0',
      badgeColor: 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10',
      description: (
        <span>
          Bending moment curve goes up (<ClickHighlight variant="paint" at={1}>positive slope</ClickHighlight>).
        </span>
      ),
      rightContent: <DiagramCoincidenceDrawing activeStep={2} />,
    },
    {
      title: 'Negative Shear',
      badge: 'V < 0',
      badgeColor: 'border-rose-500/20 text-rose-500 bg-rose-500/5 dark:bg-rose-500/10',
      description: (
        <span>
          Bending moment curve goes down (<ClickHighlight variant="paint" at={2}>negative slope</ClickHighlight>).
        </span>
      ),
      rightContent: <DiagramCoincidenceDrawing activeStep={3} />,
    },
  ];

  return (
    <ClickSyncedTabs
      title="Visualizing Diagram Key Points"
      leftTitle="Diagram Slope Rules"
      items={items}
      leftWidth="45%"
    />
  );
};

/**
 * Slide 13: Section Divider - Internal Equations Method
 */
export const Slide13: React.FC<SlideProps> = (props) => (
  <TopicDividerLayout
    {...props}
    topicNumber="Topic 04"
    title="Analytical Calculations: The Method of Sections"
    subtitle="Surfacing internal equations V(x) and M(x) by executing virtual cuts"
  />
);

/**
 * Slide 14: Executing The Virtual Cut (Sectioning at distance x)
 */
export const Slide14: React.FC = () => {
  const beam: IBeam = {
    length: 8,
    supports: [
      { id: 'A', type: 'hinge' as const, position: 0 },
      { id: 'B', type: 'roller' as const, position: 8 }
    ],
    releases: [],
    loads: [
      { id: 'load-1', type: 'point' as const, position: 4, magnitude: 20 }
    ]
  };

  const solver = new SFDBmdService();
  const solvedBeam = solver.solve(beam);
  const reactionA = solvedBeam.reactions.find(r => r.supportId === 'A' && r.type === 'R_y')?.value ?? 10;

  const items: ClickSyncedTabItem[] = [
    {
      title: '1. Cut the Span',
      description: (
        <span>
          Slice the beam virtually at a{' '}
          <ClickHighlight variant="paint" at={0}>
            coordinate distance <LatexFormula math="x" />
          </ClickHighlight>{' '}
          from the support origin.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Sectioning Free Body Diagram (FBD)</span>
          <div className="flex-1 flex items-center justify-center">
            <VirtualCutDrawing
              activeStep={1}
              reactionForceValue={`R_A = ${reactionA} kN`}
              shearForceLabel="V(x)"
              bendingMomentLabel="M(x)"
              distanceLabel="Distance x"
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2.5 rounded-lg border border-border/50 text-[10px] text-center font-mono flex items-center justify-center gap-2 mt-2">
            <span>Equations:</span>
            <LatexFormula math={`V(x) = R_A = ${reactionA}\text{ kN}`} />
            <span>,</span>
            <LatexFormula math={`M(x) = R_A \cdot x = ${reactionA}x\text{ kNm}`} />
          </div>
        </div>
      )
    },
    {
      title: '2. Expose Actions',
      description: (
        <span>
          Expose the internal{' '}
          <ClickHighlight variant="paint" at={1}>
            shear force <LatexFormula math="V(x)" />
          </ClickHighlight>{' '}
          and internal{' '}
          <ClickHighlight variant="paint" at={1}>
            bending moment <LatexFormula math="M(x)" />
          </ClickHighlight>{' '}
          vectors on the cut face.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Sectioning Free Body Diagram (FBD)</span>
          <div className="flex-1 flex items-center justify-center">
            <VirtualCutDrawing
              activeStep={2}
              reactionForceValue={`R_A = ${reactionA} kN`}
              shearForceLabel="V(x)"
              bendingMomentLabel="M(x)"
              distanceLabel="Distance x"
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2.5 rounded-lg border border-border/50 text-[10px] text-center font-mono flex items-center justify-center gap-2 mt-2">
            <span>Equations:</span>
            <LatexFormula math={`V(x) = R_A = ${reactionA}\text{ kN}`} />
            <span>,</span>
            <LatexFormula math={`M(x) = R_A \cdot x = ${reactionA}x\text{ kNm}`} />
          </div>
        </div>
      )
    },
    {
      title: '3. Apply Equilibrium',
      description: (
        <span>
          <ClickHighlight variant="paint" at={2}>
            Sum vertical forces
          </ClickHighlight>{' '}
          and{' '}
          <ClickHighlight variant="paint" at={2}>
            take moments
          </ClickHighlight>{' '}
          at the cut section to solve for <LatexFormula math="V(x)" /> and <LatexFormula math="M(x)" />.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Sectioning Free Body Diagram (FBD)</span>
          <div className="flex-1 flex items-center justify-center">
            <VirtualCutDrawing
              activeStep={3}
              reactionForceValue={`R_A = ${reactionA} kN`}
              shearForceLabel="V(x)"
              bendingMomentLabel="M(x)"
              distanceLabel="Distance x"
            />
          </div>
          <div className="bg-emerald-500/10 dark:bg-emerald-950/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs p-2.5 rounded-lg border text-[10px] text-center font-mono flex items-center justify-center gap-2 mt-2 animate-in fade-in zoom-in-95 duration-250">
            <span>Equations:</span>
            <LatexFormula math={`V(x) = R_A = ${reactionA}\text{ kN}`} />
            <span>,</span>
            <LatexFormula math={`M(x) = R_A \cdot x = ${reactionA}x\text{ kNm}`} />
          </div>
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Executing the Virtual Cut"
      leftTitle="Sectioning Sequence"
      items={items}
      leftWidth="45%"
    />
  );
};

/**
 * Slide 15: Concluding Slide
 */
export const Slide15: React.FC<SlideProps> = (props) => (
  <LectureThankYou
    {...props}
    subtitle="Questions on Course Syllabus & Loading Matrix?"
  />
);
