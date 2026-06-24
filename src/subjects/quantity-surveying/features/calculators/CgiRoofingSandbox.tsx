import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
  SlideCallout
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateCgiRoofingInternal } from '../../cores';
import { CgiRoofingDrawing } from '../components/CgiRoofingDrawing';

export const CgiRoofingSandbox: React.FC = () => {
  const [span, setSpan] = useUrlSyncedState<number>('cgi_span', 10);
  const [rise, setRise] = useUrlSyncedState<number>('cgi_rise', 2.5);
  const [length, setLength] = useUrlSyncedState<number>('cgi_len', 12);
  const [sideOverhang, setSideOverhang] = useUrlSyncedState<number>('cgi_side_overhang', 0.5);
  const [eavesOverhang, setEavesOverhang] = useUrlSyncedState<number>('cgi_eaves_overhang', 0.3);
  const [cf, setCf] = useUrlSyncedState<number>('cgi_corr_factor', 1.15);
  const [gauge, setGauge] = useUrlSyncedState<number>('cgi_gauge', 22);

  const {
    rafterSlopeM,
    coveredAreaM2,
    sheetWeightKg,
    ridgingLengthM
  } = calculateCgiRoofingInternal(span, rise, length, sideOverhang, eavesOverhang, cf, gauge);

  return (
    <TwoColumnLayout
      title="CGI Sheet Roofing Cladding Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Roof Dimensions">
            <div className="space-y-4 mb-4">
              {/* Span */}
              <ParameterSlider
                label="Truss Span (L)"
                min={6}
                max={24}
                step={0.5}
                value={span}
                onChange={setSpan}
                unit=" m"
              />

              {/* Rise */}
              <ParameterSlider
                label="Truss Rise (h)"
                min={1}
                max={6}
                step={0.1}
                value={rise}
                onChange={setRise}
                unit=" m"
              />

              {/* Building Length */}
              <ParameterSlider
                label="Building Length (Bay Direction)"
                min={6}
                max={48}
                step={1}
                value={length}
                onChange={setLength}
                unit=" m"
              />

              <div className="grid grid-cols-2 gap-2">
                {/* Side Overhang */}
                <ParameterSlider
                  label="Side Overhang"
                  min={0}
                  max={1.5}
                  step={0.1}
                  value={sideOverhang}
                  onChange={setSideOverhang}
                  unit=" m"
                />

                {/* Eaves Overhang */}
                <ParameterSlider
                  label="Eaves Overhang"
                  min={0}
                  max={1.5}
                  step={0.1}
                  value={eavesOverhang}
                  onChange={setEavesOverhang}
                  unit=" m"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Corrugation Factor */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Corrugation Factor</span>
                  <select
                    value={cf}
                    onChange={(e) => setCf(parseFloat(e.target.value))}
                    className="bg-background text-primary text-xs font-bold border border-border/40 px-2 py-1 rounded-xl outline-none"
                  >
                    <option value={1.10}>1.10 (Standard Profile)</option>
                    <option value={1.15}>1.15 (PWD Standard CGI)</option>
                    <option value={1.20}>1.20 (Deep Corrugations)</option>
                  </select>
                </div>

                {/* CGI Gauge Selector */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Thickness Gauge</span>
                  <select
                    value={gauge}
                    onChange={(e) => setGauge(parseInt(e.target.value))}
                    className="bg-background text-primary text-xs font-bold border border-border/40 px-2 py-1 rounded-xl outline-none"
                  >
                    <option value={24}>24 BWG (0.63mm, 5.4 kg/m²)</option>
                    <option value={22}>22 BWG (0.80mm, 6.8 kg/m²)</option>
                    <option value={20}>20 BWG (1.00mm, 8.5 kg/m²)</option>
                    <option value={18}>18 BWG (1.25mm, 10.6 kg/m²)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <CalculationOutput
                  title="Rafter Sloping Length"
                  value={rafterSlopeM.toFixed(3)}
                  unit="m"
                  variant="compact"
                />
                <CalculationOutput
                  title="Ridge Ridging Length"
                  value={ridgingLengthM.toFixed(3)}
                  unit="m"
                  variant="compact"
                />
              </div>

              <CalculationOutput
                title="Total covered Cladding Area"
                value={coveredAreaM2.toFixed(3)}
                unit="m²"
                subtitle={`Calculated including overhangs: 2 × (Slope + Eaves) × (Length + 2 × Side) × Corrugation Factor (${cf})`}
              />

              <CalculationOutput
                title="Cladding Sheet Weight"
                value={(sheetWeightKg / 1000).toFixed(3)}
                unit="Tons"
                subtitle={`Total Weight: ${sheetWeightKg.toFixed(1)} kg (at ${gauge} BWG = ${(sheetWeightKg / coveredAreaM2).toFixed(1)} kg/m²)`}
              />
            </div>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <CgiRoofingDrawing
            span={span}
            rise={rise}
            buildingLength={length}
            sideOverhang={sideOverhang}
            eavesOverhang={eavesOverhang}
            className="flex-1"
          />
          <SlideCallout variant="info" title="Take-off Tip: Sheet Ridging">
            <p className="text-[10px] leading-relaxed">
              Remember that corrugated sheets are estimated in <strong>square units</strong> (m² or sft). However, the plain galvanized ridge cap along the apex roofline is estimated separately in <strong>running units</strong> (meters or rft) and usually overlaps by 300 mm.
            </p>
          </SlideCallout>
        </div>
      }
    />
  );
};

export default CgiRoofingSandbox;
