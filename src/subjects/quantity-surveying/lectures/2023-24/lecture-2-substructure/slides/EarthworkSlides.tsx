import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { 
  SlideContent, 
  ClickHighlight, 
  LatexFormula, 
  InteractiveCard, 
  ParameterSlider, 
  CalculationOutput
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { Droplet } from 'lucide-react';

/**
 * Slide 3: Topic Divider - Earthwork
 */
export const Slide3: React.FC = () => (
  <TopicDividerLayout
    title="02. Earthwork Estimation"
    subtitle="Site preparation, trench excavation, dewatering, and soil bulking rules."
  />
);

/**
 * Slide 4: Centre Line Method & T-Junction Deductions
 */
export const Slide4: React.FC = () => {
  const [clickedJunction, setClickedJunction] = useUrlSyncedState<boolean>('junction_clicked', false);
  const [currentClick] = useUrlSyncedState<number>('presentation_step', 0);

  return (
    <TwoColumnLayout
      title="Centre Line: T-Junction Deductions"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  When tracing the continuous centerline of walls, the junction zones are counted twice.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Junction Deduction Rule:</strong> For every T-junction, deduct{' '}
                  <ClickHighlight at={1} variant="paint">
                    <LatexFormula math="0.5 \times \text{Breadth } (B)" />
                  </ClickHighlight>{' '}
                  from the total centerline length.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>L-Junctions:</strong> L-corners require{' '}
                  <ClickHighlight at={2} variant="bold">no deductions</ClickHighlight> as the centerline perfectly balances the inner and outer areas.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'paragraph',
              text: (
                <div className="mt-4 p-3 bg-muted/40 border border-border/40 rounded-lg text-[10px] text-muted-foreground">
                  <span className="text-amber-500 font-bold block mb-1">Click the T-Junction in the SVG diagram:</span>
                  It highlights the double-counted area where two centerlines cross.
                </div>
              ),
            },
          ]}
        />
      }
      rightContent={
        <div className="flex flex-col justify-between h-full bg-muted/20 p-4 border border-border/40 rounded-xl">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">T-Junction Interactive Alignment</h3>
          <div className="relative h-56 bg-muted/40 rounded-lg border border-border/30 flex items-center justify-center p-4">
            <svg width="220" height="180" viewBox="0 0 220 180" className="cursor-pointer select-none">
              {/* Horizontal Wall Outer Boundaries */}
              <rect x="20" y="40" width="180" height="40" className="fill-muted stroke-border/60" opacity="0.8" strokeWidth="1.5" />
              {/* Vertical Wall Outer Boundaries */}
              <rect x="90" y="80" width="40" height="80" className="fill-muted stroke-border/60" opacity="0.8" strokeWidth="1.5" />
              
              {/* Centerlines */}
              <line x1="20" y1="60" x2="200" y2="60" stroke="var(--color-primary, #f59e0b)" strokeWidth="2" strokeDasharray="5,3" />
              <line x1="110" y1="60" x2="110" y2="160" stroke="var(--color-primary, #f59e0b)" strokeWidth="2" strokeDasharray="5,3" />
              
              {/* Overlapping Junction Highlight Area */}
              <rect 
                x="90" 
                y="40" 
                width="40" 
                height="40" 
                fill={clickedJunction || currentClick >= 1 ? 'var(--color-primary, #ef4444)' : 'var(--color-muted, #3b82f6)'} 
                fillOpacity="0.4"
                stroke={clickedJunction || currentClick >= 1 ? 'var(--color-primary, #ef4444)' : 'var(--color-border, #60a5fa)'}
                strokeWidth="1.5"
                onClick={() => setClickedJunction(!clickedJunction)}
                className="transition-colors duration-350"
              />
              
              {/* Text labels */}
              <text x="50" y="30" className="fill-muted-foreground" fontSize="10" textAnchor="middle" fontWeight="bold">Horizontal Main Wall</text>
              <text x="110" y="175" className="fill-muted-foreground" fontSize="10" textAnchor="middle" fontWeight="bold">Cross Wall</text>
              
              {/* Interactive Highlight tag */}
              <g transform="translate(110, 60)" onClick={() => setClickedJunction(!clickedJunction)}>
                <circle r="8" className="fill-primary animate-ping" opacity="0.4" />
                <circle r="4" className="fill-primary" />
              </g>
            </svg>
            
            {(clickedJunction || currentClick >= 1) && (
              <div className="absolute top-2 right-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] p-2 rounded-md font-mono animate-fadeIn">
                <strong>Double-counted:</strong>
                <br />
                Deduction = 0.5 × B
              </div>
            )}
          </div>
          
          <div className="bg-muted/40 p-3 rounded-lg border border-border/40">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">BoQ centerline length correction formula</span>
            <div className="text-sm font-black text-foreground font-mono mt-1">
              Net L = Total L - (0.5 &times; B &times; N)
            </div>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">Where N = number of T-junctions</span>
          </div>
        </div>
      }
    />
  );
};

/**
 * Slide 5: Practical Realities & Dewatering
 */
export const Slide5: React.FC = () => {
  return (
    <TwoColumnLayout
      title="Field Realities: Shoring & Dewatering"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Excavating in weak soils or high groundwater tables introduces major contractor risks.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Timbering & Shoring:</strong> Supporting structural trench walls when depth exceeds 1.5m to prevent side collapses. Billed as area ($m^2$).
                </span>
              ),
              revealAt: 1,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Dewatering:</strong> Manual bailing or mechanical pumps to drain spring, flood, or groundwater. Kept as a separate item in BoQ.
                </span>
              ),
              revealAt: 2,
            },
          ]}
        />
      }
      rightContent={
        <div className="flex flex-col justify-between h-full bg-muted/20 p-4 border border-border/40 rounded-xl">
          <div className="h-48 bg-muted/40 rounded-lg border border-border/30 relative flex items-center justify-center overflow-hidden">
            {/* Water levels & Trench elevation visual */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-500/10 border-t border-blue-500/20 flex items-center justify-center">
              <span className="text-blue-500 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 animate-bounce" /> Sub-grade Groundwater Table
              </span>
            </div>
            <div className="w-40 h-24 border-x-2 border-dashed border-amber-600/40 relative flex flex-col justify-between p-2">
              <span className="text-[9px] text-amber-500 font-mono self-center">Excavated Trench</span>
              <div className="flex justify-between w-full">
                <div className="w-1.5 h-16 bg-primary border border-primary/80 rounded" />
                <div className="w-1.5 h-16 bg-primary border border-primary/80 rounded" />
              </div>
              <span className="text-[8px] text-primary font-mono self-center">Timber Bracing</span>
            </div>
          </div>
          <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-xs text-blue-600 dark:text-blue-400">
            <strong>PWD Bangladesh Spec:</strong> Any pumping due to spring water/rainwater during concrete work must be explicitly measured or included in operational rates.
          </div>
        </div>
      }
    />
  );
};

/**
 * Slide 6: Bulking vs Backfill Computations
 */
export const Slide6: React.FC = () => {
  const [netExcavation, setNetExcavation] = useUrlSyncedState<number>('earth_net_exc', 30.0);
  const [bulkingFactor, setBulkingFactor] = useUrlSyncedState<number>('earth_bulk_fac', 1.2);

  const transitVolume = netExcavation * bulkingFactor;
  const backfillVolume = netExcavation * 0.35; // typical footing volume displacement deduction

  return (
    <TwoColumnLayout
      title="Soil Bulking vs. Net Volumes"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  The volume of excavated soil expands (bulks) when removed from its natural compact state.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Undisturbed Net Law:</strong> All BoQ excavation items are measured <strong>net</strong> as undisturbed soil in the ground.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Soil Bulking (Expansion):</strong> Soil particles loosen and trap air, causing volume increases (e.g. 10%–30%) for transit loading.
                </span>
              ),
              revealAt: 1,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Backfill Adjustment:</strong> Net backfill = Excavation volume minus the displacement volume of all concrete footing elements.
                </span>
              ),
              revealAt: 2,
            },
          ]}
        />
      }
      rightContent={
        <InteractiveCard title="Bulking & Backfill Modeler">
          <div className="space-y-4 mb-4">
            <ParameterSlider
              label="Net Excavated In-Ground Volume"
              min={10}
              max={100}
              step={5}
              value={netExcavation}
              onChange={setNetExcavation}
              unit=" m³"
            />
            
            <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-xl border border-border/40">
              <span className="text-[10px] font-mono text-muted-foreground">Soil Bulking Multiplier</span>
              <select
                value={bulkingFactor}
                onChange={(e) => setBulkingFactor(parseFloat(e.target.value))}
                className="bg-background text-primary text-xs font-bold border border-border/40 px-2 py-1 rounded-md"
              >
                <option value={1.1}>Sand / Gravel (+10%)</option>
                <option value={1.2}>Common Loam (+20%)</option>
                <option value={1.35}>Heavy Clay (+35%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
            <CalculationOutput 
              title="Loose Haulage Transit Vol" 
              value={`${transitVolume.toFixed(2)}`} 
              unit="m³"
            />
            <CalculationOutput 
              title="Estimated Trench Backfill" 
              value={`${backfillVolume.toFixed(2)}`} 
              unit="m³"
            />
          </div>
        </InteractiveCard>
      }
    />
  );
};
