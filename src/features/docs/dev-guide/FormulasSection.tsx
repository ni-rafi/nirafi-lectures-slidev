import React, { useState } from 'react';
import { FormulaBreakdown, FormulaStep } from '@/features/presentation/components/elements/FormulaBreakdown';
import { PlaygroundSection } from './PlaygroundSection';

export const FormulasSection: React.FC = () => {
  const [title, setTitle] = useState('Calculation Steps');
  
  // Step 1
  const [step1Label, setStep1Label] = useState('General Form');
  const [step1Formula, setStep1Formula] = useState('V = L \\times W \\times D');

  // Step 2
  const [step2Label, setStep2Label] = useState('Substitution');
  const [step2Formula, setStep2Formula] = useState('V = 6.00 \\times 2.40 \\times 0.15');

  // Step 3
  const [step3Label, setStep3Label] = useState('Result');
  const [step3Formula, setStep3Formula] = useState('V = 2.160 \\, \\text{m}^3');
  const [step3Highlight, setStep3Highlight] = useState(true);

  const steps: FormulaStep[] = [
    { label: step1Label, formula: step1Formula },
    { label: step2Label, formula: step2Formula },
    { label: step3Label, formula: step3Formula, highlight: step3Highlight },
  ];

  const preview = (
    <div className="w-full">
      <FormulaBreakdown title={title || undefined} steps={steps} />
    </div>
  );

  // Escapes backslashes in code text copy so copy-paste works perfectly
  const escapeBackslashes = (str: string) => str.replace(/\\/g, '\\\\');

  const codeText = `import { FormulaBreakdown } from '@/features/presentation/components/elements';

const steps = [
  { label: "${step1Label}", formula: "${escapeBackslashes(step1Formula)}" },
  { label: "${step2Label}", formula: "${escapeBackslashes(step2Formula)}" },
  { label: "${step3Label}", formula: "${escapeBackslashes(step3Formula)}", highlight: ${step3Highlight} },
];

<FormulaBreakdown title="${title}" steps={steps} />`;

  const editorContent = (
    <div className="text-slate-300">
      <span className="text-purple-400">import</span> {'{ FormulaBreakdown }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;{"\n\n"}
      <span className="text-purple-400">const</span> steps = <span className="text-slate-400">[</span>{"\n"}
      {"  "}<span className="text-slate-400">&#123;</span>{"\n"}
      {"    "}<span className="text-teal-400">label</span>: <span className="text-amber-300">"</span>
      <input
        type="text"
        value={step1Label}
        onChange={(e) => setStep1Label(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-28 font-mono text-[11px] inline-block"
      />
      <span className="text-amber-300">"</span>,{"\n"}
      {"    "}<span className="text-teal-400">formula</span>: <span className="text-amber-300">"</span>
      <input
        type="text"
        value={step1Formula}
        onChange={(e) => setStep1Formula(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-56 font-mono text-[11px] inline-block"
      />
      <span className="text-amber-300">"</span>,{"\n"}
      {"  "}<span className="text-slate-400">&#125;</span>,{"\n"}
      {"  "}<span className="text-slate-400">&#123;</span>{"\n"}
      {"    "}<span className="text-teal-400">label</span>: <span className="text-amber-300">"</span>
      <input
        type="text"
        value={step2Label}
        onChange={(e) => setStep2Label(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-28 font-mono text-[11px] inline-block"
      />
      <span className="text-amber-300">"</span>,{"\n"}
      {"    "}<span className="text-teal-400">formula</span>: <span className="text-amber-300">"</span>
      <input
        type="text"
        value={step2Formula}
        onChange={(e) => setStep2Formula(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-56 font-mono text-[11px] inline-block"
      />
      <span className="text-amber-300">"</span>,{"\n"}
      {"  "}<span className="text-slate-400">&#125;</span>,{"\n"}
      {"  "}<span className="text-slate-400">&#123;</span>{"\n"}
      {"    "}<span className="text-teal-400">label</span>: <span className="text-amber-300">"</span>
      <input
        type="text"
        value={step3Label}
        onChange={(e) => setStep3Label(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-28 font-mono text-[11px] inline-block"
      />
      <span className="text-amber-300">"</span>,{"\n"}
      {"    "}<span className="text-teal-400">formula</span>: <span className="text-amber-300">"</span>
      <input
        type="text"
        value={step3Formula}
        onChange={(e) => setStep3Formula(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-56 font-mono text-[11px] inline-block"
      />
      <span className="text-amber-300">"</span>,{"\n"}
      {"    "}<span className="text-teal-400">highlight</span>: <span className="text-pink-400">&#123;</span>
      <select
        value={String(step3Highlight)}
        onChange={(e) => setStep3Highlight(e.target.value === 'true')}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-purple-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer"
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
      <span className="text-pink-400">&#125;</span>,{"\n"}
      {"  "}<span className="text-slate-400">&#125;</span>,{"\n"}
      <span className="text-slate-400">]</span>;{"\n\n"}
      <span className="text-blue-400">&lt;FormulaBreakdown</span> <span className="text-teal-400">title</span>=<span className="text-amber-300">"</span>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-36 font-mono text-[11px] inline-block font-bold"
      />
      <span className="text-amber-300">"</span> <span className="text-teal-400">steps</span>=<span className="text-pink-400">&#123;</span>steps<span className="text-pink-400">&#125;</span> <span className="text-blue-400">/&gt;</span>
    </div>
  );

  return (
    <PlaygroundSection
      title="LaTeX Math Equations & Formula Flows"
      description={
        <span>
          Use <code>&lt;FormulaBreakdown&gt;</code> to represent derivation or substitution sequences clearly. It renders a clean list containing labels, arrows, and LaTeX blocks using <code>Katex</code>.
          <br />
          <span className="mt-2 block text-muted-foreground italic border-l-2 border-primary/40 pl-2">
            <strong>Note:</strong> Multiple-step staggered derivations like <code>&lt;FormulaBreakdown&gt;</code> are not natively supported by the Slide Schema Engine. Use the <strong>Hybrid Strategy</strong> to wrap these in a custom React slide component. For simple LaTeX blocks with highlights, you can use the native <code>latex</code> schema block type.
          </span>
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default FormulasSection;
