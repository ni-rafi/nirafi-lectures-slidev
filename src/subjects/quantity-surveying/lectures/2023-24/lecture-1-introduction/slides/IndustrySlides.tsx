import React from 'react';
import { LectureCover } from '@/shared/layouts/LectureCover';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { SlideContent, ClickHighlight, InteractiveCard, MeasurementTimelineCanvas } from '@/features/presentation/components/elements';
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
                  <ClickHighlight at={3} variant="paint">RICS New Rules of Measurement (NRM)</ClickHighlight>, ensure elemental costs are consistent for future cost planning.
                </span>
              ),
              revealAt: 2,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Fair Competitive Tendering:</strong> Following standard methods ensures all contractors interpret and price the work based on the{' '}
                  <ClickHighlight at={5} variant="paint">exact same information</ClickHighlight>, creating a fair, transparent baseline for competition.
                </span>
              ),
              revealAt: 4,
            },
          ]}
        />
      }
      rightContent={
        <div className="flex flex-col gap-4 h-full justify-center">
          <InteractiveCard title="Measurement Lifecycle Timeline">
            <MeasurementTimelineCanvas currentClick={currentClick} />
          </InteractiveCard>
        </div>
      }
    />
  );
};
