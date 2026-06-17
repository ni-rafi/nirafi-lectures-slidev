import React, { useEffect, useRef } from 'react';
import { SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SlideSettings {
  scale: 'fit' | '1:1';
  invert: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  hueRotate: number;
  hideIdleCursor: boolean;
  wakeLock: boolean;
}

interface SettingsPopoverProps {
  settings: SlideSettings;
  onSettingsChange: (settings: Partial<SlideSettings>) => void;
  onClose: () => void;
}

export const DEFAULT_SETTINGS: SlideSettings = {
  scale: 'fit',
  invert: false,
  brightness: 1.0,
  contrast: 1.0,
  saturation: 1.0,
  sepia: 0.0,
  hueRotate: 0,
  hideIdleCursor: false,
  wakeLock: false,
};

/**
 * SettingsPopover displays a premium floating configuration panel above the toolbar settings button.
 * Enables styling filters (brightness, invert, saturation), scale selection, and wake locks.
 */
export const SettingsPopover: React.FC<SettingsPopoverProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close Settings panel when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-settings-btn]')
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleResetFilters = () => {
    onSettingsChange({
      invert: false,
      brightness: 1.0,
      contrast: 1.0,
      saturation: 1.0,
      sepia: 0.0,
      hueRotate: 0,
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute bottom-20 right-6 z-50 flex w-[300px] flex-col gap-4 rounded-xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md select-none text-xs text-foreground animate-in slide-in-from-bottom-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <span className="flex items-center gap-1.5 font-bold text-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Presentation Settings
        </span>
        <button
          onClick={onClose}
          className="rounded-sm opacity-70 hover:opacity-100 hover:bg-accent p-0.5"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Slide Scale */}
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-muted-foreground">Slide Scale</span>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-accent/40 p-0.5">
          <button
            onClick={() => onSettingsChange({ scale: 'fit' })}
            className={`rounded-md py-1.5 font-medium transition-all ${
              settings.scale === 'fit' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Fit Screen
          </button>
          <button
            onClick={() => onSettingsChange({ scale: '1:1' })}
            className={`rounded-md py-1.5 font-medium transition-all ${
              settings.scale === '1:1' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            1:1 Pixel Match
          </button>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-2.5 py-1 border-t border-b">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-semibold text-muted-foreground">Hide Idle Cursor</span>
          <input
            type="checkbox"
            checked={settings.hideIdleCursor}
            onChange={(e) => onSettingsChange({ hideIdleCursor: e.target.checked })}
            className="h-3.5 w-7 cursor-pointer appearance-none rounded-full bg-muted checked:bg-primary relative before:absolute before:h-2.5 before:w-2.5 before:rounded-full before:bg-background before:top-0.5 before:left-0.5 checked:before:left-4 before:transition-all"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-semibold text-muted-foreground">Wake Lock (Keep Screen On)</span>
          <input
            type="checkbox"
            checked={settings.wakeLock}
            onChange={(e) => onSettingsChange({ wakeLock: e.target.checked })}
            className="h-3.5 w-7 cursor-pointer appearance-none rounded-full bg-muted checked:bg-primary relative before:absolute before:h-2.5 before:w-2.5 before:rounded-full before:bg-background before:top-0.5 before:left-0.5 checked:before:left-4 before:transition-all"
          />
        </label>
      </div>

      {/* CSS Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-muted-foreground">Projector CSS Filters</span>
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            className="h-6 gap-1 px-1.5 text-[10px] text-muted-foreground hover:text-foreground rounded-md"
          >
            <RotateCcw className="h-2.5 w-2.5" /> Reset
          </Button>
        </div>

        {/* Filter Sliders */}
        <div className="flex flex-col gap-2">
          {/* Brightness */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Brightness</span>
              <span>{Math.round(settings.brightness * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={settings.brightness}
              onChange={(e) => onSettingsChange({ brightness: parseFloat(e.target.value) })}
              className="h-1 w-full bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Contrast */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Contrast</span>
              <span>{Math.round(settings.contrast * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={settings.contrast}
              onChange={(e) => onSettingsChange({ contrast: parseFloat(e.target.value) })}
              className="h-1 w-full bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Saturation */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Saturation</span>
              <span>{Math.round(settings.saturation * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={settings.saturation}
              onChange={(e) => onSettingsChange({ saturation: parseFloat(e.target.value) })}
              className="h-1 w-full bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Hue Rotate */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Hue Rotate</span>
              <span>{settings.hueRotate}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={settings.hueRotate}
              onChange={(e) => onSettingsChange({ hueRotate: parseInt(e.target.value, 10) })}
              className="h-1 w-full bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Invert */}
          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-[10px] text-muted-foreground">Invert Colors</span>
            <input
              type="checkbox"
              checked={settings.invert}
              onChange={(e) => onSettingsChange({ invert: e.target.checked })}
              className="h-3.5 w-7 cursor-pointer appearance-none rounded-full bg-muted checked:bg-primary relative before:absolute before:h-2.5 before:w-2.5 before:rounded-full before:bg-background before:top-0.5 before:left-0.5 checked:before:left-4 before:transition-all"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
export default SettingsPopover;
