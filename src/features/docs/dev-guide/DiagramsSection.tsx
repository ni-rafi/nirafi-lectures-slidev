import React, { useState } from 'react';
import { MermaidDiagram } from '@/features/presentation/components/elements/MermaidDiagram';
import { PlaygroundSection } from './PlaygroundSection';

export const DiagramsSection: React.FC = () => {
  const [definition, setDefinition] = useState(`graph TD
  A[Start Estimating] --> B{Choose Element}
  B -->|Slab| C[Length x Width x Thickness]
  B -->|Column| D[Length x Width x Height]`);
  const [scale, setScale] = useState(1);

  const preview = (
    <div className="w-full flex items-center justify-center p-2 overflow-auto bg-slate-950/20 rounded-xl border border-border/40">
      <MermaidDiagram definition={definition} scale={scale} />
    </div>
  );

  const codeText = `import { MermaidDiagram } from '@/features/presentation/components/elements';

const diagramDef = \`${definition}\`;

<MermaidDiagram
  definition={diagramDef}
  scale={${scale}}
/>`;

  const editorContent = (
    <div className="text-slate-300">
      <span className="text-purple-400">import</span> {'{ MermaidDiagram }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;{"\n\n"}
      <span className="text-purple-400">const</span> diagramDef = <span className="text-amber-300">`</span>{"\n"}
      <textarea
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
        rows={4}
        className="bg-slate-900 border border-white/10 rounded p-1.5 text-amber-300 focus:outline-none focus:border-primary/50 w-full font-mono text-[11px] block mt-1"
      />
      <span className="text-amber-300">`</span>;{"\n\n"}
      <span className="text-blue-400">&lt;MermaidDiagram</span>{"\n"}
      {"  "}<span className="text-teal-400">definition</span>=<span className="text-pink-400">&#123;</span>diagramDef<span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">scale</span>=<span className="text-pink-400">&#123;</span>
      <input
        type="number"
        step="0.1"
        value={scale}
        min={0.5}
        max={2}
        onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-14 font-mono text-[11px] inline-block"
      />
      <span className="text-pink-400">&#125;</span>{"\n"}
      <span className="text-blue-400">/&gt;</span>
    </div>
  );

  return (
    <PlaygroundSection
      title="Mermaid Diagrams & Flowcharts"
      description={
        <span>
          Render rich diagrams in presentation slides using KaTeX/Mermaid syntax. Wrap them in a <code>&lt;MermaidDiagram&gt;</code> component to compile the chart definition into an SVG inline, complete with custom scaling.
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default DiagramsSection;
