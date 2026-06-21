import React from 'react';
import { TitleV2Layout } from '@/shared/layouts/TitleV2Layout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { Box, Square, HelpCircle } from 'lucide-react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { InteractiveCard, CalculationOutput, ParameterSlider, LatexFormula, ClickHighlight } from '@/features/presentation/components/elements';
import type { Subject, Lecture } from '@/config/lectures';

/**
 * Slide 1: Cover Slide
 */
export const Slide1: React.FC<{ subject: Subject; lecture: Lecture }> = ({ subject, lecture }) => (
  <TitleV2Layout
    courseCode={subject.courseCode}
    courseTitle={subject.courseTitle}
    subtitle={lecture.title}
    yearSemester="2nd Year / 2nd Semester"
    creditHours="1.0 (Sessional)"
    usnCode="2025-2"
    session="2023-24"
  />
);

const rulesData = [
  {
    id: 1,
    title: "1.1 The Net Core Principle",
    badge: "Strict Rule",
    desc: "Substructure works are calculated net as undisturbed in original positions. Extra working space or shoring allowances are handled strictly in pricing frameworks.",
    color: "border-amber-500 text-amber-500 bg-amber-500/10",
    formula: "V = Net L \\times Net B \\times Net D",
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
  const { currentClick, setClick } = useClickStepsContext();
  
  // Map steps: click 0 -> Rule 1; click 1 -> Rule 2; click 2 -> Rule 3
  const activeRule = Math.min(3, Math.max(1, currentClick + 1));

  return (
    <TwoColumnLayout
      title="Principles of Measurement"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {rulesData.map((rule, idx) => {
              const isActive = activeRule === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => setClick(idx)}
                  className={`p-3 rounded-xl border transition-all duration-350 cursor-pointer ${
                    isActive 
                      ? 'bg-muted/80 border-primary shadow-sm translate-x-1 text-foreground' 
                      : 'bg-muted/30 border-border/40 opacity-60 hover:opacity-90 hover:bg-muted/50'
                  }`}
                >
                  {/* Register clicks implicitly in the framework */}
                  {idx > 0 && <ClickHighlight at={idx} className="hidden">{' '}</ClickHighlight>}
                  
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-xs font-extrabold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {rule.title}
                    </h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${rule.color}`}>
                      {rule.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-normal">
                    {rule.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-muted/20 rounded-lg border border-border/40 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-muted-foreground font-normal">
              Press <span className="font-bold text-foreground">Next/Prev</span> or click any rule card directly to review.
            </p>
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-center h-full space-y-4">
          {rulesData.map((rule) => {
            if (rule.id !== activeRule) return null;
            return (
              <div key={rule.id} className="bg-muted/20 p-6 rounded-xl border border-border/40 space-y-4 animate-fadeIn">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Formula Representation ({rule.badge})
                </span>
                
                <div className="p-6 bg-background rounded-lg border border-border/30 flex items-center justify-center">
                  <div className="text-xl md:text-2xl font-black text-primary font-mono">
                    <LatexFormula math={rule.formula} />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rule.formulaDesc}
                </p>
              </div>
            );
          })}
        </div>
      }
    />
  );
};

/**
 * Slide 3: Principles of Measurement (Dynamic Sandbox - Minimal Left Column)
 */
export const Slide3: React.FC = () => {
  const [activeRule, setActiveRule] = useUrlSyncedState<number>('rule_active_dyn', 1);
  const [length, setLength] = useUrlSyncedState<number>('rule_len_dyn', 10.0);
  const [width, setWidth] = useUrlSyncedState<number>('rule_width_dyn', 1.2);
  const [depth, setDepth] = useUrlSyncedState<number>('rule_depth_dyn', 1.5);
  const [thickness, setThickness] = useUrlSyncedState<number>('rule_thick_dyn', 0.075);

  const cubicVolume = (length * width * depth).toFixed(2);
  const squareArea = (length * width).toFixed(2);

  const applyPreset = (ruleId: number) => {
    setActiveRule(ruleId);
    if (ruleId === 1) {
      setLength(15.0);
      setWidth(1.0);
      setDepth(1.2);
    } else if (ruleId === 2) {
      setLength(10.0);
      setWidth(1.2);
      setDepth(1.5);
    } else if (ruleId === 3) {
      setLength(8.0);
      setWidth(2.0);
      setThickness(0.075);
    }
  };

  return (
    <TwoColumnLayout
      title="Measurement Sandbox & Presets"
      bgVariant="default"
      leftWidth="40%"
      leftContent={
        <div className="flex flex-col justify-start h-full space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Rule Presets</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Click a preset below to automatically configure the physical dimensions and sandbox visualizations.
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-2.5 bg-muted/20 p-2.5 rounded-xl border border-border/40">
                Use the slider controls on the right to manually alter dimensions and observe volume outputs in real-time.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {rulesData.map((rule) => {
                const isActive = activeRule === rule.id;
                return (
                  <button
                    key={rule.id}
                    onClick={() => applyPreset(rule.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-primary/10 border-primary text-primary shadow-xs'
                        : 'bg-muted/30 border-border/40 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{rule.title.split(': ')[0] || rule.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded border border-current font-normal opacity-85">
                        {rule.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <InteractiveCard title="Dynamic Dimension Controls">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ParameterSlider
                label="Length (L)"
                min={2}
                max={30}
                step={0.5}
                value={length}
                onChange={setLength}
                unit=" m"
              />

              <ParameterSlider
                label="Width (B)"
                min={0.4}
                max={2.5}
                step={0.05}
                value={width}
                onChange={setWidth}
                unit=" m"
              />

              <ParameterSlider
                label={activeRule === 3 ? "Thickness (t)" : "Depth (D)"}
                min={activeRule === 3 ? 0.05 : 0.3}
                max={activeRule === 3 ? 0.15 : 3.0}
                step={0.01}
                value={activeRule === 3 ? thickness : depth}
                onChange={activeRule === 3 ? setThickness : setDepth}
                unit=" m"
              />
            </div>
          </InteractiveCard>

          <div className="bg-muted/20 p-4 rounded-xl border border-border/40 flex flex-col justify-between space-y-4 flex-1">
            <div className="relative h-28 bg-muted/40 rounded-lg border border-border/30 flex items-center justify-center p-2 overflow-hidden select-none">
              {activeRule === 1 && (
                <div className="flex flex-col items-center space-y-1 text-center animate-fadeIn">
                  <div className="relative w-40 h-16 bg-amber-500/10 border-2 border-amber-500 rounded flex items-center justify-center">
                    <span className="text-[10px] font-mono font-extrabold text-amber-600 dark:text-amber-400 bg-background px-2 py-0.5 rounded border border-amber-500/20">
                      NET FIELD BOUNDARY
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Extra Working Space Disregarded</span>
                </div>
              )}

              {activeRule === 2 && (
                <div className="flex items-center gap-3 animate-fadeIn">
                  <Box className="w-12 h-12 text-primary stroke-[1.5]" />
                  <div className="font-mono text-left">
                    <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Formula Block</div>
                    <div className="text-xs text-foreground font-extrabold">V = L &times; B &times; D</div>
                    <div className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded mt-1 inline-block">
                      Heavy Concrete / Excavation
                    </div>
                  </div>
                </div>
              )}

              {activeRule === 3 && (
                <div className="flex items-center gap-3 animate-fadeIn">
                  <Square className="w-12 h-12 text-emerald-500 stroke-[1.5]" />
                  <div className="font-mono text-left">
                    <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Formula Block</div>
                    <div className="text-xs text-foreground font-extrabold">A = L &times; B</div>
                    <div className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded mt-1 inline-block">
                      BFS / Surface DPC Layer
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/20 select-text">
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
