import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '@/context/FirebaseContext';
import { TitleLayout } from '@/shared/layouts/TitleLayout';
import { TitleV2Layout } from '@/shared/layouts/TitleV2Layout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ThankYouLayout } from '@/shared/layouts/ThankYouLayout';
import { QuizCardOrchestrator } from '@/features/quiz';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import {
  SlideParagraph,
  SlideList,
  SlideTable,
  ClickHighlight,
  LatexFormula,
  InteractiveCard,
  ParameterSlider,
  CalculationOutput,
} from '@/features/presentation/components/elements';
import {
  SlideSchema,
  SlideSchemaElement,
  SchemaParagraphElement,
  SchemaListElement,
  SchemaTableElement,
  SchemaLatexElement,
} from '../../types/schema';
import { SlideVisualCanvas } from '../elements/SlideVisualCanvas';
import { HighlightableList } from '@/features/outline/components/HighlightableList';
import { MasterDetailPanel } from '@/features/outline/components/MasterDetailPanel';
import { InteractiveScheduleTable } from '@/features/outline/components/InteractiveScheduleTable';
import { ReferenceLegends } from '@/features/outline/components/ReferenceLegends';
import { ReferenceBooksList } from '@/features/outline/components/ReferenceBooksList';

// Live Rebar parameters inputs sub-component using synced URL state
const RebarCalculatorInputs: React.FC = () => {
  const [diameter, setDiameter] = useUrlSyncedState<number>('diameter', 12);
  const [length, setLength] = useUrlSyncedState<number>('length', 100);

  return (
    <InteractiveCard title="Parameters (SI Units)">
      <ParameterSlider
        label="Rebar Diameter:"
        value={diameter}
        unit="mm"
        min={6}
        max={32}
        step={1}
        onChange={setDiameter}
      />
      <ParameterSlider
        label="Total Length:"
        value={length}
        unit="m"
        min={10}
        max={1000}
        step={10}
        onChange={setLength}
      />
    </InteractiveCard>
  );
};

// Live Rebar calculation outputs sub-component using synced URL state
const RebarCalculatorOutputs: React.FC = () => {
  const [diameter] = useUrlSyncedState<number>('diameter', 12);
  const [length] = useUrlSyncedState<number>('length', 100);

  const unitWeight = (diameter * diameter) / 162;
  const weight = parseFloat((unitWeight * length).toFixed(3));

  return (
    <CalculationOutput
      title="Rebar Weight Output"
      value={weight}
      unit="kg"
      subtitle={`Estimated Unit Weight: ${unitWeight.toFixed(3)} kg/m`}
    />
  );
};

interface SlideSchemaEngineProps {
  slideNo: number;
  deck: SlideSchema[];
  subject?: unknown;
  lecture?: unknown;
}

export const SlideSchemaEngine: React.FC<SlideSchemaEngineProps> = ({
  slideNo,
  deck,
  subject,
  lecture,
}) => {
  const { subjectId, sessionId, lectureId } = useParams<{
    subjectId: string;
    sessionId: string;
    lectureId: string;
  }>();
  const firebaseService = useFirebase();
  const [dbPages, setDbPages] = useState<any[] | null>(null);

  useEffect(() => {
    if (!subjectId || !sessionId || !lectureId) return;
    let active = true;
    const load = async () => {
      try {
        const docId = `${subjectId}:${sessionId}:${lectureId}`;
        const data = await firebaseService.getPlaygroundCanvas(docId);
        if (active && data && data.pages) {
          setDbPages(data.pages);
        }
      } catch (e) {
        console.error('[SlideSchemaEngine] Live canvas fetch failed:', e);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [subjectId, sessionId, lectureId, firebaseService]);
  const config = deck.find((s) => s.id === slideNo);
  if (!config) {
    return <div className="p-6 text-red-500 font-bold">Slide configuration not found for index {slideNo}</div>;
  }

  const typedSubject = subject as { courseCode?: string } | undefined;
  const typedLecture = lecture as { title?: string; description?: string } | undefined;

  // Resolves slide schema elements to concrete interactive components
  const renderElement = (elem: SlideSchemaElement | undefined): React.ReactNode => {
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
            correctAnswer={quizData.correctAnswer}
            quizType={quizConfig.quizType || 'numeric-input'}
          />
        );
      }

      case 'rebar-calculator-inputs':
        return <RebarCalculatorInputs />;

      case 'rebar-calculator-outputs':
        return <RebarCalculatorOutputs />;



      case 'highlightable-list': {
        const data = elem.data as any;
        return (
          <HighlightableList
            items={data.items || data.outcomes}
            highlightedIds={data.highlightedIds || data.coCoveredIds}
            listTitle={data.listTitle}
            highlightLabel={data.highlightLabel}
            badgePrefix={data.badgePrefix}
            notHighlightedMessage={data.notHighlightedMessage}
          />
        );
      }

      case 'master-detail-panel': {
        const data = elem.data as any;
        return (
          <MasterDetailPanel
            items={data.items || data.contents}
            activeIds={data.activeIds || data.ccCoveredIds}
            panelTitle={data.panelTitle}
            detailHeader={data.detailHeader}
            badgePrefix={data.badgePrefix}
            activeLabel={data.activeLabel}
            inactiveLabel={data.inactiveLabel}
          />
        );
      }

      case 'interactive-schedule-table': {
        const data = elem.data as any;
        const config = elem.config as { part: 1 | 2 } | undefined;
        return (
          <InteractiveScheduleTable
            part={config?.part || 1}
            schedule={data.schedule}
            tlLegends={data.tlLegends}
            assessmentLegends={data.assessmentLegends}
            outcomes={data.outcomes}
            contents={data.contents}
          />
        );
      }

      case 'reference-legends': {
        const data = elem.data as any;
        return (
          <ReferenceLegends
            leftTitle={data.leftTitle}
            rightTitle={data.rightTitle}
            leftLegends={data.leftLegends || data.tlLegends}
            rightLegends={data.rightLegends || data.assessmentLegends}
            rightSubSections={data.rightSubSections}
          />
        );
      }

      case 'reference-books-list': {
        const data = elem.data as any;
        return (
          <ReferenceBooksList
            title={data.title}
            references={data.references}
          />
        );
      }

      case 'composite': {
        const compositeData = elem.data as { elements: SlideSchemaElement[] };
        return (
          <div className="space-y-4">
            {compositeData.elements.map((subElem, subIdx) => (
              <React.Fragment key={subIdx}>
                {renderElement(subElem)}
              </React.Fragment>
            ))}
          </div>
        );
      }

      case 'visual-canvas': {
        const canvasConfig = elem.config as { pageIndex?: number; scaleFactor?: any } | undefined;
        const pageIdx = canvasConfig?.pageIndex ?? 0;

        const pageData = dbPages && dbPages[pageIdx] ? dbPages[pageIdx] : null;
        const elements = pageData ? pageData.elements : (elem.data as { elements: any[] })?.elements || [];
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

  // Layout wireframe wrapper mapping
  switch (config.layout) {
    case 'title':
      return (
        <TitleLayout
          title={config.props.title || typedLecture?.title || ''}
          subtitle={config.props.subtitle || `${typedSubject?.courseCode || ''} Series • Session 2026-27`}
          description={config.props.description || typedLecture?.description || ''}
          footer={config.props.footer}
        />
      );

    case 'title-v2':
      return (
        <TitleV2Layout
          courseCode={config.props.courseCode || typedSubject?.courseCode || ''}
          courseTitle={config.props.courseTitle || config.props.title || typedLecture?.title || ''}
          subtitle={config.props.subtitle}
          yearSemester={config.props.yearSemester || ''}
          creditHours={config.props.creditHours || ''}
          usnCode={config.props.usnCode || ''}
          session={config.props.session || ''}
        />
      );

    case 'twocolumn': {
      const bg = config.props.bgVariant === 'cover' ? undefined : config.props.bgVariant;
      return (
        <TwoColumnLayout
          title={config.props.title || config.metadata?.title || ''}
          bgVariant={bg}
          leftWidth={config.props.leftWidth || '45%'}
          leftContent={renderElement(config.props.leftElement)}
          rightContent={renderElement(config.props.rightElement)}
        />
      );
    }

    case 'fullwidth': {
      const bg = config.props.bgVariant === 'cover' ? undefined : config.props.bgVariant;
      return (
        <FullWidthLayout
          title={config.props.title || config.metadata?.title || ''}
          bgVariant={bg}
        >
          {renderElement(config.props.element)}
        </FullWidthLayout>
      );
    }

    case 'thankyou':
      return (
        <ThankYouLayout
          title={config.props.title || 'Thank You'}
          subtitle={config.props.subtitle || 'Do you have any question?'}
        />
      );

    default:
      return null;
  }
};

export default SlideSchemaEngine;
