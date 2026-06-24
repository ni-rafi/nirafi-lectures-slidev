import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
} from './slides/AbstractMarkupsSlides';
import {
  Slide6,
  Slide7,
  Slide8,
  Slide9,
} from './slides/InterimBillingSlides';
import {
  Slide10,
  Slide11,
  Slide12,
  Slide13,
} from './slides/ProjectDefenseAndFinalAccountability(Viva)';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
  5: Slide5,
  6: Slide6,
  7: Slide7,
  8: Slide8,
  9: Slide9,
  10: Slide10,
  11: Slide11,
  12: Slide12,
  13: Slide13,
};

export const slideMetadata: Record<
  number,
  import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata
> = {
  1: { title: 'Project Budgeting & Progress Payments', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Abstract of Costs Ledger Assembly', type: 'Concept Details', section: 'Budget Compilation' },
  3: { title: 'Contractual Additions & Profit Allocations', type: 'Concept Details', section: 'Budget Compilation' },
  4: { title: 'Statutory Deductions: NBR Split Matrix', type: 'Concept Details', section: 'Budget Compilation' },
  5: { title: 'Interim Progress Payments', type: 'Cover Slide', section: 'Progress Payments' },
  6: { title: 'The Measurement Book Progress Abstract', type: 'Concept Details', section: 'Progress Payments' },
  7: { title: 'Payment Deductions: Retainage & Advance Recovery', type: 'Concept Details', section: 'Progress Payments' },
  8: { title: 'Progressive IPC Invoice Sandbox', type: 'Live Sandbox', section: 'Progress Payments' },
  9: { title: 'Project Defense & Final Accountability', type: 'Cover Slide', section: 'Project Defense' },
  10: { title: 'Evaluating Project Budget Variance', type: 'Concept Details', section: 'Project Defense' },
  11: { title: 'The Final Technical Viva Voce', type: 'Concept Details', section: 'Project Defense' },
  12: { title: 'Progressive IPC Checkpoint Quiz', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec10_q1' },
  13: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
