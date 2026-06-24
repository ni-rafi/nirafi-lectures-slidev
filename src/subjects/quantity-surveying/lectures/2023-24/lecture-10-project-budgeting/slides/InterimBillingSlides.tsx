import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ProgressIPCSandbox } from '../../../../features/calculators/ProgressIPCSandbox';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  ClickHighlight 
} from '@/features/presentation/components/elements';

// ============================================================================
// Slide 6: The Measurement Book (MB) Validation & Progress Abstract
// ============================================================================
export const Slide6: React.FC = () => (
  <TwoColumnLayout
    title="2.1 The Measurement Book Progress Abstract"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="From Estimating to Auditing">
          Contractor payments are never issued against theoretical Bill of Quantities (BoQ) parameters. They require physical field audits recorded dynamically in the official **Measurement Book (MB)**.
        </SlideParagraph>
        
        <SlideList
          revealMode="each-click"
          items={[
            { 
              title: "The Running Abstract Log", 
              text: "A progress abstract tracks: Total Quantity Executed to Date (-) Quantity Certified in Previous Bill (=) Net Quantity of Current Period." 
            },
            { 
              title: "The 2-Decimal Record Standard", 
              text: "As established in local PWD rules, all direct physical field dimensions (L, B, H) must be input strictly to 2 decimal places." 
            },
            { 
              title: "Deviation Limit Thresholds", 
              text: "If field measurements surpass the contract line item envelope, it triggers a formal Variation Order (VO) framework." 
            }
          ]}
        />
      </div>
    }
    rightContent={
      <ClickReveal at={3} preset="scale">
        <div className="h-full flex flex-col justify-center">
          <SlideCallout variant="info" title="The Progress Running Matrix">
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              The surveyor uses this logical stack to generate an Interim Progress abstract entry:
            </p>
            <div className="p-4 bg-background border border-border rounded-xl space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b pb-1">
                <span>Gross Value to Date:</span>
                <span className="font-bold text-primary">BDT 4,500,000</span>
              </div>
              <div className="flex justify-between border-b pb-1 text-muted-foreground">
                <span>(-) Previous Certified:</span>
                <span>BDT 3,000,000</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                <span>= Current Gross Claim:</span>
                <span>BDT 1,500,000</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 italic text-center">
              * Verification Rule: Net Current Claim represents the baseline value prior to recovery penalties.
            </p>
          </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 7: Security Retainage & Mobilization Amortization
// ============================================================================
export const Slide7: React.FC = () => (
  <FullWidthLayout
    title="2.2 Payment Deductions: Retainage & Advance Recovery"
    bgVariant="default"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        <div className="space-y-4">
          <SlideParagraph title="Contractual Protection Clutches">
            Before an Interim Payment Certificate (IPC) is signed for cash distribution, the gross period claim must face statutory contract security deductions.
          </SlideParagraph>
          
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "Retention Money (Retainage)", 
                text: "Universally fixed at 10.0% of the gross certified value. Held back by the client to guarantee quality and fix defects post-completion." 
              },
              { 
                title: "Mobilization Advance Recovery", 
                text: "Amortized systematically across intermediate bill runs (e.g., recovering 15.0% of the period gross value) to clear initial cash advances." 
              },
              { 
                title: "Material-on-Site (MOS) Credits", 
                text: "Allows up to 75% payment for non-perishable secured materials safely stored on site but not yet cast into the structure." 
              }
            ]}
          />
        </div>

        <ClickReveal at={3} preset="up">
          <div className="h-full flex flex-col justify-center">
            <SlideCallout variant="danger" title="The Unified IPC Ledger Equation">
              <p className="text-sm mb-3 text-muted-foreground">
                The final check value issued to a contractor unifies progress metrics with recovery penalties:
              </p>
              
              <div className="text-lg font-mono text-center text-secondary-foreground bg-muted/40 p-4 rounded-xl border border-border leading-relaxed">
                Net Pay = Current Gross - <ClickHighlight at={4} variant="paint" className="text-red-500 font-bold">Retention (10%)</ClickHighlight> - Mobilization Recovery + MOS Credit
              </div>

              <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed border-t border-border pt-2 italic">
                <strong>Worked Example:</strong> Gross current work abstract yields BDT 1,000,000. Deducting 10% retention (BDT 100,000) and 15% mobilization recovery (BDT 150,000) leaves a net payment check of BDT 750,000 prior to NBR source taxes.
              </p>
            </SlideCallout>
          </div>
        </ClickReveal>
      </div>
    </FullWidthLayout>
);

// ============================================================================
// Slide 8: Progressive IPC Invoice Sandbox
// ============================================================================
export const Slide8: React.FC = () => (
  <FullWidthLayout
    title="2.3 Live Sessional Billing & Progress IPC Simulator"
    bgVariant="default"
  >
    <div className="w-full flex-1 flex flex-col justify-between overflow-hidden">
      <ProgressIPCSandbox />
    </div>
  </FullWidthLayout>
);

// ============================================================================
// Slide 9: Section Divider (Continuing sequence from Slide 8)
// ============================================================================
export const Slide9: React.FC = () => (
  <TopicDividerLayout
    topicNumber="03"
    title="Project Defense & Final Accountability"
    subtitle="Evaluating Variance, Sessional Deliverables, and Capstone Oral Examination"
  />
);
