import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { QuizCardOrchestrator } from '@/features/quiz';
import { parameterResolver } from '@/features/quiz/utils/parameterResolver';

export const ZeroShearQuizL3: React.FC = () => {
  const questionText = React.useMemo(() => {
    const qFn = (reg: string) => {
      const v1Val = parameterResolver.resolve(
        { formula: '15.0 + [last digit] * 0.5', resolve: (r) => (15.0 + parameterResolver.getLastDigit(r) * 0.5).toFixed(1) },
        reg
      );
      return (
        <span>
          {"For a UDL segment of total span \\(7.0\\text{ m}\\), if the starting positive shear force is \\(V_1 = "}{v1Val}{"\\text{ kN}\\) and the ending negative shear force is \\(V_2 = 7.0\\text{ kN}\\), calculate the zero-shear crossing distance \\(x\\) from the starting boundary in meters. Round your final answer to exactly 3 decimal places."}
        </span>
      );
    };
    return Object.assign(qFn, {
      formula: 'For a UDL segment of total span 7.0m, if the starting positive shear force is V1 = (15.0 + [last digit] × 0.5) kN and the ending negative shear force is V2 = 7.0 kN, calculate the zero-shear crossing distance x from the starting boundary in meters. Round your final answer to exactly 3 decimal places.'
    });
  }, []);

  return (
    <FullWidthLayout title="Zero-Shear Crossing Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="mos_2024_lec3_q3"
          questionText={questionText}
          quizType="numeric-input"
          defaultDuration={120}
          defaultBuffer={20}
        />
      </div>
    </FullWidthLayout>
  );
};

export default ZeroShearQuizL3;
