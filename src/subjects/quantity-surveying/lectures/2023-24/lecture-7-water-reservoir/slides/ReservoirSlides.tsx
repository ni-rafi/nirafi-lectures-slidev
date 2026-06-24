import React from 'react';
import { TitleV2Layout } from '@/shared/layouts/TitleV2Layout';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { WaterReservoirShellDrawing } from '@/subjects/quantity-surveying/features';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import {
  calculateReservoirExcavation,
  calculateReservoirRaft,
  calculateReservoirWalls,
  calculateReservoirPlasterArea,
  calculatePudloRequirement
} from '@/subjects/quantity-surveying/cores';
import {
  SlideParagraph,
  SlideList,
  SlideCallout,
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
  ClickReveal,
  ClickHighlight,
} from '@/features/presentation/components/elements';

// Slide 1: Cover Slide
export const Slide1: React.FC<SlideProps> = () => (
  <TitleV2Layout
    courseCode="CE 204"
    courseTitle="Quantity Surveying & Valuation"
    subtitle="Estimation of Water Reservoir and Septic Tank"
    yearSemester="2nd Year/1st Semester"
    creditHours="3.0"
    usnCode="CO-QS-204"
    session="2023-2024"
    lectureNumber={7}
  />
);

// Slide 2: Section Divider
export const Slide2: React.FC = () => (
  <TopicDividerLayout
    topicNumber="01"
    title="Water Reservoir Volumetric Estimation"
    description="Deep Excavations, RCC Containment Shells, and Waterproofing Systems"
  />
);

// Slide 3: Excavation Logistics Concepts (With Integrated Drawing)
export const Slide3: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  return (
    <TwoColumnLayout
      title="1.1 Underground Excavation & Shoring"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-3">
          <SlideParagraph title="Underground Volume Parameters">
            Deep excavation for reservoirs requires safety allowances and clearances.
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            items={[
              { title: "Net Base Dimension", text: <span>Structure <ClickHighlight variant="paint" at={1}>base slab boundary profile</ClickHighlight> (length × width).</span> },
              { title: "Working Space Offset (c)", text: <span>Extra 0.3m to 0.5m perimeter margin to construct forms and damp-proofing, known as <ClickHighlight variant="paint" at={2}>Working Space Offset (c)</ClickHighlight>.</span> },
              { title: "Timbering & Shoring Area", text: <span>Vertical wall supports, known as <ClickHighlight variant="paint" at={3}>Timbering & Shoring</ClickHighlight>, are billed in square meters (m²) when digging depth &gt; 1.5m.</span> }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <WaterReservoirShellDrawing mode="excavation" currentClick={currentClick} className="flex-1" />
          <ClickReveal at={3} preset="up">
            <SlideCallout variant="warning" title="Excavation Volume Formula" className="py-2">
              <div className="text-base font-mono text-center text-amber-500 bg-muted/40 p-2 rounded-xl border border-amber-500/20 font-bold">
                V = (L + 2c) × (B + 2c) × H
              </div>
              <span className="text-[9px] text-muted-foreground block mt-1 text-center">Where H = excavation depth from Natural Ground level (EGL)</span>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 4: Excavation Volume Sandbox
export const Slide4: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('res_exc_len', 6.0);
  const [width, setWidth] = useUrlSyncedState<number>('res_exc_width', 4.0);
  const [depth, setDepth] = useUrlSyncedState<number>('res_exc_depth', 3.0);
  const [clearance, setClearance] = useUrlSyncedState<number>('res_exc_clear', 0.5);

  const totalExcVol = calculateReservoirExcavation(length, width, depth, clearance);

  return (
    <TwoColumnLayout
      title="1.1 Excavation Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Excavation Modeler">
          <div className="space-y-4">
            <ParameterSlider label="Base Length (L)" min={3} max={15} step={0.5} value={length} onChange={setLength} unit=" m" />
            <ParameterSlider label="Base Width (B)" min={2} max={10} step={0.5} value={width} onChange={setWidth} unit=" m" />
            <ParameterSlider label="Excavation Depth (H)" min={1.5} max={5} step={0.1} value={depth} onChange={setDepth} unit=" m" />
            <ParameterSlider label="Clearance (c)" min={0.3} max={1} step={0.1} value={clearance} onChange={setClearance} unit=" m" />
            <CalculationOutput title="Total Excavation" value={`${totalExcVol.toFixed(3)}`} unit="m³" />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <WaterReservoirShellDrawing mode="excavation" />
      }
    />
  );
};

// Slide 5: RCC Concrete Shell Concepts (With Integrated Drawing)
export const Slide5: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  return (
    <TwoColumnLayout
      title="1.2 RCC Structural Containment Shell"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-3">
          <SlideParagraph title="Intersection Geometry">
            A liquid-retaining structure is an integrated monolithic concrete box. To avoid double-counting materials, overlaps must be deducted.
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            items={[
              { title: "Base Raft Slab", text: <span>Monolithic concrete slab at the bottom. Carries self-weight and fluid mass, known as the <ClickHighlight variant="paint" at={1}>Base Raft Slab</ClickHighlight>.</span> },
              { title: "Vertical Walls Ring", text: <span>Retaining walls. Calculate long walls out-to-out, then short walls in-to-in to avoid <ClickHighlight variant="paint" at={2}>double-counting overlaps</ClickHighlight>.</span> },
              { title: "Roof Cover Slab", text: <span>Top horizontal plate. Net area minus manhole access openings, known as <ClickHighlight variant="paint" at={3}>Roof Cover Slab</ClickHighlight>.</span> }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <WaterReservoirShellDrawing mode="shell" currentClick={currentClick} className="flex-1" />
          <ClickReveal at={3} preset="up">
            <SlideCallout variant="info" title="Take-off Ledger Overlap Deduction" className="py-2">
              <p className="text-[10px] text-muted-foreground leading-normal">
                Short walls must systematically deduct the thickness of the overlapping long walls. Neglect reinforcement displacement when taking off structural concrete.
              </p>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 6: RCC Shell Volume Sandbox
export const Slide6: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('res_shell_len', 5.0);
  const [width, setWidth] = useUrlSyncedState<number>('res_shell_width', 3.0);
  const [wallThick, setWallThick] = useUrlSyncedState<number>('res_shell_thick', 0.25);
  const [height, setHeight] = useUrlSyncedState<number>('res_shell_height', 2.5);

  const baseSlabVol = calculateReservoirRaft(length, width, wallThick, 0.3);
  const wallVol = calculateReservoirWalls(length, width, wallThick, height);

  return (
    <TwoColumnLayout
      title="1.2 RCC Structural Shell Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="RCC Shell Modeler">
          <div className="space-y-4">
            <ParameterSlider label="Inner Length" min={2} max={10} step={0.5} value={length} onChange={setLength} unit=" m" />
            <ParameterSlider label="Inner Width" min={1.5} max={8} step={0.5} value={width} onChange={setWidth} unit=" m" />
            <ParameterSlider label="Wall Thickness" min={0.2} max={0.4} step={0.05} value={wallThick} onChange={setWallThick} unit=" m" />
            <ParameterSlider label="Wall Height" min={1.5} max={4.0} step={0.1} value={height} onChange={setHeight} unit=" m" />
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <CalculationOutput title="Raft Vol" value={`${baseSlabVol.toFixed(2)}`} unit="m³" variant="compact" />
              <CalculationOutput title="Wall Vol" value={`${wallVol.toFixed(2)}`} unit="m³" variant="compact" />
            </div>
          </div>
        </InteractiveCard>
      }
      rightContent={
        <WaterReservoirShellDrawing mode="shell" />
      }
    />
  );
};

// Slide 7: Waterproofing & Finishing Concepts (With Integrated Drawing)
export const Slide7: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  return (
    <TwoColumnLayout
      title="1.3 Waterproofing & Plastering Finishes"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-3">
          <SlideParagraph title="Preventing Fluid Seepage">
            Hydraulic structures must be impervious to seepage and external groundwater infiltration.
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            items={[
              { title: "Waterproofing Admixture", text: <span>PWD criteria require adding <ClickHighlight variant="paint" at={1}>waterproofing admixture</ClickHighlight> (e.g. Pudlo) at 1.5% to 2% of total cement weight.</span> },
              { title: "Internal Plaster Coat (1:3)", text: <span>12mm cement plaster applied to internal walls and floor, covering <ClickHighlight variant="paint" at={2}>Internal Surface Area</ClickHighlight>. Billed in m².</span> }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <WaterReservoirShellDrawing mode="waterproofing" currentClick={currentClick} className="flex-1" />
          <ClickReveal at={2} preset="up">
            <SlideCallout variant="success" title="Plaster Area Equation" className="py-2">
              <div className="text-base font-mono text-center text-emerald-600 dark:text-emerald-400 bg-muted/40 p-2 rounded-xl border border-emerald-500/20 font-bold">
                Area = 2(L + B) × h + L × B
              </div>
              <span className="text-[9px] text-muted-foreground block mt-1 text-center">Walls Area (Wet Perimeter × height) + Floor Area</span>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 8: Plaster Area & Chemical Sandbox
export const Slide8: React.FC = () => {
  const [length, setLength] = useUrlSyncedState<number>('res_water_len', 5.0);
  const [width, setWidth] = useUrlSyncedState<number>('res_water_width', 3.0);
  const [height, setHeight] = useUrlSyncedState<number>('res_water_height', 2.5);

  const plasterArea = calculateReservoirPlasterArea(length, width, height);
  const pudloKg = calculatePudloRequirement(plasterArea, 0.015, 50);

  return (
    <TwoColumnLayout
      title="1.3 Waterproofing Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Plaster & Chemical Modeler">
          <div className="space-y-4">
            <ParameterSlider label="Internal Length" min={2} max={10} step={0.5} value={length} onChange={setLength} unit=" m" />
            <ParameterSlider label="Internal Width" min={1.5} max={8} step={0.5} value={width} onChange={setWidth} unit=" m" />
            <ParameterSlider label="Liquid Depth (h)" min={1} max={4} step={0.1} value={height} onChange={setHeight} unit=" m" />
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <CalculationOutput title="Plaster Area" value={`${plasterArea.toFixed(2)}`} unit="m²" variant="compact" />
              <CalculationOutput title="Pudlo Req." value={`${pudloKg.toFixed(1)}`} unit="kg" variant="compact" />
            </div>
          </div>
        </InteractiveCard>
      }
      rightContent={
        <WaterReservoirShellDrawing mode="waterproofing" />
      }
    />
  );
};

