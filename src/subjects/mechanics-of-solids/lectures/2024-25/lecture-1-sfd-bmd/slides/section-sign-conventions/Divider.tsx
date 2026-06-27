import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';

export const Divider: React.FC<SlideProps> = (props) => (
  <TopicDividerLayout
    {...props}
    topicNumber="Topic 03"
    title="Sign Conventions & Loading Scenarios"
    subtitle="Mathematical conventions for shear and bending moment across isolated segments"
  />
);
