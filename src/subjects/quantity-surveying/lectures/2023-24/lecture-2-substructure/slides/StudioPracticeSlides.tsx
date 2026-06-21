import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { 
  SlideContent, 
  InteractiveCard, 
  CalculationOutput,
  SlideTable
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Slide 13: Standard Dimension Paper Anatomy
 */
export const Slide13: React.FC = () => {
  return (
    <TwoColumnLayout
      title="Standard Dimension Paper Anatomy"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Quantity survey take-offs are written on a standardized column layout called <strong>Dimension Paper</strong>.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>1. Timesing:</strong> Multipliers used when there are multiple identical structures (e.g. 4 identical footings).
                </span>
              ),
              revealAt: 1,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>2. Dimension (L/B/D):</strong> Length, breadth, and depth entered in order.
                </span>
              ),
              revealAt: 2,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>3. Squaring:</strong> Calculating the product of the Timesing factor and dimensions to get the item total.
                </span>
              ),
              revealAt: 3,
            },
          ]}
        />
      }
      rightContent={
        <div className="flex flex-col justify-between h-full bg-muted/20 p-4 border border-border/40 rounded-xl">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Dimension Sheet Anatomy</h3>
          
          <SlideTable
            dense="relaxed"
            headers={[
              { label: 'Timesing', align: 'left', width: '20%' },
              { label: 'Dimensions', align: 'left', width: '30%' },
              { label: 'Description', align: 'left', width: '30%' },
              { label: 'Squaring', align: 'right', width: '20%' }
            ]}
            rows={[
              [
                <span className="text-primary font-bold">4</span>,
                <span className="font-mono text-foreground">1.200<br />1.200<br />1.500</span>,
                <span className="text-muted-foreground">Excavation for isolated column footings.</span>,
                <span className="text-emerald-500 font-bold">8.640 m³</span>
              ]
            ]}
          />
          
          <div className="p-2.5 bg-muted/40 border border-border/40 rounded-xl text-[9px] text-muted-foreground font-mono mt-3">
            Calculation: 4 × (1.200 × 1.200 × 1.500) = 8.640 m³
          </div>
        </div>
      }
    />
  );
};

/**
 * Slide 14: Timesing, Add, & Deduct Notations
 */
export const Slide14: React.FC = () => {
  const [showDeduction, setShowDeduction] = useUrlSyncedState<boolean>('show_deduct_ledger', false);
  const baseExcavation = 100.000;
  const footingDisplacement = 12.500;
  const netBackfill = baseExcavation - footingDisplacement;

  return (
    <TwoColumnLayout
      title="Timesing, Add & Deduct Notations"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Adjusting gross measurements to get net quantities is done using formal <strong>"Add"</strong> and <strong>"Deduct" (Ddt)</strong> notations.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>"Add" Notation:</strong> Sums up gross volumes or dimensions.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>"Deduct" (Ddt) Notation:</strong> Subtracts displaced volumes (such as concrete footings inside trenches to determine net backfill).
                </span>
              ),
              revealAt: 1,
            },
          ]}
        />
      }
      rightContent={
        <InteractiveCard title="Add / Deduct (Ddt) Ledger View">
          <div className="bg-muted/40 p-2.5 rounded-xl border border-border/40 space-y-2 mb-4">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Gross Excavation Vol:</span>
              <span className="text-foreground font-bold">{baseExcavation.toFixed(3)} m³</span>
            </div>
            
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Ddt: Column Footings
              </span>
              <button
                onClick={() => setShowDeduction(!showDeduction)}
                className="bg-background border border-border/40 text-xs px-2.5 py-1 rounded-md text-primary font-bold hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {showDeduction ? 'Active' : 'Show Deduct'}
              </button>
            </div>

            {showDeduction && (
              <div className="text-[10px] text-red-500 bg-red-500/10 p-2 rounded-xl border border-red-500/20 font-mono animate-fadeIn">
                Deducting structural displacement: -{footingDisplacement.toFixed(3)} m³
              </div>
            )}
          </div>

          <div className="border-t border-border/40 pt-2 font-mono">
            <CalculationOutput 
              title="Net Backfill Volume" 
              value={showDeduction ? `${netBackfill.toFixed(3)}` : `${baseExcavation.toFixed(3)}`} 
              unit="m³"
            />
          </div>
        </InteractiveCard>
      }
    />
  );
};

/**
 * Slide 15: Laboratory Report & Summary
 */
export const Slide15: React.FC = () => {
  return (
    <TwoColumnLayout
      title="Lab Report & Class Summary"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  <strong>Lab Report 2 Requirements:</strong> Teams of students will interpret foundation structural blueprints and compile a substructure BoQ.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Deliverable:</strong> Substructure Take-off & Concrete Work Sheet. Include excavation, BFS, CC base, stepped footings, and DPC net area.
                </span>
              ),
              revealAt: 0,
            },
          ]}
        />
      }
      rightContent={
        <div className="flex flex-col justify-between h-full bg-muted/20 p-4 border border-border/40 rounded-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-xs">Submit calculations rounded to 3 decimal places.</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-xs">Include centerline junction deductions explicitly.</span>
            </div>
          </div>
          
          <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-[10px] text-muted-foreground text-center font-mono mt-auto">
            Class 2 Substructure Complete • Ready for Lab Practice
          </div>
        </div>
      }
    />
  );
};
