import { serializeSections } from '@/features/presentation/utils/serializeSections';
import * as intro from './slides/section-intro';
import * as calculus from './slides/section-calculus';
import * as relations from './slides/section-relations';
import * as problem3 from './slides/section-problem3';
import * as summary from './slides/section-summary';

const serialized = serializeSections([
  intro,
  calculus,
  relations,
  problem3,
  summary,
]);

export const slides = serialized.slides;
export const slideMetadata = serialized.slideMetadata;
