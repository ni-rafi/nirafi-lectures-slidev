import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface RoofTrussLayoutDrawingProps {
  spanM: number;
  riseM: number;
  purlinSpacingM: number;
  showAnnotation?: boolean;
  activeHighlight?: 'none' | 'rafters' | 'ties' | 'webs' | 'purlins';
}

export const RoofTrussLayoutDrawing: React.FC<RoofTrussLayoutDrawingProps> = ({
  spanM,
  riseM,
  purlinSpacingM,
  showAnnotation = true,
  activeHighlight = 'none',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full h-full justify-center min-h-[300px]';

  // Scales for drawing (fit inside 450x220 viewBox)
  // Max span is 12m. We scale to about 320px max width.
  const scale = 320 / Math.max(6, spanM);

  const cx = 225; // center x
  const cy = 170; // bottom chord y (baseline)

  const w = spanM * scale;
  const h = riseM * scale;

  const leftX = cx - w / 2;
  const rightX = cx + w / 2;
  const apexY = cy - h;

  // Rafter slope math
  const halfSpan = spanM / 2;
  const rafterLength = Math.sqrt(halfSpan * halfSpan + riseM * riseM);
  const angleRad = Math.atan2(riseM, halfSpan);
  const angleDeg = (angleRad * 180) / Math.PI;

  // Purlin positions
  const numPurlinsPerSide = Math.floor(rafterLength / purlinSpacingM) + 1;
  const purlinsList: { x: number; y: number }[] = [];

  // Left rafter purlins
  for (let i = 0; i < numPurlinsPerSide; i++) {
    // Fraction of distance from bottom to apex
    const fraction = (i * purlinSpacingM) / rafterLength;
    if (fraction <= 1.0) {
      const px = leftX + fraction * (cx - leftX);
      const py = cy - fraction * h;
      purlinsList.push({ x: px, y: py });
    }
  }

  // Right rafter purlins (mirror)
  for (let i = 0; i < numPurlinsPerSide; i++) {
    const fraction = (i * purlinSpacingM) / rafterLength;
    if (fraction <= 1.0) {
      const px = rightX - fraction * (rightX - cx);
      const py = cy - fraction * h;
      purlinsList.push({ x: px, y: py });
    }
  }

  // Web members coordinates
  const q1X = leftX + w / 4; // quarter point on bottom chord
  const q3X = rightX - w / 4; // three-quarter point on bottom chord
  const r1X = leftX + (cx - leftX) / 2; // mid point on left rafter
  const r1Y = cy - h / 2;
  const r2X = rightX - (rightX - cx) / 2; // mid point on right rafter
  const r2Y = cy - h / 2;

  const isRaftersHighlighted = activeHighlight === 'rafters';
  const isTiesHighlighted = activeHighlight === 'ties';
  const isWebsHighlighted = activeHighlight === 'webs';
  const isPurlinsHighlighted = activeHighlight === 'purlins';
  const hasHighlightActive = activeHighlight !== 'none';

  const raftersOpacity = isRaftersHighlighted ? 'opacity-100' : hasHighlightActive ? 'opacity-15' : 'opacity-100';
  const tiesOpacity = isTiesHighlighted ? 'opacity-100' : hasHighlightActive ? 'opacity-15' : 'opacity-100';
  const websOpacity = isWebsHighlighted ? 'opacity-100' : hasHighlightActive ? 'opacity-15' : 'opacity-100';
  const purlinsOpacity = isPurlinsHighlighted ? 'opacity-100' : hasHighlightActive ? 'opacity-15' : 'opacity-100';
  const restOpacity = hasHighlightActive ? 'opacity-15' : 'opacity-100';

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Roof Truss Elevation & Purlin Layout
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 450 220"
        className="overflow-visible select-none"
      >
        {/* Ground/Support lines */}
        <line x1={leftX - 20} y1={cy} x2={rightX + 20} y2={cy} stroke="currentColor" strokeWidth="0.8" className={`text-muted-foreground/30 transition-opacity duration-300 ${restOpacity}`} />
        
        {/* Support piers */}
        <rect x={leftX - 8} y={cy} width="16" height="15" fill="none" stroke="currentColor" strokeWidth="1" className={`text-muted-foreground/40 transition-opacity duration-300 ${restOpacity}`} />
        <rect x={rightX - 8} y={cy} width="16" height="15" fill="none" stroke="currentColor" strokeWidth="1" className={`text-muted-foreground/40 transition-opacity duration-300 ${restOpacity}`} />

        {/* Bottom Chord (Tie Beam) */}
        <line
          x1={leftX}
          y1={cy}
          x2={rightX}
          y2={cy}
          stroke="var(--chart-1, #3b82f6)"
          strokeWidth={isTiesHighlighted ? '4.5' : '3'}
          className={`transition-all duration-300 ${tiesOpacity}`}
        />

        {/* Principal Rafters */}
        <line
          x1={leftX}
          y1={cy}
          x2={cx}
          y2={apexY}
          stroke="var(--chart-1, #3b82f6)"
          strokeWidth={isRaftersHighlighted ? '4.5' : '3'}
          className={`transition-all duration-300 ${raftersOpacity}`}
        />
        <line
          x1={rightX}
          y1={cy}
          x2={cx}
          y2={apexY}
          stroke="var(--chart-1, #3b82f6)"
          strokeWidth={isRaftersHighlighted ? '4.5' : '3'}
          className={`transition-all duration-300 ${raftersOpacity}`}
        />

        {/* Web Members */}
        {/* King Post (center vertical) */}
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={apexY}
          stroke={isWebsHighlighted ? 'var(--chart-3)' : 'currentColor'}
          strokeWidth={isWebsHighlighted ? '3' : '1.5'}
          className={`text-muted-foreground/70 transition-all duration-300 ${websOpacity}`}
        />
        {/* Struts */}
        <line x1={q1X} y1={cy} x2={r1X} y2={r1Y} stroke={isWebsHighlighted ? 'var(--chart-3)' : 'currentColor'} strokeWidth={isWebsHighlighted ? '3' : '1.5'} className={`text-muted-foreground/70 transition-all duration-300 ${websOpacity}`} />
        <line x1={q3X} y1={cy} x2={r2X} y2={r2Y} stroke={isWebsHighlighted ? 'var(--chart-3)' : 'currentColor'} strokeWidth={isWebsHighlighted ? '3' : '1.5'} className={`text-muted-foreground/70 transition-all duration-300 ${websOpacity}`} />
        <line x1={cx} y1={cy} x2={r1X} y2={r1Y} stroke={isWebsHighlighted ? 'var(--chart-3)' : 'currentColor'} strokeWidth={isWebsHighlighted ? '3' : '1.5'} className={`text-muted-foreground/70 transition-all duration-300 ${websOpacity}`} />
        <line x1={cx} y1={cy} x2={r2X} y2={r2Y} stroke={isWebsHighlighted ? 'var(--chart-3)' : 'currentColor'} strokeWidth={isWebsHighlighted ? '3' : '1.5'} className={`text-muted-foreground/70 transition-all duration-300 ${websOpacity}`} />

        {/* Draw Purlins as small slanted boxes along the rafters */}
        {purlinsList.map((p, idx) => {
          // Angle of purlin block should align with rafter
          const isRight = p.x > cx;
          const rot = isRight ? -angleDeg : angleDeg;
          return (
            <g key={idx} transform={`translate(${p.x}, ${p.y}) rotate(${rot})`} className={`transition-opacity duration-300 ${purlinsOpacity}`}>
              <rect
                x="-4"
                y="-8"
                width="8"
                height="8"
                fill="var(--chart-2, #eab308)"
                stroke="currentColor"
                strokeWidth={isPurlinsHighlighted ? '1.5' : '0.5'}
                className="transition-all duration-300"
              />
            </g>
          );
        })}

        {/* Annotations & Dimensions */}
        {showAnnotation && (
          <g className="font-mono text-[9px] fill-muted-foreground font-bold">
            {/* Span Indicator */}
            <g className={`transition-opacity duration-300 ${tiesOpacity}`}>
              <line x1={leftX} y1={cy + 25} x2={rightX} y2={cy + 25} stroke="currentColor" strokeWidth="0.5" />
              <path d={`M ${leftX},${cy + 22} L ${leftX},${cy + 28} M ${rightX},${cy + 22} L ${rightX},${cy + 28}`} />
              <text x={cx} y={cy + 36} textAnchor="middle" className="fill-foreground">
                Span = {spanM.toFixed(2)}m
              </text>
            </g>

            {/* Rise Indicator */}
            <g className={`transition-opacity duration-300 ${restOpacity}`}>
              <line x1={cx + w/2 + 25} y1={apexY} x2={cx + w/2 + 25} y2={cy} stroke="currentColor" strokeWidth="0.5" />
              <path d={`M ${cx + w/2 + 22},${apexY} H ${cx + w/2 + 28} M ${cx + w/2 + 22},${cy} H ${cx + w/2 + 28}`} />
              <text x={cx + w/2 + 32} y={cy - h/2 + 3} textAnchor="start" className="fill-foreground">
                Rise = {riseM.toFixed(2)}m
              </text>
            </g>

            {/* Slope text */}
            <g className={`transition-opacity duration-300 ${raftersOpacity}`}>
              <text x={leftX + (cx - leftX)/2 - 15} y={cy - h/2 - 15} textAnchor="end" className="fill-chart-1 font-bold">
                Rafter = {rafterLength.toFixed(3)}m
              </text>
            </g>

            {/* Pitch Angle */}
            <g className={`transition-opacity duration-300 ${restOpacity}`}>
              <path d={`M ${leftX + 25},${cy} A 25,25 0 0,0 ${leftX + 25 - 25 * (1 - Math.cos(angleRad))},${cy - 25 * Math.sin(angleRad)}`} fill="none" stroke="currentColor" strokeWidth="0.5" />
              <text x={leftX + 32} y={cy - 6} textAnchor="start" className="text-[7.5px] fill-muted-foreground font-normal">
                {angleDeg.toFixed(1)}°
              </text>
            </g>

            {/* Purlin spacing text */}
            {purlinsList.length > 0 && (
              <g className={`transition-opacity duration-300 ${purlinsOpacity}`}>
                <text x={cx} y={apexY - 20} textAnchor="middle" className="fill-chart-2 font-bold">
                  Purlin Spacing = {purlinSpacingM.toFixed(2)}m (Total = {numPurlinsPerSide * 2} Lines)
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

export default RoofTrussLayoutDrawing;
