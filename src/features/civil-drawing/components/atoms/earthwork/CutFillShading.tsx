import React from 'react';
import { EarthworkRegion } from '../../../engines/cutFillPolygonEngine';

interface CutFillShadingProps {
  regions: EarthworkRegion[];
  scaleFactor?: number; // Divisor for area calculation (e.g. 1,000,000 if coordinates are in mm)
  showLabels?: boolean;
}

export const CutFillShading: React.FC<CutFillShadingProps> = ({
  regions,
  scaleFactor = 1,
  showLabels = true,
}) => {
  return (
    <g>
      {regions.map((region, idx) => {
        const isCut = region.type === 'cut';
        
        // Dynamic colors using Tailwind classes: red/destructive for cut, green/primary for fill
        const fillClass = isCut
          ? 'fill-red-500/20 stroke-red-500/40 dark:fill-red-400/20 dark:stroke-red-400/40'
          : 'fill-emerald-500/20 stroke-emerald-500/40 dark:fill-emerald-400/20 dark:stroke-emerald-400/40';

        const strokeDash = isCut ? '3,3' : 'none';
        
        // Format the area output
        const displayArea = region.area / scaleFactor;
        const labelText = `${isCut ? 'Cut' : 'Fill'}: ${displayArea.toFixed(2)} m²`;

        return (
          <g key={idx}>
            {/* Shaded polygon path */}
            <path
              d={region.path}
              className={`${fillClass} stroke-[1.5] transition-all duration-200 hover:opacity-85`}
              strokeDasharray={strokeDash}
            />

            {/* Label at Centroid */}
            {showLabels && region.area > 5 && (
              <g transform={`translate(${region.centroid.x}, ${region.centroid.y})`}>
                {/* Visual backdrop for label readability */}
                <rect
                  x="-42"
                  y="-8"
                  width="84"
                  height="16"
                  rx="3"
                  className="fill-background/90 dark:fill-background/90 stroke-foreground/15 stroke-[0.5] shadow-sm pointer-events-none"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fontWeight="600"
                  className={`${
                    isCut ? 'fill-red-600 dark:fill-red-400' : 'fill-emerald-600 dark:fill-emerald-400'
                  } font-mono`}
                  pointerEvents="none"
                >
                  {labelText}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
