import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import {
  LatexFormula,
  SlideList,
  ClickHighlight,
  SlideParagraph,
  ClickSyncedTabs,
  type ClickSyncedTabItem
} from '@/features/presentation/components/elements';
import { DiagramCoincidenceDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

/**
 * Slide 15: Load-Shear-Moment Differential Relationships
 */
export const Slide15: React.FC = () => {
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
 * Slide 16: Visualizing SFD/BMD Curve Slopes & Key Points
 */
export const Slide16: React.FC = () => {
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
