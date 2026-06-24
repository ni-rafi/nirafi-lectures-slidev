import React from 'react';

interface RetainingWallBBSDrawingProps {
  activeHighlight: 'stem' | 'base' | 'key' | 'none';
  className?: string;
}

export const RetainingWallBBSDrawing: React.FC<RetainingWallBBSDrawingProps> = ({
  activeHighlight,
  className = '',
}) => {
  // Helpers to check highlight state
  const isHighlightActive = (part: 'stem' | 'base' | 'key') => {
    return activeHighlight === part;
  };

  // Concrete monolithic path (Stem + Base + Shear Key)
  // Base top-left: 60,110; Stem bottom-left: 110,110; Stem top-left: 135,40; Stem top-right: 150,40
  // Heel top-right: 240,110; Heel bottom-right: 240,125
  // Shear key: right side x=145, bottom y=145, left side x=125
  // Toe bottom-left: 60,125
  const concretePath = `
    M 60,110 
    L 110,110 
    L 135,40 
    L 150,40 
    L 150,110 
    L 240,110 
    L 240,125 
    L 145,125 
    L 145,145 
    L 125,145 
    L 125,125 
    L 60,125 
    Z
  `.trim();

  return (
    <div className={`w-full flex flex-col justify-between bg-muted/20 p-4 border border-border/40 rounded-xl ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-2 block text-center">
        Cantilever Retaining Wall BBS detaling
      </span>

      <div className="h-44 bg-background rounded-lg border border-border/20 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 20 300 135" className="w-full h-full select-none overflow-visible">
          {/* Ground line backfill side */}
          <line x1="150" y1="45" x2="290" y2="45" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground/30" />
          <text x="260" y="40" className="fill-muted-foreground text-[8px] font-mono">Backfill</text>

          {/* Front ground line */}
          <line x1="10" y1="110" x2="60" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground/30" />

          {/* Monolithic Concrete Wall Outline */}
          <path
            d={concretePath}
            className={`transition-all duration-300 ${
              isHighlightActive('stem')
                ? 'fill-indigo-500/10 stroke-indigo-600 stroke-[2px]'
                : isHighlightActive('base')
                ? 'fill-amber-500/10 stroke-amber-500 stroke-[2px]'
                : isHighlightActive('key')
                ? 'fill-emerald-500/10 stroke-emerald-600 stroke-[2px]'
                : 'fill-muted/20 stroke-border/40'
            }`}
          />

          {/* STEEL REINFORCEMENT LAYERS */}

          {/* Stem Steel: Inside Vertical (Straight) & Outside Vertical (Inclined) */}
          <g className={`transition-all duration-300 ${
            isHighlightActive('stem') || activeHighlight === 'none'
              ? 'text-indigo-600 opacity-100'
              : 'text-muted-foreground/30 opacity-40'
          }`}>
            {/* Straight Vertical Bar on backfill side */}
            <path d="M 146,44 L 146,121" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 146,121 L 236,121" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Inclined Vertical Bar on tapered face */}
            <path d="M 139,44 L 114,106" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 114,106 L 64,121" fill="none" stroke="currentColor" strokeWidth="1.5" />
            
            {/* Vertical Stem text label */}
            <text x="160" y="70" className="fill-current text-[8px] font-mono font-bold">Stem Vertical</text>
          </g>

          {/* Base Steel: Top & Bottom Horizontal reinforcement grids */}
          <g className={`transition-all duration-300 ${
            isHighlightActive('base') || activeHighlight === 'none'
              ? 'text-amber-500 opacity-100'
              : 'text-muted-foreground/30 opacity-40'
          }`}>
            {/* Top Base steel */}
            <line x1="64" y1="114" x2="236" y2="114" stroke="currentColor" strokeWidth="1.5" />
            {/* Bottom Base steel */}
            <line x1="64" y1="121" x2="236" y2="121" stroke="currentColor" strokeWidth="1.5" />
            
            {/* Base steel label */}
            <text x="180" y="132" className="fill-current text-[8px] font-mono font-bold">Base Grids</text>
          </g>

          {/* Shear Key Steel: Dowel bars locking into base */}
          <g className={`transition-all duration-300 ${
            isHighlightActive('key') || activeHighlight === 'none'
              ? 'text-emerald-600 opacity-100'
              : 'text-muted-foreground/30 opacity-40'
          }`}>
            {/* Key vertical dowel */}
            <path d="M 135,100 L 135,141 L 141,141" fill="none" stroke="currentColor" strokeWidth="1.5" />
            
            {/* Shear key labels */}
            <text x="95" y="152" className="fill-current text-[8px] font-mono font-bold">Shear Key Dowel</text>
          </g>

          {/* Dimension Text overlays */}
          <text x="142" y="32" className="fill-muted-foreground text-[8px] font-mono">Top Width</text>
          <text x="90" y="105" className="fill-muted-foreground text-[8px] font-mono text-right">Bottom Width</text>
          <text x="50" y="145" className="fill-muted-foreground text-[8px] font-mono text-center">Shear Key</text>
        </svg>

        {activeHighlight !== 'none' && (
          <div className={`absolute bottom-2 left-2 right-2 border text-[9px] p-2 rounded-md font-mono flex items-center justify-between animate-fadeIn z-10 ${
            isHighlightActive('stem')
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
              : isHighlightActive('base')
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            {isHighlightActive('stem') && (
              <span>Stem: Inclined vertical bars must be estimated using Pythagorean rules for stem height and batter width.</span>
            )}
            {isHighlightActive('base') && (
              <span>Base: Horizontal reinforcement grids run in both directions for base slab toe and heel zones.</span>
            )}
            {isHighlightActive('key') && (
              <span>Shear Key: Dowel reinforcing anchors the shear key below the base slab heel joint.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
