import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ThankYouLayout } from '@/shared/layouts/ThankYouLayout';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import {
  SlideParagraph,
  SlideList,
  SlideCallout,
  ClickReveal,
  ClickHighlight,
  InteractiveCard,
  SlideBadge,
} from '@/features/presentation/components/elements';

// Slide 13: Section Divider
export const Slide13: React.FC = () => (
  <TopicDividerLayout
    topicNumber="03"
    title="PWD SoR Integration & Measurement Rules"
    description="Segregating Trades, Standard Procurement Units, and Checkpoints"
  />
);

// Slide 14: Trade Segregation
export const Slide14: React.FC = () => {
  return (
    <TwoColumnLayout
      title="3.1 Dissecting Structural Trades vs. Sanitary Items"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-4">
          <SlideParagraph title="The Double-Entry Threat">
            Hydraulic structures contain both heavy masonry/concrete and plumbing utilities. Quantity surveyors must track which trade absorbs which material cost.
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            items={[
              { title: "Civil/Structural Sub-Heads", text: "Absorbs excavation, form shoring, structural concrete, reinforcement steel, partition masonry, and waterproof plastering." },
              { title: "Sanitary/Plumbing Sub-Heads", text: "Isolates active fixtures, inlet/outlet tees, pipe sleeves, custom puddles, and vent lines." }
            ]}
          />
        </div>
      }
      rightContent={
        <ClickReveal at={2} preset="up">
          <div className="h-full flex flex-col justify-center">
            <SlideCallout variant="success" title="Standard PWD Measurement Units Summary">
              <p className="mb-3 text-xs text-muted-foreground font-semibold">
                Allocate the precise units matching the PWD Schedule:
              </p>
              <SlideList
                revealMode="none"
                items={[
                  { title: "Excavation, Concrete Shell & Masonry", text: <span className="text-primary font-bold">Cubic Meter (m³)</span> },
                  { title: "Interior Plaster Coating & Shoring", text: <span className="text-amber-500 font-bold">Square Meter (m²)</span> },
                  { title: "Sanitary Tee Fittings & CI Covers", text: <span className="text-emerald-500 font-bold">Numbers (Nos.)</span> }
                ]}
              />
              <p className="text-[10px] text-muted-foreground mt-4 border-t pt-2 italic">
                * Golden Rule: Round final BoQ item entries to exactly <ClickHighlight at={3} variant="bold" className="text-amber-500">3 decimal places</ClickHighlight> to eliminate floating anomalies.
              </p>
            </SlideCallout>
          </div>
        </ClickReveal>
      }
    />
  );
};

// Slide 15: Quiz Checkpoint 1 (Reservoir Excavation Volume)
export const Slide15: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      'Calculate the total excavation volume in cubic meters (m³) for an underground water reservoir where the net base slab is 6.50m long, 4.50m wide, the perimeter clearance c is 0.50m, and the excavation depth H is {H} m. Round your final answer to exactly 3 decimal places.',
      { H: parameterResolver.lastDigit(2.0, 0.1, 'm') },
      reg
    );
    return Object.assign(qFn, {
      formula: 'Calculate the total excavation volume in cubic meters (m³) for an underground water reservoir where the net base slab is 6.50m long, 4.50m wide, the perimeter clearance c is 0.50m, and the excavation depth H is (2.0 + [last digit] × 0.1) m. Round your final answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Reservoir Excavation Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec7_q1"
          questionText={questionText}
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// Slide 16: Quiz Checkpoint 2 (Soak Pit Loose Aggregates)
export const Slide16: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      'Calculate the loose aggregate volume in cubic meters (m³) required to pack a circular soak pit of diameter 2.00 m and depth H = {H} m, assuming a compaction factor of 1.33. Round your final answer to exactly 3 decimal places.',
      { H: parameterResolver.lastDigit(2.5, 0.1, 'm') },
      reg
    );
    return Object.assign(qFn, {
      formula: 'Calculate the loose aggregate volume in cubic meters (m³) required to pack a circular soak pit of diameter 2.00 m and depth H = (2.5 + [last digit] × 0.1) m, assuming a compaction factor of 1.33. Round your final answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Soak Pit Aggregates Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec7_q2"
          questionText={questionText}
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// Slide 17: Thank You / Conclusion
export const Slide17: React.FC<SlideProps> = () => (
  <ThankYouLayout
    title="Thank You"
    subtitle="Let's proceed to the lab exercise for Water Reservoirs & Septic Tanks!"
  />
);

// Slide: Quizzes Divider
export const QuizzesDividerSlide: React.FC = () => (
  <TopicDividerLayout
    topicNumber="04"
    title="Interactive Checkpoints"
    description="Evaluating Take-off Math and Precision Rounding Rules"
  />
);

// Slide: Submission Divider
export const SubmissionDividerSlide: React.FC = () => (
  <TopicDividerLayout
    topicNumber="05"
    title="Lab Submission Directives"
    description="Individual Accountability, Precision Rounding, and Course Outcome Mapping"
  />
);

// Slide: Submission Directives
export const SubmissionDirectivesSlide: React.FC = () => (
  <TwoColumnLayout
    title="Lab Report 7: Submission Directives"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <div className="flex flex-col gap-4">
        <InteractiveCard title="Submission Rules">
          <SlideList
            revealMode="none"
            variant="plain"
            items={[
              {
                icon: "📝",
                text: (
                  <span>
                    <strong>Individual Submissions:</strong> Although calculations are executed collaboratively in studio teams, the take-off report submission is strictly individual.
                  </span>
                ),
              },
              {
                icon: "📏",
                text: (
                  <span>
                    <strong>Precision Rounding:</strong> Maintain 4 decimal places during intermediate steps; round all final BoQ item quantities strictly to <strong>3 decimal places</strong>.
                  </span>
                ),
              },
            ]}
          />
        </InteractiveCard>
      </div>
    }
    rightContent={
      <div className="flex flex-col justify-center h-full select-text">
        <InteractiveCard title="Course Outcome Alignment">
          <div className="flex flex-col gap-2.5 text-left">
            <SlideBadge variant="info" label="CO2 Mapped" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This studio session directly maps to <strong>CO2 (Prepare Bill of Quantities)</strong>:
            </p>
            <div className="p-3 bg-muted rounded-xl border border-border/40 text-xs leading-relaxed text-foreground font-semibold">
              "Prepare the bill of quantity for different work packages of a civil engineering project."
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              Your ability to interpret 2D elevations, coordinate load paths, and apply standard deduction rules is the core assessment metric.
            </p>
          </div>
        </InteractiveCard>
      </div>
    }
  />
);
