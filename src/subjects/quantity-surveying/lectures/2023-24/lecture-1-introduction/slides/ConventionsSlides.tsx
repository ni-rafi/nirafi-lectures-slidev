import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';

// Slide 26: Measurement Conventions & Techniques
export const Slide26: React.FC = () => {
  const [activeConvention, setActiveConvention] = React.useState<number>(0);

  const conventions = [
    {
      title: 'Timesing & Dotting On',
      desc: 'Allows the surveyor to multiply repeating items. "Timesing" multiplies items (e.g., 2/), while "Dotting on" adds extra items to a multiplier (e.g., a dot adds 1).',
      sample: (
        <div className="flex flex-col gap-2 w-full text-center">
          <div className="border border-border/40 rounded bg-muted/10 dark:bg-muted/5 p-2 font-mono text-xs">
            <div className="text-primary/70 border-b border-border/40 pb-1 font-bold">LEDGER VIEW</div>
            <div className="py-2 flex justify-center items-center gap-4">
              <span className="text-base font-extrabold text-primary">2 /</span>
              <span className="text-muted-foreground text-[11px]">(Timesing: 2 times the dimensions)</span>
            </div>
            <div className="py-2 border-t border-dashed border-border/40 flex justify-center items-center gap-4">
              <span className="text-base font-extrabold text-primary">2. /</span>
              <span className="text-muted-foreground text-[11px]">(Dotting On: 2 + 1 = 3 times)</span>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground">Saves rewriting repetitive measurements.</span>
        </div>
      )
    },
    {
      title: 'Anding-On',
      desc: 'Used when multiple distinct items share the same dimensions. Descriptions are linked with an ampersand (&) to avoid entering numbers multiple times.',
      sample: (
        <div className="flex flex-col gap-2 w-full text-center">
          <div className="border border-border/40 rounded bg-muted/10 dark:bg-muted/5 p-2 font-mono text-xs text-left">
            <div className="text-primary/70 border-b border-border/40 pb-1 font-bold text-center">LEDGER VIEW</div>
            <div className="p-2 flex gap-4">
              <div className="flex flex-col items-center justify-center font-bold text-foreground border-r border-border/40 pr-4">
                <span>5.00</span>
                <span>3.00</span>
                <span className="border-b border-foreground w-6 text-center">0.15</span>
              </div>
              <div className="text-[11px] leading-normal flex-1">
                <div className="font-bold text-primary">Excavation in trench</div>
                <div className="text-muted-foreground mt-1">&amp;</div>
                <div className="font-bold text-primary mt-1">Disposal of excavated soil</div>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground">Applies same cubic volume to both work items.</span>
        </div>
      )
    },
    {
      title: 'Deductions (Ddt)',
      desc: 'Surveyors measure overall areas first. Voids like doors and windows are strictly omitted later using the "Deduct" or "Ddt" notation to prevent fragmented calculations.',
      sample: (
        <div className="flex flex-col gap-2 w-full text-center">
          <div className="border border-border/40 rounded bg-muted/10 dark:bg-muted/5 p-2 font-mono text-xs text-left">
            <div className="text-primary/70 border-b border-border/40 pb-1 font-bold text-center">LEDGER VIEW</div>
            <div className="p-2 flex gap-4">
              <div className="flex flex-col items-center justify-center font-bold text-foreground border-r border-border/40 pr-4">
                <span>1.20</span>
                <span className="border-b border-foreground w-6 text-center">1.50</span>
              </div>
              <div className="text-[11px] leading-normal flex-1">
                <div className="font-bold text-red-500 uppercase tracking-wider">Ddt brickwork</div>
                <div className="text-muted-foreground text-[10px] mt-0.5">for window opening</div>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground">Maintains clean measuring history from solid structures.</span>
        </div>
      )
    },
    {
      title: 'Net Measurement Rule',
      desc: 'All work must be measured "net" as fixed in position. Estimators do not add allowances for waste or shrinkage inside the dimension entries; these are handled in rates.',
      sample: (
        <div className="flex flex-col gap-2 w-full text-center">
          <div className="border border-border/40 rounded bg-muted/10 dark:bg-muted/5 p-3 text-left">
            <div className="text-primary/70 border-b border-border pb-1 font-bold text-center font-mono text-xs mb-2">SCHEMATIC MEASUREMENT</div>
            <div className="flex flex-col gap-2 text-xs leading-normal">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded text-[10px]">RULE</span>
                <span>Measure finished dimensions only (e.g. 2.45m length).</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded text-[10px]">AVOID</span>
                <span>Adding scrap or cutting waste (e.g., measuring 2.60m).</span>
              </div>
              <div className="mt-1 border-t border-dashed border-border/80 pt-2 text-[10px] text-muted-foreground italic font-mono text-center">
                Waste allowances are added during Unit Rate pricing.
              </div>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground">Standardized recording across all competing tenderers.</span>
        </div>
      )
    }
  ];

  return (
    <TwoColumnLayout
      title="Measurement Conventions &amp; Techniques"
      bgVariant="default"
      leftWidth="55%"
      leftContent={
        <div className="flex flex-col gap-2 select-text">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block mb-1">
            Common Surveying Notations
          </span>
          <div className="flex flex-col gap-2">
            {conventions.map((conv, idx) => {
              const isActive = activeConvention === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveConvention(idx)}
                  onClick={() => setActiveConvention(idx)}
                  className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-primary/5 border-primary shadow-sm scale-[1.01]'
                      : 'bg-card border-border/60 hover:bg-muted/10'
                  }`}
                >
                  <h4 className="text-xs font-bold text-foreground mb-0.5">
                    {conv.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    {conv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col gap-2 select-text h-full justify-center">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center block">
            Visual Ledger Preview
          </span>
          <div className="flex-1 flex items-center justify-center border border-border/60 rounded-xl p-4 bg-muted/20 min-h-[220px]">
            {conventions[activeConvention]?.sample || null}
          </div>
        </div>
      }
    />
  );
};
