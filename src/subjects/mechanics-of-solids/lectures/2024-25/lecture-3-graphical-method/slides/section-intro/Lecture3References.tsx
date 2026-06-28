import React from 'react';
import { ReferencesLayout, type ReferenceBook } from '@/shared/layouts/ReferencesLayout';

export const Lecture3References: React.FC = () => {
  const references: ReferenceBook[] = [
    {
      title: 'Strength of Materials',
      edition: '4th edition',
      authors: 'Andrew Pytel and Ferdinand Leon Singer',
      sections: ['4-4', '4-5']
    },
    {
      title: 'Strength of Materials',
      edition: 'Multicolour Edition (2008)',
      authors: 'R.S. Khurmi',
      sections: ['13.10-13.18']
    }
  ];

  return (
    <ReferencesLayout
      title="References"
      references={references}
      instruction="Refer to these textbooks and sections to study graphical shear-moment transformations."
    />
  );
};

export default Lecture3References;
