import React, { useState } from 'react';
import { PhysicsSandbox } from '@/features/presentation/components/elements/PhysicsSandbox';
import { ShapeData, ConnectorData } from '@/features/presentation/components/elements/physicsHelpers';
import { PlaygroundSection } from './PlaygroundSection';

export const PhysicsSection: React.FC = () => {
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [gravity, setGravity] = useState(1);
  const [bounciness, setBounciness] = useState(0.6);
  const [jointStiffness, setJointStiffness] = useState(0.05);

  const shapes: ShapeData[] = [
    { id: 'n1', type: 'circle', x: 90, y: 40, size: 40, label: 'A', fill: 'var(--color-primary, #6366f1)' },
    { id: 'n2', type: 'rect', x: 150, y: 70, size: 40, label: 'B', fill: '#10b981' },
    { id: 'n3', type: 'star', x: 210, y: 110, size: 40, label: 'C', fill: '#f59e0b' }
  ];

  const connectors: ConnectorData[] = [
    { id: 'c1', from: 'n1', to: 'n2' },
    { id: 'c2', from: 'n2', to: 'n3' }
  ];

  const preview = (
    <div className="w-full flex flex-col gap-2">
      <div className="h-[200px] w-full rounded-xl overflow-hidden shadow-inner border border-border/40 bg-slate-950/20">
        <PhysicsSandbox
          shapes={shapes}
          connectors={connectors}
          physicsEnabled={physicsEnabled}
          width={300}
          height={200}
          gravity={gravity}
          bounciness={bounciness}
          jointStiffness={jointStiffness}
        />
      </div>
      <div className="text-[10px] text-muted-foreground text-center select-none">
        💡 Hover & drag the nodes A, B, C directly inside the preview above!
      </div>
    </div>
  );

  const codeText = `import { PhysicsSandbox } from '@/features/presentation/components/elements';

const shapes = [
  { id: 'n1', type: 'circle', x: 90, y: 40, size: 40, label: 'A', fill: 'var(--color-primary)' },
  { id: 'n2', type: 'rect', x: 150, y: 70, size: 40, label: 'B', fill: '#10b981' },
  { id: 'n3', type: 'star', x: 210, y: 110, size: 40, label: 'C', fill: '#f59e0b' }
];

const connectors = [
  { id: 'c1', from: 'n1', to: 'n2' },
  { id: 'c2', from: 'n2', to: 'n3' }
];

<PhysicsSandbox
  shapes={shapes}
  connectors={connectors}
  physicsEnabled={${physicsEnabled}}
  gravity={${gravity}}
  bounciness={${bounciness}}
  jointStiffness={${jointStiffness}}
/>`;

  const editorContent = (
    <div className="text-slate-300">
      <span className="text-purple-400">import</span> {'{ PhysicsSandbox }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;{"\n\n"}
      <span className="text-blue-400">&lt;PhysicsSandbox</span>{"\n"}
      {"  "}<span className="text-teal-400">shapes</span>=<span className="text-pink-400">&#123;</span>shapes<span className="text-pink-400">&#125;</span> <span className="text-teal-400">connectors</span>=<span className="text-pink-400">&#123;</span>connectors<span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">physicsEnabled</span>=<span className="text-pink-400">&#123;</span>
      <select
        value={String(physicsEnabled)}
        onChange={(e) => setPhysicsEnabled(e.target.value === 'true')}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-purple-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer font-bold"
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
      <span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">gravity</span>=<span className="text-pink-400">&#123;</span>
      <input
        type="number"
        step="0.1"
        value={gravity}
        min={-5}
        max={5}
        onChange={(e) => setGravity(parseFloat(e.target.value) || 0)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-12 font-mono text-[11px] inline-block"
      />
      <span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">bounciness</span>=<span className="text-pink-400">&#123;</span>
      <input
        type="number"
        step="0.1"
        value={bounciness}
        min={0}
        max={1}
        onChange={(e) => setBounciness(parseFloat(e.target.value) || 0)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-12 font-mono text-[11px] inline-block"
      />
      <span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">jointStiffness</span>=<span className="text-pink-400">&#123;</span>
      <input
        type="number"
        step="0.01"
        value={jointStiffness}
        min={0.01}
        max={0.5}
        onChange={(e) => setJointStiffness(parseFloat(e.target.value) || 0.05)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-14 font-mono text-[11px] inline-block"
      />
      <span className="text-pink-400">&#125;</span>{"\n"}
      <span className="text-blue-400">/&gt;</span>
    </div>
  );

  return (
    <PlaygroundSection
      title="Draggable Physics Canvas"
      description={
        <span>
          Use <code>&lt;PhysicsSandbox&gt;</code> to create visual physics scenarios in slides. It leverages the <code>Matter.js</code> library to add dynamic gravity, joint-constraints, and draggable canvas items.
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default PhysicsSection;
