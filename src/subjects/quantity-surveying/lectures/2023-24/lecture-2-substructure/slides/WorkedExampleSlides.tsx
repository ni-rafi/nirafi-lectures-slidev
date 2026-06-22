import React from 'react';
import { CONCRETE_SHRINKAGE_FACTOR } from '@/subjects/quantity-surveying/cores';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  SlideContent,
  SlideTable,
  ClickHighlight,
  ClickReveal,
  InteractiveCard,
  ParameterSlider,
  ClickSyncedTabs,
  ClickSyncedTabItem,
  SlideBullet
} from '@/features/presentation/components/elements';
import { UnitConverter } from '@/cores/shared/utils/unitConverter';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { FootingDrawingCanvas } from '@/subjects/quantity-surveying/features';

// Worked Example: Isolated Footing
export const Slide9: React.FC = () => {
  const [footingLength, setFootingLength] = useUrlSyncedState<number>('footingLength', 1.50);
  const [footingWidth, setFootingWidth] = useUrlSyncedState<number>('footingWidth', 1.50);
  const [depth, setDepth] = useUrlSyncedState<number>('depth', 1.80);
  const [ccThickness, setCcThickness] = useUrlSyncedState<number>('ccThickness', 0.075);
  const [sandThickness] = useUrlSyncedState<number>('sandThickness', 0.075);

  const { currentClick } = useClickStepsContext();

  const activeHighlight = 
    currentClick === 1 ? 'excavation' :
    currentClick === 2 ? 'bfs' :
    currentClick === 3 ? 'lean' : 'none';

  return (
    <TwoColumnLayout
      title="Worked Example: Isolated Footing"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Design Parameters & Inputs" variant="default" className="w-full">
            <div className="grid grid-cols-2 gap-3">
              <ParameterSlider
                label="Footing Length"
                min={1.0}
                max={3.0}
                step={0.05}
                value={footingLength}
                onChange={setFootingLength}
                unit=" m"
              />
              <ParameterSlider
                label="Footing Width"
                min={1.0}
                max={3.0}
                step={0.05}
                value={footingWidth}
                onChange={setFootingWidth}
                unit=" m"
              />
              <ParameterSlider
                label="Excavation Depth"
                min={1.0}
                max={2.5}
                step={0.05}
                value={depth}
                onChange={setDepth}
                unit=" m"
              />
              <ParameterSlider
                label="Lean Concrete Thickness"
                min={0.05}
                max={0.15}
                step={0.005}
                value={ccThickness}
                onChange={setCcThickness}
                unit=" m"
                displayValue={`${(ccThickness * 1000).toFixed(0)} mm`}
              />
            </div>
          </InteractiveCard>

          <InteractiveCard title="Required Tasks" variant="default" className="w-full">
            <ul className="flex flex-col gap-2">
              <SlideBullet revealAt={1} icon={<span className="font-extrabold text-amber-500">1</span>}>
                <span>
                  <strong>Task 1:</strong> Compute the total volume of earthwork excavation required in the field.
                </span>
              </SlideBullet>
              <SlideBullet revealAt={2} icon={<span className="font-extrabold text-orange-500">2</span>}>
                <span>
                  <strong>Task 2:</strong> Compute the total surface area of Brick Flat Soling (BFS) to be laid.
                </span>
              </SlideBullet>
              <SlideBullet revealAt={3} icon={<span className="font-extrabold text-blue-500">3</span>}>
                <span>
                  <strong>Task 3:</strong> Compute the raw dry materials required for the <strong>1:3:6</strong> Lean Concrete layer.
                </span>
              </SlideBullet>
            </ul>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-center h-full">
          <FootingDrawingCanvas
            width={footingWidth}
            length={footingLength}
            depth={depth}
            ccThickness={ccThickness}
            sandThickness={sandThickness}
            activeHighlight={activeHighlight}
          />
        </div>
      }
    />
  );
};

// Bangladesh Field Realities: The Sand Cushion
export const Slide10: React.FC = () => {
  const [footingLength] = useUrlSyncedState<number>('footingLength', 1.50);
  const [footingWidth] = useUrlSyncedState<number>('footingWidth', 1.50);
  const [depth] = useUrlSyncedState<number>('depth', 1.80);
  const [ccThickness] = useUrlSyncedState<number>('ccThickness', 0.075);
  const [sandThickness, setSandThickness] = useUrlSyncedState<number>('sandThickness', 0.075);

  return (
    <TwoColumnLayout
      title="Local Sub-Soil Reality: The Sand Cushion"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Geotechnical Necessity & Interventions" variant="default" className="w-full">
            <ul className="flex flex-col gap-2.5">
              <SlideBullet title="Expansive & Clayey Soils:">
                <span>
                  In many regions across Bangladesh, expansive or weak subgrade clay layer profiles cannot safely support building foundations directly.
                </span>
              </SlideBullet>
              <SlideBullet title="The Cushion Intervention:">
                <span>
                  To remedy this, local engineering protocol mandates placing a dynamic 3" to 6" (75 mm to 150 mm){' '}
                  <ClickHighlight at={1} variant="paint">sand cushion layer</ClickHighlight> directly over the excavated soil bed.
                </span>
              </SlideBullet>
            </ul>
          </InteractiveCard>

          <InteractiveCard title="Sessional Execution Target" variant="default" className="w-full">
            <ul className="flex flex-col gap-2.5">
              <SlideBullet title="Positioning in Envelope:">
                <span>
                  This sand envelope sits structurally underneath the Brick Flat Soling (BFS) layer.
                </span>
              </SlideBullet>
              <SlideBullet title="Field Measurement Standard:">
                <span>
                  Measured and logged in cubic units (m³ or cft). Height is restricted to the design depth, while length and breadth extend{' '}
                  <ClickHighlight at={2} variant="paint">3" (75 mm) beyond</ClickHighlight> the concrete footing bounds.
                </span>
              </SlideBullet>
              <SlideBullet icon="⚠️" className="text-amber-600 dark:text-amber-400">
                <span>
                  <strong>Lab Assignment Warning:</strong> Always carefully review your structural drawings for a sand filling item code; omitting this volume is a critical mistake commonly penalized in upcoming lab assignment reports.
                </span>
              </SlideBullet>
            </ul>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col gap-3 justify-center h-full">
          <FootingDrawingCanvas
            width={footingWidth}
            length={footingLength}
            depth={depth}
            ccThickness={ccThickness}
            sandThickness={sandThickness}
            activeHighlight="sand"
          />
          <div className="px-2">
            <ParameterSlider
              label="Adjust Sand Cushion Thickness"
              min={0.075}
              max={0.15}
              step={0.025}
              value={sandThickness}
              onChange={setSandThickness}
              unit=" m"
              displayValue={`${(sandThickness * 1000).toFixed(0)} mm`}
            />
          </div>
        </div>
      }
    />
  );
};

// Operational Mathematics & Conversions
export const Slide11: React.FC = () => {
  const [footingLength] = useUrlSyncedState<number>('footingLength', 1.50);
  const [footingWidth] = useUrlSyncedState<number>('footingWidth', 1.50);
  const [depth] = useUrlSyncedState<number>('depth', 1.80);
  const [ccThickness] = useUrlSyncedState<number>('ccThickness', 0.075);
  const [sandThickness] = useUrlSyncedState<number>('sandThickness', 0.075);

  const excavL = footingLength + 2 * 0.075;
  const excavW = footingWidth + 2 * 0.075;
  const excavationVol = excavL * excavW * depth;
  const excavationCft = UnitConverter.volume.m3ToCft(excavationVol);

  const sandVol = excavL * excavW * sandThickness;
  const sandCft = UnitConverter.volume.m3ToCft(sandVol);

  const bfsArea = footingLength * footingWidth;
  const bfsSft = UnitConverter.area.m2ToSft(bfsArea);

  const ccWetVol = footingLength * footingWidth * ccThickness;
  const ccWetCft = UnitConverter.volume.m3ToCft(ccWetVol);

  const ccDryVol = ccWetVol * CONCRETE_SHRINKAGE_FACTOR;
  const ccDryCft = ccWetCft * CONCRETE_SHRINKAGE_FACTOR;
  
  const cementVolCft = ccDryCft / 10;
  const cementBags = cementVolCft / 1.25;
  const sandVolCft = (ccDryCft / 10) * 3;
  const stoneVolCft = (ccDryCft / 10) * 6;

  const items: ClickSyncedTabItem[] = [
    {
      title: '1. Earthwork Excavation',
      badge: 'm³ → cft',
      badgeColor: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
      description: 'L & B extend 75mm (3") beyond concrete footing bounds on all sides for the sand bed cushion foundation footing.',
      rightContent: (
        <div className="flex flex-col gap-3 w-full p-2 select-text">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Excavation Volume Calculation</span>
          <div className="bg-muted/30 border border-border/40 rounded-xl p-3.5 flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trench L × B:</span>
              <span className="font-bold">{excavL.toFixed(2)} m × {excavW.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Depth (D):</span>
              <span className="font-bold">{depth.toFixed(2)} m</span>
            </div>
            <div className="border-t border-border/40 pt-2 flex justify-between text-primary font-extrabold">
              <span>Metric Volume:</span>
              <span>{excavationVol.toFixed(3)} m³</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1 border-t border-dashed border-border/40 pt-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Field Unit (CFT)</span>
            <span className="text-lg font-black text-amber-500">{excavationCft.toFixed(2)} cft</span>
          </div>
        </div>
      )
    },
    {
      title: '2. Sand Cushion Volume',
      badge: 'm³ → cft',
      badgeColor: 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10',
      description: 'Envelope coordinates match the excavation trench, with standard design depth matching the sand layer thickness.',
      rightContent: (
        <div className="flex flex-col gap-3 w-full p-2 select-text">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Sand Volume Calculation</span>
          <div className="bg-muted/30 border border-border/40 rounded-xl p-3.5 flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envelope L × B:</span>
              <span className="font-bold">{excavL.toFixed(2)} m × {excavW.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thickness (s):</span>
              <span className="font-bold">{(sandThickness * 1000).toFixed(0)} mm</span>
            </div>
            <div className="border-t border-border/40 pt-2 flex justify-between text-primary font-extrabold">
              <span>Metric Volume:</span>
              <span>{sandVol.toFixed(3)} m³</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1 border-t border-dashed border-border/40 pt-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Field Unit (CFT)</span>
            <span className="text-lg font-black text-yellow-500">{sandCft.toFixed(2)} cft</span>
          </div>
        </div>
      )
    },
    {
      title: '3. Brick Flat Soling (BFS)',
      badge: 'm² → sft',
      badgeColor: 'border-orange-500/30 text-orange-500 bg-orange-500/10',
      description: 'Laid flat. BFS is a superficial item calculated strictly by plane area based on footing bounds.',
      rightContent: (
        <div className="flex flex-col gap-3 w-full p-2 select-text">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">BFS Area Calculation</span>
          <div className="bg-muted/30 border border-border/40 rounded-xl p-3.5 flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Footing L × B:</span>
              <span className="font-bold">{footingLength.toFixed(2)} m × {footingWidth.toFixed(2)} m</span>
            </div>
            <div className="border-t border-border/40 pt-2 flex justify-between text-primary font-extrabold">
              <span>Surface Area:</span>
              <span>{bfsArea.toFixed(3)} m²</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1 border-t border-dashed border-border/40 pt-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Field Unit (SFT)</span>
            <span className="text-lg font-black text-orange-500">{bfsSft.toFixed(2)} sft</span>
          </div>
        </div>
      )
    },
    {
      title: '4. Lean Concrete Wet Vol',
      badge: 'm³ → cft',
      badgeColor: 'border-blue-500/30 text-blue-500 bg-blue-500/10',
      description: 'Calculated using net dimensions of footing base bounds and structural lean concrete thickness.',
      rightContent: (
        <div className="flex flex-col gap-3 w-full p-2 select-text">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Lean Concrete Volume</span>
          <div className="bg-muted/30 border border-border/40 rounded-xl p-3.5 flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Footing L × B:</span>
              <span className="font-bold">{footingLength.toFixed(2)} m × {footingWidth.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thickness (t):</span>
              <span className="font-bold">{(ccThickness * 1000).toFixed(0)} mm</span>
            </div>
            <div className="border-t border-border/40 pt-2 flex justify-between text-primary font-extrabold">
              <span>Metric Volume:</span>
              <span>{ccWetVol.toFixed(3)} m³</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1 border-t border-dashed border-border/40 pt-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Wet Vol (CFT)</span>
            <span className="text-lg font-black text-blue-500">{ccWetCft.toFixed(2)} cft</span>
          </div>
        </div>
      )
    },
    {
      title: '5. CC Dry Materials',
      badge: 'Take-off',
      badgeColor: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
      description: `Shrinkage multiplier (${CONCRETE_SHRINKAGE_FACTOR}) applied. Total mix proportions (1:3:6) = 10 parts.`,
      rightContent: (
        <div className="flex flex-col gap-2 w-full p-2 select-text text-left">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Materials Take-off (1:3:6)</span>
          <div className="bg-muted/30 border border-border/40 rounded-xl p-3 flex flex-col gap-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dry Volume:</span>
              <span className="font-bold text-foreground">{ccDryVol.toFixed(3)} m³ ({ccDryCft.toFixed(2)} cft)</span>
            </div>
            <div className="flex justify-between border-t border-border/20 pt-1.5 text-primary font-bold">
              <span>Cement (1/10):</span>
              <span>{cementBags.toFixed(2)} Bags</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Sand (3/10):</span>
              <span>{sandVolCft.toFixed(2)} cft</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Brick Chips (6/10):</span>
              <span>{stoneVolCft.toFixed(2)} cft</span>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/60 italic leading-tight">
            * Conversions: 1 cement bag = 1.25 cft = 0.0347 m³.
          </p>
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Operational Mathematics &amp; Conversions"
      items={items}
      leftTitle="Calculation Procedures"
      rightTitle="Output Summary &amp; Values"
      bgVariant="default"
    />
  );
};

// Mastering the Measurement Book (MB) Entry Ledger
export const Slide12: React.FC = () => (
  <FullWidthLayout title="Mastering the Measurement Book (MB) Entry Ledger" bgVariant="gallery">
    <SlideContent
      blocks={[
        {
          type: 'bullet',
          text: 'The Final Ledger: All calculations must be formally translated into standard non-ambiguous textual descriptions and logged inside the structural MB columns.',
        },
      ]}
    />
    <ClickReveal at={2}>
      <div className="mt-4 overflow-x-auto text-[13px]">
        <SlideTable
          caption="Measurement Book Entry Ledger for Footing F-1"
          headers={[
            { label: 'Item No.', align: 'left' },
            { label: 'Description of Work', align: 'left' },
            { label: 'Nos.', align: 'right' },
            { label: 'Length (L)', align: 'right' },
            { label: 'Breadth (B)', align: 'right' },
            { label: 'Height (H)', align: 'right' },
            { label: 'Quantity', align: 'right' },
            { label: 'Remarks', align: 'left' },
          ]}
          rows={[
            [
              '1.01',
              'Earthwork excavation in trenches for foundation structures, including shoring, leveling, and depositing excavated soil within a lead of 30m, as per drawings.',
              '1',
              '1.50 m',
              '1.50 m',
              '1.80 m',
              <ClickHighlight at={3} variant="paint">4.050 m³</ClickHighlight>,
              'Excavation volume',
            ],
            [
              '1.02',
              'Brick Flat Soling (BFS) in foundation bed with picked jhama bricks, including preparing the bed, packing with sand, and watering complete.',
              '1',
              '1.50 m',
              '1.50 m',
              '—',
              <ClickHighlight at={4} variant="paint">2.250 m²</ClickHighlight>,
              'Footing F-1 base',
            ],
            [
              '1.03',
              'Mass cement concrete (1:3:6) with best quality cement, local sand, and 25mm down graded brick chips including mixing, casting, and curing.',
              '1',
              '1.50 m',
              '1.50 m',
              '0.075 m',
              <ClickHighlight at={5} variant="paint">0.169 m³</ClickHighlight>,
              'Lean layer',
            ],
          ]}
        />
      </div>
    </ClickReveal>
  </FullWidthLayout>
);

const PrecisionSandbox: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const [length, setLength] = React.useState<number>(4.524);
  const [width, setWidth] = React.useState<number>(3.153);
  const [height, setHeight] = React.useState<number>(0.155);

  const roundedL = parseFloat(length.toFixed(2));
  const roundedW = parseFloat(width.toFixed(2));
  const roundedH = parseFloat(height.toFixed(2));

  const rawVol = length * width * height;
  const roundedVol = roundedL * roundedW * roundedH;
  const finalQuantity = parseFloat(roundedVol.toFixed(3));

  return (
    <div className="flex flex-col gap-3 w-full bg-muted/10 dark:bg-muted/5 border border-border/40 rounded-2xl p-4 transition-all">
      <span className="text-[10px] uppercase font-bold text-primary tracking-widest text-center block border-b border-border/40 pb-2 select-none">
        Field Precision Sandbox (PWD Rules)
      </span>

      <div className={`flex flex-col gap-2 my-1 transition-all duration-350 ${activeStep === 0 ? 'ring-2 ring-primary/45 bg-primary/5 p-1.5 rounded-xl border border-primary/20' : 'opacity-70'}`}>
        {activeStep === 0 && (
          <span className="text-[9px] uppercase font-bold text-primary tracking-wider block text-center -mt-1 select-none">
            Inputs rounded to 2 Decimal Places
          </span>
        )}
        <div className="flex justify-between items-center bg-background/40 p-2 rounded-lg border border-border/30">
          <span className="text-[11px] font-medium text-muted-foreground">Raw Length:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.001"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              className="w-16 text-center font-mono text-[11px] text-foreground bg-background p-1 rounded border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[10px] font-bold text-primary w-24 text-right">→ {roundedL.toFixed(2)} m</span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-background/40 p-2 rounded-lg border border-border/30">
          <span className="text-[11px] font-medium text-muted-foreground">Raw Width:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.001"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              className="w-16 text-center font-mono text-[11px] text-foreground bg-background p-1 rounded border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[10px] font-bold text-primary w-24 text-right">→ {roundedW.toFixed(2)} m</span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-background/40 p-2 rounded-lg border border-border/30">
          <span className="text-[11px] font-medium text-muted-foreground">Raw Depth:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.001"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-16 text-center font-mono text-[11px] text-foreground bg-background p-1 rounded border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[10px] font-bold text-primary w-24 text-right">→ {roundedH.toFixed(2)} m</span>
          </div>
        </div>
      </div>

      <div className={`border-t border-dashed border-border/40 pt-2.5 flex flex-col gap-1.5 transition-all duration-350 ${activeStep === 0 ? 'opacity-30' : 'opacity-100'}`}>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-muted-foreground font-medium">Raw Product Volume:</span>
          <span className="font-mono text-foreground">{rawVol.toFixed(6)} m³</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-muted-foreground font-medium">Using rounded inputs (PWD):</span>
          <span className="font-mono text-foreground">{roundedVol.toFixed(5)} m³</span>
        </div>
        <div className={`flex justify-between items-center text-xs font-bold p-2 rounded-lg border transition-all duration-350 mt-0.5 ${activeStep >= 1 ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary/20 scale-[1.01]' : 'bg-primary/5 border-primary/20'}`}>
          <span className="text-primary flex flex-col items-start leading-none">
            <span>Final Quantity (3-Dec):</span>
            {activeStep >= 1 && <span className="text-[8px] uppercase tracking-wide opacity-80 mt-0.5">Rounded Volumetric Yield</span>}
          </span>
          <span className="font-mono text-primary text-sm">{finalQuantity.toFixed(3)} m³</span>
        </div>
      </div>

      <p className="text-[9px] text-muted-foreground leading-normal text-center font-mono select-none">
        Notice: Input rounding occurs in the MB *before* multiplication!
      </p>
    </div>
  );
};

// The 2-Decimal Rule & Field Precision
export const Slide13: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  return (
    <TwoColumnLayout
      title="The 2-Decimal Rule & Field Precision"
      bgVariant="default"
      leftWidth="55%"
      leftContent={
        <InteractiveCard title="Rounding & Precision Guidelines" variant="default" className="w-full">
          <div className="flex flex-col gap-3.5">
            <ClickHighlight at={1} className="hidden">{' '}</ClickHighlight>
            <ClickHighlight at={2} className="hidden">{' '}</ClickHighlight>

            <div className={`transition-all duration-350 ${currentClick >= 0 ? 'opacity-100' : 'opacity-20'}`}>
              <h4 className={`text-xs font-extrabold mb-0.5 uppercase tracking-wide ${currentClick === 0 ? 'text-primary font-black' : 'text-foreground font-bold'}`}>
                1. Field Dimension Precision
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed select-text">
                Under standard PWD billing rules, all linear structural measurements (L, B, H) manually entered into the Measurement Book (MB) must universally be rounded and recorded strictly to <span className="font-bold text-foreground bg-primary/10 px-1.5 py-0.5 rounded">two decimal places</span> (e.g., 1.50 m).
              </p>
            </div>
            <div className={`border-t border-dashed border-border/40 pt-3.5 transition-all duration-350 ${currentClick >= 1 ? 'opacity-100' : 'opacity-20'}`}>
              <h4 className={`text-xs font-extrabold mb-0.5 uppercase tracking-wide ${currentClick === 1 ? 'text-primary font-black' : 'text-foreground font-bold'}`}>
                2. Volumetric & Area Yields
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed select-text">
                While inputs are restricted to two decimal places, the final calculated spatial quantities (such as volume items) are structurally tracked and rounded to <span className="font-bold text-foreground bg-primary/10 px-1.5 py-0.5 rounded">three decimal places</span> (e.g., 0.169 m³).
              </p>
            </div>
            <div className={`border-t border-dashed border-border/40 pt-3.5 transition-all duration-350 ${currentClick >= 2 ? 'opacity-100' : 'opacity-20'}`}>
              <h4 className={`text-xs font-extrabold mb-0.5 uppercase tracking-wide ${currentClick === 2 ? 'text-primary font-black' : 'text-foreground font-bold'}`}>
                3. Significance of Consistency
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed select-text">
                Strict numerical boundaries prevent minor creeping errors from ballooning into large commercial deficits across multi-million BDT public works infrastructure accounts.
              </p>
            </div>
          </div>
        </InteractiveCard>
      }
      rightContent={
        <div className="flex flex-col justify-center h-full">
          <PrecisionSandbox activeStep={currentClick} />
        </div>
      }
    />
  );
};
