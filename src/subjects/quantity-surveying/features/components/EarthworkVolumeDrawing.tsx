import React from 'react';

interface EarthworkVolumeDrawingProps {
  netVolume: number;
  bulkingFactor: number;
  currentStep?: number;
}

export const EarthworkVolumeDrawing: React.FC<EarthworkVolumeDrawingProps> = ({
  netVolume,
  bulkingFactor,
  currentStep = 0,
}) => {
  const looseVolume = netVolume * bulkingFactor;
  const backfillVolume = netVolume * 0.65; // displacement representation
  const footingVolume = netVolume * 0.35;

  return (
    <div className="w-full flex flex-col justify-between h-full bg-muted/20 p-4 border border-border/40 rounded-xl">
      <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-2 block text-center">
        Earthwork Volume Transformation
      </span>

      <div className="h-56 bg-background rounded-lg border border-border/20 relative flex items-center justify-center p-2">
        <svg viewBox="0 0 320 220" className="w-full h-full select-none overflow-visible">
          {/* Natural Ground Level (NGL) */}
          <line x1="10" y1="90" x2="310" y2="90" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 4" />
          <text x="15" y="84" className="fill-muted-foreground text-[7px] font-mono">EGL</text>

          {/* 1. Undisturbed Net In-Situ Block */}
          <g opacity={currentStep === 0 ? 1 : 0.25} className="transition-all duration-300">
            {/* The ground pit outline */}
            <rect x="25" y="90" width="70" height="70" fill="none" className="stroke-muted-foreground/40" strokeWidth="1" strokeDasharray="3 2" />
            
            {/* In-situ Soil Block */}
            <rect
              x="25"
              y="90"
              width="70"
              height="70"
              className={`transition-colors duration-300 ${
                currentStep === 0 ? 'fill-amber-600/35 stroke-amber-600 stroke-1.5' : 'fill-amber-800/10 stroke-muted-foreground/20'
              }`}
            />
            <text x="60" y="125" textAnchor="middle" className="fill-amber-900 dark:fill-amber-300 font-bold text-[9px]">NET</text>
            <text x="60" y="137" textAnchor="middle" className="fill-amber-800 dark:fill-amber-400 font-mono text-[8px]">{netVolume.toFixed(1)} m³</text>
            <text x="60" y="178" textAnchor="middle" className="fill-muted-foreground text-[8px] font-sans">In-Ground In-Situ</text>
          </g>

          {/* 2. Bulked Loose Pile */}
          <g opacity={currentStep === 1 ? 1 : 0.25} className="transition-all duration-300">
            {/* Loose soil pile representation (expanded heap on ground) */}
            <path
              d="M 120,90 Q 160,25 200,90 Z"
              className={`transition-colors duration-300 ${
                currentStep === 1 ? 'fill-amber-500/40 stroke-amber-500 stroke-1.5' : 'fill-amber-700/10 stroke-muted-foreground/20'
              }`}
            />
            {/* Air expansion particles/clouds */}
            {currentStep === 1 && (
              <path d="M 140,55 q 5,-5 10,0 q 10,-5 15,5" fill="none" className="stroke-amber-400" strokeWidth="0.75" />
            )}
            <text x="160" y="70" textAnchor="middle" className="fill-amber-900 dark:fill-amber-300 font-bold text-[9px]">BULKED</text>
            <text x="160" y="82" textAnchor="middle" className="fill-amber-800 dark:fill-amber-400 font-mono text-[8px]">{looseVolume.toFixed(1)} m³</text>
            <text x="160" y="178" textAnchor="middle" className="fill-muted-foreground text-[8px] font-sans">Loose (+{(bulkingFactor * 100 - 100).toFixed(0)}% Voids)</text>
          </g>

          {/* 3. Displaced Footing Backfill */}
          <g opacity={currentStep === 2 ? 1 : 0.25} className="transition-all duration-300">
            {/* Ground pit outline */}
            <rect x="225" y="90" width="70" height="70" fill="none" className="stroke-muted-foreground/30" strokeWidth="1" />
            
            {/* Displaced Concrete Footing Block */}
            <rect
              x="235"
              y="125"
              width="50"
              height="35"
              className="fill-blue-500/20 stroke-blue-500"
              strokeWidth="1.25"
            />
            <text x="260" y="140" textAnchor="middle" className="fill-blue-500 font-bold text-[8px]">Footing CC</text>
            <text x="260" y="151" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 font-mono text-[7px]">{footingVolume.toFixed(1)} m³</text>

            {/* Backfill soil surrounding the concrete */}
            <path
              d="M 225,90 L 225,160 L 295,160 L 295,90 L 285,90 L 285,125 L 235,125 L 235,90 Z"
              className={`transition-colors duration-300 ${
                currentStep === 2 ? 'fill-amber-700/30 stroke-amber-700/50' : 'fill-amber-800/5 stroke-muted-foreground/10'
              }`}
              strokeWidth="0.75"
            />
            
            <text x="260" y="105" textAnchor="middle" className="fill-amber-900 dark:fill-amber-300 font-bold text-[8px]">BACKFILL</text>
            <text x="260" y="116" textAnchor="middle" className="fill-amber-800 dark:fill-amber-400 font-mono text-[7px]">{backfillVolume.toFixed(1)} m³</text>
            <text x="260" y="178" textAnchor="middle" className="fill-muted-foreground text-[8px] font-sans">Net Backfill</text>
          </g>
        </svg>
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-2 leading-relaxed">
        {currentStep === 0 && 'Net undisturbed volume: Bill of Quantities (BoQ) is measured strictly in-situ in the ground.'}
        {currentStep === 1 && 'Loose bulked volume: Soil expands upon excavation, requiring extra transit volume allowance.'}
        {currentStep === 2 && 'Net Backfill: Calculated as the total excavation volume minus the displacement of concrete elements.'}
      </span>
    </div>
  );
};
