import React, { useState, useEffect, useId, useMemo } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClickStepsContext } from '../context/ClickStepsContext';

interface CodePlaygroundProps {
  code: string;
  language?: string;
  mode?: 'editor' | 'diff' | 'run';
  height?: string;
  autorun?: boolean;
  showOutputAt?: string | number; // click steps reveal trigger (e.g. "+1" or 2)
}

// Cleans TypeScript structures for running in native JavaScript JS Engine
const stripTypes = (ts: string): string => {
  let js = ts;
  js = js.replace(/import\s+[\s\S]*?\s+from\s+['"].*?['"];?/g, '');
  js = js.replace(/export\s+(default\s+)?/g, '');
  js = js.replace(/:\s*(number|string|boolean|any|unknown|void|Point|string\[\]|number\[\])\b/g, '');
  js = js.replace(/\s+as\s+(string|number|boolean|any|unknown|void)\b/g, '');
  js = js.replace(/(interface|type)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(=\s*)?\{[\s\S]*?\}/g, '');
  return js;
};

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  code,
  language = 'typescript',
  mode = 'editor',
  height = '220px',
  autorun = true,
  showOutputAt,
}) => {
  const playgroundId = useId();
  const { registerClick, deregisterClick, currentClick } = useClickStepsContext();
  const [baseStep, setBaseStep] = useState<number | null>(null);

  const [currentCode, setCurrentCode] = useState(code);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Parse original vs modified values for diff edits
  const { originalCode, modifiedCode } = useMemo(() => {
    if (mode !== 'diff') return { originalCode: '', modifiedCode: '' };
    const parts = code.split('~~~');
    return {
      originalCode: parts[0]?.trim() || '',
      modifiedCode: parts[1]?.trim() || '',
    };
  }, [code, mode]);

  // Handle slide clicks synchronization to reveal console outputs
  useEffect(() => {
    if (!showOutputAt || mode !== 'run') return;
    const step = registerClick(`${playgroundId}_output`, showOutputAt);
    setBaseStep(step);
    return () => deregisterClick(`${playgroundId}_output`);
  }, [playgroundId, showOutputAt, mode, registerClick, deregisterClick]);

  const outputRevealed = useMemo(() => {
    if (!showOutputAt || mode !== 'run') return true;
    if (baseStep === null) return false;
    return currentClick >= baseStep;
  }, [showOutputAt, mode, baseStep, currentClick]);

  // Execute sandboxed JS/TS code
  const executeCode = (srcToRun: string) => {
    setIsRunning(true);
    const logs: string[] = [];

    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };
    console.error = (...args) => {
      logs.push('[Error] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };

    try {
      const cleanedJS = stripTypes(srcToRun);
      // Run the cleaned JavaScript code in a scoped constructor function
      const runFn = new Function(cleanedJS);
      runFn();
    } catch (err) {
      logs.push('[Runtime Error] ' + String(err));
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setConsoleLogs(logs.length > 0 ? logs : ['Code executed successfully with no logs.']);
      setIsRunning(false);
    }
  };

  // Run automatically if autorun is configured
  useEffect(() => {
    if (mode === 'run' && autorun) {
      executeCode(code);
    }
  }, [code, mode, autorun]);

  const handleReset = () => {
    setCurrentCode(code);
    setConsoleLogs([]);
    if (mode === 'run' && autorun) {
      executeCode(code);
    }
  };

  return (
    <div className="w-full flex flex-col rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Top action header controls */}
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground select-none">
        <span>Monaco {mode} ({language})</span>
        <div className="flex items-center gap-2">
          {mode === 'run' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => executeCode(currentCode)}
              disabled={isRunning}
              className="h-6 gap-1 text-[10px] px-2 rounded-md font-mono"
            >
              <Play className="h-3 w-3" /> Run
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-6 w-6 p-0 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground"
            title="Reset code block"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div style={{ height }}>
        {mode === 'diff' ? (
          <DiffEditor
            original={originalCode}
            modified={modifiedCode}
            language={language}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollbar: { vertical: 'hidden' },
              lineNumbers: 'on',
              fontSize: 12,
            }}
          />
        ) : (
          <Editor
            value={currentCode}
            language={language}
            theme="vs-dark"
            onChange={(val) => setCurrentCode(val || '')}
            options={{
              readOnly: mode === 'editor' ? false : mode !== 'run',
              minimap: { enabled: false },
              scrollbar: { vertical: 'hidden' },
              lineNumbers: 'on',
              fontSize: 12,
              tabSize: 2,
            }}
          />
        )}
      </div>

      {/* Interactive terminal output */}
      {mode === 'run' && outputRevealed && (
        <div className="flex-1 border-t border-white/5 bg-black/50 p-3 font-mono text-[10px] transition-all duration-300">
          <div className="mb-1 flex items-center justify-between text-muted-foreground/60 select-none">
            <span>Console Output</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="max-h-24 overflow-y-auto flex flex-col gap-1 text-slate-300 select-text">
            {consoleLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.startsWith('[Error]') || log.startsWith('[Runtime Error]')
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePlayground;
