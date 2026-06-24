import React from 'react';
import { TitleV2Layout } from '@/shared/layouts/TitleV2Layout';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import {
  SlideParagraph,
  SlideList,
  SlideCallout,
  ClickReveal,
  ClickHighlight,
  LatexFormula
} from '@/features/presentation/components/elements';
import {
  RoadwaySectionDrawing,
  RoadwayAreaSandbox,
  EarthworkProfileSandbox
} from '@/subjects/quantity-surveying/features';

// Slide 1: Cover Slide
export const Slide1: React.FC<SlideProps> = () => (
  <TitleV2Layout
    courseCode="CE 204"
    courseTitle="Quantity Surveying & Valuation"
    subtitle="Estimation of Roadway: Earthwork"
    yearSemester="2nd Year/1st Semester"
    creditHours="3.0"
    usnCode="CO-QS-204"
    session="2023-2024"
    lectureNumber={8}
  />
);

// Slide 2: Section 1 Divider
export const Slide2: React.FC = () => (
  <TopicDividerLayout
    topicNumber="01"
    title="Roadway Geometric Mechanics"
    description="Cross-Sections, Slopes, Mathematical Methods, and Profile Shaders"
  />
);

// Slide 3: Cross-Section Profiles (Concept)
export const Slide3: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  return (
    <TwoColumnLayout
      title="1.1 Roadway Cross-Section Anatomy"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="space-y-3">
          <SlideParagraph title="Standard Trapezoidal Formations">
            Roadways are constructed as elevated embankments (filling) or excavated trenches (cutting). The cross-section forms a trapezoid.
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "Formation Width (B)",
                text: <span>The horizontal flat road carriage platform, built at sub-grade level. Billed in <ClickHighlight variant="paint" at={1}>meters (m)</ClickHighlight>.</span>
              },
              {
                title: "Side Slopes (s:1)",
                text: <span>Stabilizing angled borders ($s$ horizontal to 1 vertical) that prevent earth collapse or erosion. Typically <ClickHighlight variant="paint" at={2}>2:1 for embankments</ClickHighlight> and 1.5:1 for cuts.</span>
              },
              {
                title: "Excavation/Fill Height (d)",
                text: <span>Depth of cut or height of fill measured from Natural Ground Level (NGL) to target road bed level, denoted as <ClickHighlight variant="paint" at={3}>d (m)</ClickHighlight>.</span>
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between space-y-2">
          <RoadwaySectionDrawing B={10} s={2} d={1.5} currentClick={currentClick} className="flex-1" />
          <ClickReveal at={3} preset="up">
            <SlideCallout variant="info" title="Cross-Sectional Area Formula" className="py-2">
              <div className="text-base font-mono text-center text-indigo-600 dark:text-indigo-400 bg-muted/40 p-2 rounded-xl border border-indigo-500/20 font-bold">
                A = B·d + s·d²
              </div>
              <span className="text-[9px] text-muted-foreground block mt-1 text-center font-mono">Central rectangular box (B·d) + two triangular side slopes (s·d²)</span>
            </SlideCallout>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 4: Area Sandbox
export const Slide4: React.FC = () => (
  <FullWidthLayout title="1.2 Cross-Section Area Sandbox" bgVariant="default">
    <RoadwayAreaSandbox />
  </FullWidthLayout>
);

// Slide 5: Mathematical Estimating Triad
export const Slide5: React.FC = () => {
  return (
    <TwoColumnLayout
      title="1.3 Earthwork Mathematical Triad"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-3">
          <SlideParagraph title="Standard Estimation Methods">
            Depending on longitudinal variation, three standard formulas from B.N. Dutta Chapter 9 are used to estimate volume between chainages.
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "Mid-Sectional Area Method",
                text: <span>Calculates cross-sectional area at mid-depth ($d_m$) between stations. Best for uniform profiles: <ClickHighlight variant="paint" at={1}>A = B·d_m + s·d_m²</ClickHighlight>.</span>
              },
              {
                title: "Mean-Sectional Area Method",
                text: <span>Calculates areas $A_1, A_2$ at each end first, then takes their arithmetic mean: <ClickHighlight variant="paint" at={2}>A_mean = (A_1 + A_2) / 2</ClickHighlight>.</span>
              },
              {
                title: "Prismoidal Formula",
                text: <span>Simpson's rule for earthwork. Delivers exact mathematical volumes when slopes curve: <ClickHighlight variant="paint" at={3}>V = (L / 6)(A_1 + 4A_mid + A_2)</ClickHighlight>.</span>
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-center space-y-4">
          <ClickReveal at={1} preset="up">
            <div className="p-3 bg-muted/40 border border-border/40 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase">Mid-Sectional Method</span>
              <LatexFormula math="V = (B \cdot d_m + s \cdot d_m^2) \cdot L" block />
            </div>
          </ClickReveal>
          <ClickReveal at={2} preset="up">
            <div className="p-3 bg-muted/40 border border-border/40 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Mean-Sectional Method</span>
              <LatexFormula math="V = \frac{(B \cdot d_1 + s \cdot d_1^2) + (B \cdot d_2 + s \cdot d_2^2)}{2} \cdot L" block />
            </div>
          </ClickReveal>
          <ClickReveal at={3} preset="up">
            <div className="p-3 bg-muted/40 border border-border/40 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">Prismoidal Simpson's Method</span>
              <LatexFormula math="V = \frac{L}{6} \left[ A_1 + 4 \left( B \cdot d_m + s \cdot d_m^2 \right) + A_2 \right]" block />
            </div>
          </ClickReveal>
        </div>
      }
    />
  );
};

// Slide 6: Longitudinal Profile Sandbox
export const Slide6: React.FC = () => (
  <FullWidthLayout title="1.4 Longitudinal Cut & Fill Profile Sandbox" bgVariant="default">
    <EarthworkProfileSandbox />
  </FullWidthLayout>
);
