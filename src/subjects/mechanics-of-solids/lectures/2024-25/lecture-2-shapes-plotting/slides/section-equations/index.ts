import { Interval1L2 } from './Interval1L2';
import { Interval2L2 } from './Interval2L2';
import { Interval3L2 } from './Interval3L2';
import { Interval4L2 } from './Interval4L2';
import { SectionsQuizL2 } from './SectionsQuizL2';

export const slides = {
  8: Interval1L2,
  9: Interval2L2,
  10: Interval3L2,
  11: Interval4L2,
  12: SectionsQuizL2,
};

export const sectionMetadata = {
  8: { title: 'Section Method - Interval 1 (0 <= x <= 5 m)', type: 'Concept Details', section: 'Segment Equations' },
  9: { title: 'Section Method - Interval 2 (5 <= x <= 12 m)', type: 'Concept Details', section: 'Segment Equations' },
  10: { title: 'Section Method - Interval 3 (12 <= x <= 17 m)', type: 'Concept Details', section: 'Segment Equations' },
  11: { title: 'Section Method - Interval 4 (17 <= x <= 20 m)', type: 'Concept Details', section: 'Segment Equations' },
  12: { title: 'Checkpoint 2: Segment Relations Quiz', type: 'Concept Details', section: 'Segment Equations' },
};
