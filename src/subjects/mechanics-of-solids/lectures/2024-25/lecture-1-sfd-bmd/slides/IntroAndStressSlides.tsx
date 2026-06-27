import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { LectureCover } from '@/shared/layouts/LectureCover';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { HighlightableList } from '@/features/outline/components/HighlightableList';
import { ReferenceBooksList } from '@/features/outline/components/ReferenceBooksList';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import {
  InteractiveCard,
  LatexFormula,
  SlideBullet,
  ClickSyncedTabs,
  ClickHighlight,
  SlideParagraph,
  ClickReveal,
  type ClickSyncedTabItem
} from '@/features/presentation/components/elements';
import { BookOpen, Layers, Bookmark, Info } from 'lucide-react';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import {
  StaticEquilibriumDrawing,
  SectionIsolationDrawing,
  BeamBendingDrawing,
  CantileverBendingDrawing,
  BeamShearDrawing,
  CantileverShearDrawing
} from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/drawings';

/**
 * Slide 1: Cover Slide
 */
export const Slide1: React.FC<SlideProps> = (props) => (
  <LectureCover {...props} />
);

/**
 * Slide 2: Course Outcomes & Reference Materials
 */
export const Slide2: React.FC = () => {
  const outcomes = [
    { id: 4, description: 'Determine the shear force and bending moment for determinate beams.' },
    { id: 5, description: 'Determine the shear stress and bending stress of determinate beams of different shapes.' }
  ];

  const references = [
    {
      id: 1,
      title: 'Strength of Materials',
      author: 'Ferdinand L. Singer & Andrew Pytel',
      edition: '4th Edition',
      publisher: 'Harper & Row / UBS Publishers',
    },
    {
      id: 2,
      title: 'Mechanics of Materials',
      author: 'R.C. Hibbeler',
      edition: '10th Edition',
      publisher: 'Pearson',
    }
  ];

  return (
    <TwoColumnLayout
      title="Course Objectives & References"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col h-full justify-between gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-indigo-500 font-bold text-xs uppercase mb-1">
              <Layers className="h-4.5 w-4.5" />
              <span>Learning Roadmap</span>
            </div>
            <SlideParagraph variant="plain" className="text-xs text-muted-foreground">Active sessional targets for this session.</SlideParagraph>
          </div>
          <div className="flex-1">
            <HighlightableList
              items={outcomes}
              highlightedIds={[4, 5]}
              listTitle="Expected Capabilities:"
              highlightLabel="Session Focus"
            />
          </div>
          <div className="bg-slate-50 dark:bg-muted/10 p-2.5 rounded-xl border border-border/60 text-[10px] text-muted-foreground flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>Syllabus CEE 0732 2131 Section 5 and 6 details.</span>
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col h-full justify-between gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-slate-500 font-bold text-xs uppercase mb-1">
              <BookOpen className="h-4.5 w-4.5" />
              <span>Recommended Books</span>
            </div>
            <SlideParagraph variant="plain" className="text-xs text-muted-foreground">Prescribed readings & reference homework bases.</SlideParagraph>
          </div>
          <div className="flex-1 bg-slate-50/50 dark:bg-muted/5 p-4 rounded-xl border border-border/50">
            <ReferenceBooksList references={references} />
          </div>
        </div>
      }
    />
  );
};

/**
 * Slide 3: Prerequisite Check: Basics of Statics
 */
export const Slide3: React.FC = () => {
  const { currentClick } = useClickStepsContext();

  // Solve the beam reactions dynamically using SFDBmdService
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
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Beam Reaction Workspace</span>
          <div className="flex-1 flex items-center justify-center">
            <StaticEquilibriumDrawing
              length={beam.length}
              loadMagnitude={beam.loads[0]?.magnitude ?? 20}
              showReactions={currentClick >= 1}
              resolvedReactions={false}
            />
          </div>
          <div className="bg-slate-100 dark:bg-slate-950/40 p-2.5 rounded-lg border border-border/50 text-[10px] text-muted-foreground flex justify-between mt-2">
            <span>Symmetric Beam (DOI = 0)</span>
            <span className="font-mono text-indigo-500 dark:text-indigo-400">Length = 8.0m</span>
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
          <div className="mt-1 select-none">
            <ClickHighlight variant="paint" at={2}>
              <LatexFormula math="\Sigma F_y = 0 \implies R_A + R_B - 20\text{ kN} = 0" />
            </ClickHighlight>
          </div>
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Beam Reaction Workspace</span>
          <div className="flex-1 flex items-center justify-center">
            <StaticEquilibriumDrawing
              length={beam.length}
              loadMagnitude={beam.loads[0]?.magnitude ?? 20}
              showReactions={true}
              resolvedReactions={false}
            />
          </div>
          <div className="bg-slate-100 dark:bg-slate-950/40 p-2.5 rounded-lg border border-border/50 text-[10px] text-muted-foreground flex justify-between mt-2">
            <span>Symmetric Beam (DOI = 0)</span>
            <span className="font-mono text-indigo-500 dark:text-indigo-400">Length = 8.0m</span>
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
          <div className="mt-1 select-none">
            <ClickHighlight variant="paint" at={3}>
              <LatexFormula math="\Sigma M_A = 0 \implies R_B \times 8\text{m} - 20\text{ kN} \times 4\text{m} = 0" />
            </ClickHighlight>
          </div>
        </span>
      ),
      rightContent: (
        <div className="flex flex-col justify-between w-full h-full min-h-[220px] text-left">
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

/**
 * Slide 4: Section Divider - Internal Stress Signatures
 */
export const Slide4: React.FC<SlideProps> = (props) => (
  <TopicDividerLayout
    {...props}
    topicNumber="Topic 02"
    title="Internal Forces & Structural Intuition"
    subtitle="Emergence of internal action vectors and physical flexion bending behaviors"
  />
);

/**
 * Slide 5: Sectioning & Internal Actions Reveal
 */
export const Slide5: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  return (
    <FullWidthLayout
      title={<span>Sectioning & Internal Force Vectors</span>}
    >
      <div className="w-full flex flex-col h-full min-h-[400px] gap-2 pt-3 pb-0 px-4 text-left select-text">
        <div>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-0.5">Continuous Beam cut</span>
          <h2 className="text-lg font-bold text-foreground">Exposing Internal Action Vectors</h2>
          <SlideParagraph variant="plain" className="text-[11px] text-muted-foreground leading-normal">
            Take a virtual slice through the beam to expose the internal forces holding both sides in equilibrium.
          </SlideParagraph>
        </div>

        {/* 3D Beam Drawing and integrated texts */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-muted/5 border border-border/40 rounded-xl px-4 relative">
          <SectionIsolationDrawing activeStep={step} />
          
          {/* Register clicks implicitly in the presentation click-steps */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={3} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={4} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={5} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={6} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={7} preset="none"><div className="hidden" /></ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};

/**
 * Slide 6: The Anatomy of Internal Forces
 */
export const Slide6: React.FC = () => {
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

/**
 * Slide 7: Simply Supported Beam Flexion
 */
export const Slide7: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  return (
    <FullWidthLayout
      title={<span>Bending Mechanics - Simply Supported Flexion</span>}
    >
      <div className="w-full h-full flex flex-col justify-between gap-4 p-4 text-left select-text">
        {/* Top: Full-Width 3D Drawing with Absolute Floating Description */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-muted/5 border border-border/40 rounded-xl relative min-h-[220px]">
          {/* Floating Overview Card (Taller and narrower to prevent overlap) */}
          <div className="absolute top-4 left-4 w-[210px] h-[calc(100%-32px)] flex flex-col justify-center bg-background/95 dark:bg-slate-900/95 border border-border/50 p-4 rounded-lg shadow-sm z-20">
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mb-0.5">Structural Flexion</span>
            <h4 className="text-xs font-bold text-foreground mb-1">Simply Supported Flexion</h4>
            <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-relaxed mt-1">
              When loaded from above, the beam bends downwards (sagging), deforming fibers into a concave shape and creating distinct stress zones.
            </SlideParagraph>
          </div>

          <BeamBendingDrawing activeStep={step} />
          
          {/* Register clicks implicitly in the presentation click-steps */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
        </div>

        {/* Bottom Section: Three-Column Step-by-Step System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1 items-stretch">
          <ClickReveal at={1}>
            <div className="bg-red-500/[0.015] border border-red-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-red-500 font-bold font-mono">1</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Top Fibers (Compression):</strong> Elements above the neutral axis undergo longitudinal shortening.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={1}>
            <div className="bg-emerald-500/[0.015] border border-emerald-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-emerald-500 font-bold font-mono">2</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Bottom Fibers (Tension):</strong> Elements below the neutral axis undergo longitudinal elongation.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-indigo-500/[0.015] border border-indigo-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-indigo-500 font-bold font-mono">3</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Neutral Axis:</strong> The central plane experiences zero normal stress and remains at its original length.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};

/**
 * Slide 8: Cantilever Bending Mechanics
 */
export const Slide8: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  return (
    <FullWidthLayout
      title={<span>Bending Mechanics - Cantilever Bending</span>}
    >
      <div className="w-full h-full flex flex-col justify-between gap-4 p-4 text-left select-text">
        {/* Top: Full-Width 3D Drawing with Absolute Floating Description */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-muted/5 border border-border/40 rounded-xl relative min-h-[220px]">
          {/* Floating Overview Card (Taller and narrower to prevent overlap) */}
          <div className="absolute top-4 left-4 w-[210px] h-[calc(100%-32px)] flex flex-col justify-center bg-background/95 dark:bg-slate-900/95 border border-border/50 p-4 rounded-lg shadow-sm z-20">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block mb-0.5">Cantilever Flexion</span>
            <h4 className="text-xs font-bold text-foreground mb-1">Fixed-End Deflection Profile</h4>
            <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-relaxed mt-1">
              A cantilever beam fixed at one end and loaded at the tip deflects into a convex curve (hogging), inverting all stress zones compared to simple spans.
            </SlideParagraph>
          </div>

          <CantileverBendingDrawing activeStep={step} />
          
          {/* Register clicks implicitly in the presentation click-steps */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
        </div>

        {/* Bottom Section: Three-Column Step-by-Step System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1 items-stretch">
          <ClickReveal at={1}>
            <div className="bg-emerald-500/[0.015] border border-emerald-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-emerald-500 font-bold font-mono">1</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Top Fibers (Tension):</strong> Undergo longitudinal elongation. Tension crack vulnerabilities form at the top surface.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={1}>
            <div className="bg-red-500/[0.015] border border-red-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-red-500 font-bold font-mono">2</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Bottom Fibers (Compression):</strong> Undergo longitudinal shortening.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-indigo-500/[0.015] border border-indigo-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-indigo-500 font-bold font-mono">3</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Fixed Wall Reactions:</strong> Develops reaction force (<LatexFormula math="R_A = P" />) and resisting moment (<LatexFormula math="M_A = P \cdot L" />) to maintain equilibrium.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};

/**
 * Slide 9: Simply Supported Beam Shear Mechanics
 */
export const Slide9: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  return (
    <FullWidthLayout
      title={<span>Shear Mechanics - Simply Supported Shear</span>}
    >
      <div className="w-full h-full flex flex-col justify-between gap-4 p-4 text-left select-text">
        {/* Top: Full-Width 3D Drawing with Absolute Floating Description */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-muted/5 border border-border/40 rounded-xl relative min-h-[220px]">
          {/* Floating Overview Card */}
          <div className="absolute top-4 left-4 w-[210px] h-[calc(100%-32px)] flex flex-col justify-center bg-background/95 dark:bg-slate-900/95 border border-border/50 p-4 rounded-lg shadow-sm z-20">
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block mb-0.5">Shear Deformation</span>
            <h4 className="text-xs font-bold text-foreground mb-1">Simply Supported Shear</h4>
            <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-relaxed mt-1">
              Transverse loads create sliding forces along internal vertical plane interfaces, deforming fibers and creating shear stress distributions.
            </SlideParagraph>
          </div>

          <BeamShearDrawing activeStep={step} />
          
          {/* Register clicks implicitly in the presentation click-steps */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
        </div>

        {/* Bottom Section: Three-Column Step-by-Step System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1 items-stretch">
          <ClickReveal at={1}>
            <div className="bg-rose-500/[0.015] border border-rose-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-rose-500 font-bold font-mono">1</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Transverse Shear:</strong> Vertical loading pushes adjacent slices down, creating relative sliding actions.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-amber-500/[0.015] border border-amber-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-amber-500 font-bold font-mono">2</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Shear Strain (<LatexFormula math="\gamma" />):</strong> Angle change of element corners showing rectangular cells distorted to rhombuses.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-indigo-500/[0.015] border border-indigo-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-indigo-500 font-bold font-mono">3</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Internal Shear Force (<LatexFormula math="V_{int}" />):</strong> Upward and downward resisting vectors exposed on cut faces to prevent failure.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};

/**
 * Slide 10: Cantilever Beam Shear Mechanics
 */
export const Slide10: React.FC = () => {
  const { currentClick } = useClickStepsContext();
  const step = currentClick ?? 0;

  return (
    <FullWidthLayout
      title={<span>Shear Mechanics - Cantilever Shear</span>}
    >
      <div className="w-full h-full flex flex-col justify-between gap-4 p-4 text-left select-text">
        {/* Top: Full-Width 3D Drawing with Absolute Floating Description */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 dark:bg-muted/5 border border-border/40 rounded-xl relative min-h-[220px]">
          {/* Floating Overview Card */}
          <div className="absolute top-4 left-4 w-[210px] h-[calc(100%-32px)] flex flex-col justify-center bg-background/95 dark:bg-slate-900/95 border border-border/50 p-4 rounded-lg shadow-sm z-20">
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block mb-0.5">Cantilever Shear</span>
            <h4 className="text-xs font-bold text-foreground mb-1">Fixed-End Shear Profile</h4>
            <SlideParagraph variant="plain" className="text-[10px] text-muted-foreground leading-relaxed mt-1">
              A cantilever under tip load transfers the vertical load back to the wall through internal vertical shear stress planes.
            </SlideParagraph>
          </div>

          <CantileverShearDrawing activeStep={step} />
          
          {/* Register clicks implicitly in the presentation click-steps */}
          <ClickReveal at={1} preset="none"><div className="hidden" /></ClickReveal>
          <ClickReveal at={2} preset="none"><div className="hidden" /></ClickReveal>
        </div>

        {/* Bottom Section: Three-Column Step-by-Step System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1 items-stretch">
          <ClickReveal at={1}>
            <div className="bg-rose-500/[0.015] border border-rose-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-rose-500 font-bold font-mono">1</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Shear Slip:</strong> Free-end segment slides downwards relative to the fixed base segment under loading.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-amber-500/[0.015] border border-amber-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-amber-500 font-bold font-mono">2</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Shear Strain (<LatexFormula math="\gamma" />):</strong> Fiber skew angle resulting from transverse loading deformation.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
          <ClickReveal at={2}>
            <div className="bg-indigo-500/[0.015] border border-indigo-500/10 p-3.5 rounded-xl h-full flex flex-col justify-start">
              <SlideBullet icon={<span className="text-indigo-500 font-bold font-mono">3</span>}>
                <span className="text-[10.5px] text-foreground leading-relaxed block">
                  <strong>Fixed Wall Reactions:</strong> Develops reaction force (<LatexFormula math="R_A = P" />) and resisting moment (<LatexFormula math="M_A = P \cdot L" />) to maintain equilibrium.
                </span>
              </SlideBullet>
            </div>
          </ClickReveal>
        </div>
      </div>
    </FullWidthLayout>
  );
};
