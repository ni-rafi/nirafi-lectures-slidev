import React, { useState } from 'react';
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
import { EarthworkMethodDrawing } from '@/subjects/quantity-surveying/features/components/EarthworkMethodDrawing';
import { GridMethodDrawing } from '@/subjects/quantity-surveying/features/components/GridMethodDrawing';

// ============================================================================
// Slide 6: Core Methods for Earthwork Computation
// ============================================================================
export const Slide6: React.FC = () => {
  return (
    <TwoColumnLayout
      title="1.3.1 Core Methods for Earthwork Computation"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="space-y-4 text-left select-text">
          <SlideParagraph title="Segmental Volumetrics">
            To estimate the volume of earthwork along a longitudinal road profile, we divide the total length into discrete sections (stations) at regular intervals (e.g., 30m or 100m).
          </SlideParagraph>

          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "Mid-Section Method",
                text: "Calculates the area of the section at the mean depth, then projects it."
              },
              {
                title: "Trapezoidal Method",
                text: "Averages the cross-sectional areas of the two end sections."
              },
              {
                title: "Prismoidal Formula",
                text: " Simpson's one-third rule, using end areas and the mid-section area."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-center">
          <EarthworkMethodDrawing method="none" className="flex-1" />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 7: Mid-Section Method Formula
// ============================================================================
export const Slide7: React.FC = () => {
  return (
    <TwoColumnLayout
      title="1.3.2 Mid-Section (Average Height) Method"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-3 text-left select-text">
          <SlideParagraph title="Logic & Assumptions">
            This method assumes the average depth represents the uniform cross-section over the entire length (L) of the segment.
          </SlideParagraph>

          <SlideList
            items={[
              {
                title: "1. Mean Depth (dm)",
                text: "Average of depths at the two consecutive sections."
              },
              {
                title: "2. Mid-Area (Am)",
                text: "Area evaluated at mean depth dm."
              },
              {
                title: "3. Volume (V)",
                text: "Mid-area multiplied by length L."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <EarthworkMethodDrawing method="mid" className="flex-1" />
          <div className="bg-muted/40 p-2.5 rounded-xl border border-border/40 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase block">Mathematical Model</span>
            <LatexFormula math="d_m = \frac{d_1 + d_2}{2}" block />
            <LatexFormula math="A_m = B \cdot d_m + s \cdot d_m^2" block />
            <LatexFormula math="V = A_m \cdot L" block />
          </div>
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 8: Trapezoidal Method Formula
// ============================================================================
export const Slide8: React.FC = () => {
  return (
    <TwoColumnLayout
      title="1.3.3 Trapezoidal (Average End Area) Method"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-3 text-left select-text">
          <SlideParagraph title="Logic & Assumptions">
            Assumes the average area of the two ends is representative of the whole segment volume. First compute areas at both stations, then average.
          </SlideParagraph>

          <SlideList
            items={[
              {
                title: "1. Station Areas (A1, A2)",
                text: "Calculate area at both ends using individual station depths."
              },
              {
                title: "2. Mean Area (A_avg)",
                text: "Take the arithmetic mean of A1 and A2."
              },
              {
                title: "3. Volume (V)",
                text: "Mean Area multiplied by length L."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <EarthworkMethodDrawing method="trapezoidal" className="flex-1" />
          <div className="bg-muted/40 p-2.5 rounded-xl border border-border/40 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase block">Mathematical Model</span>
            <LatexFormula math="A_1 = B \cdot d_1 + s \cdot d_1^2 \quad A_2 = B \cdot d_2 + s \cdot d_2^2" block />
            <LatexFormula math="A_{mean} = \frac{A_1 + A_2}{2}" block />
            <LatexFormula math="V = A_{mean} \cdot L" block />
          </div>
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 9: Prismoidal Formula (Simpson's Rule)
// ============================================================================
export const Slide9: React.FC = () => {
  return (
    <TwoColumnLayout
      title="1.3.4 Prismoidal Formula (Simpson's Rule)"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-3 text-left select-text">
          <SlideParagraph title="logic & Accuracy">
            The most mathematically precise method, capturing parabolic curvature along sloping ground. It combines end areas and the mid-section area.
          </SlideParagraph>

          <SlideList
            items={[
              {
                title: "Prismoidal Simpson's Rule",
                text: "Uses weighted averages: 1 part end areas, 4 parts mid-sectional area."
              },
              {
                title: "Mid-Section Area (Am)",
                text: "Must be calculated at average depth (dm), not by averaging areas."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <EarthworkMethodDrawing method="prismoidal" className="flex-1" />
          <div className="bg-muted/40 p-2.5 rounded-xl border border-border/40 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase block">Mathematical Model</span>
            <LatexFormula math="V = \frac{L}{6} \left[ A_1 + 4A_m + A_2 \right]" block />
            <span className="text-[9px] text-muted-foreground block text-center font-mono">Where A_m is mid-section area at d_m</span>
          </div>
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 16: Structuring the Earthwork Computation Table
// ============================================================================
export const Slide16: React.FC = () => {
  return (
    <FullWidthLayout title="2.3 Structuring the Earthwork Computation Table" bgVariant="default">
      <div className="flex flex-col gap-4 select-text">
        <SlideParagraph variant="plain" className="text-xs text-muted-foreground select-none">
          Estimators record calculations in a standard tabular ledger to track cut/fill transitions and volume summation across multiple chainage stations.
        </SlideParagraph>

        <div className="overflow-x-auto rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm p-2">
          <table className="w-full text-[10px] font-mono border-collapse text-left">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground border-b border-border/40">
                <th className="p-2 border-r border-border/20">St. / Ch.</th>
                <th className="p-2 border-r border-border/20">FL (m)</th>
                <th className="p-2 border-r border-border/20">EGL (m)</th>
                <th className="p-2 border-r border-border/20">Depth d (m)</th>
                <th className="p-2 border-r border-border/20">Mean dm</th>
                <th className="p-2 border-r border-border/20">Area Am (m²)</th>
                <th className="p-2 border-r border-border/20">Length L</th>
                <th className="p-2">Vol. Cut / Fill (m³)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/10">
                <td className="p-2 border-r border-border/20">0+00</td>
                <td className="p-2 border-r border-border/20">100.00</td>
                <td className="p-2 border-r border-border/20">98.50</td>
                <td className="p-2 border-r border-border/20">-1.50 (Fill)</td>
                <td className="p-2 border-r border-border/20">—</td>
                <td className="p-2 border-r border-border/20">—</td>
                <td className="p-2 border-r border-border/20">—</td>
                <td className="p-2">—</td>
              </tr>
              <tr className="bg-muted/10 border-b border-border/10">
                <td className="p-2 border-r border-border/20">0+30</td>
                <td className="p-2 border-r border-border/20">100.00</td>
                <td className="p-2 border-r border-border/20">99.10</td>
                <td className="p-2 border-r border-border/20">-0.90 (Fill)</td>
                <td className="p-2 border-r border-border/20">-1.20</td>
                <td className="p-2 border-r border-border/20">14.88</td>
                <td className="p-2 border-r border-border/20">30.00</td>
                <td className="p-2 text-emerald-600 font-bold">446.400 (Fill)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SlideCallout variant="info" title="Depth Sign Convention" className="py-2">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Depth = EGL ~ FL. If **FL &gt; EGL**, the road bed is higher than the ground, requiring **Filling**. If **EGL &gt; FL**, the ground is higher, requiring excavation (**Cutting**).
          </p>
        </SlideCallout>
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 17: Ledger Adjustments for Advanced Methods
// ============================================================================
export const Slide17: React.FC = () => {
  return (
    <FullWidthLayout title="2.4 Ledger Adjustments for Advanced Methods" bgVariant="default">
      <div className="flex flex-col gap-4 select-text">
        <SlideParagraph variant="plain" className="text-xs text-muted-foreground select-none">
          Depending on the client's specification or contract rules, the ledger columns are adjusted to match the volumetric model:
        </SlideParagraph>

        <SlideGrid cols={2} gap="md">
          <InteractiveCard title="Trapezoidal Method Ledger Columns" variant="default">
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Requires calculating the area of each station first. The table must have:
            </p>
            <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-1.5 font-mono bg-muted/20 p-2.5 rounded-lg border border-border/40">
              <li>Individual Area A1 (at St. 1)</li>
              <li>Individual Area A2 (at St. 2)</li>
              <li>Mean Area A_mean = (A1 + A2) / 2</li>
              <li>Volume = A_mean × L</li>
            </ul>
          </InteractiveCard>

          <InteractiveCard title="Prismoidal Method Ledger Columns" variant="default">
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Requires tracking ends and mid-section parameters simultaneously:
            </p>
            <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-1.5 font-mono bg-muted/20 p-2.5 rounded-lg border border-border/40">
              <li>End Areas (A1, A2)</li>
              <li>Mean Depth dm & Mid Area Am</li>
              <li>Prismoidal Vol = L/6 × [A1 + 4Am + A2]</li>
              <li>Note: Works across groups of 3 stations.</li>
            </ul>
          </InteractiveCard>
        </SlideGrid>
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 19: Spot Levels & The Grid Method
// ============================================================================
export const Slide19: React.FC = () => {
  const [activeCell, setActiveCell] = useState<number | null>(1);

  return (
    <TwoColumnLayout
      title="2.6 Spot Levels & The Grid Method (Large Excavations)"
      bgVariant="default"
      leftWidth="48%"
      leftContent={
        <div className="space-y-3 text-left select-text">
          <SlideParagraph title="Areal Excavations">
            For wide pits, borrow fields, or flat foundations (e.g. underground tanks), linear cross-sections do not apply. Instead, we use the **Grid Method / Spot Levels**.
          </SlideParagraph>

          <SlideList
            items={[
              {
                title: "Grid Division",
                text: "The total plan layout is split into standard square/rectangular cells (e.g., 5m × 5m)."
              },
              {
                title: "Corner depth Averaging",
                text: "For any cell, the volume is computed by multiplying cell Area by the average of its 4 corner depths."
              },
              {
                title: "Total Volume",
                text: "Sum of all individual grid cell volumes."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <GridMethodDrawing
            activeCell={activeCell}
            onCellClick={(id) => setActiveCell(id)}
            className="flex-1"
          />
        </div>
      }
    />
  );
};
