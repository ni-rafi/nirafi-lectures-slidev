import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
  SlideCallout
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { PWD_REBAR_WEIGHTS } from '../../cores';
import { RebarBbsLedgerDrawing } from '../components/RebarBbsLedgerDrawing';

interface BbsRow {
  mark: string;
  description: string;
  shape: string;
  dia: number;
  count: number;
  length: number;
  unitWeight: number;
  totalWeight: number;
}

export const RebarBbsLedgerSandbox: React.FC = () => {
  const [span, setSpan] = useUrlSyncedState<number>('bbs_span', 5.0); // span in meters
  const [spacing, setSpacing] = useUrlSyncedState<number>('bbs_spacing', 150); // spacing in mm
  const [selectedRow, setSelectedRow] = useUrlSyncedState<number>('bbs_selected_row', 0);

  // Dynamic calculations based on parameters
  const cc = 0.025; // clear cover 25mm

  // Row 1: Straight Main Reinforcement (16mm)
  // length = span - 2 * cover + 2 * hooks (9d each)
  const straightLength = span - 2 * cc + (2 * 9 * 16) / 1000;
  const straightUnitWt = PWD_REBAR_WEIGHTS[16] || 1.579;
  const straightCount = 4;
  const straightTotalWt = straightCount * straightLength * straightUnitWt;

  // Row 2: Cranked Bar (12mm)
  // length = span - 2 * cover + 2 * hooks (9d each) + 2 * crank (0.42 * D) where D = 120mm
  const crankLength = span - 2 * cc + (2 * 9 * 12) / 1000 + 2 * 0.42 * 0.12;
  const crankUnitWt = PWD_REBAR_WEIGHTS[12] || 0.888;
  const crankCount = 2;
  const crankTotalWt = crankCount * crankLength * crankUnitWt;

  // Row 3: Transverse Stirrups (8mm)
  // count = (span / spacingM) + 1
  const spacingM = spacing / 1000;
  const stirrupCount = Math.floor(span / spacingM) + 1;
  const stirrupLength = 2 * (0.3 - 2 * cc) + 2 * (0.45 - 2 * cc) + 0.15; // loop parameter 2*(a+b) + hook
  const stirrupUnitWt = PWD_REBAR_WEIGHTS[8] || 0.395;
  const stirrupTotalWt = stirrupCount * stirrupLength * stirrupUnitWt;

  const rows: BbsRow[] = [
    {
      mark: 'B1-01',
      description: 'Main Straight (Bottom)',
      shape: 'Straight (Hooks)',
      dia: 16,
      count: straightCount,
      length: straightLength,
      unitWeight: straightUnitWt,
      totalWeight: straightTotalWt,
    },
    {
      mark: 'B1-02',
      description: 'Cranked (Bent-Up)',
      shape: 'Double Cranked',
      dia: 12,
      count: crankCount,
      length: crankLength,
      unitWeight: crankUnitWt,
      totalWeight: crankTotalWt,
    },
    {
      mark: 'B1-03',
      description: 'Beam Stirrups (Ties)',
      shape: 'Closed Loop',
      dia: 8,
      count: stirrupCount,
      length: stirrupLength,
      unitWeight: stirrupUnitWt,
      totalWeight: stirrupTotalWt,
    },
  ];

  const grandTotalKg = rows.reduce((sum, r) => sum + r.totalWeight, 0);

  return (
    <TwoColumnLayout
      title="Standardized Bar Bending Schedule (BBS) Ledger"
      bgVariant="default"
      leftWidth="40%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Sessional Geometry">
            <div className="space-y-4">
              <ParameterSlider
                label="Clear Beam Span"
                min={3.0}
                max={9.0}
                step={0.5}
                value={span}
                onChange={setSpan}
                unit=" m"
              />
              <ParameterSlider
                label="Stirrup Spacing"
                min={100}
                max={250}
                step={25}
                value={spacing}
                onChange={setSpacing}
                unit=" mm"
              />
            </div>
          </InteractiveCard>

          <RebarBbsLedgerDrawing selectedRowIndex={selectedRow} className="flex-1" />
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <InteractiveCard title="Standardized BBS Measurement Ledger" className="flex-1">
            <div className="w-full overflow-x-auto select-text scrollbar-thin">
              <table className="w-full text-[9px] font-mono border-collapse text-left">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground font-bold">
                    <th className="pb-1.5 font-sans">Mark</th>
                    <th className="pb-1.5 font-sans">Description</th>
                    <th className="pb-1.5 font-sans">Shape</th>
                    <th className="pb-1.5 font-sans text-center">Dia</th>
                    <th className="pb-1.5 font-sans text-center">No.</th>
                    <th className="pb-1.5 font-sans text-right">Length</th>
                    <th className="pb-1.5 font-sans text-right">Unit Wt</th>
                    <th className="pb-1.5 font-sans text-right">Total Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.mark}
                      className={`border-b border-border/30 hover:bg-muted/30 cursor-pointer ${
                        selectedRow === idx ? 'bg-primary/5 text-primary font-bold border-l-2 border-l-primary pl-1' : 'text-foreground/80'
                      }`}
                      onClick={() => setSelectedRow(idx)}
                    >
                      <td className="py-2 pr-1 font-sans">{row.mark}</td>
                      <td className="py-2 pr-1 font-sans truncate max-w-[90px]" title={row.description}>
                        {row.description}
                      </td>
                      <td className="py-2 pr-1 font-sans">{row.shape}</td>
                      <td className="py-2 text-center">Ø{row.dia}</td>
                      <td className="py-2 text-center">{row.count}</td>
                      <td className="py-2 text-right">{row.length.toFixed(3)} m</td>
                      <td className="py-2 text-right">{row.unitWeight.toFixed(3)} kg/m</td>
                      <td className="py-2 text-right">{row.totalWeight.toFixed(2)} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-border/40 pt-3 mt-4">
              <CalculationOutput
                title="Grand Total Reinforcement Weight"
                value={grandTotalKg.toFixed(2)}
                unit="kg"
                subtitle="Aggregated rebar weight for BoQ scheduling (allowances not included)"
              />
            </div>
          </InteractiveCard>

          <SlideCallout variant="info" title="BBS Ledger Rules">
            <p className="text-[10px] leading-relaxed">
              Every row in the measurement book corresponds to a unique rebar configuration. Total Length = (No. of Bars × Length per Bar). Total Weight = (Total Length × Unit Weight). Notice how increasing the <strong>Beam Span</strong> updates all bar lengths and the stirrup count simultaneously.
            </p>
          </SlideCallout>
        </div>
      }
    />
  );
};

export default RebarBbsLedgerSandbox;
