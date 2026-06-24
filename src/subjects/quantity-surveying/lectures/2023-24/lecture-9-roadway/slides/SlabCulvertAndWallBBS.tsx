import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import {
  SlideParagraph,
  SlideList,
  SlideCallout,
  InteractiveCard,
  SlideGrid,
  LatexFormula
} from '@/features/presentation/components/elements';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { RetainingWallBBSDrawing } from '@/subjects/quantity-surveying/features/components/RetainingWallBBSDrawing';
import { SlabCulvertAnatomyDrawing } from '@/subjects/quantity-surveying/features/components/SlabCulvertAnatomyDrawing';

// ============================================================================
// Slide 8: Retaining Wall Typology
// ============================================================================
export const Slide8: React.FC = () => {
  return (
    <FullWidthLayout title="2.1 Classification of Retaining Walls" bgVariant="default">
      <div className="flex flex-col gap-4 select-text">
        <SlideParagraph variant="plain" className="text-xs text-muted-foreground select-none">
          Retaining walls resist lateral earth pressure. The structural type is selected based on wall height, soil bearing capacity, and constructability:
        </SlideParagraph>

        <SlideGrid cols={3} gap="md">
          <InteractiveCard title="Gravity & Semi-Gravity" variant="default">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong>Gravity Walls:</strong> Rely on massive weight (masonry or plain concrete) to prevent sliding and overturning.
              <br />
              <strong>Semi-Gravity:</strong> Utilize a minor amount of steel to reduce the concrete footprint.
            </p>
          </InteractiveCard>

          <InteractiveCard title="Cantilever Walls" variant="default">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Consist of a thin vertical <strong>stem</strong> and a horizontal <strong>base slab</strong> (toe and heel).
              <br />
              Leverages the weight of the backfill soil on the heel slab to counter lateral tipping forces.
            </p>
          </InteractiveCard>

          <InteractiveCard title="Counterfort & Buttressed" variant="default">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong>Counterfort:</strong> Angled concrete webs (backfill side) tie stem and base, reducing bending stress.
              <br />
              <strong>Buttress:</strong> Webs are on the exposed front face (used where backfill space is restricted).
            </p>
          </InteractiveCard>
        </SlideGrid>
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 11: Retaining Wall Reinforcement & The Shear Key
// ============================================================================
export const Slide11: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const highlightMap: Record<number, 'none' | 'stem' | 'base' | 'key'> = {
    0: 'none',
    1: 'stem',
    2: 'base',
    3: 'key',
  };
  const activeHighlight = highlightMap[currentClick] || 'none';

  return (
    <TwoColumnLayout
      title="2.4 Retaining Wall BBS & The Shear Key"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="space-y-3 text-left select-text">
          <SlideParagraph title="Steel Detailing Constraints">
            Quantifying retaining wall reinforcement requires mapping separate stem, base, and shear key grids:
          </SlideParagraph>

          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "Tapered Stem Steel (Pythagoras)",
                text: "The outside vertical bars are inclined. Length must be calculated using Pythagoras: L = sqrt(h² + b_slope²)."
              },
              {
                title: "Base Raft Grids",
                text: "Requires horizontal steel grids on both the top (tension) and bottom faces of the slab."
              },
              {
                title: "The Shear Key dowels",
                text: "A downward concrete block prevents wall sliding. Dowel reinforcing anchors it into the heel-stem junction."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <RetainingWallBBSDrawing activeHighlight={activeHighlight} className="flex-1" />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 14: Culvert Typologies & Engineering Limits
// ============================================================================
export const Slide14: React.FC = () => {
  return (
    <FullWidthLayout title="3.1 Culvert Classifications & Engineering Limits" bgVariant="default">
      <div className="flex flex-col gap-4 select-text">
        <SlideParagraph variant="plain" className="text-xs text-muted-foreground select-none">
          Culverts carry water through embankments. Standard structures are bound by structural span restrictions:
        </SlideParagraph>

        <SlideGrid cols={2} gap="md">
          <InteractiveCard title="Structural Typologies" variant="default">
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-2">
              <li><strong>Slab Culvert:</strong> Flat RCC deck slab over parallel abutments.</li>
              <li><strong>Box Culvert:</strong> Monolithic RCC frame (floor, deck, walls).</li>
              <li><strong>Pipe Culvert:</strong> Hume circular pipes cradled in concrete beds.</li>
              <li><strong>Arch Culvert:</strong> Masonry or RCC arches spanning channels.</li>
            </ul>
          </InteractiveCard>

          <InteractiveCard title="Engineering Design Limits" variant="default">
            <div className="space-y-4">
              <div>
                <span className="text-primary font-bold text-xs block mb-1">Maximum Span Limit</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Slab and standard culverts have a maximum span restricted to **5 to 6 meters**. Spans exceeding this require full bridge designs.
                </p>
              </div>
              <div>
                <span className="text-primary font-bold text-xs block mb-1">Maximum Spans Count</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Multiple-span culverts are limited to a **maximum of 3 spans** to prevent river siltation and hydraulic choking.
                </p>
              </div>
            </div>
          </InteractiveCard>
        </SlideGrid>
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 15: Anatomy of an RCC Slab Culvert
// ============================================================================
export const Slide15: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const highlightMap: Record<number, 'none' | 'abutment' | 'wingwall' | 'deck'> = {
    0: 'none',
    1: 'abutment',
    2: 'wingwall',
    3: 'deck',
  };
  const activeHighlight = highlightMap[currentClick] || 'none';

  return (
    <TwoColumnLayout
      title="3.2 Anatomy of an RCC Slab Culvert"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-3 text-left select-text">
          <SlideParagraph title="Geometric Take-Off Zones">
            A slab culvert divides concrete estimates into three distinct anatomical components:
          </SlideParagraph>

          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "Abutments",
                text: "The main parallel vertical support walls taking deck loads and retaining the roadway approach ramp."
              },
              {
                title: "Wing Walls",
                text: "Flared, angled walls preventing earth spill into the stream and streamlining flow."
              },
              {
                title: "Deck Slab",
                text: "The horizontal RCC plate spanning across the abutments to carry traffic wheel loads."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <SlabCulvertAnatomyDrawing activeHighlight={activeHighlight} className="flex-1" />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 16: The Slab Bearing Deduction Rule
// ============================================================================
export const Slide16: React.FC = () => {
  return (
    <TwoColumnLayout
      title="3.3 The Slab Bearing Deduction Rule"
      bgVariant="default"
      leftWidth="48%"
      leftContent={
        <div className="space-y-3 text-left select-text">
          <SlideParagraph title="The Overlap Joint Problem">
            Where the horizontal deck slab sits on top of the vertical abutment walls, their physical volumes overlap.
          </SlideParagraph>

          <SlideList
            items={[
              {
                title: "Superstructure concrete",
                text: "First calculate gross vertical abutment wall concrete."
              },
              {
                title: "Bearing Deduction",
                text: "Log a negative deduction row: bearing width × slab thickness × length."
              },
              {
                title: "Avoid Double-Billing",
                text: "Without this deduction, you charge the client twice for the same physical concrete zone."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <SlabCulvertAnatomyDrawing activeHighlight="bearing" className="flex-1" />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 17: Slab Culvert Reinforcement & Wing Wall BBS Nuances
// ============================================================================
export const Slide17: React.FC = () => {
  return (
    <TwoColumnLayout
      title="3.4 Slab Culvert BBS Spacing Nuances"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="space-y-4 text-left select-text">
          <SlideParagraph title="Double Counting Corner Steel">
            Standard spacing math adds a starter bar: N = (Span / Spacing) + 1. However, continuous structural boundaries require an exception:
          </SlideParagraph>

          <SlideList
            items={[
              {
                title: "Wing Wall corner Intersection",
                text: "Wing walls attach directly to abutment corners. The shared joint already contains the abutment's terminal bar."
              },
              {
                title: "No (+1) spacing rule",
                text: "When calculating the wing wall run, use N = (Length / Spacing). Adding the (+1) double-counts the corner bar."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-center">
          <InteractiveCard title="Wing Wall Reinforcement worked Example" variant="default">
            <span className="font-bold text-xs text-primary block mb-2 font-sans">For a 5.0m Wing Wall at 200mm c/c Spacing:</span>
            <div className="bg-muted/40 p-3 rounded-lg border border-border/40 space-y-2.5 font-mono text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block font-bold">Standard Formula (Incorrect):</span>
                <LatexFormula math="N = \frac{5.0}{0.2} + 1 = 26 \text{ bars}" block />
              </div>
              <div>
                <span className="text-[10px] text-emerald-600 uppercase block font-bold">Continuous Joint Formula (Correct):</span>
                <LatexFormula math="N = \frac{5.0}{0.2} = 25 \text{ bars}" block />
              </div>
            </div>
            <SlideCallout variant="warning" title="Surveyor Recall" className="py-2.5 mt-3">
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                In wing walls, there is no (+1) because the corner joint bar is already estimated in the abutment wall log.
              </p>
            </SlideCallout>
          </InteractiveCard>
        </div>
      }
    />
  );
};
