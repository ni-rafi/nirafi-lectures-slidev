import React, { useState } from 'react';
import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import { ClickHighlight } from '@/features/presentation/components/elements/ClickHighlight';
import { ClickReveal } from '@/features/presentation/components/elements/ClickReveal';
import { ClickStepsProvider } from '@/features/presentation/context';
import { Button } from '@/components/ui/button';
import { PlaygroundSection } from './PlaygroundSection';
import { SlideSchema } from '@/features/presentation/types/schema';

export const TablesSection: React.FC = () => {
  const [striped, setStriped] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [hoverable, setHoverable] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [highlightVal, setHighlightVal] = useState('12.500');

  const mockDeck: SlideSchema[] = [
    {
      id: 1,
      section: 'Docs',
      metadata: { title: 'Tables', type: 'Doc' },
      layout: 'fullwidth',
      props: {
        title: 'Concrete Quantities',
        element: {
          type: 'table',
          config: { striped, bordered, hoverable },
          data: {
            headers: [
              { label: 'Item Code', align: 'left' },
              { label: 'Description', align: 'left' },
              { label: 'Qty', align: 'right' },
              { label: 'Unit', align: 'center' },
              { label: 'Rate ($)', align: 'right', revealAt: 2 }
            ],
            rows: [
              [
                '1.1',
                'In-situ columns grade C30',
                <ClickHighlight key="c1" at={1} variant="paint">{highlightVal || ' '}</ClickHighlight>,
                'm³',
                <ClickReveal key="r1" at={3}>120.00</ClickReveal>
              ],
              [
                '1.2',
                'Reinforcement bars high yield steel',
                '1,240',
                'kg',
                <ClickReveal key="r2" at={3}>1.50</ClickReveal>
              ]
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
            Step 1 (Highlight Qty)
          </Button>
          <Button
            size="xs"
            variant={activeStep === 2 ? 'default' : 'outline'}
            onClick={() => setActiveStep(2)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step 2 (Add Column)
          </Button>
          <Button
            size="xs"
            variant={activeStep >= 3 ? 'default' : 'outline'}
            onClick={() => setActiveStep(3)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step 3 (Fill Cells)
          </Button>
        </div>
      </div>

      <ClickStepsProvider currentClickOverride={activeStep}>
        <SlideSchemaEngine slideNo={1} deck={mockDeck} />
      </ClickStepsProvider>
    </div>
  );

  const codeText = `const slideSchema: SlideSchema = {
  id: 1,
  section: 'Docs',
  layout: 'fullwidth',
  props: {
    title: "Concrete Quantities",
    element: {
      type: 'table',
      config: {
        striped: ${striped},
        bordered: ${bordered},
        hoverable: ${hoverable}
      },
      data: {
        headers: [
          { label: 'Item Code', align: 'left' },
          { label: 'Description', align: 'left' },
          { label: 'Qty', align: 'right' },
          { label: 'Unit', align: 'center' },
          { label: 'Rate ($)', align: 'right', revealAt: 2 }
        ],
        rows: [
          [
            '1.1',
            'In-situ columns grade C30',
            <ClickHighlight at={1} variant="paint">${highlightVal}</ClickHighlight>,
            'm³',
            <ClickReveal at={3}>120.00</ClickReveal>
          ],
          [
            '1.2',
            'Reinforcement bars high yield steel',
            '1,240',
            'kg',
            <ClickReveal at={3}>1.50</ClickReveal>
          ]
        ]
      }
    }
  }
};`;

  const editorContent = (
    <div className="text-slate-300 font-mono text-[11px] select-text space-y-2">
      <div>
        <span className="text-teal-400">table.config</span> = <span className="text-pink-400">&#123;</span>
      </div>
      <div className="pl-4">
        <span className="text-teal-400">striped</span>:
        <select
          value={String(striped)}
          onChange={(e) => setStriped(e.target.value === 'true')}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-purple-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer font-bold ml-1.5"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>,
      </div>
      <div className="pl-4">
        <span className="text-teal-400">bordered</span>:
        <select
          value={String(bordered)}
          onChange={(e) => setBordered(e.target.value === 'true')}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-purple-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer font-bold ml-1.5"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>,
      </div>
      <div className="pl-4">
        <span className="text-teal-400">hoverable</span>:
        <select
          value={String(hoverable)}
          onChange={(e) => setHoverable(e.target.value === 'true')}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-purple-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer font-bold ml-1.5"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      <div>
        <span className="text-pink-400">&#125;</span>
      </div>
      <div>
        <span className="text-teal-400">highlightVal</span> = "
        <input
          type="text"
          value={highlightVal}
          onChange={(e) => setHighlightVal(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-20 font-mono text-[11px] inline-block"
        />
        "
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Tables, Step Column Reveals & Cell-Level Highlights"
      description={
        <span>
          Use the <code>table</code> element type inside your Slide Schema to render structured grids. Headers accept alignment and optional <code>revealAt</code> properties to add columns step-by-step. Nest <code>&lt;ClickReveal&gt;</code> inside cell arrays to fill cell data step-by-step, or <code>&lt;ClickHighlight&gt;</code> to emphasize specific cell values.
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default TablesSection;
