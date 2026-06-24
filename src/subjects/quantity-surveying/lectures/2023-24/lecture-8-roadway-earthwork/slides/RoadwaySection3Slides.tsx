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
} from '@/features/presentation/components/elements';

// Slide 13: Section Divider
export const Slide13: React.FC = () => (
  <TopicDividerLayout
    topicNumber="04"
    title="Studio Directive & Measurement Rules"
    description="Measurement Precision, Trade Segregation, and Checkpoints"
  />
);

// Slide 14: Trades Segregation & Measurement Rules
export const Slide14: React.FC = () => {
  return (
    <TwoColumnLayout
      title="4.1 Trades Segregation & Measurement Rules"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-4">
          <SlideParagraph title="Separate Sub-Heads for Earthwork">
            Excavating (cutting) and filling (embankment) represent separate cost items and must not be lumped together in the Bill of Quantities (BoQ).
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "Excavation/Cutting Sub-Head", 
                text: "Refers to clearing natural earth to construct sub-grade channels. Soil handles are different, measured in Cubic Meter (m³)." 
              },
              { 
                title: "Filling/Embankment Sub-Head", 
                text: "Refers to importing, depositing, watering, and rolling soil to build platforms above ground. Billed in Cubic Meter (m³)." 
              }
            ]}
          />
        </div>
      }
      rightContent={
        <ClickReveal at={2} preset="up">
          <div className="h-full flex flex-col justify-center">
            <SlideCallout variant="success" title="Standard PWD Measurement Units Summary">
              <p className="mb-3 text-xs text-muted-foreground font-semibold">
                Apply standard PWD measurement precision values:
              </p>
              <SlideList
                revealMode="none"
                items={[
                  { 
                    title: "Dimension Measurements", 
                    text: <span>Measure on-site lengths, widths, and heights to exactly <span className="text-amber-500 font-bold">2 decimal places</span>.</span> 
                  },
                  { 
                    title: "Calculated Quantities (BoQ)", 
                    text: <span>Write all final volumes/areas in sessional sheets rounded to exactly <span className="text-primary font-bold">3 decimal places</span>.</span> 
                  },
                  { 
                    title: "Transit Lead/Lift Margins", 
                    text: <span>Apply PWD extra lead rates per 30m stage and lift rates per 1.5m stage.</span> 
                  }
                ]}
              />
              <p className="text-[10px] text-muted-foreground mt-4 border-t pt-2 italic">
                * Rule of Thumb: Final billing numbers in BoQs must use <ClickHighlight at={3} variant="bold" className="text-emerald-500">toFixed(3)</ClickHighlight> to prevent float leaks.
              </p>
            </SlideCallout>
          </div>
        </ClickReveal>
      }
    />
  );
};

// Slide 15: Quiz Checkpoint 1 (Roadway Cross-Section Area)
export const Slide15: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      'Calculate the cross-sectional area of a road embankment (filling) in square meters (m²) where the formation width B is 10.00m, the side slope s is 2.0:1, and the uniform fill height d is {d} m. Round your answer to exactly 3 decimal places.',
      { d: parameterResolver.lastDigit(1.5, 0.1, 'm') },
      reg
    );
    return Object.assign(qFn, {
      formula: 'Calculate the cross-sectional area of a road embankment (filling) in square meters (m²) where the formation width B is 10.00m, the side slope s is 2.0:1, and the uniform fill height d is (1.5 + [last digit] × 0.1) m. Round your final answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Roadway Cross-Section Area Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec8_q1"
          questionText={questionText}
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// Slide 16: Quiz Checkpoint 2 (Compacted Embankment Volume Correction)
export const Slide16: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      'Calculate the required raw in-situ soil excavation volume (bank measure) in cubic meters (m³) to construct a compacted roadway embankment of net design volume V_net = {V} m³, assuming a compaction shrinkage factor of 0.90. Round your answer to exactly 3 decimal places.',
      { V: parameterResolver.lastDigit(500, 10, 'm³') },
      reg
    );
    return Object.assign(qFn, {
      formula: 'Calculate the required raw in-situ soil excavation volume (bank measure) in cubic meters (m³) to construct a compacted roadway embankment of net design volume V_net = (500 + [last digit] × 10) m³, assuming a compaction shrinkage factor of 0.90. Round your final answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Compacted Embankment Soil Volume Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec8_q2"
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
    subtitle="Let's proceed to the sessional drafting exercises for roadway earthworks!"
  />
);
