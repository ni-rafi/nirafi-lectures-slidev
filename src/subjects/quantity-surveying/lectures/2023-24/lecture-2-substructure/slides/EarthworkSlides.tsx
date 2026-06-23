import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { 
  SlideContent, 
  ClickHighlight, 
  LatexFormula, 
  InteractiveCard, 
  ParameterSlider, 
  CalculationOutput,
  ClickSyncedTabs,
  type ClickSyncedTabItem
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { JunctionDrawing, ShoringDewateringDrawing, EarthworkVolumeDrawing } from '@/subjects/quantity-surveying/features';

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
  const { currentClick } = useClickStepsContext();

  const junctionRules: ClickSyncedTabItem[] = [
    {
      title: "Junction Deduction Rule",
      badge: "Deduction Rule",
      badgeColor: "border-destructive text-destructive bg-destructive/10",
      description: (
        <span>
          For every T-junction, deduct{' '}
          <ClickHighlight at={1} variant="paint">
            <LatexFormula math="0.5 \times \text{Breadth } (B)" />
          </ClickHighlight>{' '}
          from the total centerline length.
        </span>
      ),
      rightContent: (
        <div className="w-full space-y-3">
          <JunctionDrawing
            type="t-junction"
            showHighlight={clickedJunction || currentClick >= 1}
            onJunctionClick={() => setClickedJunction(!clickedJunction)}
          />
          <div className="bg-muted/40 p-3 rounded-lg border border-border/40 select-text">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">BoQ centerline length correction formula</span>
            <div className="text-sm font-black text-foreground font-mono mt-1">
              Net L = Total L - (0.5 &times; B &times; N)
            </div>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">Where N = number of T-junctions</span>
          </div>
        </div>
      )
    },
    {
      title: "L-Junction Corners",
      badge: "Balanced Corners",
      badgeColor: "border-emerald-500 text-emerald-500 bg-emerald-500/10",
      description: (
        <span>
          L-corners require{' '}
          <ClickHighlight at={3} variant="paint">
            no deductions
          </ClickHighlight>{' '}
          as the centerline perfectly balances the inner and outer areas.
        </span>
      ),
      rightContent: (
        <div className="w-full space-y-3">
          <JunctionDrawing type="l-corner" showHighlight={currentClick >= 3} />
          <div className="bg-muted/40 p-3 rounded-lg border border-border/40 select-text">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Corner balanced geometric law</span>
            <div className="text-xs font-bold text-foreground mt-1 leading-relaxed">
              Surplus Corner Area (+0.5 B) matches Deficit Area (-0.5 B) exactly. Net corner correction = 0.
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Centre Line Deductions"
      leftTitle="Measurement Rules"
      rightTitle="Junction Geometry Analysis"
      items={junctionRules}
      leftWidth="45%"
      clickToTabMap={[0, 0, 1, 1]}
    />
  );
};

/**
 * Slide 5: Practical Realities & Dewatering
 */
export const Slide5: React.FC = () => {
  const { currentClick } = useClickStepsContext();

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
                  <strong>Timbering & Shoring:</strong> Supporting structural trench walls when depth exceeds 1.5m to prevent side collapses. Billed as area (<LatexFormula math="\text{m}^2" />).
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
        <ShoringDewateringDrawing currentStep={currentClick} />
      }
    />
  );
};

/**
 * Slide 6: Bulking vs Backfill Computations
 */
export const Slide6: React.FC = () => {
  const { currentClick } = useClickStepsContext();

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
        <EarthworkVolumeDrawing
          netVolume={30.0}
          bulkingFactor={1.2}
          currentStep={currentClick}
        />
      }
    />
  );
};

export const Slide6B: React.FC = () => {
  const [netExcavation, setNetExcavation] = useUrlSyncedState<number>('earth_net_exc', 30.0);
  const [bulkingFactor, setBulkingFactor] = useUrlSyncedState<number>('earth_bulk_fac', 1.2);
  const { currentClick } = useClickStepsContext();

  const transitVolume = netExcavation * bulkingFactor;
  const backfillVolume = netExcavation * 0.35; // typical footing volume displacement deduction

  return (
    <TwoColumnLayout
      title="Soil Bulking Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
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
      rightContent={
        <EarthworkVolumeDrawing
          netVolume={netExcavation}
          bulkingFactor={bulkingFactor}
          currentStep={currentClick}
        />
      }
    />
  );
};

