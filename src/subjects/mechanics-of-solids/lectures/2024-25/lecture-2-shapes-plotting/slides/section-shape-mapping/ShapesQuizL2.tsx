import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';
import { LatexFormula } from '@/features/presentation/components/elements';

export const ShapesQuizL2: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => {
      const vVal = parameterResolver.resolve(
        { formula: '12.0 + [last digit] * 0.5', resolve: (r) => (12.0 + parameterResolver.getLastDigit(r) * 0.5).toFixed(1) },
        reg
      );
      return (
        <span>
          Using the integral relation <LatexFormula math="\Delta M = \int V(x) \, dx" />, calculate the bending moment change <LatexFormula math="\Delta M" /> (kNm) between <LatexFormula math="x = 0" /> and <LatexFormula math="x = 5\text{ m}" /> if the shear force is constant at <LatexFormula math={`V = ${vVal}\\text{ kN}`} />. Round your final answer to exactly 3 decimal places.
        </span>
      );
    };
    return Object.assign(qFn, {
      formula: 'Using the integral relation ΔM = ∫ V(x) dx, calculate the bending moment change ΔM (kNm) between x = 0 and x = 5 m if the shear force is constant at V = (12.0 + [last digit] × 0.5) kN. Round your final answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Area-Moment Relations Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="mos_2024_lec2_q3"
          questionText={questionText}
          quizType="numeric-input"
          defaultDuration={120}
          defaultBuffer={10}
        />
      </div>
    </FullWidthLayout>
  );
};

export default ShapesQuizL2;
