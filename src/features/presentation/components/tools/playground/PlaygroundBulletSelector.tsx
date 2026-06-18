import React from 'react';
import { CheckSquare } from 'lucide-react';

interface PlaygroundBulletSelectorProps {
  value: 'dot' | 'square' | 'check' | 'chevron' | 'arrow' | 'dash';
  onChange: (bullet: 'dot' | 'square' | 'check' | 'chevron' | 'arrow' | 'dash') => void;
  disabled?: boolean;
}

const BULLET_STYLES: Array<{ value: PlaygroundBulletSelectorProps['value']; label: string; preview: string }> = [
  { value: 'dot', label: 'Classic Dot', preview: '•' },
  { value: 'square', label: 'Square Block', preview: '■' },
  { value: 'check', label: 'Checkmark', preview: '✓' },
  { value: 'chevron', label: 'Chevron', preview: '›' },
  { value: 'arrow', label: 'Arrow Point', preview: '→' },
  { value: 'dash', label: 'Dash Rule', preview: '—' },
];

export const PlaygroundBulletSelector: React.FC<PlaygroundBulletSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
        <CheckSquare className="h-3.5 w-3.5" /> Custom Bullet Style
      </span>
      <div className="grid grid-cols-3 gap-1.5 rounded-lg border p-3 bg-muted/20">
        {BULLET_STYLES.map((b) => (
          <button
            key={b.value}
            disabled={disabled}
            onClick={() => onChange(b.value)}
            className={`flex flex-col items-center gap-1 p-2 rounded-md border text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              value === b.value
                ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                : 'border-transparent bg-background text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-sm font-bold leading-none">{b.preview}</span>
            <span className="text-[9px] uppercase tracking-wider">{b.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaygroundBulletSelector;
