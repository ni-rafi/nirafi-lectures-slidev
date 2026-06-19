import React, { useState } from 'react';
import { usePresentation } from '@/features/presentation/context/PresentationContext';
import { BookOpen, ChevronRight } from 'lucide-react';

export interface MasterDetailItem {
  id: number;
  title: string;
  description: string;
  badgeLabel?: string; // Optional custom badge (e.g. "CC 1", "Ch 1")
}

interface MasterDetailPanelProps {
  items: MasterDetailItem[];
  activeIds?: number[];
  panelTitle?: string;
  detailHeader?: string;
  badgePrefix?: string; // Default prefix for badges (e.g. "CC")
  activeLabel?: string; // Label for highlighted active items (e.g. "Covered")
  inactiveLabel?: string; // Label for non-highlighted items (e.g. "Not Covered")
}

export const MasterDetailPanel: React.FC<MasterDetailPanelProps> = ({
  items,
  activeIds = items.map((c) => c.id),
  panelTitle = 'Course Contents (CCs)',
  detailHeader = 'Chapter Contents',
  badgePrefix = 'CC',
  activeLabel = 'Covered',
  inactiveLabel = 'Not Covered',
}) => {
  const presentation = usePresentation();
  const currentClick = presentation?.activeSubStep ?? 0;
  const isBlog = presentation?.viewMode === 'blog';
  const [activeItemId, setActiveItemId] = useState<number>(items[0]?.id ?? 1);

  if (isBlog) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <h3 className="text-sm font-extrabold flex items-center gap-2 border-b pb-2 mb-1">
          <BookOpen className="h-4 w-4 text-primary" />
          {panelTitle}
        </h3>
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const isActiveItem = activeIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-4 border rounded-xl transition-all duration-300 ${
                  isActiveItem
                    ? 'bg-card/20 border-primary/20 bg-primary/5'
                    : 'opacity-40 border-dashed saturate-50 bg-card/5'
                }`}
              >
                <h4 className="text-xs font-bold text-foreground mb-1 flex items-center justify-between">
                  <span>{item.badgeLabel || `${badgePrefix} ${item.id}`}: {item.title}</span>
                  {!isActiveItem && inactiveLabel && (
                    <span className="text-[9px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                      {inactiveLabel}
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Slide Mode: Interactive contents
  return (
    <div className="flex flex-col gap-3 w-full">
      <h3 className="text-sm font-extrabold flex items-center gap-2 border-b pb-2 mb-1">
        <BookOpen className="h-4 w-4 text-primary" />
        {panelTitle}
      </h3>
      <div 
        className="gap-4 flex-1 items-stretch min-h-0"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}
      >
        {/* Master Buttons List */}
        <div 
          className="flex flex-col gap-1.5 overflow-y-auto pr-1"
          style={{ gridColumn: 'span 5 / span 5', maxHeight: '300px' }}
        >
          {items.map((item) => {
            const isActive = item.id === activeItemId;
            const isActiveItem = activeIds.includes(item.id);
            const isDimmed = currentClick >= 1 && !isActiveItem;

            let btnStyleClasses = '';
            if (isDimmed) {
              btnStyleClasses = 'opacity-30 saturate-50 border-dashed border-border/30';
            } else if (isActive) {
              btnStyleClasses = 'bg-primary/10 border-primary/30 text-primary';
            } else if (currentClick >= 1 && isActiveItem) {
              btnStyleClasses = 'border-primary/40 bg-primary/5 text-primary/90';
            } else {
              btnStyleClasses = 'bg-card/20 border-border/40 hover:bg-card/45 hover:border-border/60 text-muted-foreground';
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveItemId(item.id)}
                className={`w-full flex items-center justify-between text-left p-2 rounded-md text-[10px] font-semibold border transition-all duration-300 cursor-pointer ${btnStyleClasses}`}
              >
                <span className="truncate pr-1">
                  {item.id}. {item.title}
                </span>
                <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${isActive ? 'translate-x-0.5' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Detail Box */}
        <div 
          className="border border-border/40 bg-muted/10 rounded-lg p-3.5 flex flex-col gap-2 overflow-y-auto transition-all duration-300"
          style={{ gridColumn: 'span 7 / span 7', maxHeight: '300px' }}
        >
          {(() => {
            const activeItem = items.find((item) => item.id === activeItemId);
            if (!activeItem) return null;
            const isActiveItem = activeIds.includes(activeItem.id);
            return (
              <>
                <div className="flex items-center justify-between gap-2 border-b pb-1.5 mb-0.5">
                  <span className="text-[9px] font-bold text-primary font-mono uppercase tracking-widest leading-none">
                    {detailHeader}
                  </span>
                  {currentClick >= 1 && !isActiveItem && inactiveLabel && (
                    <span className="text-[8px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full select-none leading-none animate-pulse">
                      {inactiveLabel}
                    </span>
                  )}
                  {currentClick >= 1 && isActiveItem && activeLabel && (
                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full select-none leading-none">
                      {activeLabel}
                    </span>
                  )}
                </div>
                <h4 className="text-[11px] font-bold text-foreground leading-snug">
                  {activeItem.title}
                </h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {activeItem.description}
                </p>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default MasterDetailPanel;
