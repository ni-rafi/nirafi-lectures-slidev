import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import {
  SlideParagraph,
  SlideList,
  SlideCallout,
  InteractiveCard,
  ClickHighlight
} from '@/features/presentation/components/elements';
import { PipeFittingsDrawing } from '@/subjects/quantity-surveying/features/components/PipeFittingsDrawing';
import { GrooveWeldingDrawing, GrooveWeldingSandbox } from '@/subjects/quantity-surveying/features';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';

// ============================================================================
// Slide 7: Pipes vs. Fittings
// ============================================================================
export const Slide7: React.FC = () => (
  <TwoColumnLayout
    title="1.4 Pipes vs. Fittings: Structural Nodes"
    bgVariant="default"
    leftWidth="45%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="Isolating Transitional Nodes">
          While straight pipe runs are quantified by total continuous net length, a complete plumbing Bill of Materials (BoM) must explicitly isolate the **fittings**.
        </SlideParagraph>
        <p className="text-xs text-muted-foreground leading-relaxed select-text">
          Pipes convey fluid linearly, but fittings serve as the directional, dimensional, and transitional nodes of the plumbing grid.
        </p>
        <SlideCallout variant="info" title="The Jointing Waste Rule">
          In standard practice, straight runs include a <ClickHighlight at={1} variant="paint">5% allowance</ClickHighlight> to account for socket overlaps, cut waste, and thread jointing. Fittings, however, are estimated item-by-item.
        </SlideCallout>
      </div>
    }
    rightContent={
      <div className="space-y-4 flex flex-col justify-center h-full">
        <InteractiveCard title="Standard Fitting Categories" variant="default" className="select-text">
          <div className="text-xs space-y-2.5">
            <p>• <strong>Directional</strong>: 90° and 45° elbows changing piping trajectories.</p>
            <p>• <strong>Branching</strong>: Equal Tees, reducing tees, and cross-pieces separating flow routes.</p>
            <p>• <strong>Transitional</strong>: Sockets, reducers, and unions connecting unequal sizes or maintenance joints.</p>
            <p>• <strong>Control Nodes</strong>: Stop cocks, bibcocks, gate valves, and check valves regulating flow rates.</p>
          </div>
        </InteractiveCard>
      </div>
    }
  />
);

// ============================================================================
// Slide 8: Standard Measurement Units for Fittings
// ============================================================================
export const Slide8: React.FC = () => (
  <TwoColumnLayout
    title="1.5 Standard Measurement Units for Fittings"
    bgVariant="default"
    leftWidth="48%"
    leftContent={
      <div className="space-y-4 text-left">
        <SlideParagraph title="The 'Numbers (Nos.)' Billing Rule">
          Unlike pipe pipelines which are measured and billed in running meters or feet, **all plumbing fittings, valves, and covers are quantified strictly by count or Numbers (Nos.)**.
        </SlideParagraph>
        <p className="text-xs text-muted-foreground leading-relaxed select-text">
          Never absorb fitting costs into linear pipe runs. Standard schedules (including PWD) require distinct item rate billing for each fittings specification.
        </p>
      </div>
    }
    rightContent={
      <div className="h-full flex flex-col justify-center">
        <SlideCallout variant="warning" title="BoQ Measurement Checklist" className="py-2.5">
          <div className="text-xs space-y-1.5 leading-relaxed select-text">
            <p>1. <strong>Tees & Elbows</strong>: Count and categorize by Nominal Diameter (ND) (e.g., 25mm, 32mm) and material grade.</p>
            <p>2. <strong>Stop Cocks & Valves</strong>: Separate by pressure ratings, connections (threaded/welded), and handle controls.</p>
            <p>3. <strong>Heavy Accessories</strong>: Billed individually (e.g., Cast Iron inspection chamber covers, Gully Traps, Air-vent stacks).</p>
          </div>
        </SlideCallout>
      </div>
    }
  />
);

// ============================================================================
// Slide 9: Formulating the Fittings BoM
// ============================================================================
export const Slide9: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  const highlightMap: Record<number, 'none' | 'elbow' | 'tee' | 'union' | 'valve'> = {
    0: 'none',
    1: 'elbow',
    2: 'tee',
    3: 'union',
    4: 'valve',
  };

  const activeHighlight = highlightMap[currentClick] || 'none';

  return (
    <TwoColumnLayout
      title="1.6 Formulating the Fittings Ledger"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="space-y-4 text-left select-text">
          <SlideParagraph variant="plain" className="text-xs select-none">
            In the Measurement Book (MB), trace each fitting branch and log counts sequentially, matching corresponding pipe diameters.
          </SlideParagraph>

          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "90° & 45° Elbows",
                text: "Count every angular turn. E.g., 25mm PPR Elbow — 14 Nos. (marked in green)."
              },
              {
                title: "Equal & Reducing Tees",
                text: "Branch nodes splitting flow. E.g., 25x25x25mm Equal Tee — 6 Nos. (marked in green)."
              },
              {
                title: "Threaded Unions",
                text: "Facilitate quick maintenance disconnection. E.g., 25mm Union — 4 Nos. (marked in green)."
              },
              {
                title: "Stop Cocks & Control Valves",
                text: "Isolating check boundaries. E.g., 25mm Concealed Stop Cock — 2 Nos. (marked in green)."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <PipeFittingsDrawing
            activeHighlight={activeHighlight}
            className="flex-1"
          />
          <SlideCallout variant="success" title="Surveyor Pro-Tip" className="py-1">
            <p className="text-[10px] text-muted-foreground text-center select-text">
              Matching diameter is critical: a 32mm pipe run requiring a transition to a 25mm line must use a <strong>Reducing Socket (Nos.)</strong>. Double check that reducers align with plumbing schematic drops.
            </p>
          </SlideCallout>
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 10: Advanced Jointing & Wall Concealment
// ============================================================================
export const GrooveWeldingSlide: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  const highlightMap: Record<number, 'none' | 'groove' | 'joint'> = {
    0: 'none',
    1: 'groove',
    2: 'joint',
  };

  const activeHighlight = highlightMap[currentClick] || 'none';

  return (
    <TwoColumnLayout
      title="1.7 Advanced Jointing & Wall Concealment"
      bgVariant="default"
      leftWidth="48%"
      leftContent={
        <div className="space-y-4 text-left select-text">
          <SlideParagraph title="Wall-Groove Concealment & Jointing">
            Modern building specifications conceal interior pipelines inside wall chases. High-performance lines like HDPE also require advanced heat fusion jointing techniques.
          </SlideParagraph>

          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "Wall Groove Chasing & Concrete Sealing",
                text: "Cutting a 50x50mm vertical/horizontal groove in brickwork or concrete walls, laying the conduit, and sealing with cement mortar/concrete."
              },
              {
                title: "HDPE Electro-Fusion & Butt Welding",
                text: "Applying electric currents to resistive coils inside a sleeve coupler. This melts the plastic interface to form a joint stronger than the pipe."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-center">
          <GrooveWeldingDrawing
            highlightType={activeHighlight}
            className="flex-1"
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 11: Groove & Jointing Sandbox
// ============================================================================
export const GrooveWeldingSandboxSlide: React.FC = () => {
  return (
    <FullWidthLayout title="1.8 Live Sandbox: Wall Concealment & Jointing">
      <div className="w-full h-full mt-2">
        <GrooveWeldingSandbox />
      </div>
    </FullWidthLayout>
  );
};
