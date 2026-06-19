import React, { useState } from 'react';
import { PlaygroundSection } from './PlaygroundSection';
import { HighlightableList } from '@/features/outline/components/HighlightableList';
import { MasterDetailPanel } from '@/features/outline/components/MasterDetailPanel';
import { InteractiveScheduleTable } from '@/features/outline/components/InteractiveScheduleTable';
import { ReferenceLegends } from '@/features/outline/components/ReferenceLegends';
import { ReferenceBooksList } from '@/features/outline/components/ReferenceBooksList';
import { HoverTooltip } from '@/features/presentation/components/elements/HoverTooltip';

type ComponentType = 'highlightable-list' | 'master-detail' | 'schedule-table' | 'legends' | 'books' | 'tooltip';

export const SyllabusElementsSection: React.FC = () => {
  const [componentType, setComponentType] = useState<ComponentType>('highlightable-list');

  // Dummy datasets for documentation preview
  const demoOutcomes = [
    { id: 1, description: 'Evaluate rebar volume requirements for standard cast concrete structures.' },
    { id: 2, description: 'Analyze structural brickwork load distribution and calculate brick quantity requirements.' },
    { id: 3, description: 'Design structural steel beams and calculate rebar weight index calculations.' },
  ];

  const demoContents = [
    { id: 1, title: 'Concrete Foundations', description: 'Volume calculation, concrete grade mixing, and reinforcement mesh spacing.' },
    { id: 2, title: 'Load-Bearing Masonry', description: 'Brick quantity survey parameters, mortar ratio mixing calculations, and standard wall bonding.' },
    { id: 3, title: 'Steel Structural Elements', description: 'Rebar weight formulas, length constraints, and waste reduction methodologies.' },
  ];

  const demoLegends = [
    { code: 'TL 01', strategy: 'Lectures and board sessions' },
    { code: 'TL 02', strategy: 'Hands-on calculation lab' },
  ];

  const demoAssessments = [
    { code: 'CA 01', strategy: 'Class assignment sheet' },
    { code: 'SA 01', strategy: 'Final exams and practicals' },
  ];

  const demoBooks = [
    { id: 1, title: 'Quantity Surveying Practice', author: 'Dr. Rafi', edition: '3rd Edition', publisher: 'SUST Press' },
  ];

  const demoSchedule = [
    { week: 1, topic: 'Introduction to Concrete Volume Casting', contentCode: '1', coCovered: '1', tlStrategy: ['TL 01'], assessmentStrategy: ['CA 01'] },
    { week: 2, topic: 'Reinforcement Steel Bar Computations', contentCode: '3', coCovered: '3', tlStrategy: ['TL 01', 'TL 02'], assessmentStrategy: ['CA 01', 'SA 01'] },
  ];

  const renderPreview = () => {
    switch (componentType) {
      case 'highlightable-list':
        return (
          <div className="border border-border/40 p-4 rounded-xl bg-card w-full">
            <HighlightableList
              items={demoOutcomes}
              highlightedIds={[1, 2]}
              listTitle="Syllabus Core Learning Outcomes"
              badgePrefix="LO"
            />
          </div>
        );
      case 'master-detail':
        return (
          <div className="border border-border/40 p-4 rounded-xl bg-card w-full">
            <MasterDetailPanel
              items={demoContents}
              activeIds={[1, 2, 3]}
              panelTitle="Syllabus Modules"
              detailHeader="Module Descriptions"
              badgePrefix="Module"
            />
          </div>
        );
      case 'schedule-table':
        return (
          <div className="border border-border/40 p-4 rounded-xl bg-card w-full">
            <InteractiveScheduleTable
              part={1}
              schedule={demoSchedule}
              tlLegends={demoLegends}
              assessmentLegends={demoAssessments}
              outcomes={demoOutcomes}
              contents={demoContents}
            />
          </div>
        );
      case 'legends':
        return (
          <div className="border border-border/40 p-4 rounded-xl bg-card w-full">
            <ReferenceLegends
              leftTitle="Teaching Strategies"
              rightTitle="Assessment Strategies"
              leftLegends={demoLegends}
              rightLegends={demoAssessments}
            />
          </div>
        );
      case 'books':
        return (
          <div className="border border-border/40 p-4 rounded-xl bg-card w-full">
            <ReferenceBooksList
              title="Recommended Bibliography"
              references={demoBooks}
            />
          </div>
        );
      case 'tooltip':
        return (
          <div className="border border-border/40 p-8 rounded-xl bg-card w-full flex items-center justify-center min-h-[120px]">
            <HoverTooltip
              trigger={
                <span className="font-bold text-primary underline decoration-dotted cursor-pointer select-none">
                  Hover Over Me
                </span>
              }
              title="Generic Tooltip"
              content="This tooltip can wrap any text, badge, or element, showing absolute-positioned description cards on hover."
            />
          </div>
        );
    }
  };

  const getCodeText = () => {
    switch (componentType) {
      case 'highlightable-list':
        return `// Slide Schema element configuration
const slideElement = {
  type: 'highlightable-list',
  data: {
    items: [
      { id: 1, description: 'Evaluate rebar volume requirements.' },
      { id: 2, description: 'Analyze structural brickwork.' }
    ],
    highlightedIds: [1], // IDs highlighted at active click step
    badgePrefix: 'LO', // (Optional) defaults to "CO"
    listTitle: 'Learning Outcomes' // (Optional)
  }
};`;
      case 'master-detail':
        return `// Slide Schema element configuration
const slideElement = {
  type: 'master-detail-panel',
  data: {
    items: [
      { id: 1, title: 'Concrete Foundations', description: 'Volume calculations...' }
    ],
    activeIds: [1], // Highlighted items
    badgePrefix: 'Module', // (Optional) defaults to "CC"
    panelTitle: 'Syllabus Modules' // (Optional)
  }
};`;
      case 'schedule-table':
        return `// Slide Schema element configuration
const slideElement = {
  type: 'interactive-schedule-table',
  config: { part: 1 }, // Renders week <= 7 for part 1, else part 2
  data: {
    schedule: scheduleArray,
    tlLegends: tlLegendsArray,
    assessmentLegends: assessmentLegendsArray,
    outcomes: outcomesArray,
    contents: contentsArray
  }
};`;
      case 'legends':
        return `// Slide Schema element configuration
const slideElement = {
  type: 'reference-legends',
  data: {
    leftLegends: tlLegendsArray,
    rightLegends: assessmentLegendsArray,
    leftTitle: 'Teaching Strategies', // (Optional)
    rightTitle: 'Assessment Strategies' // (Optional)
  }
};`;
      case 'books':
        return `// Slide Schema element configuration
const slideElement = {
  type: 'reference-books-list',
  data: {
    title: 'Course Bibliography', // (Optional)
    references: booksArray
  }
};`;
      case 'tooltip':
        return `import { HoverTooltip } from '@/features/presentation';

<HoverTooltip
  trigger={<span className="underline font-bold text-primary">Hover Over Me</span>}
  title="Generic Tooltip"
  content="This tooltip wraps any trigger element to show a details bubble on hover."
/>`;
    }
  };

  const renderEditor = () => {
    return (
      <div className="text-slate-300 space-y-3 text-[11px] font-mono">
        <div>
          <span className="text-muted-foreground">// Choose Documentation Item:</span>{"\n"}
          &lt;<span className="text-blue-400">ElementSelector</span> <span className="text-teal-400">type</span>=<span className="text-amber-300">"</span>
          <select
            value={componentType}
            onChange={(e) => setComponentType(e.target.value as ComponentType)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer font-bold"
          >
            <option value="highlightable-list">HighlightableList (Outcomes)</option>
            <option value="master-detail">MasterDetailPanel (Chapters)</option>
            <option value="schedule-table">InteractiveScheduleTable</option>
            <option value="legends">ReferenceLegends</option>
            <option value="books">ReferenceBooksList</option>
            <option value="tooltip">HoverTooltip (Utility)</option>
          </select>
          <span className="text-amber-300">"</span> /&gt;
        </div>
        <div className="text-[11px] text-muted-foreground leading-relaxed pt-2">
          {componentType === 'highlightable-list' && (
            <span>
              <strong>HighlightableList</strong> provides a visual list of outcome statements. It hooks into the slide-click steps, dimming non-covered outcomes while highlighting currently active outcomes dynamically during presentation mode.
            </span>
          )}
          {componentType === 'master-detail' && (
            <span>
              <strong>MasterDetailPanel</strong> splits detailed information into an interactive button list on the left and a detailed paragraph container on the right. Useful for navigating multiple topics or chapters without taking full screen heights.
            </span>
          )}
          {componentType === 'schedule-table' && (
            <span>
              <strong>InteractiveScheduleTable</strong> encapsulates a calendar schedule inside the existing <code>SlideTable</code> component. It automatically parses content indexes and embeds floating <code>HoverTooltip</code> boxes for strategy code keys.
            </span>
          )}
          {componentType === 'legends' && (
            <span>
              <strong>ReferenceLegends</strong> renders side-by-side glossary descriptions. Supports custom column headings and splits assessments dynamically into Continuous (CA) and Summative (SA) sections.
            </span>
          )}
          {componentType === 'books' && (
            <span>
              <strong>ReferenceBooksList</strong> presents a grid of textbooks, articles, and references styled as cards in slide decks, adapting to a flat outline on mobile devices or in blog mode.
            </span>
          )}
          {componentType === 'tooltip' && (
            <span>
              <strong>HoverTooltip</strong> is a lightweight utility component that wraps any React node to display detail descriptions on hover. It uses isolated state tracking to avoid CSS nesting display conflicts.
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <PlaygroundSection
      title="Syllabus & Course Outline Components"
      description={
        <span>
          A suite of generic course outline, syllabus breakdown, and terminology legends components. These presentation blocks decouple raw data sets from presentation layouts, allowing flexible syllabus documentation across any lecture subject.
        </span>
      }
      preview={renderPreview()}
      codeText={getCodeText()}
      editorContent={renderEditor()}
    />
  );
};

export default SyllabusElementsSection;
