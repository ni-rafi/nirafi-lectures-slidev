import React, { useState } from 'react';
import { PlaygroundSection } from './PlaygroundSection';
import LayoutElementsSection from './LayoutElementsSection';

type LayoutType = 'title' | 'twocolumn' | 'fullwidth' | 'grid' | 'thankyou';

export const LayoutsSection: React.FC = () => {
  const [layoutType, setLayoutType] = useState<LayoutType>('twocolumn');
  const [title, setTitle] = useState('Reinforcement Estimation');
  const [bgVariant, setBgVariant] = useState<'default' | 'calculation' | 'gallery'>('default');

  const renderWireframe = () => {
    switch (layoutType) {
      case 'title':
        return (
          <div className="w-full aspect-video border border-border/60 bg-muted/10 rounded-lg p-5 flex flex-col justify-between font-mono text-[9px] text-muted-foreground select-none">
            <div className="border border-dashed p-1.5 text-center text-primary font-bold text-xs">Title Header Area</div>
            <div className="flex flex-col gap-2 py-4">
              <div className="border border-dashed p-1 text-center">Subtitle Element</div>
              <div className="border border-dashed p-1 text-center">Description Text block</div>
            </div>
            <div className="flex justify-between border-t border-dashed pt-1.5">
              <span>Presenter Info</span>
              <span>Academic Department</span>
            </div>
          </div>
        );
      case 'twocolumn':
        return (
          <div className="w-full aspect-video border border-border/60 bg-muted/10 rounded-lg p-3 flex flex-col justify-between font-mono text-[9px] text-muted-foreground select-none">
            <div className="border border-dashed p-1 text-primary font-bold text-center mb-2">Slide Title: {title}</div>
            <div className="flex-1 flex gap-2 min-h-0 items-stretch">
              <div className="w-1/2 border border-dashed border-emerald-500/50 bg-emerald-500/5 p-2 flex flex-col items-center justify-center text-center">Left Column Content</div>
              <div className="w-1/2 border border-dashed border-blue-500/50 bg-blue-500/5 p-2 flex flex-col items-center justify-center text-center">Right Column Content</div>
            </div>
            <div className="border-t border-dashed mt-2 pt-1 text-center">Footer info</div>
          </div>
        );
      case 'fullwidth':
        return (
          <div className="w-full aspect-video border border-border/60 bg-muted/10 rounded-lg p-3 flex flex-col justify-between font-mono text-[9px] text-muted-foreground select-none">
            <div className="border border-dashed p-1 text-primary font-bold text-center mb-2">Slide Title: {title}</div>
            <div className="flex-1 border border-dashed border-amber-500/50 bg-amber-500/5 p-2 flex items-center justify-center text-center">
              Full Screen Width Panel
            </div>
            <div className="border-t border-dashed mt-2 pt-1 text-center">Footer info</div>
          </div>
        );
      case 'grid':
        return (
          <div className="w-full aspect-video border border-border/60 bg-muted/10 rounded-lg p-3 flex flex-col justify-between font-mono text-[9px] text-muted-foreground select-none">
            <div className="border border-dashed p-1 text-primary font-bold text-center mb-2">Slide Title: {title}</div>
            <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
              <div className="border border-dashed border-border/60 p-2 flex items-center justify-center text-center">Card 1</div>
              <div className="border border-dashed border-border/60 p-2 flex items-center justify-center text-center">Card 2</div>
              <div className="border border-dashed border-border/60 p-2 flex items-center justify-center text-center">Card 3</div>
              <div className="border border-dashed border-border/60 p-2 flex items-center justify-center text-center">Card 4</div>
            </div>
            <div className="border-t border-dashed mt-2 pt-1 text-center">Footer info</div>
          </div>
        );
      case 'thankyou':
        return (
          <div className="w-full aspect-video border border-border/60 bg-muted/10 rounded-lg p-5 flex flex-col items-center justify-center font-mono text-[9px] text-muted-foreground select-none text-center gap-2">
            <div className="text-xl font-bold text-primary">THANK YOU</div>
            <div className="border border-dashed p-1 px-4">Q&amp;A Details</div>
          </div>
        );
    }
  };

  const getCodeText = () => {
    switch (layoutType) {
      case 'title':
        return `const slideSchema: SlideSchema = {
  id: 1,
  section: 'Introduction',
  layout: 'title',
  props: {
    title: "${title}",
    subtitle: "Course Session 2026-27",
    description: "Volumetric casting analysis and scheduling methodologies.",
    footer: "Academic Department"
  }
};`;
      case 'twocolumn':
        return `const slideSchema: SlideSchema = {
  id: 2,
  section: 'Calculations',
  layout: 'twocolumn',
  props: {
    title: "${title}",
    bgVariant: "${bgVariant}",
    leftWidth: "50%",
    leftElement: { type: 'rich-paragraph', data: { fragments: ['Left content...'] } },
    rightElement: { type: 'latex', data: { formulaParts: ['W = \\\\frac{d^2}{162}'] } },
    footer: "Volumetric Calculator Sandbox"
  }
};`;
      case 'fullwidth':
        return `const slideSchema: SlideSchema = {
  id: 3,
  section: 'Analysis',
  layout: 'fullwidth',
  props: {
    title: "${title}",
    bgVariant: "${bgVariant}",
    element: { type: 'rich-paragraph', data: { fragments: ['Full width paragraph...'] } },
    footer: "Spreadsheet Data View"
  }
};`;
      case 'grid':
        return `import { GridLayout } from '@/shared/layouts/GridLayout';
 
// Grid is not supported by SlideSchemaEngine yet. Implement via Hybrid Strategy:
<GridLayout title="${title}" cols={2} bgVariant="${bgVariant}">
  <div>Card A</div>
  <div>Card B</div>
  <div>Card C</div>
  <div>Card D</div>
</GridLayout>`;
      case 'thankyou':
        return `const slideSchema: SlideSchema = {
  id: 4,
  section: 'Summary',
  layout: 'thankyou',
  props: {
    title: "Thank You",
    subtitle: "Questions & Answers session"
  }
};`;
    }
  };

  const renderEditorContent = () => {
    if (layoutType === 'grid') {
      return (
        <div className="text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre select-text">
          {getCodeText()}
        </div>
      );
    }

    return (
      <div className="text-slate-300 font-mono text-[11px] select-text space-y-1 leading-relaxed">
        <div><span className="text-purple-400">const</span> slideSchema: <span className="text-teal-400">SlideSchema</span> = <span className="text-pink-400">&#123;</span></div>
        <div className="pl-4"><span className="text-teal-400">id</span>: <span className="text-orange-400">1</span>,</div>
        <div className="pl-4"><span className="text-teal-400">section</span>: <span className="text-amber-300">'Docs'</span>,</div>
        <div className="pl-4"><span className="text-teal-400">layout</span>: <span className="text-amber-300">'</span>
          <select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value as LayoutType)}
            className="bg-slate-900 border border-white/10 rounded px-1 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[10px] inline-block cursor-pointer font-bold"
          >
            <option value="title">title</option>
            <option value="twocolumn">twocolumn</option>
            <option value="fullwidth">fullwidth</option>
            <option value="grid">grid</option>
            <option value="thankyou">thankyou</option>
          </select>
          <span className="text-amber-300">'</span>,</div>
        <div className="pl-4"><span className="text-teal-400">props</span>: <span className="text-pink-400">&#123;</span></div>
        <div className="pl-8"><span className="text-teal-400">title</span>: <span className="text-amber-300">"</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-primary/50 w-44 font-mono text-[10px] inline-block font-bold"
          />
          <span className="text-amber-300">"</span>,</div>
        {layoutType !== 'title' && layoutType !== 'thankyou' && (
          <div className="pl-8"><span className="text-teal-400">bgVariant</span>: <span className="text-amber-300">"</span>
            <select
              value={bgVariant}
              onChange={(e) => setBgVariant(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded px-1 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[10px] inline-block cursor-pointer font-bold"
            >
              <option value="default">default</option>
              <option value="calculation">calculation</option>
              <option value="gallery">gallery</option>
            </select>
            <span className="text-amber-300">"</span>,</div>
        )}
        <div className="pl-8"><span className="text-slate-400">... elements and footers ...</span></div>
        <div className="pl-4"><span className="text-pink-400">&#125;</span></div>
        <div><span className="text-pink-400">&#125;</span>;</div>
      </div>
    );
  };

  const getModeDescription = () => {
    if (layoutType === 'grid') {
      return (
        <span>
          <strong>GridLayout (Not Schema Native):</strong> Grid card layouts are not natively supported by the dynamic Slide Schema Engine. To build grids, apply the <strong>Hybrid Strategy</strong> by designing a raw React component slide and registering it in the slide registry.
        </span>
      );
    }
    return (
      <span>
        <strong>Declarative Layout Schema:</strong> Slide wireframe structures are driven by the <code>layout</code> string property in the schema (e.g. <code>title</code>, <code>twocolumn</code>, <code>fullwidth</code>, <code>thankyou</code>).
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-12">
      <PlaygroundSection
        title="Slide Layouts & Wireframes"
        description={getModeDescription()}
        preview={renderWireframe()}
        codeText={getCodeText()}
        editorContent={renderEditorContent()}
      />
      <LayoutElementsSection />
    </div>
  );
};

export default LayoutsSection;
