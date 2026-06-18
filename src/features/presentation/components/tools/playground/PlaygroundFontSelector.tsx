import React from 'react';
import { Type } from 'lucide-react';
import SearchableFontSelect from './SearchableFontSelect';

interface PlaygroundFontSelectorProps {
  fontSans: string;
  fontHeader: string;
  onSansChange: (font: string) => void;
  onHeaderChange: (font: string) => void;
  disabled?: boolean;
}

export const PlaygroundFontSelector: React.FC<PlaygroundFontSelectorProps> = ({
  fontSans,
  fontHeader,
  onSansChange,
  onHeaderChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
        <Type className="h-3.5 w-3.5" /> Presentation Typography
      </span>
      <div className="grid grid-cols-1 gap-3.5 rounded-lg border p-3 bg-muted/20">
        <SearchableFontSelect
          label="Header Font Family"
          value={fontHeader}
          onChange={onHeaderChange}
          disabled={disabled}
        />
        <SearchableFontSelect
          label="Body Text Font Family"
          value={fontSans}
          onChange={onSansChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default PlaygroundFontSelector;
