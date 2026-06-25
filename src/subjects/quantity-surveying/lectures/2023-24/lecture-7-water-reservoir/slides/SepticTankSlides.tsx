import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import {
  SepticTankRevealDrawing,
  SoakPitFilterSandbox,
  SepticSteppedDrawing,
  SepticSteppedSandbox
} from '@/subjects/quantity-surveying/features';
import {
  SlideParagraph,
  SlideList,
  SlideCallout,
  ClickReveal,
  ClickHighlight,
} from '@/features/presentation/components/elements';

// Slide 9: Section Divider
export const Slide9: React.FC = () => (
  <TopicDividerLayout
    topicNumber="02"
    title="Septic Tank Structural Detailing"
    description="Baffle Walls, Fluid Traps, and the Soak Pit Void Ratio Rule"
  />
);

// Slide 10: Septic Tank Structural Anatomy (With Integrated Reveal)
export const Slide10: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const activeStep = Math.min(3, Math.max(0, currentClick - 1));

  return (
    <TwoColumnLayout
      title="2.1 Septic Tank Anatomy &amp; Take-offs"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-2.5 text-left select-text">
          <SlideParagraph>
            A traditional septic tank represents a mixed structural design—combining concrete basework with brickwork containment shells:
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            variant="plain"
            className="space-y-1"
            items={[
              {
                title: "Base Slab (RCC)",
                revealAt: 1,
                text: <span>Monolithic concrete foundation slab acting as an impervious horizontal water barrier, measured in <ClickHighlight variant="paint" at={1}>Cubic Meter (m³)</ClickHighlight>.</span>
              },
              {
                title: "Baffle / Partition Wall",
                revealAt: 2,
                text: <span>Internal brick or concrete partitions separating chambers, billed in <ClickHighlight variant="paint" at={2}>Square Meter (m²)</ClickHighlight> or m³.</span>
              },
              {
                title: "Enclosure Brickwork",
                revealAt: 3,
                text: <span>Heavy outer brick walls. Requires external <ClickHighlight variant="paint" at={3}>bitumen damp-proof coat</ClickHighlight> to block subsoil dampness (m³).</span>
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <SepticTankRevealDrawing activeStep={activeStep} className="flex-1" />
          <ClickReveal at={4} preset="up">
            <SlideCallout variant="info" title="Septic Tank Structural Anatomy" className="py-2">
              <p className="text-[10px] text-muted-foreground leading-normal">
                Inlet/Outlet Tees and vent pipelines are structural appurtenances, counted in <ClickHighlight variant="paint" at={4}>Numbers (Nos.)</ClickHighlight>.
              </p>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 11: Soak Pit Aggregate Filter Concepts (With Integrated Drawing)
export const Slide11: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  return (
    <TwoColumnLayout
      title="2.2 Soak Pit Filtration Structure"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-2.5 text-left select-text">
          <SlideParagraph>
            Effluent overflow discharges into a Soak Pit packed with open-graded filtering khoa (broken brick bats) or stones:
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            variant="plain"
            className="space-y-1"
            items={[
              {
                title: "Cylindrical Excavation",
                revealAt: 1,
                text: <span>The pit is dug as a cylinder of diameter D and depth H, billed in <ClickHighlight variant="paint" at={1}>Cubic Meter (m³)</ClickHighlight>.</span>
              },
              {
                title: "Bottom Filter Layer",
                revealAt: 2,
                text: <span>Bottom 40% of pit packed with <ClickHighlight variant="paint" at={2}>coarse brick bats</ClickHighlight> to allow rapid subsoil dispersion.</span>
              },
              {
                title: "Intermediate Filter",
                revealAt: 3,
                text: <span>Middle 35% of depth filled with <ClickHighlight variant="paint" at={3}>medium brick khoa</ClickHighlight> for filtration.</span>
              },
              {
                title: "Top Sand Cap",
                revealAt: 4,
                text: <span>Top 25% capped with <ClickHighlight variant="paint" at={4}>coarse sand</ClickHighlight> to trap remaining suspended solids.</span>
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <SoakPitFilterSandbox hideControls={true} currentClick={currentClick - 1} className="flex-1" />
          <ClickReveal at={4} preset="up">
            <SlideCallout variant="warning" title="Loose Aggregate Ordering Rule" className="py-2">
              <div className="text-[11px] font-mono text-center text-amber-500 bg-muted/40 p-2 rounded-xl border border-amber-500/20 font-bold">
                Loose Volume = Net Pit Volume × 1.33
              </div>
              <span className="text-[9px] text-muted-foreground block mt-1 text-center">Prevents overestimating aggregate bats on procurement invoices.</span>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 12: Soak Pit Volume Sandbox
export const Slide12: React.FC = () => {
  return (
    <FullWidthLayout title="2.2 Soak Pit Volume Sandbox" bgVariant="default">
      <SoakPitFilterSandbox />
    </FullWidthLayout>
  );
};

// Slide 13: Stepped Wall Masonry & Plaster Concepts
export const Slide13: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const activeStep = Math.min(4, Math.max(0, currentClick));

  return (
    <TwoColumnLayout
      title="2.3 Septic Tank Stepped Walls &amp; Plastering"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-2.5 text-left select-text">
          <SlideParagraph>
            Septic tank walls are stepped to withstand lateral soil and internal water pressures, requiring precise stepped brickwork and plastering take-offs:
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            variant="plain"
            className="space-y-1"
            items={[
              {
                title: "Base Wall Step (Step 1)",
                revealAt: 1,
                text: <span>Thicker base masonry built up to lateral soil stress boundaries, measured in <ClickHighlight variant="paint" at={1}>Cubic Meter (m³)</ClickHighlight>.</span>
              },
              {
                title: "Upper Wall Step (Step 2)",
                revealAt: 2,
                text: <span>Narrower upper masonry extending to the top cover level, measured in <ClickHighlight variant="paint" at={2}>Cubic Meter (m³)</ClickHighlight>.</span>
              },
              {
                title: "Floor Plaster (Thick)",
                revealAt: 3,
                text: <span>Heavy-duty 18-20mm damp-proof cement plaster at the tank floor, measured in <ClickHighlight variant="paint" at={3}>Square Meter (m²)</ClickHighlight>.</span>
              },
              {
                title: "Wall Plaster (12mm)",
                revealAt: 4,
                text: <span>Standard 12mm thick protective plaster lining on internal partition and vertical enclosure walls, measured in <ClickHighlight variant="paint" at={4}>Square Meter (m²)</ClickHighlight>.</span>
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <SepticSteppedDrawing activeStepIndex={activeStep} className="flex-1" />
          <ClickReveal at={4} preset="up">
            <SlideCallout variant="info" title="Plaster Take-Off Distinction" className="py-2">
              <p className="text-[10px] text-muted-foreground leading-normal">
                Vertical wall plaster (12mm) and heavy floor plaster (18-20mm) must be compiled as distinct bill-of-quantity line items due to differences in composition and rates.
              </p>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 14: Septic Stepped Sandbox Slide
export const Slide14: React.FC = () => {
  return (
    <div className="w-full h-full select-text">
      <SepticSteppedSandbox />
    </div>
  );
};

