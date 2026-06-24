import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
  SlideCallout
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateSecondaryFramingInternal } from '../../cores';
import { SecondaryFramingDrawing } from '../components/SecondaryFramingDrawing';

export const SecondaryFramingSandbox: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useUrlSyncedState<'sagrods' | 'bracings' | 'struts' | 'all' | 'none'>('sec_highlight', 'sagrods');
  const [numBays, setNumBays] = useUrlSyncedState<number>('sec_num_bays', 4);
  const [bayLength, setBayLength] = useUrlSyncedState<number>('sec_bay_len', 6.0);
  const [purlinsCount, setPurlinsCount] = useUrlSyncedState<number>('sec_purlin_count', 5);
  const [sagrodDia, setSagrodDia] = useUrlSyncedState<number>('sec_sagrod_dia', 10);

  const rafterSlope = 5.59; // Constant representing rafter length for drawing scale
  const purlinSpacing = rafterSlope / (purlinsCount - 1 || 1);
  const bracingWeight = 2.98; // 40x40x5mm angle section = 2.98 kg/m
  const strutWeight = 2.98;

  const {
    sagrodWeightKg,
    bracingWeightKg,
    strutWeightKg,
    totalSecondaryWeightKg
  } = calculateSecondaryFramingInternal(
    rafterSlope,
    bayLength,
    numBays,
    purlinSpacing,
    purlinsCount,
    sagrodDia,
    bracingWeight,
    strutWeight
  );

  return (
    <TwoColumnLayout
      title="Secondary Framing: Sagrods &amp; Bracings Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Framing Configuration">
            <div className="space-y-4 mb-4">
              {/* Highlight selector */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Member Category Focus</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['sagrods', 'bracings', 'struts'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveHighlight(cat)}
                      className={`py-1 px-2 text-center text-xs font-bold rounded-lg border transition-all ${
                        activeHighlight === cat
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted border-border/40 hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {cat === 'sagrods' ? 'Sagrods' : cat === 'bracings' ? 'Wind Bracings' : 'Ties/Struts'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Bays */}
              <ParameterSlider
                label="Number of Bays"
                min={2}
                max={8}
                step={1}
                value={numBays}
                onChange={setNumBays}
                unit=" bays"
              />

              {/* Bay Length */}
              <ParameterSlider
                label="Individual Bay Length"
                min={3.0}
                max={9.0}
                step={0.5}
                value={bayLength}
                onChange={setBayLength}
                unit=" m"
              />

              <div className="grid grid-cols-2 gap-2.5">
                {/* Purlin count */}
                <ParameterSlider
                  label="Purlins per Slope"
                  min={3}
                  max={8}
                  step={1}
                  value={purlinsCount}
                  onChange={setPurlinsCount}
                  unit=" lines"
                />

                {/* Sagrod diameter */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Sagrod Rebar Size</span>
                  <select
                    value={sagrodDia}
                    onChange={(e) => setSagrodDia(parseInt(e.target.value))}
                    className="bg-background text-primary text-xs font-bold border border-border/40 px-2 py-1 rounded-xl outline-none mt-1"
                  >
                    <option value={10}>10 mm (#3 bar)</option>
                    <option value={12}>12 mm (#4 bar)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                <CalculationOutput
                  title="Sagrods"
                  value={sagrodWeightKg.toFixed(1)}
                  unit="kg"
                  variant="compact"
                  className={activeHighlight === 'sagrods' ? 'border-primary ring-1 ring-primary/20' : ''}
                />
                <CalculationOutput
                  title="Wind Bracing"
                  value={bracingWeightKg.toFixed(1)}
                  unit="kg"
                  variant="compact"
                  className={activeHighlight === 'bracings' ? 'border-primary ring-1 ring-primary/20' : ''}
                />
                <CalculationOutput
                  title="Struts/Ties"
                  value={strutWeightKg.toFixed(1)}
                  unit="kg"
                  variant="compact"
                  className={activeHighlight === 'struts' ? 'border-primary ring-1 ring-primary/20' : ''}
                />
              </div>

              <CalculationOutput
                title="Total Secondary Steel Weight"
                value={totalSecondaryWeightKg.toFixed(1)}
                unit="kg"
                subtitle={`Combined secondary tonnage: ${(totalSecondaryWeightKg / 1000).toFixed(3)} Metric Tons. Includes sagrods, wind bracing angles, and chord struts.`}
              />
            </div>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <SecondaryFramingDrawing
            activeHighlight={activeHighlight}
            className="flex-1"
          />
          <SlideCallout variant="info" title="Take-off Tip: End-Bay Wind Bracings">
            <p className="text-[10px] leading-relaxed">
              Standard wind bracings connect structural trusses diagonally. As per typical PWD specifications, wind bracings are placed only in the **outermost end bays** (first and last bays) on both slopes. Sagrods connect every bay longitudinally to prevent purlin rotation under roofing sheets.
            </p>
          </SlideCallout>
        </div>
      }
    />
  );
};

export default SecondaryFramingSandbox;
