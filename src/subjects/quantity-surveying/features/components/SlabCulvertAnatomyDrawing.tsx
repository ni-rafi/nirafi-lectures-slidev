import React from 'react';

interface SlabCulvertAnatomyDrawingProps {
  activeHighlight: 'abutment' | 'wingwall' | 'deck' | 'bearing' | 'none';
  className?: string;
}

export const SlabCulvertAnatomyDrawing: React.FC<SlabCulvertAnatomyDrawingProps> = ({
  activeHighlight,
  className = '',
}) => {
  const isHighlightActive = (part: typeof activeHighlight) => {
    return activeHighlight === part;
  };

  return (
    <div className={`w-full flex flex-col justify-between bg-muted/20 p-4 border border-border/40 rounded-xl ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-2 block text-center">
        RCC Slab Culvert: Elevation & Plan views
      </span>

      <div className="h-44 bg-background rounded-lg border border-border/20 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 10 300 135" className="w-full h-full select-none overflow-visible">
          {/* SECTION ELEVATION (LEFT) */}
          <g>
            <text x="75" y="25" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono font-bold">Cross Section Elevation</text>
            
            {/* Ground line */}
            <line x1="10" y1="110" x2="140" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground/30" />

            {/* Left Footing */}
            <rect x="40" y="105" width="25" height="10" className="fill-muted/20 stroke-border/40" />
            {/* Right Footing */}
            <rect x="95" y="105" width="25" height="10" className="fill-muted/20 stroke-border/40" />

            {/* Left Abutment Wall */}
            <rect
              x="45"
              y="65"
              width="15"
              height="40"
              className={`transition-all duration-300 ${
                isHighlightActive('abutment')
                  ? 'fill-indigo-500/20 stroke-indigo-600 stroke-[2px]'
                  : 'fill-muted/30 stroke-border/40'
              }`}
            />
            
            {/* Right Abutment Wall */}
            <rect
              x="100"
              y="65"
              width="15"
              height="40"
              className={`transition-all duration-300 ${
                isHighlightActive('abutment')
                  ? 'fill-indigo-500/20 stroke-indigo-600 stroke-[2px]'
                  : 'fill-muted/30 stroke-border/40'
              }`}
            />

            {/* Deck Slab */}
            <rect
              x="45"
              y="53"
              width="70"
              height="12"
              className={`transition-all duration-300 ${
                isHighlightActive('deck')
                  ? 'fill-amber-500/20 stroke-amber-500 stroke-[2px]'
                  : 'fill-muted/10 stroke-border/40'
              }`}
            />

            {/* Slab Bearing Zones (Red highlight at joints) */}
            <rect
              x="45"
              y="64.5"
              width="15"
              height="1.5"
              className={`transition-all duration-300 ${
                isHighlightActive('bearing')
                  ? 'fill-red-500 stroke-red-600 opacity-100'
                  : 'fill-transparent stroke-transparent opacity-0'
              }`}
            />
            <rect
              x="100"
              y="64.5"
              width="15"
              height="1.5"
              className={`transition-all duration-300 ${
                isHighlightActive('bearing')
                  ? 'fill-red-500 stroke-red-600 opacity-100'
                  : 'fill-transparent stroke-transparent opacity-0'
              }`}
            />

            {/* Elevation Labels */}
            {isHighlightActive('bearing') && (
              <g className="text-red-500 font-bold font-mono text-[7px] animate-fadeIn">
                <text x="35" y="60" textAnchor="end">Slab Bearing (Deducted)</text>
                <line x1="38" y1="58" x2="48" y2="65" stroke="currentColor" strokeWidth="0.8" />
              </g>
            )}
            <text x="80" y="80" className="fill-muted-foreground text-[7px] font-mono text-center" textAnchor="middle">Water Channel</text>
          </g>

          {/* TOP DOWN PLAN VIEW (RIGHT) */}
          <g>
            <text x="225" y="25" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono font-bold">Top-Down Plan View</text>
            
            {/* Water Flow Channel Arrow */}
            <path d="M 225,120 L 225,35 M 221,43 L 225,35 L 229,43" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
            <text x="230" y="115" className="fill-muted-foreground/40 text-[6px] font-mono">Water Flow</text>

            {/* Left Abutment Rect */}
            <rect
              x="185"
              y="40"
              width="10"
              height="70"
              className={`transition-all duration-300 ${
                isHighlightActive('abutment')
                  ? 'fill-indigo-500/20 stroke-indigo-600 stroke-[1.5px]'
                  : 'fill-muted/30 stroke-border/40'
              }`}
            />

            {/* Right Abutment Rect */}
            <rect
              x="255"
              y="40"
              width="10"
              height="70"
              className={`transition-all duration-300 ${
                isHighlightActive('abutment')
                  ? 'fill-indigo-500/20 stroke-indigo-600 stroke-[1.5px]'
                  : 'fill-muted/30 stroke-border/40'
              }`}
            />

            {/* Flared Wing Walls (45 degree angled rectangular paths) */}
            {/* Top-Left Wing Wall */}
            <line
              x1="185" y1="40" x2="165" y2="20"
              className={`transition-all duration-300 ${
                isHighlightActive('wingwall') ? 'stroke-indigo-600 stroke-[4px]' : 'stroke-border/40 stroke-[2px]'
              }`}
            />
            {/* Bottom-Left Wing Wall */}
            <line
              x1="185" y1="110" x2="165" y2="130"
              className={`transition-all duration-300 ${
                isHighlightActive('wingwall') ? 'stroke-indigo-600 stroke-[4px]' : 'stroke-border/40 stroke-[2px]'
              }`}
            />
            {/* Top-Right Wing Wall */}
            <line
              x1="265" y1="40" x2="285" y2="20"
              className={`transition-all duration-300 ${
                isHighlightActive('wingwall') ? 'stroke-indigo-600 stroke-[4px]' : 'stroke-border/40 stroke-[2px]'
              }`}
            />
            {/* Bottom-Right Wing Wall */}
            <line
              x1="265" y1="110" x2="285" y2="130"
              className={`transition-all duration-300 ${
                isHighlightActive('wingwall') ? 'stroke-indigo-600 stroke-[4px]' : 'stroke-border/40 stroke-[2px]'
              }`}
            />

            {/* Overlying Deck Slab (Dashed transparent fill) */}
            <rect
              x="185"
              y="45"
              width="80"
              height="60"
              fill="none"
              className={`transition-all duration-300 stroke-dasharray-[2 2] ${
                isHighlightActive('deck')
                  ? 'stroke-amber-500 stroke-[2px] fill-amber-500/5'
                  : 'stroke-muted-foreground/30 fill-transparent'
              }`}
            />

            {/* Plan Labels */}
            {isHighlightActive('wingwall') && (
              <text x="155" y="15" className="fill-indigo-600 text-[8px] font-mono font-bold animate-fadeIn">Flared Wing Wall</text>
            )}
            {isHighlightActive('abutment') && (
              <text x="180" y="122" className="fill-indigo-600 text-[8px] font-mono font-bold animate-fadeIn" textAnchor="end">Abutment</text>
            )}
          </g>
        </svg>

        {activeHighlight !== 'none' && (
          <div className="absolute bottom-2 left-2 right-2 bg-background/90 border border-border text-[9px] px-2 py-1.5 rounded-md font-mono flex items-center justify-between shadow-sm animate-fadeIn z-10">
            {isHighlightActive('abutment') && (
              <span>Abutments: Parallel supports that take the deck slab loads and retain the earthen approach ramp.</span>
            )}
            {isHighlightActive('wingwall') && (
              <span>Wing Walls: Flared, angled walls that anchor the abutment and guide river/water flow under the road.</span>
            )}
            {isHighlightActive('deck') && (
              <span>Deck Slab: The top RCC load-bearing deck that spans across the water stream channel.</span>
            )}
            {isHighlightActive('bearing') && (
              <span className="text-red-600 dark:text-red-400 font-bold">Deduction Rule: Subtract joint overlap volume from abutment concrete logs.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
