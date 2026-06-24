import React from 'react';

export interface PwdSectionWeightDrawingProps {
  shape: 'flat' | 'z' | 'tee';
  sizeKey: string;
  className?: string;
}

export const PwdSectionWeightDrawing: React.FC<PwdSectionWeightDrawingProps> = ({
  shape,
  sizeKey,
  className = ''
}) => {
  const fillColor = 'var(--primary, #f59e0b)';

  // Parse sizeKey, e.g. "25x5" -> width=25, height/thickness=5
  const parts = sizeKey.split('x').map(Number);
  const w = parts[0] || 25;
  const h = parts[1] || 25;
  const t = parts[2] || parts[1] || 3; // for flat, height is the thickness. For Z/Tee, t is parts[2]

  const renderSection = () => {
    switch (shape) {
      case 'flat':
        return (
          <g>
            {/* Draw a simple flat plate bar cross-section */}
            <rect x="40" y="60" width="120" height="24" fill={fillColor} fillOpacity="0.15" stroke={fillColor} strokeWidth="2" rx="2" />
            
            {/* Dimension: Width */}
            <line x1="40" y1="105" x2="160" y2="105" stroke="currentColor" strokeWidth="1" />
            <path d="M 40 102 L 40 108 M 160 102 L 160 108" stroke="currentColor" strokeWidth="1" />
            <text x="100" y="118" textAnchor="middle" fontSize="10" className="fill-foreground font-mono">
              w = {w} mm
            </text>

            {/* Dimension: Thickness */}
            <line x1="175" y1="60" x2="175" y2="84" stroke="currentColor" strokeWidth="1" />
            <path d="M 172 60 L 178 60 M 172 84 L 178 84" stroke="currentColor" strokeWidth="1" />
            <text x="183" y="76" fontSize="10" className="fill-foreground font-mono">
              t = {h} mm
            </text>
          </g>
        );
      case 'z':
        return (
          <g>
            {/* Z-Section path */}
            {/* Top flange (left to right), web (down), bottom flange (right) */}
            {/* Start at top left: (50, 40) -> top flange right (110, 40) -> down to thickness inner (110, 46) -> web left inner (56, 46) -> down web to bottom flange (56, 100) -> bottom right flange (116, 100) -> thickness end (116, 106) -> bottom inner flange (50, 106) -> web left outer (50, 40) */}
            {/* Let's draw a simplified clean Z-shape path */}
            <path
              d="M 60 45 L 110 45 L 110 51 L 86 51 L 86 99 L 136 99 L 136 105 L 80 105 L 80 51 L 60 51 Z"
              fill={fillColor}
              fillOpacity="0.15"
              stroke={fillColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Dimension: Top Flange Width */}
            <line x1="60" y1="28" x2="110" y2="28" stroke="currentColor" strokeWidth="1" />
            <path d="M 60 25 L 60 31 M 110 25 L 110 31" stroke="currentColor" strokeWidth="1" />
            <text x="85" y="21" textAnchor="middle" fontSize="9" className="fill-foreground font-mono">
              Flange (w): {w} mm
            </text>

            {/* Dimension: Height */}
            <line x1="42" y1="45" x2="42" y2="105" stroke="currentColor" strokeWidth="1" />
            <path d="M 39 45 L 45 45 M 39 105 L 45 105" stroke="currentColor" strokeWidth="1" />
            <text x="18" y="78" fontSize="9" className="fill-foreground font-mono">
              h: {h} mm
            </text>

            {/* Dimension: Thickness */}
            <line x1="122" y1="45" x2="122" y2="51" stroke="currentColor" strokeWidth="1" />
            <path d="M 119 45 L 125 45 M 119 51 L 125 51" stroke="currentColor" strokeWidth="1" />
            <text x="127" y="52" fontSize="9" className="fill-foreground font-mono">
              t: {t} mm
            </text>
          </g>
        );
      case 'tee':
        return (
          <g>
            {/* Tee Section: horizontal flange and vertical stem */}
            <path
              d="M 50 45 L 150 45 L 150 51 L 103 51 L 103 105 L 97 105 L 97 51 L 50 51 Z"
              fill={fillColor}
              fillOpacity="0.15"
              stroke={fillColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Dimension: Flange Width */}
            <line x1="50" y1="28" x2="150" y2="28" stroke="currentColor" strokeWidth="1" />
            <path d="M 50 25 L 50 31 M 150 25 L 150 31" stroke="currentColor" strokeWidth="1" />
            <text x="100" y="21" textAnchor="middle" fontSize="9" className="fill-foreground font-mono">
              Flange (w): {w} mm
            </text>

            {/* Dimension: Total Depth */}
            <line x1="32" y1="45" x2="32" y2="105" stroke="currentColor" strokeWidth="1" />
            <path d="M 29 45 L 35 45 M 29 105 L 35 105" stroke="currentColor" strokeWidth="1" />
            <text x="10" y="78" fontSize="9" className="fill-foreground font-mono">
              h: {h} mm
            </text>

            {/* Dimension: Thickness */}
            <line x1="162" y1="45" x2="162" y2="51" stroke="currentColor" strokeWidth="1" />
            <path d="M 159 45 L 165 45 M 159 51 L 165 51" stroke="currentColor" strokeWidth="1" />
            <text x="169" y="52" fontSize="9" className="fill-foreground font-mono">
              t: {t} mm
            </text>
          </g>
        );
    }
  };

  return (
    <svg viewBox="0 0 200 130" className={`w-full h-auto text-foreground ${className}`}>
      {/* Outer framing box */}
      <rect x="5" y="5" width="190" height="120" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,2" className="text-muted-foreground/30" />
      {renderSection()}
    </svg>
  );
};
