import React, { useState } from 'react';
import { ICrossSection } from '@/cores/mechanics-of-solids/stress/stress.interface';
import { CrossSectionEngine } from '@/cores/mechanics-of-solids/stress/cross-section.engine';

interface InteractiveProfileCanvasProps {
  shape: ICrossSection;
  onChange: (updates: Partial<ICrossSection>) => void;
}

export const InteractiveProfileCanvas: React.FC<InteractiveProfileCanvasProps> = ({ shape, onChange }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Default parameters in meters
  const W = shape.width ?? 0.15;
  const H = shape.height ?? 0.2;
  const tf = shape.thicknessFlange ?? 0.01;
  const tw = shape.thicknessWeb ?? 0.006;
  const dia = shape.diameter ?? 0.1;

  const maxDim = shape.type === 'circular' ? dia : Math.max(W, H);
  const scale = 110 / maxDim; // Map maximum dimension to 110px

  const wPx = W * scale;
  const hPx = H * scale;
  const tfPx = tf * scale;
  const twPx = tw * scale;
  const diaPx = dia * scale;

  const x0 = 80 - wPx / 2;
  const y0 = 80 - hPx / 2;

  const props = CrossSectionEngine.calculateProperties(shape);
  const ybar = props.centroid;
  const ybarPx = ybar * scale;
  const yNaPx = y0 + hPx - ybarPx;

  const W_bottom = shape.widthBottom ?? W;
  const tf_bottom = shape.thicknessFlangeBottom ?? tf;
  const wBottomPx = W_bottom * scale;
  const tfBottomPx = tf_bottom * scale;
  const x0Bottom = 80 - wBottomPx / 2;

  const yWebTop = y0 + tfPx;
  const yWebBottom = y0 + hPx - (shape.type === 't-beam' ? 0 : tfBottomPx);
  const yWebMid = (yWebTop + yWebBottom) / 2;
  const yTwPx = yNaPx > yWebMid 
    ? yWebTop + 0.25 * (yWebBottom - yWebTop) 
    : yWebTop + 0.75 * (yWebBottom - yWebTop);

  const isChannel = shape.type === 'channel';
  const maxW = Math.max(W, W_bottom);
  const maxWPx = maxW * scale;
  const xStart = 80 - maxWPx / 2;

  const x0_top = isChannel ? xStart : x0;
  const x0_bot = isChannel ? xStart : x0Bottom;
  const x0_web = isChannel ? xStart : (shape.type === 'i-beam' ? 80 - twPx / 2 : x0_top);

  const startEdit = (field: string, valMeters: number) => {
    setEditingField(field);
    setEditValue((valMeters * 1000).toFixed(0)); // Show in mm
  };

  const saveEdit = (field: string) => {
    const valMM = parseFloat(editValue);
    if (!isNaN(valMM) && valMM > 0) {
      const valMeters = valMM / 1000;
      onChange({ [field]: valMeters });
    }
    setEditingField(null);
  };

  // Helper for rendering dimension lines
  const renderDimensionLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    textX: number,
    textY: number,
    label: string,
    field: string,
    valMeters: number,
    textAnchor: 'start' | 'middle' | 'end' = 'middle'
  ) => {
    const isEditing = editingField === field;
    const isEditable = field !== 'centroid';
    const isHorizontal = Math.abs(y1 - y2) < 0.1;
    const len = isHorizontal ? Math.abs(x2 - x1) : Math.abs(y2 - y1);
    const isSmall = len < 12;

    let drawTextX = textX;
    let drawTextY = textY;
    let drawTextAnchor = textAnchor;

    // Shift text position for small horizontal dimensions to the right/left to avoid overlapping
    if (isSmall && isHorizontal && field === 'thicknessWeb') {
      const isWebOnLeft = x1 < 50; // Channel web is at x0
      if (isWebOnLeft) {
        drawTextX = x1 - 15;
        drawTextAnchor = 'end';
      } else {
        drawTextX = x2 + 15;
        drawTextAnchor = 'start';
      }
      drawTextY = y1 + 3;
    }

    const strokeColor = field === 'centroid' ? 'var(--destructive)' : 'var(--primary)';

    return (
      <g className="group select-none">
        {/* Dimension Line */}
        {isSmall ? (
          isHorizontal ? (
            <>
              {/* Left leader line */}
              <line x1={x1 - 12} y1={y1} x2={x1} y2={y1} stroke={strokeColor} strokeWidth={1} opacity={0.6} />
              {/* Right leader line */}
              <line x1={x2} y1={y1} x2={x2 + 12} y2={y1} stroke={strokeColor} strokeWidth={1} opacity={0.6} />
            </>
          ) : (
            <>
              {/* Top leader line */}
              <line x1={x1} y1={y1 - 12} x2={x1} y2={y1} stroke={strokeColor} strokeWidth={1} opacity={0.6} />
              {/* Bottom leader line */}
              <line x1={x1} y1={y2} x2={x1} y2={y2 + 12} stroke={strokeColor} strokeWidth={1} opacity={0.6} />
            </>
          )
        ) : (
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={1} strokeDasharray="1,1" opacity={0.6} />
        )}
        {/* Dimension Ticks */}
        <circle cx={x1} cy={y1} r={1.5} fill={strokeColor} opacity={0.8} />
        <circle cx={x2} cy={y2} r={1.5} fill={strokeColor} opacity={0.8} />

        {isEditing && isEditable ? (
          <foreignObject x={drawTextX - 25} y={drawTextY - 9} width={50} height={18}>
            <input
              type="number"
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit(field)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit(field);
                if (e.key === 'Escape') setEditingField(null);
              }}
              className="w-full h-full text-center text-[9px] font-mono bg-background border border-primary rounded px-0.5 text-foreground focus:outline-none"
            />
          </foreignObject>
        ) : (
          <text
            x={drawTextX}
            y={drawTextY}
            textAnchor={drawTextAnchor}
            onClick={isEditable ? () => startEdit(field, valMeters) : undefined}
            className={`text-[8px] font-mono font-bold ${
              isEditable ? 'cursor-pointer hover:underline' : ''
            } bg-background`}
            fill={strokeColor}
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="flex justify-center border border-border/30 bg-muted/5 rounded-xl p-4 max-w-[400px] mx-auto w-full">
      <svg viewBox="0 0 160 160" className="w-80 h-80 select-none overflow-visible">
        {/* Shapes Rendering */}
        {shape.type === 'rectangular' && (
          <rect
            x={x0}
            y={y0}
            width={wPx}
            height={hPx}
            className="fill-primary/10 stroke-foreground"
            strokeWidth={1.5}
          />
        )}

        {shape.type === 'circular' && (
          <circle
            cx={80}
            cy={80}
            r={diaPx / 2}
            className="fill-primary/10 stroke-foreground"
            strokeWidth={1.5}
          />
        )}

        {(shape.type === 'i-beam' || shape.type === 'channel') && (
          <g>
            {/* Top Flange */}
            <rect x={x0_top} y={y0} width={wPx} height={tfPx} className="fill-primary/10 stroke-foreground" strokeWidth={1.5} />
            {/* Bottom Flange */}
            <rect x={x0_bot} y={y0 + hPx - tfBottomPx} width={wBottomPx} height={tfBottomPx} className="fill-primary/10 stroke-foreground" strokeWidth={1.5} />
            {/* Web */}
            <rect
              x={x0_web}
              y={y0 + tfPx - 0.5}
              width={twPx}
              height={hPx - tfPx - tfBottomPx + 1}
              className="fill-primary/10 stroke-foreground"
              strokeWidth={1.5}
            />
          </g>
        )}

        {shape.type === 't-beam' && (
          <g>
            {/* Top Flange */}
            <rect x={x0} y={y0} width={wPx} height={tfPx} className="fill-primary/10 stroke-foreground" strokeWidth={1.5} />
            {/* Web */}
            <rect
              x={80 - twPx / 2}
              y={y0 + tfPx - 0.5}
              width={twPx}
              height={hPx - tfPx + 0.5}
              className="fill-primary/10 stroke-foreground"
              strokeWidth={1.5}
            />
          </g>
        )}

        {/* Neutral Axis (N.A.) line and centroid height dimension */}
        {shape.type !== 'custom' && (
          shape.type === 'circular' ? (
            <g>
              {/* Horizontal N.A. line */}
              <line
                x1={80 - diaPx / 2 - 15}
                y1={80}
                x2={80 + diaPx / 2 + 15}
                y2={80}
                stroke="var(--destructive)"
                strokeWidth={1}
                strokeDasharray="3,2"
                opacity={0.85}
              />
              {/* Label */}
              <text
                x={80 - diaPx / 2 - 18}
                y={82.5}
                textAnchor="end"
                className="fill-destructive text-[7.5px] font-mono font-bold"
              >
                N.A.
              </text>
            </g>
          ) : (
            <g>
              {/* Horizontal N.A. line */}
              <line
                x1={Math.min(x0_top, x0_bot) - 15}
                y1={yNaPx}
                x2={Math.max(x0_top + wPx, x0_bot + wBottomPx) + 15}
                y2={yNaPx}
                stroke="var(--destructive)"
                strokeWidth={1}
                strokeDasharray="3,2"
                opacity={0.85}
              />
              {/* Label */}
              <text
                x={Math.min(x0_top, x0_bot) - 18}
                y={yNaPx + 2.5}
                textAnchor="end"
                className="fill-destructive text-[7.5px] font-mono font-bold"
              >
                N.A.
              </text>
              {/* Height of N.A. from bottom (ȳ) */}
              {renderDimensionLine(
                Math.min(x0_top, x0_bot) - 8,
                yNaPx,
                Math.min(x0_top, x0_bot) - 8,
                y0 + hPx,
                Math.min(x0_top, x0_bot) - 18,
                (yNaPx + y0 + hPx) / 2 + 3,
                `ȳ=${(ybar * 1000).toFixed(0)}mm`,
                'centroid',
                ybar,
                'end'
              )}
            </g>
          )
        )}

        {/* Dimension overlays */}
        {shape.type === 'rectangular' && (
          <>
            {/* Width b */}
            {renderDimensionLine(x0, y0 + hPx + 8, x0 + wPx, y0 + hPx + 8, 80, y0 + hPx + 18, `${(W * 1000).toFixed(0)}mm`, 'width', W)}
            {/* Height h */}
            {renderDimensionLine(x0 + wPx + 8, y0, x0 + wPx + 8, y0 + hPx, x0 + wPx + 18, 80 + 3, `${(H * 1000).toFixed(0)}mm`, 'height', H, 'start')}
          </>
        )}

        {shape.type === 'circular' && (
          <>
            {/* Diameter d */}
            {renderDimensionLine(80 - diaPx / 2, 80 + diaPx / 2 + 8, 80 + diaPx / 2, 80 + diaPx / 2 + 8, 80, 80 + diaPx / 2 + 18, `d=${(dia * 1000).toFixed(0)}mm`, 'diameter', dia)}
          </>
        )}

        {shape.type === 't-beam' && (
          <>
            {/* bf Flange Width (Top) */}
            {renderDimensionLine(x0, y0 - 8, x0 + wPx, y0 - 8, 80, y0 - 18, `bf=${(W * 1000).toFixed(0)}mm`, 'width', W)}
            {/* d Overall Depth (Right) */}
            {renderDimensionLine(x0 + wPx + 8, y0, x0 + wPx + 8, y0 + hPx, x0 + wPx + 18, 80 + 3, `d=${(H * 1000).toFixed(0)}mm`, 'height', H, 'start')}
            {/* tf Flange Thickness (Left) */}
            {renderDimensionLine(x0 - 8, y0, x0 - 8, y0 + tfPx, x0 - 18, y0 + tfPx / 2 + 3, `tf=${(tf * 1000).toFixed(0)}mm`, 'thicknessFlange', tf, 'end')}
            {/* tw Web Thickness */}
            {renderDimensionLine(80 - twPx / 2, yTwPx, 80 + twPx / 2, yTwPx, 80, yTwPx - 10, `tw=${(tw * 1000).toFixed(0)}mm`, 'thicknessWeb', tw)}
          </>
        )}

        {(shape.type === 'i-beam' || shape.type === 'channel') && (
          <>
            {/* Top Flange bf (Top) */}
            {renderDimensionLine(x0_top, y0 - 8, x0_top + wPx, y0 - 8, x0_top + wPx / 2, y0 - 18, `bf,top=${(W * 1000).toFixed(0)}mm`, 'width', W)}
            {/* Top Flange tf (Left) */}
            {renderDimensionLine(x0_top - 8, y0, x0_top - 8, y0 + tfPx, x0_top - 18, y0 + tfPx / 2 + 3, `tf,top=${(tf * 1000).toFixed(0)}mm`, 'thicknessFlange', tf, 'end')}
            {/* tw Web Thickness */}
            {renderDimensionLine(x0_web, yTwPx, x0_web + twPx, yTwPx, x0_web + twPx / 2, yTwPx - 10, `tw=${(tw * 1000).toFixed(0)}mm`, 'thicknessWeb', tw)}
            {/* Bottom Flange bfb (Bottom) */}
            {renderDimensionLine(x0_bot, y0 + hPx + 8, x0_bot + wBottomPx, y0 + hPx + 8, x0_bot + wBottomPx / 2, y0 + hPx + 18, `bf,bot=${(W_bottom * 1000).toFixed(0)}mm`, 'widthBottom', W_bottom)}
            {/* Bottom Flange tfb (Left bottom) */}
            {renderDimensionLine(x0_bot - 8, y0 + hPx - tfBottomPx, x0_bot - 8, y0 + hPx, x0_bot - 18, y0 + hPx - tfBottomPx / 2 + 3, `tf,bot=${(tf_bottom * 1000).toFixed(0)}mm`, 'thicknessFlangeBottom', tf_bottom, 'end')}
            {/* d Overall Depth (Right) */}
            {renderDimensionLine(Math.max(x0_top + wPx, x0_bot + wBottomPx) + 8, y0, Math.max(x0_top + wPx, x0_bot + wBottomPx) + 8, y0 + hPx, Math.max(x0_top + wPx, x0_bot + wBottomPx) + 18, 80 + 3, `d=${(H * 1000).toFixed(0)}mm`, 'height', H, 'start')}
          </>
        )}
      </svg>
    </div>
  );
};
