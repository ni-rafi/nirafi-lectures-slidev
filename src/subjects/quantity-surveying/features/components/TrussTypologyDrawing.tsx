import React from 'react';

export interface TrussTypologyDrawingProps {
  type: string;
  className?: string;
}

export const TrussTypologyDrawing: React.FC<TrussTypologyDrawingProps> = ({ type, className = '' }) => {
  const strokeColor = 'currentColor';

  switch (type.toLowerCase()) {
    case 'howe':
      return (
        <svg viewBox="0 0 200 80" className={`w-full h-auto ${className}`}>
          <path d="M 10 70 L 100 20 L 190 70 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 10 70 L 190 70" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="40" y1="70" x2="40" y2="53" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="70" y1="70" x2="70" y2="36" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="70" x2="100" y2="20" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="130" y1="70" x2="130" y2="36" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="160" y1="70" x2="160" y2="53" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="40" y1="70" x2="10" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="40" y1="53" x2="70" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="70" y1="36" x2="100" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="130" y1="36" x2="100" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="160" y1="53" x2="130" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="160" y1="70" x2="190" y2="70" stroke={strokeColor} strokeWidth="1.2" />
        </svg>
      );
    case 'warren':
      return (
        <svg viewBox="0 0 200 80" className={`w-full h-auto ${className}`}>
          <path d="M 10 70 L 100 20 L 190 70 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 10 70 L 190 70" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="10" y1="70" x2="55" y2="45" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="55" y1="45" x2="100" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="70" x2="145" y2="45" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="145" y1="45" x2="190" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="55" y1="45" x2="100" y2="20" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="145" y1="45" x2="100" y2="20" stroke={strokeColor} strokeWidth="1.2" />
        </svg>
      );
    case 'bowstring':
      return (
        <svg viewBox="0 0 200 80" className={`w-full h-auto ${className}`}>
          <path d="M 10 70 Q 100 10 190 70" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 10 70 L 190 70" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="40" y1="70" x2="40" y2="47" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="70" y1="70" x2="70" y2="30" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="70" x2="100" y2="25" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="130" y1="70" x2="130" y2="30" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="160" y1="70" x2="160" y2="47" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="70" y1="30" x2="40" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="25" x2="70" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="25" x2="130" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="130" y1="30" x2="160" y2="70" stroke={strokeColor} strokeWidth="1.2" />
        </svg>
      );
    case 'monitor':
      return (
        <svg viewBox="0 0 200 80" className={`w-full h-auto ${className}`}>
          {/* Main Base Pratt Truss with lower apex (y=35) */}
          <path d="M 10 70 L 100 35 L 190 70 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 10 70 L 190 70" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="40" y1="70" x2="40" y2="58" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="70" y1="70" x2="70" y2="47" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="70" x2="100" y2="35" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="130" y1="70" x2="130" y2="47" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="160" y1="70" x2="160" y2="58" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="40" y1="58" x2="10" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="70" y1="47" x2="40" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="35" x2="70" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="35" x2="130" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="130" y1="47" x2="160" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="160" y1="58" x2="190" y2="70" stroke={strokeColor} strokeWidth="1.2" />

          {/* Raised Monitor Ventilation Frame at Apex */}
          {/* Vertical opening walls */}
          <line x1="80" y1="43" x2="80" y2="20" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="120" y1="43" x2="120" y2="20" stroke={strokeColor} strokeWidth="1.5" />
          {/* Sloped Top Cap */}
          <path d="M 75 20 L 100 14 L 125 20" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          {/* Ventilation slats (louvers) */}
          <line x1="80" y1="26" x2="90" y2="29" stroke={strokeColor} strokeWidth="1.0" />
          <line x1="80" y1="32" x2="90" y2="35" stroke={strokeColor} strokeWidth="1.0" />
          <line x1="120" y1="26" x2="110" y2="29" stroke={strokeColor} strokeWidth="1.0" />
          <line x1="120" y1="32" x2="110" y2="35" stroke={strokeColor} strokeWidth="1.0" />
        </svg>
      );
    case 'pratt':
    default:
      return (
        <svg viewBox="0 0 200 80" className={`w-full h-auto ${className}`}>
          <path d="M 10 70 L 100 20 L 190 70 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 10 70 L 190 70" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="40" y1="70" x2="40" y2="53" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="70" y1="70" x2="70" y2="36" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="70" x2="100" y2="20" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="130" y1="70" x2="130" y2="36" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="160" y1="70" x2="160" y2="53" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="40" y1="53" x2="10" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="70" y1="36" x2="40" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="20" x2="70" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="100" y1="20" x2="130" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="130" y1="36" x2="160" y2="70" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="160" y1="53" x2="190" y2="70" stroke={strokeColor} strokeWidth="1.2" />
        </svg>
      );
  }
};
