import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';

export const MomentChangeQuizL3: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => {
      const vVal = parameterResolver.resolve(
        { formula: '12.0 + [last digit] * 0.5', resolve: (r) => (12.0 + parameterResolver.getLastDigit(r) * 0.5).toFixed(1) },
        reg
      );
      return (
        <span>
          {"For a segment of span length \\(4.0\\text{ m}\\), if the internal shear force remains constant at \\(V = "}{vVal}{"\\text{ kN}\\), calculate the total change in bending moment (\\(\\Delta M\\)) across this segment in \\(\\text{kNm}\\). Round your final answer to exactly 3 decimal places."}
        </span>
      );
    };
    return Object.assign(qFn, {
      formula: 'For a segment of span length 4.0m, if the internal shear force remains constant at V = (12.0 + [last digit] × 0.5) kN, calculate the total change in bending moment (Delta M) across this segment in kNm. Round your final answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Moment Change Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="mos_2024_lec3_q2"
          questionText={questionText}
          quizType="numeric-input"
          defaultDuration={120}
          defaultBuffer={15}
        />
      </div>
    </FullWidthLayout>
  );
};

export default MomentChangeQuizL3;
