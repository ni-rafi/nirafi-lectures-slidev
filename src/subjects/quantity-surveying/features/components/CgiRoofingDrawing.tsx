import React from 'react';

export interface CgiRoofingDrawingProps {
  span: number;
  rise: number;
  buildingLength: number;
  sideOverhang: number;
  eavesOverhang: number;
  className?: string;
}

export const CgiRoofingDrawing: React.FC<CgiRoofingDrawingProps> = ({
  span,
  rise,
  buildingLength,
  className = ''
}) => {
  const highlightColor = 'var(--primary, #f59e0b)';

  // Calculate rafter sloping length
  const rafterSlope = Math.sqrt(rise * rise + (span / 2) * (span / 2));

  return (
    <svg viewBox="0 0 320 160" className={`w-full h-auto text-foreground ${className}`}>
      <defs>
        <pattern id="corrugation-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M 0 3 Q 1.5 0 3 3 Q 4.5 6 6 3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/30" />
        </pattern>
      </defs>

      {/* Back Truss (Projected) */}
      <g className="text-muted-foreground/40">
        <path d="M 120 100 L 195 55 L 270 100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="120" y1="100" x2="270" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
      </g>

      {/* Longitudinal Framing Lines (Purlins & Ridge) */}
      <g className="text-muted-foreground/30">
        <line x1="30" y1="100" x2="120" y2="100" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,3" />
        <line x1="180" y1="100" x2="270" y2="100" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,3" />
        <line x1="105" y1="55" x2="195" y2="55" stroke="currentColor" strokeWidth="1.2" />
        <line x1="67" y1="77" x2="157" y2="77" stroke="currentColor" strokeWidth="1" />
        <line x1="142" y1="77" x2="232" y2="77" stroke="currentColor" strokeWidth="1" />
      </g>

      {/* CGI Sheets Cladding Layer (Left Slope, Semi-transparent) */}
      <polygon
        points="25,103 102,52 192,52 115,103"
        fill="url(#corrugation-pattern)"
        stroke={highlightColor}
        strokeWidth="1"
        fillOpacity="0.4"
      />
      <polygon
        points="25,103 102,52 192,52 115,103"
        fill="none"
        stroke={highlightColor}
        strokeWidth="1.2"
      />

      {/* Front Truss (Solid) */}
      <g className="text-foreground">
        <path d="M 30 100 L 105 55 L 180 100 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <line x1="30" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1.5" />
        {/* Support columns */}
        <line x1="30" y1="100" x2="30" y2="125" stroke="currentColor" strokeWidth="2.5" />
        <line x1="180" y1="100" x2="180" y2="125" stroke="currentColor" strokeWidth="2.5" />
        {/* Ground lines */}
        <line x1="15" y1="125" x2="45" y2="125" stroke="currentColor" strokeWidth="1.5" />
        <line x1="165" y1="125" x2="195" y2="125" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Dimension Line: Span (L) */}
      <g className="text-primary font-mono">
        <line x1="30" y1="135" x2="180" y2="135" stroke={highlightColor} strokeWidth="1" />
        <path d="M 30 132 L 30 138 M 180 132 L 180 138" stroke={highlightColor} strokeWidth="1" />
        <text x="105" y="146" textAnchor="middle" fontSize="10" fill={highlightColor} className="font-bold">
          Span (L): {span.toFixed(3)}m
        </text>
      </g>

      {/* Dimension Line: Rise (h) */}
      <g className="text-primary font-mono">
        <line x1="105" y1="55" x2="105" y2="100" stroke={highlightColor} strokeWidth="1" strokeDasharray="2,2" />
        <line x1="102" y1="55" x2="108" y2="55" stroke={highlightColor} strokeWidth="1" />
        <line x1="102" y1="100" x2="108" y2="100" stroke={highlightColor} strokeWidth="1" />
        <text x="111" y="82" fontSize="9" fill={highlightColor} className="font-bold">
          Rise (h): {rise.toFixed(3)}m
        </text>
      </g>

      {/* Dimension Line: Building Length (Bay) */}
      <g className="text-primary font-mono">
        <line x1="180" y1="100" x2="270" y2="100" stroke={highlightColor} strokeWidth="1" />
        <path d="M 180 97 L 180 103 M 270 97 L 270 103" stroke={highlightColor} strokeWidth="1" />
        <text x="225" y="112" textAnchor="middle" fontSize="9" fill={highlightColor} className="font-bold">
          Length: {buildingLength.toFixed(3)}m
        </text>
      </g>

      {/* Dimension Line: Rafter sloping length */}
      <g className="text-primary font-mono">
        <line x1="23" y1="95" x2="98" y2="50" stroke={highlightColor} strokeWidth="1" />
        <path d="M 20 97 L 26 93 M 95 52 L 101 48" stroke={highlightColor} strokeWidth="1" />
        <text x="45" y="65" fontSize="9" fill={highlightColor} className="font-bold" transform="rotate(-31, 45, 65)">
          Slope: {rafterSlope.toFixed(3)}m
        </text>
      </g>

      {/* Annotations */}
      <text x="210" y="45" fontSize="8" className="fill-muted-foreground">
        CGI Sheet Cladding
      </text>
      <path d="M 195 48 L 155 65" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,1" className="text-muted-foreground" />
    </svg>
  );
};
