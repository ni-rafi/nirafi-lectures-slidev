import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import type { Subject, Lecture, Session } from '@/config/lectures';
import type { VectorElement } from '../../types';
import { ClickStepsProvider, useClickStepsContext } from '../../context/ClickStepsContext';
import { PresentationContext } from '../../context/PresentationContext';
import SlideContainer from './SlideContainer';
import MorphingBackground from '@/shared/components/MorphingBackground';
import GlobalTop from '../layers/GlobalTop';
import SlideRenderer, { getSlideMetadata, getBgVariant, getLectureDeck, getLectureSlideCount } from '../slides/SlideRenderer';
import { SvgElementsRenderer } from '../layers/SvgElementsRenderer';
import GlobalBottom from '../layers/GlobalBottom';
import { QRCodeSVG } from '@/shared/components/QRCodeSVG';

import { useQuizSubscriptions } from '../../hooks/useQuizSubscriptions';

interface PrintSlideItemProps {
  slideNo: number;
  subject: Subject;
  lecture: Lecture;
  session?: Session;
  includeAnnotations: boolean;
  clickStep?: number;
  subPageLabel?: string;
  currentNumber: number;
  totalSlidesCount: number;
}

const PrintSlideItem: React.FC<PrintSlideItemProps> = ({
  slideNo,
  subject,
  lecture,
  session,
  includeAnnotations,
  clickStep,
  subPageLabel,
  currentNumber,
  totalSlidesCount,
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
    activeSubStep: clickStep !== undefined ? clickStep : 999,
    slideNo,
    isThumbnail: false,
  }), [presentation, slideNo, clickStep]);

  const lectureUrl = useMemo(() => {
    return `${window.location.origin}/${subject.id}/${session?.id || '2023-24'}/${lecture.id}`;
  }, [subject.id, session?.id, lecture.id]);

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

          {slideNo === 1 && (
            <div 
              className="absolute bottom-6 right-8 z-30 flex items-center gap-3 p-2 rounded-xl border border-border/40 shadow-sm text-left select-text bg-white"
              style={{ background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', color: '#111827' }}
            >
              <QRCodeSVG value={lectureUrl} size={64} className="rounded-lg overflow-hidden border border-border/30" />
              <div className="flex flex-col text-[10px] max-w-[160px] leading-tight">
                <span className="font-bold text-muted-foreground uppercase tracking-widest text-[8px] mb-0.5" style={{ color: '#6b7280' }}>Online Lecture</span>
                <a href={lectureUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all font-mono font-semibold" style={{ color: 'var(--primary)' }}>
                  {lectureUrl.replace(/^https?:\/\//, '')}
                </a>
                <span className="text-[8px] text-muted-foreground/80 mt-1" style={{ color: '#9ca3af' }}>Scan QR or Click link to join</span>
              </div>
            </div>
          )}

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
          
          <GlobalBottom 
            current={subPageLabel ? `${currentNumber}-${subPageLabel}` : currentNumber} 
            total={totalSlidesCount} 
            hide={isCoverPage} 
          />
        </SlideContainer>
      </PresentationContext.Provider>
    </div>
  );
};

const ClickStepDetector: React.FC<{
  slideNo: number;
  onDetect: (slideNo: number, totalClicks: number, isTabbed: boolean) => void;
}> = ({ slideNo, onDetect }) => {
  const { totalClicks, isTabbedSlide } = useClickStepsContext();

  useEffect(() => {
    onDetect(slideNo, totalClicks, !!isTabbedSlide);
  }, [slideNo, totalClicks, isTabbedSlide, onDetect]);

  return null;
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
  const quizStates = useQuizSubscriptions(subject, lecture, false);

  const totalSlides = getLectureSlideCount(lecture.id);

  const filteredSlideNumbers = useMemo(() => {
    const list: number[] = [];
    const deck = getLectureDeck(lecture.id);

    for (let i = 1; i <= totalSlides; i++) {
      const meta = deck.slideMetadata[i];
      if (meta && meta.quizId && meta.quizVisibilityMode === 'stealth') {
        const qState = quizStates[meta.quizId];
        const isLive = qState?.status === 'active' || qState?.status === 'closed';
        if (!isLive) {
          continue;
        }
      }
      list.push(i);
    }
    return list;
  }, [totalSlides, lecture.id, quizStates]);

  const [detectedData, setDetectedData] = useState<Record<number, { totalClicks: number; isTabbed: boolean }>>({});

  const handleDetect = useCallback((slideNo: number, totalClicks: number, isTabbed: boolean) => {
    setDetectedData((prev) => {
      const existing = prev[slideNo];
      if (existing && existing.totalClicks === totalClicks && existing.isTabbed === isTabbed) {
        return prev;
      }
      return {
        ...prev,
        [slideNo]: { totalClicks, isTabbed },
      };
    });
  }, []);

  const printPages = useMemo(() => {
    const pages: Array<{ slideNo: number; clickStep: number; subPageLabel?: string }> = [];

    for (const slideNo of filteredSlideNumbers) {
      const data = detectedData[slideNo];
      
      if (data && data.isTabbed && data.totalClicks > 0) {
        // Tabbed slides: split into separate pages per step
        const stepsCount = data.totalClicks + 1;
        for (let i = 0; i < stepsCount; i++) {
          pages.push({
            slideNo,
            clickStep: i,
            subPageLabel: String.fromCharCode(65 + i), // A, B, C, D...
          });
        }
      } else {
        // Normal slides: print once with final state visible
        pages.push({
          slideNo,
          clickStep: 999,
        });
      }
    }

    return pages;
  }, [filteredSlideNumbers, detectedData]);

  useEffect(() => {
    const originalTitle = document.title;
    const cleanSession = session?.label || session?.id || 'Session';
    document.title = `${subject.courseCode} - ${cleanSession} - ${lecture.title}`;

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
      document.title = originalTitle;
    };
  }, [subject.courseCode, session, lecture.title]);

  return (
    <div className="print-layout w-full min-h-screen bg-white text-black">
      {/* Hidden offscreen container for click step and layout type detection */}
      <div 
        style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
        aria-hidden="true"
      >
        {filteredSlideNumbers.map((slideNo) => (
          <ClickStepsProvider key={`detect-${slideNo}`}>
            <SlideRenderer slideNo={slideNo} subject={subject} lecture={lecture} session={session} />
            <ClickStepDetector slideNo={slideNo} onDetect={handleDetect} />
          </ClickStepsProvider>
        ))}
      </div>

      {/* Main Print Sheets Layout */}
      {printPages.map((page, index) => {
        const currentNumber = filteredSlideNumbers.indexOf(page.slideNo) + 1;
        return (
          <ClickStepsProvider key={`page-${page.slideNo}-${page.clickStep}-${index}`} currentClickOverride={page.clickStep}>
            <PrintSlideItem
              slideNo={page.slideNo}
              subject={subject}
              lecture={lecture}
              session={session}
              includeAnnotations={includeAnnotations}
              clickStep={page.clickStep}
              subPageLabel={page.subPageLabel}
              currentNumber={currentNumber}
              totalSlidesCount={filteredSlideNumbers.length}
            />
          </ClickStepsProvider>
        );
      })}
    </div>
  );
};

export default PrintView;
