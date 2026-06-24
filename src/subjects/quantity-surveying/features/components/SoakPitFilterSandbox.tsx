import React from 'react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { CircleDot } from 'lucide-react';

interface SoakPitFilterSandboxProps {
  hideControls?: boolean;
  currentClick?: number;
  className?: string;
}

export const SoakPitFilterSandbox: React.FC<SoakPitFilterSandboxProps> = ({
  hideControls = false,
  currentClick,
  className = '',
}) => {
  const [diameter, setDiameter] = useUrlSyncedState<number>('soak_dia', 1.8);
  const [depth, setDepth] = useUrlSyncedState<number>('soak_depth', 3.0);
  const [voidRatio, setVoidRatio] = useUrlSyncedState<number>('soak_void', 0.35);
  const [containerFactor, setContainerFactor] = useUrlSyncedState<number>('soak_loose', 1.33);

  const radius = diameter / 2;
  const netVolume = Math.PI * radius * radius * depth;
  const looseVolume = netVolume * containerFactor;
  const voidVolume = netVolume * voidRatio;

  // Determine if a step is active for conceptual reveals
  const isStepActive = (step: number) => {
    return currentClick === undefined || currentClick >= step;
  };

  const renderSvg = () => (
    <div className={`flex flex-col justify-between bg-muted/20 p-4 border border-border/40 rounded-xl w-full ${hideControls ? className : 'h-full'}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-2 block text-center">
        Subsoil Filtration Section
      </span>

      <div className="h-44 bg-background rounded-lg border border-border/20 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 10 200 170" className="w-full h-full select-none">
          {/* Cylinder boundary lines */}
          <line x1="60" y1="20" x2="60" y2="160" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30" />
          <line x1="140" y1="20" x2="140" y2="160" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30" />
          
          {/* Cylinder Bottom curved line */}
          <path d="M 60,160 Q 100,166 140,160" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30" />
          <path d="M 60,20 Q 100,26 140,20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30" />

          {/* Graded filter pack visual fills */}
          {/* Bottom 40% - Coarse Brick Bats */}
          <path
            d="M 60,110 L 140,110 Q 100,116 60,110 L 60,160 Q 100,166 140,160 L 140,110"
            fill="currentColor"
            className={`transition-all duration-300 ${isStepActive(1) ? 'text-amber-500/20' : 'text-transparent'}`}
          />
          {isStepActive(1) && <text x="100" y="140" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400 text-[11px] font-mono font-semibold animate-fadeIn">Coarse Brick Bats</text>}

          {/* Middle 35% - Medium Khoa */}
          <path
            d="M 60,65 L 140,65 Q 100,71 60,65 L 60,110 Q 100,116 140,110 L 140,65"
            fill="currentColor"
            className={`transition-all duration-300 ${isStepActive(2) ? 'text-primary/20' : 'text-transparent'}`}
          />
          {isStepActive(2) && <text x="100" y="90" textAnchor="middle" className="fill-primary text-[11px] font-mono font-semibold animate-fadeIn">Medium Brick Khoa</text>}

          {/* Top 25% - Coarse Sand */}
          <path
            d="M 60,20 Q 100,26 140,20 L 140,65 Q 100,71 60,65 Z"
            fill="currentColor"
            className={`transition-all duration-300 ${isStepActive(3) ? 'text-yellow-500/20' : 'text-transparent'}`}
          />
          {isStepActive(3) && <text x="100" y="45" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400 text-[11px] font-mono font-semibold animate-fadeIn">Coarse Sand Filter</text>}

          {/* Vertical Dimension lines for Diameter & Depth */}
          <line x1="50" y1="20" x2="50" y2="160" stroke="#f59e0b" strokeWidth="1" />
          <polygon points="50,20 47,25 53,25" className="fill-amber-500" />
          <polygon points="50,160 47,155 53,155" className="fill-amber-500" />
          <text x="38" y="90" textAnchor="middle" className="fill-amber-500 text-[11px] font-mono font-bold rotate-270">H = {depth.toFixed(1)}m</text>

          <line x1="60" y1="172" x2="140" y2="172" stroke="#f59e0b" strokeWidth="1" />
          <polygon points="60,172 65,169 65,175" className="fill-amber-500" />
          <polygon points="140,172 135,169 135,175" className="fill-amber-500" />
          <text x="100" y="165" textAnchor="middle" className="fill-amber-500 text-[11px] font-mono font-bold">D = {diameter.toFixed(1)}m</text>
        </svg>

        {isStepActive(1) && (
          <div className="absolute bottom-2 right-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] p-2 rounded-md font-mono flex items-center gap-1 animate-fadeIn">
            <CircleDot className="w-3.5 h-3.5" />
            <span>Pores = {(voidRatio * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-2 leading-relaxed">
        Loose Aggregate = Net Volume ({netVolume.toFixed(2)} m³) × {containerFactor} = {looseVolume.toFixed(2)} m³.
      </span>
    </div>
  );

  if (hideControls) {
    return renderSvg();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full items-stretch select-text">
      <div className="md:col-span-6 flex flex-col justify-between space-y-4">
        <InteractiveCard title="Soak Pit Dimension Parameters">
          <div className="space-y-3 mb-4">
            <ParameterSlider
              label="Pit Inner Diameter (D)"
              min={1.0}
              max={3.5}
              step={0.1}
              value={diameter}
              onChange={setDiameter}
              unit=" m"
            />
            <ParameterSlider
              label="Pit Total Depth (H)"
              min={1.5}
              max={5.0}
              step={0.1}
              value={depth}
              onChange={setDepth}
              unit=" m"
            />
            <div className="flex justify-between items-center bg-muted/40 p-2 rounded-xl border border-border/40 text-xs">
              <span className="font-mono text-muted-foreground">Compaction Multiplier</span>
              <select
                value={containerFactor}
                onChange={(e) => setContainerFactor(parseFloat(e.target.value))}
                className="bg-background text-primary font-bold border border-border/40 px-2 py-1 rounded"
              >
                <option value={1.33}>Dutta Standard (+33%)</option>
                <option value={1.40}>High Loose Pack (+40%)</option>
              </select>
            </div>
            <div className="flex justify-between items-center bg-muted/40 p-2 rounded-xl border border-border/40 text-xs">
              <span className="font-mono text-muted-foreground">Design Void Ratio</span>
              <select
                value={voidRatio}
                onChange={(e) => setVoidRatio(parseFloat(e.target.value))}
                className="bg-background text-emerald-600 dark:text-emerald-400 font-bold border border-border/40 px-2 py-1 rounded"
              >
                <option value={0.33}>33% Silt/Sand void</option>
                <option value={0.37}>37% Typical broken brick</option>
                <option value={0.40}>40% Open graded khoa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
            <CalculationOutput
              title="Loose Aggregates Billed"
              value={looseVolume.toFixed(3)}
              unit="m³"
              variant="compact"
            />
            <CalculationOutput
              title="Porous Void Volume"
              value={voidVolume.toFixed(3)}
              unit="m³"
              variant="compact"
            />
          </div>
        </InteractiveCard>
      </div>

      <div className="md:col-span-6">
        {renderSvg()}
      </div>
    </div>
  );
};
