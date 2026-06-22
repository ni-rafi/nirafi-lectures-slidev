import React from 'react';
import { ClickSyncedTabs, type ClickSyncedTabItem, DimensionPaperGrid } from '@/features/presentation/components/elements';

// Slide 26: Measurement Conventions & Techniques
export const Slide26: React.FC = () => {
  const conventions: ClickSyncedTabItem[] = [
    {
      title: 'Timesing & Dotting On',
      description: 'Allows the surveyor to multiply repeating items. "Timesing" multiplies items (e.g., 2/), while "Dotting on" adds extra items to a multiplier (e.g., a dot adds 1).',
      badge: 'Repetition',
      badgeColor: 'border-primary/30 text-primary bg-primary/5',
      rightContent: (
        <div className="flex flex-col gap-2 w-full text-center">
          <DimensionPaperGrid
            columns={[
              {
                colNum: 1,
                name: 'Timesing',
                isActive: true,
                value: (
                  <div className="flex flex-col gap-2 font-mono text-xs w-full">
                    <div className="flex items-center justify-center gap-4 py-1">
                      <span className="text-base font-extrabold text-primary">2 /</span>
                      <span className="text-muted-foreground text-[10px]">(Timesing: 2 times)</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 py-1 border-t border-dashed border-border/40">
                      <span className="text-base font-extrabold text-primary">2. /</span>
                      <span className="text-muted-foreground text-[10px]">(Dotting On: 2 + 1 = 3 times)</span>
                    </div>
                  </div>
                )
              }
            ]}
          />
          <span className="text-[10px] text-muted-foreground mt-1">Saves rewriting repetitive measurements.</span>
        </div>
      )
    },
    {
      title: 'Anding-On',
      description: 'Used when multiple distinct items share the same dimensions. Descriptions are linked with an ampersand (&) to avoid entering numbers multiple times.',
      badge: 'Grouping',
      badgeColor: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5',
      rightContent: (
        <div className="flex flex-col gap-2 w-full text-center">
          <DimensionPaperGrid
            columns={[
              {
                colNum: 2,
                name: 'Dimension',
                isActive: true,
                value: (
                  <div className="flex flex-col items-center font-mono text-xs leading-none py-0.5">
                    <span>5.00</span>
                    <span>3.00</span>
                    <span className="border-b border-foreground/60 pb-0.5 w-6 text-center">0.15</span>
                  </div>
                )
              },
              {
                colNum: 4,
                name: 'Description & Waste',
                isActive: true,
                value: (
                  <div className="text-left text-[11px] leading-tight w-full">
                    <div className="font-bold text-primary">Excavation in trench</div>
                    <div className="text-muted-foreground/80 font-bold my-1 text-center font-mono">&amp;</div>
                    <div className="font-bold text-primary mt-1">Disposal of excavated soil</div>
                  </div>
                )
              }
            ]}
          />
          <span className="text-[10px] text-muted-foreground mt-1">Applies same cubic volume to both work items.</span>
        </div>
      )
    },
    {
      title: 'Deductions (Ddt)',
      description: 'Surveyors measure overall areas first. Voids like doors and windows are strictly omitted later using the "Deduct" or "Ddt" notation to prevent fragmented calculations.',
      badge: 'Omissions',
      badgeColor: 'border-red-500/30 text-red-500 bg-red-500/5',
      rightContent: (
        <div className="flex flex-col gap-2 w-full text-center">
          <DimensionPaperGrid
            columns={[
              {
                colNum: 2,
                name: 'Dimension',
                isActive: true,
                value: (
                  <div className="flex flex-col items-center font-mono text-xs leading-none py-0.5">
                    <span>1.20</span>
                    <span className="border-b border-foreground/60 pb-0.5 w-6 text-center">1.50</span>
                  </div>
                )
              },
              {
                colNum: 4,
                name: 'Description & Waste',
                isActive: true,
                value: (
                  <div className="text-left text-[11px] leading-tight w-full">
                    <div className="font-bold text-red-500 uppercase tracking-wider">Ddt brickwork</div>
                    <div className="text-muted-foreground text-[10px] mt-0.5">for window opening</div>
                  </div>
                )
              }
            ]}
          />
          <span className="text-[10px] text-muted-foreground mt-1">Maintains clean measuring history from solid structures.</span>
        </div>
      )
    },
    {
      title: 'Net Measurement Rule',
      description: 'All work must be measured "net" as fixed in position. Estimators do not add allowances for waste or shrinkage inside the dimension entries; these are handled in rates.',
      badge: 'Net Value',
      badgeColor: 'border-amber-500/30 text-amber-500 bg-amber-500/5',
      rightContent: (
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
    <ClickSyncedTabs
      title="Measurement Conventions &amp; Techniques"
      leftTitle="Common Surveying Notations"
      rightTitle="Visual Ledger Preview"
      items={conventions}
      leftWidth="55%"
    />
  );
};
