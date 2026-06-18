import React, { useState } from 'react';
import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import { ClickStepsProvider } from '@/features/presentation';
import { Button } from '@/components/ui/button';
import { PlaygroundSection } from './PlaygroundSection';
import { SlideSchema } from '@/features/presentation/types/schema';

export const ListsSection: React.FC = () => {
  const [listTitle, setListTitle] = useState('Measurement Guidelines');
  const [revealMode, setRevealMode] = useState<'each-click' | 'all-click' | 'auto-stagger' | 'none'>('each-click');
  const [activeStep, setActiveStep] = useState(1);

  const mockDeck: SlideSchema[] = [
    {
      id: 1,
      section: 'Docs',
      metadata: { title: 'Lists', type: 'Doc' },
      layout: 'fullwidth',
      props: {
        title: 'Guidelines',
        element: {
          type: 'list',
          config: { revealMode },
          data: {
            listTitle: listTitle || undefined,
            items: [
              {
                title: 'Structural Thickness:',
                text: 'Maintain a 0.150m minimum bound for all floor slabs to resist shear load.',
              },
              {
                title: 'Calculation Precision:',
                text: 'Round intermediate values to 4 decimals, and final outputs to exactly 3 decimals.',
              },
              {
                title: 'Material Grading:',
                text: 'Ensure concrete grade is minimum C25/30 for load-bearing structures.',
              },
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
            Step 1
          </Button>
          <Button
            size="xs"
            variant={activeStep === 2 ? 'default' : 'outline'}
            onClick={() => setActiveStep(2)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step 2
          </Button>
          <Button
            size="xs"
            variant={activeStep === 3 ? 'default' : 'outline'}
            onClick={() => setActiveStep(3)}
            className="h-6 text-[9px] font-mono cursor-pointer"
          >
            Step 3
          </Button>
        </div>
      </div>

      <div className="border border-border/40 p-4 rounded-xl bg-card">
        <ClickStepsProvider currentClickOverride={activeStep}>
          <SlideSchemaEngine slideNo={1} deck={mockDeck} />
        </ClickStepsProvider>
      </div>
    </div>
  );

  const codeText = `const slideSchema: SlideSchema = {
  id: 1,
  section: 'Docs',
  layout: 'fullwidth',
  props: {
    title: "Guidelines",
    element: {
      type: 'list',
      config: { revealMode: "${revealMode}" },
      data: {
        listTitle: "${listTitle}",
        items: [
          {
            title: "Structural Thickness:",
            text: "Maintain a 0.150m minimum bound for all floor slabs to resist shear load."
          },
          {
            title: "Calculation Precision:",
            text: "Round intermediate values to 4 decimals, and final outputs to exactly 3 decimals."
          },
          {
            title: "Material Grading:",
            text: "Ensure concrete grade is minimum C25/30 for load-bearing structures."
          }
        ]
      }
    }
  }
};`;

  const editorContent = (
    <div className="text-slate-300 space-y-1 text-[11px] font-mono select-text leading-relaxed">
      <div><span className="text-purple-400">const</span> slideSchema: <span className="text-teal-400">SlideSchema</span> = <span className="text-pink-400">&#123;</span></div>
      <div className="pl-4"><span className="text-teal-400">id</span>: <span className="text-orange-400">1</span>,</div>
      <div className="pl-4"><span className="text-teal-400">section</span>: <span className="text-amber-300">'Docs'</span>,</div>
      <div className="pl-4"><span className="text-teal-400">layout</span>: <span className="text-amber-300">'fullwidth'</span>,</div>
      <div className="pl-4"><span className="text-teal-400">props</span>: <span className="text-pink-400">&#123;</span></div>
      <div className="pl-8"><span className="text-teal-400">title</span>: <span className="text-amber-300">"Guidelines"</span>,</div>
      <div className="pl-8"><span className="text-teal-400">element</span>: <span className="text-pink-400">&#123;</span></div>
      <div className="pl-12"><span className="text-teal-400">type</span>: <span className="text-amber-300">'list'</span>,</div>
      <div className="pl-12"><span className="text-teal-400">config</span>: <span className="text-pink-400">&#123;</span> <span className="text-teal-400">revealMode</span>: <span className="text-amber-300">"</span>
        <select
          value={revealMode}
          onChange={(e) => {
            setRevealMode(e.target.value as any);
            setActiveStep(1);
          }}
          className="bg-slate-900 border border-white/10 rounded px-1 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[10px] inline-block cursor-pointer font-bold"
        >
          <option value="each-click">each-click</option>
          <option value="all-click">all-click</option>
          <option value="auto-stagger">auto-stagger</option>
          <option value="none">none</option>
        </select>
        <span className="text-amber-300">"</span> <span className="text-pink-400">&#125;</span>,</div>
      <div className="pl-12"><span className="text-teal-400">data</span>: <span className="text-pink-400">&#123;</span></div>
      <div className="pl-16"><span className="text-teal-400">listTitle</span>: <span className="text-amber-300">"</span>
        <input
          type="text"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-44 font-mono text-[10px] inline-block font-bold"
        />
        <span className="text-amber-300">"</span>,</div>
      <div className="pl-16"><span className="text-teal-400">items</span>: <span className="text-slate-400">[</span> ... <span className="text-slate-400">]</span></div>
      <div className="pl-12"><span className="text-pink-400">&#125;</span></div>
      <div className="pl-8"><span className="text-pink-400">&#125;</span></div>
      <div className="pl-4"><span className="text-pink-400">&#125;</span></div>
      <div><span className="text-pink-400">&#125;</span>;</div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Lists & Bullets"
      description={
        <span>
          Use the <code>list</code> element type inside your Slide Schema to render styled lists. Customize list activation using <code>config.revealMode</code>: <code>each-click</code> (reveal item-by-item on clicks), <code>all-click</code> (reveal list content all at once), and <code>auto-stagger</code> (reveal items staggered automatically).
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default ListsSection;
