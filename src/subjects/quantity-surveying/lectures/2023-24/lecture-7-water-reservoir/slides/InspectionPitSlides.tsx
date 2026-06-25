import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import {
  SlideParagraph,
  SlideList,
  SlideCallout,
  InteractiveCard,
  SlideGrid,
  ClickHighlight,
  ClickReveal
} from '@/features/presentation/components/elements';
import { InspectionPitDrawing } from '@/subjects/quantity-surveying/features/components/InspectionPitDrawing';
import { SoakPitStructuralDrawing, SoakPitStructuralSandbox } from '@/subjects/quantity-surveying/features';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';

// ============================================================================
// Slide 13: Sanitary Junction: The Inspection Pit
// ============================================================================
export const Slide13: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  const highlightMap: Record<number, 'none' | 'excavation' | 'concrete' | 'brickwork'> = {
    0: 'none',
    1: 'excavation',
    2: 'concrete',
    3: 'brickwork',
  };

  const activeHighlight = highlightMap[currentClick] || 'none';

  return (
    <TwoColumnLayout
      title="2.5 Sanitary Junction: The Inspection Pit"
      bgVariant="default"
      leftWidth="48%"
      leftContent={
        <div className="space-y-2.5 text-left select-text">
          <SlideParagraph>
            The **Inspection Pit** is a vital transition node built immediately before the septic tank. It receives raw wastewater from building conduits, allowing access to clean blockages and check flow lines:
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            variant="plain"
            items={[
              {
                title: "Earthwork Excavation",
                text: "Quantified based on the outer masonry footprint plus clearance allowances (m³).",
                revealAt: 1,
              },
              {
                title: "CC Foundation Base (1:3:6)",
                text: "Concrete leveling layer supporting the brick walls, measured volumetrically in m³.",
                revealAt: 2,
              },
              {
                title: "1st Class Brickwork (1:4)",
                text: "Enclosure walls built up to ground level, calculated in m³.",
                revealAt: 3,
              },
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-center">
          <InspectionPitDrawing
            activeHighlight={activeHighlight}
            className="flex-1"
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 16: Soak Pit Filtration Layers
// ============================================================================
export const Slide16: React.FC = () => (
  <FullWidthLayout title="2.8 Soak Pit Filtration Layers" bgVariant="default">
    <div className="flex flex-col gap-4 select-text">
      <SlideParagraph variant="plain" className="text-xs md:text-sm text-muted-foreground select-none">
        While bulk voids are estimated for backfilling, the specific filtration layers at the base of the soak pit must be calculated using exact circular area volumes.
      </SlideParagraph>

      <SlideGrid cols={2} gap="md">
        <InteractiveCard title="The Circular Area Volume Rule" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Because a soak pit is cylindrical, the volume of any flat bottom layer is:
          </p>
          <div className="text-lg font-bold text-center text-primary my-2 bg-muted/20 p-2 rounded-lg border border-border font-mono">
            V = [ π × D² / 4 ] × H
          </div>

          <p className="text-[10px] text-muted-foreground">
            Where <strong>D</strong> is the internal diameter of the pit and <strong>H</strong> is the depth/thickness of the specific material layer.
          </p>
        </InteractiveCard>

        <InteractiveCard title="Filtration Layer Worked Example" variant="default">
          <span className="font-bold text-xs text-primary block mb-2 font-sans">For a standard 3.5 ft (1.067 m) Diameter Pit:</span>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-2.5 font-mono">
            <p>
              • <strong>2-inch Brick Aggregate (Bottom)</strong>
              <br />Thickness = 1.0 ft (0.305m)
              <br />Volume = [π × 3.5² / 4] × 1.0 = <span className="text-amber-500 font-bold">9.62 cft (0.272 m³)</span>
            </p>
            <p>
              • <strong>Coarse Sand Filter (Middle)</strong>
              <br />Thickness = 1.5 ft (0.457m)
              <br />Volume = [π × 3.5² / 4] × 1.5 = <span className="text-amber-500 font-bold">14.43 cft (0.409 m³)</span>
            </p>
          </div>
        </InteractiveCard>
      </SlideGrid>

      <SlideCallout variant="info" title="Surveyor Recall" className="py-2.5">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Banding these filtration layers ensures septic effluent spreads horizontally into surrounding subsoil voids rather than settling at the center of the pit.
        </p>
      </SlideCallout>
    </div>
  </FullWidthLayout>
);

// Slide 17: Soak Pit Structural Enclosure Concepts
export const Slide17: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const highlightMap: Record<number, 'none' | 'honeycomb' | 'solid' | 'curb'> = {
    0: 'none',
    1: 'honeycomb',
    2: 'solid',
    3: 'curb',
  };
  const activeHighlight = highlightMap[currentClick] || 'none';

  return (
    <TwoColumnLayout
      title="2.9 Soak Pit Structural Enclosures"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-2.5 text-left select-text">
          <SlideParagraph>
            Beyond aggregate filling, a professional soak pit is framed by a brick masonry lining with a reinforced concrete ring foundation at the base:
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            variant="plain"
            items={[
              {
                title: "Honeycomb Brickwork (25% Voids)",
                text: <span>Lining with seepage slots to allow effluent filtration, measured in <ClickHighlight variant="paint" at={1}>Cubic Meter (m³)</ClickHighlight> with 25% void ratio.</span>,
                revealAt: 1,
              },
              {
                title: "Solid Collar Brickwork",
                text: <span>Solid upper brick wall (neck) near ground surface to prevent soil collapses, measured in <ClickHighlight variant="paint" at={2}>Cubic Meter (m³)</ClickHighlight>.</span>,
                revealAt: 2,
              },
              {
                title: "R.C.C. Well Curb Foundation",
                text: <span>Reinforced concrete ring footing cast at base to support walls during excavation and sinking, measured in <ClickHighlight variant="paint" at={3}>Cubic Meter (m³)</ClickHighlight>.</span>,
                revealAt: 3,
              },
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <SoakPitStructuralDrawing activeHighlight={activeHighlight} className="flex-1" />
          <ClickReveal at={3} preset="up">
            <SlideCallout variant="warning" title="Well Curb Reinforcement" className="py-2">
              <p className="text-[10px] text-muted-foreground leading-normal">
                Under PWD guidelines, reinforcement steel in the well curb is estimated at a nominal **1% of concrete volume** by weight (approx. 78.5 kg/m³) unless specified otherwise.
              </p>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 18: Soak Pit Structural Sandbox Slide
export const Slide18: React.FC = () => {
  return (
    <div className="w-full h-full select-text">
      <SoakPitStructuralSandbox />
    </div>
  );
};
