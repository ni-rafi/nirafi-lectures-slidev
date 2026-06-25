import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  SlideParagraph,
  SlideCallout,
  InteractiveCard,
  ParameterInputCard,
  CalculationOutput,
  SlideList
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateSepticTankCostInternal } from '@/subjects/quantity-surveying/cores';
import { EcoStpPrefabDrawing, EcoStpPrefabSandbox } from '@/subjects/quantity-surveying/features';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';

// ============================================================================
// Slide 19: Bill of Quantities (BoQ) Assembly
// ============================================================================
export const Slide19: React.FC = () => (
  <TwoColumnLayout
    title="3.3 Septic Tank BoQ Assembly"
    bgVariant="default"
    leftWidth="45%"
    leftContent={
      <div className="space-y-4 text-left select-text">
        <SlideParagraph title="Consolidating Trades">
          A complete Septic Tank BoQ represents a synthesis of multiple structural and masonry trades. The surveyor must merge distinct work packages into a unified billing document.
        </SlideParagraph>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Each line item represents a separate trade that matches local schedules (PWD SoR) to facilitate sub-contractor bidding and procurement audits.
        </p>
      </div>
    }
    rightContent={
      <div className="space-y-4 flex flex-col justify-center h-full select-text">
        <InteractiveCard title="Key BoQ Sub-Items" variant="default">
          <div className="text-xs space-y-2.5">
            <p>• <strong>Earthwork Excavation (m³)</strong>: Includes pit digging and subsequent perimeter backfilling.</p>
            <p>• <strong>Cement Concrete (1:3:6) (m³)</strong>: Foundation leveling course at bottom of tank.</p>
            <p>• <strong>1st Class Brickwork (1:4) (m³)</strong>: Enclosure partition and load-bearing walls.</p>
            <p>• <strong>Waterproof Plaster (1:3) (m²)</strong>: Floor and inside wall plastering with Pudlo admixtures.</p>
            <p>• <strong>Precast RC Slabs (m³)</strong>: Overhead structural access cover plates.</p>
          </div>
        </InteractiveCard>
      </div>
    }
  />
);

// ============================================================================
// Slide 20: Final Cost Estimation Ledger (Pricing)
// ============================================================================
export const Slide20: React.FC = () => {
  // Rate parameters (BDT/unit)
  const [excRate, setExcRate] = useUrlSyncedState<number>('septic_rate_exc', 150); // BDT/m³
  const [ccRate, setCcRate] = useUrlSyncedState<number>('septic_rate_cc', 4500); // BDT/m³
  const [brickRate, setBrickRate] = useUrlSyncedState<number>('septic_rate_brick', 5200); // BDT/m³
  const [plasterRate, setPlasterRate] = useUrlSyncedState<number>('septic_rate_plaster', 220); // BDT/m²
  const [rcRate, setRcRate] = useUrlSyncedState<number>('septic_rate_rc', 9800); // BDT/m³

  // Fixed typical quantities for a standard septic tank
  const qtys = {
    earthwork: 46.2,  // m³
    concrete: 2.0,    // m³
    brickwork: 4.2,   // m³
    plaster: 24.5,    // m²
    rc: 4.2           // m³
  };

  const cost = calculateSepticTankCostInternal(
    qtys.earthwork,
    qtys.concrete,
    qtys.brickwork,
    qtys.plaster,
    qtys.rc,
    {
      earthwork: excRate,
      concrete: ccRate,
      brickwork: brickRate,
      plaster: plasterRate,
      rc: rcRate
    }
  );

  return (
    <TwoColumnLayout
      title="3.4 Septic Tank Costing Ledger"
      bgVariant="default"
      leftWidth="40%"
      leftContent={
        <div className="space-y-3">
          <InteractiveCard title="Unit Rates (BDT)">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-1.5">
                <ParameterInputCard label="Earthwork" min={100} max={300} value={excRate} onChange={setExcRate} unit="৳/m³" variant="compact" />
                <ParameterInputCard label="CC Base" min={3500} max={5500} value={ccRate} onChange={setCcRate} unit="৳/m³" variant="compact" />
                <ParameterInputCard label="Brickwork" min={4500} max={6500} value={brickRate} onChange={setBrickRate} unit="৳/m³" variant="compact" />
                <ParameterInputCard label="Plastering" min={150} max={350} value={plasterRate} onChange={setPlasterRate} unit="৳/m²" variant="compact" />
              </div>
              <div className="pt-1.5 border-t border-border/30">
                <ParameterInputCard label="Precast RC Rate" min={8000} max={12000} value={rcRate} onChange={setRcRate} unit="৳/m³" variant="compact" />
              </div>
            </div>
          </InteractiveCard>

          <SlideCallout variant="info" title="BoQ Billing Reminder" className="py-2">
            <span className="text-[10px] leading-relaxed text-muted-foreground block text-center select-text">
              Note: Heavy accessories (like 18" C.I. Manhole Covers and RCC Tee pipes) are counted and priced separately as independent Nos. items in the Sanitary Section.
            </span>
          </SlideCallout>
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-between select-text">
          <InteractiveCard title="Priced Bill of Quantities" className="flex-1">
            <div className="w-full overflow-x-auto select-text scrollbar-thin">
              <table className="w-full text-[10px] font-mono border-collapse text-left">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground font-bold">
                    <th className="pb-1.5 font-sans">Item Description</th>
                    <th className="pb-1.5 font-sans text-right">Quantity</th>
                    <th className="pb-1.5 font-sans text-right">Unit Rate</th>
                    <th className="pb-1.5 font-sans text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/30">
                    <td className="py-1.5 font-sans">1. Earthwork Excavation</td>
                    <td className="py-1.5 text-right">{qtys.earthwork.toFixed(1)} m³</td>
                    <td className="py-1.5 text-right">{excRate.toLocaleString()} BDT</td>
                    <td className="py-1.5 text-right font-bold text-primary">{cost.earthworkCost.toLocaleString()} BDT</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-1.5 font-sans">2. CC Floor Base (1:3:6)</td>
                    <td className="py-1.5 text-right">{qtys.concrete.toFixed(1)} m³</td>
                    <td className="py-1.5 text-right">{ccRate.toLocaleString()} BDT</td>
                    <td className="py-1.5 text-right font-bold text-primary">{cost.concreteCost.toLocaleString()} BDT</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-1.5 font-sans">3. Brickwork Walls (1:4)</td>
                    <td className="py-1.5 text-right">{qtys.brickwork.toFixed(1)} m³</td>
                    <td className="py-1.5 text-right">{brickRate.toLocaleString()} BDT</td>
                    <td className="py-1.5 text-right font-bold text-primary">{cost.brickworkCost.toLocaleString()} BDT</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-1.5 font-sans">4. Waterproof Plastering</td>
                    <td className="py-1.5 text-right">{qtys.plaster.toFixed(1)} m²</td>
                    <td className="py-1.5 text-right">{plasterRate.toLocaleString()} BDT</td>
                    <td className="py-1.5 text-right font-bold text-primary">{cost.plasterCost.toLocaleString()} BDT</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans">5. Precast Cover Slab (RC)</td>
                    <td className="py-1.5 text-right">{qtys.rc.toFixed(1)} m³</td>
                    <td className="py-1.5 text-right">{rcRate.toLocaleString()} BDT</td>
                    <td className="py-1.5 text-right font-bold text-primary">{cost.rcCost.toLocaleString()} BDT</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t border-border/40 pt-3 mt-4">
              <CalculationOutput
                title="Grand Total Septic Tank Cost"
                value={cost.totalCost}
                unit="BDT"
                subtitle="Aggregated cost of all structural civil works for septic tank"
              />
            </div>
          </InteractiveCard>
        </div>
      }
    />
  );
};

// Slide 21: Eco Sewage Treatment Plants & Prefab Tanks Concepts
export const Slide21: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  
  const highlightMap: Record<number, 'none' | 'ecostp' | 'prefab'> = {
    0: 'none',
    1: 'ecostp',
    2: 'prefab'
  };
  const activeHighlight = highlightMap[currentClick] || 'none';

  return (
    <TwoColumnLayout
      title="3.5 Modern Eco STPs &amp; Prefabricated Storage"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="space-y-2.5 text-left select-text">
          <SlideParagraph>
            Contemporary PWD standards incorporate prefabricated components and biochemical treatment assemblies to reduce construction timelines and subsoil pollution.
          </SlideParagraph>
          <SlideList
            revealMode="each-click"
            variant="plain"
            items={[
              {
                title: "Non-Electric Eco Sewage Treatment Plant (STP)",
                text: "Modular plastic or RCC bio-reactors that digest waste anaerobically. Estimated as a lump-sum unit (Nos.) matching capacity, plus a startup charge for bacteria seeding and chamber connection pointing.",
                revealAt: 1,
              },
              {
                title: "Prefabricated Storage Tanks",
                text: "Schedules distinguish between heavy overhead food-grade plastic tanks (e.g. 1000L-5000L) and lower-cost ferro-cement alternative storage tanks (400-500 gallons), both billed by count.",
                revealAt: 2,
              },
            ]}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col justify-center">
          <EcoStpPrefabDrawing activeHighlight={activeHighlight} className="flex-1" />
        </div>
      }
    />
  );
};

// Slide 22: Eco STP & Prefab Tanks Sandbox Slide
export const Slide22: React.FC = () => {
  return (
    <div className="w-full h-full select-text">
      <EcoStpPrefabSandbox />
    </div>
  );
};
