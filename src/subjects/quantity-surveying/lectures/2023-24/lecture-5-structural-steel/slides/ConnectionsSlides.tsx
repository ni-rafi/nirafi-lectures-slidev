import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  ClickHighlight,
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { GussetPlateBoundingDrawing } from '@/subjects/quantity-surveying/features/components/GussetPlateBoundingDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculatePlateWeightInternal } from '@/subjects/quantity-surveying/cores';
import { QuizCardOrchestrator } from '@/features/quiz';

// ============================================================================
// Slide 10: Section 4 Cover
// ============================================================================
export const Slide10: React.FC = () => (
  <TopicDividerLayout
    topicNumber="04"
    title="Connections, Allowances & Finishing"
    subtitle="The Gusset Envelope Rule, Standard Fastener Multipliers, and Surface Area Calculations"
  />
);

// ============================================================================
// Slide 11: Gusset Plates Theory
// ============================================================================
export const Slide11: React.FC = () => (
  <TwoColumnLayout
    title="4.1 Irregular Members: The Gusset Envelope Rule"
    bgVariant="default"
    leftWidth="48%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="The Bounding Rectangle Principle">
          Gusset plates act as structural nodes anchoring truss profiles at intersection joints. These plates are rarely perfect rectangles; they feature sheared triangular, trapezoidal, or polygonal profiles.
        </SlideParagraph>
        
        <ClickReveal at={1}>
          <SlideCallout variant="danger" title="Standard Take-Off Law">
            According to core surveying manuals, you <ClickHighlight at={2} variant="strike" className="text-red-500 font-bold">DO NOT calculate the net geometric surface area</ClickHighlight> of an irregular plate shape. Instead, you must measure the area of the <strong>smallest circumscribing rectangle</strong> from which that plate can be cut.
          </SlideCallout>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={3} preset="up">
        <div className="h-full flex flex-col justify-center">
          <SlideCallout variant="warning" title="Wastage Rationale & Equation">
            <p className="mb-4 text-sm text-muted-foreground text-left">
              When raw steel sheets are sheared on a fabrication bench to form customized gusset profiles, the corner off-cuts are unrecoverable shop wastage. The project is billed for the gross rectangle.
            </p>
            <div className="p-4 bg-background border border-amber-500/20 rounded-xl text-center text-sm font-mono font-semibold text-amber-600 dark:text-amber-400">
              Weight = (Max Width × Max Length × Thickness) × 7850 kg/m³
            </div>
          </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 11B: Gusset Bounding Box Sandbox
// ============================================================================
export const Slide11B: React.FC = () => {
  const [width, setWidth] = useUrlSyncedState<number>('gusset_w', 300);
  const [height, setHeight] = useUrlSyncedState<number>('gusset_h', 300);
  const [thickness, setThickness] = useUrlSyncedState<number>('gusset_t', 12);

  const weight = calculatePlateWeightInternal(width / 1000, height / 1000, thickness / 1000);

  return (
    <TwoColumnLayout
      title="4.2 Gusset Envelope Weight Sandbox"
      leftWidth="40%"
      leftContent={
        <InteractiveCard title="Gusset Parameters">
          <div className="space-y-4">
            <ParameterSlider
              label="Maximum Envelope Width"
              min={200}
              max={500}
              step={10}
              value={width}
              onChange={setWidth}
              unit=" mm"
            />
            <ParameterSlider
              label="Maximum Envelope Height"
              min={200}
              max={500}
              step={10}
              value={height}
              onChange={setHeight}
              unit=" mm"
            />
            <ParameterSlider
              label="Plate Thickness"
              min={6}
              max={25}
              step={1}
              value={thickness}
              onChange={setThickness}
              unit=" mm"
            />
          </div>

          <div className="border-t border-border/40 mt-4 pt-3">
            <CalculationOutput 
              title="Billed Plate Weight" 
              value={weight.toFixed(3)} 
              unit="kg"
              subtitle="Calculated on the full gross circumscribing rectangle"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <GussetPlateBoundingDrawing
            widthMm={width}
            heightMm={height}
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 11C: Quiz 4 (Gusset Irregular Shape - Numeric)
// ============================================================================
export const Slide11C: React.FC = () => {
  return (
    <FullWidthLayout title="Irregular Plate Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec5_q4"
          questionText="An irregular pentagonal gusset plate has maximum bounding dimensions of 450 mm × 350 mm and a thickness of 12 mm. Calculate the weight of the plate in kilograms using the standard gross bounding box measurement rule. (Use density = 7850 kg/m³). Round your answer to exactly 3 decimal places."
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 12: Connection Hardware Allowances
// ============================================================================
export const Slide12: React.FC = () => (
  <TwoColumnLayout
    title="4.3 Structural Fasteners & Multipliers"
    bgVariant="default"
    leftWidth="45%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="Hardware Quantification Rules">
          A traditional industrial steel framing module contains hundreds of rivets, connection structural bolts, weld beads, and local joint splice cleats that are too dense to map out explicitly on macro architectural layout indices.
        </SlideParagraph>
        
        <ClickReveal at={1}>
          <SlideParagraph variant="plain">
            When meticulous structural detailing bills are omitted from structural blueprints, standard textbook practice dictates substituting a single flat weight multiplier.
          </SlideParagraph>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={2} preset="fade-in">
        <div className="h-full flex flex-col justify-center">
           <SlideCallout variant="success" title="The 5% Connection Protocol">
             <p className="mb-4 text-sm text-left">
               Add a standardized weight allocation markup directly to the total combined net weight of the primary structural framing lines to cover joint fixtures:
             </p>
             <div className="text-6xl font-bold text-center text-primary my-4 tracking-tight">
               + 5.0%
             </div>
             <div className="p-3 bg-muted/30 rounded-lg text-xs font-mono border border-border text-center text-muted-foreground mt-4">
               Total Tonnage = (Truss Angles + Beams + Columns) × 1.05
             </div>
           </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 13: Finishing Area Calculations (Painting)
// ============================================================================
export const Slide13: React.FC = () => (
  <FullWidthLayout
    title="4.4 Surface Finishing: Anti-Corrosive Painting"
    bgVariant="default"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
      <div className="space-y-4 text-left">
        <SlideParagraph title="Oxidation Defense Logistics">
          Unlike masonry or concrete surfaces, raw exposed structural steel oxidizes and corrodes rapidly in normal atmospheric humidity. Surface preparation, red-oxide primer primers, and finish enamel coats are calculated strictly by **Surface Area**.
        </SlideParagraph>
        
        <SlideList
          revealMode="each-click"
          items={[
            { 
              title: "Standard Bill of Quantities Unit", 
              text: "Quantified explicitly in Square Meters (m²) or Square Feet (sft)." 
            },
            { 
              title: "The Perimeter Profile Challenge", 
              text: "You cannot look at a flat overview plan to calculate surface boundaries. You must untangle the full cross-sectional perimeter path of the member." 
            }
          ]}
        />
      </div>

      <ClickReveal at={3} preset="up">
        <div className="h-full flex flex-col justify-center">
          <SlideCallout variant="info" title="Take-Off Profile Mapping Method">
            <p className="mb-2 text-sm text-muted-foreground text-left">Instead of complex geometry modeling, extract the section perimeter constant directly from the commercial Steel Table:</p>
            <div className="text-xl font-mono text-center text-secondary-foreground bg-muted/40 p-4 rounded-lg my-2 border border-border">
              Surface Area = Section perimeter (m) × Length (m)
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed border-t pt-3 italic text-left">
              Example: A standard section channel profile has an exposed outer surface face perimeter of 0.650 meters per meter. A 12-meter line requires exactly 0.650m × 12m = 7.80 m² of protective paint coating application notation.
            </p>
          </SlideCallout>
        </div>
      </ClickReveal>
    </div>
  </FullWidthLayout>
);

// ============================================================================
// Slide 14: Lab Briefing
// ============================================================================
export const Slide14: React.FC = () => (
  <FullWidthLayout title="Lab Report 5: Studio Directive">
    <div className="w-full max-w-[800px] mx-auto mt-6">
      <SlideCallout variant="info" title="📋 Lab Assignment Scope & Guidelines">
        <div className="space-y-4 text-left text-sm leading-relaxed p-2">
          <p>
            <strong>The Objective:</strong> Estimate the total weight of structural steel framing and surface finishing area for the industrial storage shed shown in your sessional drawing pack.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Identify and list rolled steel members (Rafters, Ties, Web members, and Purlins).</li>
            <li>Use Pythagoras to find inclined rafter lengths; compute correct purlin spacing arrays.</li>
            <li>Apply the <strong>Irregular Bounding Box Rule</strong> to estimate gusset plate weights.</li>
            <li>Sum structural steel weight and apply a <strong>5% fastener allowance</strong>.</li>
            <li>Determine total square meters of surface painting using the exposed perimeter of profiles.</li>
          </ul>
          <p className="font-bold text-center text-primary mt-4">
            Verify structural section dimensions in steel tables before ledger entry!
          </p>
        </div>
      </SlideCallout>
    </div>
  </FullWidthLayout>
);
