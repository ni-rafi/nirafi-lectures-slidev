import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { InteractiveCard, SlideParagraph, ClickReveal } from '@/features/presentation/components/elements';
import { HelpCircle } from 'lucide-react';

export const DiscontinuityTriggers: React.FC = () => {
  const triggers = [
    { title: '1. Point Loads', desc: 'Concentrated external forces cause sudden mathematical step jumps in the Shear Force Diagram (SFD).', border: 'border-l-4 border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/5' },
    { title: '2. Point Moments', desc: 'Concentrated external couples cause sudden mathematical step jumps in the Bending Moment Diagram (BMD).', border: 'border-l-4 border-l-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/5' },
    { title: '3. Distributed Loads', desc: 'Starting or stopping points of uniform or varying distributed loads alter the shear slope (dV/dx = -w) and moment profile.', border: 'border-l-4 border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/5' }
  ];

  return (
    <FullWidthLayout
      title={<span>Locational Discontinuities & Triggers</span>}
    >
      <div className="w-full h-full flex flex-col justify-between gap-4 p-4 text-left select-text">
        <div>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-0.5">Equation Boundaries</span>
          <h2 className="text-lg font-bold text-foreground">What Disrupts the Equation?</h2>
          <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-normal">
            A single continuous formula cannot track the beam whenever an abrupt external load configuration change occurs.
          </SlideParagraph>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
            {triggers.map((t, i) => (
              <ClickReveal key={i} at={i + 1}>
                <InteractiveCard className={`p-4 flex flex-col justify-between min-h-[140px] h-full ${t.border}`}>
                  <div>
                    <h4 className="text-xs font-bold text-foreground mb-1.5">{t.title}</h4>
                    <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-relaxed">{t.desc}</SlideParagraph>
                  </div>
                </InteractiveCard>
              </ClickReveal>
            ))}
          </div>
        </div>

        <ClickReveal at={3}>
          <div className="p-3 bg-muted/40 border border-border/60 rounded-xl text-[10px] text-muted-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-indigo-500 shrink-0" />
            <span><strong>Definition:</strong> Boundary conditions change at these transition points, dividing the beam into piecewise intervals.</span>
          </div>
        </ClickReveal>
      </div>
    </FullWidthLayout>
  );
};
