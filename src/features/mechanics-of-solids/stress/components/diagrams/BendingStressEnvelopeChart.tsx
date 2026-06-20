import React, { useRef } from 'react';
import { useBeamWorkspace } from '../../../sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '../../../sfd-bmd/hooks/useBeamEngine';
import { StressSolverEngine } from '@/cores/mechanics-of-solids/stress/stress-solver.engine';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';

export const BendingStressEnvelopeChart: React.FC = () => {
  const { length, hoverX, setHoverX, eiSegments } = useBeamWorkspace();
  const { solverResult } = useBeamEngine();
  const svgRef = useRef<SVGSVGElement>(null);

  if (!solverResult.success || !solverResult.intervals) return null;

  const allCustom = eiSegments.every(s => !s.shape || s.shape.type === 'custom');
  if (allCustom) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-500 backdrop-blur-md flex gap-2.5 items-start">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold uppercase tracking-wider text-[9px]">Bending Stress Envelope Unavailable</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            Please define a rectangular, circular, or flanged section template in the Cross-Section Builder to enable bending stress envelopes.
          </p>
        </div>
      </div>
    );
  }

  const paddingX = 60;
  const width = 800;
  const height = 150;
  const chartW = width - paddingX * 2;
  const midY = height / 2;

  const toPixelX = (x: number) => paddingX + (x / length) * chartW;
  const toMeterX = (pixel: number) => ((pixel - paddingX) / chartW) * length;

  // Evaluate M at any x
  const getMAt = (x: number): number => {
    const interval = solverResult.intervals.find(
      inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4
    );
    if (!interval) return 0;
    const [a, b, c, d] = interval.mCoeffs;
    return a * x * x * x + b * x * x + c * x + d;
  };

  // Evaluate V at any x
  const getVAt = (x: number): number => {
    const interval = solverResult.intervals.find(
      inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4
    );
    if (!interval) return 0;
    const [a, b, c] = interval.vCoeffs;
    return a * x * x + b * x + c;
  };

  // Calculate envelopes
  const numPoints = 80;
  const dataPoints: { x: number; maxT: number; maxC: number }[] = [];
  let maxAbsStress = 1e-4; // in Pa for scaling

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * length;
    const seg = eiSegments.find(s => x >= s.startPosition - 1e-4 && x <= s.endPosition + 1e-4) || eiSegments[0]!;
    const shape = seg.shape ?? { type: 'custom' };
    const M = getMAt(x) * 1000;
    const V = getVAt(x) * 1000;

    if (shape.type === 'custom') {
      dataPoints.push({ x, maxT: 0, maxC: 0 });
    } else {
      const res = StressSolverEngine.solveDistribution(shape, M, V, seg.I * 1e-6);
      dataPoints.push({ x, maxT: res.maxBendingTension, maxC: res.maxBendingCompression });

      if (Math.abs(res.maxBendingTension) > maxAbsStress) maxAbsStress = Math.abs(res.maxBendingTension);
      if (Math.abs(res.maxBendingCompression) > maxAbsStress) maxAbsStress = Math.abs(res.maxBendingCompression);
    }
  }

  const scaleY = 55 / maxAbsStress;

  // Paths
  let tensionAreaD = `M ${toPixelX(0)} ${midY}`;
  let tensionLineD = '';
  let compressionAreaD = `M ${toPixelX(0)} ${midY}`;
  let compressionLineD = '';

  dataPoints.forEach((pt, idx) => {
    const px = toPixelX(pt.x);
    const pyTension = midY - pt.maxT * scaleY;
    const pyCompression = midY - pt.maxC * scaleY; // pt.maxC is negative

    tensionAreaD += ` L ${px} ${pyTension}`;
    compressionAreaD += ` L ${px} ${pyCompression}`;

    if (idx === 0) {
      tensionLineD = `M ${px} ${pyTension}`;
      compressionLineD = `M ${px} ${pyCompression}`;
    } else {
      tensionLineD += ` L ${px} ${pyTension}`;
      compressionLineD += ` L ${px} ${pyCompression}`;
    }
  });

  tensionAreaD += ` L ${toPixelX(length)} ${midY} Z`;
  compressionAreaD += ` L ${toPixelX(length)} ${midY} Z`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const xMeter = Math.max(0, Math.min(length, toMeterX(clientX)));
    setHoverX(parseFloat(xMeter.toFixed(2)));
  };

  // Hover data
  let hoverData = null;
  if (hoverX !== null) {
    const seg = eiSegments.find(s => hoverX >= s.startPosition - 1e-4 && hoverX <= s.endPosition + 1e-4) || eiSegments[0]!;
    const shape = seg.shape ?? { type: 'custom' };
    if (shape.type !== 'custom') {
      const M = getMAt(hoverX) * 1000;
      const V = getVAt(hoverX) * 1000;
      const res = StressSolverEngine.solveDistribution(shape, M, V, seg.I * 1e-6);

      const px = toPixelX(hoverX);
      const pyT = midY - res.maxBendingTension * scaleY;
      const pyC = midY - res.maxBendingCompression * scaleY;

      hoverData = {
        x: hoverX,
        maxT: res.maxBendingTension / 1e6, // MPa
        maxC: res.maxBendingCompression / 1e6, // MPa
        px: (px / width) * 100,
        py: ((pyT + pyC) / 2 / height) * 100,
        pxNum: px,
        pyTNum: pyT,
        pyCNum: pyC,
      };
    }
  }

  const getBendingCriticalPoints = () => {
    const xCoords = Array.from(new Set([
      0,
      length,
      ...solverResult.criticalPoints.map(cp => cp.x),
      ...eiSegments.map(s => s.startPosition),
      ...eiSegments.map(s => s.endPosition),
    ])).sort((a, b) => a - b);

    const filteredX: number[] = [];
    xCoords.forEach(x => {
      if (x < 0 || x > length) return;
      const last = filteredX[filteredX.length - 1];
      if (last === undefined || Math.abs(x - last) > 0.3) {
        filteredX.push(x);
      }
    });

    const cps: { x: number; maxT: number; maxC: number }[] = [];
    filteredX.forEach(x => {
      const seg = eiSegments.find(s => x >= s.startPosition - 1e-4 && x <= s.endPosition + 1e-4) || eiSegments[0]!;
      const shape = seg.shape ?? { type: 'custom' };
      if (shape.type !== 'custom') {
        const M = getMAt(x) * 1000;
        const V = getVAt(x) * 1000;
        const res = StressSolverEngine.solveDistribution(shape, M, V, seg.I * 1e-6);
        cps.push({
          x,
          maxT: res.maxBendingTension,
          maxC: res.maxBendingCompression,
        });
      }
    });
    return cps;
  };

  const bendingCriticalPoints = getBendingCriticalPoints();

  return (
    <div className="relative w-full rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Normal Bending Stress Envelope (σ) - MPa
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverX(null)}
        >
          <defs>
            <linearGradient id="bendTensionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="bendCompressionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={midY - 40} x2={paddingX + chartW} y2={midY - 40} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />
          <line x1={paddingX} y1={midY + 40} x2={paddingX + chartW} y2={midY + 40} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />

          {/* Baseline */}
          <line x1={paddingX} y1={midY} x2={paddingX + chartW} y2={midY} stroke="var(--border)" strokeWidth={1.5} />

          {/* Tension Shading (Positive / Green) */}
          <path d={tensionAreaD} fill="url(#bendTensionGrad)" />
          <path d={tensionLineD} fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Compression Shading (Negative / Blue) */}
          <path d={compressionAreaD} fill="url(#bendCompressionGrad)" />
          <path d={compressionLineD} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Critical points labels */}
          {bendingCriticalPoints.map((cp, idx) => {
            const px = toPixelX(cp.x);
            const pyT = midY - cp.maxT * scaleY;
            const pyC = midY - cp.maxC * scaleY;
            
            const showT = Math.abs(cp.maxT) > 1e3;
            const showC = Math.abs(cp.maxC) > 1e3;

            return (
              <g key={idx} opacity={0.85}>
                {/* Baseline x tick */}
                <line x1={px} y1={midY - 3} x2={px} y2={midY + 3} stroke="var(--border)" strokeWidth={1} />
                <text x={px} y={midY + 14} textAnchor="middle" className="fill-muted-foreground/60 text-[9px]">
                  {cp.x.toFixed(1)}m
                </text>

                {showT && (
                  <g>
                    <circle cx={px} cy={pyT} r={3} className="fill-emerald-500 stroke-background" strokeWidth={0.8} />
                    <text
                      x={px}
                      y={pyT - 8}
                      textAnchor="middle"
                      className="fill-emerald-500 text-[10px] font-bold"
                    >
                      +{(cp.maxT / 1e6).toFixed(1)}
                    </text>
                  </g>
                )}

                {showC && (
                  <g>
                    <circle cx={px} cy={pyC} r={3} className="fill-blue-500 stroke-background" strokeWidth={0.8} />
                    <text
                      x={px}
                      y={pyC + 14}
                      textAnchor="middle"
                      className="fill-blue-500 text-[10px] font-bold"
                    >
                      {(cp.maxC / 1e6).toFixed(1)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Hover indicator lines and dots */}
          {hoverData && (
            <g>
              <line
                x1={hoverData.pxNum}
                y1={10}
                x2={hoverData.pxNum}
                y2={height - 10}
                stroke="var(--muted-foreground)"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.6}
              />
              <circle cx={hoverData.pxNum} cy={hoverData.pyTNum} r={4} fill="#10b981" />
              <circle cx={hoverData.pxNum} cy={hoverData.pyCNum} r={4} fill="#3b82f6" />
            </g>
          )}
        </svg>

        {/* HTML Tooltip Box */}
        <AnimatePresence>
          {hoverData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute pointer-events-none rounded-xl border border-border/80 bg-background/85 px-3 py-2 text-left shadow-lg backdrop-blur-md z-30"
              style={{
                left: `${hoverData.px}%`,
                top: `${hoverData.py}%`,
                transform: `translate(${hoverData.px > 80 ? '-110%' : '15px'}, -50%)`,
              }}
            >
              <div className="text-[10px] font-semibold text-muted-foreground">Coordinate: {hoverData.x} m</div>
              <div className="text-xs font-bold text-emerald-500">
                Max Tension: +{hoverData.maxT.toFixed(2)} MPa
              </div>
              <div className="text-xs font-bold text-blue-500">
                Max Compression: {hoverData.maxC.toFixed(2)} MPa
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
