import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import { LectureCover } from '@/shared/layouts/LectureCover';

export const CoverSlideL3: React.FC<SlideProps> = (props) => (
  <LectureCover {...props} />
);

export default CoverSlideL3;
