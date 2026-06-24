import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import {
  SlideParagraph,
  SlideCallout,
  InteractiveCard
} from '@/features/presentation/components/elements';

// ============================================================================
// Slide 25: Trade Segregation in MEP
// ============================================================================
export const Slide25: React.FC = () => (
  <TwoColumnLayout
    title="4.4 Trade Boundaries: Civil vs. Sanitary Works"
    bgVariant="default"
    leftWidth="48%"
    leftContent={
      <div className="space-y-4 text-left">
        <SlideParagraph title="MEP and Civil Trade Segregation">
          External sewerage systems (like underground drainage lines and masonry manholes) merge structural civil works with mechanical plumbing works.
        </SlideParagraph>
        <p className="text-xs text-muted-foreground leading-relaxed select-text">
          Quantity surveyors must rigorously separate quantities into their respective sub-heads. Lumping structural excavations under plumbing or piping rates is a severe violation of billing boundaries.
        </p>
        <SlideCallout variant="warning" title="The Double-Entry Threat">
          <p className="text-[10px] leading-relaxed select-text">
            Avoid the risk of double-counting: ensure excavation volumes or sand beds for pipelines are not booked under both the Civil foundation package and the Sanitary plumbing package.
          </p>
        </SlideCallout>
      </div>
    }
    rightContent={
      <div className="space-y-4 flex flex-col justify-center h-full">
        <InteractiveCard title="Standard PWD Sub-Head Allocations" variant="default" className="select-text">
          <div className="text-xs space-y-3">
            <p>
              • <strong>Sub-Head I: Civil Works</strong>
              <br /><span className="text-muted-foreground text-[10px]">Absorbs bulk earthwork, structural concreting, brickwork, and surface plasters.</span>
            </p>
            <p>
              • <strong>Sub-Head II: Sanitary &amp; Water Supply Works</strong>
              <br /><span className="text-muted-foreground text-[10px]">Isolates fluid conduits, fittings, active fixtures, valves, and specialized terminal components.</span>
            </p>
          </div>
        </InteractiveCard>
      </div>
    }
  />
);

// ============================================================================
// Slide 26: Classifying the Lab Quantities
// ============================================================================
export const Slide26: React.FC = () => (
  <FullWidthLayout title="4.5 Classifying Lab 6 Quantities" bgVariant="default">
    <div className="flex flex-col gap-4 select-text">
      <SlideParagraph variant="plain" className="text-xs md:text-sm text-muted-foreground select-none">
        When compiling your Lab 6 Portfolio, divide your computed take-offs strictly using standard PWD boundary rules.
      </SlideParagraph>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
        <InteractiveCard title="Civil/Structural Sub-Head" variant="default">
          <span className="font-bold text-xs text-primary block mb-2 font-sans">Absorbs Volumetric Structural Elements:</span>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-2.5 font-mono">
            <p>• <strong>Trench Excavation</strong>: Pit volumes measured in cubic meters (m³).</p>
            <p>• <strong>Sand Bedding</strong>: Layer cushioning under the pipes, billed in cubic meters (m³).</p>
            <p>• <strong>Chamber Brickwork</strong>: Masonry walls for manholes/ICs, billed in cubic meters (m³).</p>
            <p>• <strong>Internal Plastering</strong>: Cement plaster seals inside pits, billed in square meters (m²).</p>
          </div>
        </InteractiveCard>

        <InteractiveCard title="Sanitary/Plumbing Sub-Head" variant="default">
          <span className="font-bold text-xs text-primary block mb-2 font-sans">Isolates Active Piping &amp; Fixtures:</span>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-2.5 font-mono">
            <p>• <strong>Piping Conduits</strong>: Continuous runs of PPR/PVC lines, billed in linear meters (m).</p>
            <p>• <strong>Piping Fittings</strong>: Sockets, Equal/Reducing Tees, Elbows, billed in Numbers (Nos.).</p>
            <p>• <strong>Fixture Assemblies</strong>: Water Closets (WCs), Sinks, Basin sets, billed in Sets / Nos.</p>
            <p>• <strong>Access Covers</strong>: Heavy Cast Iron (CI) or RCC manhole covers, billed in Numbers (Nos.).</p>
          </div>
        </InteractiveCard>
      </div>

      <SlideCallout variant="info" title="Take-Off Guideline" className="py-2.5">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Separating civil work from plumbing is critical during procurement. Brick and sand are purchased locally, whereas PPR pipes and fixtures are sourced from specialized MEP suppliers. Keep boundaries clean in your final ledgers!
        </p>
      </SlideCallout>
    </div>
  </FullWidthLayout>
);
