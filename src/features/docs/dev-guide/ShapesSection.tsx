import React, { useState } from 'react';
import { ShapeMorph } from '@/features/presentation/components/elements/ShapeMorph';
import { PlaygroundSection } from './PlaygroundSection';

export const ShapesSection: React.FC = () => {
  const [type, setType] = useState('star');
  const [size, setSize] = useState(100);
  const [duration, setDuration] = useState(800);
  const [fill, setFill] = useState('var(--color-primary, #6366f1)');

  const preview = (
    <div className="w-full flex items-center justify-center py-4 select-none">
      <svg width={size + 20} height={size + 20} className="overflow-visible">
        <g transform={`translate(10, 10)`}>
          <ShapeMorph
            type={type}
            size={size}
            fill={fill}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={1.5}
          />
        </g>
      </svg>
    </div>
  );

  const codeText = `import { ShapeMorph } from '@/features/presentation/components/elements';

<svg width={${size + 20}} height={${size + 20}}>
  <ShapeMorph
    type="${type}"
    size={${size}}
    duration={${duration}}
    fill="${fill}"
  />
</svg>`;

  const editorContent = (
    <div className="text-slate-300">
      <span className="text-purple-400">import</span> {'{ ShapeMorph }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;{"\n\n"}
      <span className="text-blue-400">&lt;ShapeMorph</span>{"\n"}
      {"  "}<span className="text-teal-400">type</span>=<span className="text-amber-300">"</span>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer font-bold"
      >
        <option value="circle">circle</option>
        <option value="rect">rect</option>
        <option value="triangle">triangle</option>
        <option value="star">star</option>
        <option value="arrow">arrow</option>
        <option value="pentagon">pentagon</option>
        <option value="hexagon">hexagon</option>
        <option value="cross">cross</option>
        <option value="heart">heart</option>
        <option value="parallelogram">parallelogram</option>
        <option value="rhombus">rhombus</option>
      </select>
      <span className="text-amber-300">"</span>{"\n"}
      {"  "}<span className="text-teal-400">size</span>=<span className="text-pink-400">&#123;</span>
      <input
        type="number"
        value={size}
        min={40}
        max={160}
        onChange={(e) => setSize(parseInt(e.target.value) || 80)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-14 font-mono text-[11px] inline-block"
      />
      <span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">duration</span>=<span className="text-pink-400">&#123;</span>
      <input
        type="number"
        value={duration}
        min={100}
        max={3000}
        onChange={(e) => setDuration(parseInt(e.target.value) || 800)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-16 font-mono text-[11px] inline-block"
      />
      <span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">fill</span>=<span className="text-amber-300">"</span>
      <input
        type="text"
        value={fill}
        onChange={(e) => setFill(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-48 font-mono text-[11px] inline-block"
      />
      <span className="text-amber-300">"</span>{"\n"}
      <span className="text-blue-400">/&gt;</span>
    </div>
  );

  return (
    <PlaygroundSection
      title="Vector Shape Morphs"
      description={
        <span>
          Use <code>&lt;ShapeMorph&gt;</code> to render shapes that morph dynamically on state transitions. It automatically calculates and interpolates vertices to ensure smooth path transforms.
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default ShapesSection;
