import React from 'react';

export interface SecondaryFramingDrawingProps {
  activeHighlight?: 'sagrods' | 'bracings' | 'struts' | 'all' | 'none';
  className?: string;
}

export const SecondaryFramingDrawing: React.FC<SecondaryFramingDrawingProps> = ({
  activeHighlight = 'none',
  className = ''
}) => {
  const highlightColor = 'var(--primary, #f59e0b)';
  const defaultColor = 'currentColor';

  const isHighlighted = (type: 'sagrods' | 'bracings' | 'struts') => {
    return activeHighlight === 'all' || activeHighlight === type;
  };

  const getStroke = (type: 'sagrods' | 'bracings' | 'struts') => {
    return isHighlighted(type) ? highlightColor : defaultColor;
  };

  const getStrokeWidth = (type: 'sagrods' | 'bracings' | 'struts', defaultWidth = 1) => {
    return isHighlighted(type) ? 2 : defaultWidth;
  };

  const getOpacity = (type: 'sagrods' | 'bracings' | 'struts') => {
    if (activeHighlight === 'all' || activeHighlight === 'none') return 1.0;
    return isHighlighted(type) ? 1.0 : 0.25;
  };

  // Define Truss positions (5 trusses defining 4 bays)
  const trusses = [30, 75, 120, 165, 210];
  // Purlins: left slope (y=20, 38, 56), ridge (y=65), right slope (y=74, 92, 110)
  const purlinsLeft = [20, 38, 56];
  const purlinsRight = [74, 92, 110];
  const ridgeY = 65;

  return (
    <svg viewBox="0 0 240 140" className={`w-full h-auto text-foreground ${className}`}>
      {/* Outer border */}
      <rect x="5" y="5" width="230" height="130" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,3" className="text-muted-foreground/30" />

      {/* Grid line labels for Trusses & Bays */}
      <g fontSize="7" className="fill-muted-foreground font-mono select-none" opacity="0.6">
        <text x="30" y="12" textAnchor="middle">Truss 1</text>
        <text x="75" y="12" textAnchor="middle">Truss 2</text>
        <text x="120" y="12" textAnchor="middle">Truss 3</text>
        <text x="165" y="12" textAnchor="middle">Truss 4</text>
        <text x="210" y="12" textAnchor="middle">Truss 5</text>
        
        <text x="52.5" y="133" textAnchor="middle">Bay 1</text>
        <text x="97.5" y="133" textAnchor="middle">Bay 2</text>
        <text x="142.5" y="133" textAnchor="middle">Bay 3</text>
        <text x="187.5" y="133" textAnchor="middle">Bay 4</text>
      </g>

      {/* Primary Trusses (Vertical Framing Lines) */}
      <g stroke={defaultColor} strokeWidth="1.5" className="text-muted-foreground/40">
        {trusses.map((x, idx) => (
          <line key={`truss-${idx}`} x1={x} y1={20} x2={x} y2={110} />
        ))}
      </g>

      {/* Longitudinal Purlins (Horizontal Framing Lines) */}
      <g stroke={defaultColor} strokeWidth="1.2" className="text-foreground/70">
        <line x1="30" y1={ridgeY} x2="210" y2={ridgeY} strokeWidth="1.8" /> {/* Ridge */}
        {[...purlinsLeft, ...purlinsRight].map((y, idx) => (
          <line key={`purlin-${idx}`} x1={30} y1={y} x2={210} y2={y} />
        ))}
      </g>

      {/* Diagonal Wind Bracings (Angle iron in Bay 1 and Bay 4) */}
      <g
        stroke={getStroke('bracings')}
        strokeWidth={getStrokeWidth('bracings', 1.0)}
        opacity={getOpacity('bracings')}
        fill="none"
      >
        {/* Bay 1 Left Slope Diagonals */}
        <line x1="30" y1="20" x2="75" y2="56" />
        <line x1="30" y1="56" x2="75" y2="20" />
        {/* Bay 1 Right Slope Diagonals */}
        <line x1="30" y1="74" x2="75" y2="110" />
        <line x1="30" y1="110" x2="75" y2="74" />

        {/* Bay 4 Left Slope Diagonals */}
        <line x1="165" y1="20" x2="210" y2="56" />
        <line x1="165" y1="56" x2="210" y2="20" />
        {/* Bay 4 Right Slope Diagonals */}
        <line x1="165" y1="74" x2="210" y2="110" />
        <line x1="165" y1="110" x2="210" y2="74" />
      </g>

      {/* Bottom Chord Struts (Dashed horizontal lines running full length at bottom chord level) */}
      <g
        stroke={getStroke('struts')}
        strokeWidth={getStrokeWidth('struts', 1.2)}
        strokeDasharray="4,3"
        opacity={getOpacity('struts')}
      >
        <line x1="30" y1="30" x2="210" y2="30" />
        <line x1="30" y1="65" x2="210" y2="65" />
        <line x1="30" y1="100" x2="210" y2="100" />
      </g>

      {/* Sagrods (Vertical short rods connecting adjacent purlins in each bay) */}
      <g
        stroke={getStroke('sagrods')}
        strokeWidth={getStrokeWidth('sagrods', 0.9)}
        opacity={getOpacity('sagrods')}
      >
        {/* Sagrods are placed at center of bays: x=52.5, x=97.5, x=142.5, x=187.5 */}
        {[52.5, 97.5, 142.5, 187.5].map((x, bIdx) => (
          <g key={`sagrod-bay-${bIdx}`}>
            {/* Left slope sagrods */}
            <line x1={x} y1={20} x2={x} y2={38} />
            <line x1={x} y1={38} x2={x} y2={56} />
            {/* Right slope sagrods */}
            <line x1={x} y1={74} x2={x} y2={92} />
            <line x1={x} y1={92} x2={x} y2={110} />
          </g>
        ))}
      </g>
    </svg>
  );
};
