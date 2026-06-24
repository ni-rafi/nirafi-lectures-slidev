import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  LatexFormula
} from '@/features/presentation/components/elements';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';
import { HookCrankDrawing } from '@/subjects/quantity-surveying/features/components/HookCrankDrawing';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { HooksCranksSandbox, HookGeometrySandbox, MechanicalCouplerSandbox } from '@/subjects/quantity-surveying/features';

// ============================================================================
// Slide 4: Section Title Deck
// ============================================================================
export const Slide4: React.FC = () => (
  <TopicDividerLayout
    topicNumber="02"
    title="BBS Mechanics & Geometry"
    subtitle="Calculating Bends, Hooks, Cranks, and Lap Lengths"
  />
);

// ============================================================================
// Slide 5: Hooks and Cranked Bars
// ============================================================================
export const Slide5: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const highlight = currentClick === 1 ? 'hook' : (currentClick === 2 || currentClick === 3) ? 'crank' : 'none';

  return (
    <TwoColumnLayout
      title="2.1 Mathematical Additions: Bends & Cranks"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-4">
          <SlideParagraph variant="default" title="Standard Hooks">
            Reinforcement bars rarely end in a straight cut. They are bent to anchor securely into the concrete.
          </SlideParagraph>

          <ClickReveal at={2}>
            <SlideParagraph variant="default" title="Cranked (Bent-Up) Bars" className="mt-8">
              Used heavily in slab reinforcement to handle negative bending moments at the support sections.
            </SlideParagraph>
          </ClickReveal>
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <HookCrankDrawing 
            diameterMm={16} 
            effectiveDepthM={0.120} 
            showAnnotation={true} 
            activeHighlight={highlight} 
            className="flex-1"
          />
          {currentClick <= 1 ? (
            <ClickReveal at={1} preset="up">
              <SlideCallout variant="info" title="Hook Length Addition" className="py-1">
                <p className="text-[10px] leading-snug">For a standard 180° semi-circular hook, the extra length added to the straight cut is:</p>
                <div className="text-xl font-black text-center text-primary my-1 font-mono">
                  + 9d <span className="text-xs font-normal text-muted-foreground">or</span> 10d
                </div>
                <p className="text-[9px] text-muted-foreground text-center">Where d = diameter of the bar</p>
              </SlideCallout>
            </ClickReveal>
          ) : (
            <ClickReveal at={3} preset="up">
              <SlideCallout variant="warning" title="Crank Length Addition" className="py-1">
                <p className="text-[10px] leading-snug">For a standard 45° crank, the extra cut length required is:</p>
                <div className="text-xl font-black text-center text-amber-500 my-1 font-mono">
                  + 0.42 D
                </div>
                <p className="text-[9px] text-muted-foreground text-center">
                  Where D = effective depth (Total Slab Depth - Top/Bottom Cover)
                </p>
              </SlideCallout>
            </ClickReveal>
          )}
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 5B: Hooks & Cranks Sandbox
// ============================================================================
export const Slide5B: React.FC = () => (
  <HooksCranksSandbox />
);

// ============================================================================
// Slide 6: Reinforcement Overlaps (Lap Lengths)
// ============================================================================
export const Slide6: React.FC = () => (
  <TwoColumnLayout
    title="2.2 Splice Geometry: Lap Lengths"
    bgVariant="default"
    leftWidth="40%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="The Lap Requirement">
          Recalling the <strong>12-Meter Rule</strong>: When a span is longer than a commercial bar, two bars must be tied together.
        </SlideParagraph>
        
        <ClickReveal at={1}>
          <SlideParagraph variant="plain">
            They cannot be joined end-to-end. They must overlap to safely transfer the structural load from one bar to the next through the concrete.
          </SlideParagraph>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={2} preset="up">
        <div className="flex flex-col h-full justify-center">
          <SlideCallout variant="info" title="Standard Splice Lengths">
            <p className="mb-4 text-xs leading-relaxed">
              The required overlap length depends on whether the steel is in a tension zone or a compression zone:
            </p>
            
            <SlideList
              revealMode="each-click"
              items={[
                { 
                  title: "Compression Zones (Columns)", 
                  text: <span className="text-lg font-bold text-blue-500 font-mono"><LatexFormula math="40d" /></span>,
                  icon: "ArrowDownToLine"
                },
                { 
                  title: "Tension Zones (Beams/Slabs)", 
                  text: <span className="text-lg font-bold text-red-500 font-mono"><LatexFormula math="50d" /></span>,
                  icon: "UnfoldHorizontal"
                }
              ]}
            />
            <p className="mt-4 text-[10px] text-muted-foreground italic">
              * Note: Lap lengths should always be staggered and avoided at the zone of maximum bending moment.
            </p>
          </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 5C: Quiz 2 (Hooks & Cranks Math - Numeric)
// ============================================================================
export const Slide5C: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      'A 16mm diameter rebar spans a straight distance of exactly {L}. It has standard 180° anchor hooks on both ends (9d addition per hook) and is cranked twice at 45° where the effective slab depth (D) is 110 mm. Calculate the total required cut length of the bar in meters. Round your answer to exactly 3 decimal places.',
      { L: parameterResolver.lastDigit(4.200, 0.1, ' m') },
      reg
    );
    return Object.assign(qFn, {
      formula: 'A 16mm diameter rebar spans a straight distance of exactly (4.200 + [last digit] × 0.1) m. It has standard 180° anchor hooks on both ends (9d addition per hook) and is cranked twice at 45° where the effective slab depth (D) is 110 mm. Calculate the total required cut length of the bar in meters. Round your answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Anchor Hooks & Cranks Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec4_q2"
          questionText={questionText}
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide: Hook Geometry & Bends
// ============================================================================
export const Slide_HookGeometry: React.FC = () => (
  <HookGeometrySandbox />
);

// ============================================================================
// Slide: Mechanical Splicing vs Lapping
// ============================================================================
export const Slide_MechanicalCouplers: React.FC = () => (
  <MechanicalCouplerSandbox />
);
