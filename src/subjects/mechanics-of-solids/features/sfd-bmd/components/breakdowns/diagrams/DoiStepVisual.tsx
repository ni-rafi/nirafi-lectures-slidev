import React, { useContext } from 'react';
import { BeamWorkspaceContext } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { InfluenceLinesWorkspaceContext } from '@/subjects/structural-analysis/features/influence-lines/context/InfluenceLinesWorkspaceContext';

interface DoiStepVisualProps {
  text: string;
}

export const DoiStepVisual: React.FC<DoiStepVisualProps> = ({ text }) => {
  const beamCtx = useContext(BeamWorkspaceContext);
  const influenceCtx = useContext(InfluenceLinesWorkspaceContext);

  const length = beamCtx ? beamCtx.length : (influenceCtx ? influenceCtx.length : 10);
  const supports = beamCtx ? beamCtx.supports : (influenceCtx ? influenceCtx.supports : []);

  const width = 320;
  const height = 70;
  const paddingX = 20;
  const beamW = width - paddingX * 2;
  const yBeam = 25;

  const toPixel = (pos: number) => paddingX + (pos / length) * beamW;

  const isReactionsStep = text.includes('reactions') || text.includes('r =') || text.includes('unknown');
  const isEquationsStep = text.includes('equilibrium') || text.includes('equations');

  return (
    <div className="mt-2.5 mb-1.5 overflow-hidden rounded-lg border border-border/30 bg-muted/5 p-2 max-w-sm">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full select-none overflow-visible">
        {/* Beam member */}
        <rect
          x={paddingX}
          y={yBeam - 4}
          width={beamW}
          height={8}
          rx={2}
          className="fill-muted/70 stroke-border"
          strokeWidth={1}
        />

        {/* Supports */}
        {supports.map(s => {
          const px = toPixel(s.position);
          const isGlow = isReactionsStep;

          return (
            <g key={s.id}>
              {s.type === 'fixed' ? (
                <line
                  x1={px}
                  y1={yBeam - 12}
                  x2={px}
                  y2={yBeam + 12}
                  className={isGlow ? 'stroke-primary stroke-[3]' : 'stroke-foreground stroke-2'}
                />
              ) : s.type === 'hinge' ? (
                <polygon
                  points={`${px},${yBeam} ${px - 8},${yBeam + 12} ${px + 8},${yBeam + 12}`}
                  className={isGlow ? 'fill-primary/20 stroke-primary stroke-2' : 'fill-none stroke-foreground stroke-1.5'}
                />
              ) : (
                <g>
                  <circle
                    cx={px}
                    cy={yBeam + 6}
                    r={5}
                    className={isGlow ? 'fill-primary/20 stroke-primary stroke-2' : 'fill-none stroke-foreground stroke-1.5'}
                  />
                  <line
                    x1={px - 8}
                    y1={yBeam + 12}
                    x2={px + 8}
                    y2={yBeam + 12}
                    className="stroke-foreground stroke-1"
                  />
                </g>
              )}

              {/* Reaction Force Vector Arrows (Ry) */}
              {isReactionsStep && (
                <g>
                  <line
                    x1={px}
                    y1={yBeam + 26}
                    x2={px}
                    y2={yBeam + 12}
                    stroke="var(--success, #10b981)"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                  <polygon
                    points={`${px},${yBeam + 12} ${px - 3},${yBeam + 16} ${px + 3},${yBeam + 16}`}
                    fill="var(--success, #10b981)"
                  />
                  {s.type === 'fixed' && (
                    <>
                      {/* Rx Arrow */}
                      <line
                        x1={px - 14}
                        y1={yBeam}
                        x2={px - 2}
                        y2={yBeam}
                        stroke="var(--success, #10b981)"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                      />
                      <polygon
                        points={`${px - 2},${yBeam} ${px - 6},${yBeam - 3} ${px - 6},${yBeam + 3}`}
                        fill="var(--success, #10b981)"
                      />
                    </>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Equilibrium Equations Graphic */}
        {isEquationsStep && (
          <g transform={`translate(${width / 2 - 50}, ${yBeam + 20})`} className="opacity-90">
            <rect x={0} y={0} width={100} height={18} rx={4} className="fill-primary/10 stroke-primary/30" strokeWidth={1} />
            <text x={50} y={12} textAnchor="middle" className="fill-primary text-[8px] font-bold">
              ΣFx = 0, ΣFy = 0, ΣM = 0
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
