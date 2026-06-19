import React, { useState } from 'react';
import { usePresentation } from '@/features/presentation/context/PresentationContext';
import { OutcomeItem, ContentItem } from '../types';
import { Award, BookOpen, ChevronRight } from 'lucide-react';

interface CourseOutlineOutcomesProps {
  outcomes: OutcomeItem[];
  contents: ContentItem[];
}

export const CourseOutlineOutcomes: React.FC<CourseOutlineOutcomesProps> = ({
  outcomes,
  contents,
}) => {
  const presentation = usePresentation();
  const isBlog = presentation?.viewMode === 'blog';
  const [activeChapterId, setActiveChapterId] = useState<number>(1);

  if (isBlog) {
    return (
      <div className="flex flex-col gap-8 py-4 text-left">
        {/* Outcomes Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
            <Award className="h-5 w-5" />
            Course Learning Outcomes (COs)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outcomes.map((co) => (
              <div key={co.id} className="p-4 border rounded-xl bg-card/40 flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {co.id}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">{co.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contents Section */}
        <div className="flex flex-col gap-4 border-t pt-6">
          <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            Detailed Course Contents (CCs)
          </h3>
          <div className="flex flex-col gap-4">
            {contents.map((cc) => (
              <div key={cc.id} className="p-4 border rounded-xl bg-card/20">
                <h4 className="text-xs font-bold text-foreground mb-1">
                  CC {cc.id}: {cc.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{cc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Slide Mode: Interactive split view
  // Renders both Columns as a single unit when requested, or fits within Layout columns
  return (
    <div className="grid grid-cols-12 gap-6 h-full select-text text-left">
      {/* Left Column: Outcomes (COs) */}
      <div className="col-span-5 flex flex-col gap-3">
        <h3 className="text-sm font-extrabold flex items-center gap-2 border-b pb-2 mb-1">
          <Award className="h-4 w-4 text-primary" />
          Course Learning Outcomes
        </h3>
        <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[300px] pr-1">
          {outcomes.map((co) => (
            <div
              key={co.id}
              className="p-3 border border-border/50 rounded-lg bg-card/30 flex gap-2.5 hover:border-primary/20 transition-all duration-200"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                CO {co.id}
              </span>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {co.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Interactive Course Contents (CCs) */}
      <div className="col-span-7 flex flex-col gap-3">
        <h3 className="text-sm font-extrabold flex items-center gap-2 border-b pb-2 mb-1">
          <BookOpen className="h-4 w-4 text-primary" />
          Course Contents (CCs)
        </h3>
        <div className="grid grid-cols-12 gap-4 flex-1 items-stretch min-h-0">
          {/* Chapter Buttons List */}
          <div className="col-span-5 flex flex-col gap-1.5 overflow-y-auto max-h-[300px] pr-1">
            {contents.map((cc) => {
              const isActive = cc.id === activeChapterId;
              return (
                <button
                  key={cc.id}
                  onClick={() => setActiveChapterId(cc.id)}
                  className={`w-full flex items-center justify-between text-left p-2 rounded-md text-[10px] font-semibold border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-card/20 border-border/40 hover:bg-card/45 hover:border-border/60 text-muted-foreground'
                  }`}
                >
                  <span className="truncate pr-1">
                    {cc.id}. {cc.title}
                  </span>
                  <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${isActive ? 'translate-x-0.5' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Chapter Details Box */}
          <div className="col-span-7 border border-border/40 bg-muted/10 rounded-lg p-3.5 flex flex-col gap-2 overflow-y-auto max-h-[300px]">
            {(() => {
              const activeChapter = contents.find((cc) => cc.id === activeChapterId);
              if (!activeChapter) return null;
              return (
                <>
                  <span className="text-[9px] font-bold text-primary font-mono uppercase tracking-widest leading-none">
                    Chapter Contents
                  </span>
                  <h4 className="text-[11px] font-bold text-foreground leading-snug border-b pb-1.5">
                    {activeChapter.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {activeChapter.description}
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOutlineOutcomes;
