import React, { useState, useMemo } from 'react';
import PhysicsSandbox from '../elements/PhysicsSandbox';
import { ShapeData, ConnectorData } from '../elements/physicsHelpers';
import InteractiveCard from '../elements/InteractiveCard';
import ParameterSlider from '../elements/ParameterSlider';

// Preset configurations defined compactly
const PRESETS: Record<string, { shapes: ShapeData[]; connectors: ConnectorData[] }> = {
  flowchart: {
    shapes: [
      { id: '1', type: 'rect', x: 400, y: 70, label: 'ROOT', fill: '#3b82f6' },
      { id: '2', type: 'circle', x: 230, y: 170, label: 'DEV', fill: '#10b981' },
      { id: '3', type: 'circle', x: 570, y: 170, label: 'QA', fill: '#8b5cf6' },
      { id: '4', type: 'triangle', x: 130, y: 280, label: 'WEB', fill: '#f59e0b' },
      { id: '5', type: 'triangle', x: 330, y: 280, label: 'API', fill: '#ec4899' },
      { id: '6', type: 'triangle', x: 470, y: 280, label: 'UNIT', fill: '#06b6d4' },
      { id: '7', type: 'triangle', x: 670, y: 280, label: 'INTEG', fill: '#e11d48' },
    ],
    connectors: [
      { id: 'c1', from: '1', to: '2' }, { id: 'c2', from: '1', to: '3' },
      { id: 'c3', from: '2', to: '4' }, { id: 'c4', from: '2', to: '5' },
      { id: 'c5', from: '3', to: '6' }, { id: 'c6', from: '3', to: '7' },
    ]
  },
  star: {
    shapes: [
      { id: 'hub', type: 'star', x: 400, y: 210, label: 'HUB', fill: '#ef4444', size: 75 },
      ...Array.from({ length: 6 }, (_, i) => {
        const theta = (i * Math.PI) / 3;
        const types = ['circle', 'rect', 'hexagon', 'rhombus', 'pentagon', 'cross'];
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
        return {
          id: `o${i}`,
          type: types[i] ?? 'circle',
          x: Math.round(400 + 130 * Math.cos(theta)),
          y: Math.round(210 + 130 * Math.sin(theta)),
          label: `NODE ${i + 1}`,
          fill: colors[i] ?? '#f59e0b'
        };
      })
    ],
    connectors: Array.from({ length: 6 }, (_, i) => ({
      id: `sc${i}`, from: 'hub', to: `o${i}`
    }))
  },
  chain: {
    shapes: Array.from({ length: 7 }, (_, i) => {
      const types = ['circle', 'rect', 'star', 'heart', 'hexagon', 'triangle', 'arrow'];
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#e11d48'];
      return {
        id: `${i}`,
        type: types[i] ?? 'circle',
        x: 130 + i * 90,
        y: 210 + (i % 2 === 0 ? -40 : 40),
        label: `C${i + 1}`,
        fill: colors[i] ?? '#3b82f6'
      };
    }),
    connectors: Array.from({ length: 6 }, (_, i) => ({
      id: `ch${i}`, from: `${i}`, to: `${i + 1}`, dasharray: '4 4'
    }))
  }
};

export const SlidePhysicsShapes: React.FC = () => {
  const [preset, setPreset] = useState<'flowchart' | 'star' | 'chain'>('flowchart');
  const [physicsEnabled, setPhysicsEnabled] = useState(false);
  const [shapeOverrides, setShapeOverrides] = useState<Record<string, string>>({});

  // Physics tuning controls
  const [gravity, setGravity] = useState(1.0);
  const [bounciness, setBounciness] = useState(0.6);
  const [stiffness, setStiffness] = useState(0.04);

  // Compute active layout merged with interactive morph overrides
  const currentLayout = useMemo(() => {
    const data = PRESETS[preset]!;
    const shapes: ShapeData[] = data.shapes.map((s) => ({
      ...s,
      type: shapeOverrides[s.id] ?? s.type,
    }));
    return { shapes, connectors: data.connectors };
  }, [preset, shapeOverrides]);

  const handlePresetChange = (p: 'flowchart' | 'star' | 'chain') => {
    setPreset(p);
    setPhysicsEnabled(false);
    setShapeOverrides({}); // Reset manual morph overrides
  };

  const toggleShapeType = (id: string) => {
    const shape = currentLayout.shapes.find(s => s.id === id);
    if (!shape) return;

    const types = ['circle', 'rect', 'triangle', 'star', 'arrow', 'pentagon', 'hexagon', 'cross', 'heart', 'parallelogram', 'rhombus'];
    const nextIdx = (types.indexOf(shape.type) + 1) % types.length;
    const nextType = types[nextIdx] ?? 'circle';
    setShapeOverrides(prev => ({
      ...prev,
      [id]: nextType,
    }));
  };

  const morphAllShapes = () => {
    const types = ['circle', 'rect', 'triangle', 'star', 'arrow', 'pentagon', 'hexagon', 'cross', 'heart', 'parallelogram', 'rhombus'];
    const newOverrides: Record<string, string> = {};
    const data = PRESETS[preset]!;
    data.shapes.forEach((s) => {
      const remaining = types.filter(t => t !== s.type);
      const randomType = remaining[Math.floor(Math.random() * remaining.length)] ?? 'circle';
      newOverrides[s.id] = randomType;
    });
    setShapeOverrides(newOverrides);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-start text-left px-8 py-6 overflow-y-auto">
      <div className="flex flex-col gap-0.5 mb-4 select-none">
        <h3 className="text-lg font-bold text-foreground">
          Slide 10: Shape Morphing & Physics Simulations
        </h3>
        <p className="text-[11px] text-muted-foreground leading-normal">
          Render dynamic flowchart/network vectors that morph fluidly, connect with elastic springs, and fall into real-time rigid collisions.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-5 w-full items-start">
        {/* Control Panel */}
        <div className="col-span-4 flex flex-col gap-4">
          <InteractiveCard title="Preset & Morph Controls" className="p-4 py-4 md:p-4">
            <div className="flex flex-col gap-2.5">
              <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                Select Layout Preset
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['flowchart', 'star', 'chain'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePresetChange(p)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                      preset === p
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setPhysicsEnabled(!physicsEnabled)}
                className={`py-2 rounded-lg text-xs font-extrabold uppercase transition-all shadow-md ${
                  physicsEnabled
                    ? 'bg-rose-600 border border-rose-500 text-white animate-pulse'
                    : 'bg-primary border border-primary/50 text-white'
                }`}
              >
                {physicsEnabled ? 'Disable Physics' : 'Enable Physics'}
              </button>
              <button
                onClick={morphAllShapes}
                disabled={physicsEnabled}
                className="py-2 rounded-lg text-xs font-bold bg-slate-800 border border-white/5 text-slate-100 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Morph Shapes
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal italic text-center select-none">
              {!physicsEnabled 
                ? "💡 Click/double-click individual shapes to cycle their geometry!" 
                : "💡 Grab, drag, and toss shapes to see spring constraints in action!"}
            </p>
          </InteractiveCard>

          <InteractiveCard title="Physics Environment Adjuster" className="p-4 py-4 md:p-4">
            <div className="space-y-3">
              <ParameterSlider
                label="Gravity scale"
                value={gravity}
                unit="g"
                min={0}
                max={3}
                step={0.1}
                onChange={setGravity}
              />
              <ParameterSlider
                label="Bounciness (restitution)"
                value={bounciness}
                unit=""
                min={0}
                max={1.0}
                step={0.05}
                onChange={setBounciness}
              />
              <ParameterSlider
                label="Link Spring Stiffness"
                value={stiffness}
                unit=""
                min={0.01}
                max={0.2}
                step={0.01}
                onChange={setStiffness}
              />
            </div>
          </InteractiveCard>
        </div>

        {/* Physics Canvas Sandbox */}
        <div className="col-span-8 h-[395px]">
          <PhysicsSandbox
            shapes={currentLayout.shapes}
            connectors={currentLayout.connectors}
            physicsEnabled={physicsEnabled}
            width={720}
            height={395}
            gravity={gravity}
            bounciness={bounciness}
            jointStiffness={stiffness}
            onShapeClick={toggleShapeType}
          />
        </div>
      </div>
    </div>
  );
};

export default SlidePhysicsShapes;
