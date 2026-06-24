import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  ClickSyncedTabs
} from '@/features/presentation/components/elements';
import { LectureCover } from '@/shared/layouts/LectureCover';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';
import { ClearCoverSandbox, SteelMacroBudgetSandbox, HookGeometryDrawing } from '@/subjects/quantity-surveying/features';

// ============================================================================
// Slide 1: Main Lecture Cover (TitleV2Layout representation)
// ============================================================================
export const Slide1: React.FC<SlideProps> = (props) => (
  <LectureCover {...props} />
);

// ============================================================================
// Slide 1B: Section 1 Title Divider
// ============================================================================
export const Slide1B: React.FC = () => (
  <TopicDividerLayout
    topicNumber="01"
    title="Fundamentals of Steel Reinforcement"
    subtitle="Rebar Basics, Standard Nomenclature, and Clear Cover Rules"
  />
);


// ============================================================================
// Slide 2: Rebar Basics & The 12-Meter Rule
// ============================================================================
export const Slide2: React.FC = () => (
  <TwoColumnLayout
    title="1.1 Rebar Nomenclature & Commercial Standards"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph variant="default" title="Standard Grades & Nomenclature">
          Reinforcement steel is specified by its yield strength. When reading structural drawings, you must identify both the size and the grade.
        </SlideParagraph>
        
        <SlideList
          revealMode="each-click"
          items={[
            { 
              title: "Common Yield Grades", 
              text: "Grade 40, Grade 60, Grade 75 (Higher grade = higher tensile yield strength)." 
            },
            { 
              title: "Diameter Tracking", 
              text: "Recorded in millimeters (e.g., 10mm, 12mm, 16mm, 20mm, 25mm)." 
            },
            { 
              title: "Local Market Translation", 
              text: "In the Bangladesh field, labor uses 'Suta'. (1 Suta = 1/8 inch ≈ 3.175mm). E.g., 4 Suta = 12mm bar." 
            }
          ]}
        />
      </div>
    }
    rightContent={
      <ClickReveal at={1} preset="fade-in">
        <div className="flex flex-col h-full justify-center">
          <SlideCallout variant="warning" title="🚨 The Commercial Length Constraint">
            <p className="mb-4 text-xs leading-relaxed">
              Steel bars are commercially manufactured and transported to the site in standard fixed lengths of:
            </p>
            <div className="text-4xl font-black text-center text-amber-600 dark:text-amber-500 my-3 font-mono">
              12 Meters <span className="text-lg text-muted-foreground font-normal">(40 ft)</span>
            </div>
            <p className="text-xs leading-relaxed">
              <strong>Golden Rule of Estimation:</strong> If any structural span (like a continuous tie beam) exceeds 12 meters, you <em>must</em> mathematically add a <strong>Lap Length</strong> to splice two bars together.
            </p>
          </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 3: Clear Cover Rules
// ============================================================================
export const Slide3: React.FC = () => (
  <TwoColumnLayout
    title="1.2 Standard Clear Cover Rules"
    bgVariant="default"
    leftWidth="45%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="What is Clear Cover?">
          The physical distance between the outer surface of the concrete and the outermost edge of the reinforcement steel (usually the stirrup/tie).
        </SlideParagraph>
        
        <ClickReveal at={1}>
          <SlideCallout variant="info" title="Structural Purpose">
            Provides crucial fire resistance and protects the steel core from groundwater and atmospheric corrosion.
          </SlideCallout>
        </ClickReveal>
      </div>
    }
    rightContent={
      <ClickReveal at={2} preset="up">
        <SlideParagraph title="Standard Cover Allowances (Code Minimums)" variant="plain">
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "Footings & Foundations", 
                text: <span className="text-sm font-bold text-primary">50 mm - 75 mm</span>,
                icon: "Layers"
              },
              { 
                title: "Columns (Verticals)", 
                text: <span className="text-sm font-bold text-primary">40 mm</span> 
              },
              { 
                title: "Beams (Horizontals)", 
                text: <span className="text-sm font-bold text-primary">25 mm</span> 
              },
              { 
                title: "Floor Slabs", 
                text: <span className="text-sm font-bold text-primary">15 mm - 20 mm</span>
              }
            ]}
          />
        </SlideParagraph>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 3B: Clear Cover Sandbox
// ============================================================================
export const Slide3B: React.FC = () => (
  <ClearCoverSandbox />
);

// ============================================================================
// Slide 3C: Quiz 1 (Clear Cover MCQ)
// ============================================================================
export const Slide3C: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => parameterResolver.resolveTemplate(
      'A structural column of size {W} has a clear cover of 40 mm. It is reinforced with longitudinal bars of 20 mm diameter and 10 mm stirrups. If there are exactly 2 longitudinal bars on one face, what is the center-to-center distance between them?',
      { W: parameterResolver.lastDigit(400, 10, 'x400 mm') },
      reg
    );
    return Object.assign(qFn, {
      formula: 'A structural column of size (400 + [last digit] × 10)x400 mm has a clear cover of 40 mm. It is reinforced with longitudinal bars of 20 mm diameter and 10 mm stirrups. If there are exactly 2 longitudinal bars on one face, what is the center-to-center distance between them?'
    });
  }, []);

  const options = React.useMemo(() => {
    const optFn = (reg: string) => {
      const correctVal = 400 + parameterResolver.getLastDigit(reg) * 10 - 120;
      return [
        `${correctVal + 40} mm`,
        `${correctVal} mm`,
        `${correctVal + 20} mm`,
        `${correctVal - 20} mm`
      ];
    };
    return Object.assign(optFn, {
      formula: ['W - 80 mm', 'W - 120 mm (Correct)', 'W - 100 mm', 'W - 140 mm']
    });
  }, []);

  return (
    <FullWidthLayout title="Clear Cover Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec4_q1"
          questionText={questionText}
          quizType="multiple-choice"
          options={options}
        />
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide: Preliminary Steel Estimation (Thumb Rules)
// ============================================================================
export const Slide_ThumbRules: React.FC = () => (
  <SteelMacroBudgetSandbox />
);

// ============================================================================
// Slide: Reinforcement Types: Plain vs. Deformed Bars
// ============================================================================
export const Slide_BarTypes: React.FC = () => {
  const tabItems = [
    {
      title: 'Plain Mild Steel Round Bars',
      description: (
        <div className="space-y-4">
          <SlideParagraph title="Standard MS Round Bars (Grade 40)">
            Smooth cylindrical shape without surface patterns. Primarily used in older structures or light reinforcement elements (like stirrups/ties and minor masonry walls).
          </SlideParagraph>
          <SlideList
            items={[
              { title: "Bonding Mechanism", text: "Relies entirely on chemical adhesion and mechanical hook anchors at the ends to prevent slipping." },
              { title: "Standard Rule", text: "Because bond strength is low, every plain round bar must be strictly anchored with a standard 180° hook at both ends." },
              { title: "Tensile Strength", text: "Typically Grade 40 (yield strength of 250 MPa or 40,000 psi)." }
            ]}
          />
        </div>
      ),
      rightContent: (
        <div className="w-full flex items-center justify-center">
          <HookGeometryDrawing
            barType="plain"
            angle={180}
            diameterMm={12}
            multiplier={9}
            additionM={0.216}
          />
        </div>
      )
    },
    {
      title: 'High-Strength Deformed Bars',
      description: (
        <div className="space-y-4">
          <SlideParagraph title="Deformed Rebar (Grade 60 / 75 / 500W)">
            Features raised ridges, ribs, or lugs rolled onto the surface to increase the contact area and bond capacity with concrete.
          </SlideParagraph>
          <SlideList
            items={[
              { title: "Mechanical Interlocking", text: "Lugs physically lock into the surrounding concrete, preventing relative movement." },
              { title: "Estimation Advantage", text: "Much higher bond strength. Allows using straight splice joints or standard 90°/135° bends instead of requiring full 180° hooks at all ends." },
              { title: "Tensile Strength", text: "Commonly Grade 60 (400 MPa) or Grade 75 (500 MPa / 500W)." }
            ]}
          />
        </div>
      ),
      rightContent: (
        <div className="w-full flex items-center justify-center">
          <HookGeometryDrawing
            barType="deformed"
            angle={90}
            diameterMm={12}
            multiplier={12}
            additionM={0.144}
          />
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Reinforcement Types: Plain vs. Deformed Bars"
      leftTitle="Material Properties"
      rightTitle="Hook Mechanics"
      items={tabItems}
      leftWidth="52%"
    />
  );
};
