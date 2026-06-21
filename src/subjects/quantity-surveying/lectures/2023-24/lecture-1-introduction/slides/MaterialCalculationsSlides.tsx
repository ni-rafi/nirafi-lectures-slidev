import React from 'react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { LectureThankYou } from '@/shared/layouts/LectureThankYou';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import {
  SlideContent,
  ClickHighlight,
  LatexFormula,
  InteractiveCard,
  ParameterSlider,
  ClickReveal
} from '@/features/presentation/components/elements';
import { QuizCardOrchestrator } from '@/features/quiz';
import { CONCRETE_SHRINKAGE_FACTOR } from '@/subjects/quantity-surveying/cores';

import { BarChart, Bar, ChartTooltip } from '@/features/presentation/components/elements/bklit/charts';

const ConcreteMixInfographic: React.FC<{
  cement: number;
  sand: number;
  stone: number;
  label: string;
}> = ({ cement, sand, stone, label }) => {
  const data = React.useMemo(() => [
    { name: label, cement, sand, stone }
  ], [label, cement, sand, stone]);

  return (
    <div className="mt-4 border border-border/40 bg-muted/10 rounded-xl p-3 flex flex-col gap-2 select-none">
      <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
        <span>{label} Mix Ratio</span>
        <span className="font-mono text-primary">{cement} : {sand} : {stone}</span>
      </div>
      
      <div className="h-14 w-full relative">
        <BarChart 
          data={data} 
          xDataKey="name" 
          orientation="horizontal" 
          stacked 
          aspectRatio="5 / 1"
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <Bar dataKey="cement" fill="#9ca3af" lineCap={0} />
          <Bar dataKey="sand" fill="#d97706" lineCap={0} />
          <Bar dataKey="stone" fill="#4b5563" lineCap={0} />
          <ChartTooltip showCrosshair={false} />
        </BarChart>
      </div>

      <div className="flex gap-4 text-[9px] text-muted-foreground font-medium justify-center border-t border-border/20 pt-2">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-zinc-400 inline-block border border-border/30"></span>
          <span>Cement</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block border border-border/30"></span>
          <span>Sand (Fine Agg.)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-zinc-600 inline-block border border-border/30"></span>
          <span>Stone (Coarse Agg.)</span>
        </div>
      </div>
    </div>
  );
};


// Slide 27: Title Page
export const Slide27: React.FC = () => (
  <TopicDividerLayout
    title="Main Items of Work & Basic Material Calculations"
    topicNumber="Part 6"
    description="Dynamic Conversions, Mix Ratios, and Material Take-Offs"
  />
);

// Slide 28: The Wet-to-Dry Volumetric Factor: Why & How
export const Slide28: React.FC = () => (
  <TwoColumnLayout
    title="The Wet-to-Dry Volumetric Factor: Why &amp; How"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <SlideContent
        blocks={[
          {
            type: 'bullet',
            text: (
              <span>
                <strong>The Shrinkage Phenomenon:</strong> Construction materials shrink when mixed with water. Dry ingredients (cement, sand, stone) occupy significantly more space than the final compacted wet concrete mix.
              </span>
            ),
          },
          {
            type: 'bullet',
            text: (
              <span>
                <strong>The Shrinkage Factor:</strong> To accurately estimate raw dry ingredients, the final design wet volume must be multiplied by a standard shrinkage factor, universally taken as{' '}
                <ClickHighlight at={1} variant="paint">1.54 (or standard 1.5)</ClickHighlight>.
              </span>
            ),
          },
          {
            type: 'bullet',
            text: (
              <span>
                <strong>Mathematical Framework:</strong> Volume of Dry Materials ={' '}
                <ClickHighlight at={2} variant="paint">Design Wet Volume x 1.54</ClickHighlight>. Without applying this dynamic factor, estimators will severely under-order materials.
              </span>
            ),
          },
        ]}
      />
    }
    rightContent={
      <div className="flex flex-col gap-2 select-text justify-center h-full">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center block">
          Volume Shrinkage Visualized
        </span>
        <div className="flex items-end justify-center gap-4 h-[200px] w-full p-4 border border-border/60 rounded-xl bg-muted/10 font-sans select-none">
          {/* Dry Mix Container */}
          <div className="flex flex-col items-center gap-1 h-full justify-end">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Dry Ingredients</span>
            <div className="relative w-20 h-28 border border-primary/20 rounded-lg overflow-hidden bg-card flex flex-col justify-end shadow-sm">
              <div className="h-[15%] bg-zinc-400 flex items-center justify-center text-[8px] text-zinc-950 font-bold border-b border-zinc-500/20">
                CEMENT
              </div>
              <div className="h-[30%] bg-amber-100 flex items-center justify-center text-[8px] text-amber-900 font-bold border-b border-zinc-500/20">
                SAND
              </div>
              <div className="h-[55%] bg-zinc-600 flex items-center justify-center text-[8px] text-zinc-100 font-bold">
                STONE
              </div>
              <div className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground font-mono text-[8px] px-1 rounded font-bold">
                1.54
              </div>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">Dry Volume</span>
          </div>

          {/* Dynamic Conversion Arrow */}
          <div className="flex flex-col items-center justify-center h-full pb-3">
            <div className="flex flex-col items-center gap-1">
              <span className="bg-red-500/10 text-red-500 border border-red-500/20 font-bold px-1 py-0.5 rounded text-[8px] font-mono shadow-sm">
                -35% Voids
              </span>
              <svg className="w-6 h-6 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="text-[8px] font-bold text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">
                x 1.54 Factor
              </span>
            </div>
          </div>

          {/* Wet Mix Container */}
          <div className="flex flex-col items-center gap-1 h-full justify-end">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Compacted Concrete</span>
            <div className="relative w-20 h-[72px] border border-primary/20 rounded-lg overflow-hidden bg-card flex flex-col justify-end shadow-sm">
              <div className="h-full bg-zinc-500 flex items-center justify-center text-[9px] text-zinc-100 font-bold text-center leading-tight">
                WET MIX<br />(Solid)
              </div>
              <div className="absolute top-0.5 right-0.5 bg-foreground text-background font-mono text-[8px] px-1 rounded font-bold">
                1.00
              </div>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">Design Wet Vol</span>
          </div>
        </div>
      </div>
    }
  />
);

// Slide 29: Common Mix Ratios: Where and Why
export const Slide29: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  return (
    <TwoColumnLayout
      title="Common Mix Ratios"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="flex flex-col h-full justify-between gap-4">
          <SlideContent
            blocks={[
              {
                type: 'paragraph',
                text: <strong>Rich Mixes (e.g., 1:1.5:3 or 1:2:4)</strong>,
              },
              {
                type: 'bullet',
                text: 'Composition: Cement : Fine Aggregate (Sand) : Coarse Aggregate (Stone/Brick Chips).',
              },
              {
                type: 'bullet',
                text: (
                  <span>
                    <strong>Where It's Used:</strong> Heavily utilized for{' '}
                    <ClickHighlight at={2} variant="paint">Reinforced Cement Concrete (RCC)</ClickHighlight> elements such as roof slabs, beams, columns, and lintels.
                  </span>
                ),
              },
              {
                type: 'bullet',
                text: 'Why: These ratios provide the necessary compressive and tensile strength to withstand structural loads.',
              },
            ]}
          />
          <ClickReveal at={2}>
            {currentClick >= 2 && (
              <ConcreteMixInfographic cement={1} sand={1.5} stone={3} label="Rich (RCC)" />
            )}
          </ClickReveal>
        </div>
      }
      rightContent={
        <div className="flex flex-col h-full justify-between gap-4">
          <SlideContent
            blocks={[
              {
                type: 'paragraph',
                text: <strong>Lean Mixes (e.g., 1:3:6, 1:4:8, 1:5:10)</strong>,
              },
              {
                type: 'bullet',
                text: 'Composition: Higher proportion of aggregates compared to cement binder.',
              },
              {
                type: 'bullet',
                text: (
                  <span>
                    <strong>Where It's Used:</strong> Primarily used for{' '}
                    <ClickHighlight at={5} variant="paint">mass concrete, foundation base layers</ClickHighlight>, and trench filling beneath footings.
                  </span>
                ),
              },
              {
                type: 'bullet',
                text: 'Why: Highly cost-effective for non-structural envelopes where a solid, level working surface is needed.',
              },
            ]}
          />
          <ClickReveal at={5}>
            {currentClick >= 5 && (
              <ConcreteMixInfographic cement={1} sand={3} stone={6} label="Lean (Base)" />
            )}
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 30: RCC Take-off Volumetric Flow Chart
export const Slide30: React.FC = () => {
  const [wetVolume] = useUrlSyncedState<number>('wetVol', 100);
  const [sandPart] = useUrlSyncedState<number>('sandPart', 2);
  const [stonePart] = useUrlSyncedState<number>('stonePart', 4);
  const { currentClick } = useClickStepsContext();

  const dryMultiplier = CONCRETE_SHRINKAGE_FACTOR;
  const dryVolume = wetVolume * dryMultiplier;
  const totalParts = 1 + sandPart + stonePart;

  const cementVol = (1 / totalParts) * dryVolume;
  const cementBags = cementVol / 1.25;

  const sandVol = (sandPart / totalParts) * dryVolume;
  const stoneVol = (stonePart / totalParts) * dryVolume;

  return (
    <TwoColumnLayout
      title="RCC Take-off Volumetric Flow"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: <strong>Volumetric Expansion Cycle</strong>,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>1. Design Wet Volume:</strong> Compacted wet concrete volume is calculated directly from drawing dimensions.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>2. Dry Multiplier:</strong> Water evaporation and mixing voids reduce dry volume; dry ingredients must be expanded by a <strong>{CONCRETE_SHRINKAGE_FACTOR} factor</strong>.
                </span>
              ),
              revealAt: 1,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>3. Parts Division:</strong> Dry ingredients are divided proportionally based on ratio parts (<ClickHighlight at={2} variant="paint">1</ClickHighlight> cement : <ClickHighlight at={2} variant="paint">{sandPart}</ClickHighlight> sand : <ClickHighlight at={2} variant="paint">{stonePart}</ClickHighlight> stone = <ClickHighlight at={2} variant="paint">{totalParts}</ClickHighlight> total parts).
                </span>
              ),
              revealAt: 2,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>4. Quantity Yield:</strong> Cement share is computed and converted to standard 50 kg bags (1.25 cft/bag), while aggregates are measured in cft.
                </span>
              ),
              revealAt: 3,
            },
          ]}
        />
      }
      rightContent={
        <div className="flex flex-col gap-4 h-full justify-center">
          <InteractiveCard title="Take-off Volumetric Flow">
            <div className="relative border border-border/40 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none">
              <svg width="280" height="280" viewBox="0 0 280 280" className="overflow-visible">
                {/* Wet Volume Box (always visible) */}
                <g className="transition-all duration-500 ease-in-out opacity-100">
                  <rect x="20" y="10" width="240" height="35" rx="6" fill="var(--color-primary, #0284c7)" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
                  <text x="140" y="32" fill="currentColor" fontWeight="bold" fontSize="10" textAnchor="middle">
                    Wet Concrete Volume: {wetVolume.toFixed(1)} cft
                  </text>
                </g>

                {/* Step 1 Arrow and Dry Volume Box */}
                <g className={`transition-all duration-500 ease-in-out ${currentClick >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  {/* Down Arrow */}
                  <line x1="140" y1="45" x2="140" y2="85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                  <polygon points="140,89 136,81 144,81" fill="currentColor" />
                  <text x="155" y="70" fill="var(--color-primary, #0284c7)" fontWeight="extrabold" fontSize="9" textAnchor="start">
                    × {CONCRETE_SHRINKAGE_FACTOR} Factor
                  </text>

                  {/* Dry Volume Box */}
                  <rect x="20" y="90" width="240" height="52" rx="6" fill="currentColor" opacity="0.05" stroke="currentColor" strokeWidth="1.5" />
                  <text x="140" y="120" fill="currentColor" fontWeight="bold" fontSize="10" textAnchor="middle">
                    Dry Mix Volume: {dryVolume.toFixed(1)} cft
                  </text>
                </g>

                {/* Step 2 Arrow / Parts */}
                <g className={`transition-all duration-500 ease-in-out ${currentClick >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <line x1="140" y1="142" x2="140" y2="175" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                  <polygon points="140,179 136,171 144,171" fill="currentColor" />
                  <text x="155" y="162" fill="currentColor" fontWeight="bold" fontSize="8" textAnchor="start">
                    Ratio: 1 : {sandPart} : {stonePart} ({totalParts} parts)
                  </text>
                </g>

                {/* Step 3 Ingredients Boxes */}
                <g className={`transition-all duration-500 ease-in-out ${currentClick >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  {/* Cement Box */}
                  <g>
                    <rect x="15" y="185" width="76" height="85" rx="6" fill="#9ca3af" opacity="0.12" stroke="#9ca3af" strokeWidth="1.5" />
                    <text x="53" y="205" fill="currentColor" fontWeight="extrabold" fontSize="9" textAnchor="middle">Cement</text>
                    <text x="53" y="225" fill="currentColor" fontSize="8" textAnchor="middle">1 / {totalParts} share</text>
                    <text x="53" y="240" fill="currentColor" fontSize="8" fontWeight="bold" textAnchor="middle">{cementVol.toFixed(1)} cft</text>
                    <text x="53" y="258" fill="var(--color-primary, #0284c7)" fontWeight="extrabold" fontSize="9" textAnchor="middle">
                      {cementBags.toFixed(1)} bags
                    </text>
                  </g>

                  {/* Sand Box */}
                  <g>
                    <rect x="102" y="185" width="76" height="85" rx="6" fill="#d97706" opacity="0.12" stroke="#d97706" strokeWidth="1.5" />
                    <text x="140" y="205" fill="currentColor" fontWeight="extrabold" fontSize="9" textAnchor="middle">Sand</text>
                    <text x="140" y="225" fill="currentColor" fontSize="8" textAnchor="middle">{sandPart} / {totalParts} share</text>
                    <text x="140" y="245" fill="#d97706" fontWeight="extrabold" fontSize="10" textAnchor="middle">{sandVol.toFixed(1)} cft</text>
                    <text x="140" y="258" fill="currentColor" fontSize="8" opacity="0.7" textAnchor="middle">(Fine Agg.)</text>
                  </g>

                  {/* Stone Box */}
                  <g>
                    <rect x="189" y="185" width="76" height="85" rx="6" fill="#4b5563" opacity="0.12" stroke="#4b5563" strokeWidth="1.5" />
                    <text x="227" y="205" fill="currentColor" fontWeight="extrabold" fontSize="9" textAnchor="middle">Stone</text>
                    <text x="227" y="225" fill="currentColor" fontSize="8" textAnchor="middle">{stonePart} / {totalParts} share</text>
                    <text x="227" y="245" fill="#4b5563" fontWeight="extrabold" fontSize="10" textAnchor="middle">{stoneVol.toFixed(1)} cft</text>
                    <text x="227" y="258" fill="currentColor" fontSize="8" opacity="0.7" textAnchor="middle">(Coarse Agg.)</text>
                  </g>
                </g>
              </svg>
            </div>
          </InteractiveCard>
        </div>
      }
    />
  );
};

// Slide 31: RCC Step-by-Step Math Walkthrough
export const Slide31: React.FC = () => {
  const [wetVolume] = useUrlSyncedState<number>('wetVol', 100);
  const [sandPart] = useUrlSyncedState<number>('sandPart', 2);
  const [stonePart] = useUrlSyncedState<number>('stonePart', 4);

  const dryMultiplier = CONCRETE_SHRINKAGE_FACTOR;
  const dryVolume = wetVolume * dryMultiplier;
  const totalParts = 1 + sandPart + stonePart;

  const cementVol = (1 / totalParts) * dryVolume;
  const cementBags = cementVol / 1.25;

  const sandVol = (sandPart / totalParts) * dryVolume;
  const stoneVol = (stonePart / totalParts) * dryVolume;

  return (
    <FullWidthLayout title="RCC Step-by-Step Math Walkthrough" bgVariant="default">
      <div className="flex flex-col gap-3 text-xs md:text-sm leading-relaxed max-w-4xl mx-auto">
        <div className="border-l-4 border-primary pl-3 py-1 font-extrabold text-xs uppercase tracking-wider text-primary mb-2">
          Step-by-Step Calculation (Wet Vol: {wetVolume} cft • Ratio: 1 : {sandPart} : {stonePart})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 select-text">
          <ClickReveal at={1} className="border border-border/40 p-3.5 bg-muted/10 rounded-xl">
            <span className="font-extrabold text-foreground block mb-1 uppercase text-[10px] tracking-wider text-primary">Step 1: Dry Volume Conversion</span>
            <span>Multiply by PWD shrinkage factor ({CONCRETE_SHRINKAGE_FACTOR}) to find dry ingredients volume:</span>
            <div className="mt-1.5 font-semibold text-primary">
              <LatexFormula math={`V_{\\text{dry}} = ${wetVolume} \\text{ cft} \\times ${CONCRETE_SHRINKAGE_FACTOR} = ${dryVolume.toFixed(2)} \\text{ cft}`} />
            </div>
          </ClickReveal>

          <ClickReveal at={2} className="border border-border/40 p-3.5 bg-muted/10 rounded-xl">
            <span className="font-extrabold text-foreground block mb-1 uppercase text-[10px] tracking-wider text-primary">Step 2: Sum of Ratio Parts</span>
            <span>Sum the volumetric ratio parts (Cement : Sand : Aggregate):</span>
            <div className="mt-1.5 font-semibold text-primary">
              <LatexFormula math={`\\text{Total Parts} = 1 + ${sandPart} + ${stonePart} = ${totalParts}`} />
            </div>
          </ClickReveal>

          <ClickReveal at={3} className="border border-border/40 p-3.5 bg-muted/10 rounded-xl md:col-span-2">
            <span className="font-extrabold text-foreground block mb-1 uppercase text-[10px] tracking-wider text-primary">Step 3: Cement Quantity (Bags)</span>
            <span>Evaluate cement share and convert to standard 50 kg bags (1.25 cft per bag):</span>
            <div className="mt-1.5 flex flex-col md:flex-row md:gap-8 font-semibold text-primary">
              <LatexFormula math={`\\text{Volume} = \\frac{1}{${totalParts}} \\times ${dryVolume.toFixed(2)} \\text{ cft} = ${cementVol.toFixed(3)} \\text{ cft}`} />
              <ClickHighlight at={4} variant="paint">
                <LatexFormula math={`\\text{Bags} = \\frac{${cementVol.toFixed(3)}}{1.25} = ${cementBags.toFixed(2)} \\text{ bags}`} />
              </ClickHighlight>
            </div>
          </ClickReveal>

          <ClickReveal at={5} className="border border-border/40 p-3.5 bg-muted/10 rounded-xl md:col-span-2">
            <span className="font-extrabold text-foreground block mb-1 uppercase text-[10px] tracking-wider text-primary">Step 4: Fine &amp; Coarse Aggregates (cft)</span>
            <span>Evaluate sand (fine aggregate) and stone/brick chips (coarse aggregate) shares:</span>
            <div className="mt-1.5 flex flex-col md:flex-row md:gap-8 font-semibold text-primary">
              <LatexFormula math={`\\text{Sand (Fine)} = \\frac{${sandPart}}{${totalParts}} \\times ${dryVolume.toFixed(2)} \\text{ cft} = ${sandVol.toFixed(2)} \\text{ cft}`} />
              <LatexFormula math={`\\text{Stone (Coarse)} = \\frac{${stonePart}}{${totalParts}} \\times ${dryVolume.toFixed(2)} \\text{ cft} = ${stoneVol.toFixed(2)} \\text{ cft}`} />
            </div>
          </ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};

// Slide 32: Dynamic RCC Volume Sandbox
export const Slide32: React.FC = () => {
  const [wetVolume, setWetVolume] = useUrlSyncedState<number>('wetVol', 100);
  const [sandPart, setSandPart] = useUrlSyncedState<number>('sandPart', 2);
  const [stonePart, setStonePart] = useUrlSyncedState<number>('stonePart', 4);

  const dryMultiplier = CONCRETE_SHRINKAGE_FACTOR;
  const dryVolume = wetVolume * dryMultiplier;
  const totalParts = 1 + sandPart + stonePart;

  const cementVol = (1 / totalParts) * dryVolume;
  const cementBags = cementVol / 1.25;

  const sandVol = (sandPart / totalParts) * dryVolume;
  const stoneVol = (stonePart / totalParts) * dryVolume;

  // SVG Layer Heights (scaled to a total of 120px)
  const totalHeight = 120;
  const cementH = (1 / totalParts) * totalHeight;
  const sandH = (sandPart / totalParts) * totalHeight;
  const stoneH = (stonePart / totalParts) * totalHeight;

  return (
    <TwoColumnLayout
      title="Dynamic RCC Material Calculation"
      bgVariant="calculation"
      leftWidth="48%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Design Parameters (cft)">
            <ParameterSlider
              label="Wet Volume:"
              value={wetVolume}
              unit="cft"
              min={10}
              max={200}
              step={5}
              onChange={setWetVolume}
            />
            <ParameterSlider
              label="Sand Proportion:"
              value={sandPart}
              unit="part"
              min={1}
              max={4}
              step={0.5}
              onChange={setSandPart}
            />
            <ParameterSlider
              label="Aggregate Proportion:"
              value={stonePart}
              unit="parts"
              min={2}
              max={8}
              step={0.5}
              onChange={setStonePart}
            />
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col gap-4 h-full justify-center">
          {/* SVG Visual proportions of the mix */}
          <div className="relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary mb-3">Mix Volume Proportions</span>
            <svg width="240" height="150" viewBox="0 0 240 150" className="overflow-visible select-none">
              {/* Stone/Aggregates layer (Bottom) */}
              <rect x="20" y={130 - stoneH} width="150" height={stoneH} fill="#4b5563" rx="4" />
              <text x="95" y={130 - (stoneH / 2) + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Aggregate ({stoneVol.toFixed(1)} cft)
              </text>

              {/* Sand layer (Middle) */}
              <rect x="20" y={130 - stoneH - sandH} width="150" height={sandH} fill="#d97706" rx="4" />
              <text x="95" y={130 - stoneH - (sandH / 2) + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Sand ({sandVol.toFixed(1)} cft)
              </text>

              {/* Cement layer (Top) */}
              <rect x="20" y={130 - stoneH - sandH - cementH} width="150" height={cementH} fill="#9ca3af" rx="4" />
              <text x="95" y={130 - stoneH - sandH - (cementH / 2) + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Cement ({cementBags.toFixed(1)} bags)
              </text>

              {/* Total Height line bracket */}
              <path d="M185,10 L190,10 L190,130 L185,130" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="196" y="70" fill="currentColor" fontSize="9" fontWeight="extrabold" textAnchor="start">
                Dry {dryVolume.toFixed(0)} cft
              </text>
            </svg>
          </div>
        </div>
      }
    />
  );
};

// Slide 33: Estimating Brickwork & Mortar Volumes
export const Slide33: React.FC = () => (
  <FullWidthLayout title="Estimating Brickwork & Mortar Volumes" bgVariant="default">
    <SlideContent
      blocks={[
        {
          type: 'bullet',
          text: 'The Masonry Rule: When bricks are laid with standard mortar joints, the total structural envelope volume must be divided into raw brick volume and wet mortar volume.',
        },
        {
          type: 'bullet',
          text: (
            <span>
              <strong>Net Mortar Calculation:</strong> Subtract the volume occupied by exact brick counts (using actual size without mortar, e.g., 9.5" x 4.5" x 2.75") from the total nominal brickwork volume to find the exact wet mortar required.
            </span>
          ),
        },
        {
          type: 'bullet',
          text: (
            <span>
              <strong>Dry Mortar Factor:</strong> Similar to concrete, dry mortar sand and cement ingredients must be increased by a factor (adding{' '}
              <ClickHighlight at={1} variant="paint">25% to 33%</ClickHighlight>, or a 1.25 to 1.33 multiplier) to account for initial dry volume shrinkage.
            </span>
          ),
        },
        {
          type: 'bullet',
          text: (
            <span>
              <strong>Standard Mortar Ratios:</strong> 1:3 or 1:4 cement mortar is used for rich, load-bearing masonry or foundations, while{' '}
              <ClickHighlight at={2} variant="paint">1:6 is the standard economic ratio</ClickHighlight> for regular superstructure brick walls.
            </span>
          ),
        },
      ]}
    />
  </FullWidthLayout>
);

// Slide 34: Interactive Quiz
export const Slide34: React.FC = () => (
  <FullWidthLayout title="Quantity Surveying Checkpoint" bgVariant="gallery">
    <QuizCardOrchestrator
      quizId="qs_2023_lec1_quiz1"
      questionText={`Calculate the dry volume (cft) required for 200 cft of wet concrete mix using a shrinkage multiplier of ${CONCRETE_SHRINKAGE_FACTOR}.`}
      quizType="numeric-input"
    />
  </FullWidthLayout>
);

// Slide 35: Conclusion
export const Slide35: React.FC<SlideProps> = (props) => (
  <LectureThankYou {...props} />
);
