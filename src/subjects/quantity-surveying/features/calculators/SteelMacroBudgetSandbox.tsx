import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
  SlideCallout
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateSteelMacroBudget } from '../../cores';
import { SteelMacroBudgetDrawing } from '../components/SteelMacroBudgetDrawing';

export const SteelMacroBudgetSandbox: React.FC = () => {
  const [concreteVol, setConcreteVol] = useUrlSyncedState<number>('mb_concrete_vol', 15.0);
  const [steelRatio, setSteelRatio] = useUrlSyncedState<number>('mb_steel_ratio', 1.0);

  const result = calculateSteelMacroBudget(concreteVol, steelRatio);

  const applyPreset = (ratio: number) => {
    setSteelRatio(ratio);
  };

  return (
    <TwoColumnLayout
      title="Steel Macro-Budget Estimator (Rules of Thumb)"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Budgeting Parameters">
            <div className="space-y-4 mb-4">
              <ParameterSlider
                label="RCC Concrete Volume"
                min={1.0}
                max={100.0}
                step={1.0}
                value={concreteVol}
                onChange={setConcreteVol}
                unit=" m³"
              />

              <ParameterSlider
                label="Steel Ratio"
                min={0.5}
                max={3.0}
                step={0.1}
                value={steelRatio}
                onChange={setSteelRatio}
                unit="%"
              />
            </div>

            <div className="border-t border-border/40 pt-3 mb-3">
              <CalculationOutput
                title="Estimated Steel Weight"
                value={result.steelWeightKg.toFixed(1)}
                unit="kg"
                subtitle={`Equivalent to ${(result.steelWeightKg / 1000).toFixed(3)} Metric Tons`}
              />
            </div>

            <div className="border-t border-border/40 pt-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">
                Typical Structural Member Presets
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset(0.7)}
                  className={`text-[10px] py-1.5 px-2 rounded-lg border font-mono transition-all text-center ${
                    steelRatio === 0.7
                      ? 'bg-primary border-primary text-primary-foreground font-bold'
                      : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                  }`}
                >
                  Slabs (~0.7%)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(1.2)}
                  className={`text-[10px] py-1.5 px-2 rounded-lg border font-mono transition-all text-center ${
                    steelRatio === 1.2
                      ? 'bg-primary border-primary text-primary-foreground font-bold'
                      : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                  }`}
                >
                  Beams (~1.2%)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(2.0)}
                  className={`text-[10px] py-1.5 px-2 rounded-lg border font-mono transition-all text-center ${
                    steelRatio === 2.0
                      ? 'bg-primary border-primary text-primary-foreground font-bold'
                      : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                  }`}
                >
                  Columns (~2.0%)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(1.0)}
                  className={`text-[10px] py-1.5 px-2 rounded-lg border font-mono transition-all text-center ${
                    steelRatio === 1.0
                      ? 'bg-primary border-primary text-primary-foreground font-bold'
                      : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                  }`}
                >
                  Standard (~1.0%)
                </button>
              </div>
            </div>
          </InteractiveCard>

          <SlideCallout variant="warning" title="💡 Estimation Safety Check">
            <p className="text-[10px] leading-relaxed">
              If your detailed Bar Bending Schedule (BBS) calculations for a building project yield a final tonnage that is less than 0.6% or greater than 2.0% of the total RCC concrete volume, you should run a pre-flight audit. Mathematical or scale conversion errors in ledger spacing are common causes of discrepancies.
            </p>
          </SlideCallout>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <SteelMacroBudgetDrawing concreteVolM3={concreteVol} ratioPercent={steelRatio} className="flex-1" />
          <InteractiveCard title="Theoretical Concrete Weight Context" className="py-2.5">
            <div className="grid grid-cols-2 gap-3 text-[10px] leading-relaxed text-muted-foreground">
              <div>
                <strong>Concrete Density:</strong> 2,400 kg/m³
              </div>
              <div>
                <strong>Steel Density:</strong> 7,850 kg/m³
              </div>
              <div className="col-span-2 border-t border-border/30 pt-1.5 mt-1 font-mono text-[9px] text-foreground">
                At {steelRatio.toFixed(1)}% ratio, steel weighs approx. {((steelRatio/100)*7850).toFixed(0)} kg per m³ of concrete.
              </div>
            </div>
          </InteractiveCard>
        </div>
      }
    />
  );
};

export default SteelMacroBudgetSandbox;
