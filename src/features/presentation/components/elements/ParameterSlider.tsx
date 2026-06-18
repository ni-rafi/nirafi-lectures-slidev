import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';

interface ParameterSliderProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  displayValue?: string;
  className?: string;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
  displayValue,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  return (
    <div className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-all ${
      isBlog ? 'bg-transparent border-border/30 shadow-none' : 'bg-card border-border/60 shadow-xs'
    } ${className}`}>
      <label className="text-muted-foreground font-sans text-xs flex justify-between items-center select-none">
        <span>{label}</span>
        <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">
          {displayValue !== undefined ? displayValue : `${value}${unit}`}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary cursor-pointer"
      />
    </div>
  );
};

export default ParameterSlider;
