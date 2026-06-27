import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { InteractiveCard, LatexFormula, SlideParagraph } from '@/features/presentation/components/elements';
import { Info } from 'lucide-react';

export const AnatomyOfInternalForces: React.FC = () => {
  const forceProfiles = [
    { symbol: 'P', name: 'Axial Force', desc: 'Longitudinal centroids tension or compression states.', formula: '\\sigma = P/A', bg: 'border-l-4 border-l-blue-500 bg-blue-50/20 dark:bg-blue-950/5' },
    { symbol: 'V', name: 'Shear Force', desc: 'Transverse slice actions operating along cut faces.', formula: '\\tau = VQ/Ib', bg: 'border-l-4 border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/5' },
    { symbol: 'M', name: 'Bending Moment', desc: 'Rotational bending moments deforming frame elements.', formula: '\\sigma = My/I', bg: 'border-l-4 border-l-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/5' },
    { symbol: 'T', name: 'Torque', desc: 'Torsional twist mechanics deforming member coordinates.', formula: '\\tau = Tr/J', bg: 'border-l-4 border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/5' }
  ];

  return (
    <FullWidthLayout
      title={<span>Stress Signatures - The Anatomy of Internal Forces</span>}
    >
      <div className="w-full h-full flex flex-col justify-between gap-4 p-4 text-left select-text">
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-auto">
            {forceProfiles.map((f, i) => (
              <InteractiveCard key={i} className={`p-4 flex flex-col justify-between min-h-[160px] ${f.bg}`}>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-lg font-mono font-black text-foreground">{f.symbol}</span>
                    <span className="text-[8px] font-semibold border rounded-full px-2 py-0.5 uppercase tracking-wide opacity-80">Profile</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground mb-1">{f.name}</h4>
                  <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-normal">{f.desc}</SlideParagraph>
                </div>
                <div className="mt-3 pt-2 border-t border-border/50 font-mono text-[9px] text-muted-foreground flex justify-between">
                  <span>Formula:</span>
                  <span className="font-bold text-primary"><LatexFormula math={f.formula} /></span>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>
        <div className="p-3 bg-muted/40 border border-border/60 rounded-xl text-[10px] text-muted-foreground flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-500 shrink-0" />
          <span><strong>Key Focus:</strong> For typical beam load profiles, we prioritize tracking <strong>Shear Force (V)</strong> and <strong>Bending Moment (M)</strong>. Axial (P) and Torque (T) are deactivated here (will be covered in respective topics elsewhere).</span>
        </div>
      </div>
    </FullWidthLayout>
  );
};
