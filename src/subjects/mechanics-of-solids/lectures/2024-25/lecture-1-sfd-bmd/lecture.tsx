import * as intro from './slides/section-intro';
import * as internalStress from './slides/section-internal-stress';
import * as signConventions from './slides/section-sign-conventions';
import * as beamLoading from './slides/section-beam-loading';
import * as differentialCalculus from './slides/section-differential-calculus';
import * as methodOfSections from './slides/section-method-of-sections';

export const slides = {
  ...intro.slides,
  ...internalStress.slides,
  ...signConventions.slides,
  ...beamLoading.slides,
  ...differentialCalculus.slides,
  ...methodOfSections.slides,
};

export const slideMetadata = {
  ...intro.sectionMetadata,
  ...internalStress.sectionMetadata,
  ...signConventions.sectionMetadata,
  ...beamLoading.sectionMetadata,
  ...differentialCalculus.sectionMetadata,
  ...methodOfSections.sectionMetadata,
};
