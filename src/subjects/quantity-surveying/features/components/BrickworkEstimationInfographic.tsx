import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';
import { ClickHighlight } from '@/features/presentation/components/elements';

export const BrickworkEstimationInfographic: React.FC = () => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'grid grid-cols-1 gap-6 select-text w-full'
    : 'grid grid-cols-1 md:grid-cols-3 gap-5 select-text w-full';

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={containerClasses}>
        {/* Card 1: Brick Sizing - Nominal vs Actual */}
        <div className="p-4 border border-border/40 bg-muted/20 dark:bg-muted/5 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </span>
              <h3 className="text-xs font-bold text-foreground">1. Sizing: Nominal vs. Actual</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal mb-3">
              Standard mortar joints add thickness to the brick's outer physical boundaries.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <svg width="180" height="90" viewBox="0 0 180 90" className="overflow-visible select-none">
              {/* Nominal Brick (With Mortar) */}
              <g className="text-primary/75">
                <rect x="5" y="15" width="70" height="42" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="40" y="40" fill="currentColor" fontWeight="bold" fontSize="8" textAnchor="middle">NOMINAL</text>
                <text x="40" y="52" fill="currentColor" fontSize="7" textAnchor="middle">10" × 5" × 3"</text>
              </g>

              {/* Actual Brick (Standard size without mortar) */}
              <g className="text-primary">
                <rect x="95" y="18" width="66" height="36" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
                <text x="128" y="40" fill="currentColor" fontWeight="extrabold" fontSize="8" textAnchor="middle">ACTUAL</text>
                <text x="128" y="50" fill="currentColor" fontSize="7" textAnchor="middle">9.5" × 4.5" × 2.75"</text>
              </g>
            </svg>

            <div className="text-center w-full border-t border-border/40 pt-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Mortar displacement</span>
              <span className="text-[11px] font-medium text-foreground">
                Mortar Vol = Total Vol − (Bricks × Actual Vol)
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Shrinkage Factor */}
        <div className="p-4 border border-border/40 bg-muted/20 dark:bg-muted/5 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              <h3 className="text-xs font-bold text-foreground">2. Dry Mortar Shrinkage</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal mb-3">
              Dry sand and cement shrink when hydrated. Estimators must scale up the wet volume.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <svg width="120" height="90" viewBox="0 0 120 90" className="overflow-visible select-none">
              {/* Dry mixture cup */}
              <path d="M20,15 L40,75 L70,75 L90,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              
              {/* Dry Level */}
              <line x1="22" y1="25" x2="88" y2="25" stroke="var(--chart-2)" strokeWidth="3" opacity="0.4" />
              <text x="55" y="21" fill="var(--chart-2)" fontWeight="bold" fontSize="8" textAnchor="middle">DRY MIX</text>

              {/* Wet Level */}
              <line x1="32" y1="55" x2="78" y2="55" stroke="var(--chart-1)" strokeWidth="3.5" />
              <text x="55" y="51" fill="var(--chart-1)" fontWeight="bold" fontSize="8" textAnchor="middle">WET PASTE</text>
            </svg>

            <div className="text-center w-full border-t border-border/40 pt-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Volumetric Multiplier</span>
              <ClickHighlight at={1} variant="paint">
                <span className="font-mono text-xs font-bold text-primary">
                  Dry Vol = Wet Vol × 1.25 to 1.30
                </span>
              </ClickHighlight>
            </div>
          </div>
        </div>

        {/* Card 3: Mortar Ratios */}
        <div className="p-4 border border-border/40 bg-muted/20 dark:bg-muted/5 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </span>
              <h3 className="text-xs font-bold text-foreground">3. Standard Mortar Ratios</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal mb-3">
              The proportion of sand binder is adjusted based on structural strength needs.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            {/* 1:3 or 1:4 Rich Mix */}
            <div className="border border-border/40 bg-muted/20 dark:bg-muted/10 p-2 rounded-lg flex items-center justify-between text-[11px]">
              <div>
                <span className="font-extrabold text-foreground block">Rich Mix (1:3 or 1:4)</span>
                <span className="text-[9px] text-muted-foreground">Foundations, DPC, Load-bearing walls</span>
              </div>
              <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">1:3</span>
            </div>

            {/* 1:6 Economic Mix */}
            <div className="border border-border/40 bg-muted/20 dark:bg-muted/10 p-2 rounded-lg flex items-center justify-between text-[11px]">
              <div>
                <span className="font-extrabold text-foreground block">Economic Mix (1:6)</span>
                <span className="text-[9px] text-muted-foreground">Superstructure walls, partition walls</span>
              </div>
              <ClickHighlight at={2} variant="paint">
                <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">1:6</span>
              </ClickHighlight>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground/60 italic text-center w-full mt-2 select-text">
        * Standard actual size of bricks in Bangladesh PWD guidelines is 9.5" × 4.5" × 2.75" (without mortar).
      </div>
    </div>
  );
};
export default BrickworkEstimationInfographic;
