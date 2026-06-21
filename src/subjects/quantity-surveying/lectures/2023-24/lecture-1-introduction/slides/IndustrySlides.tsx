import React from 'react';
import { LectureCover } from '@/shared/layouts/LectureCover';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { SlideContent, ClickHighlight, InteractiveCard } from '@/features/presentation/components/elements';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';

// Slide 1: Cover Slide
export const Slide1: React.FC<SlideProps> = (props) => (
  <LectureCover {...props} />
);

// Slide 2: The Modern Quantity Surveyor
export const Slide2: React.FC = () => (
  <FullWidthLayout title="The Modern Quantity Surveyor" bgVariant="default">
    <SlideContent
      blocks={[
        {
          type: 'bullet',
          text: (
            <span>
              <strong>Evolution of the Profession:</strong> The profession's roots trace back to the Napoleonic Wars, replacing separate trade contracts with{' '}
              <ClickHighlight at={1} variant="paint">"contracting in gross"</ClickHighlight>, and was formally born after a schism with architects (RIBA) in 1834.
            </span>
          ),
        },
        {
          type: 'bullet',
          text: (
            <span>
              <strong>Core Attributes:</strong> A modern surveyor requires a comprehensive understanding of raw building materials, construction methods, and local trade customs, combined with{' '}
              <ClickHighlight at={2} variant="paint">strict mathematical accountability</ClickHighlight>.
            </span>
          ),
        },
        {
          type: 'bullet',
          text: (
            <span>
              <strong>Architectural Translation:</strong> A fundamental necessity is the ability to clearly describe the architect's requirements in proper,{' '}
              <ClickHighlight at={3} variant="paint">unambiguous technical language</ClickHighlight> to ensure the builder's estimator can quickly and accurately arrive at the estimated cost.
            </span>
          ),
        },
      ]}
    />
  </FullWidthLayout>
);

// Slide 3: Roles within the Industry
export const Slide3: React.FC = () => (
  <TwoColumnLayout
    title="Roles within the Industry"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <SlideContent
        blocks={[
          {
            type: 'paragraph',
            text: <strong>Private Practice (Consulting)</strong>,
            revealMode: 'none',
          },
          {
            type: 'bullet',
            text: 'Often structured as partnerships or Limited Liability Partnerships (LLPs) to protect members.',
          },
          {
            type: 'bullet',
            text: (
              <span>
                Focuses on representing the client's interests, offering{' '}
                <ClickHighlight at={1} variant="paint">independent cost advice</ClickHighlight>, and providing overarching Project Management services from inception to commissioning.
              </span>
            ),
          },
        ]}
      />
    }
    rightContent={
      <SlideContent
        blocks={[
          {
            type: 'paragraph',
            text: <strong>Commercial Management (Contracting)</strong>,
            revealMode: 'none',
          },
          {
            type: 'bullet',
            text: 'Involves working directly for contracting organizations on the supply side of the industry.',
          },
          {
            type: 'bullet',
            text: (
              <span>
                Focuses heavily on managing the{' '}
                <ClickHighlight at={2} variant="paint">contractual and commercial aspects</ClickHighlight> of projects, ensuring profitability, and controlling site supply chains.
              </span>
            ),
          },
        ]}
      />
    }
  />
);

// Slide 4: The Need for Measurement and Rules
export const Slide4: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  return (
    <TwoColumnLayout
      title="The Need for Measurement and Rules"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: <strong>Why We Measure</strong>,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Lifecycle Coverage:</strong> Measurement is required at every stage of a project—from establishing feasibility and budget pricing, to pre-tender estimates, contract sums, and{' '}
                  <ClickHighlight at={1} variant="paint">final account evaluations</ClickHighlight>.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Consistency for Databases:</strong> Historically, inconsistent measurement (measuring walls gross vs. net) created unreliable databases. Strict rules, like the{' '}
                  <ClickHighlight at={2} variant="paint">RICS New Rules of Measurement (NRM)</ClickHighlight>, ensure elemental costs are consistent for future cost planning.
                </span>
              ),
              revealAt: 1,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Fair Competitive Tendering:</strong> Following standard methods ensures all contractors interpret and price the work based on the{' '}
                  <ClickHighlight at={3} variant="paint">exact same information</ClickHighlight>, creating a fair, transparent baseline for competition.
                </span>
              ),
              revealAt: 2,
            },
          ]}
        />
      }
      rightContent={
        <div className="flex flex-col gap-4 h-full justify-center">
          <InteractiveCard title="Measurement Lifecycle Timeline">
            <div className="relative border border-border/40 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none">
              <svg width="240" height="260" viewBox="0 0 240 260" className="overflow-visible">
                {/* Background grey vertical path line */}
                <line x1="30" y1="20" x2="30" y2="230" stroke="currentColor" strokeWidth="2" opacity="0.12" />

                {/* Active blue vertical progress line */}
                <line 
                  x1="30" 
                  y1="20" 
                  x2="30" 
                  y2={currentClick >= 3 ? 230 : currentClick >= 2 ? 160 : currentClick >= 1 ? 90 : 20} 
                  stroke="var(--color-primary, #0284c7)" 
                  strokeWidth="2.5" 
                  className="transition-all duration-500 ease-in-out" 
                />

                {/* Node 1: Feasibility */}
                <g className="transition-all duration-500 ease-in-out opacity-100">
                  <circle cx="30" cy="20" r="5" fill="var(--color-primary, #0284c7)" stroke="var(--color-background, #fff)" strokeWidth="1.5" />
                  <text x="48" y="16" fill="currentColor" fontWeight="bold" fontSize="10">1. Feasibility Stage</text>
                  <text x="48" y="27" fill="currentColor" fontSize="8" opacity="0.7">Budget pricing &amp; feasibility study</text>
                </g>

                {/* Node 2: Pre-Tender */}
                <g className={`transition-all duration-500 ease-in-out ${currentClick >= 1 ? 'opacity-100' : 'opacity-20'}`}>
                  <circle cx="30" cy="90" r="5" fill={currentClick >= 1 ? "var(--color-primary, #0284c7)" : "currentColor"} stroke="var(--color-background, #fff)" strokeWidth="1.5" />
                  <text x="48" y="86" fill="currentColor" fontWeight="bold" fontSize="10">2. Pre-Tender Stage</text>
                  <text x="48" y="97" fill="currentColor" fontSize="8" opacity="0.7">Detailed estimates &amp; BoQ creation</text>
                </g>

                {/* Node 3: Construction */}
                <g className={`transition-all duration-500 ease-in-out ${currentClick >= 2 ? 'opacity-100' : 'opacity-20'}`}>
                  <circle cx="30" cy="160" r="5" fill={currentClick >= 2 ? "var(--color-primary, #0284c7)" : "currentColor"} stroke="var(--color-background, #fff)" strokeWidth="1.5" />
                  <text x="48" y="156" fill="currentColor" fontWeight="bold" fontSize="10">3. Construction Stage</text>
                  <text x="48" y="167" fill="currentColor" fontSize="8" opacity="0.7">Variation orders &amp; progress bill logs</text>
                </g>

                {/* Node 4: Closeout */}
                <g className={`transition-all duration-500 ease-in-out ${currentClick >= 3 ? 'opacity-100' : 'opacity-20'}`}>
                  <circle cx="30" cy="230" r="5" fill={currentClick >= 3 ? "var(--color-primary, #0284c7)" : "currentColor"} stroke="var(--color-background, #fff)" strokeWidth="1.5" />
                  <text x="48" y="226" fill="currentColor" fontWeight="bold" fontSize="10">4. Closeout Stage</text>
                  <text x="48" y="237" fill="currentColor" fontSize="8" opacity="0.7">Final accounts &amp; commercial audit</text>
                </g>
              </svg>
            </div>
          </InteractiveCard>
        </div>
      }
    />
  );
};
