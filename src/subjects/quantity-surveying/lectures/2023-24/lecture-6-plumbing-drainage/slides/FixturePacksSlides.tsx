import React from 'react';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { 
  SlideParagraph, 
  SlideList, 
  SlideCallout, 
  ClickReveal,
  InteractiveCard,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { FixturePackageDrawing } from '@/subjects/quantity-surveying/features/components/FixturePackageDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
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
  const [fixtureType, setFixtureType] = useUrlSyncedState<'Indian' | 'European'>('fixture_wc_type', 'European');
  const [hasCistern, setHasCistern] = useUrlSyncedState<boolean>('fixture_wc_cistern', true);
  const [hasPushShower, setHasPushShower] = useUrlSyncedState<boolean>('fixture_wc_shower', true);
  const [hasLowBibcock, setHasLowBibcock] = useUrlSyncedState<boolean>('fixture_wc_bibcock', true);

  // Custom pricing model:
  const baseCost = fixtureType === 'European' ? 9500 : 5000;
  const cisternCost = hasCistern ? 1500 : 0;
  const showerCost = hasPushShower ? 1200 : 0;
  const bibcockCost = hasLowBibcock ? 850 : 0;
  const totalCost = baseCost + cisternCost + showerCost + bibcockCost;

  return (
    <TwoColumnLayout
      title="2.3 WC Assembly Package Sandbox"
      leftWidth="40%"
      leftContent={
        <InteractiveCard title="Package Accessories">
          <div className="flex justify-center gap-2 mb-4">
            {(['Indian', 'European'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFixtureType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  fixtureType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted border border-border/50 text-foreground hover:bg-muted/80'
                }`}
              >
                {type} Type
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setHasCistern(!hasCistern)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex justify-between items-center ${
                hasCistern ? 'border-primary/50 bg-primary/5 text-primary' : 'border-border bg-transparent text-muted-foreground'
              }`}
            >
              <span>Flushing Cistern (+1500 BDT)</span>
              <span className="font-mono">{hasCistern ? '[ON]' : '[OFF]'}</span>
            </button>

            <button
              onClick={() => setHasPushShower(!hasPushShower)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex justify-between items-center ${
                hasPushShower ? 'border-primary/50 bg-primary/5 text-primary' : 'border-border bg-transparent text-muted-foreground'
              }`}
            >
              <span>Push Shower (+1200 BDT)</span>
              <span className="font-mono">{hasPushShower ? '[ON]' : '[OFF]'}</span>
            </button>

            <button
              onClick={() => setHasLowBibcock(!hasLowBibcock)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex justify-between items-center ${
                hasLowBibcock ? 'border-primary/50 bg-primary/5 text-primary' : 'border-border bg-transparent text-muted-foreground'
              }`}
            >
              <span>Ablution Bib-cock (+850 BDT)</span>
              <span className="font-mono">{hasLowBibcock ? '[ON]' : '[OFF]'}</span>
            </button>
          </div>

          <div className="border-t border-border/40 mt-4 pt-3">
            <CalculationOutput 
              title="Estimated Assembly Cost" 
              value={totalCost.toString()} 
              unit="BDT"
              subtitle="PWD schedule composite estimate including fittings"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <FixturePackageDrawing
            fixtureType={fixtureType}
            hasCistern={hasCistern}
            hasPushShower={hasPushShower}
            hasLowBibcock={hasLowBibcock}
          />
        </div>
      }
    />
  );
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
