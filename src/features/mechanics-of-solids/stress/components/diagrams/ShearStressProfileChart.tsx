import React from 'react';
import { ICrossSection, IStressPoint } from '@/cores/mechanics-of-solids/stress/stress.interface';
import { StaticalMomentEngine } from '@/cores/mechanics-of-solids/stress/statical-moment.engine';
import { ISectionProperties } from '@/cores/mechanics-of-solids/stress/cross-section.engine';

interface ShearStressProfileChartProps {
  shape: ICrossSection;
  points: IStressPoint[];
  maxTau: number;
  toPixelY: (yNA: number) => number;
  H: number;
  ybar: number;
  V: number;
  props: ISectionProperties;
  pyInspect: number;
  currentTau: number;
}

export const ShearStressProfileChart: React.FC<ShearStressProfileChartProps> = ({
  shape,
  points,
  maxTau,
  toPixelY,
  H,
  ybar,
  V,
  props,
  pyInspect,
  currentTau,
}) => {
  const xShear = 280;
  const paddingY = 20;
  const chartH = 110;

  // Solve peak shear stress
  const maxTauPoint = points.reduce((max, p) => Math.abs(p.tau) > Math.abs(max.tau) ? p : max, points[0]!);
  const maxTauMPa = maxTauPoint.tau / 1e6;
  const pxMaxTau = xShear + (maxTauPoint.tau / maxTau) * 30;
  const pyMaxTau = toPixelY(maxTauPoint.y);

  // Determine if bottom flange junction is near peak shear stress (neutral axis)
  const isJBotNearPeak = (shape.type === 'i-beam' || shape.type === 'channel') && (() => {
    const tfVal = shape.thicknessFlange ?? 0.01;
    const tfBotVal = shape.thicknessFlangeBottom ?? tfVal;
    const yBot = tfBotVal - ybar;
    const pyJBot = toPixelY(yBot);
    return Math.abs(pyMaxTau - pyJBot) < 10;
  })();

  // Shift peak label upward if bottom junction is very close to it
  const yPeakLabel = isJBotNearPeak ? pyMaxTau - 5 : pyMaxTau + 2.5;

  // Shear stress path (drawn as polygon shaded from baseline xShear)
  let shearCurvePath = '';
  let shearAreaPath = `M ${xShear} ${toPixelY(points[0]!.y)}`;
  points.forEach((pt: IStressPoint, idx: number) => {
    const px = xShear + (pt.tau / maxTau) * 30;
    const py = toPixelY(pt.y);
    shearCurvePath += `${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
    shearAreaPath += ` L ${px} ${py}`;
  });
  shearAreaPath += ` L ${xShear} ${toPixelY(points[points.length - 1]!.y)} Z`;

  // Exact coordinates for interactive marker dot
  const pxShearDot = xShear + ((currentTau * 1e6) / maxTau) * 30;

  // Dynamic Y positioning for interactive label to prevent overlap with static labels
  let yInspectLabelShear = pyInspect - 4;
  if (Math.abs(yInspectLabelShear - yPeakLabel) < 12) {
    yInspectLabelShear = yPeakLabel - 12; // Push above
  }

  if (shape.type === 'i-beam' || shape.type === 'channel' || shape.type === 't-beam') {
    const tfVal = shape.thicknessFlange ?? 0.01;
    const tfBotVal = (shape.type === 'i-beam' || shape.type === 'channel') ? (shape.thicknessFlangeBottom ?? tfVal) : tfVal;

    const pyJTop = toPixelY(H - tfVal - ybar);
    if (Math.abs(yInspectLabelShear - (pyJTop - 3)) < 12) {
      yInspectLabelShear = pyJTop + 10; // Push below
    }

    if (shape.type === 'i-beam' || shape.type === 'channel') {
      const pyJBot = toPixelY(tfBotVal - ybar);
      const actualYJBotLabel = isJBotNearPeak ? pyJBot + 7 : pyJBot - 3;
      if (Math.abs(yInspectLabelShear - actualYJBotLabel) < 12) {
        yInspectLabelShear = actualYJBotLabel + 10; // Push below
      }
    }
  }

  return (
    <g>
      {/* Title */}
      <text x={xShear} y={12} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">
        SHEAR STRESS (τ)
      </text>

      {/* Shaded Area */}
      <path d={shearAreaPath} fill="rgba(245, 158, 11, 0.12)" stroke="none" />

      {/* Outline Curve */}
      <path d={shearCurvePath} fill="none" stroke="#f59e0b" strokeWidth={1.5} />

      {/* Baseline */}
      <line x1={xShear} y1={paddingY} x2={xShear} y2={paddingY + chartH} stroke="var(--border)" strokeWidth={1} />

      {/* Neutral Axis line */}
      <line
        x1={xShear - 10}
        y1={toPixelY(0)}
        x2={xShear + 35}
        y2={toPixelY(0)}
        stroke="var(--destructive)"
        strokeWidth={1}
        strokeDasharray="3,1"
        opacity={0.6}
      />

      {/* Peak Shear Stress dot & label */}
      {Math.abs(maxTauMPa) > 0.01 && (
        <g>
          <circle cx={pxMaxTau} cy={pyMaxTau} r={1.8} fill="#f59e0b" />
          <text
            x={pxMaxTau + (maxTauMPa >= 0 ? 5 : -5)}
            y={yPeakLabel}
            textAnchor={maxTauMPa >= 0 ? 'start' : 'end'}
            className="fill-amber-600/80 text-[8px] font-mono font-bold"
          >
            {maxTauMPa >= 0 ? '+' : ''}{maxTauMPa.toFixed(1)} MPa
          </text>
        </g>
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

          const isBottomJunction = (shape.type === 'i-beam' || shape.type === 'channel') && idx === 0;

          let yWebLabel = pyJ - 3;
          let yFlangeLabel = pyJ + 8;

          if (isBottomJunction && isJBotNearPeak) {
            yWebLabel = pyJ + 7;
            yFlangeLabel = pyJ + 15;
          }

          return (
            <g key={idx} opacity={0.8}>
              {/* Flange point & label */}
              <circle cx={pxFlange} cy={pyJ} r={1.8} fill="#f59e0b" />
              {Math.abs(valFlange) > 0.01 && (
                <text
                  x={pxFlange + textOffset}
                  y={yFlangeLabel}
                  textAnchor={textAnchor}
                  className="fill-amber-600/70 text-[7px] font-mono font-bold"
                >
                  {valFlange >= 0 ? '+' : ''}{valFlange.toFixed(2)} MPa
                </text>
              )}
              {/* Web point & label */}
              <circle cx={pxWeb} cy={pyJ} r={1.8} fill="#f59e0b" />
              {Math.abs(valWeb) > 0.01 && (
                <text
                  x={pxWeb + textOffset}
                  y={yWebLabel}
                  textAnchor={textAnchor}
                  className="fill-amber-600/90 text-[7.5px] font-mono font-black"
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
        x={pxShearDot + (currentTau < 0 ? 5 : -5)}
        y={yInspectLabelShear}
        textAnchor={currentTau < 0 ? 'start' : 'end'}
        className="fill-amber-500 text-[9.5px] font-mono font-bold"
      >
        {currentTau >= 0 ? '+' : ''}{currentTau.toFixed(2)} MPa
      </text>
    </g>
  );
};
