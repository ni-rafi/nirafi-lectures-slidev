import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  SlideParagraph,
  SlideList,
  SlideCallout,
  InteractiveCard,
  ClickHighlight,
  ClickReveal
} from '@/features/presentation/components/elements';
import { ReservoirBBSDrawing } from '@/subjects/quantity-surveying/features/components/ReservoirBBSDrawing';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';


// ============================================================================
// Slide 7: Reservoir BBS Fundamentals
// ============================================================================
export const Slide7: React.FC = () => {
  return (
    <TwoColumnLayout
      title="1.5 Reservoir Bar Bending Schedule (BBS) Fundamentals"
      bgVariant="default"
      leftWidth="48%"
      leftContent={
        <div className="space-y-4 text-left select-text">
          <SlideParagraph title="Hydrostatic Resistance Reinforcement">
            A liquid-retaining underground reservoir requires a dense, double-reinforced steel grid to withstand massive outward hydrostatic pressure and inward active soil pressure.
          </SlideParagraph>
          <SlideParagraph>
            Unlike ordinary building slabs, reinforcement in water reservoirs must be tracked across three critical regions: the <ClickHighlight at={1} variant="paint">Base Raft</ClickHighlight>, the <ClickHighlight at={2} variant="paint">Vertical Walls</ClickHighlight>, and the <ClickHighlight at={3} variant="paint">Top Cover Slab</ClickHighlight>.
          </SlideParagraph>
          <ClickReveal at={4}>
            <SlideCallout variant="info" title="The Concrete Cover Boundary">
              Liquid-retaining zones require a strict minimum of <ClickHighlight at={4} variant="paint">50 mm (2 inches) clear cover</ClickHighlight> to prevent rust corrosion from moisture infiltration.
            </SlideCallout>
          </ClickReveal>
        </div>
      }
      rightContent={
        <div className="space-y-4 flex flex-col justify-center h-full select-text">
          <InteractiveCard title="Standard Reinforcement Schedules" variant="default">
            <SlideList
              revealMode="each-click"
              variant="plain"
              className="space-y-2"
              items={[
                {
                  title: "Base Raft Slab",
                  revealAt: 1,
                  text: <span className="text-muted-foreground text-[10px]">Heavier grid: #6 (19mm) main bars @ 5" c/c and #5 (16mm) distribution bars @ 6" c/c.</span>
                },
                {
                  title: "Vertical Walls (Inner & Outer)",
                  revealAt: 2,
                  text: <span className="text-muted-foreground text-[10px]">Dual layers: #4 (12mm) vertical stem bars and #3 (10mm) horizontal rings @ 5" c/c.</span>
                },
                {
                  title: "Top Cover Slab",
                  revealAt: 3,
                  text: <span className="text-muted-foreground text-[10px]">Double grid: #6 (19mm) bottom and top mesh bars spaced at standard intervals.</span>
                }
              ]}
            />
          </InteractiveCard>
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 8: Calculating Reservoir Reinforcement
// ============================================================================
export const Slide8: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  const highlightMap: Record<number, 'none' | 'base' | 'wall' | 'cover'> = {
    0: 'none',
    1: 'base',
    2: 'wall',
    3: 'cover',
  };

  const activeHighlight = highlightMap[currentClick] || 'none';

  return (
    <TwoColumnLayout
      title="1.6 Calculating Reservoir Reinforcement"
      bgVariant="default"
      leftWidth="48%"
      leftContent={
        <div className="space-y-2.5 text-left select-text">
          <SlideParagraph>
            The surveyor must resolve the cut length of each bar group based on concrete dimensions and covers:
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            variant="plain"
            className="space-y-1"
            items={[
              {
                title: "Base Raft Slab Steel",
                revealAt: 1,
                text: "Main bars get 180° hooks (+9d per hook) at both ends."
              },
              {
                title: "Wall & Shear Key Dowels",
                revealAt: 2,
                text: "Vertical rods from base raft to top cover slab, including L-bent dowels through shear key."
              },
              {
                title: "Cover Slab Mesh",
                revealAt: 3,
                text: "Double-reinforced grid (bottom and top mesh), accounting for edge support hooks."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <ReservoirBBSDrawing
            activeHighlight={activeHighlight}
            className="flex-1 min-h-[140px]"
          />
          <ClickReveal at={3} preset="up">
            <SlideCallout variant="warning" title="Wastage &amp; Overlap Allowance" className="py-2">
              <p className="text-[10px] text-muted-foreground leading-normal">
                Once linear requirements for #3, #4, #5, and #6 bars are compiled, add a standard **2% allowance** for cut-off wastage and lap-splices before converting to total weight.
              </p>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};
