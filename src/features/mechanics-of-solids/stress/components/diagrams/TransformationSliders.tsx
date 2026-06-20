import React, { useEffect, useState } from 'react';

interface TransformationSlidersProps {
  length: number;
  inspectX: number;
  setInspectX: (x: number | null) => void;
  yMinMm: number;
  yMaxMm: number;
  clampedYMm: number;
  setInspectY: (y: number) => void;
  inspectAngle: number;
  setInspectAngle: (angle: number) => void;
}

export const TransformationSliders: React.FC<TransformationSlidersProps> = ({
  length,
  inspectX,
  setInspectX,
  yMinMm,
  yMaxMm,
  clampedYMm,
  setInspectY,
  inspectAngle,
  setInspectAngle,
}) => {
  const angleDeg = Math.round((inspectAngle * 180) / Math.PI);

  const [xInput, setXInput] = useState(inspectX.toFixed(2));
  const [yInput, setYInput] = useState(clampedYMm.toFixed(1));
  const [angleInput, setAngleInput] = useState(angleDeg.toString());

  useEffect(() => {
    setXInput(inspectX.toFixed(2));
  }, [inspectX]);

  useEffect(() => {
    setYInput(clampedYMm.toFixed(1));
  }, [clampedYMm]);

  useEffect(() => {
    setAngleInput(angleDeg.toString());
  }, [angleDeg]);

  // Handle X changes
  const handleXSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setInspectX(val);
  };
  const handleXNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setXInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) setInspectX(Math.max(0, Math.min(length, num)));
  };

  // Handle Y changes
  const handleYSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setInspectY(val);
  };
  const handleYNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setYInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) setInspectY(Math.max(yMinMm, Math.min(yMaxMm, num)));
  };

  // Handle Angle changes
  const handleAngleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setInspectAngle((val * Math.PI) / 180);
  };
  const handleAngleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAngleInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const clamped = Math.max(-90, Math.min(90, num));
      setInspectAngle((clamped * Math.PI) / 180);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full select-none">
      {/* Inspect X Card */}
      <div className="flex flex-col gap-2.5 p-3.5 bg-muted/10 border border-border/30 rounded-xl shadow-sm justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Inspect Position (x)</span>
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              min={0}
              max={length}
              step={0.1}
              value={xInput}
              onChange={handleXNumber}
              onBlur={() => setXInput(inspectX.toFixed(2))}
              className="w-12 rounded border border-border bg-background px-1 py-0.5 text-center text-xs font-mono font-bold text-primary focus:border-primary focus:outline-none"
            />
            <span className="text-xs font-bold text-muted-foreground">m</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-1">
          <input
            type="range"
            min={0}
            max={length}
            step={0.01}
            value={inspectX}
            onChange={handleXSlider}
            className="w-full accent-primary cursor-ew-resize h-1.5 bg-muted-foreground/20 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] font-mono font-bold text-muted-foreground/60 mt-0.5">
            <span>0.00m</span>
            <span className="text-[8px] opacity-70">{(length / 2).toFixed(1)}m</span>
            <span>{length.toFixed(1)}m</span>
          </div>
        </div>
      </div>

      {/* Inspect Y Card */}
      <div className="flex flex-col gap-2.5 p-3.5 bg-muted/10 border border-border/30 rounded-xl shadow-sm justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Inspect Height (y)</span>
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              min={yMinMm}
              max={yMaxMm}
              step={1}
              value={yInput}
              onChange={handleYNumber}
              onBlur={() => setYInput(clampedYMm.toFixed(1))}
              className="w-12 rounded border border-border bg-background px-1 py-0.5 text-center text-xs font-mono font-bold text-primary focus:border-primary focus:outline-none"
            />
            <span className="text-xs font-bold text-muted-foreground">mm</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-1">
          <input
            type="range"
            min={yMinMm}
            max={yMaxMm}
            step={1}
            value={clampedYMm}
            onChange={handleYSlider}
            className="w-full accent-primary cursor-ew-resize h-1.5 bg-muted-foreground/20 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] font-mono font-bold text-muted-foreground/60 mt-0.5">
            <span>{yMinMm.toFixed(0)}mm</span>
            <span
              onClick={() => setInspectY(0)}
              className={`cursor-pointer hover:text-primary transition-colors ${
                Math.abs(clampedYMm) < 0.1 ? "text-primary font-black opacity-90" : "opacity-60"
              }`}
              title="Reset to Neutral Axis"
            >
              0mm (N.A.)
            </span>
            <span>{yMaxMm.toFixed(0)}mm</span>
          </div>
        </div>
      </div>

      {/* Inspect Angle Card */}
      <div className="flex flex-col gap-2.5 p-3.5 bg-muted/10 border border-border/30 rounded-xl shadow-sm justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Rotation Angle (θ)</span>
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              min={-90}
              max={90}
              value={angleInput}
              onChange={handleAngleNumber}
              onBlur={() => setAngleInput(angleDeg.toString())}
              className="w-12 rounded border border-border bg-background px-1 py-0.5 text-center text-xs font-mono font-bold text-primary focus:border-primary focus:outline-none"
            />
            <span className="text-xs font-bold text-muted-foreground">°</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-1">
          <input
            type="range"
            min={-90}
            max={90}
            step={1}
            value={angleDeg}
            onChange={handleAngleSlider}
            className="w-full accent-primary cursor-ew-resize h-1.5 bg-muted-foreground/20 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] font-mono font-bold text-muted-foreground/60 mt-0.5">
            <span>-90°</span>
            <span
              onClick={() => setInspectAngle(0)}
              className={`cursor-pointer hover:text-primary transition-colors ${
                angleDeg === 0 ? "text-primary font-black opacity-90" : "opacity-60"
              }`}
              title="Reset to 0°"
            >
              0°
            </span>
            <span>90°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
