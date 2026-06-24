import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateGrooveCuttingAndConcealment } from '../../cores';
import { GrooveWeldingDrawing } from '../components/GrooveWeldingDrawing';

export const GrooveWeldingSandbox: React.FC = () => {
  const [lengthM, setLengthM] = useUrlSyncedState<number>('gw_length', 12);
  const [wallType, setWallType] = useUrlSyncedState<'brick' | 'rcc'>('gw_wall_type', 'brick');
  const [jointCount, setJointCount] = useUrlSyncedState<number>('gw_joints', 4);

  const [rateBrick, setRateBrick] = useUrlSyncedState<number>('gw_rate_brick', 150);
  const [rateRcc, setRateRcc] = useUrlSyncedState<number>('gw_rate_rcc', 450);
  const [rateJoint, setRateJoint] = useUrlSyncedState<number>('gw_rate_joint', 350);

  const { grooveCostBdt, concreteFillingVolM3 } = calculateGrooveCuttingAndConcealment(
    lengthM,
    wallType,
    rateBrick,
    rateRcc
  );

  const jointCostBdt = jointCount * rateJoint;
  const totalCost = grooveCostBdt + jointCostBdt;

  return (
    <TwoColumnLayout
      title="Concealment Groove & Jointing Sandbox"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col gap-3">
          <InteractiveCard title="1. Physical Run & Material">
            <div className="space-y-4">
              {/* Pipe Run Length */}
              <ParameterSlider
                label="Concealed Pipe Length"
                min={2}
                max={50}
                step={0.5}
                value={lengthM}
                onChange={setLengthM}
                unit=" m"
              />

              {/* Wall Material Selector */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Wall Structure Material</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['brick', 'rcc'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setWallType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        wallType === type
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {type === 'brick' ? '125mm Brick Wall' : 'RCC Shear Wall'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Electro-fusion Joints Count */}
              <ParameterSlider
                label="Welded Joint Nodes (HDPE)"
                min={0}
                max={20}
                step={1}
                value={jointCount}
                onChange={setJointCount}
                unit=" joints"
              />
            </div>
          </InteractiveCard>

          <InteractiveCard title="2. PWD Rate Schedule (BDT)">
            <div className="grid grid-cols-2 gap-2">
              <ParameterSlider
                label="Brick Groove Chasing"
                min={50}
                max={300}
                step={5}
                value={rateBrick}
                onChange={setRateBrick}
                unit=" /m"
              />
              <ParameterSlider
                label="RCC Groove Cutting"
                min={200}
                max={1000}
                step={10}
                value={rateRcc}
                onChange={setRateRcc}
                unit=" /m"
              />
            </div>
            <div className="mt-2 pt-2 border-t border-border/40">
              <ParameterSlider
                label="Electro-fusion Joint Fee"
                min={100}
                max={800}
                step={10}
                value={rateJoint}
                onChange={setRateJoint}
                unit=" /joint"
              />
            </div>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <GrooveWeldingDrawing
            wallType={wallType}
            highlightType={lengthM > 0 ? 'none' : 'groove'}
            className="flex-1"
          />

          <InteractiveCard title="Take-Off & Cost Ledger" className="w-full">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <CalculationOutput
                title="Groove Chasing Cost"
                value={grooveCostBdt.toFixed(3)}
                unit="BDT"
              />
              <CalculationOutput
                title="Joint Welding Cost"
                value={jointCostBdt.toFixed(3)}
                unit="BDT"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-2">
              <CalculationOutput
                title="Concrete Mortar Fill Vol"
                value={concreteFillingVolM3.toFixed(3)}
                unit="m³"
                subtitle="50x50mm cross-section"
              />
              <CalculationOutput
                title="Total Concealment Bill"
                value={totalCost.toFixed(3)}
                unit="BDT"
                subtitle="Combined PWD rate"
              />
            </div>
          </InteractiveCard>
        </div>
      }
    />
  );
};

export default GrooveWeldingSandbox;
