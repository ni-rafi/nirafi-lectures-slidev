import React from 'react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { calculateRoadwayArea } from '../../cores';
import { RoadwaySectionDrawing } from './RoadwaySectionDrawing';

interface RoadwayAreaSandboxProps {
  hideControls?: boolean;
  currentClick?: number;
  className?: string;
}

export const RoadwayAreaSandbox: React.FC<RoadwayAreaSandboxProps> = ({
  hideControls = false,
  currentClick,
  className = '',
}) => {
  const [B, setB] = useUrlSyncedState<number>('road_B', 10.0);
  const [s, setS] = useUrlSyncedState<number>('road_s', 2.0);
  const [d, setD] = useUrlSyncedState<number>('road_d', 1.5); // depth of cut or height of fill

  const absD = Math.abs(d);
  const centralArea = B * absD;
  const sideArea = s * absD * absD;
  const totalArea = calculateRoadwayArea(B, s, d);

  const renderDrawing = () => (
    <RoadwaySectionDrawing
      B={B}
      s={s}
      d={d}
      currentClick={currentClick}
      className={hideControls ? className : 'h-full'}
    />
  );

  if (hideControls) {
    return renderDrawing();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full items-stretch select-text">
      <div className="md:col-span-6 flex flex-col justify-between space-y-4">
        <InteractiveCard title="Cross-Section Geometry Sliders">
          <div className="space-y-4 mb-4">
            <ParameterSlider
              label="Formation Width (B)"
              min={6.0}
              max={15.0}
              step={0.5}
              value={B}
              onChange={setB}
              unit=" m"
            />
            <ParameterSlider
              label="Side Slope Ratio (s:1)"
              min={1.0}
              max={4.0}
              step={0.5}
              value={s}
              onChange={setS}
              unit=" :1"
            />
            <ParameterSlider
              label="Height/Depth (d)"
              min={-3.0}
              max={3.0}
              step={0.1}
              value={d}
              onChange={setD}
              unit=" m"
            />
            <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-xl border border-border/40 text-xs">
              <span className="font-mono text-muted-foreground">Type:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                d >= 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}>
                {d >= 0 ? 'Embankment (Filling)' : 'Trench (Cutting)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/40">
            <CalculationOutput
              title="Central Area (B·d)"
              value={centralArea.toFixed(3)}
              unit=" m²"
              variant="compact"
            />
            <CalculationOutput
              title="Side Area (s·d²)"
              value={sideArea.toFixed(3)}
              unit=" m²"
              variant="compact"
            />
            <CalculationOutput
              title="Total Area"
              value={totalArea.toFixed(3)}
              unit=" m²"
              variant="compact"
            />
          </div>
        </InteractiveCard>
      </div>

      <div className="md:col-span-6">
        {renderDrawing()}
      </div>
    </div>
  );
};
