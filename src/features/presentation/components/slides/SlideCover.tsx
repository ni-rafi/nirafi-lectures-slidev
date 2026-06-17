import React from 'react';
import type { Subject, Lecture, Session } from '@/config/lectures';

interface SlideCoverProps {
  subject: Subject;
  lecture: Lecture;
  session?: Session;
}

export const SlideCover: React.FC<SlideCoverProps> = ({ subject, lecture, session }) => {
  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <span className="text-[10px] tracking-widest text-primary uppercase font-mono font-bold">
        {subject.code} Lecture Series
      </span>
      <h2 className="text-3xl font-extrabold tracking-tight max-w-2xl text-foreground">
        {lecture.title}
      </h2>
      <p className="text-xs text-muted-foreground/90 max-w-md mx-auto">
        {lecture.description}
      </p>
      <div className="mt-4 text-[10px] font-semibold text-muted-foreground font-mono">
        Session: {session?.label}
      </div>
    </div>
  );
};

export default SlideCover;
