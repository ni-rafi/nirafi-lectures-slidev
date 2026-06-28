import React from 'react';
import { ClickSyncedTabs, ClickSyncedTabItem } from '@/features/presentation/components/elements/ClickSyncedTabs';
import { SlideBullet } from '@/features/presentation/components/elements';

export const SfdBmdRelationsLoop: React.FC = () => {
  const items: ClickSyncedTabItem[] = [
    {
      title: "Load to Shear (Integration)",
      badge: "1st Integral",
      badgeVariant: "success",
      description: "The change in shear force between two points equals the negative area under the load diagram.",
      rightContent: (
        <div className="flex flex-col items-center gap-4 text-foreground w-full">
          <svg className="w-full max-w-[280px] h-[130px] overflow-visible" viewBox="0 0 200 110">
            <line x1="20" y1="80" x2="180" y2="80" className="stroke-muted-foreground/30" strokeWidth="1" />
            {/* Load block */}
            <rect x="50" y="20" width="80" height="20" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
            <text x="90" y="32" className="text-[8px] fill-red-550 dark:fill-red-400 font-bold" textAnchor="middle">w (Load)</text>
            {/* Arrow */}
            <path d="M 90 45 L 90 60" className="fill-none stroke-emerald-500" strokeWidth="2" strokeDasharray="2,2" />
            <polygon points="90,62 87,56 93,56" className="fill-emerald-500" />
            {/* Shear Line */}
            <line x1="50" y1="80" x2="130" y2="95" className="stroke-emerald-500 stroke-2" />
            <text x="90" y="105" className="text-[8px] fill-emerald-550 dark:fill-emerald-400 font-bold" textAnchor="middle">V (Shear)</text>
          </svg>
          <div className="text-[11px] leading-relaxed text-muted-foreground max-w-[280px]">
            <SlideBullet icon={<span className="text-emerald-500 font-bold">•</span>}>
              {"Equation: \\(\\Delta V = -\\int w \\, dx\\)"}
            </SlideBullet>
            <SlideBullet icon={<span className="text-emerald-500 font-bold">•</span>}>
              {"Area under load curve subtracts from current shear value."}
            </SlideBullet>
          </div>
        </div>
      )
    },
    {
      title: "Shear to Moment (Integration)",
      badge: "2nd Integral",
      badgeVariant: "success",
      description: "The change in bending moment between two points equals the area under the shear force diagram.",
      rightContent: (
        <div className="flex flex-col items-center gap-4 text-foreground w-full">
          <svg className="w-full max-w-[280px] h-[130px] overflow-visible" viewBox="0 0 200 110">
            <line x1="20" y1="50" x2="180" y2="50" className="stroke-muted-foreground/30" strokeWidth="1" />
            {/* Shear sloped */}
            <line x1="50" y1="30" x2="130" y2="70" className="stroke-emerald-500 stroke-1.5" />
            <text x="90" y="24" className="text-[8px] fill-emerald-550 dark:fill-emerald-400 font-bold" textAnchor="middle">V (Shear)</text>
            {/* Arrow */}
            <path d="M 90 55 L 90 68" className="fill-none stroke-blue-500" strokeWidth="2" strokeDasharray="2,2" />
            <polygon points="90,70 87,64 93,64" className="fill-blue-500" />
            {/* Moment curve */}
            <path d="M 50 85 Q 90 65 130 85" className="fill-none stroke-blue-500 stroke-2" />
            <text x="90" y="98" className="text-[8px] fill-blue-550 dark:fill-blue-400 font-bold" textAnchor="middle">M (Moment)</text>
          </svg>
          <div className="text-[11px] leading-relaxed text-muted-foreground max-w-[280px]">
            <SlideBullet icon={<span className="text-blue-500 font-bold">•</span>}>
              {"Equation: \\(\\Delta M = \\int V \\, dx\\)"}
            </SlideBullet>
            <SlideBullet icon={<span className="text-blue-500 font-bold">•</span>}>
              {"Peak moments occur directly where the shear diagram equals zero."}
            </SlideBullet>
          </div>
        </div>
      )
    },
    {
      title: "Moment to Shear (Differentiation)",
      badge: "1st Derivative",
      badgeVariant: "info",
      description: "The derivative of bending moment with respect to distance equals the local shear force.",
      rightContent: (
        <div className="flex flex-col items-center gap-4 text-foreground w-full">
          <svg className="w-full max-w-[280px] h-[130px] overflow-visible" viewBox="0 0 200 110">
            <line x1="20" y1="80" x2="180" y2="80" className="stroke-muted-foreground/30" strokeWidth="1" />
            {/* Moment curve */}
            <path d="M 50 80 Q 90 40 130 80" className="fill-none stroke-blue-500/30 stroke-1.5" />
            {/* Tangent line */}
            <line x1="60" y1="75" x2="100" y2="35" className="stroke-indigo-500 stroke-2" />
            <circle cx="80" cy="55" r="3" className="fill-indigo-500" />
            <text x="80" y="28" className="text-[8px] fill-indigo-550 dark:fill-indigo-400 font-bold" textAnchor="middle">Tangent dM/dx</text>
            {/* Arrow */}
            <path d="M 115 55 L 130 55" className="fill-none stroke-indigo-500" strokeWidth="2" strokeDasharray="2,2" />
            <polygon points="132,55 126,52 126,58" className="fill-indigo-500" />
            {/* Shear value */}
            <line x1="145" y1="80" x2="145" y2="40" className="stroke-emerald-500 stroke-2.5" />
            <text x="150" y="60" className="text-[8px] fill-emerald-555 dark:fill-emerald-400 font-bold">V (Shear)</text>
          </svg>
          <div className="text-[11px] leading-relaxed text-muted-foreground max-w-[280px]">
            <SlideBullet icon={<span className="text-indigo-500 font-bold">•</span>}>
              {"Equation: \\(\\frac{dM}{dx} = V\\)"}
            </SlideBullet>
            <SlideBullet icon={<span className="text-indigo-500 font-bold">•</span>}>
              {"Constant shear yields linear moment; zero shear yields horizontal slope."}
            </SlideBullet>
          </div>
        </div>
      )
    },
    {
      title: "Shear to Load (Differentiation)",
      badge: "2nd Derivative",
      badgeVariant: "info",
      description: "The derivative of shear force with respect to distance equals the negative loading intensity.",
      rightContent: (
        <div className="flex flex-col items-center gap-4 text-foreground w-full">
          <svg className="w-full max-w-[280px] h-[130px] overflow-visible" viewBox="0 0 200 110">
            <line x1="20" y1="70" x2="180" y2="70" className="stroke-muted-foreground/30" strokeWidth="1" />
            {/* Shear sloped */}
            <line x1="50" y1="40" x2="130" y2="80" className="stroke-emerald-500/30 stroke-1.5" />
            {/* Slope marker */}
            <line x1="70" y1="50" x2="110" y2="70" className="stroke-red-500 stroke-2" />
            <text x="90" y="38" className="text-[8px] fill-red-550 dark:fill-red-400 font-bold" textAnchor="middle">Tangent dV/dx</text>
            {/* Arrow */}
            <path d="M 125 55 L 140 55" className="fill-none stroke-red-500" strokeWidth="2" strokeDasharray="2,2" />
            <polygon points="142,55 136,52 136,58" className="fill-red-500" />
            {/* Load w */}
            <rect x="145" y="45" width="20" height="20" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
            <text x="155" y="78" className="text-[8px] fill-red-550 dark:fill-red-400 font-bold" textAnchor="middle">w = -dV/dx</text>
          </svg>
          <div className="text-[11px] leading-relaxed text-muted-foreground max-w-[280px]">
            <SlideBullet icon={<span className="text-red-500 font-bold">•</span>}>
              {"Equation: \\(\\frac{dV}{dx} = -w\\)"}
            </SlideBullet>
            <SlideBullet icon={<span className="text-red-500 font-bold">•</span>}>
              {"Unloaded spans have zero slope (shear is constant); uniform load has constant sloped shear."}
            </SlideBullet>
          </div>
        </div>
      )
    },
    {
      title: "Moment to Load (Double Differentiation)",
      badge: "Double Diff",
      badgeVariant: "primary",
      description: "Differentiating the moment curve twice yields the negative load intensity.",
      rightContent: (
        <div className="flex flex-col items-center gap-4 text-foreground w-full">
          <svg className="w-full max-w-[280px] h-[130px] overflow-visible" viewBox="0 0 200 110">
            <line x1="20" y1="80" x2="180" y2="80" className="stroke-muted-foreground/30" strokeWidth="1" />
            {/* Moment curve */}
            <path d="M 50 80 Q 90 40 130 80" className="fill-none stroke-blue-500 stroke-2" />
            <text x="90" y="32" className="text-[8px] fill-blue-550 dark:fill-blue-400 font-bold" textAnchor="middle">M (Moment)</text>
            {/* Arrow */}
            <path d="M 90 45 Q 120 20 150 40" className="fill-none stroke-violet-500" strokeWidth="2" strokeDasharray="2,2" />
            <polygon points="152,40 148,34 144,40" className="fill-violet-500" />
            {/* Load w */}
            <rect x="150" y="45" width="30" height="20" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
            <text x="165" y="78" className="text-[8px] fill-red-550 dark:fill-red-400 font-bold" textAnchor="middle">w</text>
          </svg>
          <div className="text-[11px] leading-relaxed text-muted-foreground max-w-[280px]">
            <SlideBullet icon={<span className="text-violet-500 font-bold">•</span>}>
              {"Equation: \\(\\frac{d^2M}{dx^2} = -w\\)"}
            </SlideBullet>
            <SlideBullet icon={<span className="text-violet-500 font-bold">•</span>}>
              {"Concavity matches load: negative second derivative means concave down."}
            </SlideBullet>
          </div>
        </div>
      )
    },
    {
      title: "Load to Moment (Double Integration)",
      badge: "Double Int",
      badgeVariant: "primary",
      description: "Double integrating the load distribution profile yields the change in bending moment.",
      rightContent: (
        <div className="flex flex-col items-center gap-4 text-foreground w-full">
          <svg className="w-full max-w-[280px] h-[130px] overflow-visible" viewBox="0 0 200 110">
            <line x1="20" y1="80" x2="180" y2="80" className="stroke-muted-foreground/30" strokeWidth="1" />
            {/* Load w */}
            <rect x="50" y="20" width="30" height="20" className="fill-red-500/10 stroke-red-500" strokeWidth="1.5" />
            <text x="65" y="48" className="text-[8px] fill-red-550 dark:fill-red-400 font-bold" textAnchor="middle">w (Load)</text>
            {/* Arrow */}
            <path d="M 75 45 Q 105 20 135 40" className="fill-none stroke-orange-500" strokeWidth="2" strokeDasharray="2,2" />
            <polygon points="137,40 133,34 129,40" className="fill-orange-500" />
            {/* Moment curve */}
            <path d="M 120 80 Q 150 40 180 80" className="fill-none stroke-blue-500 stroke-2" />
            <text x="150" y="94" className="text-[8px] fill-blue-550 dark:fill-blue-400 font-bold" textAnchor="middle">M</text>
          </svg>
          <div className="text-[11px] leading-relaxed text-muted-foreground max-w-[280px]">
            <SlideBullet icon={<span className="text-orange-500 font-bold">•</span>}>
              {"Equation: \\(\\Delta M = -\\iint w \\, dx^2\\)"}
            </SlideBullet>
            <SlideBullet icon={<span className="text-orange-500 font-bold">•</span>}>
              {"Degree relationship: Constant load double integrates to quadratic moment."}
            </SlideBullet>
          </div>
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Relationships between SFD & BMD"
      items={items}
      leftTitle="Theory Cheat-Sheet: Interactive Calculus Loop"
      rightTitle="Visual Concept Demonstration"
      leftWidth="48%"
      clickToTabMap={[0, 1, 2, 3, 4, 5]}
    />
  );
};

export default SfdBmdRelationsLoop;
