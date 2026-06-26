import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useClickStepsContext } from '../../context/ClickStepsContext';
import { ClickHighlight } from './ClickHighlight';
import { TwoColumnLayout } from '../../../../shared/layouts/TwoColumnLayout';
import { PresentationContext } from '../../context/PresentationContext';
import LayoutHeader from '../../../../shared/layouts/components/LayoutHeader';
import { SlideBadge, type SlideBadgeVariant } from './SlideBadge';

export interface ClickSyncedTabItem {
  title: string;
  description: React.ReactNode;
  badge?: string;
  badgeVariant?: SlideBadgeVariant;
  badgeColor?: string;
  /** Tailwind classes applied to the tab card in its *inactive* state only.
   *  Use to add a colored left-border accent + subtle background tint.
   *  e.g. 'border-l-[3px] border-l-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/[0.08]'
   */
  tintClass?: string;
  rightContent: React.ReactNode;
}

interface ClickSyncedTabsProps {
  title: string;
  items: ClickSyncedTabItem[];
  leftTitle?: string;
  rightTitle?: string;
  leftWidth?: string;
  bgVariant?: 'default' | 'calculation' | 'gallery';
  clickToTabMap?: number[];
}

/** Automatic per-tab color palette — cycles by index when the slide omits tintClass / badgeColor. */
const AUTO_COLORS = [
  {
    tintClass: 'border-l-[3px] border-l-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/[0.08]',
    badgeColor: 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10',
  },
  {
    tintClass: 'border-l-[3px] border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/[0.08]',
    badgeColor: 'border-amber-500/20 text-amber-500 bg-amber-500/5 dark:bg-amber-500/10',
  },
  {
    tintClass: 'border-l-[3px] border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/[0.08]',
    badgeColor: 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10',
  },
  {
    tintClass: 'border-l-[3px] border-l-rose-500 bg-rose-500/5 dark:bg-rose-500/[0.08]',
    badgeColor: 'border-rose-500/20 text-rose-500 bg-rose-500/5 dark:bg-rose-500/10',
  },
  {
    tintClass: 'border-l-[3px] border-l-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/[0.08]',
    badgeColor: 'border-cyan-500/20 text-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10',
  },
  {
    tintClass: 'border-l-[3px] border-l-violet-500 bg-violet-500/5 dark:bg-violet-500/[0.08]',
    badgeColor: 'border-violet-500/20 text-violet-500 bg-violet-500/5 dark:bg-violet-500/10',
  },
];

export const ClickSyncedTabs: React.FC<ClickSyncedTabsProps> = ({
  title,
  items,
  leftTitle,
  rightTitle,
  leftWidth = '55%',
  bgVariant = 'default',
  clickToTabMap,
}) => {
  const clickContext = useClickStepsContext();
  const { currentClick, setClick } = clickContext;
  const presentation = React.useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';

  React.useEffect(() => {
    if (clickContext.setIsTabbedSlide) {
      clickContext.setIsTabbedSlide(true);
    }
  }, [clickContext]);

  const [localActiveIndex, setLocalActiveIndex] = React.useState<number | null>(0);

  const isScrollOrBlog = viewMode === 'scroll' || viewMode === 'blog';

  const startClicks = React.useMemo(() => {
    if (clickToTabMap) {
      const firstOccurrences: Record<number, number> = {};
      clickToTabMap.forEach((tabIdx, clickIdx) => {
        if (firstOccurrences[tabIdx] === undefined) {
          firstOccurrences[tabIdx] = clickIdx;
        }
      });
      return firstOccurrences;
    }
    return null;
  }, [clickToTabMap]);

  // Active item index: driven by local state in scroll/blog modes, and by context in presentation mode
  const activeIndex = isScrollOrBlog
    ? (localActiveIndex !== null ? Math.min(items.length - 1, Math.max(0, localActiveIndex)) : null)
    : (clickToTabMap
        ? (clickToTabMap[currentClick] !== undefined ? clickToTabMap[currentClick] : items.length - 1)
        : Math.min(items.length - 1, Math.max(0, currentClick))
      );

  const handleItemClick = (idx: number) => {
    if (isScrollOrBlog) {
      setLocalActiveIndex((prev) => (prev === idx ? null : idx));
    } else {
      if (clickToTabMap && startClicks) {
        const targetClick = startClicks[idx] !== undefined ? startClicks[idx] : idx;
        setClick(targetClick);
      } else {
        setClick(idx);
      }
    }
  };

  if (isScrollOrBlog) {
    return (
      <div className="w-full flex flex-col gap-4 text-left select-text">
        <LayoutHeader title={title} />
        {leftTitle && (
          <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-widest block mb-1">
            {leftTitle}
          </span>
        )}
        <div className="flex flex-col gap-3">
          {items.map((item, idx) => {
            const isExpanded = activeIndex === idx;
            const auto = AUTO_COLORS[idx % AUTO_COLORS.length]!;
            const resolvedTintClass = item.tintClass ?? auto.tintClass;
            const resolvedBadgeColor = item.badgeColor ?? auto.badgeColor;
            return (
              <div
                key={idx}
                onClick={() => handleItemClick(idx)}
                className={`p-3.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  isExpanded
                    ? 'bg-accent text-accent-foreground border-primary shadow-sm'
                    : `${resolvedTintClass} text-card-foreground hover:bg-accent/40 opacity-80 hover:opacity-100`
                }`}
              >
                {/* Register click highlights implicitly in the presentation click-steps */}
                {clickToTabMap ? (
                  startClicks && startClicks[idx] !== undefined && startClicks[idx] > 0 && (
                    <ClickHighlight at={startClicks[idx]} className="hidden">{' '}</ClickHighlight>
                  )
                ) : (
                  idx > 0 && <ClickHighlight at={idx} className="hidden">{' '}</ClickHighlight>
                )}

                <div className="flex justify-between items-center mb-1">
                  <h4 className={`text-xs font-bold ${isExpanded ? 'text-primary' : 'text-foreground'}`}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <SlideBadge
                        label={item.badge}
                        variant={item.badgeVariant || 'default'}
                        className={resolvedBadgeColor}
                      />
                    )}
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  {item.description}
                </p>
                {isExpanded && item.rightContent && (
                  <div className="mt-3 border border-border/50 rounded-lg p-4 bg-muted/30 flex items-center justify-center min-h-[160px] animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="w-full flex justify-center">
                      {item.rightContent}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <TwoColumnLayout
      title={title}
      bgVariant={bgVariant}
      leftWidth={leftWidth}
      leftContent={
        <div className="flex flex-col gap-2 select-text">
          {leftTitle && (
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block mb-1">
              {leftTitle}
            </span>
          )}
          <div className="flex flex-col gap-2">
            {items.map((item, idx) => {
              const isActive = activeIndex === idx;
              const auto = AUTO_COLORS[idx % AUTO_COLORS.length]!;
              const resolvedTintClass = item.tintClass ?? auto.tintClass;
              const resolvedBadgeColor = item.badgeColor ?? auto.badgeColor;
              return (
                <div
                  key={idx}
                  onClick={() => handleItemClick(idx)}
                  className={`p-2.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-accent text-accent-foreground border-primary shadow-sm translate-x-1'
                      : `${resolvedTintClass} text-card-foreground hover:bg-accent/40 opacity-80 hover:opacity-100`
                  }`}
                >
                  {/* Register click highlights implicitly in the presentation click-steps */}
                  {clickToTabMap ? (
                    startClicks && startClicks[idx] !== undefined && startClicks[idx] > 0 && (
                      <ClickHighlight at={startClicks[idx]} className="hidden">{' '}</ClickHighlight>
                    )
                  ) : (
                    idx > 0 && <ClickHighlight at={idx} className="hidden">{' '}</ClickHighlight>
                  )}

                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {item.title}
                    </h4>
                    {item.badge && (
                      <SlideBadge
                        label={item.badge}
                        variant={item.badgeVariant || 'default'}
                        className={resolvedBadgeColor}
                      />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col gap-2 select-text h-full justify-center">
          {rightTitle && (
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center block">
              {rightTitle}
            </span>
          )}
          <div className="flex-1 flex items-center justify-center border border-border/50 rounded-lg p-4 bg-muted/30 min-h-[220px]">
            {items[activeIndex ?? 0]?.rightContent || null}
          </div>
        </div>
      }
    />
  );
};

export default ClickSyncedTabs;
