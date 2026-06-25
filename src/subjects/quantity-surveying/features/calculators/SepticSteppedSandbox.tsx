import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterInputCard,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { SepticSteppedDrawing } from '../components/SepticSteppedDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateSteppedSepticTankMasonry, calculateSepticPlasterAreas } from '../../cores/reservoir';

export const SepticSteppedSandbox: React.FC = () => {
  const [L_in, setLIn] = useUrlSyncedState<number>('septic_L_in', 3.0);
  const [B_in, setBIn] = useUrlSyncedState<number>('septic_B_in', 1.5);
  const [partitionCount, setPartitionCount] = useUrlSyncedState<number>('septic_partition', 1);

  const [step1WallThick, setStep1WallThick] = useUrlSyncedState<number>('septic_s1_thick', 0.375);
  const [step1Height, setStep1Height] = useUrlSyncedState<number>('septic_s1_height', 1.0);

  const [step2WallThick, setStep2WallThick] = useUrlSyncedState<number>('septic_s2_thick', 0.25);
  const [step2Height, setStep2Height] = useUrlSyncedState<number>('septic_s2_height', 1.5);

  const [activeStepIndex, setActiveStepIndex] = useUrlSyncedState<number>('septic_active_step', 0);

  const steps = [
    { tWall: step1WallThick, height: step1Height },
    { tWall: step2WallThick, height: step2Height },
  ];

  const { stepVolumes, totalVolume: totalMasonry } = calculateSteppedSepticTankMasonry(L_in, B_in, partitionCount, steps);
  const totalDepth = step1Height + step2Height;
  const { wallPlasterAreaM2, floorPlasterAreaM2 } = calculateSepticPlasterAreas(L_in, B_in, totalDepth, partitionCount);

  // Constants for plaster pricing estimation
  const wallRate = 250;
  const floorRate = 350;
  const totalPlasterCost = Math.round((wallPlasterAreaM2 * wallRate + floorPlasterAreaM2 * floorRate) * 100) / 100;

  return (
    <TwoColumnLayout
      title="Septic Tank Stepped Walls Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Septic Parameters">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1.5">
              <ParameterInputCard label="Inner Length (L)" min={1.5} max={8.0} value={L_in} onChange={setLIn} unit="m" variant="compact" />
              <ParameterInputCard label="Inner Width (B)" min={0.8} max={4.0} value={B_in} onChange={setBIn} unit="m" variant="compact" />
              <ParameterInputCard label="Partition Walls" min={0} max={3} value={partitionCount} onChange={setPartitionCount} unit="" variant="compact" />
            </div>
            
            <div className="border-t border-border/30 pt-2">
              <span className="text-[10px] font-bold text-primary block mb-1">Step 1 (Base Layer)</span>
              <div className="grid grid-cols-2 gap-1.5">
                <ParameterInputCard label="Thickness" min={0.25} max={0.50} value={step1WallThick} onChange={setStep1WallThick} unit="m" variant="compact" />
                <ParameterInputCard label="Height" min={0.5} max={2.0} value={step1Height} onChange={setStep1Height} unit="m" variant="compact" />
              </div>
            </div>

            <div className="border-t border-border/30 pt-2">
              <span className="text-[10px] font-bold text-primary block mb-1">Step 2 (Upper Layer)</span>
              <div className="grid grid-cols-2 gap-1.5">
                <ParameterInputCard label="Thickness" min={0.125} max={0.375} value={step2WallThick} onChange={setStep2WallThick} unit="m" variant="compact" />
                <ParameterInputCard label="Height" min={0.5} max={3.0} value={step2Height} onChange={setStep2Height} unit="m" variant="compact" />
              </div>
            </div>
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between gap-3 select-text">
          <SepticSteppedDrawing activeStepIndex={activeStepIndex} className="flex-1" />
          
          <div className="bg-card border border-border/60 rounded-xl p-3 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border/30">
              <span className="font-bold text-foreground">Highlight Element:</span>
              <select
                value={activeStepIndex}
                onChange={(e) => setActiveStepIndex(parseInt(e.target.value))}
                className="font-bold text-[11px] bg-muted border border-border/60 rounded px-2 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value={0}>Show All Components</option>
                <option value={1}>1st Step Wall (Masonry)</option>
                <option value={2}>2nd Step Wall (Masonry)</option>
                <option value={3}>Floor Plaster (20mm)</option>
                <option value={4}>Wall Plaster (12mm)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-1.5 font-mono">
              <CalculationOutput title="Step 1 Masonry" value={stepVolumes[0]?.toFixed(3) || '0.000'} unit=" m³" variant="compact" />
              <CalculationOutput title="Step 2 Masonry" value={stepVolumes[1]?.toFixed(3) || '0.000'} unit=" m³" variant="compact" />
              <CalculationOutput title="Total Masonry" value={totalMasonry.toFixed(3)} unit=" m³" variant="compact" />
              <CalculationOutput title="Wall Plaster" value={wallPlasterAreaM2.toFixed(2)} unit=" m²" variant="compact" />
              <CalculationOutput title="Floor Plaster" value={floorPlasterAreaM2.toFixed(2)} unit=" m²" variant="compact" />
              <CalculationOutput title="Plaster Cost" value={`৳${totalPlasterCost.toLocaleString()}`} unit="" variant="compact" />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default SepticSteppedSandbox;
