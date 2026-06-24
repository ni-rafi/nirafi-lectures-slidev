import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ThankYouLayout } from '@/shared/layouts/ThankYouLayout';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  ClickHighlight 
} from '@/features/presentation/components/elements';

// ============================================================================
// Slide 10: Budget Variance Analysis & Defense
// ============================================================================
export const Slide10: React.FC = () => (
  <TwoColumnLayout
    title="3.1 Evaluating Project Budget Variance"
    bgVariant="default"
    leftWidth="52%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="Defending the Bottom Line">
          The final project defense forces students to transition from simple data recorders to defensive project managers, reconciling initial rough approximations against their detailed take-offs.
        </SlideParagraph>
        
        <SlideList
          revealMode="each-click"
          items={[
            { 
              title: "Variance Identification", 
              text: "Quantifying differences between preliminary plinth-area approximations and the final detailed Bill of Quantities (BoQ) parameters." 
            },
            { 
              title: "Justification Matrix", 
              text: "Defending cost shifts by citing architectural revisions, foundation excavation depth variances, or structural steel details." 
            },
            { 
              title: "Arithmetical Integrity", 
              text: "Ensuring zero compounding math errors across thousands of spreadsheet nodes before signing off on final submittals." 
            }
          ]}
        />
      </div>
    }
    rightContent={
      <ClickReveal at={3} preset="fade-in">
        <div className="h-full flex flex-col justify-center">
          <SlideCallout variant="warning" title="Variance Equation Check">
            <p className="mb-2 text-sm text-muted-foreground font-semibold">
              Engineers track cost inflation or deflation metrics using standard project variance percentages:
            </p>
            <div className="text-xl font-mono text-center text-amber-600 dark:text-amber-500 my-3 bg-muted/20 p-4 rounded-xl border border-border">
              Variance % = [ (Detailed - Preliminary) / Preliminary ] × 100
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center italic">
              * Professional Threshold: Sessional variances exceeding <ClickHighlight at={4} variant="bold" className="text-red-500">±10%</ClickHighlight> demand rigorous item-by-item structural audit justification.
            </p>
          </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 11: Sessional Capstone & Technical Viva Voce
// ============================================================================
export const Slide11: React.FC = () => (
  <FullWidthLayout
    title="3.2 The Final Technical Viva Voce"
    bgVariant="default"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        <div className="space-y-4">
          <SlideParagraph title="Individual Accountability">
            While sessional dossiers are compiled in collaborative groups, the final defense enforces strict individual grading through an intensive oral board assessment.
          </SlideParagraph>
          
          <SlideCallout variant="success" title="Core Examination Benchmarks">
            <ul className="space-y-2 text-xs list-disc pl-5 leading-relaxed">
              <li><strong>Blueprint Interpretation:</strong> Instantly locating slab thicknesses, beam drop offsets, and roadway layers.</li>
              <li><strong>Deduction Competence:</strong> Justifying core voids, lintel-beam overlaps, and drainage internal hydraulic deductions.</li>
              <li><strong>PWD SoR Fluency:</strong> Navigating rate codes, bulk excavation volume steps, and trade boundaries.</li>
            </ul>
          </SlideCallout>
        </div>

        <ClickReveal at={1} preset="up">
          <div className="h-full flex flex-col justify-center space-y-4">
            <SlideParagraph title="Studio Final Deliverable" variant="plain">
              Teams must assemble their entire sessional portfolio into a singular, cohesive financial dossier.
            </SlideParagraph>
            
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
              <span className="block text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Final Submission</span>
              <span className="text-primary font-mono font-bold text-xl block">The Consolidated Project Cost Portfolio</span>
              <span className="text-xs text-muted-foreground block mt-2 italic">Includes: Complete Substructure, Superstructure, MEP, Infrastructure, and Mock Interim Payment Certificate (IPC).</span>
            </div>
          </div>
        </ClickReveal>
      </div>
    </FullWidthLayout>
);

// ============================================================================
// Slide 12: Quiz Slide
// ============================================================================
export const Slide12: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      'Calculate the contractor Net Payable Check amount (in BDT) for an IPC, given: Gross Certified Claim = {G} BDT; Deductions for Security Retention = 10.0%, Mobilization Advance Amortization = 15.0%, Source VAT = 7.5%, and AIT = 5.0%; and Material-on-Site (MOS) secured credit = 30,000.00 BDT. Round your final answer to exactly 3 decimal places.',
      { G: parameterResolver.lastDigit(1000000, 10000, 'BDT') },
      reg
    );
    return Object.assign(qFn, {
      formula: 'Net Payout = Gross × (1 - 0.10 - 0.15 - 0.075 - 0.05) + 30,000.00'
    });
  }, []);

  return (
    <FullWidthLayout title="Progress Payment Calculation Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec10_q1"
          questionText={questionText}
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 13: Thank You / Conclusion
// ============================================================================
export const Slide13: React.FC = () => (
  <ThankYouLayout
    title="Thank You"
    subtitle="Best of luck defending your sessional quantity surveying portfolios in the final viva board!"
  />
);
