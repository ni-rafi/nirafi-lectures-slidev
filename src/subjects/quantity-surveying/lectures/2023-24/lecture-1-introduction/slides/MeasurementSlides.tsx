import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ClickReveal, SlideBullet } from '@/features/presentation/components/elements';

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
      icon: (
        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    },
    {
      title: 'Square Measures (2D)',
      unit: 'm² or sft',
      description: 'Used for shallow, thin, or surface-area works requiring length and width or height.',
      examples: ['Wall plastering and rendering', 'Painting and surface finishing', 'Floor tiling and Damp-Proof Course (DPC)'],
      icon: (
        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
        </svg>
      )
    },
    {
      title: 'Linear Measures (1D)',
      unit: 'm or rft',
      description: 'Used for long, narrow structural elements measured solely by length.',
      examples: ['Skirting boards and cornices', 'Pipework and electrical conduit wiring', 'Boundary fencing and railings'],
      icon: (
        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="10" rx="1" />
          <line x1="6" y1="7" x2="6" y2="11" />
          <line x1="10" y1="7" x2="10" y2="13" />
          <line x1="14" y1="7" x2="14" y2="11" />
          <line x1="18" y1="7" x2="18" y2="13" />
        </svg>
      )
    },
    {
      title: 'Enumerated Items (0D)',
      unit: 'Nos / Sets / Jobs',
      description: 'Used for discrete, countable products that are priced per single item or complete set.',
      examples: ['Doors, windows, and ventilators', 'Plumbing sanitary fixtures (basins, pans)', 'Electrical switches, fans, and light fixtures'],
      icon: (
        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <circle cx="6.5" cy="17.5" r="3.5" />
        </svg>
      )
    }
  ];

  return (
    <FullWidthLayout title="Core Principles of Units of Measurement" bgVariant="default">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-text">
        {cards.map((card, idx) => (
          <ClickReveal key={idx} at={idx + 1} className="h-full">
            <div
              className="p-3.5 h-full rounded-xl border border-border/60 bg-card hover:bg-muted/10 transition-all duration-300 hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {card.icon}
                  <h3 className="text-xs font-bold text-foreground">{card.title}</h3>
                </div>
                <span className="bg-primary/15 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                  {card.unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal mb-2">
                {card.description}
              </p>
              <div className="flex flex-col gap-1 border-t border-border/40 pt-2">
                <span className="text-[9px] uppercase font-bold text-muted-foreground/80 tracking-wider">Examples:</span>
                <div className="flex flex-col gap-1.5 pl-1 leading-tight mt-1">
                  {card.examples.map((ex, exIdx) => (
                    <SlideBullet key={exIdx}>
                      {ex}
                    </SlideBullet>
                  ))}
                </div>
              </div>
            </div>
          </ClickReveal>
        ))}
      </div>
    </FullWidthLayout>
  );
};

// Slide 25: Anatomy of the Dimension Paper
export const Slide25: React.FC = () => {
  const [activeCol, setActiveCol] = React.useState<number | null>(null);

  const explanations = [
    {
      colNum: 1,
      title: 'Column 1 (Timesing Column)',
      desc: 'Used when there are identical or repeat items, allowing the surveyor to multiply the dimensions without writing them out multiple times.'
    },
    {
      colNum: 2,
      title: 'Column 2 (Dimension Column)',
      desc: (
        <span>
          Records the actual measurements. These must universally be entered in the strict order of{' '}
          <strong className="text-primary">Horizontal Length, Horizontal Width/Breadth, and Vertical Depth/Height</strong>.
        </span>
      )
    },
    {
      colNum: 3,
      title: 'Column 3 (Squaring Column)',
      desc: 'Used to record the computed or calculated quantities resulting from the entered dimensions and timesing multipliers.'
    },
    {
      colNum: 4,
      title: 'Column 4 (Description & Waste Column)',
      desc: (
        <span>
          The widest column used to compose the formal technical description of the item. Its right side is reserved for{' '}
          <strong className="text-primary">"waste"</strong>—the preliminary workings and structural calculations behind the entered figures.
        </span>
      )
    }
  ];

  const tableData = [
    {
      colNum: 1,
      name: 'Timesing',
      value: <span className="font-mono text-sm font-extrabold text-center text-primary/80">2 /</span>
    },
    {
      colNum: 2,
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
      colNum: 3,
      name: 'Squaring',
      value: <span className="font-mono text-xs font-bold text-foreground/70">4.050</span>
    },
    {
      colNum: 4,
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

  return (
    <FullWidthLayout title="Anatomy of the Dimension Paper" bgVariant="default">
      <div className="flex flex-col gap-4 select-text">
        {/* Explanations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {explanations.map((item) => {
            const isActive = activeCol === item.colNum;
            return (
              <ClickReveal key={item.colNum} at={item.colNum}>
                <div
                  onMouseEnter={() => setActiveCol(item.colNum)}
                  onMouseLeave={() => setActiveCol(null)}
                  onClick={() => setActiveCol(item.colNum)}
                  className={`p-2.5 h-full rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-primary/5 border-primary shadow-sm scale-[1.01]'
                      : 'bg-card border-border/60 hover:bg-muted/10'
                  }`}
                >
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-wide block mb-1">
                    {item.title}
                  </span>
                  <p className="text-xs text-muted-foreground leading-normal">
                    {item.desc}
                  </p>
                </div>
              </ClickReveal>
            );
          })}
        </div>

        {/* Dimension Paper Example Grid */}
        <div className="mt-1 flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-widest text-center block">
            Dimension Paper Example Ledger Row
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 border border-border/80 rounded-xl overflow-hidden bg-muted/10 dark:bg-muted/5 shadow-sm select-none">
            {tableData.map((col) => {
              const isActive = activeCol === col.colNum;
              return (
                <div
                  key={col.colNum}
                  onMouseEnter={() => setActiveCol(col.colNum)}
                  onMouseLeave={() => setActiveCol(null)}
                  onClick={() => setActiveCol(col.colNum)}
                  className={`flex flex-col border-r border-border/60 last:border-r-0 transition-all duration-300 cursor-pointer ${
                    isActive ? 'bg-primary/10' : 'hover:bg-muted/5'
                  }`}
                >
                  <ClickReveal at={col.colNum} className="flex flex-col h-full w-full">
                    <div className={`p-1.5 text-center text-[10px] font-extrabold uppercase border-b border-border/40 ${
                      isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground bg-muted/20'
                    }`}>
                      {col.name}
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-[60px] p-2 text-foreground/80">
                      {col.value}
                    </div>
                  </ClickReveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </FullWidthLayout>
  );
};


