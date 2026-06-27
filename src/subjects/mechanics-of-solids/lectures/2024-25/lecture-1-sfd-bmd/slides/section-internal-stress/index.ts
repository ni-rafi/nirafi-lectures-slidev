import { Divider } from './Divider';
import { SectioningInternalForces } from './SectioningInternalForces';
import { AnatomyOfInternalForces } from './AnatomyOfInternalForces';
import { BeamBendingSimplySupported } from './BeamBendingSimplySupported';
import { BeamBendingCantilever } from './BeamBendingCantilever';
import { ShearMechanicsSimplySupported } from './ShearMechanicsSimplySupported';
import { ShearMechanicsCantilever } from './ShearMechanicsCantilever';

export const slides = {
  4: Divider,
  5: SectioningInternalForces,
  6: AnatomyOfInternalForces,
  7: BeamBendingSimplySupported,
  8: BeamBendingCantilever,
  9: ShearMechanicsSimplySupported,
  10: ShearMechanicsCantilever,
};

export const sectionMetadata = {
  4: { title: 'Internal Forces & Structural Intuition', type: 'Cover Slide', section: 'Internal Stress' },
  5: { title: 'Sectioning & Internal Forces Expose', type: 'Concept Details', section: 'Internal Stress' },
  6: { title: 'The Anatomy of Internal Forces', type: 'Concept Details', section: 'Internal Stress' },
  7: { title: 'Bending Mechanics - Simply Supported Flexion', type: 'Concept Details', section: 'Internal Stress' },
  8: { title: 'Bending Mechanics - Cantilever Bending', type: 'Concept Details', section: 'Internal Stress' },
  9: { title: 'Shear Mechanics - Simply Supported Shear', type: 'Concept Details', section: 'Internal Stress' },
  10: { title: 'Shear Mechanics - Cantilever Shear', type: 'Concept Details', section: 'Internal Stress' },
};
