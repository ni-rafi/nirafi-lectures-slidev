import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateMepSubNetworks } from '../../cores';
import { MepSubNetworksDrawing } from '../components/MepSubNetworksDrawing';

export const MepSubNetworksSandbox: React.FC = () => {
  const [floorsCount, setFloorsCount] = useUrlSyncedState<number>('mep_floors', 6);
  const [typicalFloorHeightM, setTypicalFloorHeightM] = useUrlSyncedState<number>('mep_floor_height', 3.0);
  const [horizontalGasRunM, setHorizontalGasRunM] = useUrlSyncedState<number>('mep_gas_horiz', 5.0);

  const [gasPipeRateBdt, setGasPipeRateBdt] = useUrlSyncedState<number>('mep_rate_gas', 380);
  const [rwpRateBdt, setRwpRateBdt] = useUrlSyncedState<number>('mep_rate_rwp', 160);

  const [highlight, setHighlight] = useUrlSyncedState<'all' | 'rwp' | 'gas'>('mep_highlight', 'all');

  const {
    rwpLengthM,
    gasPipeLengthM,
    rwpCostBdt,
    gasPipeCostBdt,
    totalMepCostBdt,
  } = calculateMepSubNetworks(
    floorsCount,
    typicalFloorHeightM,
    horizontalGasRunM,
    gasPipeRateBdt,
    rwpRateBdt
  );

  return (
    <TwoColumnLayout
      title="Secondary MEP Networks Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col gap-3">
          <InteractiveCard title="1. Building Scope & Layout">
            <div className="space-y-4">
              {/* Floors Count */}
              <ParameterSlider
                label="Number of Floors"
                min={1}
                max={15}
                step={1}
                value={floorsCount}
                onChange={setFloorsCount}
                unit=" stories"
              />

              {/* Typical Floor Height */}
              <ParameterSlider
                label="Typical Floor Height"
                min={2.7}
                max={4.2}
                step={0.1}
                value={typicalFloorHeightM}
                onChange={setTypicalFloorHeightM}
                unit=" m"
              />

              {/* Horizontal Gas Run */}
              <ParameterSlider
                label="Gas Horizontal Run / Floor"
                min={0}
                max={25}
                step={0.5}
                value={horizontalGasRunM}
                onChange={setHorizontalGasRunM}
                unit=" m"
              />
            </div>
          </InteractiveCard>

          <InteractiveCard title="2. PWD Rate Schedule (BDT)">
            <div className="space-y-4">
              {/* Gas M.S. Rate */}
              <ParameterSlider
                label="M.S. Gas Pipe (API 5L) Rate"
                min={100}
                max={1000}
                step={10}
                value={gasPipeRateBdt}
                onChange={setGasPipeRateBdt}
                unit=" /m"
              />

              {/* RWP uPVC Rate */}
              <ParameterSlider
                label="uPVC Rainwater Pipe Rate"
                min={50}
                max={500}
                step={5}
                value={rwpRateBdt}
                onChange={setRwpRateBdt}
                unit=" /m"
              />
            </div>
          </InteractiveCard>

          <InteractiveCard title="3. Pathway Display Overlay">
            <div className="grid grid-cols-3 gap-1.5">
              {(['all', 'rwp', 'gas'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setHighlight(mode)}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all border uppercase ${
                    highlight === mode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                  }`}
                >
                  {mode === 'all' ? 'Show All' : mode === 'rwp' ? 'Rainwater' : 'Gas Line'}
                </button>
              ))}
            </div>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <MepSubNetworksDrawing
            highlight={highlight}
            className="flex-1"
          />

          <InteractiveCard title="MEQ Pipe Take-Off & Bill" className="w-full">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <CalculationOutput
                title="RWP Total Length (4 drops)"
                value={rwpLengthM.toFixed(3)}
                unit="m"
              />
              <CalculationOutput
                title="Gas Pipe Length (Riser+Branches)"
                value={gasPipeLengthM.toFixed(3)}
                unit="m"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-2">
              <CalculationOutput
                title="RWP Cost"
                value={rwpCostBdt.toFixed(3)}
                unit="BDT"
              />
              <CalculationOutput
                title="Gas Line Cost"
                value={gasPipeCostBdt.toFixed(3)}
                unit="BDT"
              />
              <CalculationOutput
                title="Total MEP Cost"
                value={totalMepCostBdt.toFixed(3)}
                unit="BDT"
                subtitle="Exclusive of clamps"
              />
            </div>
          </InteractiveCard>
        </div>
      }
    />
  );
};

export default MepSubNetworksSandbox;
