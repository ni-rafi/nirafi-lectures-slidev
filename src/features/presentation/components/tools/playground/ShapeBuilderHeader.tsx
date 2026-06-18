import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sparkles, Copy, ChevronLeft, Cloud, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { PhysicalUnit, PlaygroundPage } from '../../../types/schema';

interface ShapeBuilderHeaderProps {
  scaleFactor: { pixelsPerUnit: number; unit: PhysicalUnit };
  onScaleFactorChange: (sf: { pixelsPerUnit: number; unit: PhysicalUnit }) => void;
  simulatedClick: number;
  onSimulatedClickChange: (click: number) => void;
  onCopy: () => void;
  onBack: () => void;
  savingStatus: 'saved' | 'saving' | 'error';
  pages: PlaygroundPage[];
  activeIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: () => void;
  onDeletePage: () => void;
  onRenamePage: (index: number, name: string) => void;
}

export const ShapeBuilderHeader: React.FC<ShapeBuilderHeaderProps> = ({
  scaleFactor,
  onScaleFactorChange,
  simulatedClick,
  onSimulatedClickChange,
  onCopy,
  onBack,
  savingStatus,
  pages,
  activeIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onRenamePage,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');

  const startEditing = (idx: number, name: string) => {
    setEditingIndex(idx);
    setTempName(name);
  };

  const handleRenameSubmit = (idx: number) => {
    if (tempName.trim()) {
      onRenamePage(idx, tempName.trim());
    }
    setEditingIndex(null);
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 select-none shrink-0 gap-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left side: Back to Lecture + Title */}
      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Lecture</span>
        </Button>
        <div className="h-4 w-px bg-border" />
        <span className="flex items-center gap-2 font-bold text-sm text-foreground">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>Slide Visual Designer</span>
        </span>
      </div>

      {/* Middle: Unified Page Navigation Tabs (shadcn styled) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-[450px]">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          {pages.map((page, idx) => {
            const isActive = idx === activeIndex;
            const isEditing = idx === editingIndex;

            return (
              <button
                key={page.id}
                onClick={() => !isEditing && onSelectPage(idx)}
                onDoubleClick={() => startEditing(idx, page.name)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                  isActive
                    ? 'bg-background text-foreground shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-foreground bg-transparent'
                }`}
              >
                {isEditing ? (
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleRenameSubmit(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(idx);
                      if (e.key === 'Escape') setEditingIndex(null);
                    }}
                    autoFocus
                    className="h-5 w-20 text-[10px] font-semibold bg-background px-1 py-0.5 text-center"
                  />
                ) : (
                  <span>{page.name}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add Page Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddPage}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Add Blank Page"
        >
          <Plus className="h-4 w-4" />
        </Button>

        {/* Duplicate Page Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDuplicatePage}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Duplicate Current Page"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>

        {/* Delete Page Button */}
        <Button
          variant="ghost"
          size="icon"
          disabled={pages.length <= 1}
          onClick={onDeletePage}
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
          title="Delete Page"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Right side: Scale + Step Preview + Status + Copy */}
      <div className="flex gap-4 items-center shrink-0">
        {/* Scale & Units */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold uppercase">Scale:</span>
          <Input
            type="number"
            value={scaleFactor.pixelsPerUnit}
            onChange={(e) =>
              onScaleFactorChange({
                ...scaleFactor,
                pixelsPerUnit: Math.max(1, parseInt(e.target.value) || 100),
              })
            }
            className="w-16 h-8 text-center font-mono"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 font-medium"
              >
                <span>
                  {scaleFactor.unit === 'm'
                    ? 'meters (m)'
                    : scaleFactor.unit === 'cm'
                    ? 'centimeters (cm)'
                    : 'millimeters (mm)'}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-popover text-popover-foreground border-border">
              <DropdownMenuItem
                onClick={() => onScaleFactorChange({ ...scaleFactor, unit: 'm' })}
                className="text-xs cursor-pointer"
              >
                meters (m)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onScaleFactorChange({ ...scaleFactor, unit: 'cm' })}
                className="text-xs cursor-pointer"
              >
                centimeters (cm)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onScaleFactorChange({ ...scaleFactor, unit: 'mm' })}
                className="text-xs cursor-pointer"
              >
                millimeters (mm)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Step Slider */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold uppercase">Step Preview:</span>
          <input
            type="range"
            min={0}
            max={6}
            value={simulatedClick}
            onChange={(e) => onSimulatedClickChange(parseInt(e.target.value))}
            className="w-24 accent-primary cursor-pointer"
          />
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 border rounded bg-muted text-muted-foreground">
            {simulatedClick}
          </span>
        </div>

        {/* Save Status Badge */}
        <div className="flex items-center">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border transition-colors ${
              savingStatus === 'saving'
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                : savingStatus === 'error'
                ? 'bg-destructive/10 text-destructive border-destructive/20'
                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            }`}
          >
            <Cloud
              className={`h-3 w-3 ${savingStatus === 'saving' ? 'animate-pulse' : ''}`}
            />
            {savingStatus === 'saving' ? (
              <span>Saving...</span>
            ) : savingStatus === 'error' ? (
              <span>Sync Error</span>
            ) : (
              <span>Saved</span>
            )}
          </span>
        </div>

        <Button
          size="sm"
          onClick={onCopy}
          className="font-semibold text-xs flex gap-1 items-center"
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Copy Config Schema</span>
        </Button>
      </div>
    </header>
  );
};

export default ShapeBuilderHeader;
