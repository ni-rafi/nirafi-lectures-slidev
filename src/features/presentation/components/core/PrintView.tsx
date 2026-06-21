import React, { useEffect, useState, useContext, useMemo } from 'react';
import type { Subject, Lecture, Session } from '@/config/lectures';
import type { VectorElement } from '../../types';
import { ClickStepsProvider } from '../../context/ClickStepsContext';
import { PresentationContext } from '../../context/PresentationContext';
import SlideContainer from './SlideContainer';
import MorphingBackground from '@/shared/components/MorphingBackground';
import GlobalTop from '../layers/GlobalTop';
import SlideRenderer, { getSlideMetadata, getLectureSlideCount, getBgVariant } from '../slides/SlideRenderer';
import { SvgElementsRenderer } from '../layers/SvgElementsRenderer';
import GlobalBottom from '../layers/GlobalBottom';

interface PrintSlideItemProps {
  slideNo: number;
  subject: Subject;
  lecture: Lecture;
  session?: Session;
  includeAnnotations: boolean;
}

const PrintSlideItem: React.FC<PrintSlideItemProps> = ({
  slideNo,
  subject,
  lecture,
  session,
  includeAnnotations,
}) => {
  const meta = getSlideMetadata(slideNo, subject, lecture);
  const bgVariant = getBgVariant(meta.type);
  const isCoverPage = slideNo === 1 || meta?.type === 'Thank You Slide';

  const [annotations, setAnnotations] = useState<VectorElement[]>([]);

  useEffect(() => {
    if (includeAnnotations) {
      const storageKey = `cee_drawings_${lecture.id}_${slideNo}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setAnnotations(JSON.parse(saved) as VectorElement[]);
        } catch (e) {
          console.error('Failed to parse annotations for slide', slideNo, e);
        }
      }
    }
  }, [includeAnnotations, lecture.id, slideNo]);

  const presentation = useContext(PresentationContext);
  const cardContextValue = useMemo(() => ({
    theme: presentation?.theme || 'light',
    viewMode: 'present' as const,
    activeSubStep: 999,
    slideNo,
    isThumbnail: false,
  }), [presentation, slideNo]);

  return (
    <div className="print-slide-page">
      <PresentationContext.Provider value={cardContextValue}>
        <SlideContainer scaleMode="1:1" isThumbnail={true}>
          <MorphingBackground variant={bgVariant} />
          
          <GlobalTop
            subjectName={subject.courseTitle}
            subjectCode={subject.courseCode}
            lectureTitle={lecture.title}
            hide={isCoverPage}
          />
          
          <div className="flex-1 flex flex-col justify-center items-center px-4 pt-[20px] pb-[35px] text-center select-text relative z-10">
            <SlideRenderer slideNo={slideNo} subject={subject} lecture={lecture} session={session} />
          </div>

          {includeAnnotations && annotations.length > 0 && (
            <svg
              viewBox="0 0 980 551.25"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 25,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
              className="overflow-visible"
            >
              <SvgElementsRenderer
                elements={annotations}
                currentElement={null}
                activeTool="select"
                selectedId={null}
                onElementDown={() => {}}
              />
            </svg>
          )}
          
          <GlobalBottom current={slideNo} total={getLectureSlideCount(lecture.id)} hide={isCoverPage} />
        </SlideContainer>
      </PresentationContext.Provider>
    </div>
  );
};

interface PrintViewProps {
  subject: Subject;
  lecture: Lecture;
  session?: Session;
  includeAnnotations: boolean;
}

export const PrintView: React.FC<PrintViewProps> = ({
  subject,
  lecture,
  session,
  includeAnnotations,
}) => {
  const totalSlides = getLectureSlideCount(lecture.id);
  const slideNumbers = Array.from({ length: totalSlides }, (_, i) => i + 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1500);

    const handleAfterPrint = () => {
      window.close();
    };
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  return (
    <div className="print-layout w-full min-h-screen bg-white text-black">
      {slideNumbers.map((slideNo) => (
        <ClickStepsProvider key={slideNo} currentClickOverride={999}>
          <PrintSlideItem
            slideNo={slideNo}
            subject={subject}
            lecture={lecture}
            session={session}
            includeAnnotations={includeAnnotations}
          />
        </ClickStepsProvider>
      ))}
    </div>
  );
};

export default PrintView;
