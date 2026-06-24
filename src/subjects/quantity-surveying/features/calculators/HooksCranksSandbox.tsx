import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { HookCrankDrawing } from '../components/HookCrankDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import {
  calculateHookAdditionInternal,
  calculateCrankAdditionInternal
} from '../../cores';

export const HooksCranksSandbox: React.FC = () => {
  const [dia, setDia] = useUrlSyncedState<number>('mc_bar_dia', 16);
  const [depth, setDepth] = useUrlSyncedState<number>('mc_slab_depth', 0.120);

  const hookAdd = calculateHookAdditionInternal(dia, 2); // 2 hooks
  const crankAdd = calculateCrankAdditionInternal(depth, 2); // 2 cranks

  return (
    <TwoColumnLayout
      title="Bending Additions Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Geometry Inputs">
          <div className="space-y-4 mb-5">
            <ParameterSlider
              label="Bar Diameter (d)"
              min={10}
              max={25}
              step={2}
              value={dia}
              onChange={setDia}
              unit=" mm"
            />
            <ParameterSlider
              label="Effective Depth (D)"
              min={0.08}
              max={0.2}
              step={0.01}
              value={depth}
              onChange={setDepth}
              unit=" m"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-3">
            <CalculationOutput
              title="2 Hooks (+18d)"
              value={hookAdd.toFixed(3)}
              unit="m"
            />
            <CalculationOutput
              title="2 Cranks (+0.84D)"
              value={crankAdd.toFixed(3)}
              unit="m"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <HookCrankDrawing diameterMm={dia} effectiveDepthM={depth} showAnnotation={true} />
      }
    />
  );
};

export default HooksCranksSandbox;
