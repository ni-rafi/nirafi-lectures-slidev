import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { ClickHighlight, SlideGrid, InteractiveCard } from '@/features/presentation/components/elements';

// Slide 14: Title Page
export const Slide14: React.FC = () => (
  <TopicDividerLayout
    title="Fundamentals of Estimating & Project Documents"
    topicNumber="Part 3"
    description="Definitions, Estimate Types, Drawings, and Specifications"
  />
);

// Slide 15: Definition and Objectives of Estimating
export const Slide15: React.FC = () => (
  <FullWidthLayout title="Definition & Objectives of Estimating" bgVariant="default">
    <div className="flex flex-col gap-4 select-text">
      <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full select-none inline-block mb-2">
          Core Definition
        </span>
        <p className="text-xs md:text-sm text-foreground leading-relaxed">
          An estimate is the{' '}
          <ClickHighlight at={0} variant="paint">
            anticipated or probable computation of quantities
          </ClickHighlight>{' '}
          and{' '}
          <ClickHighlight at={0} variant="paint">
            likely expenditures
          </ClickHighlight>{' '}
          required for a project before construction begins.
        </p>
      </div>

      <SlideGrid cols={2} gap="md">
        <InteractiveCard title="Financial Baseline" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            It serves as the fundamental baseline for predicting total project expenditure, transforming physical designs into material breakdowns, procurement schedules, and <ClickHighlight at={1} variant="paint">financial budgets</ClickHighlight>.
          </p>
        </InteractiveCard>
        <InteractiveCard title="Primary Objective" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            To enable the client and project managers to <ClickHighlight at={2} variant="paint">know the cost beforehand</ClickHighlight>, ensuring the project is financially viable.
          </p>
        </InteractiveCard>
      </SlideGrid>
    </div>
  </FullWidthLayout>
);

// Slide 16: Types of Estimates
export const Slide16: React.FC = () => (
  <TwoColumnLayout
    title="Types of Estimates"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <InteractiveCard title="Approximate / Preliminary Estimates" variant="default">
        <p className="text-xs md:text-sm text-foreground/80 leading-relaxed">
          Used primarily for conceptual, feasibility study, and administrative approval stages before detailed designs or architectural drawings exist.
        </p>
        <div className="bg-background/50 p-3 rounded-lg border border-border/40 mt-4 text-[11px] leading-relaxed select-text">
          <span className="font-bold text-primary block mb-1">Key Methods:</span>
          Based on generic parameters like the <ClickHighlight at={1} variant="paint">Plinth Area Method, Cubical Content Method</ClickHighlight>, or Unit Base Rate Method.
        </div>
      </InteractiveCard>
    }
    rightContent={
      <InteractiveCard title="Detailed / Item Rate Estimates" variant="default">
        <p className="text-xs md:text-sm text-foreground/80 leading-relaxed">
          Highly accurate, itemized calculations executed after final working drawings, engineering specifications, and structural models are locked.
        </p>
        <div className="bg-background/50 p-3 rounded-lg border border-border/40 mt-4 text-[11px] leading-relaxed select-text">
          <span className="font-bold text-primary block mb-1">Usage Context:</span>
          Serves as the rigorous baseline for <ClickHighlight at={2} variant="paint">actual competitive tendering</ClickHighlight>, legally binding contract agreements, and cost control.
        </div>
      </InteractiveCard>
    }
  />
);

// Slide 17: Study of Drawings: The Surveyor's Protocol
export const Slide17: React.FC = () => (
  <FullWidthLayout title="Study of Drawings: The Surveyor's Protocol" bgVariant="default">
    <div className="flex flex-col gap-2">
      <p className="text-xs md:text-sm text-muted-foreground select-none">
        Before launching into dimensions, surveyors must follow a rigorous, methodical protocol to eliminate planning errors.
      </p>
      <SlideGrid cols={3} gap="md">
        <InteractiveCard title="1. Visualization Phase">
          <p className="text-xs text-muted-foreground leading-relaxed select-text">
            It is dangerously premature to start taking off dimensions immediately. A holistic study of all plan views, elevations, and section cuts is required first to visualize the 3D structure.
          </p>
        </InteractiveCard>
        <InteractiveCard title="2. Cross-Checking">
          <p className="text-xs text-muted-foreground leading-relaxed select-text">
            Verify that overall dimensions agree with individual room measurements. The surveyor must <ClickHighlight at={1} variant="paint">reconcile discrepancies</ClickHighlight> between architectural and structural blueprints before quantifying.
          </p>
        </InteractiveCard>
        <InteractiveCard title="3. Missing Data Rule">
          <p className="text-xs text-muted-foreground leading-relaxed select-text">
            If a dimension is missing, work it out logically from other related structural lines. <ClickHighlight at={2} variant="paint">Scaling directly from the paper drawing is strictly a last resort</ClickHighlight>.
          </p>
        </InteractiveCard>
      </SlideGrid>
    </div>
  </FullWidthLayout>
);

// Slide 18: The Role of Technical Specifications
export const Slide18: React.FC = () => (
  <FullWidthLayout title="The Role of Technical Specifications" bgVariant="default">
    <div className="flex flex-col gap-2">
      <p className="text-xs md:text-sm text-muted-foreground select-none">
        Blueprints define dimensions, but specifications dictate the qualitative standards and structural guidelines.
      </p>
      <SlideGrid cols={3} gap="md">
        <InteractiveCard title="1. Beyond the Blueprint">
          <p className="text-xs text-muted-foreground leading-relaxed select-text">
            An engineering specification is an explicit, highly specialized document detailing material requirements, tests, and tolerances that <ClickHighlight at={1} variant="paint">cannot be conveyed by blueprint lines alone</ClickHighlight>.
          </p>
        </InteractiveCard>
        <InteractiveCard title="2. Quality & Cost">
          <p className="text-xs text-muted-foreground leading-relaxed select-text">
            It outlines exact material grades (e.g. steel yield strength), mixing ratios (e.g., 1:1.5:3 concrete proportions), and workmanship execution quality standards.
          </p>
        </InteractiveCard>
        <InteractiveCard title="3. Pricing Baseline">
          <p className="text-xs text-muted-foreground leading-relaxed select-text">
            Since the quality of materials and workmanship directly governs the unit cost, accurate rate analysis is <ClickHighlight at={2} variant="paint">impossible without strict adherence to the specifications</ClickHighlight>.
          </p>
        </InteractiveCard>
      </SlideGrid>
    </div>
  </FullWidthLayout>
);
