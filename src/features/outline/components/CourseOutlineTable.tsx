import React from 'react';
import { usePresentation } from '@/features/presentation/context/PresentationContext';
import { WeeklyScheduleRow, StrategyLegend } from '../types';
import { Calendar, HelpCircle } from 'lucide-react';

interface CourseOutlineTableProps {
  part: 1 | 2;
  schedule: WeeklyScheduleRow[];
  tlLegends: StrategyLegend[];
  assessmentLegends: StrategyLegend[];
}

export const CourseOutlineTable: React.FC<CourseOutlineTableProps> = ({
  part,
  schedule,
  tlLegends,
  assessmentLegends,
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

  // Renders a premium interactive hover badge
  const renderBadge = (code: string, isTL: boolean) => {
    if (code.trim() === '---' || !code.trim()) return <span className="text-muted-foreground/40">—</span>;
    const desc = getStrategyDescription(code, isTL);

    return (
      <div key={code} className="relative group inline-block">
        <span className="cursor-pointer bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold font-mono transition-all">
          {code}
        </span>
        {/* Floating animated tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-52 bg-card border border-border/80 text-[10px] text-muted-foreground leading-normal p-2.5 rounded-lg shadow-lg select-none pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-card" />
          <strong className="block text-primary font-mono text-[9px] mb-0.5 uppercase tracking-wider">{code}</strong>
          <span className="block text-[10px] text-foreground/90 font-medium leading-relaxed">{desc}</span>
        </div>
      </div>
    );
  };

  if (isBlog) {
    // Scroll/Blog Mode: Standard table that takes full page width and scrolls on mobile
    return (
      <div className="flex flex-col gap-4 text-left w-full">
        <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-b pb-2">
          <Calendar className="h-5 w-5" />
          Weekly Schedule Breakdown (Weeks {part === 1 ? '1–7' : '8–14'})
        </h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-left text-xs font-sans">
            <thead>
              <tr className="border-b bg-muted/50 font-bold text-foreground">
                <th className="p-3 w-16 text-center">Week</th>
                <th className="p-3 w-1/3">Topic / Outline</th>
                <th className="p-3 w-20 text-center">CC Code</th>
                <th className="p-3 w-24 text-center">CO Covered</th>
                <th className="p-3 w-1/4">TL Strategy</th>
                <th className="p-3 w-1/4">Assessment</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.map((row) => (
                <tr key={row.week} className="border-b border-border/60 hover:bg-muted/10 transition-colors last:border-none">
                  <td className="p-3 text-center font-bold text-foreground bg-muted/10">{row.week}</td>
                  <td className="p-3 font-medium text-foreground">{row.topic}</td>
                  <td className="p-3 text-center font-mono text-muted-foreground">{row.contentCode}</td>
                  <td className="p-3 text-center font-mono text-muted-foreground">{row.coCovered}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1.5 justify-start">
                      {row.tlStrategy.map((code) => renderBadge(code, true))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1.5 justify-start">
                      {row.assessmentStrategy.map((code) => renderBadge(code, false))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Slide Mode: Compact, highly readable grid layout that prevents overflow
  return (
    <div className="flex flex-col h-full justify-between select-text text-left">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <h3 className="text-sm font-extrabold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Weekly Outline Table (Weeks {part === 1 ? '1–7' : '8–14'})
        </h3>
        <span className="flex items-center gap-1 text-[9px] text-muted-foreground font-medium select-none">
          <HelpCircle className="h-3 w-3" />
          Hover on strategy codes for definitions
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="overflow-x-auto rounded-lg border border-border/40 bg-card/10">
          <table className="w-full border-collapse text-left text-[10px] font-sans">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 font-bold text-foreground leading-none">
                <th className="p-2 w-10 text-center select-none">Wk</th>
                <th className="p-2 w-5/12">Course Outline Description</th>
                <th className="p-2 w-16 text-center select-none">CC</th>
                <th className="p-2 w-20 text-center select-none">CO</th>
                <th className="p-2 w-3/12">TL Strategy</th>
                <th className="p-2 w-3/12">Assessment</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.map((row) => (
                <tr key={row.week} className="border-b border-border/30 hover:bg-card/20 transition-colors last:border-none">
                  <td className="p-2.5 text-center font-bold text-foreground bg-muted/5 select-none">{row.week}</td>
                  <td className="p-2.5 font-semibold text-foreground leading-snug">{row.topic}</td>
                  <td className="p-2.5 text-center font-mono font-medium text-muted-foreground">{row.contentCode}</td>
                  <td className="p-2.5 text-center font-mono font-medium text-primary">{row.coCovered}</td>
                  <td className="p-2.5">
                    <div className="flex flex-wrap gap-1">
                      {row.tlStrategy.map((code) => renderBadge(code, true))}
                    </div>
                  </td>
                  <td className="p-2.5">
                    <div className="flex flex-wrap gap-1">
                      {row.assessmentStrategy.map((code) => renderBadge(code, false))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseOutlineTable;
