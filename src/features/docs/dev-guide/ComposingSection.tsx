import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlaygroundSection } from './PlaygroundSection';

const SCHEMA_CODE = `import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import { SlideSchema } from '@/features/presentation/types/schema';

// 1. Define clean, structured slide configuration
export const steelLectureData: SlideSchema[] = [
  {
    id: 1,
    section: 'Introduction',
    metadata: { title: 'Steel Cover', type: 'Cover' },
    layout: 'title',
    props: { title: 'Steel Estimation', bgVariant: 'default' }
  },
  {
    id: 2,
    section: 'Analysis',
    layout: 'twocolumn',
    props: {
      title: 'Rebar Properties',
      leftElement: { type: 'rich-paragraph', data: { fragments: ['Mild steel is flexible...'] } },
      rightElement: { type: 'latex', data: { formulaParts: ['W = \\\\frac{d^2}{162}'] } }
    }
  }
];

// 2. Map dynamically inside slides registry
const SchemaSlides = ({ slideNo }: { slideNo: number }) => (
  <SlideSchemaEngine slideNo={slideNo} deck={steelLectureData} />
);

export const slides: Record<number, React.ComponentType<any>> = {
  1: () => <SchemaSlides slideNo={1} />,
  2: () => <SchemaSlides slideNo={2} />,
};

export const slideMetadata = steelLectureData.reduce((acc, slide) => {
  acc[slide.id] = {
    title: slide.metadata?.title || 'Slide ' + slide.id,
    type: slide.metadata?.type || 'Slide',
    section: slide.section
  };
  return acc;
}, {} as Record<number, any>);`;

const HYBRID_CODE = `import React from 'react';
import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import { steelLectureData } from './steelLectureData';
import RebarCalculatorSandbox from '@/features/quantity-surveying/components/RebarCalculatorSandbox';

const SchemaSlides = ({ slideNo }: { slideNo: number }) => (
  <SlideSchemaEngine slideNo={slideNo} deck={steelLectureData} />
);

// Hybrid: Slide 1 & 2 use schema, Slide 3 is a custom interactive Sandbox widget
export const slides: Record<number, React.ComponentType<any>> = {
  1: () => <SchemaSlides slideNo={1} />,
  2: () => <SchemaSlides slideNo={2} />,
  3: RebarCalculatorSandbox, // Pure React full-page interactive sandbox
};

export const slideMetadata: Record<number, { title: string; type: string; section: string }> = {
  1: { title: 'Cover Slide', type: 'Cover', section: 'Intro' },
  2: { title: 'Rebar Theory', type: 'Theory', section: 'Intro' },
  3: { title: 'Interactive Estimator', type: 'Simulator', section: 'Sandbox' },
};`;

export const ComposingSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<'schema' | 'hybrid'>('schema');

  const renderSlidePreview = () => {
    switch (activeSlide) {
      case 1:
        return (
          <div className="w-full aspect-video border-2 border-primary/50 bg-slate-900 rounded-lg p-5 flex flex-col justify-between text-slate-200 select-none animate-in fade-in duration-300">
            <span className="text-[8px] font-mono text-muted-foreground uppercase">Slide 1: Cover Page</span>
            <div className="flex flex-col items-center gap-1.5 py-4 text-center">
              <h2 className="text-sm font-extrabold text-primary uppercase">Steel Reinforcement</h2>
              <p className="text-[10px] text-muted-foreground">Session 2026 • Lecture 3</p>
            </div>
            <div className="text-[9px] text-right font-mono text-muted-foreground/60">CE-QS Academic Department</div>
          </div>
        );
      case 2:
        return (
          <div className="w-full aspect-video border-2 border-primary/50 bg-slate-900 rounded-lg p-4 flex flex-col justify-between text-slate-200 select-none animate-in fade-in duration-300">
            <span className="text-[8px] font-mono text-muted-foreground uppercase">Slide 2: Two Column (Theory)</span>
            <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 pt-2 items-center">
              <div className="border border-dashed p-1.5 text-[9px] text-center text-emerald-400 bg-emerald-500/5">Rich Text Column</div>
              <div className="border border-dashed p-1.5 text-[9px] text-center text-blue-400 bg-blue-500/5">LaTeX Formula Column</div>
            </div>
            <div className="text-[8px] text-center font-mono text-muted-foreground/60">Steel Weight Equation</div>
          </div>
        );
      case 3:
        return (
          <div className="w-full aspect-video border-2 border-primary/50 bg-slate-900 rounded-lg p-5 flex flex-col justify-between text-slate-200 select-none animate-in fade-in duration-300">
            <span className="text-[8px] font-mono text-muted-foreground uppercase">Slide 3: Custom Sandbox Widget</span>
            <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center py-2">
              <div className="text-[10px] font-bold text-amber-400">Rebar interactive Calculator:</div>
              <div className="border border-dashed p-2 text-[9px] w-full max-w-[200px] text-slate-400">Custom Slider Forms, SVG diagrams & Live Storage Sync</div>
            </div>
            <div className="text-[8px] text-center font-mono text-muted-foreground/60">Interactive React Sandbox</div>
          </div>
        );
    }
  };

  const getCodeText = () => {
    return mode === 'schema' ? SCHEMA_CODE : HYBRID_CODE;
  };

  const renderEditorContent = () => {
    const code = getCodeText();
    return (
      <div className="text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre select-text">
        {code}
      </div>
    );
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'schema':
        return (
          <span>
            <strong>Declarative Slide Schemas (Recommended):</strong> Construct standard slides instantly without boilerplate code. slides are configured via type-safe JSON objects detailing sections, layouts, bullets, and equations.
          </span>
        );
      case 'hybrid':
        return (
          <span>
            <strong>Hybrid Strategy (Advanced Complexity):</strong> Combine declarative slide schemas for standard pages (cover, bullets, tables) with raw React components for complex interactive sandbox pages, giving the best of both worlds.
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Strategy Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-muted/40 border border-border/60 rounded-xl p-2.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1.5 mr-1 select-none">
          Composition Strategy:
        </span>
        <div className="flex gap-1 flex-wrap">
          <Button
            size="xs"
            variant={mode === 'schema' ? 'default' : 'outline'}
            onClick={() => setMode('schema')}
            className="h-6 text-[10px] font-semibold cursor-pointer"
          >
            Schema-Driven (Normal)
          </Button>
          <Button
            size="xs"
            variant={mode === 'hybrid' ? 'default' : 'outline'}
            onClick={() => setMode('hybrid')}
            className="h-6 text-[10px] font-semibold cursor-pointer"
          >
            Hybrid (Complex Sandbox)
          </Button>
        </div>
      </div>

      <PlaygroundSection
        title="Lecture Deck Composition"
        description={getModeDescription()}
        preview={
          <div className="flex flex-col gap-4 w-full animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 bg-muted/30 border border-border/50 rounded-xl p-2.5 justify-between select-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Slide Navigator Simulator</span>
              <span className="text-[10px] font-mono text-primary font-bold">{activeSlide} / 3</span>
            </div>
            {renderSlidePreview()}
            <div className="flex gap-1 justify-center mt-1">
              {[1, 2, 3].map((num) => (
                <Button
                  key={num}
                  size="xs"
                  variant={activeSlide === num ? 'default' : 'secondary'}
                  onClick={() => setActiveSlide(num as 1 | 2 | 3)}
                  className="h-5 w-8 text-[9px] font-mono cursor-pointer"
                >
                  S{num}
                </Button>
              ))}
            </div>
          </div>
        }
        codeText={getCodeText()}
        editorContent={renderEditorContent()}
      />
    </div>
  );
};

export default ComposingSection;
