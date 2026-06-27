import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { HighlightableList } from '@/features/outline/components/HighlightableList';
import { ReferenceBooksList } from '@/features/outline/components/ReferenceBooksList';
import { SlideParagraph } from '@/features/presentation/components/elements';
import { BookOpen, Layers, Bookmark } from 'lucide-react';

export const CourseObjectivesReferences: React.FC = () => {
  const outcomes = [
    { id: 4, description: 'Determine the shear force and bending moment for determinate beams.' },
    { id: 5, description: 'Determine the shear stress and bending stress of determinate beams of different shapes.' }
  ];

  const references = [
    {
      id: 1,
      title: 'Strength of Materials',
      author: 'Ferdinand L. Singer & Andrew Pytel',
      edition: '4th Edition',
      publisher: 'Harper & Row / UBS Publishers',
    },
    {
      id: 2,
      title: 'Mechanics of Materials',
      author: 'R.C. Hibbeler',
      edition: '10th Edition',
      publisher: 'Pearson',
    }
  ];

  return (
    <TwoColumnLayout
      title="Course Objectives & References"
      leftWidth="45%"
      leftContent={
        <div className="flex flex-col h-full justify-between gap-4 text-left select-text">
          <div>
            <div className="flex items-center space-x-1.5 text-indigo-500 font-bold text-xs uppercase mb-1">
              <Layers className="h-4.5 w-4.5" />
              <span>Learning Roadmap</span>
            </div>
            <SlideParagraph variant="plain" className="text-xs text-muted-foreground">Active sessional targets for this session.</SlideParagraph>
          </div>
          <div className="flex-1">
            <HighlightableList
              items={outcomes}
              highlightedIds={[4, 5]}
              listTitle="Expected Capabilities:"
              highlightLabel="Session Focus"
            />
          </div>
          <div className="bg-slate-50 dark:bg-muted/10 p-2.5 rounded-xl border border-border/60 text-[10px] text-muted-foreground flex items-center gap-1.5 animate-in fade-in duration-200">
            <Bookmark className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>Syllabus CEE 0732 2131 Section 5 and 6 details.</span>
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col h-full justify-between gap-4 text-left select-text">
          <div>
            <div className="flex items-center space-x-1.5 text-slate-500 font-bold text-xs uppercase mb-1">
              <BookOpen className="h-4.5 w-4.5" />
              <span>Recommended Books</span>
            </div>
            <SlideParagraph variant="plain" className="text-xs text-muted-foreground">Prescribed readings & reference homework bases.</SlideParagraph>
          </div>
          <div className="flex-1 bg-slate-50/50 dark:bg-muted/5 p-4 rounded-xl border border-border/50">
            <ReferenceBooksList references={references} />
          </div>
        </div>
      }
    />
  );
};
