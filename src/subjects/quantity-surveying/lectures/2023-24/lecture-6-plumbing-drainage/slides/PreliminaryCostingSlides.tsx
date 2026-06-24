import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  SlideParagraph,
  SlideCallout,
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
  ClickHighlight
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculatePlumbingBudgetInternal } from '@/subjects/quantity-surveying/cores';

// ============================================================================
// Slide 28: Macro vs. Micro Estimating in Plumbing
// ============================================================================
export const Slide28: React.FC = () => (
  <TwoColumnLayout
    title="5.1 Preliminary Plumbing Budgets: Macro vs. Micro"
    bgVariant="default"
    leftWidth="45%"
    leftContent={
      <div className="space-y-4 text-left">
        <SlideParagraph title="Bridging the Scales">
          Detailed (Item Rate) estimating traces every pipe centerline and counts every tee, but project managers need approximate costs during early feasibility phases.
        </SlideParagraph>
        <p className="text-xs text-muted-foreground leading-relaxed select-text">
          Before plumbing drawings even exist, a lump-sum budget must be reserved for mechanical, electrical, and plumbing (MEP) installations based on the building's overall structural cost.
        </p>
      </div>
    }
    rightContent={
      <div className="space-y-4 flex flex-col justify-center h-full">
        <InteractiveCard title="The Budgeting Progression" variant="default" className="select-text">
          <div className="text-xs space-y-2.5">
            <p>
              • <strong>Macro Estimation</strong>
              <br /><span className="text-muted-foreground text-[10px]">Rule of thumb percentages applied to total structural civil cost during feasibility.</span>
            </p>
            <p>
              • <strong>Micro Estimation</strong>
              <br /><span className="text-muted-foreground text-[10px]">Precise measurement of piping runs, fittings, and fixture set assemblies from detailed layouts.</span>
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold border-t border-border/40 pt-2">
              💡 The quantity surveyor's ultimate task is to validate that detailed BoQ totals align with the macro limits.
            </p>
          </div>
        </InteractiveCard>
      </div>
    }
  />
);

// ============================================================================
// Slide 29: The 8% Budget Validation Rule
// ============================================================================
export const Slide29: React.FC = () => {
  const [civilCost, setCivilCost] = useUrlSyncedState<number>('plumb_prelim_civil', 15000000); // 15M BDT default
  const [ratePercent, setRatePercent] = useUrlSyncedState<number>('plumb_prelim_rate', 8.0); // 8.0% default

  const plumbingBudget = calculatePlumbingBudgetInternal(civilCost, ratePercent);

  return (
    <TwoColumnLayout
      title="5.2 The 8% Budget Validation Rule"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Budgeting Parameters">
          <div className="space-y-4">
            <ParameterSlider
              label="Civil Structural Cost"
              min={5000000}
              max={50000000}
              step={500000}
              value={civilCost}
              onChange={setCivilCost}
              unit=" BDT"
            />
            <ParameterSlider
              label="Plumbing Rate"
              min={5.0}
              max={15.0}
              step={0.5}
              value={ratePercent}
              onChange={setRatePercent}
              unit="%"
            />
          </div>

          <div className="border-t border-border/40 mt-4 pt-3">
            <CalculationOutput
              title="Estimated Plumbing Budget"
              value={plumbingBudget}
              unit="BDT"
              subtitle="Lump-sum plumbing & sanitary allowance"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-4">
          <InteractiveCard title="The Surveyor's Cross-Check" className="flex-1 select-text">
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              In South Asian practice, combined **water supply & sanitary works** typically approximate <ClickHighlight at={1} variant="paint">8% of the total civil cost</ClickHighlight> of a building.
            </p>

            <div className="p-3 bg-muted/40 rounded-xl border border-border/40 space-y-1.5 text-[10px] font-mono text-muted-foreground leading-relaxed">
              <p className="font-bold text-foreground">Validation Case Study:</p>
              <p>• Civil Structural Cost = {civilCost.toLocaleString()} BDT</p>
              <p>• Plumbing Target (8%) = {(civilCost * 0.08).toLocaleString()} BDT</p>
              <p className="text-foreground pt-1.5 border-t border-border/40">
                👉 If your detailed 50-page plumbing BoQ totals <strong>BDT 5,000,000</strong> while the 8% rule estimate is <strong>BDT 1,200,000</strong>, you likely made a major decimal or scaling error in your take-offs.
              </p>
            </div>
          </InteractiveCard>

          <SlideCallout variant="success" title="Budgeting Standard" className="py-2">
            <p className="text-[10px] leading-relaxed text-muted-foreground text-center select-text">
              Note: Combined Sanitary (8%) + Electrical (7.5%) packages constitute ~15% of the total civil cost.
            </p>
          </SlideCallout>
        </div>
      }
    />
  );
};
