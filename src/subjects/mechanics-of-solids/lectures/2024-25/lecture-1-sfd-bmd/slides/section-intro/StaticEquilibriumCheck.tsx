import React from 'react';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import {
  LatexFormula,
  ClickHighlight,
  ClickSyncedTabs,
  type ClickSyncedTabItem
} from '@/features/presentation/components/elements';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { StaticEquilibriumDrawing } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

export const StaticEquilibriumCheck: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  const beam: IBeam = {
    length: 8,
    supports: [
      { id: 'A', type: 'hinge', position: 0 },
      { id: 'B', type: 'roller', position: 8 }
    ],
    releases: [],
    loads: [
      { id: 'load-1', type: 'point', position: 4, magnitude: 20 }
    ]
  };

  const solver = new SFDBmdService();
  const solvedBeam = solver.solve(beam);
  const reactionA = solvedBeam.reactions.find(r => r.supportId === 'A' && r.type === 'R_y')?.value ?? 0;
  const reactionB = solvedBeam.reactions.find(r => r.supportId === 'B' && r.type === 'R_y')?.value ?? 0;

  const items: ClickSyncedTabItem[] = [
    {
      title: '1. Isolate the Free Body',
      badge: 'FBD',
      badgeColor: 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10',
      tintClass: 'border-l-[3px] border-l-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/[0.08]',
      description: (
        <span>
          Replace physical pin/roller supports at endpoints with vertical reaction forces{' '}
          <ClickHighlight variant="paint" at={1}>
            <LatexFormula math="R_A" /> and <LatexFormula math="R_B" />
          </ClickHighlight>.
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left select-text">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Beam Reaction Workspace</span>
          <div className="flex-1 flex items-center justify-center">
            <StaticEquilibriumDrawing
              length={beam.length}
              loadMagnitude={beam.loads[0]?.magnitude ?? 20}
              showReactions={(currentClick ?? 0) >= 1}
              resolvedReactions={false}
            />
          </div>
          <div className="bg-slate-100 dark:bg-slate-950/40 p-2.5 rounded-lg border border-border/50 text-[10px] text-muted-foreground flex justify-between mt-2 font-mono">
            <span>Symmetric Beam (DOI = 0)</span>
            <span className="text-indigo-500 dark:text-indigo-400">Length = 8.0m</span>
          </div>
        </div>
      )
    },
    {
      title: '2. Sum Vertical Forces',
      badge: 'ΣFy = 0',
      badgeColor: 'border-amber-500/20 text-amber-500 bg-amber-500/5 dark:bg-amber-500/10',
      tintClass: 'border-l-[3px] border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/[0.08]',
      description: (
        <span>
          Verify vertical equilibrium constraint:
          <span className="block mt-1 select-none">
            <ClickHighlight variant="paint" at={2}>
              <LatexFormula math="\Sigma F_y = 0 \implies R_A + R_B - 20\text{ kN} = 0" />
            </ClickHighlight>
          </span>
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left select-text">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Beam Reaction Workspace</span>
          <div className="flex-1 flex items-center justify-center">
            <StaticEquilibriumDrawing
              length={beam.length}
              loadMagnitude={beam.loads[0]?.magnitude ?? 20}
              showReactions={true}
              resolvedReactions={false}
            />
          </div>
          <div className="bg-slate-100 dark:bg-slate-950/40 p-2.5 rounded-lg border border-border/50 text-[10px] text-muted-foreground flex justify-between mt-2 font-mono">
            <span>Symmetric Beam (DOI = 0)</span>
            <span className="text-indigo-500 dark:text-indigo-400">Length = 8.0m</span>
          </div>
        </div>
      )
    },
    {
      title: '3. Sum Rotational Moments',
      badge: 'ΣMA = 0',
      badgeColor: 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10',
      tintClass: 'border-l-[3px] border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/[0.08]',
      description: (
        <span>
          Moment balance at A resolves the unknown reactions:
          <span className="block mt-1 select-none">
            <ClickHighlight variant="paint" at={3}>
              <LatexFormula math="\Sigma M_A = 0 \implies R_B \times 8\text{m} - 20\text{ kN} \times 4\text{m} = 0" />
            </ClickHighlight>
          </span>
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left select-text">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Beam Reaction Workspace</span>
          <div className="flex-1 flex items-center justify-center">
            <StaticEquilibriumDrawing
              length={beam.length}
              loadMagnitude={beam.loads[0]?.magnitude ?? 20}
              showReactions={true}
              resolvedReactions={true}
              reactionAValue={reactionA}
              reactionBValue={reactionB}
            />
          </div>
          <div className="bg-emerald-500/10 dark:bg-emerald-950/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs p-2.5 rounded-lg text-[10px] text-center font-mono flex justify-between mt-2 animate-in fade-in zoom-in-95 duration-250">
            <span>Resolved Reactions:</span>
            <LatexFormula math={`R_A = R_B = ${reactionA}\\text{ kN}`} />
          </div>
        </div>
      )
    }
  ];

  return (
    <ClickSyncedTabs
      title="Prerequisite: Static Equilibrium"
      leftTitle="Static Verification Step List"
      items={items}
      leftWidth="45%"
      clickToTabMap={[0, 0, 1, 2]}
    />
  );
};
