import React from 'react';
import { ClickSyncedTabs, ClickSyncedTabItem } from '@/features/presentation/components/elements/ClickSyncedTabs';
import { LatexFormula } from '@/features/presentation/components/elements';

export const GraphDegreeTransitions: React.FC = () => {
  const items: ClickSyncedTabItem[] = [
    {
      title: "Constant (x⁰) from Zero Load",
      badge: "Degree 0",
      badgeVariant: "success",
      description: "Under zero load (w = 0), the shear diagram remains constant. Integrating constant shear yields a sloped linear bending moment.",
      rightContent: (
        <div className="flex flex-col items-center justify-center gap-6 w-full text-foreground">
          <svg className="w-full max-w-[420px] h-[100px] overflow-visible" viewBox="0 0 300 80">
            {/* Load (Zero) */}
            <g transform="translate(10, 10)">
              <rect x="0" y="5" width="60" height="30" className="fill-muted/20 stroke-muted-foreground/30" strokeWidth="1.2" rx="4" />
              <line x1="10" y1="35" x2="50" y2="35" className="stroke-muted-foreground/50 stroke-1.5" />
              <text x="30" y="48" textAnchor="middle" className="text-[9px] font-bold fill-muted-foreground">Load w = 0</text>
            </g>
            
            {/* Arrow 1 */}
            <g transform="translate(80, 20)">
              <path d="M 0 10 L 20 10 M 15 5 L 20 10 L 15 15" className="fill-none stroke-emerald-500" strokeWidth="2" />
              <text x="10" y="-2" textAnchor="middle" className="text-[10px] font-mono font-black fill-emerald-500">∫</text>
            </g>

            {/* Shear (Constant) */}
            <g transform="translate(115, 10)">
              {/* Shaded Area */}
              <rect x="10" y="15" width="40" height="20" className="fill-emerald-500/10 stroke-none" />
              <rect x="0" y="5" width="60" height="30" className="fill-emerald-500/5 stroke-emerald-500" strokeWidth="1.8" rx="4" />
              <line x1="10" y1="15" x2="50" y2="15" className="stroke-emerald-500 stroke-2" />
              <line x1="10" y1="35" x2="50" y2="35" className="stroke-muted-foreground/30 stroke-1" strokeDasharray="2 2" />
              <text x="30" y="48" textAnchor="middle" className="text-[9px] font-bold fill-emerald-500">Shear V = C</text>
            </g>

            {/* Arrow 2 */}
            <g transform="translate(185, 20)">
              <path d="M 0 10 L 20 10 M 15 5 L 20 10 L 15 15" className="fill-none stroke-blue-500" strokeWidth="2" />
              <text x="10" y="-2" textAnchor="middle" className="text-[10px] font-mono font-black fill-blue-500">∫</text>
            </g>

            {/* Moment (Linear) */}
            <g transform="translate(220, 10)">
              {/* Shaded Area */}
              <polygon points="10,35 50,15 50,35" className="fill-blue-500/10 stroke-none" />
              <rect x="0" y="5" width="60" height="30" className="fill-blue-500/5 stroke-blue-500" strokeWidth="1.8" rx="4" />
              <line x1="10" y1="35" x2="50" y2="15" className="stroke-blue-500 stroke-2" />
              <line x1="10" y1="35" x2="50" y2="35" className="stroke-muted-foreground/30 stroke-1" strokeDasharray="2 2" />
              <text x="30" y="48" textAnchor="middle" className="text-[9px] font-bold fill-blue-500">Moment M = Cx</text>
            </g>
          </svg>
          <div className="flex gap-4 text-xs font-mono bg-muted/60 border border-border text-foreground px-4 py-2 rounded-xl shadow-xs">
            <span>
              <LatexFormula math="\text{Degree transition: } \text{None } (- \infty) \xrightarrow{\int} \text{Constant } (0) \xrightarrow{\int} \text{Linear } (1)" />
            </span>
          </div>
        </div>
      )
    },
    {
      title: "Linear (x¹) from Constant Load",
      badge: "Degree 1",
      badgeVariant: "info",
      description: "Under a uniform load (w = C), shear is linear. Integrating linear shear yields a quadratic parabola bending moment. We display both concavities depending on load orientation:",
      rightContent: (
        <div className="flex flex-col items-center justify-center gap-6 w-full text-foreground">
          <div className="flex gap-8 justify-center w-full">
            {/* Case A: Concave Down Parabola */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-[140px] h-[90px] overflow-visible" viewBox="0 0 100 70">
                <rect x="0" y="0" width="100" height="55" rx="6" className="fill-card stroke-border" strokeWidth="1" />
                <line x1="10" y1="45" x2="90" y2="45" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="2 2" />
                {/* Shaded Area */}
                <path d="M 15 45 Q 50 10 85 45 Z" className="fill-indigo-500/10 stroke-none" />
                <path d="M 15 45 Q 50 10 85 45" className="fill-none stroke-indigo-500" strokeWidth="2" />
                <text x="50" y="65" textAnchor="middle" className="text-[8.5px] font-bold fill-foreground">Concave Down (PD)</text>
              </svg>
            </div>
            
            {/* Case B: Concave Up Parabola */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-[140px] h-[90px] overflow-visible" viewBox="0 0 100 70">
                <rect x="0" y="0" width="100" height="55" rx="6" className="fill-card stroke-border" strokeWidth="1" />
                <line x1="10" y1="45" x2="90" y2="45" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="2 2" />
                {/* Shaded Area */}
                <path d="M 15 45 Q 50 45 85 10 L 85 45 Z" className="fill-orange-500/10 stroke-none" />
                <path d="M 15 45 Q 50 45 85 10" className="fill-none stroke-orange-500" strokeWidth="2" />
                <text x="50" y="65" textAnchor="middle" className="text-[8.5px] font-bold fill-foreground">Concave Up (PI)</text>
              </svg>
            </div>
          </div>

          <div className="flex gap-4 text-xs font-mono bg-muted/60 border border-border text-foreground px-4 py-2 rounded-xl shadow-xs">
            <span>
              <LatexFormula math="\text{Degree transition: } \text{Constant } (0) \xrightarrow{\int} \text{Linear } (1) \xrightarrow{\int} \text{Quadratic } (2)" />
            </span>
          </div>
        </div>
      )
    },
    {
      title: "Parabolic (x²) from Linear Load",
      badge: "Degree 2",
      badgeVariant: "primary",
      description: "Under a triangular load (w = Cx), shear is parabolic (degree 2). Integrating parabolic shear yields a third-order cubic bending moment. We display both cubic orientations:",
      rightContent: (
        <div className="flex flex-col items-center justify-center gap-6 w-full text-foreground">
          <div className="flex gap-8 justify-center w-full">
            {/* Case A: Concave Down Cubic */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-[140px] h-[90px] overflow-visible" viewBox="0 0 100 70">
                <rect x="0" y="0" width="100" height="55" rx="6" className="fill-card stroke-border" strokeWidth="1" />
                <line x1="10" y1="45" x2="90" y2="45" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="2 2" />
                {/* Shaded Area */}
                <path d="M 15 45 C 35 43 55 10 85 10 L 85 45 Z" className="fill-indigo-500/10 stroke-none" />
                <path d="M 15 45 C 35 43 55 10 85 10" className="fill-none stroke-indigo-500" strokeWidth="2" />
                <text x="50" y="65" textAnchor="middle" className="text-[8.5px] font-bold fill-foreground">Concave Down (Cubic)</text>
              </svg>
            </div>

            {/* Case B: Concave Up Cubic */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-[140px] h-[90px] overflow-visible" viewBox="0 0 100 70">
                <rect x="0" y="0" width="100" height="55" rx="6" className="fill-card stroke-border" strokeWidth="1" />
                <line x1="10" y1="45" x2="90" y2="45" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="2 2" />
                {/* Shaded Area */}
                <path d="M 15 45 C 45 45 65 35 85 10 L 85 45 Z" className="fill-orange-500/10 stroke-none" />
                <path d="M 15 45 C 45 45 65 35 85 10" className="fill-none stroke-orange-500" strokeWidth="2" />
                <text x="50" y="65" textAnchor="middle" className="text-[8.5px] font-bold fill-foreground">Concave Up (Cubic)</text>
              </svg>
            </div>
          </div>

          <div className="flex gap-4 text-xs font-mono bg-muted/60 border border-border text-foreground px-4 py-2 rounded-xl shadow-xs">
            <span>
              <LatexFormula math="\text{Degree transition: } \text{Linear } (1) \xrightarrow{\int} \text{Quadratic } (2) \xrightarrow{\int} \text{Cubic } (3)" />
            </span>
          </div>
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Integration & Differentiation of Graphs"
      items={items}
      leftTitle="Graphical Cheat-Sheet: Polynomial Degree Rules"
      rightTitle="Degree Transition Loop"
      leftWidth="45%"
    />
  );
};

export default GraphDegreeTransitions;
