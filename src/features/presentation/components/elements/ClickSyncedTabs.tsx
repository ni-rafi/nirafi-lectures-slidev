import React from 'react';
import { useClickStepsContext } from '../../context/ClickStepsContext';
import { ClickHighlight } from './ClickHighlight';
import { TwoColumnLayout } from '../../../../shared/layouts/TwoColumnLayout';

export interface ClickSyncedTabItem {
  title: string;
  description: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  rightContent: React.ReactNode;
}

interface ClickSyncedTabsProps {
  title: string;
  items: ClickSyncedTabItem[];
  leftTitle?: string;
  rightTitle?: string;
  leftWidth?: string;
  bgVariant?: 'default' | 'calculation' | 'gallery';
}

export const ClickSyncedTabs: React.FC<ClickSyncedTabsProps> = ({
  title,
  items,
  leftTitle,
  rightTitle,
  leftWidth = '55%',
  bgVariant = 'default',
}) => {
  const { currentClick, setClick } = useClickStepsContext();

  // Active item index is based on currentClick, clamped to the number of items
  const activeIndex = Math.min(items.length - 1, Math.max(0, currentClick));

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
              return (
                <div
                  key={idx}
                  onClick={() => setClick(idx)}
                  className={`p-2.5 rounded-xl border transition-all duration-350 cursor-pointer ${
                    isActive
                      ? 'bg-primary/5 border-primary shadow-sm translate-x-1'
                      : 'bg-card border-border/60 hover:bg-muted/10 opacity-70 hover:opacity-95'
                  }`}
                >
                  {/* Register click highlights implicitly in the presentation click-steps */}
                  {idx > 0 && <ClickHighlight at={idx} className="hidden">{' '}</ClickHighlight>}

                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {item.title}
                    </h4>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'border-border/60 text-muted-foreground bg-muted/30'}`}>
                        {item.badge}
                      </span>
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
          <div className="flex-1 flex items-center justify-center border border-border/60 rounded-xl p-4 bg-muted/20 min-h-[220px]">
            {items[activeIndex]?.rightContent || null}
          </div>
        </div>
      }
    />
  );
};

export default ClickSyncedTabs;
