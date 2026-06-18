import React from 'react';
import { Palette } from 'lucide-react';

interface PlaygroundHueSliderProps {
  value: number;
  onChange: (hue: number) => void;
  disabled?: boolean;
}

export const PlaygroundHueSlider: React.FC<PlaygroundHueSliderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
        <Palette className="h-3.5 w-3.5" /> Accent Color Hue Shifting
      </span>
      <div className="flex flex-col gap-1.5 rounded-lg border p-3 bg-muted/20">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Primary Hue</span>
          <span className="font-mono">{value}°</span>
        </div>
        {/* Spectral Slider Track */}
        <div className="relative flex items-center h-4 rounded-md overflow-hidden">
          <div 
            className="absolute inset-0 h-full w-full"
            style={{
              background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
            }}
          />
          <input
            type="range"
            min="0"
            max="360"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full opacity-100 cursor-pointer h-full accent-white bg-transparent absolute inset-0 mix-blend-difference disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
          Updates core presentation borders, badges, buttons, and card washes dynamically using 60-30-10 OKLCH calculations.
        </p>
      </div>
    </div>
  );
};

export default PlaygroundHueSlider;
