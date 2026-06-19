import React, { useState } from 'react';
import { PlaygroundSection } from './PlaygroundSection';
import { SlideTimeline, SlideStepProgress } from '@/features/presentation/components/elements/SlideContent';
import { ClickStepsProvider } from '@/features/presentation/context';
import { Button } from '@/components/ui/button';

export const TimelineStepsSection: React.FC = () => {
  // Timeline State
  const [revealMode, setRevealMode] = useState<'none' | 'each-click' | 'all-click'>('none');
  const [timelineStep, setTimelineStep] = useState(1);

  // Step Progress State
  const [activeStep, setActiveStep] = useState(2);
  const [stepVariant, setStepVariant] = useState<'chevron' | 'pill' | 'minimal'>('chevron');

  const timelineItems = [
    { date: 'Week 1-2', title: 'Site Excavation', text: 'Determine cut/fill volume metrics and soil compaction variables.' },
    { date: 'Week 3-4', title: 'Reinforcement Mesh', text: 'Install double-direction steel reinforcing bars and mesh bounds.' },
    { date: 'Week 5-6', title: 'Concrete Casting', text: 'Begin structural concrete pouring with a 1:2:4 aggregate mixture.' },
  ];

  const progressSteps = ['Excavation', 'Reinforcement', 'Concrete Pour', 'Curing'];

  const timelinePreview = (
    <div className="flex flex-col gap-4 w-full">
      {revealMode !== 'none' && (
        <div className="flex items-center gap-2 bg-muted/30 border border-border/50 rounded-xl p-2.5 justify-between select-none">
          <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">
            Simulated Step: <span className="text-primary">{timelineStep}</span>
          </span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((s) => (
              <Button
                key={s}
                size="xs"
                variant={timelineStep === s ? 'default' : 'outline'}
                onClick={() => setTimelineStep(s)}
                className="h-6 text-[9px] font-mono cursor-pointer"
              >
                Step {s}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className="border border-border/40 p-5 rounded-xl bg-card">
        <ClickStepsProvider currentClickOverride={timelineStep}>
          <SlideTimeline items={timelineItems} revealMode={revealMode} />
        </ClickStepsProvider>
      </div>
    </div>
  );

  const timelineCode = `import { SlideTimeline } from '@/features/presentation/components/elements';

<SlideTimeline
  revealMode="${revealMode}"
  items={[
    { date: 'Week 1-2', title: 'Site Excavation', text: 'Determine cut/fill...' },
    { date: 'Week 3-4', title: 'Reinforcement Mesh', text: 'Install mesh...' },
    { date: 'Week 5-6', title: 'Concrete Casting', text: 'Begin structural...' },
  ]}
/>`;

  const timelineEditor = (
    <div className="text-slate-300 space-y-2 text-[11px] font-mono">
      <div>
        <span className="text-purple-400">import</span> {'{ SlideTimeline }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;
      </div>
      <div>
        <span className="text-blue-400">&lt;SlideTimeline</span>
      </div>
      <div className="pl-4">
        <span className="text-teal-400">revealMode</span>=<span className="text-amber-300">"</span>
        <select
          value={revealMode}
          onChange={(e) => {
            setRevealMode(e.target.value as any);
            setTimelineStep(1);
          }}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 cursor-pointer font-bold"
        >
          <option value="none">none</option>
          <option value="each-click">each-click</option>
          <option value="all-click">all-click</option>
        </select>
        <span className="text-amber-300">"</span>
      </div>
      <div>
        <span className="text-blue-400">/&gt;</span>
      </div>
    </div>
  );

  const stepsPreview = (
    <div className="border border-border/40 p-5 rounded-xl bg-card w-full">
      <SlideStepProgress steps={progressSteps} activeStep={activeStep} variant={stepVariant} />
    </div>
  );

  const stepsCode = `import { SlideStepProgress } from '@/features/presentation/components/elements';

<SlideStepProgress
  variant="${stepVariant}"
  activeStep={${activeStep}}
  steps={['Excavation', 'Reinforcement', 'Concrete Pour', 'Curing']}
/>`;

  const stepsEditor = (
    <div className="text-slate-300 space-y-2 text-[11px] font-mono">
      <div>
        <span className="text-purple-400">import</span> {'{ SlideStepProgress }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;
      </div>
      <div>
        <span className="text-blue-400">&lt;SlideStepProgress</span>
      </div>
      <div className="pl-4">
        <span className="text-teal-400">variant</span>=<span className="text-amber-300">"</span>
        <select
          value={stepVariant}
          onChange={(e) => setStepVariant(e.target.value as any)}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 cursor-pointer font-bold"
        >
          <option value="chevron">chevron</option>
          <option value="pill">pill</option>
          <option value="minimal">minimal</option>
        </select>
        <span className="text-amber-300">"</span>
      </div>
      <div className="pl-4">
        <span className="text-teal-400">activeStep</span>=<span className="text-pink-400">&#123;</span>
        <select
          value={activeStep}
          onChange={(e) => setActiveStep(parseInt(e.target.value, 10))}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 cursor-pointer"
        >
          <option value={1}>1 (Excavation)</option>
          <option value={2}>2 (Reinforcement)</option>
          <option value={3}>3 (Concrete Pour)</option>
          <option value={4}>4 (Curing)</option>
        </select>
        <span className="text-pink-400">&#125;</span>
      </div>
      <div>
        <span className="text-blue-400">/&gt;</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-300">
      <PlaygroundSection
        title="Slide Timeline Sequences"
        description={
          <span>
            Use <code>&lt;SlideTimeline&gt;</code> to render chronological schedules or casting steps. Supports click reveals to stagger item visibility during presentation sequences.
          </span>
        }
        preview={timelinePreview}
        codeText={timelineCode}
        editorContent={timelineEditor}
      />
      <PlaygroundSection
        title="Visual Step Progress Trails"
        description={
          <span>
            Use <code>&lt;SlideStepProgress&gt;</code> to walk students through active engineering or design phases. Past steps show complete marks automatically, and layouts stack vertically on mobile screens in Blog Mode.
          </span>
        }
        preview={stepsPreview}
        codeText={stepsCode}
        editorContent={stepsEditor}
      />
    </div>
  );
};

export default TimelineStepsSection;
