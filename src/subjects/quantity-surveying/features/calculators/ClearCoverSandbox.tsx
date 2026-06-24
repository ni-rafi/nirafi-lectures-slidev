import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { SectionDrawingCanvas } from '@/features/building-drawing/components/SectionDrawingCanvas';
import { CrossSectionSpec } from '@/features/building-drawing/types/sectionSchema';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateEffectiveDepth } from '../../cores';

export const ClearCoverSandbox: React.FC = () => {
  const [width, setWidth] = useUrlSyncedState<number>('cc_beam_width', 300);
  const [depth, setDepth] = useUrlSyncedState<number>('cc_beam_depth', 450);
  const [cover, setCover] = useUrlSyncedState<number>('cc_beam_cover', 25);
  const [barDia, setBarDia] = useUrlSyncedState<number>('cc_beam_bar_dia', 16);

  const spec: CrossSectionSpec = {
    id: 'B-Sandbox',
    componentType: 'beam',
    width: width,
    depth: depth,
    clearCover: cover,
    longitudinalLayers: [
      { barDiameter: barDia, count: 3, side: 'top' },
      { barDiameter: barDia, count: 3, side: 'bottom' }
    ],
    stirrups: {
      diameter: 10,
      spacing: 150
    }
  };

  const effectiveDepth = calculateEffectiveDepth(depth, cover, 10, barDia);

  return (
    <TwoColumnLayout
      title="Clear Cover Sandbox Model"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Cross-Section Parameters">
          <div className="space-y-3 mb-4">
            <ParameterSlider
              label="Beam Width (B)"
              min={250}
              max={450}
              step={10}
              value={width}
              onChange={setWidth}
              unit=" mm"
            />
            <ParameterSlider
              label="Beam Depth (H)"
              min={300}
              max={600}
              step={25}
              value={depth}
              onChange={setDepth}
              unit=" mm"
            />
            <ParameterSlider
              label="Clear Cover"
              min={15}
              max={75}
              step={5}
              value={cover}
              onChange={setCover}
              unit=" mm"
            />
            <ParameterSlider
              label="Bar Diameter"
              min={10}
              max={25}
              step={2}
              value={barDia}
              onChange={setBarDia}
              unit=" mm"
            />
          </div>

          <div className="border-t border-border/40 pt-2.5">
            <CalculationOutput 
              title="Effective Depth (d)" 
              value={`${effectiveDepth.toFixed(0)}`} 
              unit="mm"
              subtitle="Depth minus cover, stirrup, and half rebar diameter"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <SectionDrawingCanvas spec={spec} isActive={true} />
        </div>
      }
    />
  );
};

export default ClearCoverSandbox;
