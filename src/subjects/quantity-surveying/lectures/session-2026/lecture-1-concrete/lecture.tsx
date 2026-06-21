import React from 'react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { LectureCover } from '@/shared/layouts/LectureCover';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ThankYouLayout } from '@/shared/layouts/ThankYouLayout';
import { calculateConcreteVolume } from '../calculations/concrete';
import { SlideContent, SlideTable, ClickHighlight, LatexFormula, InteractiveCard, ParameterSlider, CalculationOutput } from '@/features/presentation/components/elements';
import SlideBklitChart from '@/features/presentation/components/slides/SlideBklitChart';
import { QuizCardOrchestrator } from '@/features/quiz';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

// Slide 1: Cover Slide
const Slide1: React.FC<SlideProps> = (props) => (
  <LectureCover {...props} />
);

// Slide 2: Theoretical Overview
const Slide2: React.FC = () => {
  return (
    <TwoColumnLayout
      title="Concrete Calculation Principles"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Estimating structural concrete requires{' '}
                  <ClickHighlight at={1} variant="marker">isolating total volumetric cubic meters</ClickHighlight>{' '}
                  from{' '}
                  <ClickHighlight at={2} variant="rect">internal rebar steel displacement constants</ClickHighlight>.
                </span>
              ),
            },
            {
              type: 'paragraph',
              variant: 'plain',
              revealAt: 3,
              text: (
                <InteractiveCard variant="plain" title="Volumetric Concrete Equation">
                  <div className="flex items-center gap-1.5 justify-center py-2 select-text">
                    <LatexFormula math="V = L \times W \times H \times" />
                    <ClickHighlight at={4} variant="text">
                      <LatexFormula math="(1 + \text{wastage})" />
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
              listTitle: 'Wastage Allowances',
              description: 'Standard concrete estimations require structural wastage constants:',
              items: [
                {
                  text: (
                    <span>
                      Standard structural members (beams/columns):{' '}
                      <ClickHighlight at={5} variant="paint">5% waste</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Slabs and massive casting elements:{' '}
                      <ClickHighlight at={6} variant="rect">8% waste</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Thin foundation blindings and overlays:{' '}
                      <ClickHighlight at={7} variant="paint">10% waste</ClickHighlight>
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

// Slide 3: Live Volumetric Calculator
const Slide3: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('length', 10);
  const [width, setWidth] = useUrlSyncedState<number>('width', 0.3);
  const [height, setHeight] = useUrlSyncedState<number>('height', 0.4);
  const [wastage] = useUrlSyncedState<number>('wastage', 0.05);

  const result = calculateConcreteVolume(length, width, height, wastage);

  return (
    <TwoColumnLayout
      title="Volumetric Calculation Sandbox"
      bgVariant="calculation"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Parameters (SI Meters)">
          <ParameterSlider
            label="Length:"
            value={length}
            unit="m"
            min={1}
            max={50}
            step={0.5}
            onChange={setLength}
          />
          <ParameterSlider
            label="Width:"
            value={width}
            unit="m"
            min={0.1}
            max={2}
            step={0.05}
            onChange={setWidth}
          />
          <ParameterSlider
            label="Height:"
            value={height}
            unit="m"
            min={0.1}
            max={2}
            step={0.05}
            onChange={setHeight}
          />
        </InteractiveCard>
      }
      rightContent={
        <CalculationOutput
          title="Casting Volume Output"
          value={result.volume.toFixed(3)}
          unit="m³"
          subtitle={`Automatic wastage factor multiplier: ${Math.round(wastage * 100)}%`}
        />
      }
    />
  );
};

// Slide 4: BoQ Spreadsheet View
const Slide4: React.FC = () => {
  return (
    <FullWidthLayout title="Itemized Bill of Quantities (BoQ) Template" bgVariant="gallery">
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
            '1.1',
            'Concrete cast in situ for columns (SI metrics)',
            <ClickHighlight at={1} variant="paint">12.500</ClickHighlight>,
            'm³',
            '$120.00',
            <ClickHighlight at={1} variant="rect"><span className="text-foreground font-semibold">$1,500.00</span></ClickHighlight>
          ],
          [
            '1.2',
            'Mild steel reinforcement D=12mm',
            <ClickHighlight at={2} variant="paint">920.000</ClickHighlight>,
            'kg',
            '$1.50',
            <ClickHighlight at={2} variant="rect"><span className="text-foreground font-semibold">$1,380.00</span></ClickHighlight>
          ],
        ]}
      />
    </FullWidthLayout>
  );
};

// Slide 6: Quiz Slide
const Slide6: React.FC = () => (
  <FullWidthLayout title="Concrete Estimation Check" bgVariant="gallery">
    <QuizCardOrchestrator
      quizId="qs_2026_lec1_quiz1"
      questionText="Calculate volume of concrete with dimensions: L=12m, W=0.4m, H=0.5m (wastage = 5%)."
      quizType="numeric-input"
    />
  </FullWidthLayout>
);

// Slide 7: Thank You Slide
const Slide7: React.FC = () => (
  <ThankYouLayout
    title="Thank You"
    subtitle="Do you have any question?"
  />
);

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
  5: SlideBklitChart,
  6: Slide6,
  7: Slide7,
};

export const slideMetadata: Record<number, import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata> = {
  1: { title: 'Concrete Cover', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Calculation Principles', type: 'Theory Overview', section: 'Introduction' },
  3: { title: 'Volumetric Calculator', type: 'Live Sandbox', section: 'Calculations' },
  4: { title: 'Bill of Quantities', type: 'Spreadsheet View', section: 'BoQ Summary' },
  5: { title: 'Casting Trend Chart', type: 'Data Visualization', section: 'Casting Trend' },
  6: { title: 'Estimation Quiz', type: 'Quiz Slide', section: 'Quiz', quizId: 'qs_2026_lec1_quiz1', quizVisibilityMode: 'stealth' },
  7: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
