import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';
import { LatexFormula, ClickHighlight } from '@/features/presentation/components/elements';

export const UnitConversionInfographic: React.FC = () => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'grid grid-cols-1 gap-6 select-text w-full'
    : 'grid grid-cols-1 md:grid-cols-3 gap-5 select-text w-full';

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={containerClasses}>
        {/* 3D Volumetric Card */}
        <div className="p-4 border border-border/40 bg-muted/20 dark:bg-muted/5 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </span>
              <h3 className="text-xs font-bold text-foreground">Volumetric Units (3D)</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal mb-3">
              Applied to voluminous structural components (earthwork excavation, mass concrete, foundation footings).
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            {/* 3D Cube Diagram */}
            <svg width="100" height="90" viewBox="0 0 100 90" className="overflow-visible select-none text-primary">
              {/* Back face projection */}
              <polygon points="35,15 75,15 75,55 35,55" fill="var(--color-primary, #0284c7)" opacity="0.05" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
              
              {/* Connector dashed lines */}
              <line x1="15" y1="35" x2="35" y2="15" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="55" y1="35" x2="75" y2="15" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="55" y1="75" x2="75" y2="55" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="15" y1="75" x2="35" y2="55" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />

              {/* Front Face */}
              <polygon points="15,35 55,35 55,75 15,75" fill="var(--color-primary, #0284c7)" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
              <text x="35" y="60" fill="currentColor" fontWeight="bold" fontSize="10" textAnchor="middle">1 m³</text>
            </svg>

            <div className="text-center w-full border-t border-border/40 pt-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Conversion Ratio</span>
              <ClickHighlight at={1} variant="paint">
                <span className="font-mono text-xs font-bold text-primary">
                  <LatexFormula math="1 \text{ m}^3 = 35.315 \text{ cft}" />
                </span>
              </ClickHighlight>
            </div>
          </div>
        </div>

        {/* 2D Areal Card */}
        <div className="p-4 border border-border/40 bg-muted/20 dark:bg-muted/5 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                </svg>
              </span>
              <h3 className="text-xs font-bold text-foreground">Areal Units (2D)</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal mb-3">
              Applied to superficial surface items (wall plastering, pointing, surface painting, and 5" brick partition walls).
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            {/* 2D Square Diagram */}
            <svg width="100" height="90" viewBox="0 0 100 90" className="overflow-visible select-none text-primary">
              <rect x="20" y="15" width="60" height="60" fill="var(--color-primary, #0284c7)" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
              <text x="50" y="50" fill="currentColor" fontWeight="bold" fontSize="10" textAnchor="middle">1 m²</text>
            </svg>

            <div className="text-center w-full border-t border-border/40 pt-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Conversion Ratio</span>
              <ClickHighlight at={2} variant="paint">
                <span className="font-mono text-xs font-bold text-primary">
                  <LatexFormula math="1 \text{ m}^2 = 10.764 \text{ sft}" />
                </span>
              </ClickHighlight>
            </div>
          </div>
        </div>

        {/* Mass & Mass Metrics Card */}
        <div className="p-4 border border-border/40 bg-muted/20 dark:bg-muted/5 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="6" y1="12" x2="18" y2="12" />
                  <path d="M12 2v20" />
                </svg>
              </span>
              <h3 className="text-xs font-bold text-foreground">Mass &amp; Weight Metrics</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal mb-3">
              Applied to structural reinforcement steel (MS Rod, binding wire). Measured in kg or metric tons.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            {/* Rebar Icon SVG */}
            <svg width="100" height="90" viewBox="0 0 100 90" className="overflow-visible select-none text-primary">
              {/* Diagonal steel bar schematic */}
              <rect x="25" y="42" width="50" height="6" rx="2" fill="currentColor" transform="rotate(-30, 50, 45)" />
              {/* Rib lines on reinforcement */}
              <line x1="32" y1="52" x2="35" y2="47" stroke="var(--color-background, #fff)" strokeWidth="1.5" />
              <line x1="42" y1="46" x2="45" y2="41" stroke="var(--color-background, #fff)" strokeWidth="1.5" />
              <line x1="52" y1="41" x2="55" y2="36" stroke="var(--color-background, #fff)" strokeWidth="1.5" />
              <line x1="62" y1="35" x2="65" y2="30" stroke="var(--color-background, #fff)" strokeWidth="1.5" />
            </svg>

            <div className="text-center w-full border-t border-border/40 pt-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Standard Scale</span>
              <ClickHighlight at={3} variant="paint">
                <span className="font-mono text-[11px] font-bold text-primary">
                  1 Tonne = 1000 kg = 10 Qtl
                </span>
              </ClickHighlight>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground/60 italic text-center w-full mt-2 select-text">
        * Standard conversions are sourced from the Bangladesh Public Works Department (PWD) Schedule of Rates and Bangladesh National Building Code (BNBC) specifications.
      </div>
    </div>
  );
};
export default UnitConversionInfographic;
