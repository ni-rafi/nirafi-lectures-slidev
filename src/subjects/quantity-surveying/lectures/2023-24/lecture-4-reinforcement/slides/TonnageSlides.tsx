import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideCallout, 
  ClickReveal,
  ClickHighlight
} from '@/features/presentation/components/elements';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';
import { TonnageSandbox, RebarBbsLedgerSandbox, PwdWeightDiscrepancySandbox } from '@/subjects/quantity-surveying/features';

// ============================================================================
// Slide 10: Section Title Deck
// ============================================================================
export const Slide10: React.FC = () => (
  <TopicDividerLayout
    topicNumber="04"
    title="Tonnage Conversion & BoQ Integration"
    subtitle="From Linear Lengths to Steel Weight, Allowances, and Studio Practice"
  />
);

// ============================================================================
// Slide 11: The Weight Conversion Formula
// ============================================================================
export const Slide11: React.FC = () => (
  <TwoColumnLayout
    title="4.1 The Core Steel Weight Formula"
    bgVariant="default"
    leftWidth="45%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="Why Convert?">
          As quantity surveyors, we measure rebar off the drawings in linear meters. However, steel is procured, transported, and priced by the <ClickHighlight at={1} variant="bold" className="text-blue-500">Kilogram (kg) or Metric Ton</ClickHighlight>.
        </SlideParagraph>
        
        <ClickReveal at={2}>
          <SlideParagraph variant="plain">
            We must mathematically convert our total tracked length into a final weight.
          </SlideParagraph>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={3} preset="up">
        <div className="h-full flex flex-col justify-center">
           <SlideCallout variant="success" title="The Universal Steel Formula">
             <p className="mb-4 text-xs text-center leading-relaxed">To find the weight of 1 meter of steel bar in kg:</p>
             <div className="text-4xl font-black text-center text-primary my-4 bg-muted/30 p-5 rounded-xl border border-primary/20 font-mono">
               W = D² / 162
             </div>
             <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
               <p>Where:</p>
               <ul className="list-disc pl-5 space-y-1">
                 <li><strong>W</strong> = Weight in kg per linear meter (kg/m)</li>
                 <li><strong>D</strong> = Diameter of the rebar in <strong>millimeters (mm)</strong></li>
               </ul>
             </div>
           </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 11B: Weight Conversion Sandbox
// ============================================================================
export const Slide11B: React.FC = () => (
  <TonnageSandbox />
);

// ============================================================================
// Slide 12: Standard Allowances & Studio Briefing
// ============================================================================
export const Slide12: React.FC = () => (
  <TwoColumnLayout
    title="4.2 Allowances & Studio Directive"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <div className="space-y-6">
        <SlideParagraph title="Industry Standard Allowances">
          A Bar Bending Schedule calculates the theoretical net weight. To finalize the BoQ, you must add practical site allowances.
        </SlideParagraph>

        <ClickReveal at={1}>
           <div className="grid grid-cols-2 gap-4">
              <SlideCallout variant="warning" title="Binding Wire">
                <div className="text-xl font-bold text-center text-amber-500 font-mono">
                  1.0% - 1.5%
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-1">of total rebar weight</p>
              </SlideCallout>
              
              <SlideCallout variant="danger" title="Cutting Wastage">
                <div className="text-xl font-bold text-center text-red-500 font-mono">
                  3.0% - 5.0%
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-1">added to procurement list</p>
              </SlideCallout>
           </div>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={2} preset="fade-in">
        <div className="h-full flex flex-col justify-center">
           <SlideCallout variant="info" title="📋 Lab Report 4: Studio Directive">
             <div className="space-y-3 text-xs leading-relaxed">
               <p><strong>The Task:</strong> Prepare a complete Bar Bending Schedule (BBS) for the continuous ground floor beam (Grid A-C) on your assigned structural drawings.</p>
               <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                 <li>Track all main longitudinal bars (apply the 12m lap rule if necessary).</li>
                 <li>Calculate the number and total length of stirrups (apply standard clear cover).</li>
                 <li>Apply the <code>D²/162</code> formula to convert all lengths to Kg.</li>
                 <li>Sum the total tonnage and apply a 1% binding wire allowance.</li>
               </ul>
               <p className="font-bold text-primary text-center mt-3 text-xs">Cross-check spacing math with your team!</p>
             </div>
           </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 11C: Quiz 4 (Tonnage Conversion - Numeric)
// ============================================================================
export const Slide11C: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      'Calculate the total weight in kilograms of exactly {N} pieces of 20 mm diameter longitudinal rebars, each having a cut length of 8.500 m. Round your final answer to the nearest whole number (integer) value.',
      { N: parameterResolver.lastDigit(15, 1) },
      reg
    );
    return Object.assign(qFn, {
      formula: 'Calculate the total weight in kilograms of exactly (15 + [last digit]) pieces of 20 mm diameter longitudinal rebars, each having a cut length of 8.500 m. Round your final answer to the nearest whole number (integer) value.'
    });
  }, []);

  return (
    <FullWidthLayout title="Tonnage Conversion Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec4_q4"
          questionText={questionText}
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide: BBS Tabular Ledger Format
// ============================================================================
export const Slide_RebarBbsLedger: React.FC = () => (
  <RebarBbsLedgerSandbox />
);

// ============================================================================
// Slide: PWD Weight Discrepancies
// ============================================================================
export const Slide_PwdWeightDiscrepancy: React.FC = () => (
  <PwdWeightDiscrepancySandbox />
);
