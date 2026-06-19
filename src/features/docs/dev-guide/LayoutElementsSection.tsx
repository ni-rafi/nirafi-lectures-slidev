import React, { useState } from 'react';
import { PlaygroundSection } from './PlaygroundSection';
import { SlideTwoColumns, SlideGrid, SlideQuote, SlideImage } from '@/features/presentation/components/elements/SlideContent';

export const LayoutElementsSection: React.FC = () => {
  const [componentType, setComponentType] = useState<'twocolumns' | 'grid' | 'quote' | 'image'>('twocolumns');

  // SlideTwoColumns state
  const [ratio, setRatio] = useState<'1:1' | '2:1' | '1:2'>('1:1');
  const [align, setAlign] = useState<'start' | 'center' | 'end'>('center');

  // SlideGrid state
  const [cols, setCols] = useState<1 | 2 | 3 | 4>(3);

  // SlideQuote state
  const [quoteText, setQuoteText] = useState('Estimating concrete requires isolating total volume to prevent shortages.');
  const [author, setAuthor] = useState('Prof. Rafi');
  const [source, setSource] = useState('QS Lecture Session 4');

  // SlideImage state
  const [caption, setCaption] = useState('Figure 2.1: Foundation reinforcing mesh alignment.');
  const [zoomable, setZoomable] = useState(true);

  const imageUrl = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80';

  const renderPreview = () => {
    switch (componentType) {
      case 'twocolumns':
        return (
          <div className="border border-border/40 p-4 rounded-xl bg-card w-full">
            <SlideTwoColumns
              ratio={ratio}
              align={align}
              left={
                <div className="p-4 border border-dashed border-primary/40 rounded-xl text-center bg-primary/5">
                  <h4 className="font-bold text-primary mb-1">Left Column</h4>
                  <p className="text-xs text-muted-foreground">Dimensions, inputs, and formulas</p>
                </div>
              }
              right={
                <div className="p-4 border border-dashed border-primary/40 rounded-xl text-center bg-primary/5">
                  <h4 className="font-bold text-primary mb-1">Right Column</h4>
                  <p className="text-xs text-muted-foreground">Output, graphs, and results</p>
                </div>
              }
            />
          </div>
        );
      case 'grid':
        return (
          <div className="border border-border/40 p-4 rounded-xl bg-card w-full">
            <SlideGrid cols={cols}>
              <div className="p-3 border border-border/80 rounded-xl text-center bg-muted/20">Card A</div>
              <div className="p-3 border border-border/80 rounded-xl text-center bg-muted/20">Card B</div>
              <div className="p-3 border border-border/80 rounded-xl text-center bg-muted/20">Card C</div>
              {cols >= 4 && <div className="p-3 border border-border/80 rounded-xl text-center bg-muted/20">Card D</div>}
            </SlideGrid>
          </div>
        );
      case 'quote':
        return (
          <div className="border border-border/40 p-4 rounded-xl bg-card w-full">
            <SlideQuote quote={quoteText} author={author || undefined} source={source || undefined} />
          </div>
        );
      case 'image':
        return (
          <div className="border border-border/40 p-4 rounded-xl bg-card w-full">
            <SlideImage src={imageUrl} alt="Demo reinforce concrete" caption={caption} zoomable={zoomable} maxWidth={400} />
          </div>
        );
    }
  };

  const getCodeText = () => {
    switch (componentType) {
      case 'twocolumns':
        return `import { SlideTwoColumns } from '@/features/presentation/components/elements';

<SlideTwoColumns
  ratio="${ratio}"
  align="${align}"
  left={<LeftPanel />}
  right={<RightPanel />}
/>`;
      case 'grid':
        return `import { SlideGrid } from '@/features/presentation/components/elements';

<SlideGrid cols={${cols}}>
  <div>Card A</div>
  <div>Card B</div>
  <div>Card C</div>
</SlideGrid>`;
      case 'quote':
        return `import { SlideQuote } from '@/features/presentation/components/elements';

<SlideQuote
  quote="${quoteText}"
  author="${author}"
  source="${source}"
/>`;
      case 'image':
        return `import { SlideImage } from '@/features/presentation/components/elements';

<SlideImage
  src="concrete-reinforce.jpg"
  alt="Concrete mesh"
  caption="${caption}"
  zoomable={${zoomable}}
  maxWidth={400}
/>`;
    }
  };

  const renderEditor = () => {
    return (
      <div className="text-slate-300 space-y-3 text-[11px] font-mono">
        <div>
          <span className="text-muted-foreground">// Choose Layout Element:</span>{"\n"}
          &lt;<span className="text-blue-400">ElementSelector</span> <span className="text-teal-400">type</span>=<span className="text-amber-300">"</span>
          <select
            value={componentType}
            onChange={(e) => setComponentType(e.target.value as any)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer font-bold"
          >
            <option value="twocolumns">SlideTwoColumns</option>
            <option value="grid">SlideGrid</option>
            <option value="quote">SlideQuote</option>
            <option value="image">SlideImage</option>
          </select>
          <span className="text-amber-300">"</span> /&gt;
        </div>

        {componentType === 'twocolumns' && (
          <div className="space-y-1">
            <span className="text-muted-foreground">// Tweak SlideTwoColumns Props:</span>
            <div>
              {"  "}<span className="text-teal-400">ratio</span>=<span className="text-amber-300">"</span>
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value as any)}
                className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="1:1">1:1 (equal)</option>
                <option value="2:1">2:1 (wide left)</option>
                <option value="1:2">1:2 (wide right)</option>
              </select>
              <span className="text-amber-300">"</span>
            </div>
            <div>
              {"  "}<span className="text-teal-400">align</span>=<span className="text-amber-300">"</span>
              <select
                value={align}
                onChange={(e) => setAlign(e.target.value as any)}
                className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="center">center</option>
                <option value="start">start</option>
                <option value="end">end</option>
              </select>
              <span className="text-amber-300">"</span>
            </div>
          </div>
        )}

        {componentType === 'grid' && (
          <div className="space-y-1">
            <span className="text-muted-foreground">// Tweak SlideGrid Props:</span>
            <div>
              {"  "}<span className="text-teal-400">cols</span>=<span className="text-pink-400">&#123;</span>
              <select
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) as any)}
                className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
              <span className="text-pink-400">&#125;</span>
            </div>
          </div>
        )}

        {componentType === 'quote' && (
          <div className="space-y-1.5">
            <span className="text-muted-foreground">// Tweak SlideQuote Props:</span>
            <div className="flex items-center gap-1">
              {"  "}<span className="text-teal-400">quote</span>=<span className="text-amber-300">"</span>
              <input
                type="text"
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-60 font-mono text-[11px]"
              />
              <span className="text-amber-300">"</span>
            </div>
            <div className="flex items-center gap-1">
              {"  "}<span className="text-teal-400">author</span>=<span className="text-amber-300">"</span>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-36 font-mono text-[11px]"
              />
              <span className="text-amber-300">"</span>
            </div>
            <div className="flex items-center gap-1">
              {"  "}<span className="text-teal-400">source</span>=<span className="text-amber-300">"</span>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-36 font-mono text-[11px]"
              />
              <span className="text-amber-300">"</span>
            </div>
          </div>
        )}

        {componentType === 'image' && (
          <div className="space-y-1">
            <span className="text-muted-foreground">// Tweak SlideImage Props:</span>
            <div className="flex items-center gap-1">
              {"  "}<span className="text-teal-400">caption</span>=<span className="text-amber-300">"</span>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-60 font-mono text-[11px]"
              />
              <span className="text-amber-300">"</span>
            </div>
            <div>
              {"  "}<span className="text-teal-400">zoomable</span>=<span className="text-pink-400">&#123;</span>
              <select
                value={zoomable ? 'true' : 'false'}
                onChange={(e) => setZoomable(e.target.value === 'true')}
                className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
              <span className="text-pink-400">&#125;</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PlaygroundSection
      title="Reusable Layout & Presentation Blocks"
      description={
        <span>
          Use reusable presentation blocks to layout slide structures cleanly without custom CSS or tailwind hacks. These elements automatically adapt their spacing, backgrounds, shadows, and flex columns when rendered under Scroll/Blog mode.
        </span>
      }
      preview={renderPreview()}
      codeText={getCodeText()}
      editorContent={renderEditor()}
    />
  );
};

export default LayoutElementsSection;
