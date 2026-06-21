import React from 'react';
import { SlideSchema } from '@/features/presentation/types/schema';
import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import { ClickHighlight } from '@/features/presentation/components/elements/ClickHighlight';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

// Pure configuration-based schema definition for the lecture slide deck
export const steelLectureData: SlideSchema[] = [
  {
    id: 1,
    section: 'Introduction',
    metadata: { title: 'Steel Cover', type: 'Cover Slide' },
    layout: 'title-v2',
    props: {}
  },
  {
    id: 2,
    section: 'Introduction',
    metadata: { title: 'Steel Weight Principles', type: 'Theory Overview' },
    layout: 'twocolumn',
    props: {
      title: 'Reinforcement Steel Theory',
      bgVariant: 'default',
      leftWidth: '45%',
      leftElement: {
        type: 'composite',
        data: {
          elements: [
            {
              type: 'rich-paragraph',
              data: {
                fragments: [
                  'Reinforcement bars (rebar) are estimated in terms of ',
                  { highlight: 'weight (kilograms or tons)', at: 1, variant: 'marker' },
                  ' rather than ',
                  { highlight: 'length', at: 2, variant: 'strike' },
                  '.'
                ]
              }
            },
            {
              type: 'latex',
              config: { title: 'Unit Weight Formula' },
              data: {
                formulaParts: [
                  'W_{\\text{unit}} =',
                  { highlight: '\\frac{d^2}{162} \\text{ kg/m}', at: 4, variant: 'text' }
                ]
              }
            }
          ]
        }
      },
      rightElement: {
        type: 'list',
        data: {
          listTitle: 'Standard Rebar Diameters',
          description: 'Typical diameters and corresponding unit weights:',
          items: [
            { text: <span>D=10mm: <ClickHighlight at={5} variant="paint">0.617 kg/m</ClickHighlight></span> },
            { text: <span>D=12mm: <ClickHighlight at={6} variant="rect">0.888 kg/m</ClickHighlight></span> },
            { text: <span>D=16mm: <ClickHighlight at={7} variant="paint">1.580 kg/m</ClickHighlight></span> },
            { text: <span>D=20mm: <ClickHighlight at={8} variant="text">2.469 kg/m</ClickHighlight></span> }
          ]
        }
      }
    }
  },
  {
    id: 3,
    section: 'Calculations',
    metadata: { title: 'Steel Weight Calculation', type: 'Section Opener' },
    layout: 'topic-divider',
    props: {
      title: 'Interactive Rebar Calculations',
      subtitle: 'Section 02',
      topicNumber: 'Topic 02',
      description: 'Let us run some interactive unit weight and total weight estimates using our concrete sandbox models.'
    }
  },
  {
    id: 4,
    section: 'Calculations',
    metadata: { title: 'Rebar Calculator', type: 'Live Sandbox' },
    layout: 'twocolumn',
    props: {
      title: 'Rebar Steel Calculation Sandbox',
      bgVariant: 'calculation',
      leftWidth: '45%',
      leftElement: { type: 'rebar-calculator-inputs' },
      rightElement: { type: 'rebar-calculator-outputs' }
    }
  },
  {
    id: 5,
    section: 'BoQ Summary',
    metadata: { title: 'Reinforcement BoQ', type: 'Spreadsheet View' },
    layout: 'fullwidth',
    props: {
      title: 'Itemized Steel Reinforcement BoQ',
      bgVariant: 'gallery',
      element: {
        type: 'table',
        config: { bordered: true, striped: false, hoverable: true },
        data: {
          headers: [
            { label: 'Item No', align: 'left' },
            { label: 'Description', align: 'left' },
            { label: 'Qty', align: 'right' },
            { label: 'Unit', align: 'center' },
            { label: 'Rate', align: 'right' },
            { label: 'Amount', align: 'right' }
          ],
          rows: [
            [
              '3.1',
              'Deformed steel reinforcement bar including cutting/bending',
              <ClickHighlight at={1} variant="paint">493.800</ClickHighlight>,
              'kg',
              '$1.60',
              <ClickHighlight at={1} variant="rect"><span className="text-foreground font-semibold">$790.08</span></ClickHighlight>
            ]
          ]
        }
      }
    }
  },
  {
    id: 6,
    section: 'Quiz',
    metadata: {
      title: 'Rebar Quiz',
      type: 'Quiz Slide',
      quizId: 'qs_2026_lec3_quiz1',
      quizVisibilityMode: 'stealth'
    },
    layout: 'fullwidth',
    props: {
      title: 'Rebar Steel Weight Check',
      bgVariant: 'gallery',
      element: {
        type: 'quiz',
        config: { quizId: 'qs_2026_lec3_quiz1', quizType: 'numeric-input' },
        data: {
          question: 'Calculate total weight (kg) for 150m of 16mm rebar (round output to 3 decimal places).',
          correctAnswer: '237.037'
        }
      }
    }
  },
  {
    id: 7,
    section: 'Conclusion',
    metadata: { title: 'Conclusion', type: 'Thank You Slide' },
    layout: 'thankyou',
    props: {
      title: 'Thank You',
      subtitle: 'Do you have any question?'
    }
  }
];

// Dynamically generate individual slide renderer wrappers from the config schema
export const slides: Record<number, React.ComponentType<SlideProps>> = steelLectureData.reduce((acc, curr) => {
  acc[curr.id] = (props) => <SlideSchemaEngine {...props} slideNo={curr.id} deck={steelLectureData} />;
  return acc;
}, {} as Record<number, React.ComponentType<SlideProps>>);

// Dynamically compile metadata lookup registry mapping from the config schema
export const slideMetadata = steelLectureData.reduce((acc, curr) => {
  acc[curr.id] = {
    title: curr.metadata.title,
    type: curr.metadata.type,
    section: curr.section,
    transition: curr.metadata.transition,
    transitionDuration: curr.metadata.transitionDuration,
    quizId: curr.metadata.quizId,
    quizVisibilityMode: curr.metadata.quizVisibilityMode
  };
  return acc;
}, {} as Record<number, import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata>);
