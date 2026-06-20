import React, { useEffect, useState } from 'react';

interface InteractiveAngleDialProps {
  angleRad: number;
  onChange: (angleRad: number) => void;
}

export const InteractiveAngleDial: React.FC<InteractiveAngleDialProps> = ({ angleRad, onChange }) => {
  const angleDeg = Math.round((angleRad * 180) / Math.PI);
  const [inputValue, setInputValue] = useState(angleDeg.toString());

  // Synchronize local input string state when the parent angle changes
  useEffect(() => {
    setInputValue(angleDeg.toString());
  }, [angleDeg]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const deg = parseFloat(e.target.value);
    if (!isNaN(deg)) {
      onChange((deg * Math.PI) / 180);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const deg = parseFloat(val);
    if (!isNaN(deg)) {
      const clamped = Math.max(-90, Math.min(90, deg));
      onChange((clamped * Math.PI) / 180);
    }
  };

  const handleBlur = () => {
    setInputValue(angleDeg.toString());
  };

  const handleReset = () => {
    onChange(0);
  };

  return (
    <div className="flex flex-col gap-2.5 p-3.5 bg-muted/20 border border-border/30 rounded-2xl backdrop-blur-md w-full select-none shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Angle (θ)</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={-90}
            max={90}
            value={inputValue}
            onChange={handleNumberChange}
            onBlur={handleBlur}
            className="w-14 rounded border border-border bg-background px-1.5 py-0.5 text-center text-sm font-mono font-bold text-primary focus:border-primary focus:outline-none"
          />
          <span className="text-sm font-bold text-muted-foreground">°</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <input
          type="range"
          min={-90}
          max={90}
          step={1}
          value={angleDeg}
          onChange={handleSliderChange}
          className="w-full accent-primary cursor-ew-resize h-1.5 bg-muted-foreground/20 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] font-mono font-bold text-muted-foreground/80 mt-0.5">
          <span>-90°</span>
          <span
            onClick={handleReset}
            className={`cursor-pointer hover:text-primary transition-colors ${
              angleDeg === 0 ? "text-primary font-black" : ""
            }`}
            title="Reset to 0°"
          >
            0°
          </span>
          <span>90°</span>
        </div>
      </div>
    </div>
  );
};
