import React from 'react';
import { usePresentation } from '@/features/presentation/context/PresentationContext';
import { CourseMetadata } from '../types';

interface CourseOutlineCoverProps {
  metadata: CourseMetadata;
}

export const CourseOutlineCover: React.FC<CourseOutlineCoverProps> = ({ metadata }) => {
  const presentation = usePresentation();
  const isBlog = presentation?.viewMode === 'blog';

  if (isBlog) {
    return (
      <div className="flex flex-col gap-4 py-4 text-left border-b pb-6 border-border/40">
        <span className="inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-extrabold font-mono tracking-wider border bg-primary/10 text-primary uppercase">
          {metadata.courseCode}
        </span>
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          {metadata.courseTitle}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-xs">
          <div>
            <span className="font-bold text-muted-foreground block uppercase text-[10px] tracking-wider">Credit</span>
            <span className="font-semibold text-foreground">{metadata.credit}</span>
          </div>
          <div>
            <span className="font-bold text-muted-foreground block uppercase text-[10px] tracking-wider">Category</span>
            <span className="font-semibold text-foreground">{metadata.category}</span>
          </div>
          <div>
            <span className="font-bold text-muted-foreground block uppercase text-[10px] tracking-wider">Type</span>
            <span className="font-semibold text-foreground">{metadata.courseType}</span>
          </div>
          <div>
            <span className="font-bold text-muted-foreground block uppercase text-[10px] tracking-wider">Session</span>
            <span className="font-semibold text-foreground">{metadata.session} (USN: {metadata.usn})</span>
          </div>
        </div>
        <div className="text-xs border-t pt-4 mt-2 flex flex-col gap-0.5">
          <span className="text-muted-foreground block uppercase text-[10px] tracking-wider font-bold mb-0.5">Course Teacher</span>
          <span className="font-bold text-foreground text-sm leading-none">{metadata.teacher.name}</span>
          <span className="text-muted-foreground text-xs">{metadata.teacher.title}, {metadata.teacher.department}</span>
          <span className="text-muted-foreground text-xs">{metadata.teacher.institution}</span>
        </div>
      </div>
    );
  }

  // Slide Mode: Visual 16:9 Card layout with beautiful accents and gradients
  return (
    <div className="flex flex-col h-full justify-between p-2 select-text">
      <div className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center rounded-md px-3 py-1 text-xs font-bold font-mono tracking-widest border bg-primary/10 text-primary uppercase animate-in fade-in slide-in-from-left duration-500">
          {metadata.courseCode}
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight bg-linear-to-r from-foreground to-muted-foreground/80 bg-clip-text text-transparent">
          {metadata.courseTitle}
        </h1>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest font-mono">
          Course Syllabus & Syllabus Outline
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-b border-border/40 py-6 my-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">Year / Semester</span>
          <span className="text-sm font-bold text-foreground">{metadata.yearSemester}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">Credit Hours</span>
          <span className="text-sm font-bold text-foreground">{metadata.credit} (Core Theory)</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">USN Code</span>
          <span className="text-sm font-mono font-bold text-primary">{metadata.usn}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest font-mono leading-none mb-1">
            Course Teacher
          </span>
          <span className="text-sm font-extrabold text-foreground leading-none">{metadata.teacher.name}</span>
          <span className="text-[10px] text-muted-foreground font-semibold leading-none mt-1">
            {metadata.teacher.title}, {metadata.teacher.department}
          </span>
          <span className="text-[9px] text-muted-foreground/80 font-medium leading-none mt-0.5">
            {metadata.teacher.institution}
          </span>
        </div>
        <div className="flex flex-col sm:text-right">
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest font-mono leading-none mb-1">
            Academic Session
          </span>
          <span className="text-md font-bold text-muted-foreground">{metadata.session}</span>
        </div>
      </div>
    </div>
  );
};
export default CourseOutlineCover;
