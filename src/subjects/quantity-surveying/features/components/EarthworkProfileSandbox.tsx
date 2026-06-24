import React from 'react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import {
  InteractiveCard,
  ParameterSlider
} from '@/features/presentation/components/elements';
import { EarthworkProfileCanvas } from '@/features/civil-drawing/components/EarthworkProfileCanvas';
import { EarthworkSpec } from '@/features/civil-drawing/types/earthworkSchema';

interface EarthworkProfileSandboxProps {
  hideControls?: boolean;
  className?: string;
}

const EGL_POINTS = [
  { x: 0, y: 150 },
  { x: 100, y: 110 },
  { x: 200, y: 160 },
  { x: 300, y: 100 },
  { x: 400, y: 145 },
];

export const EarthworkProfileSandbox: React.FC<EarthworkProfileSandboxProps> = ({
  hideControls = false,
  className = '',
}) => {
  const [FL, setFL] = useUrlSyncedState<number>('prof_FL', 130);
  const [width, setWidth] = useUrlSyncedState<number>('prof_W', 40);
  const [cutRatio, setCutRatio] = useUrlSyncedState<number>('prof_cut', 1.5);
  const [fillRatio, setFillRatio] = useUrlSyncedState<number>('prof_fill', 2.0);

  const spec: EarthworkSpec = {
    id: 'road-longitudinal-profile',
    eglPoints: EGL_POINTS,
    formationLevel: FL,
    formationWidth: width,
    sideSlopeCutRatio: cutRatio,
    sideSlopeFillRatio: fillRatio,
    isTrenchExcavation: false,
  };

  const renderCanvas = () => (
    <div className={hideControls ? className : 'w-full'}>
      <EarthworkProfileCanvas
        spec={spec}
        scaleFactor={1} // use coordinate units directly
        showLabels={true}
      />
    </div>
  );

  if (hideControls) {
    return renderCanvas();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch select-text">
      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
        <InteractiveCard title="Longitudinal Profile Controls">
          <div className="space-y-4">
            <ParameterSlider
              label="Formation Level (FL)"
              min={80}
              max={180}
              step={5}
              value={FL}
              onChange={setFL}
              unit=""
            />
            <ParameterSlider
              label="Formation Bed Width (B)"
              min={10}
              max={80}
              step={5}
              value={width}
              onChange={setWidth}
              unit=" px"
            />
            <ParameterSlider
              label="Side Slope Cut Ratio (s_cut)"
              min={1.0}
              max={3.0}
              step={0.5}
              value={cutRatio}
              onChange={setCutRatio}
              unit=" :1"
            />
            <ParameterSlider
              label="Side Slope Fill Ratio (s_fill)"
              min={1.0}
              max={3.0}
              step={0.5}
              value={fillRatio}
              onChange={setFillRatio}
              unit=" :1"
            />
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground font-mono leading-relaxed">
            Note: SVG height represents elevation. Decreasing Formation Level (FL) moves the roadbed upwards in the view (higher elevation), causing more CUT area (red). Increasing FL moves it downwards, causing more FILL area (green).
          </div>
        </InteractiveCard>
      </div>

      <div className="lg:col-span-7">
        {renderCanvas()}
      </div>
    </div>
  );
};
