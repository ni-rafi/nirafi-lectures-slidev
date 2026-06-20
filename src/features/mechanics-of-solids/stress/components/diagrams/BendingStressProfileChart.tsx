import React from 'react';
import { IStressPoint } from '@/cores/mechanics-of-solids/stress/stress.interface';

interface BendingStressProfileChartProps {
  points: IStressPoint[];
  maxSigma: number;
  toPixelY: (yNA: number) => number;
  H: number;
  ybar: number;
  sigmaTopMPa: number;
  sigmaBottomMPa: number;
  pyInspect: number;
  currentSigma: number;
}

export const BendingStressProfileChart: React.FC<BendingStressProfileChartProps> = ({
  points,
  maxSigma,
  toPixelY,
  H,
  ybar,
  sigmaTopMPa,
  sigmaBottomMPa,
  pyInspect,
  currentSigma,
}) => {
  const xBending = 160;
  const paddingY = 20;
  const chartH = 110;

  // Calculate layout coordinates
  const pxTop = xBending + ((sigmaTopMPa * 1e6) / maxSigma) * 30;
  const pxBottom = xBending + ((sigmaBottomMPa * 1e6) / maxSigma) * 30;
  const pxBendingDot = xBending + ((currentSigma * 1e6) / maxSigma) * 30;

  // Bending stress path & area
  let bendPath = '';
  let bendingAreaPath = `M ${xBending} ${toPixelY(points[0]!.y)}`;
  points.forEach((pt: IStressPoint, idx: number) => {
    const px = xBending + (pt.sigma / maxSigma) * 30;
    const py = toPixelY(pt.y);
    bendPath += `${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
    bendingAreaPath += ` L ${px} ${py}`;
  });
  bendingAreaPath += ` L ${xBending} ${toPixelY(points[points.length - 1]!.y)} Z`;

  // Dynamic Y positioning for interactive labels to prevent overlap with static labels
  let yInspectLabelBending = pyInspect - 4;
  const pyBendingTop = toPixelY(H - ybar);
  const pyBendingBot = toPixelY(-ybar);
  if (Math.abs(yInspectLabelBending - (pyBendingTop + 3)) < 12) {
    yInspectLabelBending = pyBendingTop + 10; // Push below
  } else if (Math.abs(yInspectLabelBending - (pyBendingBot + 3)) < 12) {
    yInspectLabelBending = pyBendingBot - 10; // Push above
  }

  return (
    <g>
      {/* Title */}
      <text x={xBending} y={12} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">
        BENDING STRESS (σ)
      </text>

      {/* Shaded Area */}
      <path d={bendingAreaPath} fill="rgba(16, 185, 129, 0.12)" stroke="none" />

      {/* Outline Curve */}
      <path d={bendPath} fill="none" stroke="var(--primary)" strokeWidth={1.5} />

      {/* Baseline */}
      <line x1={xBending} y1={paddingY} x2={xBending} y2={paddingY + chartH} stroke="var(--border)" strokeWidth={1} />

      {/* Neutral Axis line */}
      <line
        x1={xBending - 35}
        y1={toPixelY(0)}
        x2={xBending + 35}
        y2={toPixelY(0)}
        stroke="var(--destructive)"
        strokeWidth={1}
        strokeDasharray="3,1"
        opacity={0.6}
      />

      {/* Top Bending Stress label */}
      {Math.abs(sigmaTopMPa) > 0.01 && (
        <text
          x={pxTop + (sigmaTopMPa >= 0 ? 4 : -4)}
          y={toPixelY(H - ybar) + 3}
          textAnchor={sigmaTopMPa >= 0 ? 'start' : 'end'}
          className="fill-emerald-600/80 text-[8px] font-mono font-bold"
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
          className="fill-emerald-600/80 text-[8px] font-mono font-bold"
        >
          {sigmaBottomMPa >= 0 ? '+' : ''}{sigmaBottomMPa.toFixed(1)} MPa
        </text>
      )}

      {/* Interactive Inspection value marker & label */}
      <circle cx={pxBendingDot} cy={pyInspect} r={2.5} fill="var(--primary)" />
      <text
        x={pxBendingDot + (currentSigma < 0 ? 5 : -5)}
        y={yInspectLabelBending}
        textAnchor={currentSigma < 0 ? 'start' : 'end'}
        className="fill-primary text-[9.5px] font-mono font-bold"
      >
        {currentSigma >= 0 ? '+' : ''}{currentSigma.toFixed(2)} MPa
      </text>
    </g>
  );
};
