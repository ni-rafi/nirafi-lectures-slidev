import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  ClickHighlight
} from '@/features/presentation/components/elements';
import { StirrupCountingDrawing, StirrupCountingSandbox } from '@/subjects/quantity-surveying/features';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';

// ============================================================================
// Slide 7: Section Title Deck
// ============================================================================
export const Slide7: React.FC = () => (
  <TopicDividerLayout
    topicNumber="03"
    title="Structural Element Detailing"
    subtitle="Beams, Columns, Slabs, and Transverse Reinforcement Counting"
  />
);

// ============================================================================
// Slide 8: Vertical & Horizontal Frame Detailing (Beams & Columns)
// ============================================================================
export const Slide8: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const highlight = currentClick === 1 ? 'longitudinal' : currentClick === 2 ? 'transverse' : 'none';

  return (
    <TwoColumnLayout
      title="3.1 Detailing Beams and Columns"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="space-y-4">
          <SlideParagraph title="Longitudinal vs. Transverse">
            Frame elements require tracking two distinct types of reinforcement steel.
          </SlideParagraph>
          
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "Main Longitudinal Bars", 
                text: "The primary thick bars carrying tension (beams) or compression (columns). Tracked by continuous linear length." 
              },
              { 
                title: "Transverse Reinforcement", 
                text: "Smaller bars wrapping around main steel to prevent buckling/shear. Known as 'Stirrups' in beams and 'Ties' in columns." 
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <StirrupCountingDrawing
            clearSpanM={3.0}
            spacingM={0.150}
            showAnnotation={currentClick >= 3}
            activeHighlight={highlight}
            className="flex-1"
          />
          <ClickReveal at={3} preset="up">
            <SlideCallout variant="warning" title="The Stirrup/Tie Counting Formula" className="py-1">
              <p className="mb-1 text-[10px] leading-relaxed text-center text-muted-foreground">
                Calculate the <strong>Number of Stirrups</strong> required across a specific span:
              </p>
              <div className="text-lg font-black text-center text-amber-500 my-0.5 bg-muted/30 p-2 rounded-xl border border-amber-500/20 font-mono">
                No. = ( <span className="text-primary">Clear Span</span> / <span className="text-foreground/80">Spacing</span> ) + 1
              </div>
              <p className="text-[9px] text-muted-foreground text-center">
                Example: (3000mm / 150mm) + 1 = 21 Stirrups.
              </p>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 8B: Stirrup Counting Sandbox
// ============================================================================
export const Slide8B: React.FC = () => (
  <StirrupCountingSandbox />
);

// ============================================================================
// Slide 9: Floor Slab Detailing
// ============================================================================
export const Slide9: React.FC = () => (
  <FullWidthLayout
    title="3.2 Floor Slabs: Two-Way Reinforcement"
    bgVariant="default"
  >
    <div className="grid grid-cols-2 gap-8 items-center h-full">
      {/* Left Column: Conceptual Breakdown */}
      <div className="space-y-6">
         <SlideParagraph title="Slab Steel Grids">
          Unlike columns, slab reinforcement is laid out in a grid pattern. Identifying the load-bearing direction is critical for accurate length calculations.
        </SlideParagraph>

        <SlideList
          revealMode="each-click"
          items={[
            { 
              title: "Main Reinforcement Bars", 
              text: "Placed parallel to the shorter span. They carry the primary bending moment and are placed at the bottom of the grid." 
            },
            { 
              title: "Distribution (Temperature) Bars", 
              text: "Placed parallel to the longer span, resting on top of the main bars. They distribute load and prevent shrinkage cracking." 
            }
          ]}
        />
      </div>

      {/* Right Column: Cranked Bar Complexity */}
      <div className="space-y-6">
         <ClickReveal at={1}>
            <SlideCallout variant="info" title="The Alternating Crank Rule">
               <p className="mb-4 text-xs leading-relaxed">
                 In continuous slab systems, steel is bent up (cranked) near the supports to handle negative tension. 
               </p>
               <p className="text-xs leading-relaxed">
                 When estimating the cut length of a main slab bar, you must apply the <ClickHighlight at={2} variant="bold" className="text-red-500">Crank Addition (+ 0.42D)</ClickHighlight> taught in Section 2, usually calculating for two cranks per bar.
               </p>
            </SlideCallout>
         </ClickReveal>
      </div>
    </div>
  </FullWidthLayout>
);

// ============================================================================
// Slide 8C: Quiz 3 (Stirrups Count - Numeric)
// ============================================================================
export const Slide8C: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      'A reinforced concrete beam has a clear span of {S}. The structural drawing specifies transverse stirrups spaced at exactly 125 mm center-to-center. Calculate the total number of stirrups required for this span. (Apply the start/end spacing offset rule (+1) with a 50 mm clearance offset on both ends).',
      { S: parameterResolver.lastDigit(4.350, 0.125, ' m') },
      reg
    );
    return Object.assign(qFn, {
      formula: 'A reinforced concrete beam has a clear span of (4.350 + [last digit] × 0.125) m. The structural drawing specifies transverse stirrups spaced at exactly 125 mm center-to-center. Calculate the total number of stirrups required for this span. (Apply the start/end spacing offset rule (+1) with a 50 mm clearance offset on both ends).'
    });
  }, []);

  return (
    <FullWidthLayout title="Transverse Ties Spacing Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec4_q3"
          questionText={questionText}
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};
