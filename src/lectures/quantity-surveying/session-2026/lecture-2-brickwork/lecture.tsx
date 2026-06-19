import React, { useState } from 'react';
import { TitleLayout } from '@/shared/layouts/TitleLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ThankYouLayout } from '@/shared/layouts/ThankYouLayout';
import { calculateBrickwork } from '../calculations/brickwork';
import { SlideContent, SlideTable, ClickHighlight, LatexFormula, InteractiveCard, ParameterSlider, CalculationOutput } from '@/features/presentation/components/elements';
import { QuizCardOrchestrator } from '@/features/quiz';

// Slide 1: Cover Slide
const Slide1: React.FC<any> = ({ subject, lecture }) => (
  <TitleLayout
    title={lecture.title}
    subtitle={`${subject.courseCode} Series • Session 2026-27`}
    description={lecture.description}
    footer="CE-QS Academic Department"
  />
);

// Slide 2: Theoretical Overview
const Slide2: React.FC = () => {
  return (
    <TwoColumnLayout
      title="Masonry Estimating Theory"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Brickwork estimation determines the{' '}
                  <ClickHighlight at={1} variant="marker">number of raw bricks</ClickHighlight>{' '}
                  and the{' '}
                  <ClickHighlight at={2} variant="rect">volume of wet mortar joint filling</ClickHighlight> needed.
                </span>
              ),
            },
            {
              type: 'paragraph',
              variant: 'plain',
              revealAt: 3,
              text: (
                <InteractiveCard variant="plain" title="Volumetric Mortar Equation">
                  <div className="flex items-center gap-1.5 justify-center py-2 select-text">
                    <LatexFormula math="\text{Mortar Vol} = \text{Wall Vol} -" />
                    <ClickHighlight at={4} variant="text">
                      <LatexFormula math="(\text{Bricks} \times \text{Brick Vol})" />
                    </ClickHighlight>
                  </div>
                </InteractiveCard>
              ),
            },
          ]}
        />
      }
      rightContent={
        <SlideContent
          blocks={[
            {
              type: 'list',
              listTitle: 'Standard Brick Dimensions',
              description: 'Typical sizes used in masonry work calculations:',
              items: [
                {
                  text: (
                    <span>
                      Length:{' '}
                      <ClickHighlight at={5} variant="paint">0.240m (240mm)</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Width:{' '}
                      <ClickHighlight at={6} variant="rect">0.115m (115mm)</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Height:{' '}
                      <ClickHighlight at={7} variant="paint">0.070m (70mm)</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Standard mortar joint width:{' '}
                      <ClickHighlight at={8} variant="text">0.010m (10mm)</ClickHighlight>
                    </span>
                  ),
                },
              ],
            },
          ]}
        />
      }
    />
  );
};

// Slide 3: Live Masonry Calculator
const Slide3: React.FC = () => {
  const [area, setArea] = useState(15);
  const [thickness, setThickness] = useState(0.24);
  const [mortar, setMortar] = useState(0.01);

  const result = calculateBrickwork(area, thickness, 0.24, 0.115, 0.07, mortar);

  return (
    <TwoColumnLayout
      title="Masonry Calculation Sandbox"
      bgVariant="calculation"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Parameters (SI Meters)">
          <ParameterSlider
            label="Wall Surface Area:"
            value={area}
            unit="m²"
            min={1}
            max={100}
            step={1}
            onChange={setArea}
          />
          <ParameterSlider
            label="Wall Thickness:"
            value={thickness}
            unit="m"
            min={0.115}
            max={0.5}
            step={0.005}
            onChange={setThickness}
          />
          <ParameterSlider
            label="Mortar Joints:"
            value={mortar}
            unit="mm"
            min={0.005}
            max={0.02}
            step={0.001}
            displayValue={`${Math.round(mortar * 1000)}mm`}
            onChange={setMortar}
          />
        </InteractiveCard>
      }
      rightContent={
        <div className="flex flex-col gap-4 h-full justify-center">
          <CalculationOutput
            title="Bricks Output"
            value={result.brickCount}
            unit="Bricks"
          />
          <CalculationOutput
            title="Mortar Output"
            value={result.mortarVolume.toFixed(3)}
            unit="m³"
          />
        </div>
      }
    />
  );
};

// Slide 4: BoQ Brickwork View
const Slide4: React.FC = () => {
  return (
    <FullWidthLayout title="Itemized Brickwork Bill of Quantities" bgVariant="gallery">
      <SlideTable
        headers={[
          { label: 'Item No', align: 'left' },
          { label: 'Description', align: 'left' },
          { label: 'Qty', align: 'right' },
          { label: 'Unit', align: 'center' },
          { label: 'Rate', align: 'right' },
          { label: 'Amount', align: 'right' },
        ]}
        rows={[
          [
            '2.1',
            'First class brickwork in 1:4 cement sand mortar',
            <ClickHighlight at={1} variant="paint">15.000</ClickHighlight>,
            'm³',
            '$150.00',
            <ClickHighlight at={1} variant="rect"><span className="text-foreground font-semibold">$2,250.00</span></ClickHighlight>
          ],
        ]}
      />
    </FullWidthLayout>
  );
};

// Slide 5: Quiz Slide
const Slide5: React.FC = () => (
  <FullWidthLayout title="Masonry Quantity Quiz" bgVariant="gallery">
    <QuizCardOrchestrator
      quizId="qs_2026_lec2_quiz1"
      questionText="Calculate brick count for wall area = 20m², thickness = 0.24m (wastage = 5%, brick size = 240x115x70mm with 10mm joints)."
      correctAnswer="2625"
      quizType="numeric-input"
    />
  </FullWidthLayout>
);

// Slide 6: Thank You Slide
const Slide6: React.FC = () => (
  <ThankYouLayout
    title="Thank You"
    subtitle="Do you have any question?"
  />
);

export const slides: Record<number, React.ComponentType<any>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
  5: Slide5,
  6: Slide6,
};

export const slideMetadata: Record<number, { title: string; type: string; section: string }> = {
  1: { title: 'Brickwork Cover', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Masonry Principles', type: 'Theory Overview', section: 'Introduction' },
  3: { title: 'Masonry Calculator', type: 'Live Sandbox', section: 'Calculations' },
  4: { title: 'Masonry BoQ', type: 'Spreadsheet View', section: 'BoQ Summary' },
  5: { title: 'Masonry Quiz', type: 'Quiz Slide', section: 'Quiz' },
  6: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
