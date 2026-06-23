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
import { BasePlatePedestalDrawing } from '@/subjects/quantity-surveying/features/components/BasePlatePedestalDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculatePlateWeightInternal } from '@/subjects/quantity-surveying/cores';
import { QuizCardOrchestrator } from '@/features/quiz';

// ============================================================================
// Slide 4: Section 2 Cover
// ============================================================================
export const Slide4: React.FC = () => (
  <TopicDividerLayout
    topicNumber="02"
    title="The Substructure-to-Steel Interface"
    subtitle="Estimating Base Plates, Pedestals, and Holding-Down Bolts"
  />
);

// ============================================================================
// Slide 5: Base Plate Calculations Theory
// ============================================================================
export const Slide5: React.FC = () => (
  <TwoColumnLayout
    title="2.1 Base Plates & The Density Constant"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="Foundation Transition">
          Steel columns cannot sit directly on raw concrete. They require thick, flat steel <strong>Base Plates</strong> to distribute the concentrated structural load over the wider surface of the concrete pedestal.
        </SlideParagraph>
        
        <ClickReveal at={1}>
          <SlideParagraph variant="plain">
            Because these plates are cut from custom flat sheets, you <ClickHighlight at={2} variant="strike" className="text-red-500">cannot use standard linear Steel Tables</ClickHighlight>. You must calculate their volume and multiply by the <strong>Steel Density Constant</strong>.
          </SlideParagraph>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={3} preset="fade-in">
        <div className="h-full flex flex-col justify-center">
           <SlideCallout variant="warning" title="The Plate Weight Formula">
             <p className="mb-4 text-center text-sm text-muted-foreground">Volume (L × B × T) × Density</p>
             <div className="text-3xl font-bold text-center text-amber-500 my-4 bg-muted/20 p-4 rounded-lg border border-amber-500/20 font-mono">
               W = (L × B × T) × 7850
             </div>
             <p className="text-sm text-muted-foreground mt-4 text-center">
               <em>Note: Always convert L, B, and T (thickness) to <strong>meters (m)</strong> before calculating.</em>
             </p>
           </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 5B: Base Plate Sandbox
// ============================================================================
export const Slide5B: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('base_plate_l', 400);
  const [width, setWidth] = useUrlSyncedState<number>('base_plate_w', 400);
  const [thickness, setThickness] = useUrlSyncedState<number>('base_plate_t', 20);
  const [bolts, setBolts] = useUrlSyncedState<number>('base_plate_bolts', 4);
  const [boltDia, setBoltDia] = useUrlSyncedState<number>('base_plate_bolt_dia', 24);

  // Convert dimensions to meters for engine
  const wt = calculatePlateWeightInternal(length / 1000, width / 1000, thickness / 1000);

  return (
    <TwoColumnLayout
      title="2.2 Column Base Plate Sandbox"
      leftWidth="40%"
      leftContent={
        <InteractiveCard title="Interface Parameters">
          <div className="space-y-4">
            <ParameterSlider
              label="Plate Length (L)"
              min={300}
              max={600}
              step={10}
              value={length}
              onChange={setLength}
              unit=" mm"
            />
            <ParameterSlider
              label="Plate Width (B)"
              min={300}
              max={600}
              step={10}
              value={width}
              onChange={setWidth}
              unit=" mm"
            />
            <ParameterSlider
              label="Plate Thickness (t)"
              min={10}
              max={40}
              step={2}
              value={thickness}
              onChange={setThickness}
              unit=" mm"
            />
            <ParameterSlider
              label="Anchor Bolts Count"
              min={4}
              max={6}
              step={2}
              value={bolts}
              onChange={setBolts}
              unit=" Nos"
            />
            <ParameterSlider
              label="Bolt Diameter"
              min={16}
              max={36}
              step={4}
              value={boltDia}
              onChange={setBoltDia}
              unit=" mm"
            />
          </div>

          <div className="border-t border-border/40 mt-4 pt-3">
            <CalculationOutput 
              title="Base Plate Weight" 
              value={wt.toFixed(3)} 
              unit="kg"
              subtitle="Weight of the plate based on standard steel density of 7850 kg/m³"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <BasePlatePedestalDrawing
            plateLengthMm={length}
            plateWidthMm={width}
            plateThicknessMm={thickness}
            boltCount={bolts}
            boltDiameterMm={boltDia}
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 5C: Quiz 2 (Base Plate Weight - Numeric)
// ============================================================================
export const Slide5C: React.FC = () => {
  return (
    <FullWidthLayout title="Base Plate Weight Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec5_q2"
          questionText="Calculate the total weight in kilograms of a steel base plate of dimensions 600 mm × 500 mm and thickness 28 mm. (Take steel density constant as 7850 kg/m³). Round your answer to exactly 3 decimal places."
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 6: Holding-Down (Anchor) Bolts
// ============================================================================
export const Slide6: React.FC = () => (
  <TwoColumnLayout
    title="2.3 Holding-Down (Anchor) Bolts"
    bgVariant="default"
    leftWidth="40%"
    leftContent={
      <div className="space-y-6">
        <SlideParagraph title="Securing the Structure">
          Base plates are anchored into the concrete pedestal using heavy-duty <strong>Holding-Down (HD) Bolts</strong>.
        </SlideParagraph>

        <ClickReveal at={1}>
           <SlideCallout variant="info" title="Measurement Rule">
             Unlike structural steel members which are measured by weight (kg/ton), HD bolts are estimated and priced by <strong>Numbers (Nos.)</strong> based on their diameter and specific embedment length.
           </SlideCallout>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={2} preset="up">
        <div className="h-full flex flex-col justify-center space-y-4">
          <SlideParagraph title="BoQ Entry Parameters">
            To price an anchor bolt accurately, your BoQ description must define:
          </SlideParagraph>
          
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "Diameter", 
                text: "e.g., 20mm, 24mm, 32mm." 
              },
              { 
                title: "Embedment Length", 
                text: "The total length within concrete plus threaded projection (e.g., 450mm)." 
              },
              { 
                title: "Included Accessories", 
                text: "Must state 'including nuts, washers, and anchor plates'." 
              }
            ]}
          />
        </div>
      </ClickReveal>
    }
  />
);
