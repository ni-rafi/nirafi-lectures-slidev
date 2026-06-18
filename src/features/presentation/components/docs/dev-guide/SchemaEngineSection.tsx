import React, { useState } from 'react';
import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import { ClickStepsProvider } from '@/features/presentation';
import { Button } from '@/components/ui/button';
import { PlaygroundSection } from './PlaygroundSection';
import { SlideSchema } from '@/features/presentation/types/schema';

export const SchemaEngineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('Steel Reinforcement Estimation');

  const mockDeck: SlideSchema[] = [
    {
      id: 1,
      section: 'QS Sandbox',
      metadata: { title: 'Steel Sandbox', type: 'Theory Overview' },
      layout: 'twocolumn',
      props: {
        title: title,
        bgVariant: 'default',
        leftWidth: '45%',
        leftElement: {
          type: 'rich-paragraph',
          data: {
            fragments: [
              'Estimate rebar structures based on ',
              { highlight: 'unit weight (kg/m)', at: 1, variant: 'marker' },
              ' instead of length. Concrete aggregates must satisfy standard batching checks on site.'
            ]
          }
        },
        rightElement: {
          type: 'latex',
          config: { title: 'Standard Formula' },
          data: {
            formulaParts: [
              'W =',
              { highlight: '\\frac{d^2}{162} \\times L', at: 2, variant: 'text' }
            ]
          }
        }
      }
    }
  ];

  const preview = (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2 bg-muted/30 border border-border/50 rounded-xl p-2.5 justify-between flex-wrap">
        <span className="text-[10px] font-bold text-muted-foreground uppercase">
          Simulated Step: <span className="text-primary">{activeStep}</span>
        </span>
        <div className="flex gap-1 flex-wrap">
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
            Step 1 (Paragraph Highlight)
          </Button>
          <Button
            size="xs"
            variant={activeStep >= 2 ? 'default' : 'outline'}
            onClick={() => setActiveStep(2)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step 2 (Formula Highlight)
          </Button>
        </div>
      </div>

      <div className="border border-border/40 rounded-xl p-4 bg-slate-950 text-slate-100 min-h-[200px] flex flex-col justify-center">
        <ClickStepsProvider currentClickOverride={activeStep}>
          <SlideSchemaEngine slideNo={1} deck={mockDeck} />
        </ClickStepsProvider>
      </div>
    </div>
  );

  const codeText = `import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import { SlideSchema } from '@/features/presentation/types/schema';

// 1. Structured JSON-based Slide Schema configuration:
const lectureSchemaData: SlideSchema[] = [
  {
    id: 1,
    section: 'QS Sandbox',
    metadata: { title: 'Steel Sandbox', type: 'Theory Overview' },
    layout: 'twocolumn',
    props: {
      title: "${title}",
      bgVariant: 'default',
      leftWidth: '45%',
      leftElement: {
        type: 'rich-paragraph',
        data: {
          fragments: [
            'Estimate rebar structures based on ',
            { highlight: 'unit weight (kg/m)', at: 1, variant: 'marker' },
            ' instead of length.'
          ]
        }
      },
      rightElement: {
        type: 'latex',
        config: { title: 'Standard Formula' },
        data: {
          formulaParts: [
            'W =',
            { highlight: '\\\\frac{d^2}{162} \\\\times L', at: 2, variant: 'text' }
          ]
        }
      }
    }
  }
];

// 2. Inflated cleanly by a reusable parser engine:
<SlideSchemaEngine slideNo={1} deck={lectureSchemaData} />`;

  const editorContent = (
    <div className="text-slate-300 font-mono text-[11px] space-y-2">
      <div>
        <span className="text-muted-foreground">// Tweak Slide Schema Properties:</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-teal-400">title</span>=<span className="text-amber-300">"</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-60 font-mono text-[11px] inline-block font-bold"
        />
        <span className="text-amber-300">"</span>
      </div>
      <div className="pl-4">
        <span className="text-teal-400">leftElement.type</span>=<span className="text-amber-300">"rich-paragraph"</span>
      </div>
      <div className="pl-8 text-slate-400">
        fragments: [ ... ]
      </div>
      <div className="pl-4">
        <span className="text-teal-400">rightElement.type</span>=<span className="text-amber-300">"latex"</span>
      </div>
      <div className="pl-8 text-slate-400">
        formulaParts: [ ... ]
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Declarative Schema-Driven Layout Engine"
      description={
        <span>
          Eliminate boilerplate component creation and import fatigue by writing slides as plain, structured configuration objects. The polymorphic <code>&lt;SlideSchemaEngine&gt;</code> parses layout configurations and nests active element parameters (paragraphs, formulas, tables, calculators) automatically inside responsive layout wireframes.
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default SchemaEngineSection;
