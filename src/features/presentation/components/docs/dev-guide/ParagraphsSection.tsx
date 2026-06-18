import React, { useState } from 'react';
import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import { ClickStepsProvider } from '@/features/presentation';
import { Button } from '@/components/ui/button';
import { PlaygroundSection } from './PlaygroundSection';
import { SlideSchema } from '@/features/presentation/types/schema';

export const ParagraphsSection: React.FC = () => {
  const [title, setTitle] = useState('Calculation Principle');
  const [at, setAt] = useState(1);
  const [highlightVariant, setHighlightVariant] = useState<'paint' | 'marker' | 'rect' | 'text' | 'strike'>('paint');
  const [highlightText, setHighlightText] = useState('isolating total volume');
  const [activeStep, setActiveStep] = useState(1);
  const [mode, setMode] = useState<'schema' | 'manual'>('schema');

  const mockDeck: SlideSchema[] = [
    {
      id: 1,
      section: 'Docs',
      metadata: { title: 'Paragraphs', type: 'Doc' },
      layout: 'fullwidth',
      props: {
        title: title || undefined,
        element: {
          type: 'rich-paragraph',
          data: {
            fragments: [
              'Estimating concrete requires ',
              { highlight: highlightText || ' ', at, variant: highlightVariant },
              ' to prevent shortages.'
            ]
          }
        }
      }
    }
  ];

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
            variant={activeStep === 1 ? 'default' : 'outline'}
            onClick={() => setActiveStep(1)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step 1 (Highlight)
          </Button>
        </div>
      </div>

      <div className="border border-border/40 p-4 rounded-xl bg-card min-h-[120px] flex flex-col justify-center">
        <ClickStepsProvider currentClickOverride={activeStep}>
          <SlideSchemaEngine slideNo={1} deck={mockDeck} />
        </ClickStepsProvider>
      </div>
    </div>
  );

  const schemaCode = `const slideSchema: SlideSchema = {
  id: 1,
  section: 'Docs',
  layout: 'fullwidth',
  props: {
    title: "${title}",
    element: {
      type: 'rich-paragraph',
      data: {
        fragments: [
          "Estimating concrete requires ",
          { highlight: "${highlightText}", at: ${at}, variant: "${highlightVariant}" },
          " to prevent shortages."
        ]
      }
    }
  }
};`;

  const manualCode = `import { SlideParagraph } from '@/features/presentation';

// Required for multi-paragraph stagger reveals (Hybrid Strategy only)
<SlideParagraph
  title="${title}"
  revealMode="each-click"
  paragraphs={[
    "First paragraph...",
    "Second paragraph...",
    "Third paragraph..."
  ]}
/>`;

  const renderEditorContent = () => {
    if (mode === 'schema') {
      return (
        <div className="text-slate-300 space-y-1 text-[11px] font-mono select-text leading-relaxed">
          <div><span className="text-purple-400">const</span> slideSchema: <span className="text-teal-400">SlideSchema</span> = <span className="text-pink-400">&#123;</span></div>
          <div className="pl-4"><span className="text-teal-400">id</span>: <span className="text-orange-400">1</span>,</div>
          <div className="pl-4"><span className="text-teal-400">section</span>: <span className="text-amber-300">'Docs'</span>,</div>
          <div className="pl-4"><span className="text-teal-400">layout</span>: <span className="text-amber-300">'fullwidth'</span>,</div>
          <div className="pl-4"><span className="text-teal-400">props</span>: <span className="text-pink-400">&#123;</span></div>
          <div className="pl-8"><span className="text-teal-400">title</span>: <span className="text-amber-300">"</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-36 font-mono text-[10px] inline-block font-bold"
            />
            <span className="text-amber-300">"</span>,</div>
          <div className="pl-8"><span className="text-teal-400">element</span>: <span className="text-pink-400">&#123;</span></div>
          <div className="pl-12"><span className="text-teal-400">type</span>: <span className="text-amber-300">'rich-paragraph'</span>,</div>
          <div className="pl-12"><span className="text-teal-400">data</span>: <span className="text-pink-400">&#123;</span></div>
          <div className="pl-16"><span className="text-teal-400">fragments</span>: <span className="text-slate-400">[</span></div>
          <div className="pl-20"><span className="text-amber-300">"Estimating concrete requires "</span>,</div>
          <div className="pl-20"><span className="text-pink-400">&#123;</span> <span className="text-teal-400">highlight</span>: <span className="text-amber-300">"</span>
            <input
              type="text"
              value={highlightText}
              onChange={(e) => setHighlightText(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-36 font-mono text-[10px] inline-block"
            />
            <span className="text-amber-300">"</span>, <span className="text-teal-400">at</span>: <span className="text-orange-400">
              <input
                type="number"
                value={at}
                min={0}
                max={10}
                onChange={(e) => setAt(parseInt(e.target.value) || 1)}
                className="bg-slate-900 border border-white/10 rounded px-1 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-10 font-mono text-[10px] inline-block"
              />
            </span>, <span className="text-teal-400">variant</span>: <span className="text-amber-300">"</span>
            <select
              value={highlightVariant}
              onChange={(e) => setHighlightVariant(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded px-1 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[10px] inline-block cursor-pointer font-bold"
            >
              <option value="paint">paint</option>
              <option value="marker">marker</option>
              <option value="rect">rect</option>
              <option value="text">text</option>
              <option value="strike">strike</option>
            </select>
            <span className="text-amber-300">"</span> <span className="text-pink-400">&#125;</span>,</div>
          <div className="pl-20"><span className="text-amber-300">" to prevent shortages."</span></div>
          <div className="pl-16"><span className="text-slate-400">]</span></div>
          <div className="pl-12"><span className="text-pink-400">&#125;</span></div>
          <div className="pl-8"><span className="text-pink-400">&#125;</span></div>
          <div className="pl-4"><span className="text-pink-400">&#125;</span></div>
          <div><span className="text-pink-400">&#125;</span>;</div>
        </div>
      );
    }
    return (
      <div className="text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre select-text">
        {manualCode}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 bg-muted/40 border border-border/60 rounded-xl p-2.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1.5 mr-1 select-none">
          Format:
        </span>
        <div className="flex gap-1">
          <Button
            size="xs"
            variant={mode === 'schema' ? 'default' : 'outline'}
            onClick={() => setMode('schema')}
            className="h-6 text-[10px] font-semibold cursor-pointer"
          >
            Schema Config (Recommended)
          </Button>
          <Button
            size="xs"
            variant={mode === 'manual' ? 'default' : 'outline'}
            onClick={() => setMode('manual')}
            className="h-6 text-[10px] font-semibold cursor-pointer"
          >
            Raw Component (Hybrid reveals)
          </Button>
        </div>
      </div>

      <PlaygroundSection
        title="Paragraphs & Interactive Highlighting"
        description={
          mode === 'schema' ? (
            <span>
              <strong>Declarative Paragraph Schema:</strong> Use <code>rich-paragraph</code> to configure paragraph blocks containing strings and highlight points mapped to step indexes (e.g. <code>at: 1</code>).
            </span>
          ) : (
            <span>
              <strong>Raw JSX SlideParagraph (Hybrid):</strong> Multiple staggered paragraphs with reveal triggers (e.g., <code>revealMode="each-click"</code>) are not natively supported in slide schemas. Implement them as custom React slides.
            </span>
          )
        }
        preview={preview}
        codeText={mode === 'schema' ? schemaCode : manualCode}
        editorContent={renderEditorContent()}
      />
    </div>
  );
};

export default ParagraphsSection;
