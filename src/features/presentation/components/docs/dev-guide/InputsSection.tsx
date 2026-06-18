import React, { useState } from 'react';
import { InteractiveCard } from '@/features/presentation/components/elements/InteractiveCard';
import { ParameterSlider } from '@/features/presentation/components/elements/ParameterSlider';
import { CalculationOutput } from '@/features/presentation/components/elements/CalculationOutput';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { SlideImage } from '@/features/presentation/components/elements/SlideImage';
import { PlaygroundSection } from './PlaygroundSection';
import { Button } from '@/components/ui/button';

export const InputsSection: React.FC = () => {
  // Playground settings state
  const [cardTitle, setCardTitle] = useState('Slab Volume Estimator');
  const sliderLabel = 'Slab Length';
  const outputTitle = 'Total Slab Volume';

  const unit = 'm';
  const min = 1;
  const max = 12;
  const step = 0.5;
  const showInput = true;
  const showSlider = true;

  // Interactive URL-synced parameter value
  const [length, setLength] = useUrlSyncedState<number>('length', 6.0);
  const calculatedVolume = parseFloat((length * 2.4 * 0.15).toFixed(3));

  const preview = (
    <div className="flex flex-col gap-4 w-full">
      <InteractiveCard title={cardTitle || undefined}>
        <SlideImage
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80"
          alt="Concrete slab grid"
          caption="Concrete reinforcing grid reference structure"
          maxHeight={140}
        />
        <ParameterSlider
          label={sliderLabel}
          value={length}
          unit={unit}
          min={min}
          max={max}
          step={step}
          showInput={showInput}
          showSlider={showSlider}
          onChange={setLength}
        />
        <div className="text-[10px] text-muted-foreground/80 leading-relaxed italic px-1 select-none">
          Formula: Volume = Length × 2.4m (Width) × 0.15m (Thickness)
        </div>
        <CalculationOutput
          title={outputTitle}
          value={calculatedVolume}
          unit={`${unit}³`}
        />
      </InteractiveCard>
    </div>
  );

  const [mode, setMode] = useState<'schema' | 'manual'>('schema');

  const schemaCode = `const slideSchema: SlideSchema = {
  id: 2,
  section: 'Calculations',
  layout: 'twocolumn',
  props: {
    title: "${cardTitle}",
    leftWidth: "50%",
    leftElement: {
      type: 'rebar-calculator-inputs'
    },
    rightElement: {
      type: 'rebar-calculator-outputs'
    }
  }
};`;

  const manualCode = `import { InteractiveCard, ParameterSlider, CalculationOutput } from '@/features/presentation';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';

// Inside a custom sandbox React component (Hybrid Strategy)
const [length, setLength] = useUrlSyncedState('length', 6.0);
const volume = (length * 2.4 * 0.15).toFixed(3);

return (
  <InteractiveCard title="${cardTitle}">
    <ParameterSlider
      label="${sliderLabel}"
      value={length}
      min={${min}}
      max={${max}}
      step={${step}}
      unit="${unit}"
      onChange={setLength}
    />
    <CalculationOutput
      title="${outputTitle}"
      value={volume}
      unit="${unit}³"
    />
  </InteractiveCard>
);`;

  const renderEditorContent = () => {
    if (mode === 'schema') {
      return (
        <div className="text-slate-300 space-y-1 text-[11px] font-mono select-text leading-relaxed">
          <div><span className="text-purple-400">const</span> slideSchema: <span className="text-teal-400">SlideSchema</span> = <span className="text-pink-400">&#123;</span></div>
          <div className="pl-4"><span className="text-teal-400">id</span>: <span className="text-orange-400">2</span>,</div>
          <div className="pl-4"><span className="text-teal-400">section</span>: <span className="text-amber-300">'Calculations'</span>,</div>
          <div className="pl-4"><span className="text-teal-400">layout</span>: <span className="text-amber-300">'twocolumn'</span>,</div>
          <div className="pl-4"><span className="text-teal-400">props</span>: <span className="text-pink-400">&#123;</span></div>
          <div className="pl-8"><span className="text-teal-400">title</span>: <span className="text-amber-300">"</span>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-40 font-mono text-[10px] inline-block font-bold"
            />
            <span className="text-amber-300">"</span>,</div>
          <div className="pl-8"><span className="text-teal-400">leftWidth</span>: <span className="text-amber-300">"50%"</span>,</div>
          <div className="pl-8"><span className="text-teal-400">leftElement</span>: <span className="text-pink-400">&#123;</span> <span className="text-teal-400">type</span>: <span className="text-amber-300">'rebar-calculator-inputs'</span> <span className="text-pink-400">&#125;</span>,</div>
          <div className="pl-8"><span className="text-teal-400">rightElement</span>: <span className="text-pink-400">&#123;</span> <span className="text-teal-400">type</span>: <span className="text-amber-300">'rebar-calculator-outputs'</span> <span className="text-pink-400">&#125;</span></div>
          <div className="pl-4"><span className="text-pink-400">&#125;</span></div>
          <div><span className="text-pink-400">&#125;</span>;</div>
        </div>
      );
    }

    return (
      <div className="text-slate-300 font-mono text-[11px] select-text leading-relaxed whitespace-pre">
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
            Raw Component (Hybrid custom state)
          </Button>
        </div>
      </div>

      <PlaygroundSection
        title="Parameter Panels & Synced Slider Inputs"
        description={
          mode === 'schema' ? (
            <span>
              <strong>Declarative Calculator Schemas:</strong> Predefined calculation panels (e.g. <code>rebar-calculator-inputs</code> and <code>rebar-calculator-outputs</code>) can be embedded directly in layout elements using the schema.
            </span>
          ) : (
            <span>
              <strong>Raw Synced Sliders (Hybrid Strategy):</strong> Create custom, reactive sliders and calculation layouts by invoking the <code>useUrlSyncedState(key, defaultValue)</code> hook. This syncs slider changes directly with scoped query search parameters in the browser URL.
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

export default InputsSection;
