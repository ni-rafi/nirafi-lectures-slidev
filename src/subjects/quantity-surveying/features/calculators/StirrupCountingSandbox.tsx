import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { StirrupCountingDrawing } from '../components/StirrupCountingDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateStirrupsCountInternal } from '../../cores';

export const StirrupCountingSandbox: React.FC = () => {
  const [span, setSpan] = useUrlSyncedState<number>('dt_clear_span', 3.0);
  const [spacing, setSpacing] = useUrlSyncedState<number>('dt_spacing', 0.150);

  const count = calculateStirrupsCountInternal(span, spacing);

  return (
    <TwoColumnLayout
      title="Stirrup Distribution Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Span & Spacing Controls">
          <div className="space-y-4 mb-5">
            <ParameterSlider
              label="Clear Span (L)"
              min={1.5}
              max={6.0}
              step={0.1}
              value={span}
              onChange={setSpan}
              unit=" m"
            />
            <ParameterSlider
              label="Stirrup Spacing (s)"
              min={0.1}
              max={0.3}
              step={0.025}
              value={spacing}
              onChange={setSpacing}
              unit=" m"
            />
          </div>

          <div className="border-t border-border/40 pt-3">
            <CalculationOutput 
              title="Calculated Stirrups" 
              value={count} 
              unit="Nos."
              subtitle="Clear Span divided by Spacing + 1 (Start/End offset)"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <StirrupCountingDrawing clearSpanM={span} spacingM={spacing} />
      }
    />
  );
};

export default StirrupCountingSandbox;
