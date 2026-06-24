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
import { SteelSectionsDrawing } from '@/subjects/quantity-surveying/features/components/SteelSectionsDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { LectureCover } from '@/shared/layouts/LectureCover';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';

// ============================================================================
// Slide 1: Main Lecture Cover
// ============================================================================
export const Slide1: React.FC<SlideProps> = (props) => (
  <LectureCover {...props} />
);

// ============================================================================
// Slide 1B: Section 1 Cover
// ============================================================================
export const Slide1B: React.FC = () => (
  <TopicDividerLayout
    topicNumber="01"
    title="Fundamentals of Steel Measurement"
    subtitle="Standard Sections, Steel Tables, and Density Constants"
  />
);

// ============================================================================
// Slide 2: Standard Steel Sections & Nomenclature
// ============================================================================
export const Slide2: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  const sectionType = currentClick === 2 ? 'ISA' : currentClick === 3 ? 'ISMC' : currentClick >= 4 ? 'ISA' : 'ISMB';
  const depth = currentClick === 2 ? 100 : currentClick === 3 ? 150 : currentClick >= 4 ? 75 : 200;
  const width = currentClick === 2 ? 100 : currentClick === 3 ? 75 : currentClick >= 4 ? 50 : 100;
  const flangeT = currentClick >= 4 ? 8 : 10;
  const webT = currentClick === 2 ? 10 : currentClick === 3 ? 6.5 : currentClick >= 4 ? 8 : 6;

  return (
    <TwoColumnLayout
      title="1.1 Standard Structural Steel Sections"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-4">
          <SlideParagraph title="Reading Steel Blueprints">
            Unlike concrete, which is poured into custom geometric shapes on site, structural steel is pre-manufactured in standard, continuous shapes. You must decode the drawing abbreviations accurately.
          </SlideParagraph>
          
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "ISMB / RSJ (I-Beams)", 
                text: "Indian Standard Medium Weight Beam / Rolled Steel Joist. Used for main horizontal spans." 
              },
              { 
                title: "ISA (Angles)", 
                text: "Indian Standard Angle (Equal or Unequal). Heavily used in roof trusses, bracing, and cleats." 
              },
              { 
                title: "ISMC (Channels)", 
                text: "Indian Standard Medium Weight Channel. Typically used for roof purlins." 
              }
            ]}
          />

          <ClickReveal at={4} preset="fade-in">
            <SlideCallout variant="info" title="Nomenclature Decoding Example">
              <p className="mb-2 text-xs">If a blueprint points to a roof truss tie and labels it:</p>
              <div className="text-2xl font-bold text-center text-primary my-2 bg-muted/20 p-2.5 rounded-lg">
                2 ISA 75 × 50 × 8
              </div>
              <ul className="text-[11px] text-muted-foreground space-y-1 pl-4 border-l-2 border-primary">
                <li><strong>2</strong> = Two separate angle members placed back-to-back.</li>
                <li><strong>ISA</strong> = Indian Standard Angle (Unequal legs).</li>
                <li><strong>75 × 50</strong> = Leg lengths in mm.</li>
                <li><strong>8</strong> = Thickness of the steel legs in mm.</li>
              </ul>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-center">
          <SteelSectionsDrawing
            sectionType={sectionType}
            depthMm={depth}
            widthMm={width}
            flangeThicknessMm={flangeT}
            webThicknessMm={webT}
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 3: The Linear-to-Weight Rule
// ============================================================================
export const Slide3: React.FC = () => (
  <TwoColumnLayout
    title="1.2 The Linear-to-Weight Rule"
    bgVariant="default"
    leftWidth="45%"
    leftContent={
      <div className="space-y-6">
        <SlideParagraph title="The Core Methodology">
          You <ClickHighlight at={1} variant="strike" className="text-red-500">DO NOT calculate volumes</ClickHighlight> for standard structural steel frame elements. 
        </SlideParagraph>
        
        <ClickReveal at={2}>
          <SlideParagraph variant="plain">
            Instead, you measure the <ClickHighlight at={3} variant="bold" className="text-blue-500">Linear Length (in meters)</ClickHighlight> directly from the drawing, and multiply it by a standard unit weight found in an engineering <strong>Steel Table</strong>.
          </SlideParagraph>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={4} preset="up">
        <div className="h-full flex flex-col justify-center">
           <SlideCallout variant="success" title="The Structural Steel Equation">
             <p className="mb-4 text-center">Total Weight of a Standard Member:</p>
             <div className="text-4xl font-bold text-center text-primary my-4">
               W = L × w
             </div>
             <div className="space-y-2 text-sm text-muted-foreground">
               <ul className="list-disc pl-5">
                 <li><strong>W</strong> = Total Weight (kg)</li>
                 <li><strong>L</strong> = Linear length measured from drawing (m)</li>
                 <li><strong>w</strong> = Unit weight from the Steel Table (kg/m)</li>
               </ul>
             </div>
             
             <div className="mt-6 p-3 bg-background rounded-md text-xs border border-border">
               <em>Example: You measure a 5-meter ISMB 200 beam. The standard table states ISMB 200 weighs 25.4 kg/m. <br/><br/>Total Weight = 5m × 25.4 kg/m = 127 kg.</em>
             </div>
           </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 3B: Steel Section Sandbox
// ============================================================================
export const Slide3B: React.FC = () => {
  const [sectionType, setSectionType] = useUrlSyncedState<'ISMB' | 'ISA' | 'ISMC'>('steel_sec_type', 'ISMB');
  const [depth, setDepth] = useUrlSyncedState<number>('steel_sec_depth', 200);
  const [width, setWidth] = useUrlSyncedState<number>('steel_sec_width', 100);
  const [flangeT, setFlangeT] = useUrlSyncedState<number>('steel_sec_flange_t', 10);
  const [webT, setWebT] = useUrlSyncedState<number>('steel_sec_web_t', 6);

  // Let's assume a simplified unit weight estimation for visual showcase:
  // Area = (w * depth) + (if I-Beam: 2 * flangeT * width, etc.)
  let estUnitWeight = 0;
  if (sectionType === 'ISMB') {
    estUnitWeight = ((2 * width * flangeT + (depth - 2 * flangeT) * webT) * 7850) / 1000000;
  } else if (sectionType === 'ISA') {
    estUnitWeight = (((width + depth - flangeT) * flangeT) * 7850) / 1000000;
  } else {
    estUnitWeight = ((2 * width * flangeT + (depth - 2 * flangeT) * webT) * 7850) / 1000000;
  }

  return (
    <TwoColumnLayout
      title="1.3 Steel Section Dimension Sandbox"
      leftWidth="40%"
      leftContent={
        <InteractiveCard title="Section Control Panel">
          <div className="flex justify-center gap-2 mb-4">
            {(['ISMB', 'ISA', 'ISMC'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSectionType(type);
                  // Snap default values for better aesthetics
                  if (type === 'ISA') {
                    setDepth(100);
                    setWidth(100);
                    setFlangeT(10);
                    setWebT(10);
                  } else {
                    setDepth(200);
                    setWidth(100);
                    setFlangeT(10);
                    setWebT(6);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  sectionType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted border border-border/50 text-foreground hover:bg-muted/80'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <ParameterSlider
              label="Section Depth (h)"
              min={100}
              max={400}
              step={10}
              value={depth}
              onChange={setDepth}
              unit=" mm"
            />
            <ParameterSlider
              label="Flange Width (B)"
              min={50}
              max={250}
              step={10}
              value={width}
              onChange={setWidth}
              unit=" mm"
            />
            <ParameterSlider
              label="Flange Thickness (t_f)"
              min={5}
              max={25}
              step={1}
              value={flangeT}
              onChange={setFlangeT}
              unit=" mm"
            />
            {sectionType !== 'ISA' && (
              <ParameterSlider
                label="Web Thickness (t_w)"
                min={4}
                max={20}
                step={1}
                value={webT}
                onChange={setWebT}
                unit=" mm"
              />
            )}
          </div>

          <div className="border-t border-border/40 mt-4 pt-3">
            <CalculationOutput 
              title="Estimated Weight per Meter" 
              value={estUnitWeight.toFixed(2)} 
              unit="kg/m"
              subtitle="Calculated cross-section area multiplied by steel density"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <SteelSectionsDrawing
            sectionType={sectionType}
            depthMm={depth}
            widthMm={width}
            flangeThicknessMm={flangeT}
            webThicknessMm={webT}
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 3C: Quiz 1 (Steel Nomenclature MCQ)
// ============================================================================
export const Slide3C: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      "An angle member is designated on a roof truss detail drawing as '2 ISA 75 × 50 × {T}'. Select the correct interpretation of this structural nomenclature:",
      { T: parameterResolver.lastDigit(6, 2) },
      reg
    );
    return Object.assign(qFn, {
      formula: "An angle member is designated on a roof truss detail drawing as '2 ISA 75 × 50 × (6 + [last digit] × 2)'. Select the correct interpretation of this structural nomenclature:"
    });
  }, []);

  const options = React.useMemo(() => {
    const optFn = (reg: string) => {
      const thickness = 6 + parameterResolver.getLastDigit(reg) * 2;
      return [
        `1 Indian Standard Angle with legs of 75mm and 50mm, leg thickness ${thickness}mm, and 2m length`,
        `2 separate Indian Standard Angles, legs 75mm & 50mm, thickness ${thickness}mm`,
        `2 separate Indian Standard Channels with web depth 75mm, flange 50mm, and ${thickness}mm thickness`,
        `2 separate Indian Standard Angles with equal legs of 75mm, thickness 50mm, and length ${thickness}m`
      ];
    };
    return Object.assign(optFn, {
      formula: [
        '1 Indian Standard Angle with legs of 75mm and 50mm, leg thickness T mm, and 2m length',
        '2 separate Indian Standard Angles, legs 75mm & 50mm, thickness T mm',
        '2 separate Indian Standard Channels with web depth 75mm, flange 50mm, and T mm thickness',
        '2 separate Indian Standard Angles with equal legs of 75mm, thickness 50mm, and length T m'
      ]
    });
  }, []);

  return (
    <FullWidthLayout title="Standard Steel Nomenclature Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec5_q1"
          questionText={questionText}
          quizType="multiple-choice"
          options={options}
        />
      </div>
    </FullWidthLayout>
  );
};
