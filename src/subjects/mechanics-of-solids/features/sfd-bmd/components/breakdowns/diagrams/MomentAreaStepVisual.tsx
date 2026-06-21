import React, { useContext } from 'react';
import { BeamWorkspaceContext } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '../../../hooks/useBeamEngine';
import { MiniBeamVisual } from './MiniBeamVisual';

import { ICalculationStep } from '../../../types/stepTypes';

interface MomentAreaStepVisualProps {
  step: ICalculationStep;
}

export const MomentAreaStepVisual: React.FC<MomentAreaStepVisualProps> = ({ step }) => {
  const beamCtx = useContext(BeamWorkspaceContext);
  const { solverResult } = useBeamEngine();
  if (!beamCtx) return null;

  const { length, supports } = beamCtx;

  const width = 500;
  const height = 110;
  const paddingX = 40;
  const beamW = width - paddingX * 2;

  const toPixelX = (x: number) => paddingX + (x / length) * beamW;

  const isDeviation = step.type === 'ma-reference-tangent';
  const isCentroid = step.type === 'ma-segment';

  // Find supports
  const sortedSupports = [...supports].sort((a, b) => a.position - b.position);
  const xA = sortedSupports[0]?.position ?? 0;
  const xB = sortedSupports[1]?.position ?? length;

  const pxA = toPixelX(xA);
  const pxB = toPixelX(xB);

  if (isCentroid && solverResult.success && solverResult.intervals) {
    // Render M/EI centroid mapper scaled to 500px
    const yBaseline = 70;

    const getMAt = (x: number): number => {
      const interval = solverResult.intervals.find(
        inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4
      );
      if (!interval) return 0;
      const [a, b, c, d] = interval.mCoeffs;
      return (a * x * x * x + b * x * x + c * x + d) / 20.0; // scale factor
    };

    // Calculate max moment to scale
    let maxM = 1;
    const points: { x: number; m: number }[] = [];
    const numSteps = 80;
    for (let i = 0; i <= numSteps; i++) {
      const x = (i / numSteps) * length;
      const m = getMAt(x);
      points.push({ x, m });
      if (Math.abs(m) > maxM) maxM = Math.abs(m);
    }

    const scaleY = (m: number) => yBaseline + (m / maxM) * 35;

    let pathD = `M ${toPixelX(0)} ${yBaseline}`;
    points.forEach(pt => {
      pathD += ` L ${toPixelX(pt.x)} ${scaleY(pt.m)}`;
    });
    pathD += ` L ${toPixelX(length)} ${yBaseline} Z`;

    // Shade area between xA and xB
    const shadePoints = points.filter(pt => pt.x >= xA - 1e-4 && pt.x <= xB + 1e-4);
    let shadeD = '';
    if (shadePoints.length > 0) {
      shadeD = `M ${pxA} ${yBaseline}`;
      shadePoints.forEach(pt => {
        shadeD += ` L ${toPixelX(pt.x)} ${scaleY(pt.m)}`;
      });
      shadeD += ` L ${pxB} ${yBaseline} Z`;
    }

    // Centroid coordinate
    const centroidX = (xA + xB) / 2;
    const centroidPx = toPixelX(centroidX);
    const centroidPy = scaleY(getMAt(centroidX)) - 14;

    return (
      <div className="mt-3 mb-2 overflow-hidden rounded-lg border border-border/30 bg-muted/5 p-3 w-full max-w-lg">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full select-none overflow-visible">
          {/* M/EI Diagram */}
          <line x1={paddingX} y1={yBaseline} x2={width - paddingX} y2={yBaseline} stroke="var(--muted-foreground)" strokeWidth={1} opacity={0.4} />
          <path d={pathD} fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.3} />
          {shadeD && <path d={shadeD} fill="rgba(59, 130, 246, 0.15)" stroke="var(--primary)" strokeWidth={1.2} />}

          {/* Centroid marker */}
          <g>
            <circle cx={centroidPx} cy={centroidPy} r={4} fill="var(--primary)" />
            <line x1={centroidPx - 5} y1={centroidPy} x2={centroidPx + 5} y2={centroidPy} stroke="var(--primary)" strokeWidth={1} />
            <line x1={centroidPx} y1={centroidPy - 5} x2={centroidPx} y2={centroidPy + 5} stroke="var(--primary)" strokeWidth={1} />
          </g>

          {/* Centroid lever arm x-bar */}
          <line x1={centroidPx} y1={yBaseline - 18} x2={pxB} y2={yBaseline - 18} stroke="var(--primary)" strokeWidth={1} strokeDasharray="2,2" />
          <circle cx={centroidPx} cy={yBaseline - 18} r={1.5} fill="var(--primary)" />
          <circle cx={pxB} cy={yBaseline - 18} r={1.5} fill="var(--primary)" />
          <text x={(centroidPx + pxB) / 2} y={yBaseline - 22} textAnchor="middle" className="fill-primary text-[11px] font-bold">x-bar</text>
        </svg>
      </div>
    );
  }

  // Fallback / default: Render deflection curve and Mohr's tangent line on top of MiniBeamVisual
  const handleRenderOverlay = (toPixel: (x: number) => number) => {
    const yBeam = 70;
    const pxA = toPixel(xA);
    const pxB = toPixel(xB);
    const beamSegmentW = pxB - pxA;
    const thetaAngle = 0.04; // radians
    const dyB = beamSegmentW * Math.tan(thetaAngle);

    return (
      <g>
        {/* Deflected shape Q-curve */}
        <path
          d={`M ${pxA} ${yBeam} Q ${(pxA + pxB) / 2} ${yBeam + 30} ${pxB} ${yBeam}`}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={1.8}
        />

        {/* Tangent line at support A */}
        <line
          x1={pxA}
          y1={yBeam}
          x2={pxB + 20}
          y2={yBeam + dyB + 0.8}
          stroke="var(--primary)"
          strokeWidth={1.2}
          strokeDasharray="4,2"
        />

        {/* Tangential deviation t_{B/A} vertical dimension line */}
        {isDeviation && (
          <g>
            <line
              x1={pxB}
              y1={yBeam}
              x2={pxB}
              y2={yBeam + dyB}
              stroke="var(--destructive)"
              strokeWidth={1.5}
            />
            <polygon points={`${pxB},${yBeam} ${pxB - 3},${yBeam + 4} ${pxB + 3},${yBeam + 4}`} fill="var(--destructive)" />
            <polygon points={`${pxB},${yBeam + dyB} ${pxB - 3},${yBeam + dyB - 4} ${pxB + 3},${yBeam + dyB - 4}`} fill="var(--destructive)" />
            <text
              x={pxB + 8}
              y={yBeam + dyB / 2 + 4}
              textAnchor="start"
              className="fill-destructive text-[11px] font-bold select-none"
            >
              t_B/A
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <MiniBeamVisual
      onRenderOverlay={handleRenderOverlay}
    />
  );
};
