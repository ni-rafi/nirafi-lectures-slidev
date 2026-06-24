import { parameterResolver } from '@/features/quiz/utils/parameterResolver';

export const QUIZ_METADATA = [
  { id: 'qs_2023_lec1_quiz1', header: 'Lec 1 Checkpoint' },
  { id: 'qs_2023_lec4_q1', header: 'Lec 4 Clear Cover Check' },
  { id: 'qs_2023_lec4_q2', header: 'Lec 4 Hooks & Cranks Math' },
  { id: 'qs_2023_lec4_q3', header: 'Lec 4 Stirrup Count check' },
  { id: 'qs_2023_lec4_q4', header: 'Lec 4 Tonnage Math' },
  { id: 'qs_2023_lec5_q1', header: 'Lec 5 Steel Nomenclature' },
  { id: 'qs_2023_lec5_q2', header: 'Lec 5 Base Plate Weight' },
  { id: 'qs_2023_lec5_q3', header: 'Lec 5 Truss Purlin Lines' },
  { id: 'qs_2023_lec5_q4', header: 'Lec 5 Gusset Bounding Box' },
  { id: 'qs_2023_lec6_q1', header: 'Lec 6 Pipe Transitions' },
  { id: 'qs_2023_lec6_q2', header: 'Lec 6 Fixture Packs' },
  { id: 'qs_2023_lec6_q3', header: 'Lec 6 Trench Hydraulics' },
  { id: 'qs_2023_lec6_q4', header: 'Lec 6 Inspection Chambers' }
];

export const QUIZ_ANSWERS: Record<
  string,
  string | ((reg: string) => string) | { formula: string; resolve: (reg: string) => string; digitsRequired?: number }
> = {
  qs_2023_lec1_quiz1: '308',
  
  qs_2023_lec4_q1: {
    formula: '(400 + [last digit] × 10 - 120) mm',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return '(400 + [last digit] × 10 - 120) mm';
      return String(400 + parameterResolver.getLastDigit(reg) * 10 - 120) + ' mm';
    },
  },
  
  qs_2023_lec4_q2: {
    formula: '(4.200 + [last digit] × 0.1) + 0.380 m',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return '(4.200 + [last digit] × 0.1) + 0.380 m';
      return (4.200 + parameterResolver.getLastDigit(reg) * 0.1 + 0.3804).toFixed(3);
    },
  },
  
  qs_2023_lec4_q3: {
    formula: '35 + [last digit]',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return '35 + [last digit]';
      return String(35 + parameterResolver.getLastDigit(reg));
    },
  },
  
  qs_2023_lec4_q4: {
    formula: 'round((15 + [last digit]) × 20.988)',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return 'round((15 + [last digit]) × 20.988)';
      return String(Math.round((15 + parameterResolver.getLastDigit(reg)) * 8.500 * (400 / 162)));
    },
  },
  
  qs_2023_lec5_q1: {
    formula: '2 separate ISA, legs 75mm & 50mm, thickness (6 + [last digit] × 2)mm',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return '2 separate ISA, legs 75mm & 50mm, thickness (6 + [last digit] × 2)mm';
      const thickness = 6 + parameterResolver.getLastDigit(reg) * 2;
      return `2 separate Indian Standard Angles, legs 75mm & 50mm, thickness ${thickness}mm`;
    },
  },
  
  qs_2023_lec5_q2: {
    formula: '(28 + [last digit]) × 2.355',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return '(28 + [last digit]) × 2.355';
      return ((28 + parameterResolver.getLastDigit(reg)) * 2.355).toFixed(3);
    },
  },
  
  qs_2023_lec5_q3: {
    formula: '2 × (floor(5.557 / (1.200 + [last digit] × 0.05)) + 1)',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return '2 × (floor(5.557 / (1.200 + [last digit] × 0.05)) + 1)';
      const spacing = 1.200 + parameterResolver.getLastDigit(reg) * 0.05;
      const rafter = Math.sqrt(4.8 * 4.8 + 2.8 * 2.8);
      return String((Math.floor(rafter / spacing) + 1) * 2);
    },
  },
  
  qs_2023_lec5_q4: {
    formula: '(12 + [last digit]) × 1.236375',
    digitsRequired: 1,
    resolve: (reg) => {
      const digits = reg.replace(/\D/g, '');
      if (digits.length < 1) return '(12 + [last digit]) × 1.236375';
      return ((12 + parameterResolver.getLastDigit(reg)) * 1.236375).toFixed(3);
    },
  },

  qs_2023_lec6_q1: 'Add all vertical transitions: 3.20m (horizontal) + 2.80m (riser) + 1.20m (drop) = 7.20m centerline length',
  qs_2023_lec6_q2: '73200',
  qs_2023_lec6_q3: '0.750',
  qs_2023_lec6_q4: '0.509',
};
