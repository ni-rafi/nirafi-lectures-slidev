import React from 'react';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { ClickSyncedTabs, type ClickSyncedTabItem } from '@/features/presentation/components/elements';
import { BeamLoadingSandboxDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

export const BeamLoadingSandbox: React.FC = () => {
  const solver = new SFDBmdService();
  const getSolvedReactions = (showPoint: boolean, showUdl: boolean) => {
    const supports = [
      { id: 'A', type: 'hinge' as const, position: 0 },
      { id: 'B', type: 'roller' as const, position: 8 }
    ];
    const loads = [];
    if (showPoint) {
      loads.push({ id: 'P', type: 'point' as const, position: 8 / 3, magnitude: 20 });
    }
    if (showUdl) {
      loads.push({ id: 'w', type: 'udl' as const, startPosition: 0, endPosition: 8, magnitude: 5 });
    }
    const beam: IBeam = { length: 8, supports, releases: [], loads };
    const solved = solver.solve(beam);
    const rxnA = solved.reactions.find(r => r.supportId === 'A' && r.type === 'R_y')?.value;
    const rxnB = solved.reactions.find(r => r.supportId === 'B' && r.type === 'R_y')?.value;
    return {
      rxnA: rxnA !== undefined && rxnA !== 0 ? `${rxnA.toFixed(1)} kN` : undefined,
      rxnB: rxnB !== undefined && rxnB !== 0 ? `${rxnB.toFixed(1)} kN` : undefined,
    };
  };

  const sc0 = getSolvedReactions(false, false);
  const sc1 = getSolvedReactions(true, false);
  const sc2 = getSolvedReactions(true, true);

  const items: ClickSyncedTabItem[] = [
    {
      title: 'Unloaded Beam',
      badge: 'Unloaded',
      badgeColor: 'border-border/60 text-muted-foreground bg-muted/10',
      description: (
        <span>
          Inspect the baseline simply supported beam without external loads.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left select-text">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Preview Loaded State</span>
          <div className="flex-1 flex items-center justify-center">
            <BeamLoadingSandboxDrawing
              showPointLoad={false}
              showUdl={false}
              reactionA={sc0.rxnA}
              reactionB={sc0.rxnB}
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2 rounded text-[10px] text-muted-foreground text-center font-mono mt-2">
            Active Loading: None (Unloaded)
          </div>
        </div>
      )
    },
    {
      title: 'Concentrated Point Load',
      badge: 'P = 20 kN',
      badgeColor: 'border-amber-500/20 text-amber-500 bg-amber-500/5 dark:bg-amber-500/10',
      description: (
        <span>
          Renders high-intensity vertical force at a single coordinate.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left select-text">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Preview Loaded State</span>
          <div className="flex-1 flex items-center justify-center">
            <BeamLoadingSandboxDrawing
              showPointLoad={true}
              showUdl={false}
              reactionA={sc1.rxnA}
              reactionB={sc1.rxnB}
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2 rounded text-[10px] text-muted-foreground text-center font-mono mt-2">
            Active Loading: Point Load (P)
          </div>
        </div>
      )
    },
    {
      title: 'Point Load + UDL',
      badge: 'P + w',
      badgeColor: 'border-rose-500/20 text-rose-500 bg-rose-500/5 dark:bg-rose-500/10',
      description: (
        <span>
          Renders standard pressure load distributed evenly along the span.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left select-text">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Preview Loaded State</span>
          <div className="flex-1 flex items-center justify-center">
            <BeamLoadingSandboxDrawing
              showPointLoad={true}
              showUdl={true}
              reactionA={sc2.rxnA}
              reactionB={sc2.rxnB}
            />
          </div>
          <div className="bg-muted dark:bg-muted/40 p-2 rounded text-[10px] text-muted-foreground text-center font-mono mt-2">
            Active Loading: Point Load (P) + UDL (w)
          </div>
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Beam Loading Sandbox"
      leftTitle="Load Configuration Panel"
      items={items}
      leftWidth="45%"
    />
  );
};
