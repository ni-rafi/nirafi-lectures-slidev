import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  ClickHighlight,
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { RoofTrussLayoutDrawing } from '@/subjects/quantity-surveying/features/components/RoofTrussLayoutDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateRafterLengthInternal, calculatePurlinsCountInternal } from '@/subjects/quantity-surveying/cores';
import { QuizCardOrchestrator } from '@/features/quiz';

// ============================================================================
// Slide 7: Section 3 Cover
// ============================================================================
export const Slide7: React.FC = () => (
  <TopicDividerLayout
    topicNumber="03"
    title="Roof Trusses & Structural Framing"
    subtitle="Deconstructing Industrial Shed Components & Linear Layouts"
  />
);

// ============================================================================
// Slide 8: Truss Element Breakdown
// ============================================================================
export const Slide8: React.FC = () => (
  <TwoColumnLayout
    title="3.1 Pitched Roof Truss Take-Off Architecture"
    bgVariant="default"
    leftWidth="52%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="Deconstructing Geometry">
          A steel roof truss is a system of triangulated structural angle bars (typically back-to-back rolled angles). Surveyor take-offs must isolate each member based on structural profile types.
        </SlideParagraph>
        
        <SlideList
          revealMode="each-click"
          items={[
            { 
              title: "Principal Rafters (Top Chords)", 
              text: "The sloped outer members supporting the primary roof load. Length calculated using the slope incline or Pythagoras theorem." 
            },
            { 
              title: "Main Ties (Bottom Chords)", 
              text: "The horizontal member spanning column to column, resisting outer wall separation." 
            },
            { 
              title: "Struts & Slings (Web Members)", 
              text: "Internal vertical/diagonal structural diagonals distributing internal vector forces." 
            }
          ]}
        />
      </div>
    }
    rightContent={
      <ClickReveal at={3} preset="fade-in">
        <div className="h-full flex flex-col justify-center">
          <SlideCallout variant="info" title="Pythagoras Calculation Reminder">
            <p className="mb-2">If Truss Rise = <span className="text-primary font-bold">2.5m</span> and Half-Span = <span className="text-primary font-bold">6.0m</span>:</p>
            <div className="text-2xl font-mono text-center text-secondary-foreground my-2 bg-muted/30 p-3 rounded-md">
              Rafter Length = √(2.5² + 6.0²) = 6.500m
            </div>
            <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
              <strong>Surveyor Action:</strong> Total main rafter material list requirement per truss module layout is <span className="text-primary font-bold">6.500m × 2 sides = 13.000m</span> net line tracking.
            </p>
          </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 8B: Roof Truss & Purlin Sandbox
// ============================================================================
export const Slide8B: React.FC = () => {
  const [span, setSpan] = useUrlSyncedState<number>('truss_span', 8.0);
  const [rise, setRise] = useUrlSyncedState<number>('truss_rise', 2.0);
  const [spacing, setSpacing] = useUrlSyncedState<number>('truss_purlin_spacing', 1.2);

  const halfSpan = span / 2;
  const rafterLength = calculateRafterLengthInternal(rise, halfSpan);
  const purlinsPerSide = calculatePurlinsCountInternal(rafterLength, spacing);
  const totalPurlins = purlinsPerSide * 2;

  return (
    <TwoColumnLayout
      title="3.2 Roof Truss & Purlin Sandbox"
      leftWidth="40%"
      leftContent={
        <InteractiveCard title="Geometry Inputs">
          <div className="space-y-4">
            <ParameterSlider
              label="Truss Span"
              min={6.0}
              max={12.0}
              step={0.4}
              value={span}
              onChange={setSpan}
              unit=" m"
            />
            <ParameterSlider
              label="Truss Rise"
              min={1.0}
              max={4.0}
              step={0.1}
              value={rise}
              onChange={setRise}
              unit=" m"
            />
            <ParameterSlider
              label="Purlin Spacing"
              min={0.8}
              max={1.8}
              step={0.1}
              value={spacing}
              onChange={setSpacing}
              unit=" m"
            />
          </div>

          <div className="border-t border-border/40 mt-4 pt-3 space-y-2">
            <CalculationOutput 
              title="Rafter Sloped Length" 
              value={rafterLength.toFixed(3)} 
              unit="m"
              subtitle="Slope distance: √(rise² + (span/2)²)"
            />
            <CalculationOutput 
              title="Purlin Lines per Side" 
              value={purlinsPerSide.toString()} 
              unit="Lines"
              subtitle="floor(Rafter / Spacing) + 1"
            />
            <CalculationOutput 
              title="Total Roof Purlin Lines" 
              value={totalPurlins.toString()} 
              unit="Lines"
              subtitle="Double-sided roof coverage count"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <RoofTrussLayoutDrawing
            spanM={span}
            riseM={rise}
            purlinSpacingM={spacing}
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 8C: Quiz 3 (Truss Purlins - Numeric)
// ============================================================================
export const Slide8C: React.FC = () => {
  return (
    <FullWidthLayout title="Roof Truss & Purlin Lines Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec5_q3"
          questionText="A sloped roof truss has a rise of 2.800 m and a total span of 9.600 m. Purlins are spaced at exactly 1.200 m intervals along the sloped rafter. Calculate the total number of purlin lines required for the entire roof (both sides). (Apply the spacing offset rule: floor(Rafter Length / Spacing) + 1 per side)."
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 9: Longitudinal Spans & Splicing
// ============================================================================
export const Slide9: React.FC = () => (
  <TwoColumnLayout
    title="3.3 Longitudinal Elements & Spacing Laws"
    bgVariant="default"
    leftWidth="45%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="The Longitudinal Grid">
          Trusses are tied together horizontally along the entire length of the building via <ClickHighlight at={1} variant="bold" className="text-blue-500">Purlins</ClickHighlight> to carry the sheet panel roof cladding.
        </SlideParagraph>
        
        <ClickReveal at={2}>
          <SlideCallout variant="warning" title="Purlin Overlap & Cantilever Rule">
            Purlins do not break squarely flush at the truss centerlines. Standard textbook practice dictates accounting for mandatory overlap splices over truss frames or end eaves roof cantilevers (typically adding 150mm to 300mm per continuous joint).
          </SlideCallout>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={3} preset="up">
        <div className="h-full flex flex-col justify-center space-y-4">
          <SlideParagraph title="Purlin Spacing Enumeration Math" variant="plain">
            When drawings specify purlin intervals, apply the structural array item rule:
          </SlideParagraph>
          
          <div className="text-3xl font-bold text-center text-primary bg-muted/20 p-4 rounded-lg border border-border font-mono">
            Purlin Lines = (Rafter / Spacing) + 1
          </div>

          <div className="p-4 bg-background border border-border rounded-xl text-xs space-y-2">
            <p><strong>Worked Module Walkthrough:</strong></p>
            <p>• Sloped Rafter Profile Length = <span className="font-bold text-amber-500 font-mono">6.50m</span></p>
            <p>• Engineered Sheet Support Spacing Maximum = <span className="font-bold text-blue-500 font-mono">1.30m</span></p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 pt-1 border-t">
              👉 (6.50 / 1.30) + 1 = 6 Purlin Lines per sloped face (12 total lines per structural roof grid bay).
            </p>
          </div>
        </div>
      </ClickReveal>
    }
  />
);
