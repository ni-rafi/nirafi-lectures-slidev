import React, { useRef } from 'react';
import { useBeamWorkspace } from '../../context/BeamWorkspaceContext';
import { useBeamEngine } from '../../hooks/useBeamEngine';
import { useBeamDragging } from '../../hooks/useBeamDragging';
import { formatForce, formatMoment } from '../../utils/chartUtils';
import { CanvasBeamMember } from './CanvasBeamMember';
import { CanvasSupports } from './CanvasSupports';
import { CanvasReleases } from './CanvasReleases';
import { CanvasLoads } from './CanvasLoads';
import { DimensionChain } from './DimensionChain';

export const BeamCanvas: React.FC = () => {
  const {
    length,
    supports,
    releases,
    loads,
    eiSegments,
    selectedId,
    hoverX,
    setSelectedId,
    updateSupport,
    updateRelease,
    updateLoad,
    setHoverX,
  } = useBeamWorkspace();

  const { solverResult } = useBeamEngine();

  // Sort supports by position and assign corresponding letters
  const sortedSupports = [...supports].sort((a, b) => a.position - b.position);
  const supportIdToLetter = new Map<string, string>();
  sortedSupports.forEach((s, idx) => {
    const letter = String.fromCharCode(65 + idx); // A, B, C...
    supportIdToLetter.set(s.id, letter);
  });

  const svgRef = useRef<SVGSVGElement>(null);

  // SVG Coordinates constants
  const paddingX = 60;
  const width = 800;
  const beamW = width - paddingX * 2; // 680px
  const yBeam = 80; // Adjusted from 100 to 80 to give more space below

  const toPixel = (pos: number) => paddingX + (pos / length) * beamW;
  const toMeter = (pixel: number) => {
    const raw = ((pixel - paddingX) / beamW) * length;
    return Math.max(0, Math.min(length, parseFloat(raw.toFixed(2))));
  };

  const getBeamThicknessAt = (x: number) => {
    const seg = eiSegments.find(s => x >= s.startPosition && x <= s.endPosition);
    if (!seg) return 12;
    const EI = seg.E * seg.I;
    return Math.max(12, Math.min(32, 12 + (EI / 100000) * 16));
  };

  const {
    wasDraggingRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useBeamDragging({
    length,
    loads,
    beamW,
    toMeter,
    setSelectedId,
    updateSupport,
    updateRelease,
    updateLoad,
    setHoverX,
    svgRef,
  });

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interactive Beam Workspace</div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} 205`} // Adjusted height to 205 for a more compact workspace
        className="w-full select-none overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => {
          wasDraggingRef.current = false;
        }}
        onClick={() => {
          if (wasDraggingRef.current) {
            wasDraggingRef.current = false;
            return;
          }
          setSelectedId(null);
        }}
      >
        {/* Render segmented beam member */}
        <CanvasBeamMember
          eiSegments={eiSegments}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          toPixel={toPixel}
          yBeam={yBeam}
        />

        {/* Render Supports */}
        <CanvasSupports
          supports={supports}
          selectedId={selectedId}
          toPixel={toPixel}
          yBeam={yBeam}
          length={length}
          supportIdToLetter={supportIdToLetter}
          handleMouseDown={handleMouseDown}
          solverResult={solverResult}
          formatForce={formatForce}
          formatMoment={formatMoment}
        />

        {/* Render Internal Releases */}
        <CanvasReleases
          releases={releases}
          selectedId={selectedId}
          toPixel={toPixel}
          yBeam={yBeam}
          handleMouseDown={handleMouseDown}
        />

        {/* Render Loads */}
        <CanvasLoads
          loads={loads}
          selectedId={selectedId}
          toPixel={toPixel}
          yBeam={yBeam}
          handleMouseDown={handleMouseDown}
          getBeamThicknessAt={getBeamThicknessAt}
        />

        {/* Dimension ticks and length grid */}
        <DimensionChain
          length={length}
          supports={supports}
          releases={releases}
          loads={loads}
          eiSegments={eiSegments}
          toPixel={toPixel}
          yBeam={yBeam}
          getBeamThicknessAt={getBeamThicknessAt}
          setSelectedId={setSelectedId}
        />

        {/* Hover Crosshair Sync */}
        {hoverX !== null && (
          <g>
            <line
              x1={toPixel(hoverX)}
              y1={20}
              x2={toPixel(hoverX)}
              y2={135} // Matches the dimension chain baseline
              stroke="var(--primary)"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.65}
            />
            <circle
              cx={toPixel(hoverX)}
              cy={yBeam}
              r={4}
              fill="var(--primary)"
              opacity={0.8}
            />
          </g>
        )}
      </svg>
    </div>
  );
};
