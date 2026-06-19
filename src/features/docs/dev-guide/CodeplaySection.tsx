import React, { useState, useMemo, useEffect } from 'react';
import { CodeBlock } from '@/features/presentation/components/elements/CodeBlock';
import { CodePlayground } from '@/features/presentation/components/elements/CodePlayground';
import { ClickStepsProvider } from '@/features/presentation/context';
import { Button } from '@/components/ui/button';
import { PlaygroundSection } from './PlaygroundSection';

export const CodeplaySection: React.FC = () => {
  const [tab, setTab] = useState<'block' | 'playground'>('block');
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState(`const concreteDensity = 2400; // kg/m³
const volume = 3.450; // m³
const mass = volume * concreteDensity;
console.log("Total Mass is: " + mass + " kg");`);
  
  const [highlight, setHighlight] = useState('{1|3|all}');
  const [activeStep, setActiveStep] = useState(1);

  const stages = useMemo(() => {
    if (!highlight) return ['all'];
    const cleaned = highlight.trim().replace(/^\{|\}$/g, '');
    return cleaned.split('|').map((s) => s.trim());
  }, [highlight]);

  // Prevent activeStep out of bounds when stages list updates
  useEffect(() => {
    if (activeStep > stages.length) {
      setActiveStep(Math.max(1, stages.length));
    }
  }, [stages.length, activeStep]);

  const preview = (
    <div className="flex flex-col gap-4 w-full">
      {/* Switch between static CodeBlock and Monaco Playground */}
      <div className="flex rounded-lg p-1 bg-muted/60 border border-border/40 w-fit self-center">
        <Button
          size="xs"
          variant={tab === 'block' ? 'default' : 'ghost'}
          onClick={() => setTab('block')}
          className="h-7 text-[10px] cursor-pointer"
        >
          CodeBlock (Highlights)
        </Button>
        <Button
          size="xs"
          variant={tab === 'playground' ? 'default' : 'ghost'}
          onClick={() => setTab('playground')}
          className="h-7 text-[10px] cursor-pointer"
        >
          CodePlayground (Monaco Run)
        </Button>
      </div>

      {tab === 'block' ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 bg-muted/30 border border-border/50 rounded-xl p-2 justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              Simulated Step: <span className="text-primary">{activeStep}</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {stages.map((stage, idx) => {
                const stepNum = idx + 1;
                return (
                  <Button
                    key={idx}
                    size="xs"
                    variant={activeStep === stepNum ? 'default' : 'outline'}
                    onClick={() => setActiveStep(stepNum)}
                    className="h-6 text-[9px] font-mono cursor-pointer"
                  >
                    Stage {stepNum} ({stage})
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border/40">
            <ClickStepsProvider currentClickOverride={activeStep}>
              <CodeBlock
                code={code}
                language={language}
                highlight={highlight}
                lines={true}
              />
            </ClickStepsProvider>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/40">
          <ClickStepsProvider>
            <CodePlayground
              code={code}
              language={language}
              mode="run"
              height="140px"
              autorun={true}
            />
          </ClickStepsProvider>
        </div>
      )}
    </div>
  );

  const codeText = tab === 'block' 
    ? `import { CodeBlock } from '@/features/presentation/components/elements';

<CodeBlock
  code={\`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}
  language="${language}"
  highlight="${highlight}"
  lines={true}
/>`
    : `import { CodePlayground } from '@/features/presentation/components/elements';

<CodePlayground
  code={\`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}
  language="${language}"
  mode="run"
  height="140px"
/>`;

  const editorContent = (
    <div className="text-slate-300">
      <span className="text-purple-400">import</span> {tab === 'block' ? '{ CodeBlock }' : '{ CodePlayground }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;{"\n\n"}
      <span className="text-purple-400">const</span> sourceCode = <span className="text-amber-300">`</span>{"\n"}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={4}
        className="bg-slate-900 border border-white/10 rounded p-1.5 text-amber-300 focus:outline-none focus:border-primary/50 w-full font-mono text-[11px] block mt-1"
      />
      <span className="text-amber-300">`</span>;{"\n\n"}
      {tab === 'block' ? (
        <>
          <span className="text-blue-400">&lt;CodeBlock</span>{"\n"}
          {"  "}<span className="text-teal-400">code</span>=<span className="text-pink-400">&#123;</span>sourceCode<span className="text-pink-400">&#125;</span>{"\n"}
          {"  "}<span className="text-teal-400">language</span>=<span className="text-amber-300">"</span>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-24 font-mono text-[11px] inline-block font-bold"
          />
          <span className="text-amber-300">"</span>{"\n"}
          {"  "}<span className="text-teal-400">highlight</span>=<span className="text-amber-300">"</span>
          <input
            type="text"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-28 font-mono text-[11px] inline-block"
          />
          <span className="text-amber-300">"</span>{"\n"}
          {"  "}<span className="text-teal-400">lines</span>=<span className="text-pink-400">&#123;</span>true<span className="text-pink-400">&#125;</span>{"\n"}
          <span className="text-blue-400">/&gt;</span>
        </>
      ) : (
        <>
          <span className="text-blue-400">&lt;CodePlayground</span>{"\n"}
          {"  "}<span className="text-teal-400">code</span>=<span className="text-pink-400">&#123;</span>sourceCode<span className="text-pink-400">&#125;</span>{"\n"}
          {"  "}<span className="text-teal-400">language</span>=<span className="text-amber-300">"</span>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-24 font-mono text-[11px] inline-block font-bold"
          />
          <span className="text-amber-300">"</span>{"\n"}
          {"  "}<span className="text-teal-400">mode</span>=<span className="text-amber-300">"run"</span>{"\n"}
          {"  "}<span className="text-teal-400">height</span>=<span className="text-amber-300">"140px"</span>{"\n"}
          <span className="text-blue-400">/&gt;</span>
        </>
      )}
    </div>
  );

  return (
    <PlaygroundSection
      title="Code Blocks & Monaco Sandboxes"
      description={
        <span>
          Render source code blocks inside presentation slides using <code>&lt;CodeBlock&gt;</code> (supports sequential timing stage highlights separated by <code>|</code> characters) or <code>&lt;CodePlayground&gt;</code> (launches an editable, runnable Monaco IDE sandbox instance).
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default CodeplaySection;
