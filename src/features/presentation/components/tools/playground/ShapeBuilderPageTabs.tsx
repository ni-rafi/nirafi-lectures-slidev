import React, { useState } from 'react';
import { Plus, Copy, Trash2, Check, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaygroundPage } from '../../../types/schema';

interface ShapeBuilderPageTabsProps {
  pages: PlaygroundPage[];
  activeIndex: number;
  savingStatus: 'saved' | 'saving' | 'error';
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: () => void;
  onDeletePage: () => void;
  onRenamePage: (index: number, name: string) => void;
}

export const ShapeBuilderPageTabs: React.FC<ShapeBuilderPageTabsProps> = ({
  pages,
  activeIndex,
  savingStatus,
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
    <div className="border-b border-border bg-card/40 px-6 py-2 flex items-center justify-between select-none shrink-0">
      {/* Tabs list */}
      <div className="flex items-center gap-1.5 overflow-x-auto flex-1 mr-4 scrollbar-none">
        {pages.map((page, idx) => {
          const isActive = idx === activeIndex;
          const isEditing = idx === editingIndex;

          return (
            <div
              key={page.id}
              onClick={() => !isEditing && onSelectPage(idx)}
              onDoubleClick={() => startEditing(idx, page.name)}
              className={`group px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground'
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
                  className="h-6 w-24 text-[11px] font-semibold bg-background text-primary border-primary px-1.5 py-0.5 text-center"
                />
              ) : (
                <span>{page.name}</span>
              )}
            </div>
          );
        })}

        {/* Add Page Button */}
        <Button
          variant="ghost"
          size="xs"
          onClick={onAddPage}
          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
          title="Add Blank Page"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Page Actions & Save indicator */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Save Status Indicator */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground tracking-wide font-mono mr-2">
          <Cloud className={`h-3.5 w-3.5 ${savingStatus === 'saving' ? 'text-amber-500 animate-pulse' : savingStatus === 'error' ? 'text-destructive' : 'text-emerald-500'}`} />
          {savingStatus === 'saving' ? (
            <span className="text-amber-500">Saving...</span>
          ) : savingStatus === 'error' ? (
            <span className="text-destructive">Sync Error</span>
          ) : (
            <span className="text-emerald-500">Saved</span>
          )}
        </div>

        {/* Duplicate active page */}
        <Button
          variant="outline"
          size="xs"
          onClick={onDuplicatePage}
          className="h-7 px-2.5 rounded-lg text-xs font-semibold border-border bg-card/60 hover:bg-accent flex gap-1 items-center"
          title="Duplicate Current Page"
        >
          <Copy className="h-3 w-3" /> Duplicate Page
        </Button>

        {/* Delete Page */}
        <Button
          variant="ghost"
          size="xs"
          disabled={pages.length <= 1}
          onClick={onDeletePage}
          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
          title="Delete Page"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default ShapeBuilderPageTabs;
