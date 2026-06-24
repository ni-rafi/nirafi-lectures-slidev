import React from 'react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { calculateIPCBill } from '../../cores/budget';
import {
  InteractiveCard,
  ParameterSlider,
} from '@/features/presentation/components/elements';

export const ProgressIPCSandbox: React.FC = () => {
  // Sync individual milestone progress levels
  const [prev1, setPrev1] = useUrlSyncedState<number>('ipc_prev_1', 50);
  const [curr1, setCurr1] = useUrlSyncedState<number>('ipc_curr_1', 80);
  const [prev2, setPrev2] = useUrlSyncedState<number>('ipc_prev_2', 45);
  const [curr2, setCurr2] = useUrlSyncedState<number>('ipc_curr_2', 70);
  const [prev3, setPrev3] = useUrlSyncedState<number>('ipc_prev_3', 30);
  const [curr3, setCurr3] = useUrlSyncedState<number>('ipc_curr_3', 60);
  const [prev4, setPrev4] = useUrlSyncedState<number>('ipc_prev_4', 10);
  const [curr4, setCurr4] = useUrlSyncedState<number>('ipc_curr_4', 40);
  const [prev5, setPrev5] = useUrlSyncedState<number>('ipc_prev_5', 0);
  const [curr5, setCurr5] = useUrlSyncedState<number>('ipc_curr_5', 20);
  const [prev6, setPrev6] = useUrlSyncedState<number>('ipc_prev_6', 0);
  const [curr6, setCurr6] = useUrlSyncedState<number>('ipc_curr_6', 15);

  // Sync rate and credit configs
  const [contingency, setContingency] = useUrlSyncedState<number>('ipc_contingency', 3);
  const [profit, setProfit] = useUrlSyncedState<number>('ipc_profit', 10);
  const [retention, setRetention] = useUrlSyncedState<number>('ipc_retention', 10);
  const [mobilization, setMobilization] = useUrlSyncedState<number>('ipc_mobilization', 15);
  const [vat, setVat] = useUrlSyncedState<number>('ipc_vat', 7.5);
  const [ait, setAit] = useUrlSyncedState<number>('ipc_ait', 5.0);
  const [mosCredit, setMosCredit] = useUrlSyncedState<number>('ipc_mos', 25000);

  // Reconcile and calculate billing state
  const prevProgress = [prev1, prev2, prev3, prev4, prev5, prev6];
  const currProgress = [curr1, curr2, curr3, curr4, curr5, curr6];

  const bill = calculateIPCBill(
    currProgress,
    prevProgress,
    contingency / 100,
    profit / 100,
    retention / 100,
    mobilization / 100,
    vat / 100,
    ait / 100,
    mosCredit
  );

  // Format currency values
  const fmt = (val: number) => `৳${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch select-text">
      {/* Left panel: Milestone sliders & Parameters */}
      <div className="lg:col-span-6 flex flex-col gap-4 overflow-y-auto max-h-[580px] pr-1">
        <InteractiveCard title="Sessional Progress Controls">
          <div className="space-y-4">
            {bill.milestones.map((m, idx) => {
              const setPrev = [setPrev1, setPrev2, setPrev3, setPrev4, setPrev5, setPrev6][idx];
              const setCurr = [setCurr1, setCurr2, setCurr3, setCurr4, setCurr5, setCurr6][idx];
              if (!setPrev || !setCurr) return null;

              return (
                <div key={m.id} className="p-2 border border-border/40 rounded-lg bg-background/50 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-foreground">{m.name}</span>
                    <span className="text-muted-foreground text-[10px] font-mono">Base: {fmt(m.baseCost)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ParameterSlider
                      label="Prev %"
                      min={0}
                      max={100}
                      step={5}
                      value={m.previousProgress}
                      onChange={(val) => {
                        setPrev(val);
                        if (m.currentProgress < val) setCurr(val);
                      }}
                      unit="%"
                    />
                    <ParameterSlider
                      label="Curr %"
                      min={0}
                      max={100}
                      step={5}
                      value={m.currentProgress}
                      onChange={(val) => {
                        setCurr(Math.max(m.previousProgress, val));
                      }}
                      unit="%"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </InteractiveCard>

        <InteractiveCard title="Deductions & Loadings Rates">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <ParameterSlider label="Contingencies" min={0} max={10} step={0.5} value={contingency} onChange={setContingency} unit="%" />
            <ParameterSlider label="Contractor Profit" min={0} max={20} step={1} value={profit} onChange={setProfit} unit="%" />
            <ParameterSlider label="Security Retention" min={0} max={20} step={1} value={retention} onChange={setRetention} unit="%" />
            <ParameterSlider label="Mobilization Recover" min={0} max={25} step={1} value={mobilization} onChange={setMobilization} unit="%" />
            <ParameterSlider label="NBR VAT Rate" min={0} max={15} step={0.5} value={vat} onChange={setVat} unit="%" />
            <ParameterSlider label="NBR AIT Rate" min={0} max={10} step={0.5} value={ait} onChange={setAit} unit="%" />
            <div className="col-span-2">
              <ParameterSlider label="Material-on-Site Credit" min={0} max={100000} step={5000} value={mosCredit} onChange={setMosCredit} unit=" ৳" />
            </div>
          </div>
        </InteractiveCard>
      </div>

      {/* Right panel: IPC ledger bill sheet */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <InteractiveCard title="Interim Payment Certificate (IPC) Sheet">
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                  <th className="py-1.5 pr-2">Work Package</th>
                  <th className="py-1.5 text-right">Prev %</th>
                  <th className="py-1.5 text-right">Curr %</th>
                  <th className="py-1.5 text-right">Net Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 font-mono">
                {bill.milestones.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/30">
                    <td className="py-1.5 text-foreground font-sans font-medium">{m.name}</td>
                    <td className="py-1.5 text-right text-muted-foreground">{m.previousProgress}%</td>
                    <td className="py-1.5 text-right text-foreground">{m.currentProgress}%</td>
                    <td className="py-1.5 text-right font-bold">{fmt(m.netValue)}</td>
                  </tr>
                ))}
                <tr className="border-t border-border font-bold">
                  <td className="py-2 text-foreground font-sans">Total Direct Value</td>
                  <td colSpan={2} />
                  <td className="py-2 text-right">{fmt(bill.totalNetValue)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-muted-foreground">
              <span>(+) Contingencies ({contingency}%):</span>
              <span>{fmt(bill.contingencyAmount)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>(+) Contractor Profit ({profit}%):</span>
              <span>{fmt(bill.profitAmount)}</span>
            </div>
            <div className="flex justify-between text-foreground font-bold border-b pb-1.5">
              <span>(=) Gross Certified Claim:</span>
              <span className="text-primary">{fmt(bill.grossCurrentClaim)}</span>
            </div>

            <div className="flex justify-between text-red-500">
              <span>(-) Security Retention ({retention}%):</span>
              <span>-{fmt(bill.retentionDeduction)}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>(-) Mobilization Recovery ({mobilization}%):</span>
              <span>-{fmt(bill.mobilizationRecovery)}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>(-) NBR Source VAT ({vat}%):</span>
              <span>-{fmt(bill.vatDeduction)}</span>
            </div>
            <div className="flex justify-between text-red-500 border-b pb-1.5">
              <span>(-) NBR Source AIT ({ait}%):</span>
              <span>-{fmt(bill.aitDeduction)}</span>
            </div>

            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold border-b pb-1.5">
              <span>(+) Material-on-Site Credit:</span>
              <span>{fmt(mosCredit)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-primary/5 rounded-xl border border-primary/20 mt-3">
              <span className="font-sans font-bold text-foreground text-sm">Net Check Payout:</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{fmt(bill.netPayableCheck)}</span>
            </div>
          </div>
        </InteractiveCard>
      </div>
    </div>
  );
};
