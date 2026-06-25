import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterInputCard,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { SoakPitStructuralDrawing } from '../components/SoakPitStructuralDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateSoakPitStructural } from '../../cores/reservoir';

export const SoakPitStructuralSandbox: React.FC = () => {
  const [diameter, setDiameter] = useUrlSyncedState<number>('soak_struct_dia', 1.8);
  const [depthHoneycomb, setDepthHoneycomb] = useUrlSyncedState<number>('soak_struct_hcomb', 2.0);
  const [depthSolid, setDepthSolid] = useUrlSyncedState<number>('soak_struct_solid', 1.0);
  const [wallThickness, setWallThickness] = useUrlSyncedState<number>('soak_struct_thick', 0.25);
  const [curbWidth, setCurbWidth] = useUrlSyncedState<number>('soak_struct_curb_w', 0.35);
  const [curbThickness, setCurbThickness] = useUrlSyncedState<number>('soak_struct_curb_t', 0.3);

  const [activeHighlight, setActiveHighlight] = useUrlSyncedState<'none' | 'honeycomb' | 'solid' | 'curb'>('soak_struct_highlight', 'none');

  const {
    honeycombVolM3,
    solidVolM3,
    reinforcementKg,
    totalConcreteVolM3
  } = calculateSoakPitStructural(
    diameter,
    depthHoneycomb,
    depthSolid,
    wallThickness,
    curbWidth,
    curbThickness
  );

  return (
    <TwoColumnLayout
      title="Soak Pit Structural Components Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Structural Parameters">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-1.5">
              <ParameterInputCard label="Pit Inside Dia (D)" min={1.0} max={4.0} value={diameter} onChange={setDiameter} unit="m" variant="compact" />
              <ParameterInputCard label="Wall Thickness" min={0.125} max={0.375} value={wallThickness} onChange={setWallThickness} unit="m" variant="compact" />
            </div>

            <div className="border-t border-border/30 pt-2">
              <span className="text-[10px] font-bold text-primary block mb-1">Brickwork Heights</span>
              <div className="grid grid-cols-2 gap-1.5">
                <ParameterInputCard label="Honeycomb H" min={0.5} max={4.0} value={depthHoneycomb} onChange={setDepthHoneycomb} unit="m" variant="compact" />
                <ParameterInputCard label="Solid Upper H" min={0.2} max={2.0} value={depthSolid} onChange={setDepthSolid} unit="m" variant="compact" />
              </div>
            </div>

            <div className="border-t border-border/30 pt-2">
              <span className="text-[10px] font-bold text-primary block mb-1">RCC Well Curb Ring Foundation</span>
              <div className="grid grid-cols-2 gap-1.5">
                <ParameterInputCard label="Curb Width (w)" min={0.25} max={0.50} value={curbWidth} onChange={setCurbWidth} unit="m" variant="compact" />
                <ParameterInputCard label="Curb Thickness (t)" min={0.15} max={0.50} value={curbThickness} onChange={setCurbThickness} unit="m" variant="compact" />
              </div>
            </div>
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between gap-3 select-text">
          <SoakPitStructuralDrawing activeHighlight={activeHighlight} className="flex-1" />
          
          <div className="bg-card border border-border/60 rounded-xl p-3 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border/30">
              <span className="font-bold text-foreground">Highlight Area:</span>
              <select
                value={activeHighlight}
                onChange={(e) => setActiveHighlight(e.target.value as 'none' | 'honeycomb' | 'solid' | 'curb')}
                className="font-bold text-[11px] bg-muted border border-border/60 rounded px-2 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="none">Show All Components</option>
                <option value="honeycomb">Honeycomb Brickwork (25% slots)</option>
                <option value="solid">Solid Collar Brickwork</option>
                <option value="curb">RCC Well Curb Foundation</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-1.5 font-mono">
              <CalculationOutput title="Honeycomb Masonry" value={honeycombVolM3.toFixed(3)} unit=" m³" variant="compact" />
              <CalculationOutput title="Solid Masonry" value={solidVolM3.toFixed(3)} unit=" m³" variant="compact" />
              <CalculationOutput title="Total Masonry" value={(honeycombVolM3 + solidVolM3).toFixed(3)} unit=" m³" variant="compact" />
              <CalculationOutput title="Curb Concrete" value={totalConcreteVolM3.toFixed(3)} unit=" m³" variant="compact" />
              <CalculationOutput title="Curb Rebar (1%)" value={reinforcementKg.toFixed(1)} unit=" kg" variant="compact" />
              <CalculationOutput title="Total Depth" value={(depthHoneycomb + depthSolid + curbThickness).toFixed(2)} unit=" m" variant="compact" />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default SoakPitStructuralSandbox;
