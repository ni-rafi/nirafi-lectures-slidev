import React, { useState, useEffect, useMemo, useId } from 'react';
import { useClickStepsContext } from '../../context/ClickStepsContext';
import { useTheme } from '@/context';

interface CodeBlockProps {
  code: string;
  language?: string;
  highlight?: string; // e.g. "{1,3}" or "{2-3|5|all}"
  lines?: boolean;
  startLine?: number;
}

interface Token {
  type: 'keyword' | 'type' | 'string' | 'number' | 'comment' | 'function' | 'operator' | 'text';
  value: string;
}

// Regex rules for lightweight client-side syntax tokenizing
const tokenizeLine = (text: string): Token[] => {
  const tokens: Token[] = [];
  let index = 0;
  while (index < text.length) {
    const sub = text.slice(index);
    const ws = sub.match(/^\s+/);
    if (ws) {
      tokens.push({ type: 'text', value: ws[0] });
      index += ws[0].length;
      continue;
    }
    const comment = sub.match(/^\/\/.*|^\/\*[\s\S]*?\*\//);
    if (comment) {
      tokens.push({ type: 'comment', value: comment[0] });
      index += comment[0].length;
      continue;
    }
    const str = sub.match(/^("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/);
    if (str) {
      tokens.push({ type: 'string', value: str[0] });
      index += str[0].length;
      continue;
    }
    const kw = sub.match(/^(const|let|var|function|return|import|export|class|if|else|for|while|switch|case|default|break|continue|new|this|typeof|try|catch|finally|throw|async|await|from|as|type|interface|enum|extends|implements|public|private|protected|readonly|static|export|default)\b/);
    if (kw) {
      tokens.push({ type: 'keyword', value: kw[0] });
      index += kw[0].length;
      continue;
    }
    const ty = sub.match(/^(string|number|boolean|any|unknown|never|void|undefined|null|Set|Map|Record|Array|Promise|React|FC)\b/);
    if (ty) {
      tokens.push({ type: 'type', value: ty[0] });
      index += ty[0].length;
      continue;
    }
    const fn = sub.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/);
    if (fn) {
      tokens.push({ type: 'function', value: fn[0] });
      index += fn[0].length;
      continue;
    }
    const num = sub.match(/^\d+(\.\d+)?\b/);
    if (num) {
      tokens.push({ type: 'number', value: num[0] });
      index += num[0].length;
      continue;
    }
    const op = sub.match(/^([+\-*/%&|^!=<>~?:]+)/);
    if (op) {
      tokens.push({ type: 'operator', value: op[0] });
      index += op[0].length;
      continue;
    }
    tokens.push({ type: 'text', value: sub.charAt(0) });
    index += 1;
  }
  return tokens;
};

// Parses a range string like "2-3" or "5" into line numbers
const parseLineRanges = (rangeStr: string): Set<number> | 'all' | 'none' => {
  const trimmed = rangeStr.trim();
  if (trimmed === 'all' || trimmed === '*' || trimmed === '') return 'all';
  if (trimmed === 'none' || trimmed === 'hide') return 'none';

  const lines = new Set<number>();
  const parts = trimmed.split(',');
  for (const part of parts) {
    const p = part.trim();
    if (!p) continue;
    if (p.includes('-')) {
      const [startStr, endStr] = p.split('-');
      const start = parseInt(startStr || '', 10);
      const end = parseInt(endStr || '', 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          lines.add(i);
        }
      }
    } else {
      const val = parseInt(p, 10);
      if (!isNaN(val)) {
        lines.add(val);
      }
    }
  }
  return lines;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  highlight = '',
  lines = true,
  startLine = 1,
}) => {
  const blockId = useId();
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

  // Extract clean lines from input code string
  const codeLines = useMemo(() => code.split('\n'), [code]);

  // Extract highlight configurations split by click stages
  const stages = useMemo(() => {
    if (!highlight) return ['all'];
    const cleaned = highlight.trim().replace(/^\{|\}$/g, '');
    return cleaned.split('|').map((s) => s.trim());
  }, [highlight]);

  useEffect(() => {
    if (stages.length <= 1) return;

    // Register click sequence starting with the base step
    const firstStep = registerClick(`${blockId}_0`, '+1');
    setBaseStep(firstStep);

    // Register subsequent relative steps for each animation state
    for (let i = 1; i < stages.length; i++) {
      registerClick(`${blockId}_${i}`, '+1');
    }

    return () => {
      deregisterClick(`${blockId}_0`);
      for (let i = 1; i < stages.length; i++) {
        deregisterClick(`${blockId}_${i}`);
      }
    };
  }, [blockId, stages.length, registerClick, deregisterClick]);

  // Determine current active highlight step relative to base step
  const activeStageIdx = useMemo(() => {
    if (stages.length <= 1 || baseStep === null) return 0;
    const diff = currentClick - baseStep;
    if (diff < 0) return 0;
    if (diff >= stages.length) return stages.length - 1;
    return diff;
  }, [stages.length, baseStep, currentClick]);

  const activeRangeStr = stages[activeStageIdx] || 'all';
  const highlightedLines = useMemo(() => parseLineRanges(activeRangeStr), [activeRangeStr]);

  // Tokenize lines for syntax rendering
  const tokenizedLines = useMemo(() => codeLines.map((l) => tokenizeLine(l)), [codeLines]);

  // Custom token styling classes mapping (adaptive to theme)
  const tokenClasses: Record<Token['type'], string> = {
    keyword: isLight ? 'text-purple-600 font-semibold' : 'text-purple-400 font-semibold',
    type: isLight ? 'text-teal-600 font-medium' : 'text-teal-400',
    string: isLight ? 'text-amber-700 font-mono' : 'text-amber-300 font-mono',
    number: isLight ? 'text-orange-655' : 'text-orange-400',
    comment: isLight ? 'text-slate-400/80 italic' : 'text-muted-foreground/60 italic',
    function: isLight ? 'text-blue-600 font-medium' : 'text-blue-400 font-medium',
    operator: isLight ? 'text-pink-600' : 'text-pink-400',
    text: isLight ? 'text-slate-800' : 'text-slate-100',
  };

  return (
    <div className={`w-full rounded-2xl border p-4 font-mono text-xs shadow-2xl backdrop-blur-md transition-all duration-300 select-text overflow-x-auto ${
      isLight 
        ? 'border-slate-200/80 bg-slate-50/95 text-slate-850 shadow-slate-200/50' 
        : 'border-white/10 bg-slate-950/80 text-slate-100'
    }`}>
      {language && (
        <div className={`mb-2 flex items-center justify-between border-b pb-2 text-[10px] uppercase tracking-wider ${
          isLight ? 'border-slate-250/30 text-slate-500' : 'border-white/5 text-muted-foreground'
        }`}>
          <span>{language}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      )}
      <pre className="m-0 leading-relaxed">
        <code>
          {tokenizedLines.map((tokens, idx) => {
            const lineNum = idx + 1;
            const displayLineNum = idx + startLine;
            
            // Check if current line is in the highlight index set
            const isHighlighted =
              highlightedLines === 'all' ||
              (highlightedLines !== 'none' && highlightedLines.has(lineNum));

            return (
              <div
                key={idx}
                className={`relative flex items-center px-2 py-0.5 rounded transition-all duration-300 ${
                  isHighlighted 
                    ? isLight
                      ? 'bg-primary/5 text-slate-900 font-medium'
                      : 'bg-primary/10'
                    : isLight
                      ? 'opacity-35 blur-[0.1px] saturate-75'
                      : 'opacity-25 blur-[0.2px] saturate-50'
                }`}
              >
                {lines && (
                  <span className={`w-8 select-none text-right pr-4 border-r mr-3 ${
                    isLight ? 'text-slate-400 border-slate-200/60' : 'text-muted-foreground/50 border-white/5'
                  }`}>
                    {displayLineNum}
                  </span>
                )}
                <span className="flex-1 whitespace-pre">
                  {tokens.map((token, tIdx) => (
                    <span key={tIdx} className={tokenClasses[token.type]}>
                      {token.value}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
