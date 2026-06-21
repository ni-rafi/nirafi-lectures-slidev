import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { 
  SlideContent, 
  ClickHighlight, 
  LatexFormula, 
  InteractiveCard, 
  ParameterSlider, 
  CalculationOutput
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';

/**
 * Slide 10: Stepped Masonry Footings
 */
export const Slide10: React.FC = () => {
  const [activeStep, setActiveStep] = useUrlSyncedState<number>('masonry_active_step', 1);
  const offsetSteps = [
    { id: 1, name: 'CC Bed', width: 'w-48 bg-muted border-primary/20', text: 'CC Base Bed: 900mm Width' },
    { id: 2, name: 'Step 1', width: 'w-36 bg-primary/20 border-primary/40', text: 'Step 1 Brickwork: 375mm Width' },
    { id: 3, name: 'Step 2', width: 'w-24 bg-primary/30 border-primary/50', text: 'Step 2 Brickwork: 250mm Width' },
  ];

  return (
    <TwoColumnLayout
      title="Stepped Masonry Foundation"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Brick or blockwork foundations step down to distribute wall loads to the wider concrete base.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Offset Offsets:</strong> Standard brick offsets are typically 125mm (5") or 62.5mm (2.5") per step.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Averaging Breadths:</strong> When using centerline methods, each step size changes the centerline deduction. Calculate each step size independently.
                </span>
              ),
              revealAt: 1,
            },
          ]}
        />
      }
      rightContent={
        <div className="flex flex-col justify-between h-full bg-muted/20 p-4 border border-border/40 rounded-xl">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Foundation Cross-Section Steps</h3>
          <div className="relative h-44 bg-muted/40 rounded-lg border border-border/30 flex flex-col justify-end items-center p-4">
            {offsetSteps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`h-8 border text-[9px] font-mono text-foreground flex items-center justify-center cursor-pointer transition-all duration-350 ${step.width} ${
                    isActive ? 'border-primary ring-2 ring-primary/30 font-bold scale-105 z-10' : 'opacity-70 hover:opacity-90'
                  }`}
                >
                  {step.name}
                </div>
              );
            })}
          </div>
          <div className="p-3 bg-muted/40 rounded border border-border/40">
            <span className="text-[9px] font-mono text-muted-foreground uppercase">Selected Step Dimension</span>
            <div className="text-xs font-bold text-primary font-mono mt-1">
              {offsetSteps[activeStep - 1]?.text || ''}
            </div>
          </div>
        </div>
      }
    />
  );
};

/**
 * Slide 11: Damp-Proof Course (DPC) & Deductions
 */
export const Slide11: React.FC = () => {
  const [totalLength, setTotalLength] = useUrlSyncedState<number>('dpc_total_length', 24.0);
  const [wallWidth, setWallWidth] = useUrlSyncedState<number>('dpc_wall_width', 0.25);
  const [sillOpenings, setSillOpenings] = useUrlSyncedState<number>('dpc_sill_openings', 3);

  const grossDpc = totalLength * wallWidth;
  const deduction = sillOpenings * 1.0 * wallWidth;
  const netDpc = grossDpc - deduction;

  return (
    <TwoColumnLayout
      title="DPC & Door Sill Deductions"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  The Damp-Proof Course (DPC) is a horizontal barrier at plinth level to block capillary moisture rise.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Surface Area Standard:</strong> DPC is measured in square meters (<ClickHighlight at={1} variant="paint"><LatexFormula math="\text{m}^2" /></ClickHighlight>) when thickness (e.g. 25mm to 38mm) is standardized.
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>The Sill Deduction Rule:</strong> DPC must be <ClickHighlight at={2} variant="paint">deducted across all door openings</ClickHighlight>, veranda entrances, and floor gates. No DPC is laid where thresholds are constructed.
                </span>
              ),
              revealAt: 0,
            },
          ]}
        />
      }
      rightContent={
        <InteractiveCard title="DPC Net Area Calculator">
          <div className="space-y-3 mb-4">
            <ParameterSlider
              label="Gross Plinth Wall Length"
              min={10}
              max={50}
              step={1}
              value={totalLength}
              onChange={setTotalLength}
              unit=" m"
            />
            <ParameterSlider
              label="Plinth Wall Width"
              min={0.125}
              max={0.375}
              step={0.125}
              value={wallWidth}
              onChange={setWallWidth}
              unit=" m"
            />
            <ParameterSlider
              label="Number of Door Sill Openings (1.0m each)"
              min={0}
              max={6}
              step={1}
              value={sillOpenings}
              onChange={setSillOpenings}
              unit=" doors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
            <CalculationOutput 
              title="Gross DPC Area" 
              value={`${grossDpc.toFixed(3)}`} 
              unit="m²"
            />
            <CalculationOutput 
              title="DPC Door Deductions (Ddt)" 
              value={`-${deduction.toFixed(3)}`} 
              unit="m²"
              className="text-red-500"
            />
          </div>
          <div className="mt-2 bg-muted/40 p-2 border border-border/40 rounded-xl">
            <CalculationOutput 
              title="Net BoQ DPC Area" 
              value={`${netDpc.toFixed(3)}`} 
              unit="m²"
            />
          </div>
        </InteractiveCard>
      }
    />
  );
};

/**
 * Slide 12: Damp-Proof Membrane (DPM) & Slabs
 */
export const Slide12: React.FC = () => {
  return (
    <TwoColumnLayout
      title="Damp-Proof Membrane & Slabs"
      bgVariant="default"
      leftWidth="50%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Moisture protection continues under ground floor slabs to isolate habitable areas.
                </span>
              ),
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Polythene Sheeting (DPM):</strong> Laid flat over compacted sand bedding prior to casting ground floor RCC slabs. Kept in area ($m^2$).
                </span>
              ),
              revealAt: 0,
            },
            {
              type: 'bullet',
              text: (
                <span>
                  <strong>Compacted Sand Filling:</strong> Sand cushion layers (e.g., 75mm–150mm thickness) serve as capillary breaks beneath slabs and are measured in volume ($m^3$).
                </span>
              ),
              revealAt: 1,
            },
          ]}
        />
      }
      rightContent={
        <div className="flex flex-col justify-between h-full bg-muted/20 p-4 border border-border/40 rounded-xl">
          <div className="h-44 bg-muted/40 rounded-lg border border-border/30 relative flex flex-col justify-end p-4">
            <div className="w-full bg-primary/20 border border-primary/45 text-[10px] text-foreground font-extrabold py-2 text-center rounded">
              RCC Ground Floor Slab (100-120mm)
            </div>
            <div className="w-full h-1 bg-emerald-500 animate-pulse my-0.5" />
            <div className="w-full text-[9px] text-emerald-500 font-mono text-center mb-1">
              Polythene Sheet DPM
            </div>
            <div className="w-full bg-amber-500/10 border-x border-b border-amber-500/30 text-[10px] text-amber-600 dark:text-amber-400 font-bold py-3 text-center rounded-b">
              Compacted Sand Cushion Base
            </div>
          </div>
          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-600 dark:text-emerald-400">
            <strong>Local Practice Note:</strong> Single layer DPM polythene sheets typically overlap by 100mm-150mm. Overlaps are not measured separately; they are covered in material wastage allowances.
          </div>
        </div>
      }
    />
  );
};
