import React from 'react';
import { LectureCover } from '@/shared/layouts/LectureCover';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { Box, Square } from 'lucide-react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';
import {
  InteractiveCard,
  CalculationOutput,
  ParameterInputCard,
  LatexFormula,
  ClickSyncedTabs,
  ClickHighlight,
  type ClickSyncedTabItem
} from '@/features/presentation/components/elements';

/**
 * Slide 1: Cover Slide
 */
export const Slide1: React.FC<SlideProps> = (props) => (
  <LectureCover {...props} />
);

const rulesData = [
  {
    id: 1,
    title: "1.1 The Net Core Principle",
    badge: "Strict Rule",
    desc: "Substructure works are calculated net as undisturbed in original positions. Extra working space or shoring allowances are handled strictly in pricing frameworks.",
    color: "border-amber-500 text-amber-500 bg-amber-500/10",
    formula: "V = L_{\\text{net}} \\times B_{\\text{net}} \\times D_{\\text{net}}",
    formulaDesc: "Calculated exactly to drawing dimensions. Excavated boundary is net in-ground profile."
  },
  {
    id: 2,
    title: "1.2 Heavy Mass Items (m³)",
    badge: "Cubic Units",
    desc: "Applied where depth, length, and breadth represent distinct structural constraints. Essential for major excavation, backfill, and structural mass foundations.",
    color: "border-primary text-primary bg-primary/10",
    formula: "V = L \\times B \\times D",
    formulaDesc: "Three distinct spatial boundaries. Measured in cubic meters for heavy concrete and trench works."
  },
  {
    id: 3,
    title: "1.3 Shallow Surface Works (m²)",
    badge: "Square Units",
    desc: "Applied to surface treatments where thickness is a standardized constant parameter. Essential for surface dressings, brick flat soling (BFS), or damp-proof courses (DPC).",
    color: "border-emerald-500 text-emerald-500 bg-emerald-500/10",
    formula: "A = L \\times B",
    formulaDesc: "Constant structural thickness parameter. Measured in square meters to avoid redundant thickness calculations."
  }
];

/**
 * Slide 2: Principles of Measurement for Substructure Works (Static - Click to transition)
 */
export const Slide2: React.FC = () => {
  const conventions: ClickSyncedTabItem[] = rulesData.map((rule) => ({
    title: rule.title,
    description: rule.desc,
    badge: rule.badge,
    badgeColor: rule.color,
    rightContent: (
      <div className="w-full bg-muted/20 p-6 rounded-xl border border-border/40 space-y-4 animate-fadeIn">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
          Formula Representation ({rule.badge})
        </span>

        <div className="p-6 bg-background rounded-lg border border-border/30 flex items-center justify-center">
          <div className="text-base md:text-lg font-black text-primary font-mono">
            <LatexFormula math={rule.formula} />
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {rule.formulaDesc}
        </p>
      </div>
    )
  }));

  return (
    <ClickSyncedTabs
      title="Principles of Measurement"
      leftTitle="Measurement Rules"
      rightTitle="Formula Detail"
      items={conventions}
      leftWidth="50%"
    />
  );
};

/**
 * Slide 3: Principles of Measurement (Dynamic Sandbox - Minimal Left Column)
 */
export const Slide3: React.FC = () => {
  const clickContext = useClickStepsContext();
  const { currentClick, setClick } = clickContext;
  const presentation = React.useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';
  const isScrollOrBlog = viewMode === 'scroll' || viewMode === 'blog';

  React.useEffect(() => {
    if (clickContext.setIsTabbedSlide) {
      clickContext.setIsTabbedSlide(true);
    }
  }, [clickContext]);

  const [localActiveIndex, setLocalActiveIndex] = React.useState<number>(0);

  const activeIndex = isScrollOrBlog
    ? localActiveIndex
    : Math.min(2, Math.max(0, currentClick));

  const activeRule = activeIndex + 1;

  const [length, setLength] = useUrlSyncedState<number>('rule_len_dyn', 15.0);
  const [width, setWidth] = useUrlSyncedState<number>('rule_width_dyn', 1.0);
  const [depth, setDepth] = useUrlSyncedState<number>('rule_depth_dyn', 1.2);
  const [thickness, setThickness] = useUrlSyncedState<number>('rule_thick_dyn', 0.075);

  const cubicVolume = (length * width * depth).toFixed(2);
  const squareArea = (length * width).toFixed(2);

  // Apply dimensions when the active rule changes (driven by clicks or menu selection)
  React.useEffect(() => {
    if (activeRule === 1) {
      setLength(15.0);
      setWidth(1.0);
      setDepth(1.2);
    } else if (activeRule === 2) {
      setLength(10.0);
      setWidth(1.2);
      setDepth(1.5);
    } else if (activeRule === 3) {
      setLength(8.0);
      setWidth(2.0);
      setThickness(0.075);
    }
  }, [activeRule, setLength, setWidth, setDepth, setThickness]);

  const applyPreset = (ruleId: number) => {
    if (isScrollOrBlog) {
      setLocalActiveIndex(ruleId - 1);
    } else {
      setClick(ruleId - 1);
    }
  };

  return (
    <TwoColumnLayout
      title="Measurement Sandbox & Presets"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="flex flex-col justify-start h-full space-y-3">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">Rule Presets</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Click a preset below to automatically configure the physical dimensions and sandbox visualizations.
              </p>
              <p className="text-[10.5px] text-muted-foreground leading-relaxed mt-2.5 bg-muted/20 p-2.5 rounded-xl border border-border/40">
                Click values on the right to manually alter dimensions and observe volume outputs in real-time.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {rulesData.map((rule, idx) => {
                const isActive = activeRule === rule.id;
                return (
                  <button
                    key={rule.id}
                    type="button"
                    onClick={() => applyPreset(rule.id)}
                    className={`w-full p-2.5 rounded-xl border transition-all duration-350 cursor-pointer text-left select-none block ${
                      isActive
                        ? 'bg-primary/5 border-primary shadow-sm translate-x-1'
                        : 'bg-card border-border/60 hover:bg-muted/10 opacity-70 hover:opacity-95'
                    }`}
                  >
                    {idx > 0 && <ClickHighlight at={idx} className="hidden">{' '}</ClickHighlight>}
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {rule.title}
                      </h4>
                      {rule.badge && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${rule.color || 'border-border/60 text-muted-foreground bg-muted/30'}`}>
                          {rule.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {rule.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-start h-full space-y-3">
          <InteractiveCard title="Dynamic Dimension Controls">
            <div className="grid grid-cols-3 gap-2">
              <ParameterInputCard
                label="Length (L)"
                min={2}
                max={30}
                value={length}
                onChange={setLength}
                unit="m"
                variant="compact"
              />

              <ParameterInputCard
                label="Width (B)"
                min={0.4}
                max={2.5}
                value={width}
                onChange={setWidth}
                unit="m"
                variant="compact"
              />

              <ParameterInputCard
                label={activeRule === 3 ? "Thickness (t)" : "Depth (D)"}
                min={activeRule === 3 ? 0.05 : 0.3}
                max={activeRule === 3 ? 0.15 : 3.0}
                value={activeRule === 3 ? thickness : depth}
                onChange={activeRule === 3 ? setThickness : setDepth}
                unit="m"
                variant="compact"
              />
            </div>
          </InteractiveCard>

          <div className="bg-muted/20 p-3 rounded-xl border border-border/40 flex flex-col justify-start space-y-3">
            <div className="relative h-20 bg-muted/40 rounded-lg border border-border/30 flex items-center justify-center p-2 overflow-hidden select-none">
              {activeRule === 1 && (
                <div className="flex flex-col items-center space-y-0.5 text-center animate-fadeIn">
                  <div className="relative w-36 h-10 bg-amber-500/10 border-2 border-amber-500 rounded flex items-center justify-center">
                    <span className="text-[10px] font-mono font-extrabold text-amber-600 dark:text-amber-400 bg-background px-1.5 py-0.5 rounded border border-amber-500/20">
                      NET FIELD BOUNDARY
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Extra Working Space Disregarded</span>
                </div>
              )}

              {activeRule === 2 && (
                <div className="flex items-center gap-3 animate-fadeIn">
                  <Box className="w-10 h-10 text-primary stroke-[1.5]" />
                  <div className="font-mono text-left">
                    <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Formula Block</div>
                    <div className="text-xs text-foreground font-extrabold">V = L &times; B &times; D</div>
                    <div className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                      Heavy Concrete / Excavation
                    </div>
                  </div>
                </div>
              )}

              {activeRule === 3 && (
                <div className="flex items-center gap-3 animate-fadeIn">
                  <Square className="w-10 h-10 text-emerald-500 stroke-[1.5]" />
                  <div className="font-mono text-left">
                    <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Formula Block</div>
                    <div className="text-xs text-foreground font-extrabold">A = L &times; B</div>
                    <div className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                      BFS / Surface DPC Layer
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1.5 border-t border-border/20 select-text">
              <CalculationOutput
                title="Massive Item Vol"
                value={cubicVolume}
                unit="m³"
                className={activeRule === 2 ? '' : 'opacity-40'}
              />
              <CalculationOutput
                title="Surface Area"
                value={squareArea}
                unit="m²"
                className={activeRule === 3 ? '' : 'opacity-40'}
              />
            </div>
          </div>
        </div>
      }
    />
  );
};
