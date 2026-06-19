import React, { useState } from 'react';
import { ClickReveal } from '@/features/presentation/components/elements/ClickReveal';
import { ClickStepsProvider } from '@/features/presentation/context';
import { Button } from '@/components/ui/button';
import { PlaygroundSection } from './PlaygroundSection';

export const RevealsSection: React.FC = () => {
  const [at, setAt] = useState(1);
  const [preset, setPreset] = useState<'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none'>('fade-in');
  const [hide, setHide] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const preview = (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2 bg-muted/30 border border-border/50 rounded-xl p-2.5 justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase">
          Simulated Step: <span className="text-primary">{activeStep}</span>
        </span>
        <div className="flex gap-1">
          <Button
            size="xs"
            variant={activeStep === 0 ? 'default' : 'outline'}
            onClick={() => setActiveStep(0)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step 0
          </Button>
          <Button
            size="xs"
            variant={activeStep >= at ? 'default' : 'outline'}
            onClick={() => setActiveStep(at)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step {at} ({hide ? 'Hide' : 'Reveal'})
          </Button>
        </div>
      </div>

      <div className="border border-border/40 p-4 rounded-xl bg-card min-h-[80px] flex items-center justify-center text-center">
        <ClickStepsProvider currentClickOverride={activeStep}>
          <ClickReveal at={at} preset={preset} hide={hide}>
            <div className="p-3 bg-primary/10 border border-primary/20 text-foreground font-mono text-xs rounded-lg select-none">
              🚀 Element Revealed!
            </div>
          </ClickReveal>
        </ClickStepsProvider>
      </div>
    </div>
  );

  const codeText = `import { ClickReveal } from '@/features/presentation/components/elements';

<ClickReveal
  at={${at}}
  preset="${preset}"
  hide={${hide}}
>
  <div className="p-3 bg-primary/10 rounded-lg">
    🚀 Element Revealed!
  </div>
</ClickReveal>`;

  const editorContent = (
    <div className="text-slate-300">
      <span className="text-purple-400">import</span> {'{ ClickReveal }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;{"\n\n"}
      <span className="text-blue-400">&lt;ClickReveal</span>{"\n"}
      {"  "}<span className="text-teal-400">at</span>=<span className="text-pink-400">&#123;</span>
      <input
        type="number"
        value={at}
        min={0}
        max={10}
        onChange={(e) => setAt(parseInt(e.target.value) || 1)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-12 font-mono text-[11px] inline-block"
      />
      <span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">preset</span>=<span className="text-amber-300">"</span>
      <select
        value={preset}
        onChange={(e) => setPreset(e.target.value as any)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer"
      >
        <option value="fade">fade</option>
        <option value="fade-in">fade-in</option>
        <option value="up">up</option>
        <option value="down">down</option>
        <option value="scale">scale</option>
        <option value="none">none</option>
      </select>
      <span className="text-amber-300">"</span>{"\n"}
      {"  "}<span className="text-teal-400">hide</span>=<span className="text-pink-400">&#123;</span>
      <select
        value={String(hide)}
        onChange={(e) => setHide(e.target.value === 'true')}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-purple-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer"
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
      <span className="text-pink-400">&#125;</span><span className="text-blue-400">&gt;</span>{"\n"}
      {"  "}<span className="text-blue-400">&lt;div&gt;</span>🚀 Element Revealed!<span className="text-blue-400">&lt;/div&gt;</span>{"\n"}
      <span className="text-blue-400">&lt;/ClickReveal&gt;</span>
    </div>
  );

  return (
    <PlaygroundSection
      title="Element Reveal Sequences"
      description={
        <span>
          Use <code>&lt;ClickReveal&gt;</code> to orchestrate sequential visibility of slide blocks. It connects to the presentation slide transitions to reveal or hide sub-components using standard animation presets.
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default RevealsSection;
