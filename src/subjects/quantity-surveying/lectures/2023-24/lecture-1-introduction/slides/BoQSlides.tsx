import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { ClickHighlight, SlideTable, SlideGrid, InteractiveCard, SlideBullet, ClickReveal } from '@/features/presentation/components/elements';

// Slide 19: Title Page
export const Slide19: React.FC = () => (
  <TopicDividerLayout title="The Bill of Quantities (BoQ)" topicNumber="Part 4" description="Origin, Structure, and Strategic Advantages" />
);

// Slide 20: Origin and Purpose of the BoQ
export const Slide20: React.FC = () => (
  <FullWidthLayout title="Origin and Purpose of the BoQ" bgVariant="default">
    <div className="flex flex-col gap-2">
      <p className="text-xs md:text-sm text-muted-foreground select-none">
        The Bill of Quantities (BoQ) translates physical designs into standard, priceable ledger items.
      </p>
      <SlideGrid cols={3} gap="md">
        <InteractiveCard title="1. Quantifying the Concept">
          <p className="text-xs text-muted-foreground leading-relaxed select-text">
            Just as a cabinet maker needs exact sizes, materials, and finishes to price a table, a building owner must have detailed quantities before placing a construction order.
          </p>
        </InteractiveCard>
        <InteractiveCard title="2. Historical Origin">
          <p className="text-xs text-muted-foreground leading-relaxed select-text">
            Historically, competing builders each measured quantities individually. To save overhead, they eventually hired a <ClickHighlight at={1} variant="paint">single surveyor to prepare one unified document</ClickHighlight> for all tenderers.
          </p>
        </InteractiveCard>
        <InteractiveCard title="3. Standardized Ledger">
          <p className="text-xs text-muted-foreground leading-relaxed select-text">
            It provides a unified, standardized pricing ledger of materials, labor, and equipment based on a <ClickHighlight at={2} variant="paint">standard method of measurement</ClickHighlight>, reducing disputes.
          </p>
        </InteractiveCard>
      </SlideGrid>
    </div>
  </FullWidthLayout>
);

// Slide 21: Anatomy & Criteria of a BoQ
export const Slide21: React.FC = () => (
  <TwoColumnLayout
    title="Anatomy &amp; Criteria of a BoQ"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <InteractiveCard title="Standard BoQ Columns" variant="default" className="w-full">
        <ul className="flex flex-col gap-3">
          <SlideBullet revealAt={1} icon={<span className="font-extrabold text-primary">1</span>}>
            <span>
              <strong>Item Code / Sl No.:</strong> <ClickHighlight at={1} variant="paint">Hierarchical numbering system</ClickHighlight> (e.g., 1.01) to catalog work sections.
            </span>
          </SlideBullet>
          <SlideBullet revealAt={2} icon={<span className="font-extrabold text-primary">2</span>}>
            <span>
              <strong>Description of Work:</strong> Clear, <ClickHighlight at={2} variant="paint">non-ambiguous description</ClickHighlight> of materials, specifications, and workmanship.
            </span>
          </SlideBullet>
          <SlideBullet revealAt={3} icon={<span className="font-extrabold text-primary">3</span>}>
            <span>
              <strong>Quantity &amp; Unit:</strong> <ClickHighlight at={3} variant="paint">Standardized spatial and structural metrics</ClickHighlight> (e.g., <strong>m³</strong>, <strong>m²</strong>, <strong>kg</strong>, <strong>Nos</strong>).
            </span>
          </SlideBullet>
          <SlideBullet revealAt={4} icon={<span className="font-extrabold text-primary">4</span>}>
            <span>
              <strong>Rate &amp; Total Amount:</strong> Financial <ClickHighlight at={4} variant="paint">BDT unit rates multiplied out</ClickHighlight> for total contract pricing.
            </span>
          </SlideBullet>
        </ul>
      </InteractiveCard>
    }
    rightContent={
      <InteractiveCard title="Criteria for Professional Production" variant="default" className="w-full">
        <ul className="flex flex-col gap-3.5">
          <SlideBullet revealAt={5} title="Construction Literacy:">
            <span>
              Accurate drawing interpretation is impossible without an <ClickHighlight at={5} variant="paint">absolute command of construction sequences</ClickHighlight>.
            </span>
          </SlideBullet>
          <SlideBullet revealAt={6} title="Execution Discipline:">
            <span>
              <ClickHighlight at={6} variant="paint">Strict accuracy, clean sorting</ClickHighlight>, and formatting neatness are required during spatial dimension entry.
            </span>
          </SlideBullet>
          <SlideBullet revealAt={7} title="Concise Summaries:">
            <span>
              Mastery of writing highly concise, technical language that <ClickHighlight at={7} variant="paint">translates 2D blueprint lines into words</ClickHighlight>.
            </span>
          </SlideBullet>
        </ul>
      </InteractiveCard>
    }
  />
);

// Slide 22: Studio Practice: HBL Bangladesh Country Office BoQ
export const Slide22: React.FC = () => (
  <TwoColumnLayout
    title="Worked Example: BoQ &amp; Schedule of Items"
    bgVariant="gallery"
    leftWidth="40%"
    leftContent={
      <div className="select-text">
        <SlideTable
          dense="tight"
          caption="Summary of Schedule of Items"
          headers={[
            { label: 'Ref', align: 'left', width: '30px' },
            { label: 'Work Section Description', align: 'left' },
            { label: 'Amount (BDT)', align: 'right', width: '90px' }
          ]}
          rows={[
            ['A', 'Civil Works', <ClickHighlight at={1} variant="paint">291,175</ClickHighlight>],
            ['B', 'Paint Works', '75,000'],
            ['C', 'Feature Panel Work', '120,000'],
            ['D', 'Partition Work', '180,000'],
            ['E', 'Floor Finishing Work', '150,000'],
            ['F', 'Ceiling Work', '95,000'],
            ['G', 'Door Work', '85,000'],
            ['H', 'Plumbing & Sanitary Work', '45,000'],
            ['I', 'Electrical Works', '140,000'],
            ['J', 'Miscellaneous Work', '35,000'],
            ['K', 'Furniture Work', '320,000'],
            [<strong>Total</strong>, <strong>Est. Fit-out Cost</strong>, <strong>1,536,175</strong>]
          ]}
        />
      </div>
    }
    rightContent={
      <div className="select-text">
        <SlideTable
          dense="relaxed"
          caption="Section A: Detailed Civil Works"
          headers={[
            { label: 'SL', align: 'left', width: '30px' },
            { label: 'Description of Work Item', align: 'left', width: '220px' },
            { label: 'QTY', align: 'right', width: '50px' },
            { label: 'Unit', align: 'left', width: '50px' },
            { label: 'Rate (BDT)', align: 'right', width: '70px' },
            { label: 'Amount (BDT)', align: 'right', width: '95px' }
          ]}
          rows={[
            [
              '1',
              <span><strong>250mm BRICK WORK:</strong> First Class Brick in cement-sand (F.M. 1.2) mortar (1:6) including racking joints, curing, and scaffolding complete.</span>,
              '880',
              'Sft',
              '140',
              <ClickHighlight at={2} variant="paint">123,200</ClickHighlight>
            ],
            [
              '2',
              <span><strong>125mm BRICK WORK:</strong> First Class Brick partition walls in cement-sand mortar (1:6) complete as per Bank standard.</span>,
              '920',
              'Sft',
              '85',
              <ClickHighlight at={3} variant="paint">78,200</ClickHighlight>
            ],
            [
              '3',
              <span><strong>PLASTER WORK:</strong> Minimum 12mm thick plaster (1:4) on walls and 6mm thick on ceiling surfaces using cement-sand mortar.</span>,
              '1,995',
              'Sft',
              '45',
              <ClickHighlight at={4} variant="paint">89,775</ClickHighlight>
            ],
            [
              '...',
              <span className="text-muted-foreground/60 italic">Remaining civil work items (damp-proof course, concrete repairs, etc.) continue...</span>,
              '...',
              '...',
              '...',
              '...'
            ]
          ]}
        />
      </div>
    }
  />
);

// Slide 23: Strategic Advantages of the BoQ
export const Slide23: React.FC = () => (
  <FullWidthLayout title="Strategic Advantages of the BoQ" bgVariant="default">
    <div className="flex flex-col gap-3 w-full">
      <p className="text-xs md:text-sm text-muted-foreground select-none mb-2">
        A professional Bill of Quantities serves critical financial, legal, and operational functions across the lifecycle of a construction project.
      </p>

      <SlideGrid cols={3} gap="md">
        <ClickReveal at={1}>
          <InteractiveCard title="1. Pre-Contract Tendering" variant="default" className="h-full">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-foreground">Competitive Baseline</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed select-text">
                Establishes a transparent, common baseline for competitive bidding, ensuring fair market rates and that all contractors bid on the{' '}
                <ClickHighlight at={2} variant="paint">exact same information</ClickHighlight>.
              </p>
            </div>
          </InteractiveCard>
        </ClickReveal>

        <ClickReveal at={3}>
          <InteractiveCard title="2. Post-Contract Construction" variant="default" className="h-full">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-foreground">Change Management</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed select-text">
                Acts as the official legal basis of rates for measured work, which is utilized to value{' '}
                <ClickHighlight at={4} variant="paint">post-contract field variations</ClickHighlight> and finalize accounts.
              </p>
            </div>
          </InteractiveCard>
        </ClickReveal>

        <ClickReveal at={5}>
          <InteractiveCard title="3. Financial Control" variant="default" className="h-full">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-foreground">Cash Flow Auditing</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed select-text">
                Serves as the primary operational document for compiling contractor progress billing and executing{' '}
                <ClickHighlight at={6} variant="paint">monthly interim payments</ClickHighlight>.
              </p>
            </div>
          </InteractiveCard>
        </ClickReveal>
      </SlideGrid>
    </div>
  </FullWidthLayout>
);
