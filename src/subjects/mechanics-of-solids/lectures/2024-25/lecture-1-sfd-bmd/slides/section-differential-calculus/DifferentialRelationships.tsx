import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import {
  LatexFormula,
  SlideList,
  ClickHighlight,
  SlideParagraph
} from '@/features/presentation/components/elements';

export const DifferentialRelationships: React.FC = () => {
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
                  <div className="flex flex-col gap-1 mt-0.5 text-left select-text">
                    <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-snug">
                      The rate of change of shear is negative load intensity.
                    </SlideParagraph>
                    <div className="pt-0.5 select-none text-left">
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
                  <div className="flex flex-col gap-1 mt-0.5 text-left select-text">
                    <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-snug">
                      The rate of change of bending moment is the shear force.
                    </SlideParagraph>
                    <div className="pt-0.5 select-none text-left">
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
                <div className="flex flex-col gap-1 mt-0.5 text-left select-text">
                  <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-relaxed">
                    Shear diagram is constant (horizontal line), while the Bending Moment curve is linear (sloped straight line).
                  </SlideParagraph>
                  <div className="text-[10px] text-indigo-500 font-bold font-mono select-none pt-0.5 text-left">
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
                <div className="flex flex-col gap-1 mt-0.5 text-left select-text">
                  <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-relaxed">
                    Shear diagram is linear (sloped line), while the Bending Moment curve is quadratic (parabola curve).
                  </SlideParagraph>
                  <div className="text-[10px] text-indigo-500 font-bold font-mono select-none pt-0.5 text-left">
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
