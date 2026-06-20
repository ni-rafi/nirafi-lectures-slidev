import React from 'react';
import { LatexFormula } from '@/features/presentation/components/elements/LatexFormula';

// Helper to render bold text and inline math within a segment
const MathTextInner: React.FC<{ text: string }> = ({ text }) => {
  const inlines = text.split('$');
  return (
    <>
      {inlines.map((segment, sIdx) => {
        if (sIdx % 2 === 1) {
          return <LatexFormula key={sIdx} math={segment} />;
        }

        const bolds = segment.split('**');
        return (
          <span key={sIdx}>
            {bolds.map((boldText, bIdx) => {
              if (bIdx % 2 === 1) {
                return <strong key={bIdx} className="font-bold text-foreground">{boldText}</strong>;
              }
              return boldText;
            })}
          </span>
        );
      })}
    </>
  );
};

// Lightweight markdown and latex text parser
export const MathTextRenderer: React.FC<{ text: string }> = ({ text }) => {
  const preprocess = (str: string) => {
    let res = str.replace(/\\\[/g, '$$$$').replace(/\\\]/g, '$$$$');
    res = res.replace(/\\\(/g, '$').replace(/\\\)/g, '$');
    return res;
  };

  const trimmed = preprocess(text).trim();

  if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
    const math = trimmed.slice(2, -2);
    return <LatexFormula math={math} block />;
  }

  if (trimmed.startsWith('### ')) {
    const content = trimmed.slice(4);
    return (
      <h3 className="text-sm font-semibold text-primary mt-4 mb-2 border-b border-border/30 pb-1">
        <MathTextInner text={content} />
      </h3>
    );
  }
  if (trimmed.startsWith('#### ')) {
    const content = trimmed.slice(5);
    return (
      <h4 className="text-xs font-bold text-foreground mt-3 mb-1">
        <MathTextInner text={content} />
      </h4>
    );
  }

  if (trimmed.startsWith('- ')) {
    const content = trimmed.slice(2);
    return (
      <div className="flex items-start gap-2 pl-3 py-1 bg-muted/5 rounded-r-md">
        <span className="text-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
        <span className="leading-relaxed text-xs text-foreground/80">
          <MathTextInner text={content} />
        </span>
      </div>
    );
  }

  const blocks = trimmed.split('$$');
  return (
    <div className="math-text-block leading-relaxed py-1">
      {blocks.map((block, idx) => {
        if (idx % 2 === 1) {
          return <LatexFormula key={idx} math={block} block />;
        }
        return <MathTextInner key={idx} text={block} />;
      })}
    </div>
  );
};
