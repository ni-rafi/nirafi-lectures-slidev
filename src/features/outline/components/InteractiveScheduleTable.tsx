import React from 'react';
import { usePresentation } from '@/features/presentation/context/PresentationContext';
import { SlideTable } from '@/features/presentation/components/elements';
import { HoverTooltip } from '@/features/presentation/components/elements/HoverTooltip';
import { WeeklyScheduleRow, StrategyLegend, OutcomeItem, ContentItem } from '../types';
import { Calendar, HelpCircle } from 'lucide-react';

interface InteractiveScheduleTableProps {
  part: 1 | 2;
  schedule: WeeklyScheduleRow[];
  tlLegends: StrategyLegend[];
  assessmentLegends: StrategyLegend[];
  outcomes?: OutcomeItem[];
  contents?: ContentItem[];
}

export const InteractiveScheduleTable: React.FC<InteractiveScheduleTableProps> = ({
  part,
  schedule,
  tlLegends,
  assessmentLegends,
  outcomes = [],
  contents = [],
}) => {
  const presentation = usePresentation();
  const isBlog = presentation?.viewMode === 'blog';

  // Filter schedule based on part
  const filteredSchedule = schedule.filter((row) => {
    if (part === 1) return row.week <= 7;
    return row.week >= 8;
  });

  const getStrategyDescription = (code: string, isTL: boolean): string => {
    const list = isTL ? tlLegends : assessmentLegends;
    const match = list.find((item) => item.code.trim().toLowerCase() === code.trim().toLowerCase());
    return match ? match.strategy : 'Strategy details not registered';
  };

  const getOutcomeDescription = (coId: string): string => {
    const cleanId = parseInt(coId.trim(), 10);
    if (isNaN(cleanId)) return '';
    const match = outcomes.find((item) => item.id === cleanId);
    return match ? match.description : '';
  };

  const getContentDescription = (ccId: string): string => {
    const cleanId = parseInt(ccId.trim(), 10);
    if (isNaN(cleanId)) return '';
    const match = contents.find((item) => item.id === cleanId);
    return match ? `${match.title}: ${match.description}` : '';
  };

  const renderBadge = (code: string, isTL: boolean, weekNo: number) => {
    if (code.trim() === '---' || !code.trim()) return <span className="text-muted-foreground/40">—</span>;
    const desc = getStrategyDescription(code, isTL);

    return (
      <HoverTooltip
        key={code}
        trigger={
          <span className="bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-1.5 py-0.5 rounded text-xs font-bold font-mono transition-all select-none">
            {code}
          </span>
        }
        title={code}
        content={desc}
        syncKey={`outline-wk${weekNo}-${isTL ? 'tl' : 'as'}-${code.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`}
      />
    );
  };

  const renderCCBadge = (code: string, weekNo: number) => {
    if (code.trim() === '---' || !code.trim()) return <span className="text-muted-foreground/45 font-mono">—</span>;
    const codes = code.split(',').map((c) => c.trim());
    return (
      <div className="flex flex-wrap gap-1 justify-center select-none pointer-events-auto">
        {codes.map((c) => {
          const desc = getContentDescription(c);
          if (!desc) return <span key={c} className="font-mono text-muted-foreground text-xs">{c}</span>;
          return (
            <HoverTooltip
              key={c}
              trigger={
                <span className="cursor-pointer underline decoration-dotted decoration-muted-foreground hover:text-primary font-mono text-xs transition-colors">
                  {c}
                </span>
              }
              title={`Chapter ${c}`}
              content={desc}
              syncKey={`outline-wk${weekNo}-cc-${c}`}
            />
          );
        })}
      </div>
    );
  };

  const renderCOBadge = (code: string, weekNo: number) => {
    if (code.trim() === '---' || !code.trim()) return <span className="text-muted-foreground/45 font-mono">—</span>;
    const codes = code.split(',').map((c) => c.trim());
    return (
      <div className="flex flex-wrap gap-1 justify-center select-none pointer-events-auto">
        {codes.map((c) => {
          const desc = getOutcomeDescription(c);
          if (!desc) return <span key={c} className="font-mono text-primary font-bold text-xs">{c}</span>;
          return (
            <HoverTooltip
              key={c}
              trigger={
                <span className="cursor-pointer font-bold bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 hover:border-primary/30 px-1.5 py-0.5 rounded text-xs font-mono transition-all">
                  {c}
                </span>
              }
              title={`Outcome CO ${c}`}
              content={desc}
              syncKey={`outline-wk${weekNo}-co-${c}`}
            />
          );
        })}
      </div>
    );
  };

  // Set up header columns dynamically based on mode
  const headers = isBlog
    ? [
        { label: 'Week', align: 'center' as const },
        { label: 'Topic / Outline' },
        { label: 'CC Code', align: 'center' as const },
        { label: 'CO Covered', align: 'center' as const },
        { label: 'TL Strategy' },
        { label: 'Assessment' },
      ]
    : [
        { label: 'Wk', align: 'center' as const },
        { label: 'Course Outline Description' },
        { label: 'CC', align: 'center' as const },
        { label: 'CO', align: 'center' as const },
        { label: 'TL Strategy' },
        { label: 'Assessment' },
      ];

  // Map rows to pass to SlideTable
  const rows = filteredSchedule.map((row) => [
    <span key="week" className="font-bold text-foreground text-xs">{row.week}</span>,
    <span key="topic" className="font-semibold text-foreground text-xs leading-snug">{row.topic}</span>,
    <React.Fragment key="cc">{renderCCBadge(row.contentCode, row.week)}</React.Fragment>,
    <React.Fragment key="co">{renderCOBadge(row.coCovered, row.week)}</React.Fragment>,
    <div key="tl" className="flex flex-wrap gap-1 select-none pointer-events-auto">
      {row.tlStrategy.map((code) => renderBadge(code, true, row.week))}
    </div>,
    <div key="assessment" className="flex flex-wrap gap-1 select-none pointer-events-auto">
      {row.assessmentStrategy.map((code) => renderBadge(code, false, row.week))}
    </div>,
  ]);

  const showHeader = !presentation || isBlog;

  return (
    <div className="flex flex-col select-text text-left w-full gap-2">
      {showHeader ? (
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Weekly Outline Table (Weeks {part === 1 ? '1–7' : '8–14'})
          </h3>
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium select-none">
            <HelpCircle className="h-3 w-3" />
            Hover on codes for definitions
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-end select-none text-xs text-muted-foreground font-medium pr-1 mb-1">
          <HelpCircle className="h-3.5 w-3.5 mr-1 text-primary animate-pulse" />
          Hover on codes for definitions
        </div>
      )}

      <div className="w-full">
        <SlideTable
          headers={headers}
          rows={rows}
          className="text-xs w-full"
          striped
          bordered
          hoverable
        />
      </div>
    </div>
  );
};

export default InteractiveScheduleTable;
