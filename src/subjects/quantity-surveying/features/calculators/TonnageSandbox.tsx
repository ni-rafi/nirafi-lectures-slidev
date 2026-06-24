import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { WeightConversionDrawing } from '../components/WeightConversionDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateSteelWeightInternal } from '../../cores';

export const TonnageSandbox: React.FC = () => {
  const [dia, setDia] = useUrlSyncedState<number>('tc_bar_dia', 16);
  const [len, setLen] = useUrlSyncedState<number>('tc_bar_len', 12.0);

  const result = calculateSteelWeightInternal(dia, len);

  return (
    <TwoColumnLayout
      title="Steel Weight Converter Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Procurement Inputs">
          <div className="space-y-4 mb-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Rebar Diameter (D)</span>
              <select
                value={dia}
                onChange={(e) => setDia(parseInt(e.target.value))}
                className="bg-background text-primary text-xs font-bold border border-border/40 px-2.5 py-1.5 rounded-xl outline-none"
              >
                <option value={10}>10 mm (3 Suta)</option>
                <option value={12}>12 mm (4 Suta)</option>
                <option value={16}>16 mm (5 Suta)</option>
                <option value={20}>20 mm (6 Suta)</option>
                <option value={22}>22 mm (7 Suta)</option>
                <option value={25}>25 mm (8 Suta)</option>
              </select>
            </div>

            <ParameterSlider
              label="Total Rebar Length"
              min={1.0}
              max={120.0}
              step={1.0}
              value={len}
              onChange={setLen}
              unit=" m"
            />
          </div>

          <div className="border-t border-border/40 pt-3">
            <CalculationOutput
              title="Calculated Weight"
              value={result.weightKg.toFixed(3)}
              unit="kg"
              subtitle={`Equivalent to ${(result.weightKg / 1000).toFixed(6)} Metric Tons`}
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <WeightConversionDrawing diameterMm={dia} lengthM={len} />
      }
    />
  );
};

export default TonnageSandbox;
