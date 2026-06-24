import type { Lecture } from '@/config/lectures';

export const metadata: Lecture = {
  id: 'roadway-earthwork',
  title: 'Estimation of Roadway: Earthwork',
  description: 'Road cross-sectional area calculations, longitudinal profiles, soil bulking vs. compaction shrinkage volumetrics, haulage lead/lift rules, and PWD scheduling forms.',
  slideNo: 1,
  durationMins: 45,
  locked: false,
  tags: ['roadway', 'earthwork', 'lead-lift', 'bulking-shrinkage', 'pwd-rates'],
  lectureNumber: 8,
  quizzes: {
    qs_2023_lec8_q1: 'stealth',
    qs_2023_lec8_q2: 'stealth'
  }
};
