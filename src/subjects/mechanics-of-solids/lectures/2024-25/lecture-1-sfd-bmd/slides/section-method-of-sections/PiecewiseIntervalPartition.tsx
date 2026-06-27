import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { SlideParagraph, ClickReveal, SlideBullet, ClickHighlight } from '@/features/presentation/components/elements';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { PiecewiseIntervalDiagram } from './drawings/PiecewiseIntervalDiagram';

export const PiecewiseIntervalPartition: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  return (
    <FullWidthLayout
      title={<span>Interval Partitioning & Piecewise Boundaries</span>}
    >
      <div className="w-full h-full flex flex-col justify-between gap-4 p-4 text-left select-text">
        <div>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-0.5">Partition Protocol</span>
          <h2 className="text-lg font-bold text-foreground">Dividing the Beam Domain</h2>
          <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-normal">
            Identify the trigger points on the beam load matrix to establish calculation intervals.
          </SlideParagraph>
        </div>

        <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-muted/5 border border-border/40 rounded-xl relative min-h-[180px]">
          <PiecewiseIntervalDiagram activeStep={step} />
          
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1 items-stretch">
          <ClickReveal at={1}>
            <div className="bg-indigo-500/[0.015] border border-indigo-500/10 p-3 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-indigo-500 font-bold font-mono">1</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Locate Discontinuities:</strong> Point loads or moments divide the total span into <ClickHighlight at={1} variant="paint">local domains</ClickHighlight>.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-emerald-500/[0.015] border border-emerald-500/10 p-3 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-emerald-500 font-bold font-mono">2</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Define Intervals:</strong> Write down inequalities (e.g. Zone 1: <ClickHighlight at={2} variant="paint">0 &le; x &lt; 5</ClickHighlight>, Zone 2: <ClickHighlight at={2} variant="paint">5 &le; x &lt; 10</ClickHighlight>, Zone 3: <ClickHighlight at={2} variant="paint">10 &le; x &le; 16</ClickHighlight>).
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={3}>
            <div className="bg-rose-500/[0.015] border border-rose-500/10 p-3 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-rose-500 font-bold font-mono">3</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Perform Unique Sections:</strong> Each interval requires its own independent virtual <ClickHighlight at={3} variant="paint">section</ClickHighlight> to derive local V(x) and M(x).
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};

