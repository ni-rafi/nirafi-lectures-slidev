import React, { useState } from 'react';
import { CodeMagicMove } from '@/features/presentation/components/elements/CodeMagicMove';
import { ClickStepsProvider } from '@/features/presentation/context';
import { Button } from '@/components/ui/button';
import { PlaygroundSection } from './PlaygroundSection';

export const MagicMoveSection: React.FC = () => {
  const [step1, setStep1] = useState(`const width = 0.4;
const depth = 0.3;
const area = width * depth;`);
  const [step2, setStep2] = useState(`const width = 0.4;
const depth = 0.3;
const area = width * depth;
const volume = area * 6.0;`);
  const [language, setLanguage] = useState('typescript');
  const [lines, setLines] = useState(true);

  const [activeStep, setActiveStep] = useState(1);

  const preview = (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2 bg-muted/30 border border-border/50 rounded-xl p-2.5 justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase">
          Simulated Step: <span className="text-primary">{activeStep}</span>
        </span>
        <div className="flex gap-1">
          <Button
            size="xs"
            variant={activeStep === 1 ? 'default' : 'outline'}
            onClick={() => setActiveStep(1)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step 1 (Base Code)
          </Button>
          <Button
            size="xs"
            variant={activeStep === 2 ? 'default' : 'outline'}
            onClick={() => setActiveStep(2)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step 2 (Morphed Code)
          </Button>
        </div>
      </div>

      <div className="border border-border/40 rounded-xl overflow-hidden">
        <ClickStepsProvider currentClickOverride={activeStep}>
          <CodeMagicMove
            steps={[step1, step2]}
            language={language}
            lines={lines}
          />
        </ClickStepsProvider>
      </div>
    </div>
  );

  const codeText = `import { CodeMagicMove } from '@/features/presentation/components/elements';

const steps = [
  \`${step1.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
  \`${step2.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
];

<CodeMagicMove
  steps={steps}
  language="${language}"
  lines={${lines}}
/>`;

  const editorContent = (
    <div className="text-slate-300">
      <span className="text-purple-400">import</span> {'{ CodeMagicMove }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;{"\n\n"}
      <span className="text-purple-400">const</span> steps = <span className="text-slate-400">[</span>{"\n"}
      {"  "}<span className="text-amber-300">`</span>{"\n"}
      <textarea
        value={step1}
        onChange={(e) => setStep1(e.target.value)}
        rows={3}
        className="bg-slate-900 border border-white/10 rounded p-1.5 text-amber-300 focus:outline-none focus:border-primary/50 w-full font-mono text-[11px] block mt-1"
      />
      {"  "}<span className="text-amber-300">`</span>,{"\n"}
      {"  "}<span className="text-amber-300">`</span>{"\n"}
      <textarea
        value={step2}
        onChange={(e) => setStep2(e.target.value)}
        rows={4}
        className="bg-slate-900 border border-white/10 rounded p-1.5 text-amber-300 focus:outline-none focus:border-primary/50 w-full font-mono text-[11px] block mt-1"
      />
      {"  "}<span className="text-amber-300">`</span>,{"\n"}
      <span className="text-slate-400">]</span>;{"\n\n"}
      <span className="text-blue-400">&lt;CodeMagicMove</span>{"\n"}
      {"  "}<span className="text-teal-400">steps</span>=<span className="text-pink-400">&#123;</span>steps<span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">language</span>=<span className="text-amber-300">"</span>
      <input
        type="text"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-24 font-mono text-[11px] inline-block font-bold"
      />
      <span className="text-amber-300">"</span>{"\n"}
      {"  "}<span className="text-teal-400">lines</span>=<span className="text-pink-400">&#123;</span>
      <select
        value={String(lines)}
        onChange={(e) => setLines(e.target.value === 'true')}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-purple-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer"
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
      <span className="text-pink-400">&#125;</span>{"\n"}
      <span className="text-blue-400">/&gt;</span>
    </div>
  );

  return (
    <PlaygroundSection
      title="Code Magic Move Morphing"
      description={
        <span>
          Use <code>&lt;CodeMagicMove&gt;</code> to morph structural source code snippets smoothly. It swaps standard static code blocks for a sequence of code phases synchronized with slide active trigger step clicks.
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default MagicMoveSection;
