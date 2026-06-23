import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PresentationContext } from '../../features/presentation/context/PresentationContext';
import presenter from '@/config/presenter.json';
import sustLogoUrl from '@/assets/Logos/SUST Logo.svg';
import { QRCodeSVG } from '@/shared/components/QRCodeSVG';

interface PresenterInfo {
  name: string;
  title: string;
  department: string;
  institution: string;
}

interface TitleV2LayoutProps {
  courseCode: string;
  courseTitle: string;
  subtitle?: string;
  yearSemester: string;
  creditHours: string;
  usnCode: string;
  teacher?: PresenterInfo;
  session: string;
  lectureNumber?: string | number;
}

const formatLectureNumber = (num?: string | number): string => {
  if (num === undefined || num === null) return '';
  const parsed = Number(num);
  if (!isNaN(parsed) && Number.isInteger(parsed)) {
    return `Lecture ${String(parsed).padStart(2, '0')}`;
  }
  return `Lecture ${num}`;
};

export const TitleV2Layout: React.FC<TitleV2LayoutProps> = ({
  courseCode,
  courseTitle,
  subtitle = 'Course Syllabus & Syllabus Outline',
  yearSemester,
  creditHours,
  usnCode,
  teacher = presenter,
  session,
  lectureNumber,
}) => {
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';
  const isThumbnail = presentation?.isThumbnail || false;
  const headerTitleClass = isThumbnail ? '' : 'slide-header-title';

  const { subjectId, sessionId, lectureId } = useParams<{
    subjectId: string;
    sessionId: string;
    lectureId: string;
  }>();

  const lectureUrl = useMemo(() => {
    if (!subjectId || !lectureId) return '';
    return `${window.location.origin}/${subjectId}/${sessionId || '2023-24'}/${lectureId}`;
  }, [subjectId, sessionId, lectureId]);

  if (viewMode === 'blog') {
    return (
      <div className="flex flex-col gap-4 py-4 text-left border-b pb-6 border-border/40 w-full">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-extrabold font-mono tracking-wider border bg-primary/10 text-primary uppercase">
            {courseCode}
          </span>
          {lectureNumber && (
            <span className="inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-bold font-mono tracking-wider border border-primary/20 bg-primary/5 text-primary uppercase">
              {formatLectureNumber(lectureNumber)}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          {courseTitle}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-xs">
          <div>
            <span className="font-bold text-muted-foreground block uppercase text-[10px] tracking-wider">Credit</span>
            <span className="font-semibold text-foreground">{creditHours}</span>
          </div>
          <div>
            <span className="font-bold text-muted-foreground block uppercase text-[10px] tracking-wider">Year/Semester</span>
            <span className="font-semibold text-foreground">{yearSemester}</span>
          </div>
          <div>
            <span className="font-bold text-muted-foreground block uppercase text-[10px] tracking-wider">USN</span>
            <span className="font-semibold text-foreground">{usnCode}</span>
          </div>
          <div>
            <span className="font-bold text-muted-foreground block uppercase text-[10px] tracking-wider">Session</span>
            <span className="font-semibold text-foreground">{session}</span>
          </div>
        </div>
        <div className="text-xs border-t pt-4 mt-2 flex flex-col gap-0.5">
          <span className="text-muted-foreground block uppercase text-[10px] tracking-wider font-bold mb-0.5">Course Teacher</span>
          <span className="font-bold text-foreground text-sm leading-none">{teacher.name}</span>
          <span className="text-muted-foreground text-xs">{teacher.title}, {teacher.department}</span>
          <span className="text-muted-foreground text-xs">{teacher.institution}</span>
        </div>
      </div>
    );
  }

  if (viewMode === 'scroll') {
    return (
      <div className="relative flex flex-col w-full bg-card rounded-2xl border border-border p-6 select-text text-foreground animate-in fade-in duration-200">
        <div className="flex flex-col items-center text-center gap-3 pt-4 relative">
          <img src={sustLogoUrl} className="h-12 w-12 object-contain mb-1 sust-logo-transition" alt="SUST Logo" />
          <span className="inline-flex w-fit items-center rounded-md px-3 py-1 text-xs font-bold font-mono tracking-widest border bg-primary/10 text-primary uppercase">
            {courseCode}
          </span>
          <h2 className={`text-xl font-bold tracking-tight text-primary leading-tight ${headerTitleClass}`}>
            {courseTitle}
          </h2>
          {lectureNumber && (
            <span className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider border border-primary/20 bg-primary/5 text-primary uppercase">
              {formatLectureNumber(lectureNumber)}
            </span>
          )}
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest font-mono">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-b border-border/40 py-4 my-4 text-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] font-bold text-muted-foreground/85 uppercase tracking-widest">Year / Semester</span>
            <span className="text-[11px] font-bold text-foreground">{yearSemester}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] font-bold text-muted-foreground/85 uppercase tracking-widest">Credit Hours</span>
            <span className="text-[11px] font-bold text-foreground">{creditHours}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] font-bold text-muted-foreground/85 uppercase tracking-widest">USN Code</span>
            <span className="text-[11px] font-mono font-bold text-primary">{usnCode}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-border/20 text-left">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] font-bold text-muted-foreground/80 uppercase tracking-widest font-mono">Course Teacher</span>
            <span className="text-[11px] font-extrabold text-foreground presenter-name-transition">{teacher.name}</span>
            <span className="text-[9px] text-muted-foreground font-medium leading-none">{teacher.title}, {teacher.department}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] font-bold text-muted-foreground/80 uppercase tracking-widest font-mono">Academic Session</span>
            <span className="text-[11px] font-bold text-muted-foreground">{session}</span>
          </div>
        </div>
      </div>
    );
  }

  // Slide Mode: Visual 16:9 Card layout with beautiful accents and gradients
  return (
    <div className="flex flex-col h-full w-full px-4 py-6 bg-transparent text-foreground relative select-none">
      {/* Top logo similar to title page */}
      <div className="absolute top-6 left-8 z-20">
        <img src={sustLogoUrl} className="h-16 w-16 object-contain sust-logo-transition" alt="SUST Logo" />
      </div>

      {/* Title group pushed a little below and centered */}
      <div className="flex flex-col items-center text-center gap-3 pt-12">
        <span className="inline-flex w-fit items-center rounded-md px-4 py-1.5 text-sm font-extrabold font-mono tracking-widest border bg-primary/10 text-primary uppercase animate-in fade-in slide-in-from-top duration-500">
          {courseCode}
        </span>
        <h1 className={`text-4xl font-extrabold tracking-tight text-primary leading-tight ${headerTitleClass}`}>
          {courseTitle}
        </h1>
        {lectureNumber && (
          <span className="inline-flex w-fit items-center rounded-full px-3 py-0.5 text-[10px] font-bold font-mono tracking-wider border border-primary/20 bg-primary/5 text-primary uppercase">
            {formatLectureNumber(lectureNumber)}
          </span>
        )}
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest font-mono">
          {subtitle}
        </p>
      </div>

      {/* Spacing to keep the grid below the title but not all the way at the bottom */}
      <div className="h-10" />

      <div className="grid grid-cols-4 gap-4 border-t border-b border-border/40 py-6 my-2 text-center select-text">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">Year / Semester</span>
          <span className="text-sm font-bold text-foreground">{yearSemester}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">Academic Session</span>
          <span className="text-sm font-bold text-foreground">{session}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">Credit Hours</span>
          <span className="text-sm font-bold text-foreground">{creditHours}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">USN Code</span>
          <span className="text-sm font-mono font-bold text-primary">{usnCode}</span>
        </div>
      </div>

      {/* Flexible spacer below the grid to push the footer all the way down */}
      <div className="flex-1" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto select-text">
        <div className="flex flex-col text-left gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest font-mono leading-none mb-1">
            Course Teacher
          </span>
          <span className="text-sm font-extrabold text-foreground leading-none presenter-name-transition">{teacher.name}</span>
          <span className="text-[10px] text-muted-foreground font-semibold leading-none mt-1">
            {teacher.title}, {teacher.department}
          </span>
          <span className="text-[9px] text-muted-foreground/80 font-medium leading-none mt-0.5">
            {teacher.institution}
          </span>
        </div>

        {lectureUrl && (
          <div 
            className="flex items-center gap-3 bg-card/60 dark:bg-card/30 backdrop-blur-sm border border-border/40 p-2 rounded-xl text-left shadow-sm select-text hover:bg-card/80 dark:hover:bg-card/45 transition-colors duration-200"
            style={{
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            } as React.CSSProperties}
          >
            <div className="p-1 bg-white rounded-lg flex items-center justify-center shrink-0">
              <QRCodeSVG value={lectureUrl} size={52} fgColor="#0f172a" bgColor="#ffffff" />
            </div>
            <div className="flex flex-col gap-0.5 font-mono">
              <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest leading-none">Interactive Deck</span>
              <a 
                href={lectureUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[8px] text-primary hover:underline font-semibold leading-normal break-all max-w-[150px]"
              >
                {lectureUrl.replace(/^https?:\/\//, '')}
              </a>
              <span className="text-[8px] text-muted-foreground/80 font-semibold leading-none mt-0.5">Scan to follow along</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleV2Layout;
