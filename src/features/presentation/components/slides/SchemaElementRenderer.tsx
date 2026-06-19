import React from 'react';
import { QuizCardOrchestrator } from '@/features/quiz';
import {
  SlideParagraph,
  SlideList,
  SlideTable,
  ClickHighlight,
  LatexFormula,
  InteractiveCard,
} from '@/features/presentation/components/elements';
import {
  SlideSchemaElement,
  SchemaParagraphElement,
  SchemaListElement,
  SchemaTableElement,
  SchemaLatexElement,
  PlaygroundPage,
  VisualCanvasShape,
  PhysicalUnit,
  HighlightableListElementData,
  MasterDetailElementData,
  InteractiveScheduleElementData,
  ReferenceLegendsElementData,
  ReferenceBooksElementData,
} from '../../types/schema';
import { SlideVisualCanvas } from '../elements/SlideVisualCanvas';
import { HighlightableList } from '@/features/outline/components/HighlightableList';
import { MasterDetailPanel } from '@/features/outline/components/MasterDetailPanel';
import { InteractiveScheduleTable } from '@/features/outline/components/InteractiveScheduleTable';
import { ReferenceLegends } from '@/features/outline/components/ReferenceLegends';
import { ReferenceBooksList } from '@/features/outline/components/ReferenceBooksList';
import RebarCalculatorInputs from './RebarCalculatorInputs';
import RebarCalculatorOutputs from './RebarCalculatorOutputs';

interface SchemaElementRendererProps {
  elem: SlideSchemaElement | undefined;
  dbPages: PlaygroundPage[] | null;
}

export const SchemaElementRenderer: React.FC<SchemaElementRendererProps> = ({
  elem,
  dbPages,
}) => {
  if (!elem) return null;

  switch (elem.type) {
    case 'rich-paragraph': {
      const pData = elem.data as SchemaParagraphElement;
      return (
        <SlideParagraph>
          {pData.fragments.map((frag, idx) => {
            if (typeof frag === 'string') {
              return <span key={idx}>{frag}</span>;
            }
            if (frag && frag.highlight) {
              return (
                <ClickHighlight key={idx} at={frag.at} variant={frag.variant || 'paint'}>
                  {frag.highlight}
                </ClickHighlight>
              );
            }
            return null;
          })}
        </SlideParagraph>
      );
    }

    case 'list': {
      const listData = elem.data as SchemaListElement;
      const listConfig = elem.config as { revealMode?: 'each-click' | 'all-click' | 'auto-stagger' | 'none' } | undefined;
      return (
        <SlideList
          title={listData.listTitle}
          description={listData.description}
          items={listData.items}
          revealMode={listConfig?.revealMode}
        />
      );
    }

    case 'table': {
      const tableData = elem.data as SchemaTableElement;
      const tableConfig = elem.config as { striped?: boolean; bordered?: boolean; hoverable?: boolean } | undefined;
      return (
        <SlideTable
          headers={tableData.headers}
          rows={tableData.rows}
          striped={tableConfig?.striped}
          bordered={tableConfig?.bordered}
          hoverable={tableConfig?.hoverable}
        />
      );
    }

    case 'latex': {
      const latexData = elem.data as SchemaLatexElement;
      const latexConfig = elem.config as { title?: string } | undefined;
      return (
        <InteractiveCard variant="plain" title={latexConfig?.title}>
          <div className="flex items-center gap-1.5 justify-center py-2 select-text">
            {latexData.formulaParts.map((part, idx) => {
              if (typeof part === 'string') {
                return <LatexFormula key={idx} math={part} />;
              }
              if (part && part.highlight) {
                return (
                  <ClickHighlight key={idx} at={part.at} variant={part.variant || 'text'}>
                    <LatexFormula math={part.highlight} />
                  </ClickHighlight>
                );
              }
              return null;
            })}
          </div>
        </InteractiveCard>
      );
    }

    case 'quiz': {
      const quizData = elem.data as { question: string; correctAnswer: string };
      const quizConfig = elem.config as { quizId: string; quizType?: 'numeric-input' | 'multiple-choice' } | undefined;
      if (!quizConfig) return null;
      return (
        <QuizCardOrchestrator
          quizId={quizConfig.quizId}
          questionText={quizData.question}
          quizType={quizConfig.quizType || 'numeric-input'}
        />
      );
    }

    case 'rebar-calculator-inputs':
      return <RebarCalculatorInputs />;

    case 'rebar-calculator-outputs':
      return <RebarCalculatorOutputs />;

    case 'highlightable-list': {
      const data = elem.data as HighlightableListElementData | null;
      return (
        <HighlightableList
          items={(data?.items || data?.outcomes) || []}
          highlightedIds={data?.highlightedIds || data?.coCoveredIds}
          listTitle={data?.listTitle}
          highlightLabel={data?.highlightLabel}
          badgePrefix={data?.badgePrefix}
          notHighlightedMessage={data?.notHighlightedMessage}
        />
      );
    }

    case 'master-detail-panel': {
      const data = elem.data as MasterDetailElementData | null;
      return (
        <MasterDetailPanel
          items={(data?.items || data?.contents) || []}
          activeIds={data?.activeIds || data?.ccCoveredIds}
          panelTitle={data?.panelTitle}
          detailHeader={data?.detailHeader}
          badgePrefix={data?.badgePrefix}
          activeLabel={data?.activeLabel}
          inactiveLabel={data?.inactiveLabel}
        />
      );
    }

    case 'interactive-schedule-table': {
      const data = elem.data as InteractiveScheduleElementData | null;
      const config = elem.config as { part: 1 | 2 } | undefined;
      return (
        <InteractiveScheduleTable
          part={config?.part || 1}
          schedule={data?.schedule || []}
          tlLegends={data?.tlLegends || []}
          assessmentLegends={data?.assessmentLegends || []}
          outcomes={data?.outcomes}
          contents={data?.contents}
        />
      );
    }

    case 'reference-legends': {
      const data = elem.data as ReferenceLegendsElementData | null;
      return (
        <ReferenceLegends
          leftTitle={data?.leftTitle}
          rightTitle={data?.rightTitle}
          leftLegends={data?.leftLegends || data?.tlLegends || []}
          rightLegends={data?.rightLegends || data?.assessmentLegends || []}
          rightSubSections={data?.rightSubSections}
        />
      );
    }

    case 'reference-books-list': {
      const data = elem.data as ReferenceBooksElementData | null;
      return (
        <ReferenceBooksList
          title={data?.title}
          references={data?.references || []}
        />
      );
    }

    case 'composite': {
      const compositeData = elem.data as { elements: SlideSchemaElement[] };
      return (
        <div className="space-y-4">
          {compositeData.elements.map((subElem, subIdx) => (
            <React.Fragment key={subIdx}>
              <SchemaElementRenderer elem={subElem} dbPages={dbPages} />
            </React.Fragment>
          ))}
        </div>
      );
    }

    case 'visual-canvas': {
      const canvasConfig = elem.config as {
        pageIndex?: number;
        scaleFactor?: { pixelsPerUnit: number; unit: PhysicalUnit };
      } | undefined;
      const pageIdx = canvasConfig?.pageIndex ?? 0;

      const pageData = dbPages && dbPages[pageIdx] ? dbPages[pageIdx] : null;
      const elements = pageData ? pageData.elements : (elem.data as { elements: VisualCanvasShape[] })?.elements || [];
      const scaleFactor = pageData ? pageData.scaleFactor : canvasConfig?.scaleFactor;

      return (
        <SlideVisualCanvas
          elements={elements}
          scaleFactor={scaleFactor}
        />
      );
    }

    default:
      return null;
  }
};

export default SchemaElementRenderer;
