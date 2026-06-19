import React, { useState, useEffect, useId, useMemo } from 'react';
import { useClickStepsContext } from '../../context/ClickStepsContext';
import { useTheme } from '@/context';
import CodeBlock from './CodeBlock';

interface CodeMagicMoveProps {
  steps: string[];
  language?: string;
  lines?: boolean;
  startLine?: number;
}

export const CodeMagicMove: React.FC<CodeMagicMoveProps> = ({
  steps,
  language = 'typescript',
  lines = true,
  startLine = 1,
}) => {
  const moveId = useId();
  const { registerClick, deregisterClick, currentClick } = useClickStepsContext();
  const [baseStep, setBaseStep] = useState<number | null>(null);

  // Safely consume theme context
  let resolvedTheme = 'dark';
  try {
    const themeCtx = useTheme();
    resolvedTheme = themeCtx?.resolvedTheme || 'dark';
  } catch {
    // fallback if no provider
  }
  const isLight = resolvedTheme === 'light';

  // Register relative click triggers for code morph iterations (excluding base step)
  useEffect(() => {
    if (steps.length <= 1) return;

    const firstStep = registerClick(`${moveId}_0`, '+1');
    setBaseStep(firstStep);

    for (let i = 1; i < steps.length - 1; i++) {
      registerClick(`${moveId}_${i}`, '+1');
    }

    return () => {
      for (let i = 0; i < steps.length - 1; i++) {
        deregisterClick(`${moveId}_${i}`);
      }
    };
  }, [moveId, steps.length, registerClick, deregisterClick]);

  // Compute active morph step index based on presentation clicks
  const activeStepIdx = useMemo(() => {
    if (steps.length <= 1 || baseStep === null) return 0;
    const diff = currentClick - baseStep;
    if (diff < 0) return 0;
    if (diff >= steps.length) return steps.length - 1;
    return diff;
  }, [steps.length, baseStep, currentClick]);

  const activeCode = steps[activeStepIdx] || '';

  return (
    <div className="w-full relative overflow-hidden transition-all duration-500 ease-in-out">
      {/* Morph Title label with animation step count */}
      <div className={`flex justify-between items-center px-4 py-1.5 border border-b-0 font-mono text-[9px] uppercase tracking-wider select-none rounded-t-2xl ${
        isLight
          ? 'border-slate-200/80 bg-slate-100/80 text-slate-500'
          : 'border-white/10 bg-slate-900/60 text-muted-foreground'
      }`}>
        <span>Magic Move Morph</span>
        <span className="font-semibold text-primary">
          Step {activeStepIdx + 1} of {steps.length}
        </span>
      </div>
      
      {/* CodeBlock wrapper applying key change to trigger micro-animations */}
      <div
        key={activeStepIdx}
        className="animate-fade-in transition-opacity duration-300 [&>div]:rounded-t-none [&>div]:border-t-0"
      >
        <CodeBlock
          code={activeCode}
          language={language}
          lines={lines}
          startLine={startLine}
          highlight="all"
        />
      </div>
    </div>
  );
};

export default CodeMagicMove;
