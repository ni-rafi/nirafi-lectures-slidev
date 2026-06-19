import React from 'react';
import { Gauge } from '@/features/presentation/components/elements/bklit/charts/gauge';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { PlaygroundSection } from './PlaygroundSection';

export const GraphsSection: React.FC = () => {
  // Chart 1 (Dial) State - Synced
  const [val1, setVal1] = useUrlSyncedState<number>('doc_chart_val1', 65);
  const [centerVal1, setCenterVal1] = useUrlSyncedState<number>('doc_chart_centerVal1', 3.42);
  const [notches1, setNotches1] = useUrlSyncedState<number>('doc_chart_notches1', 30);

  // Chart 2 (Progress Ring) State - Synced
  const [val2, setVal2] = useUrlSyncedState<number>('doc_chart_val2', 82);
  const [centerVal2, setCenterVal2] = useUrlSyncedState<number>('doc_chart_centerVal2', 82);
  const [notches2, setNotches2] = useUrlSyncedState<number>('doc_chart_notches2', 40);
  const [corners2, setCorners2] = useUrlSyncedState<number>('doc_chart_corners2', 4);

  const availableCharts = [
    'AreaChart', 'BarChart', 'CandlestickChart', 'ComposedChart',
    'FunnelChart', 'Gauge', 'HeatmapChart', 'LineChart',
    'LiveLineChart', 'PieChart', 'RadarChart', 'RingChart',
    'SankeyChart', 'ScatterChart'
  ];

  const preview = (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. All available charts index */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest select-none">
          Available Bklit UI Chart Types
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
          {availableCharts.map((chartName) => (
            <div
              key={chartName}
              className={`p-1.5 text-center font-mono text-[10px] rounded border ${
                chartName === 'Gauge'
                  ? 'bg-primary/10 border-primary text-primary font-bold'
                  : 'bg-muted/10 border-border/40 text-muted-foreground'
              }`}
            >
              {chartName}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Side-by-side live gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center pt-2">
        {/* Dial Gauge */}
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border/40 bg-card">
          <span className="text-[9px] font-bold text-muted-foreground uppercase">1. Dial Meter</span>
          <div className="w-full max-w-[140px] flex items-center justify-center">
            <Gauge
              value={val1}
              centerValue={centerVal1}
              suffix=" m³"
              defaultLabel="Volume"
              totalNotches={notches1}
              useGradient={true}
              minWidth={110}
            />
          </div>
        </div>

        {/* Ring Progress */}
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border/40 bg-card">
          <span className="text-[9px] font-bold text-muted-foreground uppercase">2. Progress Ring</span>
          <div className="w-full max-w-[140px] flex items-center justify-center">
            <Gauge
              value={val2}
              centerValue={centerVal2}
              suffix="%"
              defaultLabel="Complete"
              totalNotches={notches2}
              notchCornerRadius={corners2}
              startAngle={0}
              endAngle={360}
              spacing={5}
              uniformWidth={true}
              useGradient={true}
              minWidth={110}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const codeText = `import { Gauge } from '@/features/presentation/components/elements/bklit/charts/gauge';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';

// 1. Dial Gauge Meter Config with Synced Parameters
const [val1, setVal1] = useUrlSyncedState<number>('chart_val1', ${val1});
const [centerVal1, setCenterVal1] = useUrlSyncedState<number>('chart_centerVal1', ${centerVal1});
const [notches1, setNotches1] = useUrlSyncedState<number>('chart_notches1', ${notches1});

<Gauge
  value={val1}
  centerValue={centerVal1}
  suffix=" m³"
  defaultLabel="Volume"
  totalNotches={notches1}
  useGradient={true}
/>

// 2. Circular Activity Ring Config with Synced Parameters
const [val2, setVal2] = useUrlSyncedState<number>('chart_val2', ${val2});
const [centerVal2, setCenterVal2] = useUrlSyncedState<number>('chart_centerVal2', ${centerVal2});
const [notches2, setNotches2] = useUrlSyncedState<number>('chart_notches2', ${notches2});
const [corners2, setCorners2] = useUrlSyncedState<number>('chart_corners2', ${corners2});

<Gauge
  value={val2}
  centerValue={centerVal2}
  suffix="%"
  defaultLabel="Complete"
  totalNotches={notches2}
  notchCornerRadius={corners2}
  startAngle={0}
  endAngle={360}
  spacing={5}
  uniformWidth={true}
  useGradient={true}
/>`;

  const editorContent = (
    <div className="text-slate-300 font-mono text-[11px] leading-relaxed">
      <span className="text-purple-400">import</span> {'{ Gauge }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements/bklit/charts/gauge"</span>;{"\n"}
      <span className="text-purple-400">import</span> {'{ useUrlSyncedState }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/hooks/useUrlSyncedState"</span>;{"\n\n"}
      <span className="text-muted-foreground/60">// 1. Dial Gauge Meter Config with Synced Parameters</span>{"\n"}
      <span className="text-purple-400">const</span> [val1, setVal1] = <span className="text-blue-400">useUrlSyncedState</span>&lt;<span className="text-teal-400">number</span>&gt;(<span className="text-amber-300">'chart_val1'</span>,{" "}
      <input
        type="number"
        value={val1}
        min={0}
        max={100}
        onChange={(e) => setVal1(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-12 font-mono text-[11px] inline-block font-bold"
      />
      );{"\n"}
      <span className="text-purple-400">const</span> [centerVal1, setCenterVal1] = <span className="text-blue-400">useUrlSyncedState</span>&lt;<span className="text-teal-400">number</span>&gt;(<span className="text-amber-300">'chart_centerVal1'</span>,{" "}
      <input
        type="number"
        step="0.01"
        value={centerVal1}
        onChange={(e) => setCenterVal1(parseFloat(e.target.value) || 0)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-16 font-mono text-[11px] inline-block font-bold"
      />
      );{"\n"}
      <span className="text-purple-400">const</span> [notches1, setNotches1] = <span className="text-blue-400">useUrlSyncedState</span>&lt;<span className="text-teal-400">number</span>&gt;(<span className="text-amber-300">'chart_notches1'</span>,{" "}
      <input
        type="number"
        value={notches1}
        min={5}
        max={60}
        onChange={(e) => setNotches1(Math.min(60, Math.max(5, parseInt(e.target.value) || 30)))}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-12 font-mono text-[11px] inline-block font-bold"
      />
      );{"\n\n"}
      <span className="text-blue-400">&lt;Gauge</span>{"\n"}
      {"  "}<span className="text-teal-400">value</span>=<span className="text-pink-400">&#123;</span>val1<span className="text-pink-400">&#125;</span> <span className="text-teal-400">centerValue</span>=<span className="text-pink-400">&#123;</span>centerVal1<span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">totalNotches</span>=<span className="text-pink-400">&#123;</span>notches1<span className="text-pink-400">&#125;</span> <span className="text-teal-400">useGradient</span>=<span className="text-pink-400">&#123;</span>true<span className="text-pink-400">&#125;</span>{"\n"}
      <span className="text-blue-400">/&gt;</span>{"\n\n"}
      
      <span className="text-muted-foreground/60">// 2. Circular Activity Ring Config with Synced Parameters</span>{"\n"}
      <span className="text-purple-400">const</span> [val2, setVal2] = <span className="text-blue-400">useUrlSyncedState</span>&lt;<span className="text-teal-400">number</span>&gt;(<span className="text-amber-300">'chart_val2'</span>,{" "}
      <input
        type="number"
        value={val2}
        min={0}
        max={100}
        onChange={(e) => {
          const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
          setVal2(v);
          setCenterVal2(v);
        }}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-12 font-mono text-[11px] inline-block font-bold"
      />
      );{"\n"}
      <span className="text-purple-400">const</span> [notches2, setNotches2] = <span className="text-blue-400">useUrlSyncedState</span>&lt;<span className="text-teal-400">number</span>&gt;(<span className="text-amber-300">'chart_notches2'</span>,{" "}
      <input
        type="number"
        value={notches2}
        min={5}
        max={60}
        onChange={(e) => setNotches2(Math.min(60, Math.max(5, parseInt(e.target.value) || 40)))}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-12 font-mono text-[11px] inline-block font-bold"
      />
      );{"\n"}
      <span className="text-purple-400">const</span> [corners2, setCorners2] = <span className="text-blue-400">useUrlSyncedState</span>&lt;<span className="text-teal-400">number</span>&gt;(<span className="text-amber-300">'chart_corners2'</span>,{" "}
      <input
        type="number"
        value={corners2}
        min={0}
        max={12}
        onChange={(e) => setCorners2(Math.min(12, Math.max(0, parseInt(e.target.value) || 0)))}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-orange-400 focus:outline-none focus:border-primary/50 w-10 font-mono text-[11px] inline-block font-bold"
      />
      );{"\n\n"}
      <span className="text-blue-400">&lt;Gauge</span>{"\n"}
      {"  "}<span className="text-teal-400">value</span>=<span className="text-pink-400">&#123;</span>val2<span className="text-pink-400">&#125;</span> <span className="text-teal-400">centerValue</span>=<span className="text-pink-400">&#123;</span>val2<span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">totalNotches</span>=<span className="text-pink-400">&#123;</span>notches2<span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">notchCornerRadius</span>=<span className="text-pink-400">&#123;</span>corners2<span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">startAngle</span>=<span className="text-pink-400">&#123;</span>0<span className="text-pink-400">&#125;</span> <span className="text-teal-400">endAngle</span>=<span className="text-pink-400">&#123;</span>360<span className="text-pink-400">&#125;</span>{"\n"}
      {"  "}<span className="text-teal-400">spacing</span>=<span className="text-pink-400">&#123;</span>5<span className="text-pink-400">&#125;</span> <span className="text-teal-400">uniformWidth</span>=<span className="text-pink-400">&#123;</span>true<span className="text-pink-400">&#125;</span>{"\n"}
      <span className="text-blue-400">/&gt;</span>
    </div>
  );

  return (
    <PlaygroundSection
      title="Responsive Gauge Chart Variations"
      description={
        <span>
          Bklit UI charts dynamically scale with their parent constraints. The highly versatile <code>&lt;Gauge&gt;</code> component supports standard speed-dial formats, activity progress rings, or flat arcs depending on the angle coordinates passed.
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default GraphsSection;
