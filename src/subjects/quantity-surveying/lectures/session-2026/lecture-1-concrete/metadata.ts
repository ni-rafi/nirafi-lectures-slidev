import type { Lecture } from '@/config/lectures';

export const metadata: Lecture = {
  id: 'concrete',
  title: 'Concrete Volumetric Estimations',
  description: 'Estimate concrete volume with wastage factors for beams, columns, and slabs.',
  slideNo: 5,
  durationMins: 45,
  locked: false,
  tags: ['concrete', 'volumetric', 'SI units'],
  quizzes: {
    'qs_2026_lec1_quiz1': 'stealth',
  },
};
