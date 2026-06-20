import React, { useRef } from 'react';
import { useBeamWorkspace } from '../../../sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '../../../sfd-bmd/hooks/useBeamEngine';
import { CrossSectionEngine } from '@/cores/mechanics-of-solids/stress/cross-section.engine';
import { StressSolverEngine } from '@/cores/mechanics-of-solids/stress/stress-solver.engine';
import { StaticalMomentEngine } from '@/cores/mechanics-of-solids/stress/statical-moment.engine';
import { IStressPoint } from '@/cores/mechanics-of-solids/stress/stress.interface';
import { Info } from 'lucide-react';

export const StressGradientProfile: React.FC = () => {
  const { length, hoverX, customInspectX, inspectY, setInspectY, eiSegments } = useBeamWorkspace();
  const { solverResult } = useBeamEngine();
  const svgRef = useRef<SVGSVGElement>(null);

  if (!solverResult.success || !solverResult.intervals) return null;

  // Active longitudinal coordinate X
  const inspectX = hoverX !== null ? hoverX : (customInspectX !== null ? customInspectX : length / 2);

  // Find active segment, shape and internal forces at inspectX
  const seg = eiSegments.find(s => inspectX >= s.startPosition - 1e-4 && inspectX <= s.endPosition + 1e-4) || eiSegments[0]!;
  const shape = seg.shape ?? { type: 'custom' };

  if (shape.type === 'custom') {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-xs text-amber-500 backdrop-blur-md flex gap-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold uppercase tracking-wider text-[10px]">Stress Distribution Analysis Disabled</p>
          <p className="mt-1 text-muted-foreground text-[10px] leading-relaxed">
            2D Cross-section stress distributions cannot be computed for segments using **Custom (Manual I)** stiffness properties. 
            Please select a Rectangular, Circular, or Flanged section profile in the Cross-Section Builder to enable stress analysis.
          </p>
        </div>
      </div>
    );
  }

  const getMAt = (x: number): number => {
    const interval = solverResult.intervals!.find(
      inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4
    );
    if (!interval) return 0;
    const [a, b, c, d] = interval.mCoeffs;
    return a * x * x * x + b * x * x + c * x + d;
  };

  const getVAt = (x: number): number => {
    const interval = solverResult.intervals!.find(
      inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4
    );
    if (!interval) return 0;
    const [a, b, c] = interval.vCoeffs;
    return a * x * x + b * x + c;
  };

  const M = getMAt(inspectX) * 1000;
  const V = getVAt(inspectX) * 1000;

  const res = StressSolverEngine.solveDistribution(shape, M, V, seg.I * 1e-6);
  const props = CrossSectionEngine.calculateProperties(shape, seg.I * 1e-6);

  const H = shape.type === 'circular' ? (shape.diameter ?? 0.1) : (shape.height ?? 0.2);
  const ybar = props.centroid;

  // SVG dimensions
  const width = 360;
  const height = 150;
  const paddingY = 20;
  const chartH = height - paddingY * 2; // 110px

  // Y Coordinate mappings (relative to NA in meters -> pixel coordinate)
  const toPixelY = (yNA: number) => paddingY + (1 - (yNA + ybar) / H) * chartH;
  const toMeterY = (py: number) => (1 - (py - paddingY) / chartH) * H - ybar;

  // Max stress magnitudes for scaling
  const maxSigma = Math.max(1e-3, Math.abs(res.maxBendingTension), Math.abs(res.maxBendingCompression));
  const maxTau = Math.max(1e-3, res.maxShear);

  // Horizontal layout positions
  const xSection = 45;
  const xBending = 160;
  const xShear = 280;

  // Cross section shape coordinate mapping
  const W = shape.type === 'circular' ? (shape.diameter ?? 0.15) : (shape.width ?? 0.12);
  const shapeW = 40; // width of section drawing in pixels
  const scaleX = shapeW / W;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientY = e.clientY - rect.top;
    // Map clientY to y relative to neutral axis
    const yMeter = Math.max(-ybar, Math.min(H - ybar, toMeterY(clientY)));
    setInspectY(parseFloat((yMeter * 1000).toFixed(1))); // Store in mm
  };

  // Stress at inspectY
  const inspectYMeters = inspectY / 1000;
  const pyInspect = toPixelY(inspectYMeters);

  // Solve exact stresses at inspectY
  const getStressAtInspectY = () => {
    const sigma = props.I > 1e-12 ? -(M * inspectYMeters) / props.I : 0;
    const statQ = StaticalMomentEngine.calculateQAndWidth(shape, inspectYMeters, props);
    const tau = props.I > 1e-12 && statQ.t > 1e-6 ? (V * statQ.Q) / (props.I * statQ.t) : 0;
    return { sigma: sigma / 1e6, tau: tau / 1e6, b: statQ.t * 1000 }; // in MPa and mm
  };

  const currentStresses = getStressAtInspectY();

  // Solve top and bottom fiber bending stresses
  const sigmaTop = props.I > 1e-12 ? -(M * (H - ybar)) / props.I : 0;
  const sigmaBottom = props.I > 1e-12 ? -(M * (-ybar)) / props.I : 0;
  const sigmaTopMPa = sigmaTop / 1e6;
  const sigmaBottomMPa = sigmaBottom / 1e6;
  const pxTop = xBending + (sigmaTop / maxSigma) * 30;
  const pxBottom = xBending + (sigmaBottom / maxSigma) * 30;

  // Solve peak shear stress
  const maxTauPoint = res.points.reduce((max, p) => Math.abs(p.tau) > Math.abs(max.tau) ? p : max, res.points[0]!);
  const maxTauMPa = maxTauPoint.tau / 1e6;
  const pxMaxTau = xShear + (maxTauPoint.tau / maxTau) * 30;
  const pyMaxTau = toPixelY(maxTauPoint.y);

  // Bending stress path & area
  let bendPath = '';
  let bendingAreaPath = `M ${xBending} ${toPixelY(res.points[0]!.y)}`;
  res.points.forEach((pt: IStressPoint, idx: number) => {
    const px = xBending + (pt.sigma / maxSigma) * 30; // max width 30px
    const py = toPixelY(pt.y);
    bendPath += `${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
    bendingAreaPath += ` L ${px} ${py}`;
  });
  bendingAreaPath += ` L ${xBending} ${toPixelY(res.points[res.points.length - 1]!.y)} Z`;

  // Shear stress path (drawn as polygon shaded from baseline xShear)
  let shearCurvePath = '';
  let shearAreaPath = `M ${xShear} ${toPixelY(res.points[0]!.y)}`;
  res.points.forEach((pt: IStressPoint, idx: number) => {
    const px = xShear + (pt.tau / maxTau) * 30;
    const py = toPixelY(pt.y);
    shearCurvePath += `${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
    shearAreaPath += ` L ${px} ${py}`;
  });
  shearAreaPath += ` L ${xShear} ${toPixelY(res.points[res.points.length - 1]!.y)} Z`;

  const W_top = shape.type === 'circular' ? (shape.diameter ?? 0.15) : (shape.width ?? 0.15);
  const W_bot = (shape.type === 'i-beam' || shape.type === 'channel') ? (shape.widthBottom ?? W_top) : W_top;
  
  const tf_top = shape.thicknessFlange ?? 0.01;
  const tf_bot = (shape.type === 'i-beam' || shape.type === 'channel') ? (shape.thicknessFlangeBottom ?? tf_top) : tf_top;
  const tw = shape.thicknessWeb ?? (shape.type === 't-beam' ? 0.008 : 0.006);
  const d = shape.diameter ?? 0.1;

  const maxW = Math.max(W_top, W_bot);
  const maxWPx = maxW * scaleX;
  const wTopPx = W_top * scaleX;
  const wBotPx = W_bot * scaleX;
  
  const px0Top = shape.type === 'channel' ? (xSection - maxWPx / 2) : (xSection - wTopPx / 2);
  const px0Bot = shape.type === 'channel' ? (xSection - maxWPx / 2) : (xSection - wBotPx / 2);
  const px0Web = shape.type === 'channel' ? (xSection - maxWPx / 2) : (shape.type === 'i-beam' ? xSection - (tw * scaleX) / 2 : px0Top);

  const leftEdge = Math.min(px0Top, px0Bot);
  const rightEdge = xSection + maxWPx / 2;
  const py0 = paddingY;
  const py1 = paddingY + chartH;

  // Draw 2D shape in profile SVG box
  const renderProfileShape = () => {
    const tfTopPx = tf_top * scaleX;
    const tfBotPx = tf_bot * scaleX;
    const twPx = tw * scaleX;
    const dPx = d * scaleX;

    switch (shape.type) {
      case 'rectangular':
        return <rect x={xSection - wTopPx / 2} y={py0} width={wTopPx} height={chartH} className="fill-primary/10 stroke-muted-foreground" strokeWidth={1} />;
      case 'circular':
        return <circle cx={xSection} cy={height / 2} r={diaPxToRadius(dPx)} className="fill-primary/10 stroke-muted-foreground" strokeWidth={1} />;
      case 'i-beam':
      case 'channel':
        return (
          <g>
            {/* Top Flange */}
            <rect x={px0Top} y={py0} width={wTopPx} height={tfTopPx} className="fill-primary/10 stroke-muted-foreground" strokeWidth={1} />
            {/* Bottom Flange */}
            <rect x={px0Bot} y={py0 + chartH - tfBotPx} width={wBotPx} height={tfBotPx} className="fill-primary/10 stroke-muted-foreground" strokeWidth={1} />
            {/* Web */}
            <rect
              x={px0Web}
              y={py0 + tfTopPx - 0.2}
              width={twPx}
              height={chartH - tfTopPx - tfBotPx + 0.4}
              className="fill-primary/10 stroke-muted-foreground"
              strokeWidth={1}
            />
          </g>
        );
      case 't-beam':
        return (
          <g>
            <rect x={px0Top} y={py0} width={wTopPx} height={tfTopPx} className="fill-primary/10 stroke-muted-foreground" strokeWidth={1} />
            <rect x={xSection - twPx / 2} y={py0 + tfTopPx - 0.2} width={twPx} height={chartH - tfTopPx + 0.2} className="fill-primary/10 stroke-muted-foreground" strokeWidth={1} />
          </g>
        );
      default:
        return <line x1={xSection} y1={py0} x2={xSection} y2={py0 + chartH} stroke="var(--foreground)" strokeWidth={3} />;
    }
  };

  const diaPxToRadius = (dPx: number) => Math.min(chartH / 2, dPx / 2);

  // Exact coordinates for labels
  const pxBendingDot = xBending + (currentStresses.sigma * 1e6 / maxSigma) * 30;
  const pxShearDot = xShear + (currentStresses.tau * 1e6 / maxTau) * 30;

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Cross-Section Stress Distributions at x = {inspectX.toFixed(2)}m</span>
        <span className="text-[10px] text-primary">
          y = {inspectY.toFixed(1)}mm{Math.abs(inspectY) < 0.1 ? ' (Neutral Axis)' : ''}
        </span>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          onMouseMove={handleMouseMove}
        >
          {/* Section Shape Area */}
          <text x={xSection} y={12} textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold">PROFILE</text>
          {renderProfileShape()}

          {/* Width Dimension Line (Bottom) */}
          {shape.type !== 'circular' && (
            <g>
              <line x1={px0Bot} y1={py1 + 2} x2={px0Bot} y2={py1 + 10} stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="1,1" opacity={0.6} />
              <line x1={px0Bot + wBotPx} y1={py1 + 2} x2={px0Bot + wBotPx} y2={py1 + 10} stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="1,1" opacity={0.6} />
              <line x1={px0Bot} y1={py1 + 6} x2={px0Bot + wBotPx} y2={py1 + 6} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={px0Bot - 2} y1={py1 + 8} x2={px0Bot + 2} y2={py1 + 4} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={px0Bot + wBotPx - 2} y1={py1 + 8} x2={px0Bot + wBotPx + 2} y2={py1 + 4} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={px0Bot + wBotPx / 2} y={py1 + 16} textAnchor="middle" className="fill-muted-foreground text-[7px] font-mono font-bold">
                {shape.type === 'rectangular' ? 'b' : ((shape.type === 'i-beam' || shape.type === 'channel') ? 'bf,bot' : 'bf')}={(W_bot * 1000).toFixed(0)}mm
              </text>
            </g>
          )}

          {/* Height Dimension Line (Left) */}
          {shape.type !== 'circular' && (
            <g>
              <line x1={leftEdge - 2} y1={py0} x2={leftEdge - 14} y2={py0} stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="1,1" opacity={0.6} />
              <line x1={leftEdge - 2} y1={py1} x2={leftEdge - 14} y2={py1} stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="1,1" opacity={0.6} />
              <line x1={leftEdge - 10} y1={py0} x2={leftEdge - 10} y2={py1} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={leftEdge - 12} y1={py0 + 2} x2={leftEdge - 8} y2={py0 - 2} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={leftEdge - 12} y1={py1 + 2} x2={leftEdge - 8} y2={py1 - 2} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={leftEdge - 15} y={(py0 + py1) / 2 + 2.5} textAnchor="end" className="fill-muted-foreground text-[7px] font-mono font-bold">h={(H * 1000).toFixed(0)}</text>
            </g>
          )}

          {/* Diameter Dimension for Circular */}
          {shape.type === 'circular' && (
            <g>
              <line x1={xSection - (d * scaleX) / 2} y1={height / 2 + (d * scaleX) / 2 + 4} x2={xSection + (d * scaleX) / 2} y2={height / 2 + (d * scaleX) / 2 + 4} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={xSection - (d * scaleX) / 2 - 2} y1={height / 2 + (d * scaleX) / 2 + 6} x2={xSection - (d * scaleX) / 2 + 2} y2={height / 2 + (d * scaleX) / 2 + 2} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={xSection + (d * scaleX) / 2 - 2} y1={height / 2 + (d * scaleX) / 2 + 6} x2={xSection + (d * scaleX) / 2 + 2} y2={height / 2 + (d * scaleX) / 2 + 2} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={xSection} y={height / 2 + (d * scaleX) / 2 + 1} textAnchor="middle" className="fill-muted-foreground text-[7px] font-mono font-bold">d={(d * 1000).toFixed(0)}</text>
            </g>
          )}

          {/* Neutral Axis line on shape */}
          <line x1={xSection - 20} y1={toPixelY(0)} x2={xSection + 20} y2={toPixelY(0)} stroke="var(--destructive)" strokeWidth={0.8} strokeDasharray="3,1" opacity={0.6} />
          <text x={xSection} y={toPixelY(0) - 2.5} textAnchor="middle" className="fill-destructive text-[6px] font-mono font-bold opacity-80">N.A.</text>

          {/* Height y and width b readout value on shape */}
          <text x={rightEdge + 6} y={pyInspect + 6} className="fill-primary text-[7px] font-mono font-bold">
            y={inspectY >= 0 ? '+' : ''}{inspectY.toFixed(0)}mm
          </text>
          <text x={rightEdge + 6} y={pyInspect + 14} className="fill-primary text-[7px] font-mono font-bold">
            b={currentStresses.b.toFixed(0)}mm
          </text>

          {/* Bending Stress Plot */}
          <text x={xBending} y={12} textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold">BENDING STRESS (σ)</text>
          {/* Shaded Area */}
          <path d={bendingAreaPath} fill="rgba(16, 185, 129, 0.12)" stroke="none" />
          {/* Outline Curve */}
          <path d={bendPath} fill="none" stroke="var(--primary)" strokeWidth={1.5} />
          {/* Baseline */}
          <line x1={xBending} y1={paddingY} x2={xBending} y2={paddingY + chartH} stroke="var(--border)" strokeWidth={1} />
          {/* Neutral Axis label */}
          <line x1={xBending - 35} y1={toPixelY(0)} x2={xBending + 35} y2={toPixelY(0)} stroke="var(--destructive)" strokeWidth={1} strokeDasharray="3,1" opacity={0.6} />
          {/* Top Bending Stress label */}
          {Math.abs(sigmaTopMPa) > 0.01 && (
            <text
              x={pxTop + (sigmaTopMPa >= 0 ? 4 : -4)}
              y={toPixelY(H - ybar) + 3}
              textAnchor={sigmaTopMPa >= 0 ? 'start' : 'end'}
              className="fill-emerald-600/80 text-[6.5px] font-mono font-bold"
            >
              {sigmaTopMPa >= 0 ? '+' : ''}{sigmaTopMPa.toFixed(1)} MPa
            </text>
          )}
          {/* Bottom Bending Stress label */}
          {Math.abs(sigmaBottomMPa) > 0.01 && (
            <text
              x={pxBottom + (sigmaBottomMPa >= 0 ? 4 : -4)}
              y={toPixelY(-ybar) + 3}
              textAnchor={sigmaBottomMPa >= 0 ? 'start' : 'end'}
              className="fill-emerald-600/80 text-[6.5px] font-mono font-bold"
            >
              {sigmaBottomMPa >= 0 ? '+' : ''}{sigmaBottomMPa.toFixed(1)} MPa
            </text>
          )}

          {/* Interactive Inspection value marker & label */}
          <circle cx={pxBendingDot} cy={pyInspect} r={2.5} fill="var(--primary)" />
          <text
            x={pxBendingDot + (currentStresses.sigma < 0 ? -5 : 5)}
            y={pyInspect - 4}
            textAnchor={currentStresses.sigma < 0 ? 'end' : 'start'}
            className="fill-primary text-[8px] font-mono font-bold"
          >
            {currentStresses.sigma >= 0 ? '+' : ''}{currentStresses.sigma.toFixed(2)} MPa
          </text>

          {/* Shear Stress Plot */}
          <text x={xShear} y={12} textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold">SHEAR STRESS (τ)</text>
          {/* Shaded Area */}
          <path d={shearAreaPath} fill="rgba(245, 158, 11, 0.12)" stroke="none" />
          {/* Outline Curve */}
          <path d={shearCurvePath} fill="none" stroke="#f59e0b" strokeWidth={1.5} />
          {/* Baseline */}
          <line x1={xShear} y1={paddingY} x2={xShear} y2={paddingY + chartH} stroke="var(--border)" strokeWidth={1} />
          {/* Neutral Axis label */}
          <line x1={xShear - 10} y1={toPixelY(0)} x2={xShear + 35} y2={toPixelY(0)} stroke="var(--destructive)" strokeWidth={1} strokeDasharray="3,1" opacity={0.6} />
          {/* Peak Shear Stress label */}
          {Math.abs(maxTauMPa) > 0.01 && (
            <text
              x={pxMaxTau + (maxTauMPa >= 0 ? 5 : -5)}
              y={pyMaxTau + 2.5}
              textAnchor={maxTauMPa >= 0 ? 'start' : 'end'}
              className="fill-amber-600/80 text-[6.5px] font-mono font-bold"
            >
              {maxTauMPa >= 0 ? '+' : ''}{maxTauMPa.toFixed(1)} MPa
            </text>
          )}

          {/* Shear Stress Junction Labels */}
          {(() => {
            const labels: { y: number; tauFlange: number; tauWeb: number; flangeW: number }[] = [];
            if (shape.type === 'i-beam' || shape.type === 'channel') {
              const tfVal = shape.thicknessFlange ?? 0.01;
              const tfBotVal = shape.thicknessFlangeBottom ?? tfVal;

              const yBot = tfBotVal - ybar;
              const qBot = StaticalMomentEngine.calculateQAndWidth(shape, yBot, props);
              const tauFlangeBot = props.I > 1e-12 ? (V * qBot.Q) / (props.I * (shape.widthBottom ?? shape.width ?? 0.15)) : 0;
              const tauWebBot = props.I > 1e-12 ? (V * qBot.Q) / (props.I * (shape.thicknessWeb ?? 0.006)) : 0;

              const yTop = H - tfVal - ybar;
              const qTop = StaticalMomentEngine.calculateQAndWidth(shape, yTop, props);
              const tauFlangeTop = props.I > 1e-12 ? (V * qTop.Q) / (props.I * (shape.width ?? 0.15)) : 0;
              const tauWebTop = props.I > 1e-12 ? (V * qTop.Q) / (props.I * (shape.thicknessWeb ?? 0.006)) : 0;

              labels.push({ y: yBot, tauFlange: tauFlangeBot, tauWeb: tauWebBot, flangeW: shape.widthBottom ?? shape.width ?? 0.15 });
              labels.push({ y: yTop, tauFlange: tauFlangeTop, tauWeb: tauWebTop, flangeW: shape.width ?? 0.15 });
            } else if (shape.type === 't-beam') {
              const tfVal = shape.thicknessFlange ?? 0.01;
              const yTop = H - tfVal - ybar;
              const qTop = StaticalMomentEngine.calculateQAndWidth(shape, yTop, props);
              const tauFlangeTop = props.I > 1e-12 ? (V * qTop.Q) / (props.I * (shape.width ?? 0.15)) : 0;
              const tauWebTop = props.I > 1e-12 ? (V * qTop.Q) / (props.I * (shape.thicknessWeb ?? 0.008)) : 0;

              labels.push({ y: yTop, tauFlange: tauFlangeTop, tauWeb: tauWebTop, flangeW: shape.width ?? 0.15 });
            }

            return labels.map((lbl, idx) => {
              const pyJ = toPixelY(lbl.y);
              const pxFlange = xShear + (lbl.tauFlange / maxTau) * 30;
              const pxWeb = xShear + (lbl.tauWeb / maxTau) * 30;
              
              const isShearPos = V >= 0;
              const textAnchor = isShearPos ? 'start' : 'end';
              const textOffset = isShearPos ? 4 : -4;

              const valFlange = lbl.tauFlange / 1e6;
              const valWeb = lbl.tauWeb / 1e6;

              return (
                <g key={idx} opacity={0.8}>
                  {/* Flange point & label */}
                  <circle cx={pxFlange} cy={pyJ} r={1.8} fill="#f59e0b" />
                  {Math.abs(valFlange) > 0.01 && (
                    <text
                      x={pxFlange + textOffset}
                      y={pyJ + 8}
                      textAnchor={textAnchor}
                      className="fill-amber-600/70 text-[5.5px] font-mono font-bold"
                    >
                      {valFlange >= 0 ? '+' : ''}{valFlange.toFixed(2)} MPa
                    </text>
                  )}
                  {/* Web point & label */}
                  <circle cx={pxWeb} cy={pyJ} r={1.8} fill="#f59e0b" />
                  {Math.abs(valWeb) > 0.01 && (
                    <text
                      x={pxWeb + textOffset}
                      y={pyJ - 3}
                      textAnchor={textAnchor}
                      className="fill-amber-600/90 text-[6px] font-mono font-black"
                    >
                      {valWeb >= 0 ? '+' : ''}{valWeb.toFixed(2)} MPa
                    </text>
                  )}
                </g>
              );
            });
          })()}

          {/* Interactive Inspection value marker & label */}
          <circle cx={pxShearDot} cy={pyInspect} r={2.5} fill="#f59e0b" />
          <text
            x={pxShearDot + (currentStresses.tau < 0 ? -5 : 5)}
            y={pyInspect - 4}
            textAnchor={currentStresses.tau < 0 ? 'end' : 'start'}
            className="fill-amber-500 text-[8px] font-mono font-bold"
          >
            {currentStresses.tau >= 0 ? '+' : ''}{currentStresses.tau.toFixed(2)} MPa
          </text>

          {/* Interactive Inspection Horizontal Line */}
          <g>
            <line
              x1={10}
              y1={pyInspect}
              x2={width - 10}
              y2={pyInspect}
              stroke="var(--primary)"
              strokeWidth={1.2}
              strokeDasharray="2,2"
              opacity={0.6}
            />
            {/* Handle markers */}
            <circle cx={10} cy={pyInspect} r={2.5} fill="var(--primary)" />
            <circle cx={width - 10} cy={pyInspect} r={2.5} fill="var(--primary)" />
          </g>
        </svg>
      </div>
    </div>
  );
};
