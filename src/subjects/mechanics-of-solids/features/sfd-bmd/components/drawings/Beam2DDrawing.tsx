import React from 'react';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';

interface Beam2DDrawingProps {
  beam: IBeam;
  showReactions?: boolean;
  resolvedReactions?: boolean;
  reactionAVal?: string | number;
  reactionBVal?: string | number;
  showDiscontinuities?: boolean;
  showZones?: boolean;
  showSections?: boolean;
  activeStep?: number;
}

export const Beam2DDrawing: React.FC<Beam2DDrawingProps> = ({
  beam,
  showReactions = false,
  resolvedReactions = false,
  reactionAVal,
  reactionBVal,
  showDiscontinuities = false,
  showZones = false,
  showSections = false,
  activeStep = 99,
}) => {
  const scale = 360 / beam.length;
  const getSvgX = (x: number) => 70 + x * scale;

  // Collect key coordinates for dimension chain
  const keyCoords = Array.from(
    new Set([
      0,
      ...beam.supports.map((s) => s.position),
      ...beam.loads.map((l) => l.position ?? 0),
      ...beam.loads.map((l) => l.startPosition ?? 0),
      ...beam.loads.map((l) => l.endPosition ?? 0),
      beam.length,
    ])
  ).sort((a, b) => a - b);

  return (
    <div className="w-full flex flex-col items-center py-2 select-none select-none">
      <svg className="w-full max-w-[500px] h-[190px] overflow-visible" viewBox="0 0 500 190">
        {/* Support lines/ground baseline */}
        <line x1="40" y1="76" x2="460" y2="76" className="stroke-slate-300 dark:stroke-slate-700/60" strokeWidth="1" strokeDasharray="3 3" />

        {/* 1. DISCONTINUITY DASHED LINES */}
        {showDiscontinuities && activeStep >= 1 && (
          <g className="animate-in fade-in duration-300">
            {keyCoords.filter((_, idx) => activeStep >= 99 || idx < activeStep).map((x) => (
              <g key={`disc-${x}`}>
                <line x1={getSvgX(x)} y1="15" x2={getSvgX(x)} y2="80" className="stroke-indigo-500/50" strokeWidth="1" strokeDasharray="3 3" />
                <text x={getSvgX(x)} y="12" textAnchor="middle" className="text-[8px] font-mono fill-indigo-500">x = {x}m</text>
              </g>
            ))}
          </g>
        )}

        {/* 2. ZONE LABELS */}
        {showZones && activeStep >= 2 && (
          <g className="animate-in fade-in duration-300">
            {keyCoords.slice(0, -1).map((x, idx) => {
              const nextX = keyCoords[idx + 1]!;
              const midSegmentX = getSvgX((x + nextX) / 2);
              const labelWidth = (nextX - x) * scale - 6;
              const color = idx === 0 ? '#4f46e5' : idx === 1 ? '#3b82f6' : '#10b981';
              return (
                <g key={`zone-${idx}`}>
                  <rect x={getSvgX(x) + 3} y="15" width={labelWidth} height="16" rx="3" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1" />
                  <text x={midSegmentX} y="26" textAnchor="middle" className="text-[7.5px] font-black font-mono" fill={color}>
                    Zone {idx + 1}: {x} &le; x &lt; {nextX} m
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 3. BEAM MEMBER */}
        <rect x="70" y="48" width="360" height="12" rx="2" className="fill-slate-200 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-650" strokeWidth="1.5" />

        {/* 4. SUPPORTS */}
        {beam.supports.map((s, idx) => {
          const xVal = getSvgX(s.position);
          const labelLetter = idx === 0 ? 'A' : 'B';
          const defaultReaction = beam.loads[0] && beam.loads[0].magnitude !== undefined ? (beam.loads[0].magnitude / 2).toFixed(1) : 'R';
          const valA = reactionAVal ?? (resolvedReactions ? `${defaultReaction} kN` : `R_A`);
          const valB = reactionBVal ?? (resolvedReactions ? `${defaultReaction} kN` : `R_B`);
          const val = labelLetter === 'A' ? valA : valB;

          return (
            <g key={s.id}>
              {s.type === 'hinge' ? (
                <g>
                  <polygon points={`${xVal - 8},75 ${xVal},60 ${xVal + 8},75`} className="fill-slate-400 dark:fill-slate-500 stroke-slate-500" strokeWidth="1" />
                  <line x1={xVal - 12} y1="75" x2={xVal + 12} y2="75" className="stroke-slate-500" strokeWidth="1.2" />
                </g>
              ) : (
                <g>
                  <polygon points={`${xVal - 8},71 ${xVal},60 ${xVal + 8},71`} className="fill-slate-400 dark:fill-slate-500 stroke-slate-500" strokeWidth="1" />
                  <circle cx={xVal - 4} cy="73.5" r="2" className="fill-slate-400 dark:fill-slate-500" />
                  <circle cx={xVal + 4} cy="73.5" r="2" className="fill-slate-400 dark:fill-slate-500" />
                  <line x1={xVal - 12} y1="75.5" x2={xVal + 12} y2="75.5" className="stroke-slate-500" strokeWidth="1.2" />
                </g>
              )}
              {/* Support labels A / B */}
              <text x={xVal} y="44" textAnchor="middle" className="text-[10px] font-black fill-slate-500">{s.id}</text>

              {/* Reaction Force Vectors */}
              {showReactions && (
                <g className="animate-in fade-in duration-300">
                  <path d={`M ${xVal},112 L ${xVal},80 M ${xVal - 3.5},86 L ${xVal},80 L ${xVal + 3.5},86`} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <foreignObject x={labelLetter === 'A' ? xVal + 7 : xVal - 67} y="82" width="60" height="20">
                    <div className={`text-[9px] font-mono font-bold text-emerald-500 dark:text-emerald-400 leading-none ${labelLetter === 'A' ? 'text-left' : 'text-right'}`}>
                      {labelLetter === 'A' ? (
                        <>R<sub>A</sub> = {val}</>
                      ) : (
                        <>R<sub>B</sub> = {val}</>
                      )}
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          );
        })}

        {/* 5. LOADS */}
        {beam.loads.map((l) => {
          if (l.type === 'point') {
            const xVal = getSvgX(l.position ?? beam.length / 2);
            return (
              <g key={l.id}>
                {/* Arrow */}
                <path d={`M ${xVal},16 L ${xVal},46 M ${xVal - 4},40 L ${xVal},46 L ${xVal + 4},40`} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x={xVal - 6} y="26" textAnchor="end" className="text-[9px] font-black fill-rose-500 font-mono">{l.id} = {l.magnitude ?? 0} kN</text>
              </g>
            );
          } else if (l.type === 'udl') {
            const xStart = getSvgX(l.startPosition ?? 0);
            const xEnd = getSvgX(l.endPosition ?? beam.length);
            const segmentsCount = 4;
            const wSegment = (xEnd - xStart) / segmentsCount;
            
            return (
              <g key={l.id}>
                {/* UDL Arcs */}
                <path
                  d={Array.from({ length: segmentsCount }).map((_, i) => {
                    const start = xStart + i * wSegment;
                    const end = start + wSegment;
                    const ctrlX = start + wSegment / 2;
                    return `M ${start},46 Q ${ctrlX},32 ${end},46`;
                  }).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* UDL Down Arrows */}
                {Array.from({ length: segmentsCount * 2 + 1 }).map((_, i) => {
                  const xArrow = xStart + (i * wSegment) / 2;
                  return (
                    <g key={i} className="stroke-emerald-500" strokeWidth="1">
                      <line x1={xArrow} y1="41" x2={xArrow} y2="47" />
                      <path d={`M ${xArrow - 2.5},44 L ${xArrow},47 L ${xArrow + 2.5},44`} fill="none" strokeLinejoin="round" />
                    </g>
                  );
                })}
                <text x={(xStart + xEnd) / 2} y="26" textAnchor="middle" className="text-[9.5px] font-black fill-emerald-600 dark:fill-emerald-400 font-mono">
                  {l.id} = {l.magnitude ?? 0} kN/m
                </text>
              </g>
            );
          }
          return null;
        })}

        {/* 6. SECTION CUTS */}
        {showSections && activeStep >= 3 && (
          <g className="animate-in fade-in duration-300">
            {keyCoords.slice(0, -1).map((x, idx) => {
              const nextX = keyCoords[idx + 1]!;
              const sectionX = getSvgX((x + nextX) / 2);
              return (
                <g key={`sec-${idx}`}>
                  <line x1={sectionX} y1="36" x2={sectionX} y2="76" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx={sectionX} cy="54" r="4.5" className="fill-red-500/10 stroke-red-500" strokeWidth="1" />
                  <text x={sectionX} y="87" textAnchor="middle" className="text-[8px] font-black fill-rose-500 font-mono">Section {idx + 1}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* 7. DIMENSION LINE CHAINS */}
        <g className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="0.8">
          <line x1="70" y1="125" x2="430" y2="125" />
          {keyCoords.map((x) => (
            <line key={`tick-${x}`} x1={getSvgX(x)} y1="121" x2={getSvgX(x)} y2="129" />
          ))}
          {/* Dimension arrows inside each segment */}
          {keyCoords.slice(0, -1).map((x, idx) => {
            const nextX = keyCoords[idx + 1]!;
            const start = getSvgX(x);
            const end = getSvgX(nextX);
            return (
              <g key={`arrow-${idx}`} className="stroke-slate-400 dark:stroke-slate-650" strokeWidth="0.8">
                <path d={`M ${start + 5},121 L ${start},125 L ${start + 5},129`} fill="none" />
                <path d={`M ${end - 5},121 L ${end},125 L ${end - 5},129`} fill="none" />
              </g>
            );
          })}
        </g>
        {keyCoords.slice(0, -1).map((x, idx) => {
          const nextX = keyCoords[idx + 1]!;
          const midSegmentX = getSvgX((x + nextX) / 2);
          return (
            <text key={`dim-text-${idx}`} x={midSegmentX} y="137" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
              {nextX - x} m
            </text>
          );
        })}
      </svg>
    </div>
  );
};
export default Beam2DDrawing;
