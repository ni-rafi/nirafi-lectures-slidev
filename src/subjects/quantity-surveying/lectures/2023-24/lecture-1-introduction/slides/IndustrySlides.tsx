import React from 'react';
import { LectureCover } from '@/shared/layouts/LectureCover';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { ClickHighlight, InteractiveCard, SlideGrid, SlideBullet, ClickReveal } from '@/features/presentation/components/elements';

// Slide 1: Cover Slide
export const Slide1: React.FC<SlideProps> = (props) => (
  <LectureCover {...props} />
);

// Slide 2: Definition and Scope of Quantity Surveying (QS)
export const Slide2: React.FC = () => (
  <FullWidthLayout title="Definition and Scope of Quantity Surveying (QS)" bgVariant="default">
    <div className="flex flex-col gap-4 select-text">
      <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-2 select-none">
          Core Definition
        </span>
        <p className="text-xs md:text-sm text-foreground leading-relaxed">
          Quantity Surveying is the rigorous cost assessment of construction projects based on local market rates for materials and labor.
        </p>
      </div>

      <SlideGrid cols={2} gap="md">
        <ClickReveal at={1}>
          <InteractiveCard title="The Evolution (Historical Scope)" variant="default">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Roots trace back to the Napoleonic Wars, shifting the industry from separate trades toward <ClickHighlight at={1} variant="paint">"contracting in gross"</ClickHighlight>, and formally establishing an independent field in 1834 after splitting from RIBA.
            </p>
          </InteractiveCard>
        </ClickReveal>
        <ClickReveal at={2}>
          <InteractiveCard title="Operational Scope" variant="default">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Serves as the vital professional bridge translating an architect's <ClickHighlight at={2} variant="paint">spatial design concepts</ClickHighlight> directly into a builder's <ClickHighlight at={3} variant="paint">physical construction execution</ClickHighlight>.
            </p>
          </InteractiveCard>
        </ClickReveal>
      </SlideGrid>
    </div>
  </FullWidthLayout>
);

// Slide 3: Rationale & Importance in Project Management
export const Slide3: React.FC = () => (
  <FullWidthLayout title="Rationale &amp; Importance in Project Management" bgVariant="default">
    <div className="flex flex-col gap-3 select-text">
      <p className="text-xs text-muted-foreground mb-1 leading-normal select-none">
        Quantitative controls serve as the baseline financial and logistical blueprint throughout a project's lifecycle.
      </p>
      <SlideGrid cols={2} gap="md">
        <InteractiveCard title="Baseline Financial Blueprint" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Establishes a realistic, mathematically sound prediction of total project expenditure at every stage of infrastructure development.
          </p>
        </InteractiveCard>
        <ClickReveal at={1}>
          <InteractiveCard title="Role in Project Budgeting" variant="default">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Prevents cost overruns, anchors pre-tender estimates, and manages critical feasibility boundaries before committing capital.
            </p>
          </InteractiveCard>
        </ClickReveal>
        <ClickReveal at={2}>
          <InteractiveCard title="Material &amp; Resource Scheduling" variant="default">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Translates 2D blueprints into exact logistical bills of materials (cement, sand, bricks) to optimize site inventory and minimize waste.
            </p>
          </InteractiveCard>
        </ClickReveal>
        <ClickReveal at={3}>
          <InteractiveCard title="Time &amp; Cost Control" variant="default">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Manages field variations, acts as a legal rate baseline for disputes, and structures monthly interim contractor progress billings.
            </p>
          </InteractiveCard>
        </ClickReveal>
      </SlideGrid>
    </div>
  </FullWidthLayout>
);

// Slide 4: Competencies & Core Responsibilities of a QS
export const Slide4: React.FC = () => {
  return (
    <TwoColumnLayout
      title="Competencies &amp; Core Responsibilities of a QS"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="flex flex-col gap-3">
          <InteractiveCard title="Core Professional Competencies" variant="default" className="w-full">
            <ul className="flex flex-col gap-2.5">
              <SlideBullet title="Technical Translation:">
                <span>
                  Describing complex architectural requirements in flawless, completely unambiguous technical language so builders can price accurately.
                </span>
              </SlideBullet>
              <SlideBullet title="Market Grounding:">
                <span>
                  Possessing an absolute command of raw construction materials, modern site methods, and local trade customs.
                </span>
              </SlideBullet>
              <SlideBullet title="Accountability:">
                <span>
                  Demands strict personal discipline, organized spatial take-off habits, and absolute arithmetical accuracy.
                </span>
              </SlideBullet>
            </ul>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col gap-3">
          <InteractiveCard title="The Sector Split (Responsibilities)" variant="default" className="w-full">
            <ul className="flex flex-col gap-3">
              <SlideBullet revealAt={1} title="Private Practice (Client-Side):">
                <span>
                  Protecting the owner's investment, providing independent cost advice, and managing lifecycle budgets from inception to handover.
                </span>
              </SlideBullet>
              <SlideBullet revealAt={2} title="Commercial Management (Contracting):">
                <span>
                  Working for the contractor to manage site supply chains, monitor cash flow, and secure project profitability.
                </span>
              </SlideBullet>
            </ul>
          </InteractiveCard>
        </div>
      }
    />
  );
};
