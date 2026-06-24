import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import {
  SlideParagraph,
  InteractiveCard,
  SlideGrid,
  SlideCallout
} from '@/features/presentation/components/elements';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import {
  TrussTypologyDrawing,
  CgiRoofingSandbox,
  PwdSectionWeightSandbox,
  SecondaryFramingSandbox
} from '@/subjects/quantity-surveying/features';

// ============================================================================
// Slide: Roof Truss Typologies
// ============================================================================
export const TrussTypologySlide: React.FC = () => {
  const [activeTruss, setActiveTruss] = useUrlSyncedState<string>('truss_type', 'pratt');

  const trussData: Record<string, { title: string; desc: string }> = {
    pratt: {
      title: 'Pratt Truss',
      desc: 'Features vertical members in compression and diagonal members in tension. Highly efficient for spans up to 30m, and economical because diagonal tension members can be made lighter.'
    },
    howe: {
      title: 'Howe Truss',
      desc: 'The reverse of the Pratt truss. Vertical members are in tension and diagonal members are in compression. Requires heavier diagonal steel angles to resist buckling, but popular for heavy timber-steel hybrids.'
    },
    warren: {
      title: 'Warren Truss',
      desc: 'Consists of repeating equilateral triangles with alternating diagonals in tension and compression. Eliminates vertical web members, making it simple to fabricate and assemble in industrial warehouses.'
    },
    bowstring: {
      title: 'Bowstring Truss',
      desc: 'Features a curved top chord and straight bottom chord, shaped like an arch. Tension is carried primarily by the bottom tie. Used widely in industrial hangars and public garages to maximize clear headroom.'
    },
    monitor: {
      title: 'Truss with Monitor',
      desc: 'Features a base Pratt truss with a raised apex frame (monitor) designed for industrial ventilation. Popular in factories and warehouses to allow hot air to escape naturally from the building apex.'
    }
  };

  const current = trussData[activeTruss] || trussData.pratt!;

  return (
    <TwoColumnLayout
      title="Roof Truss Typologies &amp; Architectural Shapes"
      bgVariant="default"
      leftWidth="35%"
      leftContent={
        <div className="flex flex-col gap-2.5 h-full justify-between">
          <SlideParagraph title="Truss Classification">
            Before executing steel take-offs, the surveyor must identify the structural layout of the truss.
          </SlideParagraph>

          <div className="flex flex-col gap-1.5">
            {Object.keys(trussData).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTruss(key)}
                className={`py-2 px-3 text-left text-xs font-bold rounded-lg border transition-all ${
                  activeTruss === key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted border-border/40 hover:bg-muted/80 text-foreground'
                }`}
              >
                {trussData[key]!.title}
              </button>
            ))}
          </div>

          <SlideCallout variant="info" title="Shed Ventilation Monitor" className="py-1 text-[10px] text-muted-foreground leading-normal">
            For factory setups, you may also see a <strong>Truss with Monitor</strong>—an apex opening frame raised above the main rafter to allow heat ventilation.
          </SlideCallout>
        </div>
      }
      rightContent={
        <div className="flex flex-col h-full justify-between space-y-4">
          <InteractiveCard title={current.title} className="flex-1 flex flex-col justify-between">
            <div className="py-4 bg-background/50 rounded-lg border border-border/30 flex justify-center text-foreground">
              <div className="w-full max-w-[280px]">
                <TrussTypologyDrawing type={activeTruss} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed select-text mt-3">
              {current.desc}
            </p>
          </InteractiveCard>
        </div>
      }
    />
  );
};

// ============================================================================
// Slide: Primary Truss Geometry & Nomenclature
// ============================================================================
export const TrussGeometrySlide: React.FC = () => (
  <FullWidthLayout title="Primary Truss Geometry &amp; Nomenclature" bgVariant="default">
    <div className="flex flex-col gap-4 select-text">
      <SlideParagraph variant="plain" className="text-xs md:text-sm text-muted-foreground select-none">
        Understanding geometric parameters allows surveyors to determine member spans and lengths accurately.
      </SlideParagraph>

      <SlideGrid cols={3} gap="md">
        <InteractiveCard title="Span &amp; Rise" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            • <strong>Span (L)</strong>: The horizontal out-to-out distance between truss support centers.
            <br />• <strong>Rise (h)</strong>: The vertical height from the support centerline to the apex.
          </p>
        </InteractiveCard>
        <InteractiveCard title="Pitch &amp; Bay" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            • <strong>Pitch</strong>: Incline ratio of rise to span (e.g. 1:4).
            <br />• <strong>Bay Length</strong>: The spacing distance between two adjacent parallel trusses in a steel structure.
          </p>
        </InteractiveCard>
        <InteractiveCard title="Chords &amp; Webs" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            • <strong>Top Chord</strong>: The sloping principal rafters.
            <br />• <strong>Bottom Chord</strong>: The main horizontal tie bar.
            <br />• <strong>Webs</strong>: Internal struts and ties.
          </p>
        </InteractiveCard>
      </SlideGrid>

      <div className="mt-2 bg-muted/40 p-3 rounded-xl border border-border/40 select-text">
        <span className="font-bold text-xs text-primary block mb-1">Rafter Slope Formula:</span>
        <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
          Sloping length of principal rafter = √ ( Rise² + (Span / 2)² ).
          <br />Purlins run longitudinally along the bay length and rest on the top chord rafters at equal spacing.
        </p>
      </div>
    </div>
  </FullWidthLayout>
);

// ============================================================================
// Slide: Secondary Framing Components
// ============================================================================
export const SecondaryFramingSlide: React.FC = () => (
  <FullWidthLayout title="Secondary Framing: Bracings &amp; Sagrods" bgVariant="default">
    <div className="flex flex-col gap-4 select-text">
      <SlideParagraph variant="plain" className="text-xs md:text-sm text-muted-foreground select-none">
        Estimating steel framing requires quantifying secondary elements that reinforce the primary structure.
      </SlideParagraph>

      <SlideGrid cols={3} gap="md">
        <InteractiveCard title="Structural Bracings" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            Angle sections connecting adjacent bays to resist wind loads.
          </p>
          <div className="text-[10px] text-muted-foreground leading-normal font-mono border-t border-border/40 pt-1.5">
            • <strong>Top Chord Bracing</strong>: Connects top rafters.
            <br />• <strong>Bottom Chord Bracing</strong>: Stiffens ties.
            <br />• <strong>Vertical Bracing</strong>: Placed between columns.
          </div>
        </InteractiveCard>

        <InteractiveCard title="Sagrods" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            Small diameter round steel rods (e.g. 10mm or 12mm) connecting purlins.
          </p>
          <div className="text-[10px] text-muted-foreground leading-normal font-mono border-t border-border/40 pt-1.5">
            • <strong>Purpose</strong>: Prevents purlins from sagging under roof sheet gravity.
            <br />• <strong>Measurement</strong>: Summed by linear length and converted to kg weight.
          </div>
        </InteractiveCard>

        <InteractiveCard title="Bottom Chord Struts" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            Longitudinal angle sections connecting trusses.
          </p>
          <div className="text-[10px] text-muted-foreground leading-normal font-mono border-t border-border/40 pt-1.5">
            • <strong>Purpose</strong>: Provides lateral stability during erection.
            <br />• <strong>Measurement</strong>: Quantity × Bay length, mapped in ledger.
          </div>
        </InteractiveCard>
      </SlideGrid>

      <SlideCallout variant="warning" title="Erection Stability Requirements" className="py-2">
        <p className="text-[11px] leading-relaxed text-muted-foreground select-text">
          Many novice quantity surveyors fail to take off <strong>Sagrods</strong> and <strong>Bracings</strong> because they are shown on framing diagrams rather than individual truss templates. Always cross-check the longitudinal framing elevations!
        </p>
      </SlideCallout>
    </div>
  </FullWidthLayout>
);

// ============================================================================
// Slide: Estimating Sheet Roofing (Corrugated Cladding)
// ============================================================================
export const CgiRoofingSlide: React.FC = () => (
  <FullWidthLayout title="Estimating Sheet Roofing (Corrugated Cladding)" bgVariant="default">
    <div className="flex flex-col gap-4 select-text">
      <SlideParagraph variant="plain" className="text-xs md:text-sm text-muted-foreground select-none">
        A steel frame estimate is incomplete without the actual roof covering, typically grouped under PWD SoR Chapter 10.
      </SlideParagraph>

      <SlideGrid cols={3} gap="md">
        <InteractiveCard title="Measurement Standard" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            • <strong>Surface Area Billing</strong>: Corrugated Galvanized Iron (CGI) sheets are measured in square area (m² or sft).
            <br />• <strong>Corrugation Multiplier</strong>: To account for waves/folds, PWD mandates multiplying flat plan area by <strong>1.15</strong>.
          </p>
        </InteractiveCard>
        <InteractiveCard title="Thickness Gauges" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            • <strong>BWG / SWG</strong>: Sheets are designated by standard wire gauges.
            <br />• <strong>PWD standard</strong>: Standard public works projects specify 22 BWG (0.80 mm) or 24 BWG (0.63 mm) cladding.
          </p>
        </InteractiveCard>
        <InteractiveCard title="Accessories &amp; Ridging" variant="default">
          <p className="text-xs text-muted-foreground leading-relaxed">
            • <strong>Fixing Items</strong>: Rates include J-hooks, bolts, limpet washers, and putty.
            <br />• <strong>Ridge Cap</strong>: Continuous plain sheet ridging along the apex is measured in <strong>running meters</strong>.
          </p>
        </InteractiveCard>
      </SlideGrid>

      <SlideCallout variant="info" title="Estimation Math Hint">
        <p className="text-[11px] leading-relaxed text-muted-foreground select-text">
          Always use the <strong>sloped rafter length</strong> (not horizontal half-span) when calculating cladding sheet area:
          <br /><code>Total Area = 2 × (Rafter Slope + Eaves Overhang) × (Building Length + 2 × Side Overhang) × Corrugation Factor</code>
        </p>
      </SlideCallout>
    </div>
  </FullWidthLayout>
);

// ============================================================================
// Slide: CGI Roofing Sandbox
// ============================================================================
export const CgiRoofingSandboxSlide: React.FC = () => (
  <CgiRoofingSandbox />
);

// ============================================================================
// Slide: PWD Section Weight Sandbox
// ============================================================================
export const PwdSectionWeightSlide: React.FC = () => (
  <PwdSectionWeightSandbox />
);

// ============================================================================
// Slide: Secondary Framing Sandbox
// ============================================================================
export const SecondaryFramingSandboxSlide: React.FC = () => (
  <SecondaryFramingSandbox />
);
