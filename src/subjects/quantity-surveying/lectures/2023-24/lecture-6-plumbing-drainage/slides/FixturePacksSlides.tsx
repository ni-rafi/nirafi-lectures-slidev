import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal
} from '@/features/presentation/components/elements';
import { FixturePackageDrawing } from '@/subjects/quantity-surveying/features/components/FixturePackageDrawing';
import { FixtureAssemblySandbox } from '@/subjects/quantity-surveying/features';
import { QuizCardOrchestrator } from '@/features/quiz';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';


// ============================================================================
// Slide 7: Section 2 Cover
// ============================================================================
export const Slide7: React.FC = () => (
  <TopicDividerLayout
    topicNumber="02"
    title="Fixtures & Appurtenances Packs"
    subtitle="PWD Unit Rate Bundling Laws for Sanitary Fittings"
  />
);

// ============================================================================
// Slide 8: WC & Ablution Packs
// ============================================================================
export const Slide8: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  return (
    <TwoColumnLayout
      title="2.1 Water Closet (WC) Composite Bundles"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="space-y-4 text-left">
          <SlideParagraph title="The PWD Composite Rule">
            In real-world public infrastructure budgeting, a sanitary fixture entry is never recorded as an isolated object shell. PWD schedules group the primary asset alongside its full operating accessories.
          </SlideParagraph>
          
          <SlideList
            revealMode="each-click"
            items={[
              { 
                title: "Indian Type Pan Pack", 
                text: "Includes the vitreous squatting pan, long twin footrests, explicit P/S traps, and connection to horizontal soil mains." 
              },
              { 
                title: "European Commode Pack", 
                text: "Encapsulates the pedestal pan, plastic flushing seat cover, matching floor mounting anchors, and wax seals." 
              },
              { 
                title: "Flushing Control Arrays", 
                text: "Bundles either a low-down plastic cistern (10L), porcelain cisterns, or high-pressure concealed flush valves." 
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <FixturePackageDrawing
            fixtureType={currentClick >= 2 ? 'European' : 'Indian'}
            hasCistern={currentClick >= 3}
            hasPushShower={currentClick >= 3}
            hasLowBibcock={currentClick >= 3}
            activeHighlight={
              currentClick === 1 ? 'indian' :
              currentClick === 2 ? 'european' :
              currentClick >= 3 ? 'accessories' : 'none'
            }
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 9: Wash Basins & Sinks
// ============================================================================
export const Slide9: React.FC = () => (
  <FullWidthLayout
    title="2.2 Take-off for Wash Basins & Sink Units"
    bgVariant="default"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
      <div className="space-y-4 text-left">
        <SlideParagraph title="Ablution Array Take-off">
          Wash basins in commercial public zones or multi-story apartments are checked directly off bathroom layout drawings and counted identically by assembly sets.
        </SlideParagraph>
        
        <SlideList
          revealMode="each-click"
          items={[
            { 
              title: "Basin Complements Pack", 
              text: "Requires pairing a single wash basin item with its supporting iron brackets, pillar cock taps, waste coupling pipe, and CP chain plug blocks." 
            },
            { 
              title: "Kitchen Sink Complements Pack", 
              text: "Stainless steel single/double bowl frames must specify drainage grates, waste trap links, and swan-neck mixing taps." 
            }
          ]}
        />
      </div>

      <ClickReveal at={2} preset="up">
        <div className="h-full flex flex-col justify-center text-left">
          <SlideCallout variant="info" title="Under-Sink Technical Additions">
            <p className="mb-4 text-sm text-muted-foreground">
              Always ensure your Bill of Materials (BoM) records the essential flexible pipe couplers hiding under the deck:
            </p>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono font-bold text-primary mb-4">
              <div className="bg-muted p-2 rounded">Flexible Hose Links</div>
              <div className="bg-muted p-2 rounded">Angle Stop Valves</div>
              <div className="bg-muted p-2 rounded">CP Bottle Traps</div>
              <div className="bg-muted p-2 rounded">Wall Escutcheon Plates</div>
            </div>
            <p className="text-[10px] text-muted-foreground italic border-t pt-2">
              * Surveyor Note: These secondary components are typically priced within the composite basin rate unless explicitly marked on separate, unbundled schedules.
            </p>
          </SlideCallout>
        </div>
      </ClickReveal>
    </div>
  </FullWidthLayout>
);

// ============================================================================
// Slide 10: Sanitary Fixtures Sandbox
// ============================================================================
export const Slide10: React.FC = () => {
  return <FixtureAssemblySandbox />;
};

// ============================================================================
// Slide 11: Quiz 2 (WC Cost assembly - Numeric)
// ============================================================================
export const Slide11: React.FC = () => {
  return (
    <FullWidthLayout title="Fixture Packs Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec6_q2"
          questionText="A multi-unit toilet layout requires estimating the composite cost of WC assembly packages. Each toilet requires 1 European WC commode pack ($9500 BDT) including pan, trap, and cistern. Additionally, the sessional specifications mandate adding a push-shower ($1200 BDT), an angle stop cock ($850 BDT), and a low-level bibcock ($650 BDT) to each package. If the floor plan has exactly 6 toilet units, calculate the total cost in BDT of the sanitary fixture packages including accessories."
          quizType="numeric-input"
        />
      </div>
    </FullWidthLayout>
  );
};

// ============================================================================
// Slide 17: Smart & Automated Bathroom Fixtures (New slide)
// ============================================================================
export const AutomatedFixturesSlide: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  const highlightMap: Record<number, 'none' | 'accessories' | 'smart'> = {
    0: 'none',
    1: 'accessories',
    2: 'smart',
  };

  const activeHighlight = highlightMap[currentClick] || 'none';

  return (
    <TwoColumnLayout
      title="2.4 Smart & Automated Bathroom Fixtures"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <div className="space-y-4 text-left select-text">
          <SlideParagraph title="Commercial and Smart Fixture Elements">
            Modern green buildings and public utilities require calculating both standard wall accessories and automatic sensor-based upgrades.
          </SlideParagraph>

          <SlideList
            revealMode="each-click"
            items={[
              {
                title: "Standard Accessory Bundles",
                text: "Includes mirrors (Nos.), towel rails (Nos.), and recessed soap trays (Nos.). These are itemized individually in standard BoQs."
              },
              {
                title: "Active Sensor-based Fixtures",
                text: "Automatic infrared soap dispensers (Nos.) and HEPA-filter hand dryers (Nos.) are billed separately with power-supply point runs."
              }
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-center">
          <FixturePackageDrawing
            toiletType="EuropeanWallHung"
            basinType="Counter"
            hasMirror={true}
            hasTowelRail={true}
            hasSoapTray={true}
            hasSmartSoap={currentClick >= 2}
            hasSmartDryer={currentClick >= 2}
            activeHighlight={activeHighlight}
            className="flex-1"
          />
        </div>
      }
    />
  );
};
