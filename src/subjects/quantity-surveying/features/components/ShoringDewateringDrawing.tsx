import React from 'react';
import { Droplet, ArrowDown } from 'lucide-react';

interface ShoringDewateringDrawingProps {
  currentStep: number;
  className?: string;
}

export const ShoringDewateringDrawing: React.FC<ShoringDewateringDrawingProps> = ({
  currentStep,
  className = '',
}) => {
  const isShoringActive = currentStep === 1;
  const isDewateringActive = currentStep === 2;

  return (
    <div className={`w-full flex flex-col justify-between h-full bg-muted/20 p-4 border border-border/40 rounded-xl ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-3 block text-center">
        Trench Execution visualizer
      </span>

      <div className="h-56 bg-background rounded-lg border border-border/20 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 300 220" className="w-full h-full select-none overflow-visible">
          {/* Sub-grade Groundwater Table Zone */}
          <rect
            x="0"
            y="140"
            width="300"
            height="80"
            className={`transition-colors duration-300 ${
              isDewateringActive
                ? 'fill-blue-500/20 stroke-blue-500/40'
                : 'fill-blue-500/5 stroke-blue-500/10'
            }`}
            strokeWidth="1"
          />

          {/* Water level line */}
          <line
            x1="0"
            y1="140"
            x2="300"
            y2="140"
            className={`transition-colors duration-300 ${
              isDewateringActive ? 'stroke-blue-500 text-blue-500' : 'stroke-blue-500/30 text-blue-500/30'
            }`}
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Excavated Trench Box Outline */}
          <path
            d="M 60,30 L 60,180 L 240,180 L 240,30"
            fill="none"
            className="stroke-muted-foreground/30"
            strokeWidth="2"
          />

          {/* Trench fill texture representing excavated soil */}
          <rect x="62" y="30" width="176" height="150" fill="none" />

          {/* Timbering & Shoring Struts */}
          {/* Vertical Shore planks left */}
          <rect
            x="54"
            y="30"
            width="6"
            height="150"
            rx="1"
            className={`transition-all duration-300 ${
              isShoringActive
                ? 'fill-primary stroke-primary/80 stroke-1 shadow-sm'
                : 'fill-muted stroke-border/40'
            }`}
            opacity={isShoringActive ? 1 : 0.4}
          />
          {/* Vertical Shore planks right */}
          <rect
            x="240"
            y="30"
            width="6"
            height="150"
            rx="1"
            className={`transition-all duration-300 ${
              isShoringActive
                ? 'fill-primary stroke-primary/80 stroke-1 shadow-sm'
                : 'fill-muted stroke-border/40'
            }`}
            opacity={isShoringActive ? 1 : 0.4}
          />

          {/* Horizontal struts bracing the trench */}
          <rect
            x="60"
            y="70"
            width="180"
            height="8"
            rx="1"
            className={`transition-all duration-300 ${
              isShoringActive
                ? 'fill-primary stroke-primary/80 stroke-1'
                : 'fill-muted stroke-border/30'
            }`}
            opacity={isShoringActive ? 1 : 0.3}
          />
          <rect
            x="60"
            y="130"
            width="180"
            height="8"
            rx="1"
            className={`transition-all duration-300 ${
              isShoringActive
                ? 'fill-primary stroke-primary/80 stroke-1'
                : 'fill-muted stroke-border/30'
            }`}
            opacity={isShoringActive ? 1 : 0.3}
          />

          {/* Labels & Overlay Banners */}
          <text x="150" y="20" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono uppercase">Excavated Trench (Width &gt; 1.5m)</text>

          {isShoringActive && (
            <g className="animate-fadeIn">
              <text x="150" y="105" textAnchor="middle" className="fill-primary font-bold text-[9px] uppercase tracking-wider">Timber struts (Bracing)</text>
              <text x="35" y="110" textAnchor="middle" className="fill-primary font-bold text-[8px] rotate-90">Shoring Wall</text>
            </g>
          )}

          {isDewateringActive && (
            <g className="animate-fadeIn">
              {/* Dewatering Pump Visual Arrow */}
              <line x1="150" y1="110" x2="150" y2="160" className="stroke-blue-500" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="150" cy="110" r="4" className="fill-blue-500" />
              <text x="150" y="100" textAnchor="middle" className="fill-blue-500 font-bold text-[9px] uppercase tracking-wider">Pump Inlet (Dewatering)</text>
              <text x="150" y="195" textAnchor="middle" className="fill-blue-500/80 font-mono text-[8px] uppercase">Water table drawdown</text>
            </g>
          )}
        </svg>

        {/* Sync Indicator Banner */}
        {isDewateringActive && (
          <div className="absolute bottom-2 left-2 right-2 bg-blue-500/10 border border-blue-500/30 text-blue-500 text-[10px] p-2 rounded-md font-mono flex items-center justify-between animate-fadeIn z-10">
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 animate-bounce" /> Sub-grade Groundwater Table
            </span>
            <ArrowDown className="w-3.5 h-3.5 animate-pulse" />
          </div>
        )}
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-2 leading-relaxed">
        {isShoringActive && 'Shoring prevents side-soil collapse in weak soil when trench depth exceeds 1.5m.'}
        {isDewateringActive && 'Dewatering involves active pumping to keep the foundation bed dry for concrete casting.'}
        {!isShoringActive && !isDewateringActive && 'Visualizer shows safety timber shoring and dewatering pump placements.'}
      </span>
    </div>
  );
};
