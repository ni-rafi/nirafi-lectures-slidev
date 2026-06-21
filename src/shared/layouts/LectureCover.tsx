import React from 'react';
import { TitleV2Layout } from './TitleV2Layout';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

export const LectureCover: React.FC<SlideProps> = ({ subject, lecture, session }) => {
  return (
    <TitleV2Layout
      courseCode={subject.courseCode}
      courseTitle={subject.courseTitle}
      subtitle={lecture.title}
      yearSemester={subject.yearSemester || ''}
      creditHours={subject.creditHours || ''}
      usnCode={session?.usnCode || ''}
      session={session?.session || ''}
      lectureNumber={lecture.lectureNumber}
    />
  );
};

export default LectureCover;
