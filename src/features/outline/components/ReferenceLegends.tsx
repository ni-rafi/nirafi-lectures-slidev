import React from 'react';
import { usePresentation } from '@/features/presentation/context/PresentationContext';
import { HelpCircle, BookOpen, Layers } from 'lucide-react';

export interface LegendItem {
  code: string;
  strategy: string;
}

interface ReferenceLegendsProps {
  leftTitle?: string;
  rightTitle?: string;
  leftLegends: LegendItem[];
  rightLegends: LegendItem[];
  rightSubSections?: {
    title: string;
    filterPrefix: string;
  }[];
}

export const ReferenceLegends: React.FC<ReferenceLegendsProps> = ({
  leftTitle = 'Teaching-Learning Strategy Legend',
  rightTitle = 'Assessment Strategy Legend',
  leftLegends,
  rightLegends,
  rightSubSections = [
    { title: 'Continuous Assessment (CA)', filterPrefix: 'ca' },
    { title: 'Summative Assessment (SA)', filterPrefix: 'sa' },
  ],
}) => {
  const presentation = usePresentation();
  const isBlog = presentation?.viewMode === 'blog';

  const renderLegendList = (list: LegendItem[]) => (
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

  const getSubSectionList = (sub: { title: string; filterPrefix: string }) => {
    return rightLegends.filter((item) =>
      item.code.trim().toLowerCase().startsWith(sub.filterPrefix.toLowerCase())
    );
  };

  if (isBlog) {
    return (
      <div className="flex flex-col gap-8 py-4 text-left">
        <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-b pb-2">
          <HelpCircle className="h-5 w-5" />
          Strategy Code Index & Legends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground border-b pb-1 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              {leftTitle}
            </h4>
            {renderLegendList(leftLegends)}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {rightSubSections.map((sub, idx) => {
              const list = getSubSectionList(sub);
              return (
                <div key={idx} className={`flex flex-col gap-4 ${idx > 0 ? 'border-t pt-4' : ''}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground border-b pb-1 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-primary" />
                    {sub.title}
                  </h4>
                  {renderLegendList(list)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Slide Mode Layout
  return (
    <div className="grid grid-cols-12 gap-6 h-full select-text text-left">
      {/* Left Column */}
      <div className="col-span-6 flex flex-col gap-2">
        <h3 className="text-sm font-extrabold flex items-center gap-2 border-b pb-2 mb-1">
          <BookOpen className="h-4 w-4 text-primary" />
          {leftTitle}
        </h3>
        <div className="overflow-y-auto max-h-[300px] pr-1">
          {renderLegendList(leftLegends)}
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-6 flex flex-col gap-3">
        <h3 className="text-sm font-extrabold flex items-center gap-2 border-b pb-2 mb-1">
          <Layers className="h-4 w-4 text-primary" />
          {rightTitle}
        </h3>
        <div className="overflow-y-auto max-h-[300px] pr-1 flex flex-col gap-4">
          {rightSubSections.map((sub, idx) => {
            const list = getSubSectionList(sub);
            return (
              <div key={idx} className={`flex flex-col gap-1.5 ${idx > 0 ? 'border-t border-border/30 pt-3' : ''}`}>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono select-none">
                  {sub.title}
                </span>
                {renderLegendList(list)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReferenceLegends;
