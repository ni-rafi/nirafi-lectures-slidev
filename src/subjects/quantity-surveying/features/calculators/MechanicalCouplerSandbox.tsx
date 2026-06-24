import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
  SlideCallout
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateCouplerComparison } from '../../cores';
import { MechanicalCouplerDrawing } from '../components/MechanicalCouplerDrawing';

export const MechanicalCouplerSandbox: React.FC = () => {
  const [barDia, setBarDia] = useUrlSyncedState<number>('mc_bar_dia', 20);
  const [columnHeight, setColumnHeight] = useUrlSyncedState<number>('mc_col_height', 3.3);
  const [numBars, setNumBars] = useUrlSyncedState<number>('mc_num_bars', 8);
  const [steelRate, setSteelRate] = useUrlSyncedState<number>('mc_steel_rate', 95);
  const [couplerRate, setCouplerRate] = useUrlSyncedState<number>('mc_coupler_rate', 250);

  const {
    lapCostBdt,
    couplersCostBdt,
    netSavingsBdt,
    weightSavedKg
  } = calculateCouplerComparison(barDia, columnHeight, numBars, steelRate, couplerRate);

  return (
    <TwoColumnLayout
      title="Mechanical Splicing (Couplers) vs. Lapping Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Splicing Parameters">
            <div className="space-y-4 mb-4">
              {/* Bar Diameter */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Rebar Diameter (d)</span>
                <select
                  value={barDia}
                  onChange={(e) => setBarDia(parseInt(e.target.value))}
                  className="bg-background text-primary text-xs font-bold border border-border/40 px-2.5 py-1.5 rounded-xl outline-none"
                >
                  <option value={16}>16 mm (5 Suta)</option>
                  <option value={20}>20 mm (6 Suta)</option>
                  <option value={22}>22 mm (7 Suta)</option>
                  <option value={25}>25 mm (8 Suta)</option>
                  <option value={32}>32 mm (10 Suta)</option>
                </select>
              </div>

              {/* Number of bars */}
              <ParameterSlider
                label="Number of Vertical Bars"
                min={4}
                max={24}
                step={2}
                value={numBars}
                onChange={setNumBars}
                unit=" bars"
              />

              {/* Column Height */}
              <ParameterSlider
                label="Column Height"
                min={2.0}
                max={6.0}
                step={0.1}
                value={columnHeight}
                onChange={setColumnHeight}
                unit=" m"
              />

              {/* Rates */}
              <div className="grid grid-cols-2 gap-3 border-t border-border/30 pt-3">
                <ParameterSlider
                  label="Steel Rate (BDT/kg)"
                  min={80}
                  max={120}
                  step={5}
                  value={steelRate}
                  onChange={setSteelRate}
                  unit=" ৳"
                />
                <ParameterSlider
                  label="Coupler Rate (৳/pc)"
                  min={100}
                  max={600}
                  step={25}
                  value={couplerRate}
                  onChange={setCouplerRate}
                  unit=" ৳"
                />
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <CalculationOutput
                  title="Overlapped Steel Saved"
                  value={weightSavedKg.toFixed(1)}
                  unit="kg"
                  variant="compact"
                  subtitle="Lap weight eliminated"
                />
                <CalculationOutput
                  title="Couplers Total Cost"
                  value={couplersCostBdt.toFixed(0)}
                  unit="৳"
                  variant="compact"
                  subtitle="Unit rate × counts"
                />
              </div>
              <CalculationOutput
                title="Net Financial Savings"
                value={netSavingsBdt.toFixed(0)}
                unit="৳"
                subtitle={
                  netSavingsBdt >= 0
                    ? `Saved ৳${netSavingsBdt.toFixed(0)} over lapping steel cost (৳${lapCostBdt.toFixed(0)})`
                    : `Lapping is ৳${Math.abs(netSavingsBdt).toFixed(0)} cheaper, but causes high steel congestion`
                }
              />
            </div>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <MechanicalCouplerDrawing diameterMm={barDia} className="flex-1" />
          <SlideCallout variant={netSavingsBdt >= 0 ? "success" : "info"} title="PWD Procurement Standard">
            <p className="text-[10px] leading-relaxed">
              <strong>PWD Schedule of Rates (2022)</strong> specifies rates for mechanical couplers. Splicing with couplers is measured in <strong>Numbers (Nos.)</strong> rather than steel weight (Tons). Note that for larger bar sizes (&gt;20mm), the cost of the steel saved by eliminating the 50d overlap often completely covers the purchase price of the mechanical couplers!
            </p>
          </SlideCallout>
        </div>
      }
    />
  );
};

export default MechanicalCouplerSandbox;
