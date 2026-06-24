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
import { DrainageSlopeDrawing } from '@/subjects/quantity-surveying/features/components/DrainageSlopeDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateInvertLevelDifferenceInternal, calculateSandCushionVolumeInternal } from '@/subjects/quantity-surveying/cores';
import { QuizCardOrchestrator } from '@/features/quiz';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';


// ============================================================================
// Slide 12: Section 3 Cover
// ============================================================================
export const Slide12: React.FC = () => (
  <TopicDividerLayout
    topicNumber="03"
    title="Soil, Waste & Vent Pipe Drainage Geometry"
    subtitle="Diameter Sizing Codes, Vertical Shafts, and Gravity Gradient Slope Laws"
  />
);

// ============================================================================
// Slide 13: Drainage Pipe Sizing & Diameter Laws
// ============================================================================
export const Slide13: React.FC = () => (
  <TwoColumnLayout
    title="3.1 Functional Drainage Diameters & Layout Tracking"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <div className="space-y-4 text-left">
        <SlideParagraph title="Isolating Black vs. Grey Water">
          Wastewater networks rely strictly on passive gravity flow. Quantity surveyors must isolate lines based on functional diameter rules specified in the PWD Schedule of Rates.
        </SlideParagraph>
        
        <SlideList
          revealMode="each-click"
          items={[
            { 
              title: "Soil Pipes (Black Water Line)", 
              text: "Standardized at 4-inch (100mm) diameter. Carries solid organic waste from water closets directly to vertical soil drop stacks." 
            },
            { 
              title: "Waste Pipes (Grey Water Line)", 
              text: "Sized between 2-inch to 3-inch (50mm–75mm). Collects fluid outflow from wash basins, showers, and kitchen sink grids." 
            },
            { 
              title: "Vent Pipes (Pressure Equalization)", 
              text: "Sized at 2-inch or 3-inch lines. Extends upward to exhaust hazardous sewer gas columns above the upper roof slab boundary." 
            }
          ]}
        />
      </div>
    }
    rightContent={
      <ClickReveal at={3} preset="fade-in">
        <div className="h-full flex flex-col justify-center">
          <SlideCallout variant="info" title="Vertical Shaft Tracking Framework">
            <p className="mb-2 text-sm text-muted-foreground text-left">
              Do not simply measure two-dimensional layout plans. Vertical floor-to-floor heights must calculate full length across stacks:
            </p>
            <div className="text-xl font-mono text-center text-primary my-2 bg-muted/20 p-3 rounded-lg border border-border">
              Length = (Floor Height × Floor Count) + Roof Vent Extension
            </div>
            <p className="text-xs text-muted-foreground mt-2 border-t pt-2 italic text-left">
              * Note: Remember to add the upper weathering Cowl terminal cap (estimated by Nos.) to block atmospheric or avian intrusion into vent lines.
            </p>
          </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 14: Invert Levels & Gradient Slope Calculations
// ============================================================================
export const Slide14: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  return (
    <FullWidthLayout
      title="3.2 Gravity Hydraulics: Gradient Fall & Cushioning"
      bgVariant="default"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        <div className="space-y-4 text-left">
          <SlideParagraph title="The Mandatory Slope Rules">
            Horizontal underground or under-floor drainage layouts require precise slope execution to maintain fluid velocity and prevent solid deposition blockages.
          </SlideParagraph>
          
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "PWD Soil Pipe Gradient Standards", 
                text: "Requires a systematic fall ratio between 1:40 to 1:60 depending on discharge metrics." 
              },
              { 
                title: "Invert Level Differential Calculation", 
                text: "Surveyors check the start depth vs. end depth to determine excavation trench thresholds." 
              }
            ]}
          />
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <DrainageSlopeDrawing
            lengthM={20.0}
            trenchWidthMm={450}
            sandThicknessMm={75}
            gradientRatio={50}
            activeHighlight={
              currentClick === 1 ? 'slope' :
              currentClick >= 2 ? 'sand' : 'none'
            }
          />
        </div>
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 15: Drainage Slope Sandbox
// ============================================================================
export const Slide15: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('plumb_drain_len', 15.0);
  const [width, setWidth] = useUrlSyncedState<number>('plumb_drain_w_mm', 500);
  const [sandT, setSandT] = useUrlSyncedState<number>('plumb_drain_sand_t', 100);
  const [gradient, setGradient] = useUrlSyncedState<number>('plumb_drain_grad', 50);

  const fall = calculateInvertLevelDifferenceInternal(length, gradient);
  const sandVol = calculateSandCushionVolumeInternal(length, width / 1000, sandT / 1000);

  return (
    <TwoColumnLayout
      title="3.3 Pipe Gradient & Trench Sandbox"
      leftWidth="40%"
      leftContent={
        <InteractiveCard title="Trench Parameters">
          <div className="space-y-4">
            <ParameterSlider
              label="Trench Length"
              min={5.0}
              max={30.0}
              step={1.0}
              value={length}
              onChange={setLength}
              unit=" m"
            />
            <ParameterSlider
              label="Trench Width"
              min={300}
              max={600}
              step={50}
              value={width}
              onChange={setWidth}
              unit=" mm"
            />
            <ParameterSlider
              label="Sand Bed Thickness"
              min={50}
              max={150}
              step={10}
              value={sandT}
              onChange={setSandT}
              unit=" mm"
            />
            <ParameterSlider
              label="Slope Gradient (1:x)"
              min={40}
              max={80}
              step={10}
              value={gradient}
              onChange={setGradient}
              unit=""
            />
          </div>

          <div className="border-t border-border/40 mt-4 pt-3 space-y-2">
            <CalculationOutput 
              title="Invert Depth Fall" 
              value={fall.toFixed(3)} 
              unit="m"
              subtitle="Slope vertical drop difference"
            />
            <CalculationOutput 
              title="Sand Cushion Volume" 
              value={sandVol.toFixed(3)} 
              unit="m³"
              subtitle="L × W × T of sand bedding"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <DrainageSlopeDrawing
            lengthM={length}
            trenchWidthMm={width}
            sandThicknessMm={sandT}
            gradientRatio={gradient}
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 16: Quiz 3 (Sand Bedding Volume - Numeric)
// ============================================================================
export const Slide16: React.FC = () => {
  return (
    <FullWidthLayout title="Trench Hydraulics Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec6_q3"
          questionText="Calculate the total sand cushion volume in cubic meters (m³) required for a horizontal drainage pipe trench run of exactly 15.000 m. The trench width is specified as 500 mm, and the compacted sand bed thickness is 100 mm. Round your answer to exactly 3 decimal places."
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};
