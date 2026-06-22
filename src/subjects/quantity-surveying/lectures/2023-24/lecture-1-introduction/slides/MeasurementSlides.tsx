import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ClickReveal, SlideBullet, ClickSyncedTabs, type ClickSyncedTabItem, SlideGrid, InteractiveCard, SlideParagraph, DimensionPaperGrid } from '@/features/presentation/components/elements';
import { Box, Square, Ruler, Hash } from 'lucide-react';

// Slide 23: Title Page
export const Slide23: React.FC = () => (
  <TopicDividerLayout
    title="Principles of Measurement & Setting Down Dimensions"
    topicNumber="Part 5"
    description="Core Units, Dimension Paper, and Measurement Conventions"
  />
);

// Slide 24: Core Principles of Units
export const Slide24: React.FC = () => {
  const cards = [
    {
      title: 'Cubic Measures (3D)',
      unit: 'm³ or cft',
      description: 'Used for thick, voluminous structural works requiring length, width, and depth.',
      examples: ['Earthwork / Excavation', 'Concrete pouring (Foundations, Beams, Slabs)', 'Thick brick masonry walls'],
      icon: <Box className="w-5 h-5 text-primary" />
    },
    {
      title: 'Square Measures (2D)',
      unit: 'm² or sft',
      description: 'Used for shallow, thin, or surface-area works requiring length and width or height.',
      examples: ['Wall plastering and rendering', 'Painting and surface finishing', 'Floor tiling and Damp-Proof Course (DPC)'],
      icon: <Square className="w-5 h-5 text-primary" />
    },
    {
      title: 'Linear Measures (1D)',
      unit: 'm or rft',
      description: 'Used for long, narrow structural elements measured solely by length.',
      examples: ['Skirting boards and cornices', 'Pipework and electrical conduit wiring', 'Boundary fencing and railings'],
      icon: <Ruler className="w-5 h-5 text-primary" />
    },
    {
      title: 'Enumerated Items (0D)',
      unit: 'Nos / Sets / Jobs',
      description: 'Used for discrete, countable products that are priced per single item or complete set.',
      examples: ['Doors, windows, and ventilators', 'Plumbing sanitary fixtures (basins, pans)', 'Electrical switches, fans, and light fixtures'],
      icon: <Hash className="w-5 h-5 text-primary" />
    }
  ];

  return (
    <FullWidthLayout title="Core Principles of Units of Measurement" bgVariant="default">
      <div className="flex flex-col gap-2">
        <SlideParagraph variant="plain" className="text-xs md:text-sm text-muted-foreground select-none mb-1">
          Every structural item is measured and billed under a specific dimensional unit to match its physical geometry.
        </SlideParagraph>

        <SlideGrid cols={2} gap="sm">
          {cards.map((card, idx) => (
            <ClickReveal key={idx} at={idx + 1}>
              <InteractiveCard 
                title="" 
                variant="plain" 
                className="w-full py-2.5 px-3 md:py-3 md:px-4 bg-muted/15 border-l-4 border-primary rounded-r-lg border-y-0 border-r-0"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      {card.icon}
                      <h3 className="text-xs font-bold text-foreground">{card.title}</h3>
                    </div>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                      {card.unit}
                    </span>
                  </div>
                  <SlideParagraph variant="plain" className="text-[10px] md:text-[11px] text-muted-foreground leading-snug select-text">
                    {card.description}
                  </SlideParagraph>
                  <div className="flex flex-col gap-0.5 border-t border-dashed border-border/30 pt-1.5">
                    <span className="text-[8px] uppercase font-bold text-muted-foreground/80 tracking-wider">Examples:</span>
                    <ul className="flex flex-col gap-1 pl-1 leading-tight mt-1">
                      {card.examples.map((ex, exIdx) => (
                        <SlideBullet key={exIdx} className="text-[10px] md:text-[11px] leading-snug">
                          {ex}
                        </SlideBullet>
                      ))}
                    </ul>
                  </div>
                </div>
              </InteractiveCard>
            </ClickReveal>
          ))}
        </SlideGrid>
      </div>
    </FullWidthLayout>
  );
};

// Slide 25: Anatomy of the Dimension Paper
export const Slide25: React.FC = () => {
  const tableData = [
    {
      colNum: 1 as const,
      name: 'Timesing',
      value: <span className="font-mono text-sm font-extrabold text-center text-primary/80">2 /</span>
    },
    {
      colNum: 2 as const,
      name: 'Dimension',
      value: (
        <div className="flex flex-col items-center font-mono text-xs leading-none py-0.5">
          <span>4.50</span>
          <span>3.00</span>
          <span className="border-b border-foreground/60 pb-0.5 w-6 text-center">0.15</span>
        </div>
      )
    },
    {
      colNum: 3 as const,
      name: 'Squaring',
      value: <span className="font-mono text-xs font-bold text-foreground/70">4.050</span>
    },
    {
      colNum: 4 as const,
      name: 'Description & Waste',
      value: (
        <div className="text-left text-[11px] leading-tight">
          <div className="font-bold text-primary">Concrete (1:2:4) in footing foundation</div>
          <div className="text-[10px] text-muted-foreground mt-0.5 border-t border-dashed border-border/80 pt-0.5 font-mono">
            Waste: 2/ 4.50 x 3.00 x 0.15 = 4.050 m³
          </div>
        </div>
      )
    }
  ];

  const renderLedger = (activeColNum: number) => {
    const columns = tableData.map((col) => ({
      ...col,
      isActive: activeColNum === col.colNum,
    }));

    return (
      <div className="flex flex-col gap-3 w-full">
        <span className="text-[10px] uppercase font-bold text-muted-foreground/85 tracking-widest text-center block">
          Dimension Paper Ledger Preview
        </span>
        <DimensionPaperGrid columns={columns} />
        <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground italic text-center font-mono select-none">
          Ledger columns highlight to show data mapping.
        </SlideParagraph>
      </div>
    );
  };

  const explanations: ClickSyncedTabItem[] = [
    {
      title: 'Column 1: Timesing',
      description: 'Used when there are identical or repeat items, allowing the surveyor to multiply the dimensions without writing them out multiple times.',
      badge: 'Col 1',
      badgeColor: 'border-primary/30 text-primary bg-primary/5',
      rightContent: renderLedger(1),
    },
    {
      title: 'Column 2: Dimension',
      description: (
        <span>
          Records the actual measurements. These must universally be entered in the strict order of{' '}
          <strong className="text-primary font-bold">Length, Width/Breadth, and Depth/Height</strong>.
        </span>
      ),
      badge: 'Col 2',
      badgeColor: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5',
      rightContent: renderLedger(2),
    },
    {
      title: 'Column 3: Squaring',
      description: 'Used to record the computed or calculated quantities resulting from the entered dimensions and timesing multipliers.',
      badge: 'Col 3',
      badgeColor: 'border-amber-500/30 text-amber-500 bg-amber-500/5',
      rightContent: renderLedger(3),
    },
    {
      title: 'Column 4: Description & Waste',
      description: (
        <span>
          The widest column used to compose the formal technical description of the item. Its right side is reserved for{' '}
          <strong className="text-primary font-bold">"waste"</strong>—the preliminary workings behind the entered figures.
        </span>
      ),
      badge: 'Col 4',
      badgeColor: 'border-red-500/30 text-red-500 bg-red-500/5',
      rightContent: renderLedger(4),
    },
  ];

  return (
    <ClickSyncedTabs
      title="Anatomy of the Dimension Paper"
      leftTitle="Column Definitions"
      rightTitle="Interactive Ledger Map"
      items={explanations}
      leftWidth="52%"
    />
  );
};


