import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '@/context/FirebaseContext';
import { TitleLayout } from '@/shared/layouts/TitleLayout';
import { TitleV2Layout } from '@/shared/layouts/TitleV2Layout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { ThankYouLayout } from '@/shared/layouts/ThankYouLayout';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';
import { SlideSchema, PlaygroundPage } from '../../types/schema';
import SchemaElementRenderer from './SchemaElementRenderer';

interface SlideSchemaEngineProps {
  slideNo: number;
  deck: SlideSchema[];
  subject?: unknown;
  lecture?: unknown;
  session?: unknown;
}

export const SlideSchemaEngine: React.FC<SlideSchemaEngineProps> = ({
  slideNo,
  deck,
  subject,
  lecture,
  session,
}) => {
  const { subjectId, sessionId, lectureId } = useParams<{
    subjectId: string;
    sessionId: string;
    lectureId: string;
  }>();
  const firebaseService = useFirebase();
  const [dbPages, setDbPages] = useState<PlaygroundPage[] | null>(null);

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

  const typedSubject = subject as { courseCode?: string; courseTitle?: string; yearSemester?: string; creditHours?: string } | undefined;
  const typedLecture = lecture as { title?: string; description?: string; lectureNumber?: string | number } | undefined;
  const typedSession = session as { usnCode?: string; session?: string } | undefined;

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
          courseTitle={config.props.courseTitle || typedSubject?.courseTitle || config.props.title || typedLecture?.title || ''}
          subtitle={config.props.subtitle || typedLecture?.title}
          yearSemester={config.props.yearSemester || typedSubject?.yearSemester || ''}
          creditHours={config.props.creditHours || typedSubject?.creditHours || ''}
          usnCode={config.props.usnCode || typedSession?.usnCode || ''}
          session={config.props.session || typedSession?.session || ''}
          lectureNumber={config.props.lectureNumber || typedLecture?.lectureNumber}
        />
      );

    case 'twocolumn': {
      const bg = config.props.bgVariant === 'cover' ? undefined : config.props.bgVariant;
      return (
        <TwoColumnLayout
          title={config.props.title || config.metadata?.title || ''}
          bgVariant={bg}
          leftWidth={config.props.leftWidth || '45%'}
          leftContent={<SchemaElementRenderer elem={config.props.leftElement} dbPages={dbPages} />}
          rightContent={<SchemaElementRenderer elem={config.props.rightElement} dbPages={dbPages} />}
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
          <SchemaElementRenderer elem={config.props.element} dbPages={dbPages} />
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

    case 'topic-divider':
      return (
        <TopicDividerLayout
          title={config.props.title || config.metadata?.title || ''}
          subtitle={config.props.subtitle}
          topicNumber={config.props.topicNumber}
          description={config.props.description}
        />
      );

    default:
      return null;
  }
};

export default SlideSchemaEngine;
