import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { ClickReveal, SlideParagraph } from '@/features/presentation/components/elements';
import { Compass } from 'lucide-react';
import { ShearConventionDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

export const ShearSignConvention: React.FC = () => {
  const clickContext = useClickStepsContext();
  const { currentClick, setClick } = clickContext;
  const [activeSide, setActiveSide] = useUrlSyncedState<'left' | 'right'>('sfd_bmd_l1_shear_side', 'left');

  React.useEffect(() => {
    if (currentClick !== undefined) {
      setActiveSide(currentClick <= 1 ? 'left' : 'right');
    }
  }, [currentClick, setActiveSide]);

  const toggleSide = (side: 'left' | 'right') => {
    setActiveSide(side);
    setClick(side === 'left' ? 1 : 2);
  };

  const activeStep = Math.min(currentClick ?? 0, 2);

  return (
    <TwoColumnLayout
      title="Shear Sign Convention"
      leftWidth="55%"
      leftContent={
        <div className="bg-muted/30 rounded-xl p-5 flex flex-col justify-between h-full min-h-[280px] border border-border/50 text-left">
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Physical Segment Isolation</span>
            <h4 className="text-xs font-bold text-foreground">Reference Frame: Cut Face Action</h4>
            <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground mt-1 leading-normal">
              Internal shear force direction is defined relative to the side of the cut we choose to inspect. Use next/prev stepping to view:
            </SlideParagraph>
          </div>
          <div className="my-4 flex justify-center">
            <ShearConventionDrawing activeStep={activeStep} activeSegment={activeSide} onSegmentClick={toggleSide} />
          </div>
          <div className="p-3 bg-indigo-500/[0.03] border border-indigo-500/20 rounded-xl text-[10px] text-indigo-600 dark:text-indigo-400 leading-normal">
            <strong>Rule of Thumb:</strong> If the shearing action rotates the segment in a **clockwise** direction, it is positive.
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full gap-4 text-left select-text">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Compass className="h-4.5 w-4.5 text-indigo-500" />
              <span>Shear Sign Criteria</span>
            </h4>
            <div className="space-y-2">
              <ClickReveal at={1} preset="none">
                <div className={`p-3 rounded-xl border transition-all ${activeSide === 'left' ? 'bg-indigo-50/40 border-indigo-200 dark:bg-indigo-950/10' : 'opacity-55 bg-slate-50 dark:bg-slate-900/40'}`}>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block mb-0.5">Left-Hand Segment</span>
                  <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-normal">
                    A shear force pointing <strong>downward</strong> on the right-hand cut face of a left segment is positive (+ve).
                  </SlideParagraph>
                </div>
              </ClickReveal>
              <ClickReveal at={2} preset="none">
                <div className={`p-3 rounded-xl border transition-all ${activeSide === 'right' ? 'bg-indigo-50/40 border-indigo-200 dark:bg-indigo-950/10' : 'opacity-55 bg-slate-50 dark:bg-slate-900/40'}`}>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block mb-0.5">Right-Hand Segment</span>
                  <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-normal">
                    A shear force pointing <strong>upward</strong> on the left-hand cut face of a right segment is positive (+ve).
                  </SlideParagraph>
                </div>
              </ClickReveal>
            </div>
          </div>
          <div className="p-3 bg-indigo-500/[0.03] border border-indigo-500/20 rounded-xl text-[10px] text-indigo-600 dark:text-indigo-400 leading-normal">
            <strong>Rule of Thumb:</strong> If the shearing action rotates the segment in a **clockwise** direction, it is positive.
          </div>
        </div>
      }
    />
  );
};
