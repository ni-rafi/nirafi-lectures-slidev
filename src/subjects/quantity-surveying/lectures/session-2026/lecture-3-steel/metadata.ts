import type { Lecture } from '@/config/lectures';

export const metadata: Lecture = {
  id: 'steel',
  title: 'Steel Reinforcement Estimations',
  description: 'Calculate weight of reinforcement bar steel using standard diameter equations.',
  slideNo: 13,
  durationMins: 35,
  locked: false,
  tags: ['steel', 'reinforcement', 'rebar'],
  quizzes: {
    'qs_2026_lec3_quiz1': 'stealth',
  },
};
