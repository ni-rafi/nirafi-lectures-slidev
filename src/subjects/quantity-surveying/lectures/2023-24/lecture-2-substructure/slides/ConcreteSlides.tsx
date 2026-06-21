import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { 
  SlideContent, 
  ClickHighlight, 
  LatexFormula, 
  InteractiveCard, 
  ParameterSlider, 
  CalculationOutput 
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';

/**
 * Slide 7: Brick Flat Soling (BFS) Bedding
 */
export const Slide7: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('bfs_len', 3.0);
  const [width, setWidth] = useUrlSyncedState<number>('bfs_width', 2.4);
  const area = length * width;

  return (
    <TwoColumnLayout
      title="Brick Flat Soling (BFS) Bedding"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  The foundation sub-grade is prepared by placing a single layer of local bricks flat on the excavated soil.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Flat Bedding:</strong> Bricks are laid side-by-side horizontally. This creates a stable surface for subsequent concrete casting.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Billing Standard:</strong> BFS is measured strictly as a <strong>surface area item</strong> (<ClickHighlight at={1} variant="paint"><LatexFormula math="\text{m}^2" /></ClickHighlight>).
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Bangladesh/PWD Rule:</strong> Thickness (typically 75mm or 3") is standardized, so volume is not billed separately.
                </span>
              ),
              revealAt: 2,
            },
          ]}
        />
      }
      rightContent={
        <InteractiveCard title="BFS Area Take-off Sandbox">
          <div className="space-y-4 mb-4">
            <ParameterSlider
              label="Foundation Bed Length"
              min={1.0}
              max={10.0}
              step={0.1}
              value={length}
              onChange={setLength}
              unit=" m"
            />
            <ParameterSlider
              label="Foundation Bed Width"
              min={1.0}
              max={5.0}
              step={0.1}
              value={width}
              onChange={setWidth}
              unit=" m"
            />
          </div>

          <div className="relative h-24 bg-muted/40 rounded-lg border border-border/30 flex items-center justify-center p-2 mb-4 overflow-hidden">
            {/* Flat bricks grid representation */}
            <div className="grid grid-cols-6 gap-1 w-40 h-16 border border-primary/40 p-1 bg-primary/5 rounded-md">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-primary/20 border border-primary/40 rounded-sm" />
              ))}
            </div>
          </div>

          <div className="border-t border-border/40 pt-2">
            <CalculationOutput 
              title="Net BFS Surface Area" 
              value={`${area.toFixed(3)}`} 
              unit="m²"
            />
          </div>
        </InteractiveCard>
      }
    />
  );
};

/**
 * Slide 8: Lean Cement Concrete (CC) Base
 */
export const Slide8: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('cc_len', 3.0);
  const [width, setWidth] = useUrlSyncedState<number>('cc_width', 2.4);
  const [thickness, setThickness] = useUrlSyncedState<number>('cc_thick', 0.075);
  const volume = length * width * thickness;

  return (
    <TwoColumnLayout
      title="Lean Cement Concrete (CC) Base"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Placed immediately over the BFS, the Lean Concrete Bedding seals the excavation bottom.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Standard Mix Ratio:</strong> Typically a lean 1:3:6 or 1:4:8 cement-sand-stone/brick aggregate mix.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Billing Standard:</strong> CC base is measured as a <strong>volumetric item</strong> (<ClickHighlight at={1} variant="paint"><LatexFormula math="\text{m}^3" /></ClickHighlight>).
                </span>
              ),
              revealAt: 0,
            },
          ]}
        />
      }
      rightContent={
        <InteractiveCard title="Lean CC Volume Sandbox">
          <div className="space-y-3 mb-4">
            <ParameterSlider
              label="Base Length"
              min={1.0}
              max={10.0}
              step={0.1}
              value={length}
              onChange={setLength}
              unit=" m"
            />
            <ParameterSlider
              label="Base Width"
              min={1.0}
              max={5.0}
              step={0.1}
              value={width}
              onChange={setWidth}
              unit=" m"
            />
            <ParameterSlider
              label="Base Thickness (D)"
              min={0.05}
              max={0.2}
              step={0.025}
              value={thickness}
              onChange={setThickness}
              unit=" m"
            />
          </div>

          <div className="border-t border-border/40 pt-2">
            <CalculationOutput 
              title="Net Lean CC Volume" 
              value={`${volume.toFixed(3)}`} 
              unit="m³"
            />
          </div>
        </InteractiveCard>
      }
    />
  );
};

/**
 * Slide 9: Reinforced Concrete (RCC) Footing Base
 */
export const Slide9: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('rcc_len', 2.0);
  const [width, setWidth] = useUrlSyncedState<number>('rcc_width', 2.0);
  const [height, setHeight] = useUrlSyncedState<number>('rcc_depth', 0.45);
  const volume = length * width * height;

  return (
    <TwoColumnLayout
      title="Reinforced Concrete Footings"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Reinforced Concrete (RCC) isolated footings transfer column loads directly into the soil.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Isolated Columns:</strong> Two-storied frames typically employ square or rectangular stepped footing blocks.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Calculation Bounds:</strong> Volumetric assessment: <LatexFormula math="V = L \times B \times D" />. Rebar displacement is neglected during concrete BoQ estimation.
                </span>
              ),
              revealAt: 1,
            },
          ]}
        />
      }
      rightContent={
        <InteractiveCard title="RCC Footing Sandbox">
          <div className="space-y-3 mb-4">
            <ParameterSlider
              label="Footing Length (L)"
              min={1.0}
              max={5.5}
              step={0.05}
              value={length}
              onChange={setLength}
              unit=" m"
            />
            <ParameterSlider
              label="Footing Width (B)"
              min={1.0}
              max={5.5}
              step={0.05}
              value={width}
              onChange={setWidth}
              unit=" m"
            />
            <ParameterSlider
              label="Footing Depth (D)"
              min={0.3}
              max={1.2}
              step={0.05}
              value={height}
              onChange={setHeight}
              unit=" m"
            />
          </div>

          <div className="border-t border-border/40 pt-2">
            <CalculationOutput 
              title="Footing Concrete Net Vol" 
              value={`${volume.toFixed(3)}`} 
              unit="m³"
            />
          </div>
        </InteractiveCard>
      }
    />
  );
};
