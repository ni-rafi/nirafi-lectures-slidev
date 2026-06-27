import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';
import { LatexFormula } from '@/features/presentation/components/elements';

export const ReactionsQuizL2: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => {
      const pVal = parameterResolver.resolve(
        { formula: '10.0 + [last digit] * 0.5', resolve: (r) => (10.0 + parameterResolver.getLastDigit(r) * 0.5).toFixed(1) },
        reg
      );
      return (
        <span>
          For our simply supported beam of total span 20m, if the point load at x = 17m changes to <LatexFormula math={`P = ${pVal}\\text{ kN}`} />, calculate the vertical reaction at support B (<LatexFormula math="R_{By}" />) in kN. Round your final answer to exactly 3 decimal places.
        </span>
      );
    };
    return Object.assign(qFn, {
      formula: 'For our simply supported beam of total span 20m, if the point load at x = 17m changes to P = (10.0 + [last digit] × 0.5) kN, calculate the vertical reaction at support B (R_By) in kN. Round your final answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Support Reactions Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="mos_2024_lec2_q1"
          questionText={questionText}
          quizType="numeric-input"
          defaultDuration={120}
          defaultBuffer={10}
        />
      </div>
    </FullWidthLayout>
  );
};

export default ReactionsQuizL2;
