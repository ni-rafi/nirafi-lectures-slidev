import React from 'react';
import { ThankYouLayout } from './ThankYouLayout';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

export interface LectureThankYouProps extends Partial<SlideProps> {
  title?: string;
  subtitle?: string;
}

export const LectureThankYou: React.FC<LectureThankYouProps> = ({ lecture, title, subtitle }) => {
  const resolvedTitle = title || 'Thank You';
  const resolvedSubtitle = subtitle || (lecture ? `Questions on ${lecture.title}?` : 'Do you have any question?');

  return (
    <ThankYouLayout
      title={resolvedTitle}
      subtitle={resolvedSubtitle}
    />
  );
};

export default LectureThankYou;
