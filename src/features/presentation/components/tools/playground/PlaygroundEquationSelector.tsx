import React from 'react';
import { Layout } from 'lucide-react';

interface PlaygroundEquationSelectorProps {
  value: 'default' | 'none' | 'tinted' | 'bordered';
  onChange: (bg: 'default' | 'none' | 'tinted' | 'bordered') => void;
  disabled?: boolean;
}

const EQUATION_BACKGROUNDS: Array<{ value: PlaygroundEquationSelectorProps['value']; label: string; desc: string }> = [
  { value: 'default', label: 'Default Card', desc: 'White card with subtle shadows' },
  { value: 'none', label: 'No Background', desc: 'Transparent container' },
  { value: 'tinted', label: 'Tinted Accent', desc: 'Soft color wash with borders' },
  { value: 'bordered', label: 'Double Border', desc: 'Thick outline, clean white fill' },
];

export const PlaygroundEquationSelector: React.FC<PlaygroundEquationSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
        <Layout className="h-3.5 w-3.5" /> Equation Canvas Block
      </span>
      <div className="flex flex-col gap-1.5 rounded-lg border p-3 bg-muted/20">
        {EQUATION_BACKGROUNDS.map((eq) => (
          <button
            key={eq.value}
            disabled={disabled}
            onClick={() => onChange(eq.value)}
            className={`flex items-center justify-between p-2 rounded-md border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              value === eq.value
                ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                : 'border-transparent bg-background text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{eq.label}</span>
              <span className="text-[9px] text-muted-foreground/80 mt-0.5 font-normal">{eq.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaygroundEquationSelector;
