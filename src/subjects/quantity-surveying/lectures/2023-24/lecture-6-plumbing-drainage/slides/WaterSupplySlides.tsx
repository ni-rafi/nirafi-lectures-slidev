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
import { WaterPipeNetworkDrawing } from '@/subjects/quantity-surveying/features/components/WaterPipeNetworkDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculatePipeLengthWithAllowanceInternal } from '@/subjects/quantity-surveying/cores';
import { LectureCover } from '@/shared/layouts/LectureCover';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { QuizCardOrchestrator } from '@/features/quiz';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';


// ============================================================================
// Slide 1: Main Lecture Cover
// ============================================================================
export const Slide1: React.FC<SlideProps> = (props) => (
  <LectureCover {...props} />
);

// ============================================================================
// Slide 2: Section 1 Cover
// ============================================================================
export const Slide2: React.FC = () => (
  <TopicDividerLayout
    topicNumber="01"
    title="Internal Water Supply System"
    subtitle="Piping Networks, Center-line Take-off Rules, and PWD Fittings Allowances"
  />
);

// ============================================================================
// Slide 3: Piping Classifications
// ============================================================================
export const Slide3: React.FC = () => (
  <TwoColumnLayout
    title="1.1 Piping Material Classifications"
    bgVariant="default"
    leftWidth="50%"
    leftContent={
      <div className="space-y-4">
        <SlideParagraph title="Trace & Classify">
          Water distribution routes follow complex 3D pathways from the roof storage tank or underground booster reservoir pump. Classifying the pipe medium regulates the entire pricing schema.
        </SlideParagraph>
        
        <SlideList
          revealMode="each-click"
          items={[
            { 
              title: "PPR (Polypropylene Random Copolymer)", 
              text: "The modern PWD standard for internal hot and cold water plumbing networks. Fusion welded at joints." 
            },
            { 
              title: "CPVC (Chlorinated Polyvinyl Chloride)", 
              text: "High-temperature thermoplastic pipe lines, structured utilizing chemical solvent cement bonding." 
            },
            { 
              title: "G.I. (Galvanized Iron)", 
              text: "Traditional metallic pressure pipes. Primarily restricted to exposed external drop stacks prone to UV or impact damage." 
            }
          ]}
        />
      </div>
    }
    rightContent={
      <ClickReveal at={3} preset="fade-in">
        <div className="h-full flex flex-col justify-center">
          <SlideCallout variant="info" title="Drawing Index Legend Check">
            <p className="mb-2 text-sm text-muted-foreground">Always locate the pipe line specification shorthand before executing measurements:</p>
            <div className="text-xl font-mono text-center text-primary my-2 bg-muted/20 p-3 rounded-lg border border-border">
              25mm ⌀ PPR (Outer Class C)
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Surveyor Insight:</strong> Diameters specified on engineering layouts refer to nominal internal diameter. Outer profiles impact the structural concrete sleeve framing thresholds.
            </p>
          </SlideCallout>
        </div>
      </ClickReveal>
    }
  />
);

// ============================================================================
// Slide 4: Take-off Rules for Pipes
// ============================================================================
export const Slide4: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  return (
    <TwoColumnLayout
      title="1.2 Running Center-line Metrics"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="space-y-6">
          <SlideParagraph title="The Linear Rule">
            Plumbing pipe lines are quantified by total continuous net length. You measure along the running <ClickHighlight at={1} variant="bold" className="text-blue-500">Center-line of the pipe path</ClickHighlight>.
          </SlideParagraph>
          
          <ClickReveal at={2}>
            <SlideCallout variant="warning" title="The 3D Trajectory Trap">
              <p className="text-sm text-left">
                Do not skip vertical transitions! Plan views mask elevation jumps. You must cross-reference invert levels and add:
              </p>
              <ul className="list-disc pl-5 mt-2 text-xs space-y-1 text-muted-foreground text-left">
                <li>Vertical structural drops inside wet wall chases</li>
                <li>Risers inside vertical service column shafts</li>
                <li>Overhead ceiling slab suspension drop networks</li>
              </ul>
            </SlideCallout>
          </ClickReveal>
        </div>
        }
        rightContent={
          <div className="w-full h-full flex items-center justify-center">
            <WaterPipeNetworkDrawing
              horizontalLengthM={5.0}
              verticalRiseM={2.8}
              verticalDropM={1.2}
              pipeClass="PPR"
              activeHighlight={
                currentClick === 1 ? 'horizontal' :
                currentClick === 2 ? 'vertical' :
                currentClick >= 3 ? 'all' : 'none'
              }
            />
          </div>
        }
      />
    );
};

// ============================================================================
// Slide 5: Pipe Network Sandbox
// ============================================================================
export const Slide5: React.FC = () => {
  const [pipeClass, setPipeClass] = useUrlSyncedState<'PPR' | 'CPVC' | 'GI'>('plumb_pipe_class', 'PPR');
  const [horizLen, setHorizLen] = useUrlSyncedState<number>('plumb_pipe_h_len', 5.0);
  const [riseLen, setRiseLen] = useUrlSyncedState<number>('plumb_pipe_v_rise', 2.8);
  const [dropLen, setDropLen] = useUrlSyncedState<number>('plumb_pipe_v_drop', 1.2);

  const netLen = horizLen + riseLen + dropLen;
  const billedLen = calculatePipeLengthWithAllowanceInternal(netLen, 5.0); // 5% allowance

  return (
    <TwoColumnLayout
      title="1.3 Pipe Network Dimensions Sandbox"
      leftWidth="40%"
      leftContent={
        <InteractiveCard title="Network Controls">
          <div className="flex justify-center gap-2 mb-4">
            {(['PPR', 'CPVC', 'GI'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setPipeClass(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  pipeClass === type
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
              label="Horizontal Length"
              min={1.0}
              max={10.0}
              step={0.5}
              value={horizLen}
              onChange={setHorizLen}
              unit=" m"
            />
            <ParameterSlider
              label="Vertical Riser"
              min={0.0}
              max={5.0}
              step={0.2}
              value={riseLen}
              onChange={setRiseLen}
              unit=" m"
            />
            <ParameterSlider
              label="Vertical Drop"
              min={0.0}
              max={3.0}
              step={0.2}
              value={dropLen}
              onChange={setDropLen}
              unit=" m"
            />
          </div>

          <div className="border-t border-border/40 mt-4 pt-3 space-y-2">
            <CalculationOutput 
              title="Net Centerline Length" 
              value={netLen.toFixed(2)} 
              unit="m"
              subtitle="Sum of horizontal and vertical transitions"
            />
            <CalculationOutput 
              title="Billed Length (+5%)" 
              value={billedLen.toFixed(3)} 
              unit="m"
              subtitle="Centerline length plus 5% PWD jointing wastage"
            />
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="w-full h-full flex items-center justify-center">
          <WaterPipeNetworkDrawing
            horizontalLengthM={horizLen}
            verticalRiseM={riseLen}
            verticalDropM={dropLen}
            pipeClass={pipeClass}
          />
        </div>
      }
    />
  );
};

// ============================================================================
// Slide 6: Quiz 1 (Centerline MCQ)
// ============================================================================
export const Slide6: React.FC = () => {
  return (
    <FullWidthLayout title="Pipe Transitions Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="qs_2023_lec6_q1"
          questionText="A bathroom plan view shows a horizontal water line of 3.20m. A vertical riser in the service duct goes up by 2.80m, and a wall drop descends by 1.20m to a basin bibcock. Select the correct method to calculate the total centerline pipe length before applying allowances:"
          quizType="multiple-choice"
          options={[
            'Subtract drops from risers: 3.20m + 2.80m - 1.20m = 4.80m centerline length',
            'Add all vertical transitions: 3.20m (horizontal) + 2.80m (riser) + 1.20m (drop) = 7.20m centerline length',
            'Only measure the horizontal length of 3.20m (vertical runs are covered in wall plastering allowances)',
            'Use shoelace formula on the horizontal coordinates and multiply by 1.5'
          ]}
        />
      </div>
    </FullWidthLayout>
  );
};
