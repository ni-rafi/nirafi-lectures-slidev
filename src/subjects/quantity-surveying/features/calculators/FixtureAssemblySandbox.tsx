import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  CalculationOutput,
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { FixturePackageDrawing } from '../components/FixturePackageDrawing';

export const FixtureAssemblySandbox: React.FC = () => {
  const [toiletType, setToiletType] = useUrlSyncedState<'Indian' | 'EuropeanFloor' | 'EuropeanWallHung'>('wc_toilet_type', 'EuropeanFloor');
  const [basinType, setBasinType] = useUrlSyncedState<'None' | 'Pedestal' | 'Counter'>('wc_basin_type', 'None');
  
  const [hasCistern, setHasCistern] = useUrlSyncedState<boolean>('wc_cistern', true);
  const [hasPushShower, setHasPushShower] = useUrlSyncedState<boolean>('wc_shower', true);
  const [hasLowBibcock, setHasLowBibcock] = useUrlSyncedState<boolean>('wc_bibcock', true);

  const [hasMirror, setHasMirror] = useUrlSyncedState<boolean>('wc_mirror', false);
  const [hasTowelRail, setHasTowelRail] = useUrlSyncedState<boolean>('wc_towel', false);
  const [hasSoapTray, setHasSoapTray] = useUrlSyncedState<boolean>('wc_soap_tray', false);

  const [hasSmartSoap, setHasSmartSoap] = useUrlSyncedState<boolean>('wc_smart_soap', false);
  const [hasSmartDryer, setHasSmartDryer] = useUrlSyncedState<boolean>('wc_smart_dryer', false);

  // Custom pricing model:
  const baseCost = toiletType === 'EuropeanFloor' ? 9500 : toiletType === 'EuropeanWallHung' ? 14500 : 5000;
  const cisternCost = (hasCistern && toiletType !== 'EuropeanWallHung') ? 1500 : 0;
  const showerCost = hasPushShower ? 1200 : 0;
  const bibcockCost = hasLowBibcock ? 850 : 0;

  const basinCost = basinType === 'Pedestal' ? 4500 : basinType === 'Counter' ? 8000 : 0;
  const mirrorCost = hasMirror ? 1000 : 0;
  const towelCost = hasTowelRail ? 800 : 0;
  const soapCost = hasSoapTray ? 450 : 0;

  const smartSoapCost = hasSmartSoap ? 3500 : 0;
  const smartDryerCost = hasSmartDryer ? 6500 : 0;

  const totalCost = baseCost + cisternCost + showerCost + bibcockCost + basinCost + mirrorCost + towelCost + soapCost + smartSoapCost + smartDryerCost;

  return (
    <TwoColumnLayout
      title="Sanitary Fixtures Assembly Sandbox"
      bgVariant="default"
      leftWidth="42%"
      leftContent={
        <div className="flex flex-col gap-3 max-h-[82vh] overflow-y-auto pr-1">
          {/* Section 1: Toilet Selection */}
          <InteractiveCard title="1. Toilet Assembly Type">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-1">
                {(['Indian', 'EuropeanFloor', 'EuropeanWallHung'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setToiletType(type)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                      toiletType === type
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {type === 'Indian' ? 'Squat Pan' : type === 'EuropeanFloor' ? 'Pedestal WC' : 'Wall-Hung WC'}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {toiletType === 'Indian'
                  ? 'Vitreous Squat Pan + P/S Trap (Base: 5,000 BDT)'
                  : toiletType === 'EuropeanFloor'
                  ? 'Pedestal Closet Commode + seat & anchors (Base: 9,500 BDT)'
                  : 'Floating wall-hung closet + concealed support frame (Base: 14,500 BDT)'}
              </p>
            </div>
          </InteractiveCard>

          {/* Section 2: Water Supply Fittings */}
          <InteractiveCard title="2. WC Core Accessories">
            <div className="grid grid-cols-1 gap-2">
              {toiletType !== 'EuropeanWallHung' && (
                <button
                  onClick={() => setHasCistern(!hasCistern)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex justify-between items-center ${
                    hasCistern ? 'border-chart-2/50 bg-chart-2/10 text-foreground' : 'border-border bg-transparent text-muted-foreground'
                  }`}
                >
                  <span className="text-[11px]">Flushing Cistern (10L uPVC) (+1,500 BDT)</span>
                  <span className="font-mono text-[10px]">{hasCistern ? '[ON]' : '[OFF]'}</span>
                </button>
              )}

              <button
                onClick={() => setHasPushShower(!hasPushShower)}
                className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex justify-between items-center ${
                  hasPushShower ? 'border-chart-2/50 bg-chart-2/10 text-foreground' : 'border-border bg-transparent text-muted-foreground'
                }`}
              >
                <span className="text-[11px]">CP Push Shower Assembly (+1,200 BDT)</span>
                <span className="font-mono text-[10px]">{hasPushShower ? '[ON]' : '[OFF]'}</span>
              </button>

              <button
                onClick={() => setHasLowBibcock(!hasLowBibcock)}
                className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex justify-between items-center ${
                  hasLowBibcock ? 'border-chart-3/50 bg-chart-3/10 text-foreground' : 'border-border bg-transparent text-muted-foreground'
                }`}
              >
                <span className="text-[11px]">Low-Level Ablution Bib-cock (+850 BDT)</span>
                <span className="font-mono text-[10px]">{hasLowBibcock ? '[ON]' : '[OFF]'}</span>
              </button>
            </div>
          </InteractiveCard>

          {/* Section 3: Wash Basin Selection */}
          <InteractiveCard title="3. Wash Basin Assembly">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-1">
                {(['None', 'Pedestal', 'Counter'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBasinType(type)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                      basinType === type
                        ? 'bg-chart-3 text-white border-chart-3'
                        : 'bg-muted border-border/50 text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {basinType === 'None'
                  ? 'No Wash Basin included in BoQ'
                  : basinType === 'Pedestal'
                  ? 'Vitreous china wash basin + pedestal column (Base: 4,500 BDT)'
                  : 'Premium wash basin on granite vanity counter slab (Base: 8,000 BDT)'}
              </p>
            </div>
          </InteractiveCard>

          {/* Section 4: Accessories & Smart Sensors */}
          <InteractiveCard title="4. Accessories & Smart Upgrades">
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <button
                onClick={() => setHasMirror(!hasMirror)}
                disabled={basinType === 'None'}
                className={`text-left px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-all flex justify-between items-center ${
                  basinType === 'None' ? 'opacity-40 cursor-not-allowed border-border/30 bg-muted/10' :
                  hasMirror ? 'border-chart-2/50 bg-chart-2/10 text-foreground' : 'border-border bg-transparent text-muted-foreground'
                }`}
              >
                <span>Mirror (+1,000 BDT)</span>
                <span className="font-mono">{hasMirror ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setHasTowelRail(!hasTowelRail)}
                className={`text-left px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-all flex justify-between items-center ${
                  hasTowelRail ? 'border-chart-2/50 bg-chart-2/10 text-foreground' : 'border-border bg-transparent text-muted-foreground'
                }`}
              >
                <span>Towel Rail (+800 BDT)</span>
                <span className="font-mono">{hasTowelRail ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setHasSoapTray(!hasSoapTray)}
                disabled={basinType === 'None'}
                className={`text-left px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-all flex justify-between items-center ${
                  basinType === 'None' ? 'opacity-40 cursor-not-allowed border-border/30 bg-muted/10' :
                  hasSoapTray ? 'border-chart-2/50 bg-chart-2/10 text-foreground' : 'border-border bg-transparent text-muted-foreground'
                }`}
              >
                <span>Soap Tray (+450 BDT)</span>
                <span className="font-mono">{hasSoapTray ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="border-t border-border/40 my-2 pt-2 grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setHasSmartSoap(!hasSmartSoap)}
                disabled={basinType === 'None'}
                className={`text-left px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-all flex justify-between items-center ${
                  basinType === 'None' ? 'opacity-40 cursor-not-allowed border-border/30 bg-muted/10' :
                  hasSmartSoap ? 'border-chart-4/50 bg-chart-4/10 text-foreground' : 'border-border bg-transparent text-muted-foreground'
                }`}
              >
                <span>IR Soap (+3,500 BDT)</span>
                <span className="font-mono">{hasSmartSoap ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setHasSmartDryer(!hasSmartDryer)}
                className={`text-left px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-all flex justify-between items-center ${
                  hasSmartDryer ? 'border-chart-4/50 bg-chart-4/10 text-foreground' : 'border-border bg-transparent text-muted-foreground'
                }`}
              >
                <span>HEPA Dryer (+6,500 BDT)</span>
                <span className="font-mono">{hasSmartDryer ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </InteractiveCard>

          {/* Outputs */}
          <InteractiveCard title="Summary Bill of Quantities">
            <CalculationOutput
              title="Total Bathroom Assembly Cost"
              value={totalCost.toString()}
              unit="BDT"
              subtitle="PWD schedule composite estimate including fittings"
            />
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="w-full h-full flex flex-col justify-center gap-4">
          <FixturePackageDrawing
            toiletType={toiletType}
            basinType={basinType}
            hasMirror={hasMirror}
            hasTowelRail={hasTowelRail}
            hasSoapTray={hasSoapTray}
            hasSmartSoap={hasSmartSoap}
            hasSmartDryer={hasSmartDryer}
            
            fixtureType={toiletType === 'Indian' ? 'Indian' : 'European'}
            hasCistern={hasCistern}
            hasPushShower={hasPushShower}
            hasLowBibcock={hasLowBibcock}
          />
        </div>
      }
    />
  );
};

export default FixtureAssemblySandbox;
