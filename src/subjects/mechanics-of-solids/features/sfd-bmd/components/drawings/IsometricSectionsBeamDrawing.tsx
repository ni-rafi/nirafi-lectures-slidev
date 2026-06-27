import React from 'react';
import { IBeam, ISolverOutput } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { motion } from 'motion/react';
import { DimensionLine } from '@/features/presentation/components/elements';
import { ShearVectorArrow, MomentVectorArc } from './ActionVectors';

export interface IsometricSectionsBeamDrawingProps {
  beam: IBeam;
  solverResult: ISolverOutput;
  cutX: number | null;
  activeStep: number;
  opacitySide?: 'left' | 'right';
  showReactions?: boolean;
  pivotX?: number | null;
  highlightedSupportId?: string | null;
  highlightedLoadId?: string | null;
  dimTargets?: { x: number; label: string }[];
  // New props for progressive reveals
  cutVisible?: boolean;
  showShear?: boolean;
  showMoment?: boolean;
  showReactionValueA?: boolean;
  showReactionValueB?: boolean;
}

/**
 * Super-compact 3D Isometric Beam Drawing with dynamic spring morph animations.
 */
export const IsometricSectionsBeamDrawing: React.FC<IsometricSectionsBeamDrawingProps> = ({
  beam,
  solverResult,
  cutX,
  opacitySide = 'right',
  showReactions = true,
  pivotX = null,
  highlightedSupportId = null,
  highlightedLoadId = null,
  dimTargets = [],
  cutVisible = true,
  showShear = true,
  showMoment = true,
  showReactionValueA = true,
  showReactionValueB = true,
}) => {
  const isCut = cutX !== null;
  const length = beam.length;
  const svgW = 850;
  const svgH = 140;
  const paddingX = 80;
  const beamW = svgW - paddingX * 2;

  const toPixel = (x: number) => paddingX + (x / length) * beamW;
  const xCutPixel = isCut ? toPixel(cutX!) : 0;
  const yBeam = 70;
  const scaleH = 15;

  const drawCut = isCut && cutVisible;

  // Opacity helper matching active cut segment focus
  const getOpacity = (pos: number) => {
    if (!drawCut) return 1.0;
    if (opacitySide === 'right') {
      return pos > cutX! ? 0.2 : 1.0;
    } else {
      return pos < cutX! ? 0.2 : 1.0;
    }
  };

  // Map support ID to letters (A, B, C...)
  const sortedSupports = [...beam.supports].sort((a, b) => a.position - b.position);
  const supportIdToLetter = new Map<string, string>();
  sortedSupports.forEach((s, idx) => {
    supportIdToLetter.set(s.id, String.fromCharCode(65 + idx));
  });

  return (
    <div className="w-full flex justify-center select-none animate-in fade-in duration-300">
      <svg className="w-full max-w-[850px] h-[140px] overflow-visible" viewBox={`0 0 ${svgW} ${svgH}`}>
        <defs>
          <pattern id="grid-pattern-isometric" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-slate-200/40 dark:stroke-slate-800/40" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width={svgW} height={svgH} fill="url(#grid-pattern-isometric)" className="opacity-60" />

        {/* 1. DRAW SUPPORTS IN 3D */}
        {beam.supports.map(s => {
          const px = toPixel(s.position);
          const isHighlighted = highlightedSupportId === s.id;
          const opacity = getOpacity(s.position);
          const letter = supportIdToLetter.get(s.id) || '';

          if ((s.type as string) === 'free') return null;

          return (
            <g key={s.id} opacity={opacity} className="transition-all duration-300">
              {s.type === 'roller' ? (
                /* 3D Roller Support */
                <g>
                  <polygon points={`${px + 15},${yBeam - 15} ${px + 7},${yBeam + 2} ${px + 23},${yBeam + 2}`} className="fill-slate-400 dark:fill-slate-600 stroke-slate-500" strokeWidth="1" />
                  <polygon points={`${px},${yBeam} ${px + 15},${yBeam - 15} ${px + 7},${yBeam + 2} ${px - 8},${yBeam + 17}`} className="fill-slate-250 dark:fill-slate-555 stroke-slate-400" strokeWidth="1" />
                  <polygon points={`${px},${yBeam} ${px + 15},${yBeam - 15} ${px + 23},${yBeam + 2} ${px + 8},${yBeam + 17}`} className="fill-slate-350 dark:fill-slate-500 stroke-slate-400" strokeWidth="1" />
                  {/* Front Triangle Connector - drawn last to stay on top */}
                  <polygon points={`${px},${yBeam} ${px - 8},${yBeam + 17} ${px + 8},${yBeam + 17}`} className="fill-slate-300 dark:fill-slate-500 stroke-slate-500" strokeWidth="1" />
                  {/* Rollers (2 circles) */}
                  <circle cx={px - 5} cy={yBeam + 22} r={3} className="fill-slate-400 dark:fill-slate-600 stroke-slate-500" strokeWidth="1" />
                  <circle cx={px + 5} cy={yBeam + 22} r={3} className="fill-slate-400 dark:fill-slate-600 stroke-slate-500" strokeWidth="1" />
                  {/* Ground base */}
                  <line x1={px - 18} y1={yBeam + 25} x2={px + 10} y2={yBeam + 25} className="stroke-slate-500" strokeWidth="1.5" />
                  <line x1={px - 8} y1={yBeam + 15} x2={px + 20} y2={yBeam + 15} className="stroke-slate-400" strokeWidth="1" />
                </g>
              ) : (
                /* 3D Pin Hinge Support */
                <g>
                  <polygon points={`${px + 15},${yBeam - 15} ${px + 7},${yBeam + 5} ${px + 23},${yBeam + 5}`} className="fill-slate-400 dark:fill-slate-600 stroke-slate-500" strokeWidth="1" />
                  <polygon points={`${px - 8},${yBeam + 20} ${px + 8},${yBeam + 20} ${px + 23},${yBeam + 5} ${px + 7},${yBeam + 5}`} className="fill-slate-300 dark:fill-slate-500 stroke-slate-400" strokeWidth="1" />
                  <polygon points={`${px},${yBeam} ${px + 15},${yBeam - 15} ${px + 7},${yBeam + 5} ${px - 8},${yBeam + 20}`} className="fill-slate-200/90 dark:fill-slate-555 stroke-slate-400" strokeWidth="1" />
                  <polygon points={`${px},${yBeam} ${px + 15},${yBeam - 15} ${px + 23},${yBeam + 5} ${px + 8},${yBeam + 20}`} className="fill-slate-300 dark:fill-slate-500 stroke-slate-400" strokeWidth="1" />
                  {/* Front Hinge Connector - drawn last to stay on top */}
                  <polygon points={`${px},${yBeam} ${px - 8},${yBeam + 20} ${px + 8},${yBeam + 20}`} className="fill-slate-300 dark:fill-slate-500 stroke-slate-500" strokeWidth="1" />
                  <line x1={px - 20} y1={yBeam + 20} x2={px + 12} y2={yBeam + 20} className="stroke-slate-500" strokeWidth="1.5" />
                </g>
              )}

              {/* Support joint pin */}
              <circle cx={px} cy={yBeam} r={2.5} className={isHighlighted ? 'fill-primary' : 'fill-muted-foreground'} />

              {/* Support Letter label */}
              <text x={px - 15} y={yBeam + 32} className={`text-[12px] font-black ${isHighlighted ? 'fill-primary' : 'fill-muted-foreground'}`}>
                {letter}
              </text>
            </g>
          );
        })}

        {/* 2. DRAW BEAM MEMBER IN 3D */}
        {!drawCut ? (
          /* Continuous Uncut 3D Beam */
          <g key="uncut-beam">
            <path d={`M ${toPixel(0)},${yBeam - scaleH} L ${toPixel(0) + 15},${yBeam - scaleH - 15} V ${yBeam - 15} L ${toPixel(0)},${yBeam} Z`} className="fill-slate-250 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.2" />
            <path d={`M ${toPixel(0)},${yBeam - scaleH} L ${toPixel(length)},${yBeam - scaleH} L ${toPixel(length) + 15},${yBeam - scaleH - 15} L ${toPixel(0) + 15},${yBeam - scaleH - 15} Z`} className="fill-slate-200 dark:fill-slate-700/95 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.2" />
            <path d={`M ${toPixel(0)},${yBeam - scaleH} L ${toPixel(length)},${yBeam - scaleH} V ${yBeam} L ${toPixel(0)},${yBeam} Z`} className="fill-slate-200/90 dark:fill-slate-700/80 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.8" />
            <path d={`M ${toPixel(length)},${yBeam - scaleH} L ${toPixel(length) + 15},${yBeam - scaleH - 15} V ${yBeam - 15} L ${toPixel(length)},${yBeam} Z`} className="fill-slate-250 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.2" />
          </g>
        ) : (
          /* Segmented/Cut 3D Beam (Morphs smoothly on xCutPixel transitions) */
          <g key="cut-beam">
            {/* Left Segment */}
            <g opacity={getOpacity(cutX! - 0.5)}>
              <path d={`M ${toPixel(0)},${yBeam - scaleH} L ${toPixel(0) + 15},${yBeam - scaleH - 15} V ${yBeam - 15} L ${toPixel(0)},${yBeam} Z`} className="fill-slate-250 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.2" />
              <motion.path
                d={`M ${toPixel(0)},${yBeam - scaleH} L ${xCutPixel - 10},${yBeam - scaleH} L ${xCutPixel + 5},${yBeam - scaleH - 15} L ${toPixel(0) + 15},${yBeam - scaleH - 15} Z`}
                animate={{ d: `M ${toPixel(0)},${yBeam - scaleH} L ${xCutPixel - 10},${yBeam - scaleH} L ${xCutPixel + 5},${yBeam - scaleH - 15} L ${toPixel(0) + 15},${yBeam - scaleH - 15} Z` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="fill-slate-200 dark:fill-slate-700/95 stroke-slate-400 dark:stroke-slate-600"
                strokeWidth="1.2"
              />
              <motion.path
                d={`M ${toPixel(0)},${yBeam - scaleH} L ${xCutPixel - 10},${yBeam - scaleH} V ${yBeam} L ${toPixel(0)},${yBeam} Z`}
                animate={{ d: `M ${toPixel(0)},${yBeam - scaleH} L ${xCutPixel - 10},${yBeam - scaleH} V ${yBeam} L ${toPixel(0)},${yBeam} Z` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="fill-slate-200/90 dark:fill-slate-700/80 stroke-slate-400 dark:stroke-slate-600"
                strokeWidth="1.8"
              />
              {/* Exposed cut surface */}
              <motion.path
                d={`M ${xCutPixel - 10},${yBeam - scaleH} L ${xCutPixel + 5},${yBeam - scaleH - 15} V ${yBeam - 15} L ${xCutPixel - 10},${yBeam} Z`}
                animate={{ d: `M ${xCutPixel - 10},${yBeam - scaleH} L ${xCutPixel + 5},${yBeam - scaleH - 15} V ${yBeam - 15} L ${xCutPixel - 10},${yBeam} Z` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="fill-indigo-100 dark:fill-indigo-950/40 stroke-indigo-500 stroke-2"
              />
            </g>

            {/* Right Segment */}
            <g opacity={getOpacity(cutX! + 0.5)}>
              {/* Exposed cut surface */}
              <motion.path
                d={`M ${xCutPixel + 10},${yBeam - scaleH} L ${xCutPixel + 25},${yBeam - scaleH - 15} V ${yBeam - 15} L ${xCutPixel + 10},${yBeam} Z`}
                animate={{ d: `M ${xCutPixel + 10},${yBeam - scaleH} L ${xCutPixel + 25},${yBeam - scaleH - 15} V ${yBeam - 15} L ${xCutPixel + 10},${yBeam} Z` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="fill-indigo-100 dark:fill-indigo-950/40 stroke-indigo-400/80 stroke-[1.5]"
              />
              <motion.path
                d={`M ${xCutPixel + 10},${yBeam - scaleH} L ${toPixel(length)},${yBeam - scaleH} L ${toPixel(length) + 15},${yBeam - scaleH - 15} L ${xCutPixel + 25},${yBeam - scaleH - 15} Z`}
                animate={{ d: `M ${xCutPixel + 10},${yBeam - scaleH} L ${toPixel(length)},${yBeam - scaleH} L ${toPixel(length) + 15},${yBeam - scaleH - 15} L ${xCutPixel + 25},${yBeam - scaleH - 15} Z` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="fill-slate-200 dark:fill-slate-700/95 stroke-slate-400 dark:stroke-slate-600"
                strokeWidth="1.2"
              />
              <motion.path
                d={`M ${xCutPixel + 10},${yBeam - scaleH} L ${toPixel(length)},${yBeam - scaleH} V ${yBeam} L ${xCutPixel + 10},${yBeam} Z`}
                animate={{ d: `M ${xCutPixel + 10},${yBeam - scaleH} L ${toPixel(length)},${yBeam - scaleH} V ${yBeam} L ${xCutPixel + 10},${yBeam} Z` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="fill-slate-200/90 dark:fill-slate-700/80 stroke-slate-400 dark:stroke-slate-600"
                strokeWidth="1.8"
              />
              <path d={`M ${toPixel(length)},${yBeam - scaleH} L ${toPixel(length) + 15},${yBeam - scaleH - 15} V ${yBeam - 15} L ${toPixel(length)},${yBeam} Z`} className="fill-slate-250 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.2" />
            </g>
          </g>
        )}

        {/* 3. DRAW APPLIED POINT LOADS IN 3D */}
        {beam.loads.map(load => {
          if (load.type !== 'point' || load.position === undefined) return null;
          const lx = toPixel(load.position);
          const opacity = getOpacity(load.position);
          const isHighlighted = highlightedLoadId === load.id;

          return (
            <g key={load.id} opacity={opacity} className="transition-all duration-300">
              <path d={`M ${lx},10 V ${yBeam - scaleH - 5} M ${lx - 4},${yBeam - scaleH - 12} L ${lx},${yBeam - scaleH - 5} L ${lx + 4},${yBeam - scaleH - 12}`} fill="none" stroke={isHighlighted ? "#ef4444" : "#f43f5e"} strokeWidth={isHighlighted ? 3.5 : 2.5} strokeLinecap="round" strokeLinejoin="round" />
              <text x={lx + 10} y={24} className={`text-[11px] font-black ${isHighlighted ? 'fill-red-500' : 'fill-rose-500'}`}>
                {load.magnitude} kN
              </text>
            </g>
          );
        })}

        {/* 4. SUPPORT REACTIONS IN 3D */}
        {showReactions && solverResult.success &&
          beam.supports.map(s => {
            const rxVal = solverResult.reactions.find(r => r.supportId === s.id && r.type === 'R_y')?.value;
            if (rxVal === undefined || rxVal === 0) return null;

            const px = toPixel(s.position);
            const opacity = getOpacity(s.position);
            const letter = supportIdToLetter.get(s.id) || '';
            const showValue = s.id === 'A' ? showReactionValueA : showReactionValueB;

            return (
              <g key={`reaction-${s.id}`} opacity={opacity} className="transition-all duration-300">
                <path d={`M ${px},115 L ${px},${yBeam + 8} M ${px - 4},${yBeam + 15} L ${px},${yBeam + 8} L ${px + 4},${yBeam + 15}`} fill="none" className="stroke-emerald-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {showValue && (
                  <text x={px + 12} y={108} className="text-[10px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400">
                    R<sub>{letter.toLowerCase()}y</sub> = {rxVal.toFixed(1)} kN
                  </text>
                )}
              </g>
            );
          })
        }

        {/* 5. MOMENT PIVOT MARKER */}
        {pivotX !== null && (
          <g className="animate-in fade-in duration-300">
            <circle cx={toPixel(pivotX!)} cy={yBeam} r={7} fill="none" className="stroke-amber-500 stroke-2" strokeDasharray="3 2" />
            <circle cx={toPixel(pivotX!)} cy={yBeam} r={2} className="fill-amber-500" />
            <text x={toPixel(pivotX!) - 20} y={yBeam - 12} className="text-[9.5px] font-black fill-amber-500">
              PIVOT
            </text>
          </g>
        )}

        {/* 6. INTERNAL ACTIONS ON CUT FACE (Slides dynamically with cut face) */}
        {drawCut && (
          <>
            {/* Shear Force V vector */}
            {showShear && (
              <motion.g
                key="shear-cut-arrow"
                initial={{ opacity: 0, y: -20, x: xCutPixel }}
                animate={{ opacity: 1, y: 0, x: xCutPixel }}
                exit={{ opacity: 0, y: -20, x: xCutPixel }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              >
                <ShearVectorArrow
                  x={-2.5}
                  y={55}
                  direction={opacitySide === 'left' ? "up" : "down"}
                  height={30}
                  strokeWidth={2}
                  color="#e11d48"
                />
                <text x={opacitySide === 'left' ? -35 : 10} y={72} className="text-[10px] font-mono font-black fill-rose-500">
                  V(x)
                </text>
              </motion.g>
            )}

            {/* Bending Moment M vector */}
            {showMoment && (
              <motion.g
                key="moment-cut-arc"
                initial={{ opacity: 0, scale: 0.5, rotate: 45, x: xCutPixel }}
                animate={{ opacity: 1, scale: 1, rotate: 0, x: xCutPixel }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45, x: xCutPixel }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                style={{ transformOrigin: "0px 70px" }}
              >
                <MomentVectorArc
                  x={-2.5}
                  y={55}
                  direction={opacitySide === 'left' ? "cw" : "ccw"}
                  side={opacitySide === 'left' ? "left" : "right"}
                  arrowTip="top"
                  radius={12}
                  strokeWidth={2}
                  color="#4f46e5"
                />
                <text x={opacitySide === 'left' ? 10 : -42} y={84} className="text-[10px] font-mono font-black fill-indigo-500 text-right">
                  M(x)
                </text>
              </motion.g>
            )}
          </>
        )}

        {/* 7. DIMENSION MARKS & LABELS */}
        {drawCut && showShear && (
          <DimensionLine
            key="x-dimension-line"
            x1={toPixel(0)}
            y1={120}
            x2={xCutPixel - 10}
            y2={120}
            label="x"
            color="#6366f1"
          />
        )}

        {/* Stacked dimension lines for load moment arms relative to pivot/cut */}
        {((!isCut && dimTargets.length > 0) || (drawCut && showMoment && dimTargets.length > 0)) && (
          <g key="moment-arm-dimensions">
            {dimTargets.map((dt, idx) => {
              const targetPx = isCut ? xCutPixel - 10 : (pivotX !== null ? toPixel(pivotX) : toPixel(0));
              const yDim = yBeam - 45 - idx * 12;

              // Avoid centering dimension labels directly on top of point loads
              const startXVal = isCut ? cutX! : (pivotX !== null ? pivotX : 0);
              const endXVal = dt.x;
              const centerVal = (startXVal + endXVal) / 2;

              // Check if centerVal is close to any point load position
              const hasOverlap = beam.loads.some(l =>
                l.type === 'point' &&
                l.position !== undefined &&
                Math.abs(l.position - centerVal) < 0.2
              );

              // Position offset shift to 35% instead of 50% if there is an overlap
              const labelPositionRatio = hasOverlap ? 0.35 : 0.5;

              return (
                <DimensionLine
                  key={`dim-target-${idx}`}
                  x1={toPixel(dt.x)}
                  y1={yDim}
                  x2={targetPx}
                  y2={yDim}
                  label={dt.label}
                  color="#d97706"
                  labelPositionRatio={labelPositionRatio}
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};
