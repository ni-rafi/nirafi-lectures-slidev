import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  CalculationOutput,
  SlideCallout
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateHookAdditionDetailed } from '../../cores';
import { HookGeometryDrawing } from '../components/HookGeometryDrawing';

export const HookGeometrySandbox: React.FC = () => {
  const [barType, setBarType] = useUrlSyncedState<'plain' | 'deformed'>('hg_bar_type', 'plain');
  const [angle, setAngle] = useUrlSyncedState<90 | 135 | 180>('hg_angle', 180);
  const [dia, setDia] = useUrlSyncedState<number>('hg_dia', 12);

  const { additionM, multiplier } = calculateHookAdditionDetailed(dia, 1, angle, barType);

  return (
    <TwoColumnLayout
      title="Reinforcement Hook & Bend Geometry Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Hook Specifications">
            <div className="space-y-4 mb-4">
              {/* Bar Surface Type */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Rebar Surface Profile</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBarType('plain')}
                    className={`text-[10px] py-2 px-2.5 rounded-lg border font-bold transition-all text-center ${
                      barType === 'plain'
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                    }`}
                  >
                    Plain Round (Smooth)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBarType('deformed')}
                    className={`text-[10px] py-2 px-2.5 rounded-lg border font-bold transition-all text-center ${
                      barType === 'deformed'
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                    }`}
                  >
                    Deformed (High Bond)
                  </button>
                </div>
              </div>

              {/* Hook Angle */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Hook / Bend Angle</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAngle(90)}
                    className={`text-[10px] py-2 px-2 rounded-lg border font-mono transition-all text-center ${
                      angle === 90
                        ? 'bg-primary border-primary text-primary-foreground font-bold'
                        : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                    }`}
                  >
                    90° Hook
                  </button>
                  <button
                    type="button"
                    onClick={() => setAngle(135)}
                    className={`text-[10px] py-2 px-2 rounded-lg border font-mono transition-all text-center ${
                      angle === 135
                        ? 'bg-primary border-primary text-primary-foreground font-bold'
                        : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                    }`}
                  >
                    135° Seismic
                  </button>
                  <button
                    type="button"
                    onClick={() => setAngle(180)}
                    className={`text-[10px] py-2 px-2 rounded-lg border font-mono transition-all text-center ${
                      angle === 180
                        ? 'bg-primary border-primary text-primary-foreground font-bold'
                        : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                    }`}
                  >
                    180° Anchor
                  </button>
                </div>
              </div>

              {/* Bar Diameter */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Rebar Diameter (d)</span>
                <select
                  value={dia}
                  onChange={(e) => setDia(parseInt(e.target.value))}
                  className="bg-background text-primary text-xs font-bold border border-border/40 px-2.5 py-2 rounded-xl outline-none"
                >
                  <option value={8}>8 mm (2.5 Suta)</option>
                  <option value={10}>10 mm (3 Suta)</option>
                  <option value={12}>12 mm (4 Suta)</option>
                  <option value={16}>16 mm (5 Suta)</option>
                  <option value={20}>20 mm (6 Suta)</option>
                  <option value={25}>25 mm (8 Suta)</option>
                </select>
              </div>
            </div>

            <div className="border-t border-border/40 pt-3">
              <CalculationOutput
                title="Single Hook Addition"
                value={(multiplier * dia).toFixed(0)}
                unit="mm"
                subtitle={`Addition factor = ${multiplier}d. Total added length = ${additionM.toFixed(3)} m.`}
              />
            </div>
          </InteractiveCard>

          <SlideCallout variant="info" title="ACI / PWD Standard Hooks">
            <p className="text-[10px] leading-relaxed">
              Deformed bars require less bend length due to high surface bonding (interlock ridges). Traditional <strong>Plain Round Mild Steel</strong> requires longer anchorage hooks (e.g. 16d for a 90° bend) because it depends solely on mechanical hook clamping to transfer loads.
            </p>
          </SlideCallout>
        </div>
      }
      rightContent={
        <HookGeometryDrawing
          barType={barType}
          angle={angle}
          diameterMm={dia}
          multiplier={multiplier}
          additionM={additionM}
          className="h-full"
        />
      }
    />
  );
};

export default HookGeometrySandbox;
