import React, { useEffect } from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
  SlideCallout
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculatePwdSectionWeightInternal } from '../../cores';
import { PwdSectionWeightDrawing } from '../components/PwdSectionWeightDrawing';

export const PwdSectionWeightSandbox: React.FC = () => {
  const [shape, setShape] = useUrlSyncedState<'flat' | 'z' | 'tee'>('sec_shape', 'tee');
  const [sizeKey, setSizeKey] = useUrlSyncedState<string>('sec_size', '40x40x5');
  const [length, setLength] = useUrlSyncedState<number>('sec_len', 100);
  const [rate, setRate] = useUrlSyncedState<number>('sec_rate', 110);

  // Sync sizeKey option list when shape changes to avoid invalid keys
  useEffect(() => {
    if (shape === 'flat' && !['25x5', '40x6', '50x6'].includes(sizeKey)) {
      setSizeKey('40x6');
    } else if (shape === 'z' && !['20x20x3', '25x25x3'].includes(sizeKey)) {
      setSizeKey('25x25x3');
    } else if (shape === 'tee' && !['25x25x3', '40x40x5', '50x50x6'].includes(sizeKey)) {
      setSizeKey('40x40x5');
    }
  }, [shape, sizeKey, setSizeKey]);

  const {
    pwdWeightKg,
    formulaWeightKg,
    diffKg
  } = calculatePwdSectionWeightInternal(shape, sizeKey, length);

  const costDifference = diffKg * rate;

  return (
    <TwoColumnLayout
      title="PWD Table Weights vs. Theoretical Formula Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Section Parameters">
            <div className="space-y-4 mb-4">
              {/* Shape Selector */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Section Shape</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['flat', 'z', 'tee'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setShape(s)}
                      className={`py-1.5 px-2 text-center text-xs font-bold rounded-lg border transition-all ${
                        shape === s
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted border-border/40 hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {s === 'flat' ? 'Flat Bar' : s === 'z' ? 'Z-Section' : 'Tee Section'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Dropdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Standard Size (mm)</span>
                <select
                  value={sizeKey}
                  onChange={(e) => setSizeKey(e.target.value)}
                  className="bg-background text-primary text-xs font-bold border border-border/40 px-2.5 py-1.5 rounded-xl outline-none"
                >
                  {shape === 'flat' && (
                    <>
                      <option value="25x5">25 mm × 5 mm (PWD: 0.981 kg/m)</option>
                      <option value="40x6">40 mm × 6 mm (PWD: 1.884 kg/m)</option>
                      <option value="50x6">50 mm × 6 mm (PWD: 2.355 kg/m)</option>
                    </>
                  )}
                  {shape === 'z' && (
                    <>
                      <option value="20x20x3">20 × 20 × 3 mm (PWD: 1.120 kg/m)</option>
                      <option value="25x25x3">25 × 25 × 3 mm (PWD: 1.450 kg/m)</option>
                    </>
                  )}
                  {shape === 'tee' && (
                    <>
                      <option value="25x25x3">25 × 25 × 3 mm (PWD: 1.120 kg/m)</option>
                      <option value="40x40x5">40 × 40 × 5 mm (PWD: 2.980 kg/m)</option>
                      <option value="50x50x6">50 × 50 × 6 mm (PWD: 4.440 kg/m)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Length */}
              <ParameterSlider
                label="Linear Member Length"
                min={10}
                max={1000}
                step={10}
                value={length}
                onChange={setLength}
                unit=" m"
              />

              {/* Steel Cost Rate */}
              <ParameterSlider
                label="Steel Cost Rate (৳/kg)"
                min={80}
                max={150}
                step={5}
                value={rate}
                onChange={setRate}
                unit=" ৳"
              />
            </div>

            <div className="border-t border-border/40 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <CalculationOutput
                  title="PWD Table Weight"
                  value={pwdWeightKg.toFixed(1)}
                  unit="kg"
                  variant="compact"
                />
                <CalculationOutput
                  title="Theoretical Weight"
                  value={formulaWeightKg.toFixed(1)}
                  unit="kg"
                  variant="compact"
                />
              </div>

              <CalculationOutput
                title="Tonnage Billing Deviation"
                value={Math.abs(diffKg).toFixed(2)}
                unit="kg"
                subtitle={`The deviation is ${((diffKg / (pwdWeightKg || 1)) * 100).toFixed(2)}%. Formula weight is ${diffKg >= 0 ? 'heavier' : 'lighter'} than PWD legal weights.`}
              />

              <CalculationOutput
                title="Financial Impact (BoQ Variance)"
                value={Math.abs(costDifference).toFixed(0)}
                unit="৳"
                subtitle={`Total financial risk/variance: ৳${Math.abs(costDifference).toFixed(0)} BDT for a quantity of ${length}m.`}
              />
            </div>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <PwdSectionWeightDrawing
            shape={shape}
            sizeKey={sizeKey}
            className="flex-1"
          />
          <SlideCallout variant="warning" title="Design Code & Billing Audit Standard">
            <p className="text-[10px] leading-relaxed">
              Why the difference? Standard PWD profiles account for fillets, root curves, and manufacturing tolerances that aren't represented in basic flat geometric calculations. Government auditors verify bills strictly using PWD tables. A variance of even 1-2% on massive structural contracts can result in audit failures and rejected bills.
            </p>
          </SlideCallout>
        </div>
      }
    />
  );
};

export default PwdSectionWeightSandbox;
