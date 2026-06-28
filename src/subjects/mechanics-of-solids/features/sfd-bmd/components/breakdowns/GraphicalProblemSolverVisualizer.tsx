import React, { useContext } from 'react';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { LatexFormula, SlideParagraph, SlideBullet, ClickReveal } from '@/features/presentation/components/elements';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { motion } from 'motion/react';

export interface GraphicalProblemSolverVisualizerProps {
  beam: IBeam;
  stepIndex: number;
}

export const GraphicalProblemSolverVisualizer: React.FC<GraphicalProblemSolverVisualizerProps> = ({
  beam,
  stepIndex,
}) => {
  const solver = React.useMemo(() => new SFDBmdService(), []);
  const solverResult = React.useMemo(() => solver.solve(beam), [solver, beam]);
  const presentation = useContext(PresentationContext);
  const clickContext = useClickStepsContext();
  
  const viewMode = presentation?.viewMode || 'present';
  const isScrollOrBlog = viewMode === 'scroll' || viewMode === 'blog';
  const currentClick = clickContext?.currentClick ?? 0;
  const clickIdx = isScrollOrBlog ? 99 : currentClick;

  if (!solverResult.success) {
    return (
      <div className="p-4 text-red-500 border border-red-500/20 bg-red-500/5 rounded-xl text-xs font-mono">
        Solver failed to compute reactions. Please verify your beam loading configurations.
      </div>
    );
  }

  const rxnA = 14.325;

  // X coordinate mapping (Length = 20m, fits 50 to 450)
  const getSvgX = (x: number) => 50 + x * 20;

  // Parabolic moment calculator helper
  const getParabolaPoints = (xStart: number, xEnd: number, bmdBaseline: number, bmdScale: number) => {
    let points = '';
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const xVal = xStart + (xEnd - xStart) * (i / steps);
      const u = xVal - 5;
      const m = 71.625 + 14.325 * u - 1.5 * u * u;
      const svgX = getSvgX(xVal);
      const svgY = bmdBaseline - m * bmdScale;
      points += `${svgX},${svgY} `;
    }
    return points;
  };

  // Stack component: Dynamically decides layout pairings
  const renderStackedDiagrams = (pairing: 'beam' | 'beam-sfd' | 'sfd-bmd' | 'all') => {
    const svgWidth = 480;
    const svgHeight = pairing === 'all' ? 245 : 185;

    // Baselines setup
    const beamY = pairing === 'all' ? 38 : 42;
    const sfdY = pairing === 'all' ? 112 : pairing === 'sfd-bmd' ? 52 : 138;
    const bmdY = pairing === 'all' ? 202 : 142;

    // Scales setup
    const sfdScale = pairing === 'all' ? 1.15 : pairing === 'sfd-bmd' ? 1.45 : 1.9;
    const bmdScale = pairing === 'all' ? 0.42 : 0.45;

    const showBeam = pairing === 'beam' || pairing === 'beam-sfd' || pairing === 'all';
    const showSfd = pairing === 'beam-sfd' || pairing === 'sfd-bmd' || pairing === 'all';
    const showBmd = pairing === 'sfd-bmd' || pairing === 'all';

    // Highlight area definitions
    let shadeSource: React.ReactNode = null;
    if (showBeam && pairing === 'beam-sfd') {
      if (stepIndex === 4 && clickIdx >= 0) {
        // A to C: Unloaded area (x = 0 to 5)
        shadeSource = (
          <g>
            <rect
              x={getSvgX(0)}
              y={beamY - 15}
              width={getSvgX(5) - getSvgX(0)}
              height={15}
              className="fill-emerald-500/15 stroke-emerald-500/20 animate-in fade-in duration-300"
              strokeWidth="0.5"
            />
            {clickIdx >= 1 && (
              <text x={getSvgX(2.5)} y={beamY - 18} textAnchor="middle" className="text-[7px] font-black fill-emerald-600 dark:fill-emerald-400 font-mono animate-in fade-in">w = 0, L = 5m</text>
            )}
          </g>
        );
      } else if (stepIndex === 6 && clickIdx >= 0) {
        // C to D: UDL area (x = 5 to 12)
        shadeSource = (
          <g>
            <rect
              x={getSvgX(5)}
              y={beamY - 26}
              width={getSvgX(12) - getSvgX(5)}
              height={26}
              className="fill-emerald-500/25 stroke-emerald-500/20 animate-in fade-in duration-300"
              strokeWidth="0.5"
            />
            {clickIdx >= 1 && (
              <text x={getSvgX(8.5)} y={beamY - 14} textAnchor="middle" className="text-[7.5px] font-black fill-emerald-600 dark:fill-emerald-400 font-mono animate-in fade-in">w = 3 kN/m, L = 7m</text>
            )}
          </g>
        );
      } else if (stepIndex === 8 && clickIdx >= 0) {
        // D to E: Unloaded area (x = 12 to 17)
        shadeSource = (
          <g>
            <rect
              x={getSvgX(12)}
              y={beamY - 15}
              width={getSvgX(17) - getSvgX(12)}
              height={15}
              className="fill-emerald-500/15 stroke-emerald-500/20 animate-in fade-in duration-300"
              strokeWidth="0.5"
            />
            {clickIdx >= 1 && (
              <text x={getSvgX(14.5)} y={beamY - 18} textAnchor="middle" className="text-[7px] font-black fill-emerald-600 dark:fill-emerald-400 font-mono animate-in fade-in">w = 0, L = 5m</text>
            )}
          </g>
        );
      } else if (stepIndex === 10 && clickIdx >= 0) {
        // E to B: Unloaded area (x = 17 to 20)
        shadeSource = (
          <g>
            <rect
              x={getSvgX(17)}
              y={beamY - 15}
              width={getSvgX(20) - getSvgX(17)}
              height={15}
              className="fill-emerald-500/15 stroke-emerald-500/20 animate-in fade-in duration-300"
              strokeWidth="0.5"
            />
            {clickIdx >= 1 && (
              <text x={getSvgX(18.5)} y={beamY - 18} textAnchor="middle" className="text-[7px] font-black fill-emerald-600 dark:fill-emerald-400 font-mono animate-in fade-in">w = 0, L = 3m</text>
            )}
          </g>
        );
      } else if (stepIndex === 9 && clickIdx >= 0) {
        // E: Concentrated load marker
        shadeSource = (
          <circle
            cx={getSvgX(17)}
            cy={beamY}
            r="8"
            className="fill-rose-500/30 stroke-rose-500 animate-pulse"
            strokeWidth="1"
          />
        );
      }
    } else if (showSfd && pairing === 'sfd-bmd') {
      if (stepIndex === 15 && clickIdx >= 0) {
        // A to C: Constant shear positive area
        shadeSource = (
          <g>
            <rect
              x={getSvgX(0)}
              y={sfdY - rxnA * sfdScale}
              width={getSvgX(5) - getSvgX(0)}
              height={rxnA * sfdScale}
              className="fill-emerald-500/25 stroke-emerald-500/20 animate-in fade-in duration-300"
            />
            {clickIdx >= 1 && (
              <text x={getSvgX(2.5)} y={sfdY - rxnA * sfdScale + 12} textAnchor="middle" className="text-[7px] font-black fill-emerald-600 dark:fill-emerald-400 font-mono animate-in fade-in">V = 14.325, L = 5m</text>
            )}
          </g>
        );
      } else if (stepIndex === 17 && clickIdx >= 0) {
        // C to peak: positive triangle
        const peakX = 9.775;
        shadeSource = (
          <g>
            <polygon
              points={`${getSvgX(5)},${sfdY} ${getSvgX(5)},${sfdY - rxnA * sfdScale} ${getSvgX(peakX)},${sfdY}`}
              className="fill-emerald-500/25 stroke-emerald-500/20 animate-in fade-in duration-300"
            />
            {clickIdx >= 1 && (
              <text x={getSvgX(7.3)} y={sfdY - 6} textAnchor="middle" className="text-[7px] font-black fill-emerald-600 dark:fill-emerald-400 font-mono animate-in fade-in">V = 14.325, L = 4.775m</text>
            )}
          </g>
        );
      } else if (stepIndex === 19 && clickIdx >= 0) {
        // peak to D: negative triangle
        const peakX = 9.775;
        const vD = -6.675;
        shadeSource = (
          <g>
            <polygon
              points={`${getSvgX(peakX)},${sfdY} ${getSvgX(12)},${sfdY} ${getSvgX(12)},${sfdY - vD * sfdScale}`}
              className="fill-rose-500/25 stroke-rose-500/20 animate-in fade-in duration-300"
            />
            {clickIdx >= 1 && (
              <text x={getSvgX(10.9)} y={sfdY + 12} textAnchor="middle" className="text-[7px] font-black fill-rose-600 dark:fill-rose-450 font-mono animate-in fade-in">V = -6.675, L = 2.225m</text>
            )}
          </g>
        );
      } else if (stepIndex === 21 && clickIdx >= 0) {
        // D to E: negative rectangle
        const vDE = -6.675;
        shadeSource = (
          <g>
            <rect
              x={getSvgX(12)}
              y={sfdY}
              width={getSvgX(17) - getSvgX(12)}
              height={Math.abs(vDE * sfdScale)}
              className="fill-rose-500/25 stroke-rose-500/20 animate-in fade-in duration-300"
            />
            {clickIdx >= 1 && (
              <text x={getSvgX(14.5)} y={sfdY + 16} textAnchor="middle" className="text-[7px] font-black fill-rose-600 dark:fill-rose-450 font-mono animate-in fade-in">V = -6.675, L = 5m</text>
            )}
          </g>
        );
      } else if (stepIndex === 23 && clickIdx >= 0) {
        // E to B: negative rectangle
        const vEB = -21.675;
        shadeSource = (
          <g>
            <rect
              x={getSvgX(17)}
              y={sfdY}
              width={getSvgX(20) - getSvgX(17)}
              height={Math.abs(vEB * sfdScale)}
              className="fill-rose-500/25 stroke-rose-500/20 animate-in fade-in duration-300"
            />
            {clickIdx >= 1 && (
              <text x={getSvgX(18.5)} y={sfdY + 22} textAnchor="middle" className="text-[7px] font-black fill-rose-600 dark:fill-rose-450 font-mono animate-in fade-in">V = -21.675, L = 3m</text>
            )}
          </g>
        );
      }
    }

    // Helper helper function to draw reference lines + orange difference arrows with values
    const renderHelperVisuals = (
      stepCond: boolean,
      opacity: number,
      refY1: number,
      refY2: number,
      xRefStart: number,
      xRefEnd: number,
      arrowX: number,
      arrowYStart: number,
      arrowYEnd: number,
      diffValue?: string
    ) => {
      if (!stepCond) return null;
      const midY = (arrowYStart + arrowYEnd) / 2;
      const textX = getSvgX(arrowX) + (arrowX > 15 ? -6 : 6);
      const textAnchor = arrowX > 15 ? 'end' : 'start';

      return (
        <g style={{ opacity }}>
          {/* Reference Line */}
          <line
            x1={getSvgX(xRefStart)}
            y1={refY1}
            x2={getSvgX(xRefEnd)}
            y2={refY2}
            className="stroke-amber-500/70"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          {/* Difference Arrow */}
          {arrowYStart !== arrowYEnd && (
            <g>
              <line
                x1={getSvgX(arrowX)}
                y1={arrowYStart}
                x2={getSvgX(arrowX)}
                y2={arrowYEnd}
                className="stroke-amber-500 animate-in fade-in duration-200"
                strokeWidth="1.8"
                markerEnd="url(#arrow)"
              />
              {diffValue && (
                <text
                  x={textX}
                  y={midY + 3}
                  textAnchor={textAnchor}
                  className="text-[7.5px] font-black fill-amber-500 font-mono animate-in fade-in"
                >
                  {diffValue}
                </text>
              )}
            </g>
          )}
        </g>
      );
    };

    return (
      <div className="w-full flex flex-col items-center justify-center p-3 border border-border/40 bg-muted/5 dark:bg-slate-900/10 rounded-xl">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Vertical Aligned Gridlines */}
          {[0, 5, 12, 17, 20].map((x, idx) => {
            const showLine = stepIndex >= 2 ? (stepIndex > 2 || clickIdx >= idx) : true;
            return showLine ? (
              <line
                key={x}
                x1={getSvgX(x)}
                y1="5"
                x2={getSvgX(x)}
                y2={svgHeight - 5}
                className="stroke-muted-foreground/15 transition-opacity duration-300"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            ) : null;
          })}

          {/* 1. BEAM DIAGRAM */}
          {showBeam && (
            <g>
              <rect x="50" y={beamY - 5} width="400" height="10" rx="1.5" className="fill-slate-200 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-700" strokeWidth="1.2" />
              
              {/* Supports */}
              <polygon points={`${getSvgX(0) - 8},${beamY + 16} ${getSvgX(0)},${beamY + 5} ${getSvgX(0) + 8},${beamY + 16}`} className="fill-slate-400 dark:fill-slate-500" />
              <line x1={getSvgX(0) - 10} y1={beamY + 16} x2={getSvgX(0) + 10} y2={beamY + 16} className="stroke-slate-500" strokeWidth="1.2" />
              
              <polygon points={`${getSvgX(20) - 8},${beamY + 14} ${getSvgX(20)},${beamY + 5} ${getSvgX(20) + 8},${beamY + 14}`} className="fill-slate-400 dark:fill-slate-500" />
              <circle cx={getSvgX(20) - 4} cy={beamY + 15.5} r="1.5" className="fill-slate-400" />
              <circle cx={getSvgX(20) + 4} cy={beamY + 15.5} r="1.5" className="fill-slate-400" />
              <line x1={getSvgX(20) - 10} y1={beamY + 17.5} x2={getSvgX(20) + 10} y2={beamY + 17.5} className="stroke-slate-500" strokeWidth="1.2" />

              {/* UDL Graphic */}
              <path
                d={`M ${getSvgX(5)} ${beamY - 5} Q ${getSvgX(5.5)} ${beamY - 20} ${getSvgX(6)} ${beamY - 5} Q ${getSvgX(6.5)} ${beamY - 20} ${getSvgX(7)} ${beamY - 5} Q ${getSvgX(7.5)} ${beamY - 20} ${getSvgX(8)} ${beamY - 5} Q ${getSvgX(8.5)} ${beamY - 20} ${getSvgX(9)} ${beamY - 5} Q ${getSvgX(9.5)} ${beamY - 20} ${getSvgX(10)} ${beamY - 5} Q ${getSvgX(10.5)} ${beamY - 20} ${getSvgX(11)} ${beamY - 5} Q ${getSvgX(11.5)} ${beamY - 20} ${getSvgX(12)} ${beamY - 5}`}
                fill="none"
                className="stroke-amber-500/80"
                strokeWidth="1.5"
              />
              <text x={getSvgX(8.5)} y={beamY - 22} textAnchor="middle" className="text-[9px] font-black fill-amber-500/90 font-mono">w = 3 kN/m</text>

              {/* Point Load */}
              <path d={`M ${getSvgX(17)},${beamY - 28} L ${getSvgX(17)},${beamY - 6} M ${getSvgX(17) - 3.5},${beamY - 12} L ${getSvgX(17)},${beamY - 6} L ${getSvgX(17) + 3.5},${beamY - 12}`} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              <text x={getSvgX(17) + 6} y={beamY - 20} className="text-[9px] font-black fill-rose-500 font-mono">P = 15 kN</text>

              {/* Reaction equilibrium values */}
              {((stepIndex === 1 && clickIdx >= 3) || stepIndex > 1) && (
                <path d={`M ${getSvgX(0)},${beamY + 36} L ${getSvgX(0)},${beamY + 19} M ${getSvgX(0) - 3.5},${beamY + 25} L ${getSvgX(0)},${beamY + 19} L ${getSvgX(0) + 3.5},${beamY + 25}`} fill="none" stroke="#10b981" strokeWidth="1.8" />
              )}
              {((stepIndex === 1 && clickIdx >= 3) || stepIndex > 1) && (
                <text x={getSvgX(0) + 6} y={beamY + 30} className="text-[8px] font-bold fill-emerald-500 font-mono">R_A = 14.325 kN</text>
              )}

              {((stepIndex === 1 && clickIdx >= 1) || stepIndex > 1) && (
                <path d={`M ${getSvgX(20)},${beamY + 36} L ${getSvgX(20)},${beamY + 19} M ${getSvgX(20) - 3.5},${beamY + 25} L ${getSvgX(20)},${beamY + 19} L ${getSvgX(20) + 3.5},${beamY + 25}`} fill="none" stroke="#10b981" strokeWidth="1.8" />
              )}
              {((stepIndex === 1 && clickIdx >= 1) || stepIndex > 1) && (
                <text x={getSvgX(20) - 6} y={beamY + 30} textAnchor="end" className="text-[8px] font-bold fill-emerald-500 font-mono">R_B = 21.675 kN</text>
              )}

              {shadeSource}
            </g>
          )}

          {/* 2. SHEAR FORCE DIAGRAM (SFD) */}
          {showSfd && (
            <g>
              {/* Baseline */}
              <line x1="30" y1={sfdY} x2="470" y2={sfdY} className="stroke-slate-400/60 dark:stroke-slate-650" strokeWidth="1.2" />
              <text x="473" y={sfdY + 3} className="text-[8px] font-bold fill-muted-foreground font-mono">x</text>
              <text x="40" y={sfdY - 26} className="text-[8px] font-black fill-rose-500 font-mono">V (kN)</text>

              {pairing === 'sfd-bmd' && shadeSource}

              {/* NODE A JUMP (step 3) */}
              {stepIndex >= 3 && (
                <g>
                  {((stepIndex === 3 && clickIdx >= 1) || stepIndex > 3) && (
                    <>
                      <circle cx={getSvgX(0)} cy={sfdY} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                      <circle cx={getSvgX(0)} cy={sfdY - rxnA * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                    </>
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 3,
                    stepIndex === 3 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    sfdY,
                    sfdY,
                    -0.5,
                    0.5,
                    0,
                    sfdY,
                    sfdY - rxnA * sfdScale,
                    "+14.325 kN"
                  )}
                  {stepIndex > 3 ? (
                    <line
                      x1={getSvgX(0)}
                      y1={sfdY}
                      x2={getSvgX(0)}
                      y2={sfdY - rxnA * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 3 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(0)}
                      y1={sfdY}
                      x2={getSvgX(0)}
                      y2={sfdY - rxnA * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* SEGMENT A-C INTEGRATION (step 4) */}
              {stepIndex >= 4 && (
                <g>
                  {((stepIndex === 4 && clickIdx >= 1) || stepIndex > 4) && (
                    <circle cx={getSvgX(5)} cy={sfdY - rxnA * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 4,
                    stepIndex === 4 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    sfdY - rxnA * sfdScale,
                    sfdY - rxnA * sfdScale,
                    0,
                    5,
                    5,
                    sfdY - rxnA * sfdScale,
                    sfdY - rxnA * sfdScale
                  )}
                  {stepIndex > 4 ? (
                    <line
                      x1={getSvgX(0)}
                      y1={sfdY - rxnA * sfdScale}
                      x2={getSvgX(5)}
                      y2={sfdY - rxnA * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 4 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(0)}
                      y1={sfdY - rxnA * sfdScale}
                      x2={getSvgX(5)}
                      y2={sfdY - rxnA * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* NODE C CONTINUITY CHECK (step 5) */}
              {stepIndex >= 5 && (
                <g>
                  {((stepIndex === 5 && clickIdx >= 1) || stepIndex > 5) && (
                    <circle cx={getSvgX(5)} cy={sfdY - rxnA * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                </g>
              )}

              {/* SEGMENT C-D INTEGRATION (step 6) */}
              {stepIndex >= 6 && (
                <g>
                  {((stepIndex === 6 && clickIdx >= 1) || stepIndex > 6) && (
                    <circle cx={getSvgX(12)} cy={sfdY - (-6.675) * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 6,
                    stepIndex === 6 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    sfdY - rxnA * sfdScale,
                    sfdY - rxnA * sfdScale,
                    5,
                    12,
                    12,
                    sfdY - rxnA * sfdScale,
                    sfdY - (-6.675) * sfdScale,
                    "-21.000 kN"
                  )}
                  {stepIndex > 6 ? (
                    <line
                      x1={getSvgX(5)}
                      y1={sfdY - rxnA * sfdScale}
                      x2={getSvgX(12)}
                      y2={sfdY - (-6.675) * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 6 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(5)}
                      y1={sfdY - rxnA * sfdScale}
                      x2={getSvgX(12)}
                      y2={sfdY - (-6.675) * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                  {((stepIndex === 6 && clickIdx >= 3) || stepIndex > 6) && (
                    <g className="animate-in fade-in">
                      <circle cx={getSvgX(9.775)} cy={sfdY} r="2" className="fill-rose-500 animate-pulse" />
                      <text x={getSvgX(9.775)} y={sfdY + 12} textAnchor="middle" className="text-[7.5px] font-black fill-rose-500 font-mono">x_0 = 9.775m</text>
                    </g>
                  )}
                </g>
              )}

              {/* NODE D CONTINUITY CHECK (step 7) */}
              {stepIndex >= 7 && (
                <g>
                  {((stepIndex === 7 && clickIdx >= 1) || stepIndex > 7) && (
                    <circle cx={getSvgX(12)} cy={sfdY - (-6.675) * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                </g>
              )}

              {/* SEGMENT D-E INTEGRATION (step 8) */}
              {stepIndex >= 8 && (
                <g>
                  {((stepIndex === 8 && clickIdx >= 1) || stepIndex > 8) && (
                    <circle cx={getSvgX(17)} cy={sfdY - (-6.675) * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 8,
                    stepIndex === 8 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    sfdY - (-6.675) * sfdScale,
                    sfdY - (-6.675) * sfdScale,
                    12,
                    17,
                    17,
                    sfdY - (-6.675) * sfdScale,
                    sfdY - (-6.675) * sfdScale
                  )}
                  {stepIndex > 8 ? (
                    <line
                      x1={getSvgX(12)}
                      y1={sfdY - (-6.675) * sfdScale}
                      x2={getSvgX(17)}
                      y2={sfdY - (-6.675) * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 8 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(12)}
                      y1={sfdY - (-6.675) * sfdScale}
                      x2={getSvgX(17)}
                      y2={sfdY - (-6.675) * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* NODE E JUMP (step 9) */}
              {stepIndex >= 9 && (
                <g>
                  {((stepIndex === 9 && clickIdx >= 1) || stepIndex > 9) && (
                    <>
                      <circle cx={getSvgX(17)} cy={sfdY - (-6.675) * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                      <circle cx={getSvgX(17)} cy={sfdY - (-21.675) * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                    </>
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 9,
                    stepIndex === 9 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    sfdY - (-6.675) * sfdScale,
                    sfdY - (-6.675) * sfdScale,
                    16,
                    18,
                    17,
                    sfdY - (-6.675) * sfdScale,
                    sfdY - (-21.675) * sfdScale,
                    "-15.000 kN"
                  )}
                  {stepIndex > 9 ? (
                    <line
                      x1={getSvgX(17)}
                      y1={sfdY - (-6.675) * sfdScale}
                      x2={getSvgX(17)}
                      y2={sfdY - (-21.675) * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 9 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(17)}
                      y1={sfdY - (-6.675) * sfdScale}
                      x2={getSvgX(17)}
                      y2={sfdY - (-21.675) * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* SEGMENT E-B INTEGRATION (step 10) */}
              {stepIndex >= 10 && (
                <g>
                  {((stepIndex === 10 && clickIdx >= 1) || stepIndex > 10) && (
                    <circle cx={getSvgX(20)} cy={sfdY - (-21.675) * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 10,
                    stepIndex === 10 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    sfdY - (-21.675) * sfdScale,
                    sfdY - (-21.675) * sfdScale,
                    17,
                    20,
                    20,
                    sfdY - (-21.675) * sfdScale,
                    sfdY - (-21.675) * sfdScale
                  )}
                  {stepIndex > 10 ? (
                    <line
                      x1={getSvgX(17)}
                      y1={sfdY - (-21.675) * sfdScale}
                      x2={getSvgX(20)}
                      y2={sfdY - (-21.675) * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 10 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(17)}
                      y1={sfdY - (-21.675) * sfdScale}
                      x2={getSvgX(20)}
                      y2={sfdY - (-21.675) * sfdScale}
                      className="stroke-rose-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* NODE B JUMP (step 11) */}
              {stepIndex >= 11 && (
                <g>
                  {((stepIndex === 11 && clickIdx >= 1) || stepIndex > 11) && (
                    <>
                      <circle cx={getSvgX(20)} cy={sfdY - (-21.675) * sfdScale} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                      <circle cx={getSvgX(20)} cy={sfdY} r="3" className="fill-rose-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                    </>
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 11,
                    stepIndex === 11 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    sfdY - (-21.675) * sfdScale,
                    sfdY - (-21.675) * sfdScale,
                    19,
                    21,
                    20,
                    sfdY - (-21.675) * sfdScale,
                    sfdY,
                    "+21.675 kN"
                  )}
                  {stepIndex > 11 ? (
                    <line
                      x1={getSvgX(20)}
                      y1={sfdY - (-21.675) * sfdScale}
                      x2={getSvgX(20)}
                      y2={sfdY}
                      className="stroke-rose-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 11 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(20)}
                      y1={sfdY - (-21.675) * sfdScale}
                      x2={getSvgX(20)}
                      y2={sfdY}
                      className="stroke-rose-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {(stepIndex > 11 || pairing === 'sfd-bmd' || pairing === 'all') && (
                <g>
                  <path
                    d={`M ${getSvgX(0)} ${sfdY} L ${getSvgX(0)} ${sfdY - rxnA * sfdScale} L ${getSvgX(5)} ${sfdY - rxnA * sfdScale} L ${getSvgX(12)} ${sfdY - (-6.675) * sfdScale} L ${getSvgX(17)} ${sfdY - (-6.675) * sfdScale} L ${getSvgX(17)} ${sfdY - (-21.675) * sfdScale} L ${getSvgX(20)} ${sfdY - (-21.675) * sfdScale} L ${getSvgX(20)} ${sfdY}`}
                    fill="none"
                    className="stroke-rose-500/80"
                    strokeWidth="1.6"
                  />
                  <text x={getSvgX(2.5)} y={sfdY - rxnA * sfdScale - 3} textAnchor="middle" className="text-[7.5px] font-bold fill-rose-500/80 font-mono">+14.325</text>
                  <text x={getSvgX(12) - 4} y={sfdY - (-6.675) * sfdScale + 9} textAnchor="end" className="text-[7.5px] font-bold fill-rose-500/80 font-mono">-6.675</text>
                  <text x={getSvgX(18.5)} y={sfdY - (-21.675) * sfdScale + 9} textAnchor="middle" className="text-[7.5px] font-bold fill-rose-500/80 font-mono">-21.675</text>
                </g>
              )}
            </g>
          )}

          {/* 3. BENDING MOMENT DIAGRAM (BMD) */}
          {showBmd && (
            <g>
              {/* Baseline */}
              <line x1="30" y1={bmdY} x2="470" y2={bmdY} className="stroke-slate-400/60 dark:stroke-slate-650" strokeWidth="1.2" />
              <text x="473" y={bmdY + 3} className="text-[8px] font-bold fill-muted-foreground font-mono">x</text>
              <text x="40" y={bmdY - 26} className="text-[8px] font-black fill-indigo-500 font-mono">M (kNm)</text>

              {/* NODE A START (step 14) */}
              {stepIndex >= 14 && (
                <g>
                  {((stepIndex === 14 && clickIdx >= 1) || stepIndex > 14) && (
                    <circle cx={getSvgX(0)} cy={bmdY} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                </g>
              )}

              {/* BMD SEGMENT A-C INTEGRATION (step 15) */}
              {stepIndex >= 15 && (
                <g>
                  {((stepIndex === 15 && clickIdx >= 1) || stepIndex > 15) && (
                    <circle cx={getSvgX(5)} cy={bmdY - 71.625 * bmdScale} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 15,
                    stepIndex === 15 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    bmdY,
                    bmdY,
                    0,
                    5,
                    5,
                    bmdY,
                    bmdY - 71.625 * bmdScale,
                    "+71.625 kNm"
                  )}
                  {stepIndex > 15 ? (
                    <line
                      x1={getSvgX(0)}
                      y1={bmdY}
                      x2={getSvgX(5)}
                      y2={bmdY - 71.625 * bmdScale}
                      className="stroke-indigo-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 15 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(0)}
                      y1={bmdY}
                      x2={getSvgX(5)}
                      y2={bmdY - 71.625 * bmdScale}
                      className="stroke-indigo-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* BMD NODE C CHECK (step 16) */}
              {stepIndex >= 16 && (
                <g>
                  {((stepIndex === 16 && clickIdx >= 1) || stepIndex > 16) && (
                    <circle cx={getSvgX(5)} cy={bmdY - 71.625 * bmdScale} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                </g>
              )}

              {/* BMD SEGMENT C-TO-PEAK INTEGRATION (step 17) */}
              {stepIndex >= 17 && (
                <g>
                  {((stepIndex === 17 && clickIdx >= 1) || stepIndex > 17) && (
                    <circle cx={getSvgX(9.775)} cy={bmdY - 105.825 * bmdScale} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 17,
                    stepIndex === 17 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    bmdY - 71.625 * bmdScale,
                    bmdY - 71.625 * bmdScale,
                    5,
                    9.775,
                    9.775,
                    bmdY - 71.625 * bmdScale,
                    bmdY - 105.825 * bmdScale,
                    "+34.200 kNm"
                  )}
                  {stepIndex > 17 ? (
                    <path
                      d={`M ${getParabolaPoints(5, 9.775, bmdY, bmdScale).trim().split(' ').join(' L ')}`}
                      fill="none"
                      className="stroke-indigo-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 17 && clickIdx >= 3 ? (
                    <motion.path
                      d={`M ${getParabolaPoints(5, 9.775, bmdY, bmdScale).trim().split(' ').join(' L ')}`}
                      fill="none"
                      className="stroke-indigo-500"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* BMD PEAK PEAK MOMENT CHECK (step 18) */}
              {stepIndex >= 18 && (
                <g>
                  {((stepIndex === 18 && clickIdx >= 1) || stepIndex > 18) && (
                    <circle cx={getSvgX(9.775)} cy={bmdY - 105.825 * bmdScale} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                </g>
              )}

              {/* BMD SEGMENT PEAK-TO-D INTEGRATION (step 19) */}
              {stepIndex >= 19 && (
                <g>
                  {((stepIndex === 19 && clickIdx >= 1) || stepIndex > 19) && (
                    <circle cx={getSvgX(12)} cy={bmdY - 98.4 * bmdScale} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 19,
                    stepIndex === 19 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    bmdY - 105.825 * bmdScale,
                    bmdY - 105.825 * bmdScale,
                    9.775,
                    12,
                    12,
                    bmdY - 105.825 * bmdScale,
                    bmdY - 98.4 * bmdScale,
                    "-7.425 kNm"
                  )}
                  {stepIndex > 19 ? (
                    <path
                      d={`M ${getParabolaPoints(9.775, 12, bmdY, bmdScale).trim().split(' ').join(' L ')}`}
                      fill="none"
                      className="stroke-indigo-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 19 && clickIdx >= 3 ? (
                    <motion.path
                      d={`M ${getParabolaPoints(9.775, 12, bmdY, bmdScale).trim().split(' ').join(' L ')}`}
                      fill="none"
                      className="stroke-indigo-500"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* BMD NODE D CHECK (step 20) */}
              {stepIndex >= 20 && (
                <g>
                  {((stepIndex === 20 && clickIdx >= 1) || stepIndex > 20) && (
                    <circle cx={getSvgX(12)} cy={bmdY - 98.4 * bmdScale} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                </g>
              )}

              {/* BMD SEGMENT D-E INTEGRATION (step 21) */}
              {stepIndex >= 21 && (
                <g>
                  {((stepIndex === 21 && clickIdx >= 1) || stepIndex > 21) && (
                    <circle cx={getSvgX(17)} cy={bmdY - 65.025 * bmdScale} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 21,
                    stepIndex === 21 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    bmdY - 98.4 * bmdScale,
                    bmdY - 98.4 * bmdScale,
                    12,
                    17,
                    17,
                    bmdY - 98.4 * bmdScale,
                    bmdY - 65.025 * bmdScale,
                    "-33.375 kNm"
                  )}
                  {stepIndex > 21 ? (
                    <line
                      x1={getSvgX(12)}
                      y1={bmdY - 98.4 * bmdScale}
                      x2={getSvgX(17)}
                      y2={bmdY - 65.025 * bmdScale}
                      className="stroke-indigo-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 21 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(12)}
                      y1={bmdY - 98.4 * bmdScale}
                      x2={getSvgX(17)}
                      y2={bmdY - 65.025 * bmdScale}
                      className="stroke-indigo-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* BMD NODE E CHECK (step 22) */}
              {stepIndex >= 22 && (
                <g>
                  {((stepIndex === 22 && clickIdx >= 1) || stepIndex > 22) && (
                    <circle cx={getSvgX(17)} cy={bmdY - 65.025 * bmdScale} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                </g>
              )}

              {/* BMD SEGMENT E-B INTEGRATION (step 23) */}
              {stepIndex >= 23 && (
                <g>
                  {((stepIndex === 23 && clickIdx >= 1) || stepIndex > 23) && (
                    <circle cx={getSvgX(20)} cy={bmdY} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                  {renderHelperVisuals(
                    stepIndex >= 23,
                    stepIndex === 23 ? (clickIdx >= 2 ? 1 : 0) : 0.15,
                    bmdY - 65.025 * bmdScale,
                    bmdY - 65.025 * bmdScale,
                    17,
                    20,
                    20,
                    bmdY - 65.025 * bmdScale,
                    bmdY,
                    "-65.025 kNm"
                  )}
                  {stepIndex > 23 ? (
                    <line
                      x1={getSvgX(17)}
                      y1={bmdY - 65.025 * bmdScale}
                      x2={getSvgX(20)}
                      y2={bmdY}
                      className="stroke-indigo-500"
                      strokeWidth="2"
                    />
                  ) : stepIndex === 23 && clickIdx >= 3 ? (
                    <motion.line
                      x1={getSvgX(17)}
                      y1={bmdY - 65.025 * bmdScale}
                      x2={getSvgX(20)}
                      y2={bmdY}
                      className="stroke-indigo-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </g>
              )}

              {/* BMD NODE B CHECK (step 24) */}
              {stepIndex >= 24 && (
                <g>
                  {((stepIndex === 24 && clickIdx >= 1) || stepIndex > 24) && (
                    <circle cx={getSvgX(20)} cy={bmdY} r="3" className="fill-indigo-500 stroke-white dark:stroke-slate-900 animate-in zoom-in-50 duration-200" strokeWidth="1" />
                  )}
                </g>
              )}

              {/* Curvature selections highlight overrides */}
              {stepIndex === 13 && (
                <polyline
                  points={getParabolaPoints(5, 9.775, bmdY, bmdScale)}
                  fill="none"
                  className={`stroke-[3.5] transition-all ${clickIdx >= 1 ? 'stroke-emerald-500' : 'stroke-indigo-500/20'}`}
                />
              )}
              {stepIndex === 14 && (
                <polyline
                  points={getParabolaPoints(9.775, 12, bmdY, bmdScale)}
                  fill="none"
                  className={`stroke-[3.5] transition-all ${clickIdx >= 1 ? 'stroke-rose-500' : 'stroke-indigo-500/20'}`}
                />
              )}

              {/* Completed BMD overlay */}
              {(stepIndex === 25 || stepIndex === 12) && (
                <g>
                  <line x1={getSvgX(0)} y1={bmdY} x2={getSvgX(5)} y2={bmdY - 71.625 * bmdScale} className="stroke-indigo-500" strokeWidth="2.2" />
                  <polyline points={getParabolaPoints(5, 12, bmdY, bmdScale)} fill="none" className="stroke-indigo-500" strokeWidth="2.2" />
                  <line x1={getSvgX(12)} y1={bmdY - 98.4 * bmdScale} x2={getSvgX(17)} y2={bmdY - 65.025 * bmdScale} className="stroke-indigo-500" strokeWidth="2.2" />
                  <line x1={getSvgX(17)} y1={bmdY - 65.025 * bmdScale} x2={getSvgX(20)} y2={bmdY} className="stroke-indigo-500" strokeWidth="2.2" />
                  
                  <text x={getSvgX(5) + 6} y={bmdY - 71.625 * bmdScale + 3} className="text-[7.5px] font-bold fill-indigo-500 font-mono">71.625</text>
                  <text x={getSvgX(9.775)} y={bmdY - 105.825 * bmdScale - 5} textAnchor="middle" className="text-[7.5px] font-black fill-indigo-500 font-mono">105.825</text>
                  <text x={getSvgX(12) + 6} y={bmdY - 98.4 * bmdScale + 3} className="text-[7.5px] font-bold fill-indigo-500 font-mono">98.4</text>
                  <text x={getSvgX(17) + 6} y={bmdY - 65.025 * bmdScale + 3} className="text-[7.5px] font-bold fill-indigo-500 font-mono">65.025</text>
                </g>
              )}
            </g>
          )}

        </svg>
      </div>
    );
  };

  // Custom descriptions and calculation labels per slide index
  const renderStepContent = () => {
    switch (stepIndex) {
      case 0: // Setup
        return (
          <TwoColumnLayout
            title="Problem 03 - Load Diagram Setup"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam')}
            rightContent={
              <div className="flex flex-col gap-3 justify-center h-full">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Step 1: Identify System & Loads</span>
                <h4 className="text-sm font-extrabold text-foreground">Geometry and Loading Configuration</h4>
                <SlideParagraph variant="plain" className="text-xs text-muted-foreground leading-relaxed">
                  We begin with a 20-meter simply supported beam, pinned at support A (<LatexFormula math="x = 0\text{ m}" />) and resting on a roller at support B (<LatexFormula math="x = 20\text{ m}" />). The beam carries:
                </SlideParagraph>
                <div className="space-y-1.5 pl-1.5">
                  <SlideBullet>
                    <span>
                      {"A UDL of "}
                      <LatexFormula math="3\text{ kN/m}" />
                      {" acting over a "}
                      <LatexFormula math="7\text{m}" />
                      {" span from "}
                      <LatexFormula math="x = 5\text{ m}" />
                      {" to "}
                      <LatexFormula math="x = 12\text{ m}" />
                      {"."}
                    </span>
                  </SlideBullet>
                  <SlideBullet>
                    <span>
                      {"A concentrated point load of "}
                      <LatexFormula math="15\text{ kN}" />
                      {" acting downward at "}
                      <LatexFormula math="x = 17\text{ m}" />
                      {"."}
                    </span>
                  </SlideBullet>
                </div>
              </div>
            }
          />
        );

      case 1: // Reactions
        return (
          <TwoColumnLayout
            title="Problem 03 - Support Reactions"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam')}
            rightContent={
              <div className="flex flex-col gap-2 justify-center h-full overflow-y-auto max-h-[360px] pr-1 font-medium">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Step 2: External Equilibrium</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Calculating Support Reactions</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-indigo-500 block mb-0.5 font-mono">Moment Equation about A:</span>
                    <LatexFormula math="\sum M_A = 0 \implies R_{By} \cdot 20 - 178.5 - 255 = 0" />
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">Solve Reaction at B:</span>
                      <LatexFormula math="R_{By} = 21.675\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">Vertical Equilibrium:</span>
                      <LatexFormula math="\sum F_y = 0 \implies R_{Ay} + R_{By} - 36 = 0" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">Solve Reaction at A:</span>
                      <LatexFormula math="R_{Ay} = 14.325\text{ kN}" />
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 2: // Discontinuity Reference Grid
        return (
          <TwoColumnLayout
            title="Problem 03 - Discontinuity Reference Grid"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam')}
            rightContent={
              <div className="flex flex-col gap-3 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Step 3: Reference Boundaries</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Defining Key Nodes & Intervals</h4>
                <SlideParagraph variant="plain" className="text-xs text-muted-foreground leading-relaxed">
                  Establish vertical grid lines corresponding to loading discontinuities. These points define segment boundaries for graphical integration:
                </SlideParagraph>
                <div className="grid grid-cols-1 gap-1.5 text-[10px] font-mono text-muted-foreground max-h-[180px] overflow-y-auto pr-1">
                  <ClickReveal at={0}>
                    <div className="p-1.5 bg-muted/20 rounded border border-indigo-500/25">
                      <span className="font-bold text-indigo-500">Node A (x = 0m)</span>: Left support boundary
                    </div>
                  </ClickReveal>
                  <ClickReveal at={1}>
                    <div className="p-1.5 bg-muted/20 rounded border border-indigo-500/25">
                      <span className="font-bold text-indigo-500">Node C (x = 5m)</span>: Start of UDL
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="p-1.5 bg-muted/20 rounded border border-indigo-500/25">
                      <span className="font-bold text-indigo-500">Node D (x = 12m)</span>: End of UDL
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="p-1.5 bg-muted/20 rounded border border-indigo-500/25">
                      <span className="font-bold text-indigo-500">Node E (x = 17m)</span>: Point load P location
                    </div>
                  </ClickReveal>
                  <ClickReveal at={4}>
                    <div className="p-1.5 bg-muted/20 rounded border border-indigo-500/25">
                      <span className="font-bold text-indigo-500">Node B (x = 20m)</span>: Right support boundary
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 3: // SFD Node A Jump
        return (
          <TwoColumnLayout
            title="SFD Jumps: Node A"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam-sfd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Node A Jump Step</span>
                <h4 className="text-sm font-extrabold text-foreground">Support Reaction at A</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans font-medium">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check Node Loads:</span>
                    Concentrated reaction force <LatexFormula math="R_{Ay} = 14.325\text{ kN}" /> acts upward.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Jump Calculation:</span>
                      <LatexFormula math="V(0^+) = R_{Ay} = 14.325\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Helper Reference line & Arrow:</span>
                      Draw horizontal reference line at <LatexFormula math="V=0" />. Show upward difference arrow to <LatexFormula math="+14.325\text{ kN}" />.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Jump Line:</span>
                      Animate vertical line representing the shear jump at Node A.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 4: // SFD Segment A-C Integration
        return (
          <TwoColumnLayout
            title="SFD Integration: Segment A to C"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam-sfd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Segment A-C Integration Step</span>
                <h4 className="text-sm font-extrabold text-foreground">Shear over Unloaded Span</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check Segment Load:</span>
                    Between A and C, there is zero external load (<LatexFormula math="w = 0" />).
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Area Calculation (Change):</span>
                      <LatexFormula math="\Delta V = \int 0 \, dx = 0\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line & arrow:</span>
                      Horizontal reference line from Node A at <LatexFormula math="14.325\text{ kN}" />. Difference arrow length is 0.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Segment:</span>
                      Animate constant horizontal line (Degree 0) up to Node C.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 5: // SFD Node C Check
        return (
          <TwoColumnLayout
            title="SFD Jumps: Node C"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam-sfd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Node C check Step</span>
                <h4 className="text-sm font-extrabold text-foreground">Continuous Shear check</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check Node Loads:</span>
                    External concentrated point load at Node C is zero.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Continuity Calculation:</span>
                      <LatexFormula math="V(5^+) = V(5^-) = 14.325\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Plot Point:</span>
                      Plot point at Node C on diagram representing continuous shear.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 6: // SFD Segment C-D Integration
        return (
          <TwoColumnLayout
            title="SFD Integration: Segment C to D"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam-sfd')}
            rightContent={
              <div className="flex flex-col gap-2 justify-center h-full">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Segment C-D Integration Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Shear Force under UDL</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans font-medium">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check Segment Load:</span>
                    Identify UDL load block of height <LatexFormula math="3\text{ kN/m}" /> and length <LatexFormula math="7\text{m}" />.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2 space-y-1.5">
                      <span className="font-bold text-indigo-500 block font-mono">2. Area Calculation (Change):</span>
                      <LatexFormula math="\Delta V = -w \cdot L = -3 \cdot 7 = -21\text{ kN}" />
                      Resulting Shear at Node D:
                      <LatexFormula math="V_D = 14.325 - 21 = -6.675\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line & arrow:</span>
                      Draw horizontal reference line at <LatexFormula math="14.325\text{ kN}" />, show downward difference arrow of <LatexFormula math="-21\text{ kN}" />.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Segment:</span>
                      Animate sloped straight line (Degree 1) from C to D.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 7: // SFD Node D Check
        return (
          <TwoColumnLayout
            title="SFD Jumps: Node D"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam-sfd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Node D check Step</span>
                <h4 className="text-sm font-extrabold text-foreground">Continuous Shear check</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check Node Loads:</span>
                    External concentrated point load at Node D is zero.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Continuity Calculation:</span>
                      <LatexFormula math="V(12^+) = V(12^-) = -6.675\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Plot Point:</span>
                      Confirm node point on diagram at <LatexFormula math="-6.675\text{ kN}" />.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 8: // SFD Segment D-E Integration
        return (
          <TwoColumnLayout
            title="SFD Integration: Segment D to E"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam-sfd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Segment D-E Integration Step</span>
                <h4 className="text-sm font-extrabold text-foreground">Shear over Unloaded Span</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check Segment Load:</span>
                    Between D and E, there is zero external load (<LatexFormula math="w = 0" />).
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Area Calculation (Change):</span>
                      <LatexFormula math="\Delta V = \int w \, dx = 0\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line & arrow:</span>
                      Horizontal reference line from Node D at <LatexFormula math="-6.675\text{ kN}" />. Difference arrow length is 0.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Segment:</span>
                      Animate constant horizontal line (Degree 0) from D to E.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 9: // SFD Node E Jump
        return (
          <TwoColumnLayout
            title="SFD Jumps: Node E"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam-sfd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Node E Jump Step</span>
                <h4 className="text-sm font-extrabold text-foreground">Concentrated Point Load Drop</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check Node Loads:</span>
                    Concentrated downward load <LatexFormula math="P = 15\text{ kN}" /> acts at Node E.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Jump Calculation:</span>
                      <LatexFormula math="V(17^+) = -6.675 - 15 = -21.675\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line and difference:</span>
                      Draw horizontal reference line at <LatexFormula math="-6.675\text{ kN}" />, show downward difference arrow of <LatexFormula math="-15\text{ kN}" />.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Jump:</span>
                      Animate vertical jump line representing concentrated point load drop.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 10: // SFD Segment E-B Integration
        return (
          <TwoColumnLayout
            title="SFD Integration: Segment E to B"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam-sfd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Segment E-B Integration Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans animate-in fade-in">Shear over Unloaded Span</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check Segment Load:</span>
                    Between E and B, there is zero external load (<LatexFormula math="w = 0" />).
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Area Calculation (Change):</span>
                      <LatexFormula math="\Delta V = \int w \, dx = 0\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line & arrow:</span>
                      Horizontal reference line from Node E at <LatexFormula math="-21.675\text{ kN}" />, plot Node B end point.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Segment:</span>
                      Animate constant horizontal line (Degree 0) from E to B.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 11: // SFD Node B Jump
        return (
          <TwoColumnLayout
            title="SFD Jumps: Node B"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('beam-sfd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Node B Jump Step</span>
                <h4 className="text-sm font-extrabold text-foreground">Support Reaction closing SFD</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check Node Loads:</span>
                    Reaction force <LatexFormula math="R_{By} = 21.675\text{ kN}" /> acts upward.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Jump Calculation:</span>
                      Shear jump closes to zero at support boundary B:
                      <LatexFormula math="V(20^+) = -21.675 + 21.675 = 0\text{ kN}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line and difference:</span>
                      Draw reference baseline at <LatexFormula math="-21.675\text{ kN}" />, and show vertical difference arrow pointing up.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Jump Line:</span>
                      Animate vertical line jump closing the shear diagram to zero.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 12: // Zero-shear point intro
        return (
          <TwoColumnLayout
            title="Zero-Shear Crossing Point"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-3 justify-center h-full">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block font-mono animate-in fade-in">Zero-Shear Location Boundary</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Why Zero-Shear Matters</h4>
                <SlideParagraph variant="plain" className="text-xs text-muted-foreground leading-relaxed font-sans animate-in fade-in">
                  Bending moment reaches its extreme (peak) where the shear force crosses zero, since:
                </SlideParagraph>
                <div className="pl-3.5 py-1 text-xs font-semibold text-foreground font-mono animate-in fade-in">
                  <LatexFormula math="\frac{dM}{dx} = V(x) = 0" />
                </div>
                <div className="p-3 bg-muted/20 border border-border/40 rounded-xl text-xs text-muted-foreground space-y-1 font-sans animate-in fade-in">
                  <p>• The shear line slopes downward across UDL zone C-D and crosses x-axis.</p>
                  <p>• We define distance <LatexFormula math="x_0" /> as distance from Node C (5m) to this crossing point.</p>
                </div>
              </div>
            }
          />
        );

      case 13: // Similar triangles proof
        return (
          <FullWidthLayout title="Solving Zero-Crossing Position">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto mt-4 font-medium">
              <div className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col justify-center items-center shadow-lg relative min-h-[220px]">
                <span className="absolute top-2 left-4 text-[9px] font-bold text-rose-500 uppercase tracking-widest font-mono">Geometry Setup</span>
                <svg className="w-full max-w-[340px] h-[170px] overflow-visible" viewBox="0 0 340 170">
                  <line x1="20" y1="90" x2="320" y2="90" className="stroke-muted-foreground/30" strokeWidth="1" />
                  <polygon points="40,30 220,90 40,90" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.2" />
                  <polygon points="300,120 220,90 300,90" className="fill-rose-500/10 stroke-rose-500" strokeWidth="1.2" />
                  <text x="32" y="60" textAnchor="end" className="text-[10px] font-black fill-emerald-600 dark:fill-emerald-400">14.325</text>
                  <text x="308" y="110" className="text-[10px] font-black fill-rose-600 dark:fill-rose-450">6.675</text>
                  <text x="130" y="105" textAnchor="middle" className="text-[9px] font-bold fill-indigo-500 font-mono">x_0</text>
                  <text x="260" y="105" textAnchor="middle" className="text-[9px] font-bold fill-indigo-500 font-mono">7 - x_0</text>
                </svg>
              </div>
              <div className="space-y-2 text-left font-sans text-xs">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block font-mono">Similar Triangles</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Solving for x_0</h4>
                <ClickReveal at={1}>
                  <div className="pl-3.5 py-1">
                    <span className="font-bold text-indigo-500 block mb-0.5 font-mono">Ratio Setup:</span>
                    <LatexFormula math="\frac{14.325}{x_0} = \frac{6.675}{7 - x_0}" />
                  </div>
                </ClickReveal>
                <ClickReveal at={2}>
                  <div className="pl-3.5 py-1">
                    <span className="font-bold text-indigo-500 block mb-0.5 font-mono">Cross Multiplication:</span>
                    <LatexFormula math="14.325(7 - x_0) = 6.675 \cdot x_0" />
                  </div>
                </ClickReveal>
                <ClickReveal at={3}>
                  <div className="pl-3.5 py-1">
                    <span className="font-bold text-indigo-500 block mb-0.5 font-mono">Simplify & Group:</span>
                    <LatexFormula math="100.275 = 21.0 \cdot x_0" />
                  </div>
                </ClickReveal>
                <ClickReveal at={4}>
                  <div className="text-center text-xs font-bold text-emerald-500 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                    <LatexFormula math="x_0 = 4.775\text{ m} \implies \text{Total } x = 9.775\text{ m}" />
                  </div>
                </ClickReveal>
              </div>
            </div>
          </FullWidthLayout>
        );

      case 14: // BMD Node A Start check
        return (
          <TwoColumnLayout
            title="BMD Node Checks: Node A"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono">Node A Moment Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Moment Boundary at Support A</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans font-medium">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check boundary support:</span>
                    Node A is a pinned end support with no concentrated external moments.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Moment value check:</span>
                      <LatexFormula math="M_A = 0\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Plot Point:</span>
                      Confirm start coordinate point at <LatexFormula math="M=0" /> on Node A.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 15: // BMD Segment A-C Integration
        return (
          <TwoColumnLayout
            title="BMD Integration: Segment A to C"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono animate-in fade-in">Segment A-C Integration Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Integrating Shear Rectangle</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check SFD area:</span>
                    Identify positive shear rectangle of height <LatexFormula math="+14.325\text{ kN}" /> and length <LatexFormula math="5\text{m}" />.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Area Calculation (Change):</span>
                      <LatexFormula math="\Delta M = V \cdot L = 14.325 \cdot 5 = 71.625\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line & arrow:</span>
                      Draw horizontal reference line from Node A at <LatexFormula math="M=0" />, show upward difference arrow of <LatexFormula math="+71.625\text{ kNm}" />.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Segment:</span>
                      Constant shear &rarr; animate linear sloped moment line (Degree 1) to Node C.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 16: // BMD Node C check
        return (
          <TwoColumnLayout
            title="BMD Node Checks: Node C"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono">Node C check Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Moment Continuity check at C</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans font-medium">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check point moment:</span>
                    External concentrated moment at Node C is zero.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Continuity Calculation:</span>
                      <LatexFormula math="M(C^+) = M(C^-) = 71.625\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Plot Point:</span>
                      Confirm node point on diagram at <LatexFormula math="71.625\text{ kNm}" />.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 17: // BMD Segment C-to-Peak Integration
        return (
          <TwoColumnLayout
            title="BMD Integration: C to Zero-Crossing"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono">Segment C-to-Peak Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Integrating Positive Shear Triangle</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check SFD area:</span>
                    Identify positive shear triangle of height <LatexFormula math="14.325\text{ kN}" /> and length <LatexFormula math="4.775\text{ m}" />.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2 space-y-1.5">
                      <span className="font-bold text-indigo-500 block font-mono">2. Area Calculation (Change):</span>
                      <LatexFormula math="\Delta M = \frac{1}{2} \cdot b \cdot h = \frac{1}{2} \cdot 4.775 \cdot 14.325 = 34.200\text{ kNm}" />
                      Resulting Maximum Moment:
                      <LatexFormula math="M_{\max} = 71.625 + 34.2 = 105.825\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line & arrow:</span>
                      Draw horizontal reference line at <LatexFormula math="71.625\text{ kNm}" />, draw vertical upward difference arrow of <LatexFormula math="+34.200\text{ kNm}" /> at peak.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Curve:</span>
                      Linear shear &rarr; animate parabolic curve (Degree 2) rising to peak.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 18: // BMD Peak Moment check
        return (
          <TwoColumnLayout
            title="BMD Node Checks: Peak moment"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono">Peak Moment Check</span>
                <h4 className="text-sm font-extrabold text-foreground">Zero-Slope Moment Peak</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans font-medium">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check condition:</span>
                    Shear is zero at maximum moment location (<LatexFormula math="x = 9.775\text{ m}" />).
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Max Value check:</span>
                      <LatexFormula math="M_{\max} = 105.825\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Plot Point:</span>
                      Confirm peak point coordinate on diagram.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 19: // BMD Segment Peak-to-D Integration
        return (
          <TwoColumnLayout
            title="BMD Integration: Zero-Crossing to D"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono">Segment Peak-to-D Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Integrating Negative Shear Triangle</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check SFD area:</span>
                    Identify negative shear triangle of height <LatexFormula math="-6.675\text{ kN}" /> and length <LatexFormula math="2.225\text{ m}" />.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2 space-y-1.5">
                      <span className="font-bold text-indigo-500 block font-mono">2. Area Calculation (Change):</span>
                      <LatexFormula math="\Delta M = \frac{1}{2} \cdot b \cdot h = \frac{1}{2} \cdot 2.225 \cdot (-6.675) \approx -7.426\text{ kNm}" />
                      Resulting Moment at Node D:
                      <LatexFormula math="M_D = 105.825 - 7.426 = 98.400\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line & arrow:</span>
                      Draw horizontal reference line at <LatexFormula math="105.825\text{ kNm}" />, draw downward difference arrow of <LatexFormula math="-7.426\text{ kNm}" />.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Curve:</span>
                      Animate parabolic curve (Degree 2) falling to 98.400 kNm at Node D.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 20: // BMD Node D check
        return (
          <TwoColumnLayout
            title="BMD Node Checks: Node D"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono animate-in fade-in">Node D check Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans animate-in fade-in">Moment Continuity check at D</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans font-medium">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check point moment:</span>
                    External point moment load at Node D is zero.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Continuity Calculation:</span>
                      <LatexFormula math="M(D^+) = M(D^-) = 98.400\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Plot Point:</span>
                      Plot point at Node D on diagram.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 21: // BMD Segment D-E Integration
        return (
          <TwoColumnLayout
            title="BMD Integration: Segment D to E"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono">Segment D-E Integration Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Integrating Constant Negative Shear</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check SFD area:</span>
                    Identify negative shear block of height <LatexFormula math="-6.675\text{ kN}" /> and length <LatexFormula math="5\text{m}" />.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2 space-y-1.5">
                      <span className="font-bold text-indigo-500 block font-mono">2. Area Calculation (Change):</span>
                      <LatexFormula math="\Delta M = V \cdot L = -6.675 \cdot 5 = -33.375\text{ kNm}" />
                      Resulting Moment at Node E:
                      <LatexFormula math="M_E = 98.400 - 33.375 = 65.025\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line & arrow:</span>
                      Draw horizontal reference line at <LatexFormula math="98.400\text{ kNm}" />, draw downward difference arrow of <LatexFormula math="-33.375\text{ kNm}" />.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Segment:</span>
                      Animate sloped straight line (Degree 1) down to 65.025 kNm.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 22: // BMD Node E check
        return (
          <TwoColumnLayout
            title="BMD Node Checks: Node E"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono">Node E check Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Moment Continuity check at E</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans font-medium">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check point moment:</span>
                    External point moment load at Node E is zero.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Continuity Calculation:</span>
                      <LatexFormula math="M(E^+) = M(E^-) = 65.025\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Plot Point:</span>
                      Plot point at Node E on diagram.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 23: // BMD Segment E-B Integration
        return (
          <TwoColumnLayout
            title="BMD Integration: Segment E to B"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2 justify-center h-full font-medium">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono font-bold">Segment E-B Integration Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Closing Bending Moment Diagram</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check SFD area:</span>
                    Identify negative constant shear block of height <LatexFormula math="-21.675\text{ kN}" /> and length <LatexFormula math="3\text{m}" />.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2 space-y-1.5">
                      <span className="font-bold text-indigo-500 block font-mono">2. Area Calculation (Change):</span>
                      <LatexFormula math="\Delta M = V \cdot L = -21.675 \cdot 3 = -65.025\text{ kNm}" />
                      Resulting Moment at Node B:
                      <LatexFormula math="M_B = 65.025 - 65.025 = 0\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Reference line & arrow:</span>
                      Draw horizontal reference line at <LatexFormula math="65.025\text{ kNm}" />, draw vertical difference arrow downward.
                    </div>
                  </ClickReveal>
                  <ClickReveal at={3}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">4. Draw Segment:</span>
                      Constant negative shear &rarr; animate linear moment line (Degree 1) down to close at 0.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 24: // BMD Node B check
        return (
          <TwoColumnLayout
            title="BMD Node Checks: Node B"
            leftWidth="55%"
            leftContent={renderStackedDiagrams('sfd-bmd')}
            rightContent={
              <div className="flex flex-col gap-2.5 justify-center h-full animate-in fade-in">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block font-mono">Node B Moment Step</span>
                <h4 className="text-sm font-extrabold text-foreground font-sans">Moment Boundary at Support B</h4>
                
                <div className="text-[11px] text-muted-foreground bg-muted/15 border border-border/30 rounded-xl p-2.5 space-y-2 font-sans font-medium">
                  <div>
                    <span className="font-bold text-foreground block mb-0.5">1. Check support boundary:</span>
                    Node B is simple roller boundary with zero concentrated external moments.
                  </div>
                  <ClickReveal at={1}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-indigo-500 block mb-0.5 font-mono">2. Moment value check:</span>
                      <LatexFormula math="M_B = 0\text{ kNm}" />
                    </div>
                  </ClickReveal>
                  <ClickReveal at={2}>
                    <div className="border-t border-border/25 pt-2">
                      <span className="font-bold text-foreground block mb-0.5">3. Plot Point:</span>
                      Confirm final point coordinate at <LatexFormula math="M=0" /> closing the BMD.
                    </div>
                  </ClickReveal>
                </div>
              </div>
            }
          />
        );

      case 25: // Solved Diagrams
        return (
          <FullWidthLayout title="Problem 03: Final Solved Diagrams">
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              {renderStackedDiagrams('all')}
              <div className="text-center mt-2 bg-muted/10 border border-border/30 rounded-xl p-3 animate-in fade-in">
                <SlideParagraph variant="plain" className="text-xs text-muted-foreground leading-relaxed">
                  By utilizing the graphical relationships between loads, shear, and moments, we successfully sketched the complete structural diagrams without writing continuous section-cut equations.
                </SlideParagraph>
              </div>
            </div>
          </FullWidthLayout>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full select-none animate-in fade-in duration-300">
      {renderStepContent()}
    </div>
  );
};
