import React from 'react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import {
  InteractiveCard,
  ParameterSlider,
  CalculationOutput
} from '@/features/presentation/components/elements';
import { calculateRoadwayVolumeMidSectional } from '../../cores';

// Fixed chainages and depths for estimation (some fill, some cut)
const STATIONS = [
  { chainage: 0, d: 1.2 },    // Embankment
  { chainage: 30, d: 0.6 },   // Embankment
  { chainage: 60, d: -0.4 },  // Trench Cut
  { chainage: 90, d: -1.0 },  // Trench Cut
  { chainage: 120, d: -0.7 }, // Trench Cut
];

export const RoadwayTabularSandbox: React.FC = () => {
  const [B, setB] = useUrlSyncedState<number>('tab_B', 10.0);
  const [sFill, setSFill] = useUrlSyncedState<number>('tab_sf', 2.0);
  const [sCut, setSCut] = useUrlSyncedState<number>('tab_sc', 1.5);
  const [L, setL] = useUrlSyncedState<number>('tab_L', 30.0); // Station interval

  // Calculate mid-section rows
  const rows = [];
  let totalCutVol = 0;
  let totalFillVol = 0;

  for (let i = 0; i < STATIONS.length - 1; i++) {
    const st1 = STATIONS[i]!;
    const st2 = STATIONS[i + 1]!;
    
    const res = calculateRoadwayVolumeMidSectional(B, sCut, sFill, st1.d, st2.d, L);
    const cutVol = res.isFilling ? 0 : res.volume;
    const fillVol = res.isFilling ? res.volume : 0;

    totalCutVol += cutVol;
    totalFillVol += fillVol;

    rows.push({
      interval: `${st1.chainage} - ${st2.chainage}`,
      d1: st1.d,
      d2: st2.d,
      dMean: res.dMean,
      isFilling: res.isFilling,
      s: res.s,
      area: res.area,
      cutVol,
      fillVol,
    });
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 w-full items-stretch select-text">
      <div className="xl:col-span-3 flex flex-col justify-between space-y-4">
        <InteractiveCard title="Sheet Configurations">
          <div className="space-y-4 mb-4">
            <ParameterSlider
              label="Carriageway Width (B)"
              min={6.0}
              max={12.0}
              step={0.5}
              value={B}
              onChange={setB}
              unit=" m"
            />
            <ParameterSlider
              label="Embankment Slope (s_fill)"
              min={1.5}
              max={3.0}
              step={0.5}
              value={sFill}
              onChange={setSFill}
              unit=" :1"
            />
            <ParameterSlider
              label="Trench Cut Slope (s_cut)"
              min={1.0}
              max={2.5}
              step={0.5}
              value={sCut}
              onChange={setSCut}
              unit=" :1"
            />
            <ParameterSlider
              label="Station Interval (L)"
              min={15.0}
              max={50.0}
              step={5.0}
              value={L}
              onChange={setL}
              unit=" m"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/40">
            <CalculationOutput
              title="Sum Cutting"
              value={totalCutVol.toFixed(2)}
              unit=" m³"
              variant="compact"
            />
            <CalculationOutput
              title="Sum Filling"
              value={totalFillVol.toFixed(2)}
              unit=" m³"
              variant="compact"
            />
          </div>
        </InteractiveCard>
      </div>

      <div className="xl:col-span-9 bg-muted/20 border border-border/40 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-3 block text-center">
            Standard Earthwork Tabular measurement Book
          </span>
          <div className="overflow-x-auto rounded-lg border border-border/20 bg-background">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-muted/80 text-muted-foreground text-[10px] uppercase border-b border-border/20">
                <tr>
                  <th className="px-3 py-2 font-bold">Station Interval (m)</th>
                  <th className="px-3 py-2 text-right">Start d₁ (m)</th>
                  <th className="px-3 py-2 text-right">End d₂ (m)</th>
                  <th className="px-3 py-2 text-right">Mean d_m (m)</th>
                  <th className="px-3 py-2 text-right">Slope s:1</th>
                  <th className="px-3 py-2 text-right">Area (m²)</th>
                  <th className="px-3 py-2 text-right text-red-500 font-bold">Cutting Vol (m³)</th>
                  <th className="px-3 py-2 text-right text-emerald-500 font-bold">Filling Vol (m³)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-bold text-foreground/80">{row.interval}</td>
                    <td className="px-3 py-2.5 text-right font-semibold">{row.d1.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold">{row.d2.toFixed(2)}</td>
                    <td className={`px-3 py-2.5 text-right font-bold ${
                      row.dMean >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                    }`}>
                      {row.dMean.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right">{row.s.toFixed(1)}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-primary">{row.area.toFixed(3)}</td>
                    <td className="px-3 py-2.5 text-right text-red-500 font-bold">
                      {row.cutVol > 0 ? row.cutVol.toFixed(2) : '-'}
                    </td>
                    <td className="px-3 py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      {row.fillVol > 0 ? row.fillVol.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <span className="text-[10px] text-muted-foreground text-center mt-3 leading-normal">
          Dutta's Mid-Sectional Area Equation applied: A = B·d_m + s·d_m². Length between chainage is {L.toFixed(0)}m. Cutting and filling volumes are computed in separate columns as they represent separate cost items under PWD rules.
        </span>
      </div>
    </div>
  );
};
