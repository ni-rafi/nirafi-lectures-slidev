import { Divider } from './Divider';
import { ShearSignConvention } from './ShearSignConvention';
import { BendingMomentSignConvention } from './BendingMomentSignConvention';

export const slides = {
  11: Divider,
  12: ShearSignConvention,
  13: BendingMomentSignConvention,
};

export const sectionMetadata = {
  11: { title: 'Sign Conventions Divider', type: 'Cover Slide', section: 'Sign Conventions' },
  12: { title: 'The Shear Force Sign Convention', type: 'Live Sandbox', section: 'Sign Conventions' },
  13: { title: 'Bending Moment Sign Convention', type: 'Concept Details', section: 'Sign Conventions' },
};
