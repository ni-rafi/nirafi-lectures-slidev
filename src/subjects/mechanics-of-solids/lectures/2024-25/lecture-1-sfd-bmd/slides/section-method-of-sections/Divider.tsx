import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';

export const Divider: React.FC<SlideProps> = (props) => (
  <TopicDividerLayout
    {...props}
    topicNumber="Topic 04"
    title="Analytical Calculations: The Method of Sections"
    subtitle="Surfacing internal equations V(x) and M(x) by executing virtual cuts"
  />
);
