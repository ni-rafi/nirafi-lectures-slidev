import { parameterResolver } from '@/features/quiz/utils/parameterResolver';

export const QUIZ_METADATA = [
  { id: 'mos_2024_lec2_q1', header: 'Lec 2 Checkpoint 1 (Reactions)' },
  { id: 'mos_2024_lec2_q2', header: 'Lec 2 Checkpoint 2 (Method of Sections)' },
  { id: 'mos_2024_lec2_q3', header: 'Lec 2 Checkpoint 3 (Moment Change)' },
  { id: 'mos_2024_lec2_q4', header: 'Lec 2 Checkpoint 4 (Zero Shear)' }
];

export const QUIZ_ANSWERS: Record<
  string,
  string | ((reg: string) => string) | { formula: string; resolve: (reg: string) => string; digitsRequired?: number }
> = {
  mos_2024_lec2_q1: {
    formula: 'R_By = (178.5 + 17 * P) / 20 kN, where P = 10.0 + [last digit] * 0.5',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return 'P = 10.0 + [last digit] * 0.5';
      const d = parameterResolver.getLastDigit(reg);
      const P = 10.0 + d * 0.5;
      return (8.925 + 0.85 * P).toFixed(3);
    }
  },

  mos_2024_lec2_q2: 'Linear Shear and Quadratic Bending Moment',

  mos_2024_lec2_q3: {
    formula: 'Delta M = V * 5 kNm, where V = 12.0 + [last digit] * 0.5',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return 'V = 12.0 + [last digit] * 0.5';
      const d = parameterResolver.getLastDigit(reg);
      const V = 12.0 + d * 0.5;
      return (V * 5).toFixed(3);
    }
  },

  mos_2024_lec2_q4: {
    formula: 'x = 5 + R_Ay / 3 m, where R_Ay = 12.0 + [last digit] * 0.5',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return 'R_Ay = 12.0 + [last digit] * 0.5';
      const d = parameterResolver.getLastDigit(reg);
      const Ra = 12.0 + d * 0.5;
      return (5 + Ra / 3).toFixed(3);
    }
  }
};
