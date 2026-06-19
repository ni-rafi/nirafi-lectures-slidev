import React from 'react';
import { usePresentation } from '@/features/presentation/context/PresentationContext';
import { ClickHighlight } from '@/features/presentation/components/elements';
import { Award } from 'lucide-react';

export interface HighlightableListItem {
  id: number;
  description: string;
  badgeLabel?: string; // Optional custom badge (e.g. "LO 1", "CO 1")
}

interface HighlightableListProps {
  items: HighlightableListItem[];
  highlightedIds?: number[];
  listTitle?: string;
  highlightLabel?: string;
  badgePrefix?: string; // Default prefix for badges (e.g., "CO")
  notHighlightedMessage?: string; // Message shown in Blog mode for inactive items
}

export const HighlightableList: React.FC<HighlightableListProps> = ({
  items,
  highlightedIds = items.map((o) => o.id),
  listTitle = 'Course Learning Outcomes',
  highlightLabel = 'Highlighting Coverage',
  badgePrefix = 'CO',
  notHighlightedMessage = 'Not Covered in Session 2024-25',
}) => {
  const presentation = usePresentation();
  const currentClick = presentation?.activeSubStep ?? 0;
  const isBlog = presentation?.viewMode === 'blog';

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Hidden ClickHighlight hook to unconditionally register step 1 */}
      {!isBlog && <ClickHighlight at={1} className="hidden">{" "}</ClickHighlight>}

      <div className="flex items-center justify-between border-b pb-1.5 mb-0.5">
        <h3 className="text-xs font-extrabold flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-primary" />
          {listTitle}
        </h3>
        {!isBlog && currentClick >= 1 && (
          <span className="text-[7px] font-bold text-primary font-mono uppercase tracking-wider animate-pulse">
            {highlightLabel}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {items.map((item) => {
          const isHighlightedItem = highlightedIds.includes(item.id);
          const isHighlighted = !isBlog && currentClick >= 1 && isHighlightedItem;
          const isDimmed = !isBlog && currentClick >= 1 && !isHighlightedItem;

          return (
            <div
              key={item.id}
              className={`p-2 border rounded-md bg-card/30 flex gap-2 transition-all duration-300 ${
                isHighlighted
                  ? 'border-primary/60 bg-primary/5 shadow-xs scale-[1.01]'
                  : isDimmed
                  ? 'opacity-30 saturate-50 scale-[0.98] border-border/30'
                  : isBlog && !isHighlightedItem
                  ? 'opacity-40 border-dashed saturate-50 bg-card/10'
                  : 'border-border/50 hover:border-primary/20'
              }`}
            >
              <span className="flex h-4 shrink-0 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[8px] font-bold text-primary whitespace-nowrap">
                {item.badgeLabel || `${badgePrefix} ${item.id}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-muted-foreground leading-normal">
                  {item.description}
                </p>
                {isBlog && !isHighlightedItem && notHighlightedMessage && (
                  <span className="inline-block mt-1 text-[8px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                    {notHighlightedMessage}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HighlightableList;
