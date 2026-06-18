import React from 'react';
import { Layout } from 'lucide-react';

interface PlaygroundFooterSelectorProps {
  value: 'fraction' | 'prefixed' | 'progress-bar' | 'hidden';
  onChange: (footer: 'fraction' | 'prefixed' | 'progress-bar' | 'hidden') => void;
  disabled?: boolean;
}

const FOOTER_STYLES: Array<{ value: PlaygroundFooterSelectorProps['value']; label: string; desc: string }> = [
  { value: 'fraction', label: 'Fraction Code', desc: 'Active / Total (e.g. 3 / 12)' },
  { value: 'prefixed', label: 'Prefixed Text', desc: 'Slide number prefix (e.g. Slide 3 of 12)' },
  { value: 'progress-bar', label: 'Progress Line', desc: 'Hide numbering text, keep bottom progress bar' },
  { value: 'hidden', label: 'Hidden Numbering', desc: 'Hide slide counter text, keep branding' },
];

export const PlaygroundFooterSelector: React.FC<PlaygroundFooterSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
        <Layout className="h-3.5 w-3.5" /> Footer & Slide Counter
      </span>
      <div className="flex flex-col gap-1.5 rounded-lg border p-3 bg-muted/20">
        {FOOTER_STYLES.map((fs) => (
          <button
            key={fs.value}
            disabled={disabled}
            onClick={() => onChange(fs.value)}
            className={`flex items-center justify-between p-2 rounded-md border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              value === fs.value
                ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                : 'border-transparent bg-background text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{fs.label}</span>
              <span className="text-[9px] text-muted-foreground/80 mt-0.5 font-normal">{fs.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaygroundFooterSelector;
