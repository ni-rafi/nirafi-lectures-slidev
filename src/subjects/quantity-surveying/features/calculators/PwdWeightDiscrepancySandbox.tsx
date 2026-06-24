import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
  SlideCallout
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateRebarWeightPwdVsFormula } from '../../cores';
import { PwdWeightDiscrepancyDrawing } from '../components/PwdWeightDiscrepancyDrawing';

export const PwdWeightDiscrepancySandbox: React.FC = () => {
  const [dia, setDia] = useUrlSyncedState<number>('pwd_bar_dia', 10);
  const [length, setLength] = useUrlSyncedState<number>('pwd_bar_len', 5000); // 5000 meters rebar
  const [rate, setRate] = useUrlSyncedState<number>('pwd_steel_rate', 95);

  const {
    weightFormulaKg,
    weightPwdKg,
    diffKg
  } = calculateRebarWeightPwdVsFormula(dia, length);

  const costDifference = diffKg * rate;

  return (
    <TwoColumnLayout
      title="Theoretical weight vs. PWD Legal Constants Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Contract Inputs">
            <div className="space-y-4 mb-4">
              {/* Bar Diameter */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Rebar Diameter (d)</span>
                <select
                  value={dia}
                  onChange={(e) => setDia(parseInt(e.target.value))}
                  className="bg-background text-primary text-xs font-bold border border-border/40 px-2.5 py-1.5 rounded-xl outline-none"
                >
                  <option value={10}>10 mm (Formula: 0.617 vs. PWD: 0.616 kg/m)</option>
                  <option value={12}>12 mm (Formula: 0.889 vs. PWD: 0.888 kg/m)</option>
                  <option value={16}>16 mm (Formula: 1.580 vs. PWD: 1.579 kg/m)</option>
                  <option value={20}>20 mm (Formula: 2.469 vs. PWD: 2.466 kg/m)</option>
                  <option value={22}>22 mm (Formula: 2.988 vs. PWD: 2.984 kg/m)</option>
                  <option value={25}>25 mm (Formula: 3.858 vs. PWD: 3.853 kg/m)</option>
                </select>
              </div>

              {/* Total Length */}
              <ParameterSlider
                label="Total Rebar Length"
                min={100}
                max={20000}
                step={100}
                value={length}
                onChange={setLength}
                unit=" m"
              />

              {/* Steel Rate */}
              <ParameterSlider
                label="Steel BDT Rate (৳/kg)"
                min={80}
                max={120}
                step={5}
                value={rate}
                onChange={setRate}
                unit=" ৳"
              />
            </div>

            <div className="border-t border-border/40 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <CalculationOutput
                  title="Weight Deviation"
                  value={diffKg.toFixed(1)}
                  unit="kg"
                  variant="compact"
                  subtitle="Formula minus PWD"
                />
                <CalculationOutput
                  title="Financial Deviation"
                  value={costDifference.toFixed(0)}
                  unit="৳"
                  variant="compact"
                  subtitle="Audit risk amount"
                />
              </div>

              <CalculationOutput
                title="Bidding BoQ Variance"
                value={(weightPwdKg / 1000).toFixed(3)}
                unit="Tons"
                subtitle={`Theoretical Formula gives ${(weightFormulaKg / 1000).toFixed(3)} Tons. Discrepancy is ৳${costDifference.toFixed(0)} BDT.`}
              />
            </div>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <PwdWeightDiscrepancyDrawing
            diameterMm={dia}
            lengthM={length}
            weightFormulaKg={weightFormulaKg}
            weightPwdKg={weightPwdKg}
            diffKg={diffKg}
            className="flex-1"
          />
          <SlideCallout variant="danger" title="⚠️ Legal Compliance Warning">
            <p className="text-[10px] leading-relaxed">
              When bidding for public works or municipal infrastructure, utilizing the mathematical formula <code>D²/162</code> for billing conversions creates a financial audit discrepancy. The audit office will reject your bills if they deviate from the official PWD constants. Always use PWD tables for BoQ estimation!
            </p>
          </SlideCallout>
        </div>
      }
    />
  );
};

export default PwdWeightDiscrepancySandbox;
