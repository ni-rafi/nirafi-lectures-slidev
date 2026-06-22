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
  const totalHeight = 200;
  const cementH = (1 / totalParts) * totalHeight;
  const sandH = (sandPart / totalParts) * totalHeight;
  const stoneH = (stonePart / totalParts) * totalHeight;

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full h-full justify-center min-h-[300px]';

  return (
    <div className={`${containerClasses} ${className}`}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-5">
        Mix Volume Proportions
      </span>
      <svg width="340" height="230" viewBox="0 0 340 230" className="overflow-visible select-none">
        {/* Stone/Aggregates layer (Bottom) - var(--chart-3) */}
        <rect x="15" y={210 - stoneH} width="240" height={stoneH} fill="var(--chart-3)" rx="6" />
        <text x="135" y={210 - (stoneH / 2) + 4} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
          Aggregate ({stoneVol.toFixed(1)} cft)
        </text>

        {/* Sand layer (Middle) - var(--chart-2) */}
        <rect x="15" y={210 - stoneH - sandH} width="240" height={sandH} fill="var(--chart-2)" rx="6" />
        <text x="135" y={210 - stoneH - (sandH / 2) + 4} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
          Sand ({sandVol.toFixed(1)} cft)
        </text>

        {/* Cement layer (Top) - var(--chart-1) */}
        <rect x="15" y={210 - stoneH - sandH - cementH} width="240" height={cementH} fill="var(--chart-1)" rx="6" />
        <text x="135" y={210 - stoneH - sandH - (cementH / 2) + 4} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
          Cement ({cementBags.toFixed(1)} bags)
        </text>

        {/* Total Height line bracket */}
        <path d="M275,10 L282,10 L282,210 L275,210" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="292" y="115" fill="currentColor" fontSize="10" fontWeight="extrabold" textAnchor="start">
          Dry {dryVolume.toFixed(0)} cft
        </text>
      </svg>
    </div>
  );
};
export default ConcreteMixVolumeDrawing;
