import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface ConcreteMixVolumeDrawingProps {
  dryVolume: number;
  cementBags: number;
  sandVol: number;
  stoneVol: number;
  sandPart: number;
  stonePart: number;
  className?: string;
}

export const ConcreteMixVolumeDrawing: React.FC<ConcreteMixVolumeDrawingProps> = ({
  dryVolume,
  cementBags,
  sandVol,
  stoneVol,
  sandPart,
  stonePart,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const totalParts = 1 + sandPart + stonePart;
  const totalHeight = 120;
  const cementH = (1 / totalParts) * totalHeight;
  const sandH = (sandPart / totalParts) * totalHeight;
  const stoneH = (stonePart / totalParts) * totalHeight;

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none';

  return (
    <div className={`${containerClasses} ${className}`}>
      <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary mb-3">
        Mix Volume Proportions
      </span>
      <svg width="240" height="150" viewBox="0 0 240 150" className="overflow-visible select-none">
        {/* Stone/Aggregates layer (Bottom) - var(--chart-3) */}
        <rect x="20" y={130 - stoneH} width="150" height={stoneH} fill="var(--chart-3)" rx="4" />
        <text x="95" y={130 - (stoneH / 2) + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
          Aggregate ({stoneVol.toFixed(1)} cft)
        </text>

        {/* Sand layer (Middle) - var(--chart-2) */}
        <rect x="20" y={130 - stoneH - sandH} width="150" height={sandH} fill="var(--chart-2)" rx="4" />
        <text x="95" y={130 - stoneH - (sandH / 2) + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
          Sand ({sandVol.toFixed(1)} cft)
        </text>

        {/* Cement layer (Top) - var(--chart-1) */}
        <rect x="20" y={130 - stoneH - sandH - cementH} width="150" height={cementH} fill="var(--chart-1)" rx="4" />
        <text x="95" y={130 - stoneH - sandH - (cementH / 2) + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
          Cement ({cementBags.toFixed(1)} bags)
        </text>

        {/* Total Height line bracket */}
        <path d="M185,10 L190,10 L190,130 L185,130" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="196" y="70" fill="currentColor" fontSize="9" fontWeight="extrabold" textAnchor="start">
          Dry {dryVolume.toFixed(0)} cft
        </text>
      </svg>
    </div>
  );
};
export default ConcreteMixVolumeDrawing;
