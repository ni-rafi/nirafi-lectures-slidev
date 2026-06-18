import React, { useState } from 'react';
import { TitleLayout } from '@/shared/layouts/TitleLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ThankYouLayout } from '@/shared/layouts/ThankYouLayout';
import { calculateSteelWeight } from '../calculations/steel';
import { SlideContent, SlideTable, ClickHighlight, LatexFormula, InteractiveCard, ParameterSlider, CalculationOutput } from '@/features/presentation';

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
      title="Reinforcement Steel Theory"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Reinforcement bars (rebar) are estimated in terms of{' '}
                  <ClickHighlight at={1} variant="marker">weight (kilograms or tons)</ClickHighlight>{' '}
                  rather than{' '}
                  <ClickHighlight at={2} variant="strike">length</ClickHighlight>.
                </span>
              ),
            },
            {
              type: 'paragraph',
              variant: 'plain',
              revealAt: 3,
              text: (
                <InteractiveCard variant="plain" title="Unit Weight Formula">
                  <div className="flex items-center gap-1.5 justify-center py-2 select-text">
                    <LatexFormula math="W_{\text{unit}} =" />
                    <ClickHighlight at={4} variant="text">
                      <LatexFormula math="\frac{d^2}{162} \text{ kg/m}" />
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
              listTitle: 'Standard Rebar Diameters',
              description: 'Typical diameters and corresponding unit weights:',
              items: [
                {
                  text: (
                    <span>
                      D=10mm:{' '}
                      <ClickHighlight at={5} variant="paint">0.617 kg/m</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      D=12mm:{' '}
                      <ClickHighlight at={6} variant="rect">0.888 kg/m</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      D=16mm:{' '}
                      <ClickHighlight at={7} variant="paint">1.580 kg/m</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      D=20mm:{' '}
                      <ClickHighlight at={8} variant="text">2.469 kg/m</ClickHighlight>
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

// Slide 3: Live Steel Weight Calculator
const Slide3: React.FC = () => {
  const [diameter, setDiameter] = useState(12);
  const [length, setLength] = useState(100);

  const result = calculateSteelWeight(diameter, length);

  return (
    <TwoColumnLayout
      title="Rebar Steel Calculation Sandbox"
      bgVariant="calculation"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Parameters (SI Units)">
          <ParameterSlider
            label="Rebar Diameter:"
            value={diameter}
            unit="mm"
            min={6}
            max={32}
            step={1}
            onChange={setDiameter}
          />
          <ParameterSlider
            label="Total Length:"
            value={length}
            unit="m"
            min={10}
            max={1000}
            step={10}
            onChange={setLength}
          />
        </InteractiveCard>
      }
      rightContent={
        <CalculationOutput
          title="Rebar Weight Output"
          value={result.weightKg.toFixed(3)}
          unit="kg"
          subtitle={`Estimated Unit Weight: ${((diameter * diameter) / 162).toFixed(3)} kg/m`}
        />
      }
    />
  );
};

// Slide 4: BoQ Steel View
const Slide4: React.FC = () => {
  return (
    <FullWidthLayout title="Itemized Steel Reinforcement BoQ" bgVariant="gallery">
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
            '3.1',
            'Deformed steel reinforcement bar including cutting/bending',
            <ClickHighlight at={1} variant="paint">493.800</ClickHighlight>,
            'kg',
            '$1.60',
            <ClickHighlight at={1} variant="rect"><span className="text-foreground font-semibold">$790.08</span></ClickHighlight>
          ],
        ]}
      />
    </FullWidthLayout>
  );
};

// Slide 5: Thank You Slide
const Slide5: React.FC = () => (
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
};

export const slideMetadata: Record<number, { title: string; type: string; section: string }> = {
  1: { title: 'Steel Cover', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Steel Weight Principles', type: 'Theory Overview', section: 'Introduction' },
  3: { title: 'Rebar Calculator', type: 'Live Sandbox', section: 'Calculations' },
  4: { title: 'Reinforcement BoQ', type: 'Spreadsheet View', section: 'BoQ Summary' },
  5: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
