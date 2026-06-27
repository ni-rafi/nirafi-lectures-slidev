import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';
import { LatexFormula } from '@/features/presentation/components/elements';

export const ZeroShearQuizL2: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => {
      const raVal = parameterResolver.resolve(
        { formula: '12.0 + [last digit] * 0.5', resolve: (r) => (12.0 + parameterResolver.getLastDigit(r) * 0.5).toFixed(1) },
        reg
      );
      return (
        <span>
          If the support reaction changes to <LatexFormula math={`R_{Ay} = ${raVal}\\text{ kN}`} />, find the distance <LatexFormula math="x" /> (meters) from the left support where the shear force <LatexFormula math="V(x)" /> is exactly zero. (Assume <LatexFormula math="V(x) = R_{Ay} - 3(x - 5) = 0" />). Round your final answer to exactly 3 decimal places.
        </span>
      );
    };
    return Object.assign(qFn, {
      formula: 'If the support reaction changes to R_Ay = (12.0 + [last digit] × 0.5) kN, find the distance x (meters) from the left support where the shear force V(x) is exactly zero. (Assume V(x) = R_Ay - 3(x - 5) = 0). Round your final answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Zero Shear Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="mos_2024_lec2_q4"
          questionText={questionText}
          quizType="numeric-input"
          defaultDuration={120}
          defaultBuffer={10}
        />
      </div>
    </FullWidthLayout>
  );
};

export default ZeroShearQuizL2;
