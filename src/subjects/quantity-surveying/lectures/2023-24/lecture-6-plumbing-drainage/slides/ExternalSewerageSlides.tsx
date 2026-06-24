import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { ManholeSectionDrawing } from '@/subjects/quantity-surveying/features/components/ManholeSectionDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateManholeBrickworkVolumeInternal, calculateManholePlasterAreaInternal } from '@/subjects/quantity-surveying/cores';
import { QuizCardOrchestrator } from '@/features/quiz';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';


// ============================================================================
// Slide 17: Section 4 Cover
// ============================================================================
export const Slide17: React.FC = () => (
  <TopicDividerLayout
    topicNumber="04"
    title="External Collection & Sewerage Interface"
    subtitle="Inspection Chambers, Manholes, and Master Sewerage Connections"
  />
);

// ============================================================================
// Slide 18: Inspection Chambers & Manholes
// ============================================================================
export const Slide18: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  return (
    <TwoColumnLayout
      title="4.1 Inspection Chambers & Manholes"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-4 text-left">
          <SlideParagraph title="The External Junctions">
            Drainage networks terminate in a series of brick-masonry or precast inspection chambers (ICs). These provide the necessary maintenance access points to clear clogs and verify flow gradients.
          </SlideParagraph>
          
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "Volume Take-off", 
                text: "Calculated as a masonry box structure. Includes: Earthwork for pit, brick masonry walls, concrete floor benching, and internal cement plastering." 
              },
              { 
                title: "The Benching System", 
                text: "The critical curved cement-concrete channel formed at the base to direct wastewater flow and prevent turbulence." 
              },
              { 
                title: "Access Covers", 
                text: "Heavy-duty cast iron or reinforced concrete pit covers (estimated by count/Nos.)." 
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <ManholeSectionDrawing
            lengthMm={800}
            widthMm={800}
            depthMm={1100}
            wallThicknessMm={125}
            activeHighlight={
              currentClick === 1 ? 'masonry' :
              currentClick === 2 ? 'benching' :
              currentClick >= 3 ? 'plaster' : 'none'
            }
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 19: Master Sewerage Link & Synthesis
// ============================================================================
export const Slide19: React.FC = () => (
  <FullWidthLayout
    title="4.2 Finalizing the Plumbing & Drainage BoM"
    bgVariant="default"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
      <div className="space-y-4 text-left">
        <SlideParagraph title="Synthesis for BoQ Submission">
          Plumbing estimation is highly prone to item-omission errors. The final BoM (Bill of Materials) must bridge the gap between internal plumbing and the final external discharge point.
        </SlideParagraph>
        
        <SlideCallout variant="success" title="The BoM Aggregation Checklist">
          <ul className="space-y-2 text-sm list-decimal pl-5 text-left">
            <li>Aggregate total pipe lengths (by diameter and grade).</li>
            <li>Consolidate fixture packs (WC + Taps + Traps).</li>
            <li>Sum external masonry pit volumes.</li>
            <li>Finalize excavation/trenching backfill quantities.</li>
          </ul>
        </SlideCallout>
      </div>

      <ClickReveal at={1} preset="up">
        <div className="h-full flex flex-col justify-center space-y-4 text-left">
          <SlideParagraph title="Studio Directive: The BoM Portfolio" variant="plain">
            Teams are to integrate their calculated fixture counts and pipe runs into the <strong>final Unified Plumbing BoM ledger</strong>.
          </SlideParagraph>
          
          <div className="p-6 bg-muted/20 border border-primary/20 rounded-xl text-center text-primary font-bold text-lg">
            Deliverable: Team submission of the comprehensive Plumbing & Drainage Bill of Materials (BoM).
          </div>
        </div>
      </ClickReveal>
    </div>
  </FullWidthLayout>
);

// ============================================================================
// Slide 20: Manhole Sandbox
// ============================================================================
export const Slide20: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('manhole_l_mm', 800);
  const [width, setWidth] = useUrlSyncedState<number>('manhole_w_mm', 800);
  const [depth, setDepth] = useUrlSyncedState<number>('manhole_d_mm', 1100);
  const [wallT, setWallT] = useUrlSyncedState<number>('manhole_wall_t_mm', 125);

  const brickVol = calculateManholeBrickworkVolumeInternal(
    length / 1000,
    width / 1000,
    depth / 1000,
    wallT / 1000
  );
  const plasterArea = calculateManholePlasterAreaInternal(
    length / 1000,
    width / 1000,
    depth / 1000
  );

  return (
    <TwoColumnLayout
      title="4.3 Masonry Chamber Estimating Sandbox"
      leftWidth="40%"
      leftContent={
        <InteractiveCard title="Chamber Dimensions">
          <div className="space-y-4">
            <ParameterSlider
              label="Internal Chamber Length"
              min={600}
              max={1200}
              step={50}
              value={length}
              onChange={setLength}
              unit=" mm"
            />
            <ParameterSlider
              label="Internal Chamber Width"
              min={600}
              max={1200}
              step={50}
              value={width}
              onChange={setWidth}
              unit=" mm"
            />
            <ParameterSlider
              label="Chamber Depth"
              min={800}
              max={1500}
              step={50}
              value={depth}
              onChange={setDepth}
              unit=" mm"
            />
            <ParameterSlider
              label="Wall Brick Thickness"
              min={125}
              max={250}
              step={125}
              value={wallT}
              onChange={setWallT}
              unit=" mm"
            />
          </div>

          <div className="border-t border-border/40 mt-4 pt-3 space-y-2">
            <CalculationOutput 
              title="Brick Masonry Volume" 
              value={brickVol.toFixed(3)} 
              unit="m³"
              subtitle="Walls brick volume: (Outer Vol - Inner Vol)"
            />
            <CalculationOutput 
              title="Internal Plaster Area" 
              value={plasterArea.toFixed(2)} 
              unit="m²"
              subtitle="Inside perimeter × depth for 1:3 plastering"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <ManholeSectionDrawing
            lengthMm={length}
            widthMm={width}
            depthMm={depth}
            wallThicknessMm={wallT}
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 21: Quiz 4 (Chamber wall volume - Numeric)
// ============================================================================
export const Slide21: React.FC = () => {
  return (
    <FullWidthLayout title="Inspection Chambers Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec6_q4"
          questionText="An inspection chamber has internal brick dimensions of exactly 800 mm × 800 mm, a depth of 1.100 m, and 125 mm thick brick masonry walls. Calculate the total volume of brick masonry required for the walls of the chamber in cubic meters (m³). (benching and foundation concrete are billed separately). Round your answer to exactly 3 decimal places."
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 22: Lab 6 Briefing
// ============================================================================
export const Slide22: React.FC = () => (
  <FullWidthLayout title="Lab Report 6: Studio Directive">
    <div className="w-full max-w-[800px] mx-auto mt-6">
      <SlideCallout variant="info" title="📋 Sanitary & Drainage Take-Off Specifications">
        <div className="space-y-4 text-left text-sm leading-relaxed p-2">
          <p>
            <strong>The Objective:</strong> Formulate a complete, itemized Plumbing and Drainage Bill of Materials (BoM) based on your assigned multi-unit residential floor plans.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Trace and measure centerline runs of PPR water piping lines, adding riser/drop counts.</li>
            <li>Count sanitaries and compile composite WC/Wash Basin assemblies package lists.</li>
            <li>Estimate soil, waste, and vent pipe vertical and horizontal runs.</li>
            <li>Calculate excavated volume, under-pipe sand bedding, and brick manholes masonry.</li>
            <li>Apply PWD length waste factors (+5% on linear pipes runs).</li>
          </ul>
          <p className="font-bold text-center text-primary mt-4">
            Verify invert levels and pipeline slopes on drawings before computing trench depths!
          </p>
        </div>
      </SlideCallout>
    </div>
  </FullWidthLayout>
);
