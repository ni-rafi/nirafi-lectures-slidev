import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterInputCard,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { EcoStpPrefabDrawing } from '../components/EcoStpPrefabDrawing';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateEcoStpCost, calculatePrefabTanksCost } from '../../cores/reservoir';

export const EcoStpPrefabSandbox: React.FC = () => {
  const [capacityL, setCapacityL] = useUrlSyncedState<number>('ecostp_cap', 2000);
  const [stpRate, setStpRate] = useUrlSyncedState<number>('ecostp_rate', 35);
  const [startupCharge, setStartupCharge] = useUrlSyncedState<number>('ecostp_startup', 8000);

  const [plasticCount, setPlasticCount] = useUrlSyncedState<number>('prefab_p_count', 2);
  const [plasticRate, setPlasticRate] = useUrlSyncedState<number>('prefab_p_rate', 12000);

  const [ferroCount, setFerroCount] = useUrlSyncedState<number>('prefab_f_count', 1);
  const [ferroRate, setFerroRate] = useUrlSyncedState<number>('prefab_f_rate', 9500);

  const [activeHighlight, setActiveHighlight] = useUrlSyncedState<'none' | 'ecostp' | 'prefab'>('ecostp_prefab_highlight', 'none');

  const {
    baseStpCostBdt,
    startupChargeBdt: finalStartupCharge,
    totalStpCostBdt
  } = calculateEcoStpCost(capacityL, stpRate, startupCharge);

  const {
    plasticCostBdt,
    ferroCostBdt,
    totalPrefabCostBdt
  } = calculatePrefabTanksCost(plasticCount, plasticRate, ferroCount, ferroRate);

  return (
    <TwoColumnLayout
      title="Eco STP & Prefab Tanks Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <InteractiveCard title="Pricing & Count Parameters">
          <div className="space-y-3">
            <div className="border-b border-border/20 pb-2">
              <span className="text-[10px] font-bold text-primary block mb-1">Eco Sewage Treatment Plant (STP)</span>
              <div className="grid grid-cols-2 gap-1.5">
                <ParameterInputCard label="Capacity" min={1000} max={10000} value={capacityL} onChange={setCapacityL} unit="L" variant="compact" />
                <ParameterInputCard label="Rate / L" min={10} max={80} value={stpRate} onChange={setStpRate} unit="৳" variant="compact" />
              </div>
              <div className="pt-1.5">
                <ParameterInputCard label="Startup Charge" min={2000} max={15000} value={startupCharge} onChange={setStartupCharge} unit="৳" variant="compact" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-primary block mb-1">Prefabricated Storage Tanks</span>
              <div className="grid grid-cols-2 gap-1.5">
                <ParameterInputCard label="Plastic (Nos)" min={0} max={6} value={plasticCount} onChange={setPlasticCount} unit="Nos" variant="compact" />
                <ParameterInputCard label="Plastic Rate" min={5000} max={30000} value={plasticRate} onChange={setPlasticRate} unit="৳" variant="compact" />
                <ParameterInputCard label="Ferro (Nos)" min={0} max={6} value={ferroCount} onChange={setFerroCount} unit="Nos" variant="compact" />
                <ParameterInputCard label="Ferro Rate" min={4000} max={25000} value={ferroRate} onChange={setFerroRate} unit="৳" variant="compact" />
              </div>
            </div>
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between gap-3 select-text">
          <EcoStpPrefabDrawing activeHighlight={activeHighlight} className="flex-1" />
          
          <div className="bg-card border border-border/60 rounded-xl p-3 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border/30">
              <span className="font-bold text-foreground">Highlight Panel:</span>
              <select
                value={activeHighlight}
                onChange={(e) => setActiveHighlight(e.target.value as 'none' | 'ecostp' | 'prefab')}
                className="font-bold text-[11px] bg-muted border border-border/60 rounded px-2 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="none">Show Both Panels</option>
                <option value="ecostp">Eco STP System Details</option>
                <option value="prefab">Prefab Storage Tanks</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-1.5 font-mono">
              <CalculationOutput title="STP Base Cost" value={`৳${baseStpCostBdt.toLocaleString()}`} unit="" variant="compact" />
              <CalculationOutput title="Startup Charge" value={`৳${finalStartupCharge.toLocaleString()}`} unit="" variant="compact" />
              <CalculationOutput title="Total STP Cost" value={`৳${totalStpCostBdt.toLocaleString()}`} unit="" variant="compact" />
              <CalculationOutput title="Plastic Cost" value={`৳${plasticCostBdt.toLocaleString()}`} unit="" variant="compact" />
              <CalculationOutput title="Ferro Cost" value={`৳${ferroCostBdt.toLocaleString()}`} unit="" variant="compact" />
              <CalculationOutput title="Total Prefab" value={`৳${totalPrefabCostBdt.toLocaleString()}`} unit="" variant="compact" />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default EcoStpPrefabSandbox;
