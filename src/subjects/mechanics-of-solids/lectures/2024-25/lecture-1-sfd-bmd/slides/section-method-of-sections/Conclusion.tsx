import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { LectureThankYou } from '@/shared/layouts/LectureThankYou';

export const Conclusion: React.FC<SlideProps> = (props) => (
  <LectureThankYou
    {...props}
    subtitle="Questions on Course Syllabus & Loading Matrix?"
  />
);
