import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  ClickHighlight 
} from '@/features/presentation/components/elements';

// ============================================================================
// Slide 1: Capstone Cover Layout (Fresh reset for Lecture 10)
// ============================================================================
export const Slide1: React.FC = () => (
  <TopicDividerLayout
    topicNumber="10"
    title="Contractor Progress Payments & Project Budgeting"
    subtitle="The Pinnacle of Sessional Cost Reconciliation, Abstract Ledgers, and Interim Payment Certificates (IPC)"
  />
);

// ============================================================================
// Slide 2: Abstract of Costs Data Integration (Dutta Framework)
// ============================================================================
export const Slide2: React.FC = () => (
  <TwoColumnLayout
    title="1.1 The Abstract of Cost Ledger Assembly"
    bgVariant="default"
    leftWidth="48%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="Consolidating Sessional Data Work Packages">
          Up to this point, take-off ledgers have lived as disjointed material metrics (m³ of concrete, tons of steel rebar, m² of pavement). To compile a baseline contract, these must be channeled into a singular Abstract matrix.
        </SlideParagraph>
        
        <ClickReveal at={1}>
          <SlideCallout variant="info" title="The Abstract Sorting Rule">
            According to B.N. Dutta rules, raw dimensional logs are collapsed. Every item description hooks directly to its corresponding PWD chapter schedule rate code to derive direct subtotal costs.
          </SlideCallout>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={2} preset="up">
        <div className="h-full flex flex-col justify-center">
          <SlideCallout variant="warning" title="Sessional Threaded Architecture">
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Your final master budget binder directly stacks previous lab work packages:
            </p>
            <div className="p-3 bg-background border border-border rounded-lg text-xs font-mono grid grid-cols-2 gap-2">
              <div className="p-1.5 bg-muted/40 rounded">1. Earthwork / BFS</div>
              <div className="p-1.5 bg-muted/40 rounded">2. Concrete Frame</div>
              <div className="p-1.5 bg-muted/40 rounded">3. Reinforcement BBS</div>
              <div className="p-1.5 bg-muted/40 rounded">4. Brickwork / Finish</div>
              <div className="p-1.5 bg-muted/40 rounded">5. MEP Plumbing</div>
              <div className="p-1.5 bg-muted/40 rounded">6. Culvert Infrastructure</div>
            </div>
            <div className="mt-4 p-2 bg-primary/5 rounded border border-primary/20 text-center text-xs text-primary font-bold">
              Direct Cost = Sum of All Sessional Milestones
            </div>
          </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 3: Overheads & Contract Loadings
// ============================================================================
export const Slide3: React.FC = () => (
  <TwoColumnLayout
    title="1.2 Contractual Additions & Profit Allocations"
    bgVariant="default"
    leftWidth="45%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="Unmeasured Fiscal Risks">
          Direct field take-offs capture exactly what is built, but ignore macro expenses such as administrative setups, water/power tools, minor design variances, and contractor overhead logistics.
        </SlideParagraph>
        
        <ClickReveal at={1}>
          <SlideParagraph variant="plain">
            Quantity surveyors balance direct ledger fields by layering standard compound percentages defined by the PWD framework.
          </SlideParagraph>
        </ClickReveal>
      </div>
    }
    rightContent={
      <div className="space-y-4 flex flex-col justify-center h-full">
        <ClickReveal at={2} preset="fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/40 border border-border rounded-xl text-center">
              <span className="block text-3xl font-bold text-primary tracking-tight">+ 3.0% to 5.0%</span>
              <span className="text-xs text-muted-foreground font-semibold mt-1 block">Contingencies</span>
              <span className="text-[10px] text-muted-foreground block italic mt-1">(Unforeseen Soil/Site Risks)</span>
            </div>
            <div className="p-4 bg-muted/40 border border-border rounded-xl text-center">
              <span className="block text-3xl font-bold text-amber-600 dark:text-amber-500 tracking-tight">+ 10.0%</span>
              <span className="text-xs text-muted-foreground font-semibold mt-1 block">Contractor Profit Margin</span>
              <span className="text-[10px] text-muted-foreground block italic mt-1">(Baseline Equipment/Overhead)</span>
            </div>
          </div>
        </ClickReveal>
        
        <ClickReveal at={3}>
          <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-[11px] font-mono text-center text-muted-foreground">
            Gross Estimated Sum = (Direct Materials Cost + Overheads) × 1.10
          </div>
        </ClickReveal>
      </div>
    }
  />
);

// ============================================================================
// Slide 4: Statutory NBR Tax Splicing
// ============================================================================
export const Slide4: React.FC = () => (
  <FullWidthLayout
    title="1.3 Statutory Deductions: NBR Split Matrix"
    bgVariant="default"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        <div className="space-y-4">
          <SlideParagraph title="Fiscal Deductions at Source">
            Under public procurement models in Bangladesh, government billing frameworks demand source deductions based on the National Board of Revenue (NBR) legal codex.
          </SlideParagraph>
          
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "Value Added Tax (VAT Base)", 
                text: "Standardized at a flat 7.5% margin applied directly to certified billing gross balances." 
              },
              { 
                title: "Advance Income Tax (AIT Base)", 
                text: "Withheld at a tiered factor from 5.0% to 7.0% depending on compound contract brackets." 
              }
            ]}
          />
        </div>

        <ClickReveal at={3} preset="up">
          <div className="h-full flex flex-col justify-center">
            <SlideCallout variant="danger" title="The Net Cash Flow Divergence">
              <p className="text-sm mb-3">
                A common novice surveyor failure is assuming the contractor pockets the certified check value layout. Tax withholding impacts net liquid cash limits on site:
              </p>
              <div className="p-4 bg-background border border-destructive/20 rounded-xl space-y-1 font-mono text-xs">
                <p>• Gross Progress Valuation = <span className="font-bold text-foreground">100.0%</span></p>
                <p className="text-red-500 font-medium">• Source VAT Reduction = <ClickHighlight at={4} variant="strike" className="text-red-500 font-bold">- 7.5%</ClickHighlight></p>
                <p className="text-red-500 font-medium">• Source AIT Withholding = <ClickHighlight at={4} variant="strike" className="text-red-500 font-bold">- 5.0%</ClickHighlight></p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold border-t pt-2 mt-2 text-sm">
                  👉 Contractor Net Liquid Cash Outflow = 87.5%
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 italic">
                * Strategic Rule: These statutory margins must remain isolated from direct material cost parameters within billing calculations.
              </p>
            </SlideCallout>
          </div>
        </ClickReveal>
      </div>
    </FullWidthLayout>
  );

// ============================================================================
// Slide 5: Section Divider (Continuing sequentially from Slide 4)
// ============================================================================
export const Slide5: React.FC = () => (
  <TopicDividerLayout
    topicNumber="02"
    title="Interim Progress Payments"
    subtitle="Measurement Book Reconciliation, Progress Abstracts, and Retainage Valuation Rules"
  />
);
