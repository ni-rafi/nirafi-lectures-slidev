import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Type, List, Sliders, BarChart3, Binary, Table, Eye, Share2, Code2, Hexagon, Activity, Palette, Terminal, Layout, Layers, ClipboardCheck, Calendar, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParagraphsSection from './dev-guide/ParagraphsSection';
import ListsSection from './dev-guide/ListsSection';
import InputsSection from './dev-guide/InputsSection';
import GraphsSection from './dev-guide/GraphsSection';
import FormulasSection from './dev-guide/FormulasSection';
import TablesSection from './dev-guide/TablesSection';
import RevealsSection from './dev-guide/RevealsSection';
import DiagramsSection from './dev-guide/DiagramsSection';
import MagicMoveSection from './dev-guide/MagicMoveSection';
import ShapesSection from './dev-guide/ShapesSection';
import PhysicsSection from './dev-guide/PhysicsSection';
import IconsSection from './dev-guide/IconsSection';
import CodeplaySection from './dev-guide/CodeplaySection';
import LayoutsSection from './dev-guide/LayoutsSection';
import ComposingSection from './dev-guide/ComposingSection';
import QuizzesSection from './dev-guide/QuizzesSection';
import TimelineStepsSection from './dev-guide/TimelineStepsSection';
import CompareAccentsSection from './dev-guide/CompareAccentsSection';
import SchemaEngineSection from './dev-guide/SchemaEngineSection';

type SubSection =
  | 'paragraphs'
  | 'lists'
  | 'inputs'
  | 'graphs'
  | 'formulas'
  | 'tables'
  | 'reveals'
  | 'diagrams'
  | 'magicmove'
  | 'shapes'
  | 'physics'
  | 'icons'
  | 'codeplay'
  | 'quizzes'
  | 'timelinesteps'
  | 'compareaccents'
  | 'layouts'
  | 'composing'
  | 'schemaengine';

export const DevGuideTab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const subParam = searchParams.get('sub') || 'paragraphs';
  const activeSubSection = ([
    'paragraphs',
    'lists',
    'inputs',
    'graphs',
    'formulas',
    'tables',
    'reveals',
    'diagrams',
    'magicmove',
    'shapes',
    'physics',
    'icons',
    'codeplay',
    'quizzes',
    'timelinesteps',
    'compareaccents',
    'layouts',
    'composing',
    'schemaengine'
  ].includes(subParam)
    ? subParam
     : 'paragraphs') as SubSection;

  const setActiveSubSection = (sub: SubSection) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('sub', sub);
      return next;
    }, { replace: true });
  };

  const menuItems = [
    { id: 'paragraphs' as SubSection, label: 'Paragraphs & Highlights', icon: Type },
    { id: 'lists' as SubSection, label: 'Lists & Bullets', icon: List },
    { id: 'inputs' as SubSection, label: 'Interactive Controls', icon: Sliders },
    { id: 'graphs' as SubSection, label: 'Charts & Graphs', icon: BarChart3 },
    { id: 'formulas' as SubSection, label: 'Math & Formulas', icon: Binary },
    { id: 'tables' as SubSection, label: 'Tables & Cell Highlights', icon: Table },
    { id: 'reveals' as SubSection, label: 'Reveals & Step Sequences', icon: Eye },
    { id: 'diagrams' as SubSection, label: 'Mermaid Diagrams', icon: Share2 },
    { id: 'magicmove' as SubSection, label: 'Animated Code Morphs', icon: Code2 },
    { id: 'shapes' as SubSection, label: 'Vector Shape Morphs', icon: Hexagon },
    { id: 'physics' as SubSection, label: 'Draggable Physics Canvas', icon: Activity },
    { id: 'icons' as SubSection, label: 'Icons & Graphics', icon: Palette },
    { id: 'codeplay' as SubSection, label: 'Code & Playgrounds', icon: Terminal },
    { id: 'quizzes' as SubSection, label: 'Interactive Quizzes', icon: ClipboardCheck },
    { id: 'timelinesteps' as SubSection, label: 'Timelines & Steps', icon: Calendar },
    { id: 'compareaccents' as SubSection, label: 'Comparisons & Accents', icon: Bookmark },
    { id: 'layouts' as SubSection, label: 'Slide Layouts', icon: Layout },
    { id: 'composing' as SubSection, label: 'Lecture Composition', icon: Layers },
    { id: 'schemaengine' as SubSection, label: 'Schema Engine', icon: Code2 },
  ];

  const renderContent = () => {
    switch (activeSubSection) {
      case 'paragraphs':
        return <ParagraphsSection />;
      case 'lists':
        return <ListsSection />;
      case 'inputs':
        return <InputsSection />;
      case 'graphs':
        return <GraphsSection />;
      case 'formulas':
        return <FormulasSection />;
      case 'tables':
        return <TablesSection />;
      case 'reveals':
        return <RevealsSection />;
      case 'diagrams':
        return <DiagramsSection />;
      case 'magicmove':
        return <MagicMoveSection />;
      case 'shapes':
        return <ShapesSection />;
      case 'physics':
        return <PhysicsSection />;
      case 'icons':
        return <IconsSection />;
      case 'codeplay':
        return <CodeplaySection />;
      case 'quizzes':
        return <QuizzesSection />;
      case 'timelinesteps':
        return <TimelineStepsSection />;
      case 'compareaccents':
        return <CompareAccentsSection />;
      case 'layouts':
        return <LayoutsSection />;
      case 'composing':
        return <ComposingSection />;
      case 'schemaengine':
        return <SchemaEngineSection />;
      default:
        return <ParagraphsSection />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in duration-300 md:h-[calc(100vh-200px)] md:overflow-hidden">
      {/* Nested Left Navigation Menu */}
      <aside className="md:col-span-3 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-6 border-border/80 md:h-full md:overflow-y-auto scrollbar-thin">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-2 mb-2 select-none">
          Component Customization
        </span>
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 pb-2 md:pb-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubSection === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveSubSection(item.id)}
                className={`justify-start text-xs h-9 font-semibold cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-primary/10 text-primary hover:bg-primary/15'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </aside>

      {/* Main Sub-Section content area */}
      <main className="md:col-span-9 min-h-[300px] flex flex-col gap-6 md:h-full md:overflow-y-auto md:pr-4 pb-12 scrollbar-thin">
        <div>
          <h3 className="text-base font-extrabold text-foreground border-b pb-2 uppercase tracking-wide">
            {menuItems.find((m) => m.id === activeSubSection)?.label} Reference
          </h3>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default DevGuideTab;
