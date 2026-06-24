import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
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
import { EarthworkVolumeDrawing, RoadwayTabularSandbox } from '@/subjects/quantity-surveying/features';
import { calculateTransitVolume, calculateRequiredExcavation } from '@/subjects/quantity-surveying/cores';

// Slide 7: Topic Divider 2
export const Slide7: React.FC = () => (
  <TopicDividerLayout
    topicNumber="02"
    title="Soil Volumetrics & Compaction"
    description="Bank vs. Loose States, Bulking Factors, and Shrinkage Corrections"
  />
);

// Slide 8: Soil State Transitions (Concept)
export const Slide8: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = Math.min(2, Math.max(0, currentClick));

  return (
    <TwoColumnLayout
      title="2.1 Volumetric States of Soil"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="space-y-3">
          <SlideParagraph title="Dynamic Soil Coefficients">
            Soil changes in volume when excavated, transported, and compacted.
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "Bank Measure (In-Situ)",
                text: <span>Soil in its natural, undisturbed state. Billed in-situ: <ClickHighlight variant="paint" at={0}>Design Net Volume</ClickHighlight>.</span>
              },
              {
                title: "Loose Measure (Bulked)",
                text: <span>Excavating introduces air voids. Soil expands by <ClickHighlight variant="paint" at={1}>20% to 30%</ClickHighlight> of its bank volume (Transit Volume).</span>
              },
              {
                title: "Compacted Measure (Shrunk)",
                text: <span>Filling and rolling forces air out. Embankments compact, requiring <ClickHighlight variant="paint" at={2}>10% to 15% extra bank soil</ClickHighlight> to achieve target design volume.</span>
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <div className="flex-1 min-h-[220px]">
            <EarthworkVolumeDrawing netVolume={100} bulkingFactor={1.25} currentStep={step} />
          </div>
          <ClickReveal at={2} preset="up">
            <SlideCallout variant="warning" title="Bulking vs. Compaction Shrinkage" className="py-2">
              <span className="text-[10px] text-muted-foreground leading-normal block">
                Soil bulks up when loose, but shrinks down during rolling. In embankments, we must order extra material to compensate for compaction shrinkage.
              </span>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 9: Compaction & Bulking Sandbox
export const Slide9: React.FC = () => {
  const [netVolume, setNetVolume] = useUrlSyncedState<number>('vol_net', 500);
  const [bulkingFactor, setBulkingFactor] = useUrlSyncedState<number>('vol_bulk', 1.25);
  const [compactionFactor, setCompactionFactor] = useUrlSyncedState<number>('vol_comp', 0.90);
  const { currentClick } = useClickStepsContext();
  const step = Math.min(2, Math.max(0, currentClick));

  const transitVolume = calculateTransitVolume(netVolume, bulkingFactor);
  const rawExcavationNeed = calculateRequiredExcavation(netVolume, compactionFactor);

  return (
    <TwoColumnLayout
      title="2.2 Compaction & Bulking Sandbox"
      bgVariant="default"
      leftWidth="48%"
      leftContent={
        <InteractiveCard title="Soil Volumetrics Modeler">
          <div className="space-y-4">
            <ParameterSlider
              label="Design Net Volume (V_net)"
              min={100}
              max={1000}
              step={50}
              value={netVolume}
              onChange={setNetVolume}
              unit=" m³"
            />
            <ParameterSlider
              label="Soil Bulking Factor (Loose)"
              min={1.10}
              max={1.40}
              step={0.05}
              value={bulkingFactor}
              onChange={setBulkingFactor}
              unit=""
            />
            <ParameterSlider
              label="Compaction Shrinkage Coefficient"
              min={0.80}
              max={0.95}
              step={0.05}
              value={compactionFactor}
              onChange={setCompactionFactor}
              unit=""
            />
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/40">
              <CalculationOutput
                title="Transit Volume (Loose)"
                value={transitVolume.toFixed(1)}
                unit=" m³"
                variant="compact"
              />
              <CalculationOutput
                title="Required Excavation Bank"
                value={rawExcavationNeed.toFixed(1)}
                unit=" m³"
                variant="compact"
              />
            </div>
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 min-h-[220px]">
            <EarthworkVolumeDrawing netVolume={netVolume} bulkingFactor={bulkingFactor} currentStep={step} />
          </div>
        </div>
      }
    />
  );
};

// Slide 10: Topic Divider 3
export const Slide10: React.FC = () => (
  <TopicDividerLayout
    topicNumber="03"
    title="PWD Rate Analysis Standards"
    description="Horizontal Leads, Vertical Lifts, and Tabular Measurement Sheets"
  />
);

// Slide 11: Lead and Lift Rules (Concept)
export const Slide11: React.FC = () => {
  return (
    <TwoColumnLayout
      title="3.1 PWD Haulage Controls: Lead & Lift Rules"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="space-y-3">
          <SlideParagraph title="Standard Horizontal & Vertical Hauling">
            Under Bangladesh PWD Schedule of Rates rules, earthwork cost is graded by horizontal hauling distance (Lead) and vertical lift height (Lift).
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "Baseline Horizontal Lead",
                text: <span>Baseline distance is <ClickHighlight variant="paint" at={1}>30 meters</ClickHighlight>. Any transport within this range is included in base rate. Additional increments of 30m carry extra rate penalties.</span>
              },
              {
                title: "Baseline Vertical Lift",
                text: <span>Baseline lift height is <ClickHighlight variant="paint" at={2}>1.5 meters</ClickHighlight>. Excavating or filling deeper/higher than 1.5m incurs progressive extra charges per 1.5m stage.</span>
              },
              {
                title: "Graded Earthwork Rates",
                text: <span>Rates are partitioned: <ClickHighlight variant="paint" at={3}>Total Rate = Base Rate + Extra Lead + Extra Lift</ClickHighlight> to keep contractor compensation fair for deep cuts or long hauls.</span>
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-center space-y-4">
          <ClickReveal at={1} preset="up">
            <div className="p-3.5 bg-muted/40 border border-amber-500/20 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">PWD Lead Increment Rule</span>
              <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                Extra Lead Count = ceil((Total Horizontal Distance - 30m) / 30m)
              </p>
            </div>
          </ClickReveal>
          <ClickReveal at={2} preset="up">
            <div className="p-3.5 bg-muted/40 border border-emerald-500/20 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">PWD Lift Increment Rule</span>
              <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                Extra Lift Count = ceil((Total Vertical Height - 1.5m) / 1.5m)
              </p>
            </div>
          </ClickReveal>
          <ClickReveal at={3} preset="up">
            <SlideCallout variant="info" title="BoQ Rate Specification" className="py-2.5">
              <p className="text-[10px] text-muted-foreground leading-normal">
                Lead and Lift calculations prevent flat bidding rates. Earthwork schedules must state precise lead limits (e.g. Lead up to 150m, Lift up to 3.0m).
              </p>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 12: PWD Tabular Sheet Sandbox
export const Slide12: React.FC = () => (
  <FullWidthLayout title="3.2 PWD Tabular Earthwork Spreadsheet" bgVariant="default">
    <RoadwayTabularSandbox />
  </FullWidthLayout>
);
