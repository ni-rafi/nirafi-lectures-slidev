import React from 'react';
import { usePresentation } from '@/features/presentation/context/PresentationContext';
import { StrategyLegend } from '../types';
import { HelpCircle, BookOpen, Layers } from 'lucide-react';

interface CourseOutlineLegendsProps {
  tlLegends: StrategyLegend[];
  assessmentLegends: StrategyLegend[];
}

export const CourseOutlineLegends: React.FC<CourseOutlineLegendsProps> = ({
  tlLegends,
  assessmentLegends,
}) => {
  const presentation = usePresentation();
  const isBlog = presentation?.viewMode === 'blog';

  // Helper to distinguish CA (Continuous Assessment) and SA (Summative Assessment)
  const caList = assessmentLegends.filter((item) => item.code.trim().toLowerCase().startsWith('ca'));
  const saList = assessmentLegends.filter((item) => item.code.trim().toLowerCase().startsWith('sa'));

  const renderLegendList = (list: StrategyLegend[]) => (
    <div className="flex flex-col gap-1.5 select-text text-left">
      {list.map((item) => (
        <div
          key={item.code}
          className="flex items-start gap-2.5 py-1 px-2 border border-transparent rounded hover:bg-card/25 hover:border-border/30 transition-all duration-150"
        >
          <span className="shrink-0 bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold font-mono px-1.5 py-0.5 rounded leading-none mt-0.5">
            {item.code}
          </span>
          <span className="text-[10px] text-muted-foreground leading-snug font-medium">
            {item.strategy}
          </span>
        </div>
      ))}
    </div>
  );

  if (isBlog) {
    return (
      <div className="flex flex-col gap-8 py-4 text-left">
        <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-b pb-2">
          <HelpCircle className="h-5 w-5" />
          Strategy Code Index & Legends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* TL Strategies */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground border-b pb-1 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              Teaching-Learning Strategies
            </h4>
            {renderLegendList(tlLegends)}
          </div>

          {/* Assessment Strategies */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground border-b pb-1 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary" />
                Continuous Assessment (CA)
              </h4>
              {renderLegendList(caList)}
            </div>
            <div className="flex flex-col gap-4 border-t pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground border-b pb-1 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary" />
                Summative Assessment (SA)
              </h4>
              {renderLegendList(saList)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Slide Mode Layout
  return (
    <div className="grid grid-cols-12 gap-6 h-full select-text text-left">
      {/* Left Column: Teaching-Learning (TL) */}
      <div className="col-span-6 flex flex-col gap-2">
        <h3 className="text-sm font-extrabold flex items-center gap-2 border-b pb-2 mb-1">
          <BookOpen className="h-4 w-4 text-primary" />
          Teaching-Learning Strategy Legend
        </h3>
        <div className="overflow-y-auto max-h-[300px] pr-1">
          {renderLegendList(tlLegends)}
        </div>
      </div>

      {/* Right Column: Assessments (CA / SA) */}
      <div className="col-span-6 flex flex-col gap-3">
        <h3 className="text-sm font-extrabold flex items-center gap-2 border-b pb-2 mb-1">
          <Layers className="h-4 w-4 text-primary" />
          Assessment Strategy Legend
        </h3>
        <div className="overflow-y-auto max-h-[300px] pr-1 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono select-none">
              Continuous Assessment (CA)
            </span>
            {renderLegendList(caList)}
          </div>
          <div className="flex flex-col gap-1.5 border-t border-border/30 pt-3">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono select-none">
              Summative Assessment (SA)
            </span>
            {renderLegendList(saList)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOutlineLegends;
