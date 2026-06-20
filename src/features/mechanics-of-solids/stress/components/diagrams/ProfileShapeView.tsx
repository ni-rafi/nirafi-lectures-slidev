import React from 'react';
import { ICrossSection } from '@/cores/mechanics-of-solids/stress/stress.interface';

interface ProfileShapeViewProps {
  shape: ICrossSection;
  centroid: number;
  toPixelY: (yNA: number) => number;
  inspectY: number;
  currentWidth: number;
}

export const ProfileShapeView: React.FC<ProfileShapeViewProps> = ({
  shape,
  centroid,
  toPixelY,
  inspectY,
  currentWidth,
}) => {
  const H = shape.type === 'circular' ? (shape.diameter ?? 0.1) : (shape.height ?? 0.2);
  const ybar = centroid;

  // SVG parameters
  const height = 150;
  const paddingY = 20;
  const chartH = height - paddingY * 2; // 110px

  const xSection = 45;
  const W = shape.type === 'circular' ? (shape.diameter ?? 0.15) : (shape.width ?? 0.12);
  const shapeW = 40;
  const scaleX = shapeW / W;

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

  const pyInspect = toPixelY(inspectY / 1000);

  const renderProfileShape = () => {
    const tfTopPx = tf_top * scaleX;
    const tfBotPx = tf_bot * scaleX;
    const twPx = tw * scaleX;
    const dPx = d * scaleX;

    switch (shape.type) {
      case 'rectangular':
        return <rect x={xSection - wTopPx / 2} y={py0} width={wTopPx} height={chartH} className="fill-primary/10 stroke-muted-foreground" strokeWidth={1} />;
      case 'circular':
        const rPx = Math.min(chartH / 2, dPx / 2);
        return <circle cx={xSection} cy={height / 2} r={rPx} className="fill-primary/10 stroke-muted-foreground" strokeWidth={1} />;
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

  return (
    <g>
      {/* Section Title */}
      <text x={xSection} y={12} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">PROFILE</text>
      
      {/* 2D Shape SVG */}
      {renderProfileShape()}

      {/* Width Dimension Line (Bottom) */}
      {shape.type !== 'circular' && (
        <g>
          <line x1={px0Bot} y1={py1 + 2} x2={px0Bot} y2={py1 + 10} stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="1,1" opacity={0.6} />
          <line x1={px0Bot + wBotPx} y1={py1 + 2} x2={px0Bot + wBotPx} y2={py1 + 10} stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="1,1" opacity={0.6} />
          <line x1={px0Bot} y1={py1 + 6} x2={px0Bot + wBotPx} y2={py1 + 6} stroke="var(--muted-foreground)" strokeWidth={0.8} />
          <line x1={px0Bot - 2} y1={py1 + 8} x2={px0Bot + 2} y2={py1 + 4} stroke="var(--muted-foreground)" strokeWidth={1} />
          <line x1={px0Bot + wBotPx - 2} y1={py1 + 8} x2={px0Bot + wBotPx + 2} y2={py1 + 4} stroke="var(--muted-foreground)" strokeWidth={1} />
          <text x={px0Bot + wBotPx / 2} y={py1 + 16} textAnchor="middle" className="fill-muted-foreground text-[8.5px] font-mono font-bold">
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
          <text x={leftEdge - 15} y={(py0 + py1) / 2 + 2.5} textAnchor="end" className="fill-muted-foreground text-[8.5px] font-mono font-bold">h={(H * 1000).toFixed(0)}</text>
        </g>
      )}

      {/* Diameter Dimension for Circular */}
      {shape.type === 'circular' && (
        <g>
          <line x1={xSection - (d * scaleX) / 2} y1={height / 2 + (d * scaleX) / 2 + 4} x2={xSection + (d * scaleX) / 2} y2={height / 2 + (d * scaleX) / 2 + 4} stroke="var(--muted-foreground)" strokeWidth={0.8} />
          <line x1={xSection - (d * scaleX) / 2 - 2} y1={height / 2 + (d * scaleX) / 2 + 6} x2={xSection - (d * scaleX) / 2 + 2} y2={height / 2 + (d * scaleX) / 2 + 2} stroke="var(--muted-foreground)" strokeWidth={1} />
          <line x1={xSection + (d * scaleX) / 2 - 2} y1={height / 2 + (d * scaleX) / 2 + 6} x2={xSection + (d * scaleX) / 2 + 2} y2={height / 2 + (d * scaleX) / 2 + 2} stroke="var(--muted-foreground)" strokeWidth={1} />
          <text x={xSection} y={height / 2 + (d * scaleX) / 2 + 1} textAnchor="middle" className="fill-muted-foreground text-[8.5px] font-mono font-bold">d={(d * 1000).toFixed(0)}</text>
        </g>
      )}

      {/* Neutral Axis line on shape */}
      <line x1={xSection - 20} y1={toPixelY(0)} x2={xSection + 20} y2={toPixelY(0)} stroke="var(--destructive)" strokeWidth={0.8} strokeDasharray="3,1" opacity={0.6} />
      <text x={xSection} y={toPixelY(0) - 2.5} textAnchor="middle" className="fill-destructive text-[7.5px] font-mono font-bold opacity-80">N.A.</text>

      {/* Height y and width b readout value on shape */}
      <text x={rightEdge + 6} y={pyInspect + 6} className="fill-primary text-[8.5px] font-mono font-bold">
        y={inspectY >= 0 ? '+' : ''}{inspectY.toFixed(0)}mm
      </text>
      <text x={rightEdge + 6} y={pyInspect + 14} className="fill-primary text-[8.5px] font-mono font-bold">
        b={currentWidth.toFixed(0)}mm
      </text>
    </g>
  );
};
