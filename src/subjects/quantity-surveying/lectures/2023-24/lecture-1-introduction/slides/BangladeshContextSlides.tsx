import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { SlideContent, SlideTable, ClickHighlight, ClickReveal } from '@/features/presentation/components/elements';
import { UnitConversionInfographic } from '@/subjects/quantity-surveying/features';

// Slide 5: Title Slide for Local Applications
export const Slide5: React.FC = () => (
  <TopicDividerLayout
    title="Quantity Surveying in the Bangladesh Context"
    topicNumber="Part 2"
    description="PWD Frameworks, Local Measurement Units, and Field Book Conventions"
  />
);

// Slide 6: The Bangladesh PWD SoR Framework
export const Slide6: React.FC = () => (
  <TwoColumnLayout
    title="The PWD Schedule of Rates (SoR)"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <SlideContent
        blocks={[
          {
            type: 'paragraph',
            text: <strong>The Financial Backbone</strong>,
            revealMode: 'none',
          },
          {
            type: 'bullet',
            text: (
              <span>
                <strong>Legal Framework:</strong> Serves as the official baseline for government infrastructure budgeting and public procurement in Bangladesh.
              </span>
            ),
          },
          {
            type: 'bullet',
            text: (
              <span>
                <strong>PWD Code Structure:</strong> Organized into systematic chapters (e.g., Chapter 1: Site Facilities, Chapter 4: Earthwork, Chapter 5: Concrete, Chapter 7: Brickwork).
              </span>
            ),
          },
        ]}
      />
    }
    rightContent={
      <SlideContent
        blocks={[
          {
            type: 'paragraph',
            text: <strong>The 4 Basic Macro Materials</strong>,
            revealMode: 'none',
          },
          {
            type: 'bullet',
            text: (
              <span>
                <strong>Price Pivots:</strong> Public works budgets strictly track price fluctuations around 4 core materials monitored by the Ministry of Finance:{' '}
                <ClickHighlight at={1} variant="paint">Bricks, Cement, MS Rod (Steel), and Bitumen</ClickHighlight>.
              </span>
            ),
          },
          {
            type: 'bullet',
            text: (
              <span>
                <strong>Aggregate Quality:</strong> Local technical specifications require distinguishing between{' '}
                <ClickHighlight at={2} variant="paint">Shingle/Stone Chips</ClickHighlight> and{' '}
                <ClickHighlight at={2} variant="paint">Picked Jhama Brick Chips</ClickHighlight>.
              </span>
            ),
          },
        ]}
      />
    }
  />
);

// Slide 7: Standard Units & Conversion Drill
export const Slide7: React.FC = () => (
  <FullWidthLayout title="Standard Units & Conversion Drill" bgVariant="default">
    <UnitConversionInfographic />
  </FullWidthLayout>
);

// Slide 8: Standard Measurement Book (MB) Layout
export const Slide8: React.FC = () => (
  <FullWidthLayout title="Studio Practice: The Measurement Book (MB) Format" bgVariant="gallery">
    <SlideContent
      blocks={[
        {
          type: 'bullet',
          text: 'Universal Log Layout: Before moving to automated software tracking, Bangladeshi sub-divisional engineers record all field work manually in standard MB log layouts.',
        },
        {
          type: 'bullet',
          text: 'Anatomy of an MB Entry Table: Every row must systematically document dimensions across the standard columns shown below:',
        },
      ]}
    />
    <ClickReveal at={3}>
      <div className="mt-4 overflow-x-auto text-[13px]">
        <SlideTable
          caption="Detailed Measurement Book (MB Format)"
          headers={[
            { label: 'Item No.', align: 'left', width: '60px' },
            { label: 'Description of Work', align: 'left', width: '220px' },
            { label: 'Nos.', align: 'right', width: '40px' },
            { label: 'Length(L)', align: 'right', width: '70px' },
            { label: 'Breadth(B)', align: 'right', width: '70px' },
            { label: 'Height(H)', align: 'right', width: '60px' },
            { label: 'Quantity', align: 'right', width: '80px' },
            { label: 'Remarks', align: 'left', width: '170px' },
          ]}
          rows={[
            [
              '1',
              'Earth Work in Excavation (Foundation Trench)',
              '1',
              '35.00 m',
              '0.90 m',
              '0.90 m',
              '28.350 m³',
              'L x B x H (Cubic measure)',
            ],
            [
              '2',
              'Random Rubble Stone Masonry (Foundation & Plinth)',
              '1',
              '35.00 m',
              '0.45 m',
              '0.60 m',
              '9.450 m³',
              'L x B x H (Cubic measure)',
            ],
            [
              '3',
              'Random Rubble Dry Stone Kharanja (Under Floor)',
              '1',
              '8.00 m',
              '5.00 m',
              '0.310 m',
              '12.400 m³',
              'L x B x H (Cubic measure)',
            ],
            [
              '4',
              'M-15 Cement Concrete (Floor PCC)',
              '1',
              '8.00 m',
              '5.00 m',
              '0.20 m',
              '8.000 m³',
              'L x B x H (Cubic measure)',
            ],
            [
              '5',
              'Plaster 25mm Thick (Wall Surface)',
              '1',
              '35.00 m',
              '—',
              '0.93 m',
              '32.550 m²',
              'L x H (Square measure)',
            ],
          ]}
        />
      </div>
    </ClickReveal>
  </FullWidthLayout>
);
